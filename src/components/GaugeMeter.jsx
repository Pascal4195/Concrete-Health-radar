import React, { useEffect, useRef, useState } from 'react'
import { scoreToAngle } from '../hooks/useVaults.js'

const SIZE = 200
const CX   = SIZE / 2
const CY   = SIZE / 2
const R    = 78
const STROKE = 10

function polarToXY(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad)
  }
}

function arc(fromDeg, toDeg, r) {
  const s = polarToXY(fromDeg, r)
  const e = polarToXY(toDeg,   r)
  const large = toDeg - fromDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

// Golden brown risk zones: CRITICAL → HIGH → MEDIUM → LOW → SAFE
const ZONES = [
  { from: -135, to: -81,  color: '#cc2233' },
  { from: -81,  to: -27,  color: '#cc6600' },
  { from: -27,  to:  27,  color: '#C8860A' },
  { from:  27,  to:  81,  color: '#E8A020' },
  { from:  81,  to: 135,  color: '#EDD97A' },
]

const TICK_ANGLES = [-135, -81, -27, 27, 81, 135]

export default function GaugeMeter({ score, riskColor, riskLevel, loading }) {
  const [animated, setAnimated] = useState(50)
  const rafRef = useRef(null)
  const prevRef = useRef(50)

  useEffect(() => {
    if (loading) return
    const from   = prevRef.current
    const to     = score ?? 50
    const start  = performance.now()
    const dur    = 1400

    function tick(now) {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
      const val  = from + (to - from) * ease
      setAnimated(val)
      prevRef.current = val
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score, loading])

  const needleAngle  = scoreToAngle(animated)
  const tipPt        = polarToXY(needleAngle, R - 14)
  const base1        = polarToXY(needleAngle + 90, 6)
  const base2        = polarToXY(needleAngle - 90, 6)

  // Active arc end angle clamped
  const activeEnd = scoreToAngle(animated)

  return (
    <svg
      width={SIZE}
      height={SIZE * 0.72}
      viewBox={`0 0 ${SIZE} ${SIZE * 0.72}`}
      style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
    >
      {/* Track */}
      <path
        d={arc(-135, 135, R)}
        fill="none"
        stroke="rgba(200,134,10,0.07)"
        strokeWidth={STROKE + 4}
        strokeLinecap="round"
      />

      {/* Zone bands (dimmed) */}
      {ZONES.map((z, i) => (
        <path
          key={i}
          d={arc(z.from, z.to, R)}
          fill="none"
          stroke={z.color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          opacity={0.18}
        />
      ))}

      {/* Active filled arc */}
      <path
        d={arc(-135, activeEnd, R)}
        fill="none"
        stroke={riskColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 7px ${riskColor})`,
          transition: 'stroke 0.5s ease'
        }}
      />

      {/* Tick marks */}
      {TICK_ANGLES.map((a, i) => {
        const inner = polarToXY(a, R - STROKE / 2 - 5)
        const outer = polarToXY(a, R + STROKE / 2 + 5)
        return (
          <line
            key={i}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke="rgba(200,134,10,0.35)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* Needle */}
      {!loading && (
        <polygon
          points={`${tipPt.x},${tipPt.y} ${base1.x},${base1.y} ${base2.x},${base2.y}`}
          fill={riskColor}
          style={{
            filter: `drop-shadow(0 0 5px ${riskColor})`,
            transition: 'fill 0.5s ease'
          }}
        />
      )}

      {/* Hub */}
      <circle
        cx={CX} cy={CY} r={9}
        fill="#080501"
        stroke={riskColor}
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 6px ${riskColor})`, transition: 'stroke 0.5s ease' }}
      />
      <circle cx={CX} cy={CY} r={3} fill={riskColor} style={{ transition: 'fill 0.5s ease' }} />

      {/* Risk label below needle */}
      <text
        x={CX}
        y={CY + 32}
        textAnchor="middle"
        fill={loading ? 'rgba(200,134,10,0.4)' : riskColor}
        fontSize={loading ? '10' : '11'}
        fontFamily="'Orbitron', monospace"
        fontWeight="700"
        letterSpacing="2"
        style={{
          filter: loading ? 'none' : `drop-shadow(0 0 4px ${riskColor})`,
          transition: 'fill 0.5s ease'
        }}
      >
        {loading ? 'SCANNING...' : riskLevel}
      </text>
    </svg>
  )
}
