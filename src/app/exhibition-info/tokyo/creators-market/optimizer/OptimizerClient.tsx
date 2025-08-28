'use client'

import { useState, useEffect, useMemo } from 'react'
import DayTabs from '../components/DayTabs'
import BoothMap from '../components/BoothMap'
import { DAYS, displayBoothId } from '@/data/exhibition/tokyo/creators-market/constants'
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
  interface OptimizeResult { route: { id: string }[] }
  const [result, setResult] = useState<OptimizeResult | null>(null)

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

  const clear = () => {
    setSelected({})
    setResult(null)
  }

  const orderMap = useMemo(() => {
    const map: Record<string, number> = {}
    if (result?.route) {
      result.route.forEach((b, i) => {
        map[b.id] = i + 1
      })
    }
    return map
  }, [result])

  const progress = (time / 360) * 100

  return (
    <main className="cm-scope cm-tokyo">
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">Route Optimizer</h1>
          <p className="header-subtitle">경로 최적화 도구</p>
        </div>
      </header>

      <div className="container cm-main">
        <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />
        <section className="cm-section map-section">
          <BoothMap
            selectedDay={selectedDay}
            onBoothClick={handleBoothClick}
            selectedBooths={selected}
            heatMap={heatMap}
            showWalkways
            routeOrder={orderMap}
          />
        </section>

        <div className="time-slider">
          <label>
            시간 {toTime(time)}
            <input
              suppressHydrationWarning
              className="opt-slider"
              type="range"
              min={0}
              max={360}
              step={10}
              value={time}
              onChange={e => setTime(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #39c5bb 0%, #39c5bb ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`,
                boxShadow: progress > 0 ? '0 0 8px #39c5bb' : undefined,
              }}
            />
          </label>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={compute}>경로 계산</button>
          <button onClick={clear}>선택 초기화</button>
        </div>

        {result?.route && (
          <ol className="route-list">
            {result.route.map(b => (
              <li key={b.id}>{displayBoothId(b.id)}</li>
            ))}
          </ol>
        )}

        {result && (
          <pre className="route-json">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </main>
  )
}
