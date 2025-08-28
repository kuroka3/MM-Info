// cmo-heuristics.ts
import {
  CMOBooth, CMOSchedulerCore, CMOScheduleResult,
} from "./cmo-engine";

// --------------------------------------
// 간단 캐시형: 기존 route 점수 재사용 가능
// --------------------------------------
export type CMOScore = Pick<CMOScheduleResult, "feasible" | "totalTravelMin" | "totalServiceMin">;

export function CMO_totalMinutes(s: CMOScore) {
  return s.totalTravelMin + s.totalServiceMin;
}

// --------------------------------------
// 단일 부스 k를 모든 위치에 삽입해 최적 위치 찾기
// --------------------------------------
export function CMO_bestInsertion(
  route: CMOBooth[],
  k: CMOBooth,
  core: CMOSchedulerCore,
  baseScore?: CMOScore,
  infeasiblePenalty = 1e12
) {
  const base = baseScore ?? core.scheduleFixed(route);
  if (!base.feasible) return { pos: -1, delta: Infinity, proof: null as CMOScheduleResult | null };

  let best = { pos: -1, delta: Infinity, proof: null as CMOScheduleResult | null };

  for (let i = 0; i <= route.length; i++) {
    const cand = route.slice(0, i).concat([k], route.slice(i));
    const sched = core.scheduleFixed(cand);
    if (!sched.feasible) continue;
    const delta = CMO_totalMinutes(sched) - CMO_totalMinutes(base);
    if (delta < best.delta) best = { pos: i, delta, proof: sched };
  }
  if (best.pos < 0) return { pos: -1, delta: infeasiblePenalty, proof: null };
  return best;
}

// --------------------------------------
// regret-k pick: 미배치 풀에서 ‘지금 안 넣으면 손해 큰’ 노드 선택
// --------------------------------------
export function CMO_regretPick(
  route: CMOBooth[],
  pool: CMOBooth[],
  core: CMOSchedulerCore,
  kOrder = 3,
  baseScore?: CMOScore
) {
  const base = baseScore ?? core.scheduleFixed(route);
  let bestK: CMOBooth | null = null;
  let bestPos = -1;
  let bestRegret = -Infinity;

  for (const b of pool) {
    const costs: number[] = [];
    const pos: number[] = [];
    for (let i = 0; i <= route.length; i++) {
      const cand = route.slice(0, i).concat([b], route.slice(i));
      const s = core.scheduleFixed(cand);
      if (!s.feasible) continue;
      costs.push(CMO_totalMinutes(s) - CMO_totalMinutes(base));
      pos.push(i);
    }
    if (!costs.length) continue;
    costs.sort((a, b) => a - b);
    const m = Math.min(kOrder, costs.length);
    const regret = costs.slice(1, m).reduce((s, x) => s + x, 0) - costs[0];
    if (regret > bestRegret) {
      bestRegret = regret;
      bestK = b;
      bestPos = pos[costs.indexOf(costs[0])];
    }
  }
  return { booth: bestK, pos: bestPos, regret: bestRegret };
}

// --------------------------------------
// 반복 삽입 빌더 (regret-3 기본)
// --------------------------------------
export function CMO_buildByRegret(
  seedRoute: CMOBooth[],
  pool: CMOBooth[],
  core: CMOSchedulerCore,
  kOrder = 3,
  maxIter = 10_000
) {
  const route = seedRoute.slice();
  const remain = pool.slice();
  let base = core.scheduleFixed(route);
  let iter = 0;

  while (remain.length && iter++ < maxIter) {
    const pick = CMO_regretPick(route, remain, core, kOrder, base);
    if (!pick.booth || pick.pos < 0) break;
    route.splice(pick.pos, 0, pick.booth);
    const idx = remain.indexOf(pick.booth);
    remain.splice(idx, 1);
    base = core.scheduleFixed(route);
    if (!base.feasible) break;
  }
  return { route, score: base, remain };
}
