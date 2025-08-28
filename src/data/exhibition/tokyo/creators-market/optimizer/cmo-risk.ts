// cmo-risk.ts
import { CMOBooth, CMOSchedulerCore } from "./cmo-engine";

// ---------- RNG & 통계 유틸 ----------
export class CMORng {
  private s: number;
  constructor(seed = 0x9e3779b9) { this.s = seed >>> 0; }
  next() { // mulberry32
    let t = (this.s += 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  normal01() { // Box–Muller
    const u = this.next() || 1e-12, v = this.next() || 1e-12;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}

export function CMO_quantile(sortedAsc: number[], q: number) {
  if (!sortedAsc.length) return 0;
  const pos = (sortedAsc.length - 1) * q;
  const i = Math.floor(pos), f = pos - i;
  if (i + 1 < sortedAsc.length) return sortedAsc[i] * (1 - f) + sortedAsc[i + 1] * f;
  return sortedAsc[i];
}

// Lognormal: mean=mu, CV -> sigma, muLog
export function CMO_lognormalSample(rng: CMORng, mean: number, cv = 0.5) {
  const sigma2 = Math.log(1 + cv * cv);
  const muLog = Math.log(Math.max(mean, 1e-6)) - 0.5 * sigma2;
  const sigma = Math.sqrt(sigma2);
  return Math.exp(muLog + sigma * rng.normal01());
}

// 매진시각 샘플 (비균질 포아송의 이산 근사: 1분 간격 베르누이)
export function CMO_sampleSelloutTime(
  core: CMOSchedulerCore,
  b: CMOBooth,
  rng: CMORng
) {
  const step = 1; // minute
  let t = b.open;
  while (t < b.close) {
    const h = core.model.hazardPerMin(b.u, t);
    const p = 1 - Math.exp(-h * step);
    if (rng.next() < p) return t; // sell here
    t += step;
  }
  return Infinity; // no sellout until close
}

// ---------- 결과 타입 ----------
export interface CMO_MC_BoothStats {
  booth: string;
  succProb: number;        // 방문 성공 확률
  selloutFailProb: number; // 매진으로 인한 실패 확률
  waitP50: number;
  waitP90: number;
}

export interface CMO_MC_RouteStats {
  totalVisitedMean: number;
  overrunProb: number;     // 16:00 초과 확률
  totalTimeP50: number;
  totalTimeP90: number;
}

export interface CMO_MC_Result {
  byBooth: CMO_MC_BoothStats[];
  route: CMO_MC_RouteStats;
}

// ---------- 메인 몬테카를로 ----------
export function CMO_monteCarlo(
  route: CMOBooth[],
  core: CMOSchedulerCore,
  trials = 2000,
  cvWait = 0.5,
  seed = 12345
): CMO_MC_Result {
  const rng = new CMORng(seed);
  const succ = new Array(route.length).fill(0);
  const sellFail = new Array(route.length).fill(0);
  const waits: number[][] = route.map(() => []);
  const totalTimes: number[] = [];
  let overrun = 0;

  for (let s = 0; s < trials; s++) {
    const sellTs = route.map(b => CMO_sampleSelloutTime(core, b, rng));
    let t = 0;        // minutes since 10:00
    let okCnt = 0;

    // S → route → E; 여기선 이동시간은 기대값(결정적)으로 근사
    for (let i = 0; i < route.length; i++) {
      const b = route[i];

      // 이동: 간단 근사 — 직전 노드에서 이 노드 travelMin을 스케줄 고정으로 재계산
      // 정확히 하려면 직전 위치 기억하고 core.travel.travel(prev,b) 호출
      // 여기선 오차 감소 위해 실제 호출:
      const prev = i === 0 ? "S" : route[i - 1];
      const leg = core.travel.travel(prev as any, b);
      t += leg.travelMin;

      if (t < b.open) t = b.open;

      const deadline = Math.min(b.close, sellTs[i]);
      if (t > deadline) { sellFail[i]++; continue; }

      const mu = core.model.expectedWaitMin(b.u, t);
      const W = CMO_lognormalSample(rng, mu, cvWait);
      const Svc = CMO_lognormalSample(rng, mu, cvWait); // 간단히 동일분포
      waits[i].push(W);
      t += (W + Svc);
      if (t <= 360) { succ[i]++; okCnt++; }
    }

    // 마지막 E로 이동(평가 목적의 총시간만): 대략 마지막 부스→E 이동
    if (route.length) {
      const leg = core.travel.travel(route[route.length - 1], "E");
      t += leg.travelMin;
    } else {
      const leg = core.travel.travel("S" as any, "E" as any);
      t += leg.travelMin;
    }

    totalTimes.push(t);
    if (t > 360) overrun++;
  }

  // 집계
  const byBooth = route.map((b, i) => {
    const ws = waits[i].slice().sort((a, b) => a - b);
    return {
      booth: b.id,
      succProb: succ[i] / trials,
      selloutFailProb: sellFail[i] / trials,
      waitP50: CMO_quantile(ws, 0.5),
      waitP90: CMO_quantile(ws, 0.9),
    } as CMO_MC_BoothStats;
  });

  const tt = totalTimes.slice().sort((a, b) => a - b);
  return {
    byBooth,
    route: {
      totalVisitedMean: byBooth.reduce((s, x) => s + x.succProb, 0),
      overrunProb: overrun / trials,
      totalTimeP50: CMO_quantile(tt, 0.5),
      totalTimeP90: CMO_quantile(tt, 0.9),
    },
  };
}
