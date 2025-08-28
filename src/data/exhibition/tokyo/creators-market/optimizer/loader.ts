import { BOOTHS } from '../booths'
import weights from './booth-weights-soft.json'
import { CMOBooth, CMORow } from './cmo-engine'

const TWO_WIDE = new Set(['A-4','B-11','C-2','C-9','D-4'])

export function loadBooths(): CMOBooth[] {
  const map = weights as Record<string, number>
  return BOOTHS.filter(b => !('hidden' in b && b.hidden) && b.id !== 'F-17').map(b => ({
    id: b.id as CMOBooth['id'],
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
  const pools: Record<string, CMOBooth[]> = {}
  for (const day of labels) {
    pools[day] = booths
      .filter(b => b.dates.includes(day))
      .map(b => ({ ...b }))
  }
  return pools
}
