/*
 * cmo-engine.ts — non-UI core for Creators Market optimizer (geometry+BFS+wait/hazard+scheduling skeleton)
 * Prefix all exported classes/types with CMO to avoid collisions with existing site code.
 *
 * Key features implemented:
 * - Corridor/booth geometry with widened booths per row and per-day booth pool support
 * - Integer-grid BFS along corridors only (no cutting through booths)
 * - Booth access-point candidates (left/right corridor × (col, col+width))
 * - Travel-time computation (meters→minutes)
 * - Show-aware crowd model: f_wait(t), f_hazard(t), expected wait, sellout-deadline via numeric integration
 * - Simple schedule validator/building block (arrive/service/leave), plus hooks for heuristic insertion/LNS (to be added)
 */

// -----------------------------
// Types & constants
// -----------------------------

export type CMOBoothId = `${"A"|"B"|"C"|"D"|"E"|"F"}-${number}`
export type CMORow = "A"|"B"|"C"|"D"|"E"|"F"

export interface CMOBooth {
  id: CMOBoothId
  row: CMORow
  col: number // label index (1..17; note F-17 is invalid)
  width?: 1|2 // along +y (default 1)
  open: number // minutes since 10:00
  close: number // minutes since 10:00
  must?: boolean
  u: number // popularity percentile in (0,1)
  // Optional metadata
  dates?: string[] // e.g., ["8/29(금)", "8/30(토)", "8/31(일)"]
}

export interface CMOParams {
  gridScaleM: number
  walkSpeedMps: number
  baseMin: number
  beta: number
  gamma: number
  lambda0: number // hazard base per minute
  riskTol: number // e.g., 0.05
  show: CMOShow
  crowd: CMOCrowd
}

export interface CMOShow { open: number; start: number; end: number; close: number }
export interface CMOCrowd {
  w_morning: number; w_pre: number; w_show: number; w_after_amp: number; w_tau: number;
  h_morning: number; h_pre: number; h_show: number; h_after_amp: number; h_tau: number;
  tail_amp: number; tail_t50: number; tail_k: number;
}

export interface CMOItinLeg {
  from: CMOBoothId|"S"|"E"
  to: CMOBoothId|"S"|"E"
  distSteps: number
  travelMin: number
  startMin: number // depart time from 'from'
  arriveMin: number // reach 'to' access point time
}

export interface CMOVisit {
  id: CMOBoothId
  arriveMin: number
  waitMin: number
  serviceMin: number
  leaveMin: number
}

export interface CMOScheduleResult {
  legs: CMOItinLeg[]
  visits: CMOVisit[]
  totalTravelMin: number
  totalServiceMin: number
  feasible: boolean
  reasonIfInfeasible?: string
}

// Fixed corridor X-lines and row-to-X mapping per spec
export const CMO_CORRIDOR_XS = [0, 3, 6, 9] as const
export const CMO_ROW_X: Record<CMORow, number> = { A:1, B:2, C:4, D:5, E:7, F:8 }

// Known widened booths per row from spec (width:2)
export const CMO_WIDE_COLS: Record<CMORow, Set<number>> = {
  A: new Set([4]),
  B: new Set([11]),
  C: new Set([2, 9]),
  D: new Set([4]),
  E: new Set([]),
  F: new Set([]),
}

// F-17 does not exist
export const CMO_INVALID: Set<CMOBoothId> = new Set(["F-17" as CMOBoothId])

// -----------------------------
// Geometry & access points
// -----------------------------

type XY = { x:number; y:number }

type CMOAccessPoint = XY & { kind: "L0"|"L1"|"R0"|"R1" } // L/R corridor × (col, col+width)

export class CMOGeometry {
  // maximum Y of corridor grid is 17 plus widest row expansion
  readonly yMax: number

  constructor(
    public wideCols: Record<CMORow, Set<number>> = CMO_WIDE_COLS,
  ){
    // compute max y across rows (17 + number of wide cols for that row)
    this.yMax = 17 + Math.max(
      ...(["A","B","C","D","E","F"] as CMORow[]).map(r => this.wideCols[r].size)
    )
  }

  static isValidBoothId(id: string): id is CMOBoothId {
    return /^[A-F]-([1-9]|1[0-7])$/.test(id) && !CMO_INVALID.has(id as CMOBoothId)
  }

  /** row letter to x (booth line); corridors are adjacent at left/right X */
  rowToX(row: CMORow): number { return CMO_ROW_X[row] }
  leftCorridorX(row: CMORow): number { const x = this.rowToX(row); return x<=2 ? 0 : (x<=5 ? 3 : 6) }
  rightCorridorX(row: CMORow): number { const x = this.rowToX(row); return x<=2 ? 3 : (x<=5 ? 6 : 9) }

  /**
   * Map (row, col, width) → starting Y on the global corridor grid.
   * Rule: yStart = col + (number of width-2 booths with col'<col in the SAME row)
   * A width-2 booth spans yStart .. yStart+1 (inclusive).
   */
  colToYStart(row: CMORow, col: number): number {
    const wset = this.wideCols[row]
    let shift = 0
    // count strictly smaller cols that are wide in this row
    wset.forEach(c => { if (c < col) shift += 1 })
    return col + shift
  }

  boothRect(b: Pick<CMOBooth, "row"|"col"|"width">): { x:number; y0:number; y1:number } {
    const y0 = this.colToYStart(b.row, b.col)
    const w = b.width ?? (this.wideCols[b.row].has(b.col) ? 2 : 1)
    const y1 = y0 + (w-1)
    return { x: this.rowToX(b.row), y0, y1 }
  }

  /** Four access-point candidates on corridors adjacent to booth rectangle */
  boothAccessPoints(b: Pick<CMOBooth, "row"|"col"|"width">): CMOAccessPoint[] {
    const { y0, y1 } = this.boothRect(b)
    const L = this.leftCorridorX(b.row)
    const R = this.rightCorridorX(b.row)
    return [
      { x:L, y:y0, kind:"L0" },
      { x:L, y:y1, kind:"L1" },
      { x:R, y:y0, kind:"R0" },
      { x:R, y:y1, kind:"R1" },
    ]
  }

  /** Entrance (F-1 below) and Exit (A-16 right) in corridor coords */
  entrance(): XY { return { x: 8, y: 0 } } // (8,0)
  exit(): XY { return { x: 9, y: this.colToYStart("A", 16) } } // (9,16→shifted if needed)
}

// -----------------------------
// Corridor graph & BFS pathfinding (grid steps)
// -----------------------------

class CMOGridGraph {
  // Represent passable integer nodes: vertical corridors at x∈{0,3,6,9} with y∈[0..yMax],
  // plus the full horizontal floor corridor at y=0 for x∈[0..9].
  private key(x:number,y:number){ return `${x},${y}` }
  readonly nodes: Set<string> = new Set()
  readonly yMax: number

  constructor(yMax: number){
    this.yMax = yMax
    // vertical corridors
    for (const x of CMO_CORRIDOR_XS){
      for(let y=0;y<=yMax;y++) this.nodes.add(this.key(x,y))
    }
    // horizontal walkway bottom (y=0) for all x 0..9
    for(let x=0;x<=9;x++) this.nodes.add(this.key(x,0))
  }

  has(x:number,y:number){ return this.nodes.has(this.key(x,y)) }

  neighbors(x:number,y:number): XY[] {
    const nbr: XY[] = []
    const tryPush=(xx:number,yy:number)=>{ if(this.has(xx,yy)) nbr.push({x:xx,y:yy}) }
    // 4-neighborhood on passable set
    tryPush(x+1,y); tryPush(x-1,y); tryPush(x,y+1); tryPush(x,y-1)
    return nbr
  }
}

export class CMOPathFinder {
  private graph: CMOGridGraph
  constructor(public geom: CMOGeometry){
    this.graph = new CMOGridGraph(geom.yMax)
  }

  /** BFS shortest path (in grid steps) along corridors */
  shortestSteps(a: XY, b: XY): { steps:number; path: XY[] }{
    const g = this.graph
    const key = (p:XY)=>`${p.x},${p.y}`
    const q: XY[] = []
    const prev = new Map<string, XY|null>()
    const seen = new Set<string>()
    const startKey = key(a)
    if(!g.has(a.x,a.y)) throw new Error(`Start not on corridor: (${a.x},${a.y})`)
    if(!g.has(b.x,b.y)) throw new Error(`End not on corridor: (${b.x},${b.y})`)

    q.push(a); prev.set(startKey, null); seen.add(startKey)
    while(q.length){
      const u = q.shift()!
      if(u.x===b.x && u.y===b.y) break
      for(const v of g.neighbors(u.x,u.y)){
        const vk = key(v); if(seen.has(vk)) continue
        seen.add(vk); prev.set(vk, u); q.push(v)
      }
    }

    const endKey = key(b)
    if(!prev.has(endKey)) return { steps: Infinity, path: [] }

    const path: XY[] = []
    for(let cur: XY|null = b; cur!=null; cur = prev.get(key(cur)) ?? null){ path.push(cur) }
    path.reverse()
    return { steps: path.length>0 ? path.length-1 : 0, path }
  }
}

// -----------------------------
// Travel-time between booths (via best access points)
// -----------------------------

export class CMOTravel {
  constructor(public geom: CMOGeometry, public pf: CMOPathFinder, public params: CMOParams){}

  /** meters per grid step */
  metersPerStep(): number { return this.params.gridScaleM }
  minutesForSteps(steps:number): number {
    const m = steps * this.metersPerStep()
    return m / this.params.walkSpeedMps / 60
  }

  boothAccess(b: CMOBooth): CMOAccessPoint[]{ return this.geom.boothAccessPoints(b) }

  /** Best corridor-to-corridor path from access set A to access set B */
  bestAccessPath(aSet: XY[], bSet: XY[]): { steps:number; from:XY; to:XY }{
    let best = { steps: Infinity, from: aSet[0], to: bSet[0] }
    for(const a of aSet){ for(const b of bSet){
      const r = this.pf.shortestSteps(a,b)
      if(r.steps < best.steps) best = { steps: r.steps, from:a, to:b }
    }}
    return best
  }

  /** From special nodes S/E or booth → access points */
  nodeAccess(node: CMOBooth|"S"|"E"): XY[]{
    if(node === "S") return [ this.geom.entrance() ]
    if(node === "E") return [ this.geom.exit() ]
    return this.boothAccess(node)
  }

  /** Travel time (minutes) & steps between any two nodes */
  travel(a: CMOBooth|"S"|"E", b: CMOBooth|"S"|"E"): { steps:number; travelMin:number }{
    const P = this.bestAccessPath(this.nodeAccess(a), this.nodeAccess(b))
    return { steps: P.steps, travelMin: this.minutesForSteps(P.steps) }
  }
}

// -----------------------------
// Crowd/Wait/Hazard model and sellout deadline
// -----------------------------

export class CMOShowCrowdModel {
  constructor(public params: CMOParams){}
  private lerp(a:number,b:number,t:number){ return a + (b-a)*t }
  private clamp01(x:number){ return Math.max(0, Math.min(1,x)) }

  f_wait(t:number): number {
    const { open, start, end } = this.params.show
    const { w_morning, w_pre, w_show, w_after_amp, w_tau } = this.params.crowd
    if(t < 60) return w_morning // 10:00-11:00
    if(t < 120) { // 11:00-12:00 linear down
      const u = (t-60)/60
      return this.lerp(w_morning, w_pre, u)
    }
    if(t < 240) return w_show // 12:00-14:00 very relaxed
    // after-show spike decays
    const decay = Math.exp(-(t-240)/w_tau)
    return 1 + w_after_amp * decay
  }

  f_hazard(t:number): number {
    const { h_morning, h_pre, h_show, h_after_amp, h_tau, tail_amp, tail_t50, tail_k } = this.params.crowd
    let base: number
    if(t < 60) base = h_morning
    else if(t < 120) base = this.lerp(h_morning, h_pre, (t-60)/60)
    else if(t < 240) base = h_show
    else base = 1 + h_after_amp * Math.exp(-(t-240)/h_tau)
    const tail = 1 + tail_amp / (1 + Math.exp(-(t - tail_t50)/tail_k))
    return base * tail
  }

  expectedWaitMin(u:number, t:number): number {
    return this.params.baseMin * Math.exp(this.params.beta * u) * this.f_wait(t)
  }

  hazardPerMin(u:number, t:number): number {
    return this.params.lambda0 * Math.exp(this.params.gamma * u) * this.f_hazard(t)
  }

  /** Sellout deadline d s.t. ∫_{open}^{d} h(u,s) ds >= -ln(1-riskTol); returns min(d, close). */
  selloutDeadline(open:number, close:number, u:number): number {
    const target = -Math.log(1 - this.params.riskTol)
    let t = open, cum = 0
    const step = 1 // 1-minute trapezoidal
    while(t < close){
      const h0 = this.hazardPerMin(u, t)
      const h1 = this.hazardPerMin(u, t+step)
      cum += 0.5 * (h0 + h1) * step
      if(cum >= target){
        // refine with bisection within [t, t+1]
        let lo=t, hi=t+step
        for(let k=0;k<12;k++){
          const mid = 0.5*(lo+hi)
          // recompute cumulative from open to mid (cheap incremental via rectangle approx)
          // For simplicity: secant refinement using average hazard in [t,mid]
          const frac = (mid - t) / step
          const add = 0.5 * (h0 + (h0 + frac*(h1-h0))) * (mid - t)
          const cur = cum - (0.5*(h0+h1)*step) + add
          if(cur >= target) hi = mid; else lo = mid
        }
        t = 0.5*(lo+hi)
        return Math.min(t, close)
      }
      t += step
    }
    return close
  }
}

// -----------------------------
// Schedule building block (feasibility & times)
// -----------------------------

export class CMOSchedulerCore {
  constructor(public geom: CMOGeometry, public travel: CMOTravel, public model: CMOShowCrowdModel){}

  /** Compute service duration proxy (we treat service as same as expected wait for now; extend if needed) */
  serviceMin(u:number, t:number): number { return this.model.expectedWaitMin(u, t) }

  /** Build schedule for a fixed ordered route: S -> route -> E. */
  scheduleFixed(route: CMOBooth[], dayFilter?: (b:CMOBooth)=>boolean): CMOScheduleResult {
    const active = dayFilter ? route.filter(dayFilter) : route.slice()
    // Validate booth ids
    for(const b of active){ if(!CMOGeometry.isValidBoothId(b.id)) return { legs:[], visits:[], totalTravelMin:0, totalServiceMin:0, feasible:false, reasonIfInfeasible:`Invalid booth id ${b.id}` } }

    const legs: CMOItinLeg[] = []
    const visits: CMOVisit[] = []

    let t = 0 // start at 10:00
    let cur: CMOBooth|"S" = "S"
    let totalTravelMin = 0, totalServiceMin = 0

    const pushLeg=(to: CMOBooth|"E"): CMOItinLeg => {
      const r = this.travel.travel(cur, to)
      const leg: CMOItinLeg = {
        from: (cur==="S"?"S":cur.id), to: (to==="E"?"E":to.id),
        distSteps: r.steps, travelMin: r.travelMin, startMin: t, arriveMin: t + r.travelMin,
      }
      t += r.travelMin; totalTravelMin += r.travelMin
      legs.push(leg); return leg
    }

    // Traverse booths
    for(const b of active){
      // travel to booth
      pushLeg(b)
      // wait for open if arriving earlier
      if(t < b.open) t = b.open
      // sellout deadline
      const d = this.model.selloutDeadline(b.open, b.close, b.u)
      if(t > d){
        return { legs, visits, totalTravelMin, totalServiceMin, feasible:false, reasonIfInfeasible:`Missed sellout deadline at ${b.id} (arrive ${t.toFixed(1)} > d ${d.toFixed(1)})` }
      }
      // expected wait/service
      const wait = this.model.expectedWaitMin(b.u, t)
      const svc = this.serviceMin(b.u, t)
      const leave = t + wait + svc
      visits.push({ id: b.id, arriveMin: t, waitMin: wait, serviceMin: svc, leaveMin: leave })
      t = leave; totalServiceMin += (wait + svc)
      cur = b
    }

    // go to exit
    pushLeg("E")

    return { legs, visits, totalTravelMin, totalServiceMin, feasible:true }
  }
}

// -----------------------------
// Utilities for day-based booth pools
// -----------------------------

export class CMODayPools {
  /** Return predicate to filter booths active on a given label (exact match). */
  static filterByDateLabel(label: string){
    return (b: CMOBooth) => Array.isArray(b.dates) && b.dates.some(d => d === label)
  }
  /** Build per-day pools from master list, given the three labels. */
  static poolsByLabels(booths: CMOBooth[], labels: string[]): Record<string, CMOBooth[]>{
    const out: Record<string, CMOBooth[]> = {}
    for(const L of labels){ out[L] = booths.filter(this.filterByDateLabel(L)) }
    return out
  }
}

// -----------------------------
// Example parameter preset (matches spec defaults)
// -----------------------------

export const CMO_DEFAULT_PARAMS: CMOParams = {
  gridScaleM: 2.0,
  walkSpeedMps: 1.3,
  baseMin: 2.8,
  beta: 1.6,
  gamma: 1.2,
  lambda0: 0.02,
  riskTol: 0.05,
  show: { open:60, start:120, end:240, close:360 },
  crowd: {
    w_morning:1.8, w_pre:1.3, w_show:0.55, w_after_amp:1.1, w_tau:40,
    h_morning:1.6, h_pre:1.15, h_show:0.45, h_after_amp:1.6, h_tau:45,
    tail_amp:0.6, tail_t50:315, tail_k:18,
  },
}

// -----------------------------
// Helper: build CM core bundle
// -----------------------------

export function CMO_buildCore(params: CMOParams = CMO_DEFAULT_PARAMS){
  const geom = new CMOGeometry()
  const pf = new CMOPathFinder(geom)
  const travel = new CMOTravel(geom, pf, params)
  const model = new CMOShowCrowdModel(params)
  const sched = new CMOSchedulerCore(geom, travel, model)
  return { geom, pf, travel, model, sched }
}

// -----------------------------
// Minimal usage example (non-UI)
// -----------------------------
//
// const { geom, travel, model, sched } = CMO_buildCore()
// const booths: CMOBooth[] = [
//   { id:"A-3", row:"A", col:3, open:0, close:360, must:false, u:0.7 },
//   { id:"C-2", row:"C", col:2, width:2, open:0, close:360, u:0.95, must:true },
// ]
// const plan = sched.scheduleFixed(booths)
// console.log(plan)
