'use client'

import { useState, useEffect } from 'react'
import DayTabs from '../components/DayTabs'
import BoothMap from '../components/BoothMap'
import { DAYS } from '@/data/exhibition/tokyo/creators-market/constants'
import { runHeatSlice } from '@cm/cmo-run'
import { CMO_normalizeWaitForSlice } from '@cm/cmo-heatmap'

const toTime = (t: number) => {
  const h = 10 + Math.floor(t / 60)
  const m = t % 60
  return `${h}:${m.toString().padStart(2, '0')}`
}

export default function OptimizerClient() {
  const [selectedDay, setSelectedDay] =
    useState<(typeof DAYS)[number]['value']>(DAYS[0].value)
  const [time, setTime] = useState(0)
  const [heatMap, setHeatMap] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<Record<string, 'visit' | 'must'>>({})
  const [result, setResult] = useState<unknown | null>(null)

  useEffect(() => {
    const slice = runHeatSlice(selectedDay, time)
    const map: Record<string, string> = {}
    for (const e of slice.entries) {
      const z = CMO_normalizeWaitForSlice(e.waitMin, slice)
      const hue = (1 - z) * 120
      map[e.id] = `hsl(${hue}, 80%, 40%)`
    }
    setHeatMap(map)
  }, [selectedDay, time])

  const handleBoothClick = (id: string) => {
    setSelected(prev => {
      const next = { ...prev }
      const cur = next[id]
      if (!cur) next[id] = 'visit'
      else if (cur === 'visit') next[id] = 'must'
      else delete next[id]
      return next
    })
  }

  const compute = async () => {
    const visitIds = Object.keys(selected)
    const mustIds = visitIds.filter(id => selected[id] === 'must')
    const res = await fetch('/api/creators-market/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayLabel: selectedDay, boothIds: visitIds, mustIds }),
    })
    const json = await res.json()
    setResult(json)
  }

  return (
    <main className="cm-scope cm-tokyo">
      <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />
      <section className="cm-section map-section">
        <BoothMap
          selectedDay={selectedDay}
          onBoothClick={handleBoothClick}
          selectedBooths={selected}
          heatMap={heatMap}
        />
      </section>
      <div style={{ marginTop: '1rem' }}>
        <label>
          시간 {toTime(time)}
          <input
            type="range"
            min={0}
            max={360}
            step={10}
            value={time}
            onChange={e => setTime(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={compute} style={{ marginTop: '1rem' }}>
        경로 계산
      </button>

      {Boolean(result) && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}
