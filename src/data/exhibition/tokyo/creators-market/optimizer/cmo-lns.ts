// cmo-lns.ts
import { CMOBooth, CMOSchedulerCore, CMOScheduleResult } from "./cmo-engine";
import { CMO_buildByRegret, CMO_totalMinutes } from "./cmo-heuristics";

// -----------------------------
// Slack 계산: 각 방문의 ‘데드라인 여유’ 근사
// -----------------------------
export function CMO_computeSlack(route: CMOBooth[], core: CMOSchedulerCore) {
  const s = core.scheduleFixed(route);
  if (!s.feasible) return new Array(route.length).fill(-Infinity);

  // 각 부스의 매진 데드라인(평균 경계) 기준 slack = deadline - arrive
  const slacks: number[] = [];
  for (let i = 0; i < route.length; i++) {
    const b = route[i];
    const v = s.visits[i];
    const d = core.model.selloutDeadline(b.open, b.close, b.u);
    slacks.push(d - v.arriveMin);
  }
  return slacks;
}

// -----------------------------
// 파괴 연산자들
// -----------------------------
export type CMODestroyOp = (route: CMOBooth[], core: CMOSchedulerCore, removeFrac: number) => CMOBooth[];

export const CMO_destroy_slack: CMODestroyOp = (route, core, removeFrac) => {
  const k = Math.max(1, Math.floor(route.length * removeFrac));
  const slack = CMO_computeSlack(route, core);
  const ord = route.map((b, i) => ({ b, i, sl: slack[i] })).sort((a, b) => a.sl - b.sl);
  const dead = new Set(ord.slice(0, k).map(o => o.i));
  return route.filter((_, i) => !dead.has(i));
};

// Shaw-like 유사도 기반 제거(거리+u유사) — 간단 버전
export const CMO_destroy_shaw: CMODestroyOp = (route, core, removeFrac) => {
  if (route.length <= 2) return route.slice();
  const k = Math.max(1, Math.floor(route.length * removeFrac));
  const start = Math.floor(Math.random() * route.length);
  const seed = route[start];

  // 거리 근사: 같은 블록/가까운 col이면 가깝다고 가정 (엔진 travel 써도 OK)
  const sim = (a: CMOBooth, b: CMOBooth) => {
    const sameRow = a.row === b.row ? 0 : 1;
    const dCol = Math.abs(a.col - b.col);
    const du = Math.abs(a.u - b.u);
    return sameRow * 2 + dCol * 0.5 + du * 3; // 낮을수록 유사
  };

  const ord = route.map((b, i) => ({ b, i, s: sim(seed, b) })).sort((x, y) => x.s - y.s);
  const deadIdx = new Set(ord.slice(0, k).map(o => o.i));
  return route.filter((_, i) => !deadIdx.has(i));
};

// -----------------------------
// 로컬 서치: 2-opt* & relocate
// -----------------------------
export function CMO_twoOptOnce(route: CMOBooth[], core: CMOSchedulerCore) {
  let bestRoute = route.slice();
  let bestScore = core.scheduleFixed(bestRoute);
  const n = route.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const cand = route.slice(0, i).concat(route.slice(i, j + 1).reverse(), route.slice(j + 1));
      const s = core.scheduleFixed(cand);
      if (s.feasible && CMO_totalMinutes(s) + 1e-9 < CMO_totalMinutes(bestScore)) {
        bestRoute = cand; bestScore = s;
        return { improved: true, route: bestRoute, score: bestScore };
      }
    }
  }
  return { improved: false, route: bestRoute, score: bestScore };
}

export function CMO_relocateOnce(route: CMOBooth[], core: CMOSchedulerCore) {
  let bestRoute = route.slice();
  let bestScore = core.scheduleFixed(bestRoute);
  const n = route.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= n; j++) {
      if (j === i || j === i + 1) continue;
      const b = route[i];
      const cand = route.slice(0, i).concat(route.slice(i + 1));
      cand.splice(j > i ? j - 1 : j, 0, b);
      const s = core.scheduleFixed(cand);
      if (s.feasible && CMO_totalMinutes(s) + 1e-9 < CMO_totalMinutes(bestScore)) {
        bestRoute = cand; bestScore = s;
        return { improved: true, route: bestRoute, score: bestScore };
      }
    }
  }
  return { improved: false, route: bestRoute, score: bestScore };
}

export function CMO_localSearch(route: CMOBooth[], core: CMOSchedulerCore, maxPass = 3) {
  let cur = route.slice();
  let sc = core.scheduleFixed(cur);
  for (let pass = 0; pass < maxPass; pass++) {
    let any = false;
    const r1 = CMO_twoOptOnce(cur, core);
    if (r1.improved) { cur = r1.route; sc = r1.score; any = true; }
    const r2 = CMO_relocateOnce(cur, core);
    if (r2.improved) { cur = r2.route; sc = r2.score; any = true; }
    if (!any) break;
  }
  return { route: cur, score: sc };
}

// -----------------------------
// LNS 메인 루프
// -----------------------------
export type CMODestroySet = CMODestroyOp[];

export function CMO_lnsImprove(
  init: CMOBooth[],
  poolAll: CMOBooth[],             // (초기해에 없는 후보까지 포함하려면 전달)
  core: CMOSchedulerCore,
  timeLimitMs = 10_000,
  removeFrac = 0.2,
  seedReuse = true,
  destroys: CMODestroySet = [CMO_destroy_slack, CMO_destroy_shaw],
) {
  let best = init.slice();
  let bestS = core.scheduleFixed(best);
  let cur = best.slice();
  let curS = bestS;
  const start = Date.now();

  while (Date.now() - start < timeLimitMs) {
    const op = destroys[Math.floor(Math.random() * destroys.length)];
    const destroyed = op(cur, core, removeFrac);
    // 제거된 노드 + 외부 풀에서 일부 랜덤 샘플을 남은 풀로
    const remainSet = new Set(destroyed.map(b => b.id));
    const removed = cur.filter(b => !remainSet.has(b.id));
    const removedPool = init.filter(b => !destroyed.includes(b));
    const externalPool = poolAll.filter(b => !destroyed.find(x => x.id === b.id) && !init.find(x => x.id === b.id));
    const pool = removedPool.concat(externalPool); // 필요하면 샘플링

    // regret-3 복원
    const repairedRes = CMO_buildByRegret(destroyed, pool, core, 3);
    // 로컬서치
    const ls = CMO_localSearch(repairedRes.route, core);
    const newS = ls.score;

    const Δ = CMO_totalMinutes(newS) - CMO_totalMinutes(curS);
    const T = 0.5; // SA 온도(간단 고정). 필요 시 냉각.
    const accept = newS.feasible && (Δ < 0 || Math.random() < Math.exp(-Δ / T));
    if (accept) { cur = ls.route; curS = newS; }
    if (newS.feasible && CMO_totalMinutes(newS) + 1e-9 < CMO_totalMinutes(bestS)) { best = ls.route; bestS = newS; }
  }
  return { route: best, score: bestS };
}
