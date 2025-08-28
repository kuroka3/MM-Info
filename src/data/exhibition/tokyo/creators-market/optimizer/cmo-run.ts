import { CMO_buildCore, CMOBooth } from './cmo-engine'
import { CMO_makeTimeAxis, CMO_sampleWaitSeries, CMO_sampleWaitSlice } from './cmo-heatmap'
import { CMO_buildByRegret } from './cmo-heuristics'
import { CMO_lnsImprove } from './cmo-lns'
import { CMO_monteCarlo } from './cmo-risk'
import { buildDayPools } from './loader'

const core = CMO_buildCore()
const pools = buildDayPools()

export function runHeatSlice(dayLabel: string, tMin: number){
  const day = pools[dayLabel] ?? []
  return CMO_sampleWaitSlice(day, core.sched, tMin)
}

export function runHeatSeries(dayLabel: string, step = 10){
  const day = pools[dayLabel] ?? []
  const times = CMO_makeTimeAxis(0, 360, step)
  return CMO_sampleWaitSeries(day, core.sched, times)
}

export function runOptimize(
  dayLabel: string,
  opts: { boothIds?: string[]; mustIds?: string[]; timeLimitMs?: number } = {},
) {
  const base = pools[dayLabel] ?? []
  const idSet = opts.boothIds ? new Set(opts.boothIds) : null
  const mustSet = opts.mustIds ? new Set(opts.mustIds) : null
  const day = base
    .filter(b => (idSet ? idSet.has(b.id) : true))
    .map(b => ({ ...b, must: mustSet ? mustSet.has(b.id) : b.must }))

  const seed = day.filter(b => b.must)
  const pool = day.filter(b => !b.must)
  const r0 = CMO_buildByRegret(seed, pool, core.sched, 3)
  const res = CMO_lnsImprove(
    r0.route,
    seed.concat(pool),
    core.sched,
    opts.timeLimitMs ?? 1000,
    0.2,
  )
  return res
}

export function runRisk(route: CMOBooth[], opts: { trials?: number, cvWait?: number } = {}){
  return CMO_monteCarlo(route, core.sched, opts.trials ?? 1000, opts.cvWait ?? 0.5, 42)
}
