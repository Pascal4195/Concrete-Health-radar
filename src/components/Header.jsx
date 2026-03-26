import React, { useEffect, useRef } from 'react'

function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fontSize = 11
    const cols = Math.ceil(canvas.width / fontSize)
    const drops = Array(cols).fill(0).map(() => Math.random() * -50)
    const chars = '01∞∑アイウエオカキ</>{}⟨⟩ΔΩ'

    function draw() {
      ctx.fillStyle = 'rgba(8,5,1,0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "Share Tech Mono"`

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        // brighter lead char, dimmer trail
        const alpha = Math.random() > 0.92 ? 0.7 : 0.2
        ctx.fillStyle = `rgba(200,134,10,${alpha})`
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0
        drops[i] += 0.5
      })
    }

    const id = setInterval(draw, 55)
    return () => { clearInterval(id); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      opacity: 0.6, pointerEvents: 'none'
    }} />
  )
}

export default function Header({ lastRefresh, onRefresh, globalError }) {
  const timeStr = lastRefresh
    ? new Date(lastRefresh).toLocaleTimeString('en-US', { hour12: false })
    : null

  return (
    <header style={{
      position: 'relative',
      borderBottom: '1px solid rgba(200,134,10,0.2)',
      overflow: 'hidden',
      background: 'rgba(8,5,1,0.92)',
      backdropFilter: 'blur(12px)',
      padding: '20px 28px 16px',
      minHeight: '120px'
    }}>
      <MatrixRain />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Title row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px', lineHeight: 1 }}>🗿</span>
            <div>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontWeight: '900',
                fontSize: 'clamp(20px, 5vw, 30px)',
                color: '#EDD97A',
                letterSpacing: '0.14em',
                textShadow: '0 0 24px rgba(237,217,122,0.5)',
                lineHeight: 1
              }}>
                RISK RADAR
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: 'rgba(200,134,10,0.6)',
                letterSpacing: '0.22em',
                marginTop: '4px'
              }}>
                CONCRETE PROTOCOL // VAULT MONITOR
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: globalError ? '#cc2233' : '#C8860A',
                boxShadow: globalError ? '0 0 8px #cc2233' : '0 0 10px #E8A020',
                animation: 'pulse-glow 2s infinite'
              }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: globalError ? '#cc2233' : 'rgba(200,134,10,0.75)',
                letterSpacing: '0.15em'
              }}>
                {globalError ? 'RPC ERROR' : 'LIVE'}
              </span>
            </div>

            {timeStr && (
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: 'rgba(200,134,10,0.38)',
                letterSpacing: '0.1em'
              }}>
                UPDATED {timeStr}
              </div>
            )}

            <button
              onClick={onRefresh}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: '#EDD97A',
                background: 'transparent',
                border: '1px solid rgba(237,217,122,0.28)',
                borderRadius: '2px',
                padding: '3px 10px',
                cursor: 'pointer',
                letterSpacing: '0.15em',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background     = 'rgba(237,217,122,0.08)'
                e.currentTarget.style.borderColor    = 'rgba(237,217,122,0.65)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background     = 'transparent'
                e.currentTarget.style.borderColor    = 'rgba(237,217,122,0.28)'
              }}
            >
              ⟳ REFRESH
            </button>
          </div>
        </div>

        {/* Risk legend */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
          {[
            { label: 'SAFE',     color: '#EDD97A', hf: '>3.0'    },
            { label: 'LOW',      color: '#E8A020', hf: '2.0–3.0' },
            { label: 'MEDIUM',   color: '#C8860A', hf: '1.5–2.0' },
            { label: 'HIGH',     color: '#cc6600', hf: '1.1–1.5' },
            { label: 'CRITICAL', color: '#cc2233', hf: '<1.1'    },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: item.color,
                boxShadow: `0 0 5px ${item.color}`
              }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: item.color,
                letterSpacing: '0.1em',
                opacity: 0.9
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '9px',
                color: 'rgba(200,134,10,0.3)',
              }}>
                HF {item.hf}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
