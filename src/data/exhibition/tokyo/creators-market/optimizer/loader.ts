import { BOOTHS } from '../booths'
import weights from './booth-weights-soft.json'
import { CMOBooth, CMORow, CMODayPools } from './cmo-engine'

const TWO_WIDE = new Set(['A-4','B-11','C-2','C-9','D-4'])

export function loadBooths(): CMOBooth[] {
  const map: Record<string, number> = weights as any
  return BOOTHS.filter(b => !('hidden' in b && b.hidden) && b.id !== 'F-17').map(b => ({
    id: b.id as any,
    row: b.row as CMORow,
    col: b.col,
    width: TWO_WIDE.has(b.id) ? 2 : 1,
    open: 0,
    close: 360,
    must: false,
    u: map[b.id] ?? 0.5,
    dates: b.dates ?? []
  }))
}

export function buildDayPools() {
  const booths = loadBooths()
  const labels = ['8/29(금)', '8/30(토)', '8/31(일)']
  return CMODayPools.poolsByLabels(booths, labels)
}
