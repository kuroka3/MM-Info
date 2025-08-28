// cmo-heatmap.ts
import {
  CMOBooth, CMOBoothId, CMORow,
  CMOGeometry, CMOShowCrowdModel, CMOSchedulerCore
} from "./cmo-engine.js";

/** 시간축 유틸: 10:00 기준 분단위 → "HH:MM" */
export function CMO_fmtTime(minSince10: number) {
  const total = Math.round(minSince10);
  const h = 10 + Math.floor(total / 60);
  const m = total % 60;
  const hh = (h % 24).toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 히트맵 타일(렌더 정보) */
export interface CMOHeatmapTile {
  id: CMOBoothId;
  row: CMORow;
  col: number;            // 원래 라벨(1..17)
  width: 1 | 2;           // 세로 span
  x: number;              // 부스 x(열 라인)
  y0: number;             // 전개된 y 시작
  y1: number;             // 전개된 y 끝
  colSpan: number;        // = width
}

export function CMO_makeTiles(booths: CMOBooth[], geom = new CMOGeometry()): CMOHeatmapTile[] {
  return booths.map(b => {
    const w = b.width ?? (geom["wideCols"][b.row]?.has(b.col) ? 2 : 1);
    const rect = geom.boothRect({ row: b.row, col: b.col, width: w });
    return {
      id: b.id,
      row: b.row,
      col: b.col,
      width: w as (1|2),
      x: rect.x,
      y0: rect.y0,
      y1: rect.y1,
      colSpan: w as (1|2),
    };
  });
}

/** 시간축 생성: [start, end] 구간을 step 간격으로 */
export function CMO_makeTimeAxis(startMin = 0, endMin = 360, stepMin = 10): number[] {
  const out: number[] = [];
  for (let t = startMin; t <= endMin + 1e-9; t += stepMin) out.push(+t.toFixed(6));
  return out;
}

/** 슬라이스 엔트리(한 시각 t의 한 부스 지표) */
export interface CMOHeatSliceEntry {
  id: CMOBoothId;
  active: boolean;      // 이 시각 방문 가능(매진/마감 전)
  waitMin: number;      // expectedWaitMin(u,t)
  hazardPerMin: number; // h_i(t)
  survival: number;     // S(open→t)=exp(-∫h), t<open이면 1
  open: number;
  close: number;
  selloutDeadline: number; // 평균기반 데드라인(확정 경계)
}

/** 한 시각 t의 전체 히트맵 슬라이스 */
export interface CMOHeatSlice {
  t: number;                 // 분(10:00 기준)
  label: string;             // "HH:MM"
  entries: CMOHeatSliceEntry[];
  // 통계(색상 도메인 추정용): active=true & waitMin 유효 대상에 대해
  min: number;
  p10: number;
  p50: number;
  p90: number;
  max: number;
}

/** 시계열 결과 */
export interface CMOHeatSeries {
  times: number[];
  slices: CMOHeatSlice[];
}

/** 내부: 분단위 누적위험 적분 (open..t), trapezoid */
function CMO_cumHazardTo(model: CMOShowCrowdModel, u: number, open: number, t: number) {
  if (t <= open) return 0;
  const step = 1;
  let s = open, H = 0;
  while (s < t) {
    const s1 = Math.min(t, s + step);
    const h0 = model.hazardPerMin(u, s);
    const h1 = model.hazardPerMin(u, s1);
    H += 0.5 * (h0 + h1) * (s1 - s);
    s = s1;
  }
  return H;
}

/** 옵션 */
export interface CMOHeatOptions {
  /** 색상 도메인 계산 시 사용할 활성 조건: 기본은 open..min(close,d) 안의 부스만 포함 */
  includeInactiveInStats?: boolean; // default false
  /** wait 값을 슬라이스별로 [p10, p90]로 클리핑(아웃라이어 억제) */
  clipToP10P90?: boolean; // default true
}

/** 한 시각 t에서의 히트맵 슬라이스 생성 */
export function CMO_sampleWaitSlice(
  booths: CMOBooth[],
  core: CMOSchedulerCore,
  t: number,
  opts: CMOHeatOptions = {}
): CMOHeatSlice {
  const { includeInactiveInStats = false, clipToP10P90 = true } = opts;
  const entries: CMOHeatSliceEntry[] = [];
  const vals: number[] = [];

  for (const b of booths) {
    const d = core.model.selloutDeadline(b.open, b.close, b.u);
    const aliveUntil = Math.min(b.close, d);
    const active = (t >= b.open) && (t <= aliveUntil + 1e-9);
    const wait = core.model.expectedWaitMin(b.u, Math.max(t, b.open));
    const hz = core.model.hazardPerMin(b.u, t);
    const H = CMO_cumHazardTo(core.model, b.u, b.open, t);
    const S = Math.exp(-H);

    entries.push({
      id: b.id,
      active,
      waitMin: wait,
      hazardPerMin: hz,
      survival: S,
      open: b.open,
      close: b.close,
      selloutDeadline: d,
    });

    const eligible = includeInactiveInStats ? true : active;
    if (eligible) vals.push(wait);
  }

  // 통계
  const sorted = vals.slice().sort((a, b) => a - b);
  const q = (p: number) => {
    if (!sorted.length) return 0;
    const pos = (sorted.length - 1) * p;
    const i = Math.floor(pos), f = pos - i;
    return i + 1 < sorted.length ? sorted[i] * (1 - f) + sorted[i + 1] * f : sorted[i];
  };

  let min = sorted.length ? sorted[0] : 0;
  let max = sorted.length ? sorted[sorted.length - 1] : 0;
  const p10 = q(0.10), p50 = q(0.50), p90 = q(0.90);

  // 렌더링 안정화를 위해 슬라이스 통계를 [p10,p90]로 클리핑(옵션)
  if (clipToP10P90 && sorted.length) {
    min = p10;
    max = Math.max(p90, p10 + 1e-6);
  }

  return {
    t,
    label: CMO_fmtTime(t),
    entries,
    min, p10, p50, p90, max,
  };
}

/** 여러 시각에 대해 시계열 생성 */
export function CMO_sampleWaitSeries(
  booths: CMOBooth[],
  core: CMOSchedulerCore,
  times: number[],
  opts: CMOHeatOptions = {}
): CMOHeatSeries {
  const slices = times.map(t => CMO_sampleWaitSlice(booths, core, t, opts));
  return { times, slices };
}

/** UI용 값 정규화(색상 0..1). 슬라이스 통계(min..max) 기준으로 매핑 */
export function CMO_normalizeWaitForSlice(val: number, slice: CMOHeatSlice) {
  const lo = slice.min, hi = slice.max;
  if (hi <= lo + 1e-9) return 0.5;
  const z = (val - lo) / (hi - lo);
  return Math.max(0, Math.min(1, z));
}

/** 부스별 시계열(라인차트/툴팁용) 꺼내기 */
export function CMO_extractBoothSeries(series: CMOHeatSeries, boothId: CMOBoothId) {
  return series.slices.map(slc => {
    const e = slc.entries.find(x => x.id === boothId);
    return {
      t: slc.t,
      label: slc.label,
      active: e?.active ?? false,
      waitMin: e?.waitMin ?? 0,
      hazardPerMin: e?.hazardPerMin ?? 0,
      survival: e?.survival ?? 1,
    };
  });
}
