// cmo-demo-heatmap.ts
// Run (ESM):
//   node --loader ts-node/esm cmo-demo-heatmap.ts "8/29(금)"
// or without arg defaults to the 1st day label.

import { CMO_buildCore, CMOBooth, CMORow, CMODayPools } from "./cmo-engine.js";
// ^ if you transpile to JS, change to "./cmo-engine.js"
import {
  CMO_makeTimeAxis,
  CMO_sampleWaitSeries,
  CMO_makeTiles,
  CMO_normalizeWaitForSlice,
  CMO_extractBoothSeries,
} from "./cmo-heatmap.js";
// ^ change to ".js" when importing built JS

// ------------------------------
// 1) Mock 데이터 (전시일자 포함)
// ------------------------------
const DAY_LABELS = ["8/29(금)", "8/30(토)", "8/31(일)"] as const;
type DayLabel = typeof DAY_LABELS[number];

// u: 0~1, open/close: 10:00 기준 분
const mockBooths: CMOBooth[] = [
  // A block (A-4는 2칸 폭)
  { id: "A-3", row: "A", col: 3, open: 0, close: 360, must: false, u: 0.62, dates: ["8/29(금)", "8/30(토)"] },
  { id: "A-4", row: "A", col: 4, width: 2, open: 0, close: 360, must: true,  u: 0.92, dates: ["8/29(금)", "8/31(일)"] },
  { id: "A-6", row: "A", col: 6, open: 0, close: 360, must: false, u: 0.35, dates: ["8/30(토)", "8/31(일)"] },

  // B block (B-11은 2칸 폭)
  { id: "B-10", row: "B", col: 10, open: 0, close: 360, must: false, u: 0.48, dates: ["8/29(금)"] },
  { id: "B-11", row: "B", col: 11, width: 2, open: 0, close: 360, must: false, u: 0.74, dates: ["8/29(금)", "8/30(토)"] },

  // C block (C-2, C-9은 2칸 폭)
  { id: "C-2", row: "C", col: 2, width: 2, open: 0, close: 360, must: true,  u: 0.97, dates: ["8/29(금)"] },
  { id: "C-5", row: "C", col: 5, open: 0, close: 360, must: false, u: 0.41, dates: ["8/30(토)"] },
  { id: "C-9", row: "C", col: 9, width: 2, open: 0, close: 360, must: false, u: 0.68, dates: ["8/31(일)"] },

  // D block (D-4는 2칸 폭)
  { id: "D-4", row: "D", col: 4, width: 2, open: 0, close: 360, must: false, u: 0.83, dates: ["8/29(금)", "8/31(일)"] },
  { id: "D-7", row: "D", col: 7, open: 0, close: 360, must: false, u: 0.22, dates: ["8/29(금)"] },

  // E block
  { id: "E-3", row: "E", col: 3, open: 0, close: 360, must: false, u: 0.55, dates: ["8/30(토)", "8/31(일)"] },
  { id: "E-8", row: "E", col: 8, open: 0, close: 360, must: false, u: 0.31, dates: ["8/29(금)"] },

  // F block (주의: F-17 금지 → 사용 안 함)
  { id: "F-1", row: "F", col: 1, open: 0, close: 360, must: false, u: 0.15, dates: ["8/29(금)", "8/30(토)", "8/31(일)"] },
  { id: "F-16", row: "F", col: 16, open: 0, close: 360, must: false, u: 0.27, dates: ["8/29(금)"] },
];

// ------------------------------
// 2) 코어/유틸 로드
// ------------------------------
const { geom, sched } = CMO_buildCore();

// 전시일자 선택 (CLI 인자 또는 기본값)
const dayLabelArg = (process.argv[2] as DayLabel | undefined);
const DAY: DayLabel = (DAY_LABELS.includes(dayLabelArg as any) ? dayLabelArg : DAY_LABELS[0]) as DayLabel;

// 날짜별 풀 구성 & 당일 부스 목록
const pools = CMODayPools.poolsByLabels(mockBooths, [...DAY_LABELS]);
const booths = pools[DAY] ?? [];
if (!booths.length) {
  console.warn(`[warn] No booths for day "${DAY}". Using all mock booths.`);
}

// ------------------------------
// 3) 열지도용 샘플링
// ------------------------------
const tiles = CMO_makeTiles(booths.length ? booths : mockBooths, geom);

// 10분 간격 타임축 (10:00~16:00)
const times = CMO_makeTimeAxis(0, 360, 10);

// 시계열 샘플: 기본 옵션(활성 부스만 통계, p10~p90 클리핑)
const series = CMO_sampleWaitSeries(booths.length ? booths : mockBooths, sched, times, {
  clipToP10P90: true,
});

// ------------------------------
// 4) 콘솔 샘플 출력 (UI 없이 확인용)
// ------------------------------
console.log(`\n=== Heatmap Demo for ${DAY} ===`);
console.log(`Tiles (first 5):`);
console.log(tiles.slice(0, 5));

const idxNoon = times.findIndex(t => t === 120); // 12:00
const slice = series.slices[idxNoon >= 0 ? idxNoon : 0];

console.log(`\nSlice @ ${slice.label} (entries first 5):`);
console.log(slice.entries.slice(0, 5).map(e => ({
  id: e.id, active: e.active, wait: +e.waitMin.toFixed(2),
  hazard: +e.hazardPerMin.toFixed(4), survival: +e.survival.toFixed(3),
})));

// 정규화 예시(색상 0..1). 실제 UI에서는 이 값을 색상 스케일에 매핑.
const normExample = slice.entries.slice(0, 5).map(e => ({
  id: e.id,
  colorNorm: +CMO_normalizeWaitForSlice(e.waitMin, slice).toFixed(3),
}));
console.log(`\nNormalized color (first 5):`);
console.log(normExample);

// 특정 부스 라인차트(툴팁 등): 부스가 없으면 스킵
const targetId = (booths[0]?.id ?? "A-4") as any;
const line = CMO_extractBoothSeries(series, targetId);
console.log(`\nLine series for ${targetId} (first 5 points):`);
console.log(line.slice(0, 5));
