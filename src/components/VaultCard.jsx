import React, { useState } from 'react'
import GaugeMeter from './GaugeMeter.jsx'

export default function VaultCard({ vault, index }) {
  const [hovered, setHovered] = useState(false)
  const isLoading = vault.loading || vault.riskLevel === 'LOADING'
  const col = vault.riskColor || '#8B5E0A'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'rgba(8, 5, 1, 0.82)',
        border: `1px solid ${hovered ? col : 'rgba(200,134,10,0.22)'}`,
        borderRadius: '3px',
        padding: '22px 18px 18px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: hovered
          ? `0 0 28px rgba(200,134,10,0.18), inset 0 0 30px rgba(0,0,0,0.6), 0 0 2px ${col}`
          : '0 0 10px rgba(200,134,10,0.06), inset 0 0 30px rgba(0,0,0,0.5)',
        transition: 'all 0.35s ease',
        animation: 'fade-up 0.6s ease forwards',
        animationDelay: `${index * 0.12}s`,
        opacity: 0
      }}
    >
      {/* Corner brackets */}
      {[
        { top: 0,    left: 0,  borderTop: true,    borderLeft: true  },
        { top: 0,    right: 0, borderTop: true,    borderRight: true },
        { bottom: 0, left: 0,  borderBottom: true, borderLeft: true  },
        { bottom: 0, right: 0, borderBottom: true, borderRight: true },
      ].map((corner, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '10px', height: '10px',
          top:    corner.top,
          bottom: corner.bottom,
          left:   corner.left,
          right:  corner.right,
          borderTop:    corner.borderTop    ? `2px solid ${col}` : undefined,
          borderBottom: corner.borderBottom ? `2px solid ${col}` : undefined,
          borderLeft:   corner.borderLeft   ? `2px solid ${col}` : undefined,
          borderRight:  corner.borderRight  ? `2px solid ${col}` : undefined,
          opacity: 0.7,
          transition: 'border-color 0.35s ease'
        }} />
      ))}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            color: 'rgba(200,134,10,0.55)',
            letterSpacing: '0.2em',
            marginBottom: '3px'
          }}>
            CONCRETE VAULT
          </div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: '900',
            fontSize: '20px',
            color: '#EDD97A',
            textShadow: '0 0 14px rgba(237,217,122,0.4)',
            letterSpacing: '0.1em'
          }}>
            {vault.symbol}
          </div>
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          color: 'rgba(200,134,10,0.4)',
          textAlign: 'right',
          marginTop: '3px'
        }}>
          {vault.address.slice(0, 6)}...{vault.address.slice(-4)}
        </div>
      </div>

      {/* Gauge */}
      <div style={{ margin: '6px 0 2px' }}>
        <GaugeMeter
          score={vault.gaugeScore}
          riskColor={col}
          riskLevel={vault.riskLevel}
          loading={isLoading}
        />
      </div>

      {/* HF display */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          color: 'rgba(200,134,10,0.6)',
          letterSpacing: '0.2em',
          marginBottom: '4px'
        }}>
          HEALTH FACTOR
        </div>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontWeight: '700',
          fontSize: isLoading ? '16px' : vault.isSolvent ? '26px' : '32px',
          color: col,
          textShadow: `0 0 18px ${col}`,
          letterSpacing: '0.06em',
          transition: 'color 0.5s ease, text-shadow 0.5s ease'
        }}>
          {isLoading
            ? <span style={{ fontSize: '14px', color: 'rgba(200,134,10,0.45)', animation: 'blink 1.2s infinite' }}>FETCHING...</span>
            : vault.hfDisplay
          }
        </div>
        {!isLoading && vault.isSolvent && (
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(237,217,122,0.4)',
            letterSpacing: '0.12em',
            marginTop: '4px'
          }}>
            NO LEVERAGED POSITION
          </div>
        )}
      </div>

      {/* APY + TVL */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { label: 'APY', value: vault.apyDisplay },
          { label: 'TVL', value: vault.tvl        }
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1,
            background: 'rgba(200,134,10,0.04)',
            border: '1px solid rgba(200,134,10,0.12)',
            borderRadius: '2px',
            padding: '10px 12px'
          }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px',
              color: 'rgba(237,217,122,0.6)',
              letterSpacing: '0.18em',
              marginBottom: '5px'
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: '700',
              fontSize: '17px',
              color: isLoading ? 'rgba(200,134,10,0.35)' : '#C8860A',
              textShadow: isLoading ? 'none' : '0 0 10px rgba(200,134,10,0.4)',
              letterSpacing: '0.04em'
            }}>
              {isLoading ? '...' : value}
            </div>
          </div>
        ))}
      </div>

      {/* Strategy tags */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {Object.keys(vault.strategies || {}).map(s => (
          <span key={s} style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(200,134,10,0.5)',
            border: '1px solid rgba(200,134,10,0.18)',
            borderRadius: '2px',
            padding: '3px 8px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            {s}
          </span>
        ))}
      </div>

      {vault.error && (
        <div style={{
          marginTop: '8px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          color: '#cc2233',
          opacity: 0.75
        }}>
          ⚠ RPC ERROR
        </div>
      )}
    </div>
  )
}