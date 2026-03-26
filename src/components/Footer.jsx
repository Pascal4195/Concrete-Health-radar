import React, { useState } from 'react'

export default function Footer() {
  const [hovered, setHovered] = useState(false)

  return (
    <footer style={{
      borderTop: '1px solid rgba(200,134,10,0.15)',
      padding: '20px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      background: 'rgba(8,5,1,0.85)'
    }}>
      {/* Left — disclaimer */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        color: 'rgba(200,134,10,0.35)',
        letterSpacing: '0.1em'
      }}>
        COMMUNITY BUILD — NOT AFFILIATED WITH CONCRETE PROTOCOL
      </div>

      {/* Right — PFP + handle, clickable */}
      <a
        href="https://x.com/zerodollar_Anon"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          transition: 'all 0.25s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)'
        }}
      >
        {/* PFP */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: `2px solid ${hovered ? '#EDD97A' : 'rgba(200,134,10,0.5)'}`,
          boxShadow: hovered
            ? '0 0 16px rgba(237,217,122,0.5), 0 0 32px rgba(200,134,10,0.3)'
            : '0 0 8px rgba(200,134,10,0.2)',
          overflow: 'hidden',
          flexShrink: 0,
          transition: 'all 0.25s ease'
        }}>
          <img
            src="/pfp.jpg"
            alt="@zerodollar_Anon"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={e => {
              // Fallback to moai if pfp.jpg not found
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement.innerHTML = '<span style="font-size:26px;display:flex;align-items:center;justify-content:center;height:100%">🗿</span>'
            }}
          />
        </div>

        {/* Handle + label */}
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(200,134,10,0.45)',
            letterSpacing: '0.15em',
            marginBottom: '2px'
          }}>
            BUILT BY
          </div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: '700',
            fontSize: '14px',
            color: hovered ? '#EDD97A' : 'rgba(237,217,122,0.75)',
            letterSpacing: '0.08em',
            textShadow: hovered ? '0 0 12px rgba(237,217,122,0.5)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            @zerodollar_Anon
          </div>
        </div>

        {/* X icon */}
        <svg
          width="18" height="18"
          viewBox="0 0 24 24"
          fill={hovered ? '#EDD97A' : 'rgba(200,134,10,0.45)'}
          style={{ transition: 'fill 0.25s ease', flexShrink: 0 }}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
    </footer>
  )
}