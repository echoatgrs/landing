'use client'

import { useEffect, useState } from 'react'
import type { Dictionary } from '../../i18n'
import { LOG_POOL } from './demo'

const ROWS = 8
const BASE = new Date(2026, 10, 2, 14, 2, 11).getTime()
const pad = (n: number) => String(n).padStart(2, '0')
const clock = (ms: number) => {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

type Row = { i: number; at: number }

// Precomputed as fixed strings so server and client render identical styles
// (raw floats like 32.999999999999986 hydrate differently from "33px").
const RING = Array.from({ length: 24 }, (_, k) => {
  const a = (k / 24) * Math.PI * 2 - Math.PI / 2
  return {
    left: `${(62 + Math.cos(a) * 58).toFixed(2)}px`,
    top: `${(62 + Math.sin(a) * 58).toFixed(2)}px`,
    animationDelay: `${(k * 0.1).toFixed(1)}s`,
  }
})

export function LiveConsole({ t }: { t: Dictionary['console'] }) {
  const [s, setS] = useState(() => ({
    tick: 0,
    rows: Array.from({ length: ROWS }, (_, i): Row => ({ i, at: BASE - i * 37000 })),
    crawl: 1284,
    user: 212,
    refs: 37,
    perMin: 14,
  }))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setS((p) => {
        const next = p.rows[0].i + 1
        const hit = LOG_POOL[next % LOG_POOL.length]
        return {
          tick: p.tick + 1,
          rows: [{ i: next, at: p.rows[0].at + 9000 + Math.floor(Math.random() * 20000) }, ...p.rows.slice(0, ROWS - 1)],
          crawl: p.crawl + (hit.kind === 'user' ? 0 : 1),
          user: p.user + (hit.kind === 'user' ? 1 : 0),
          refs: p.refs + (Math.random() < 0.2 ? 1 : 0),
          perMin: 11 + Math.floor(Math.random() * 9),
        }
      })
    }, 1700)
    return () => clearInterval(id)
  }, [])

  const fmt = (n: number) => n.toLocaleString('en-US')

  return (
    <div className="console rise" style={{ animationDelay: '.9s' }}>
      <div className="layer dots-dark" />
      <div className="scan" aria-hidden="true" />
      <div className="console-in">
        <div className="console-left">
          <div className="console-head mono-label">
            <span>{t.live}</span>
            <span>{t.example}</span>
          </div>
          <div className="ringbox">
            <div className="ring" aria-hidden="true">
              {RING.map((d, k) => (
                <span key={k} className={k % 6 === 0 ? 'ringdot hot' : 'ringdot'} style={d} />
              ))}
              <div className="ring-num">{pad(s.perMin)}</div>
            </div>
            <div className="ring-label">
              {t.perMin}
              <span className="rec">● {t.recording}</span>
            </div>
          </div>
          <div className="meters">
            <Meter label={t.crawl} value={fmt(s.crawl)} width="100%" delay="1s" />
            <Meter label={t.user} value={fmt(s.user)} width="22%" delay="1.2s" hot />
            <Meter label={t.refs} value={fmt(s.refs)} width="6%" delay="1.4s" />
          </div>
        </div>
        <div className="console-right">
          <div className="console-head mono-label">
            <span>{t.tail}</span>
            <span className="blink" aria-hidden="true">▌</span>
          </div>
          <div className="log-scroll">
            <div className="log" role="table" aria-label={t.tail}>
              <div className="log-row head" role="row">
                <span role="columnheader">{t.cols.time}</span>
                <span role="columnheader">{t.cols.agent}</span>
                <span role="columnheader">{t.cols.purpose}</span>
                <span role="columnheader">{t.cols.path}</span>
              </div>
              {s.rows.map((r, idx) => {
                const hit = LOG_POOL[r.i % LOG_POOL.length]
                const flash = idx === 0 && s.tick > 0 ? (s.tick % 2 ? ' new-a' : ' new-b') : ''
                return (
                  <div key={idx} className={`log-row${flash}`} role="row" style={{ opacity: 1 - idx * 0.08 }}>
                    <span className="t" role="cell">{clock(r.at)}</span>
                    <span className={hit.fake ? 'fake' : undefined} role="cell">{hit.agent}</span>
                    <span className={`k-${hit.kind}`} role="cell">{t.kinds[hit.kind]}</span>
                    <span className="path" role="cell">
                      {hit.path}
                      {hit.fake && <small> · {t.ipNote}</small>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meter({ label, value, width, delay, hot }: { label: string; value: string; width: string; delay: string; hot?: boolean }) {
  return (
    <div>
      <div className="meter-top">
        <span className="mono-label">{label}</span>
        <span className={hot ? 'meter-num hot' : 'meter-num'}>{value}</span>
      </div>
      <div className="track">
        <div className={hot ? 'bar hot' : 'bar'} style={{ width, animationDelay: delay }} />
      </div>
    </div>
  )
}
