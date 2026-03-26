import React from 'react'
import { useVaults } from './hooks/useVaults.js'
import VaultCard from './components/VaultCard.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { vaultData, globalError, lastRefresh, refresh } = useVaults()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header lastRefresh={lastRefresh} onRefresh={refresh} globalError={globalError} />

      <main style={{
        flex: 1,
        padding: 'clamp(16px, 4vw, 40px) clamp(16px, 4vw, 32px)',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Section label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(237,217,122,0.45)',
            letterSpacing: '0.28em',
            whiteSpace: 'nowrap'
          }}>
            ▶ VAULT RISK MATRIX
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(200,134,10,0.25), transparent)'
          }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(200,134,10,0.35)',
            whiteSpace: 'nowrap'
          }}>
            ETH MAINNET // {vaultData.length} VAULTS
          </span>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
          gap: '18px',
          maxWidth: '1200px'
        }}>
          {vaultData.map((vault, i) => (
            <VaultCard key={vault.id} vault={vault} index={i} />
          ))}
        </div>

        {/* Methodology note */}
        <div style={{
          marginTop: '40px',
          padding: '14px 18px',
          background: 'rgba(200,134,10,0.03)',
          border: '1px solid rgba(200,134,10,0.08)',
          borderRadius: '2px',
          maxWidth: '820px'
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px',
            color: 'rgba(237,217,122,0.45)',
            letterSpacing: '0.22em',
            marginBottom: '8px'
          }}>
            ⚠ METHODOLOGY
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(200,134,10,0.32)',
            lineHeight: '1.9',
            letterSpacing: '0.04em'
          }}>
            Health Factor is derived from Aave V3 <code style={{ color: 'rgba(237,217,122,0.5)' }}>Pool.getUserAccountData(vaultAddress)</code> — 
            the same function Aave uses for liquidation checks. A HF below 1.0 means the vault position is liquidatable.
            APY is estimated from the primary strategy's Aave liquidityRate (Ray-scaled, compounded annually).
            Data auto-refreshes every 60 seconds. Community tool — not financial advice.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
