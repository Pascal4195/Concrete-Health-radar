import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(200,134,10,0.1)',
      padding: '14px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      background: 'rgba(8,5,1,0.7)'
    }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        color: 'rgba(200,134,10,0.3)',
        letterSpacing: '0.1em'
      }}>
        COMMUNITY BUILD — NOT AFFILIATED WITH CONCRETE PROTOCOL
      </div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        color: 'rgba(237,217,122,0.4)',
        letterSpacing: '0.12em'
      }}>
        🗿 @zerodollar_Anon
      </div>
    </footer>
  )
}
