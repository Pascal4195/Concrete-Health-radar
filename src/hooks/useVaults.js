import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import {
  VAULTS, VAULT_ABI, AAVE_POOL_ABI, AAVE_DATA_PROVIDER_ABI,
  AAVE_POOL_ADDRESS, AAVE_DATA_PROVIDER, RISK_THRESHOLDS
} from '../vaults.js'

const RPC_URL = import.meta.env.VITE_ALCHEMY_RPC_URL ||
  'https://eth-mainnet.g.alchemy.com/v2/demo'

const REFRESH_INTERVAL = 60_000

function getRiskLevel(hf, isSolvent) {
  if (isSolvent)                       return { level: 'SOLVENT',  color: '#EDD97A', score: 98 }
  if (hf === null || hf === undefined) return { level: 'UNKNOWN',  color: '#6B5A3E', score: 50 }
  if (hf < RISK_THRESHOLDS.CRITICAL)  return { level: 'CRITICAL', color: '#cc2233', score: 5  }
  if (hf < RISK_THRESHOLDS.HIGH)      return { level: 'HIGH',     color: '#cc6600', score: 25 }
  if (hf < RISK_THRESHOLDS.MEDIUM)    return { level: 'MEDIUM',   color: '#C8860A', score: 50 }
  if (hf < RISK_THRESHOLDS.LOW)       return { level: 'LOW',      color: '#E8A020', score: 75 }
  return                                      { level: 'SAFE',     color: '#EDD97A', score: 95 }
}

export function scoreToAngle(score) {
  return -135 + (score / 100) * 270
}

async function fetchVaultData(provider, vault) {
  try {
    const vaultContract    = new ethers.Contract(vault.address, VAULT_ABI, provider)
    const aavePool         = new ethers.Contract(AAVE_POOL_ADDRESS, AAVE_POOL_ABI, provider)
    const aaveDataProvider = new ethers.Contract(AAVE_DATA_PROVIDER, AAVE_DATA_PROVIDER_ABI, provider)

    // TVL
    let tvlFormatted = 'N/A'
    try {
      const tvlRaw  = await vaultContract.totalAssets()
      const divisor = BigInt(10 ** vault.decimals)
      const tvlNum  = Number(tvlRaw / divisor)
      if      (tvlNum >= 1_000_000) tvlFormatted = `$${(tvlNum / 1_000_000).toFixed(2)}M`
      else if (tvlNum >= 1_000)     tvlFormatted = `$${(tvlNum / 1_000).toFixed(1)}K`
      else                          tvlFormatted = `$${tvlNum.toFixed(0)}`
    } catch (e) {
      console.warn(`[${vault.symbol}] TVL:`, e.message)
    }

    // Health Factor
    // Concrete vaults deposit into strategies without borrowing at vault level.
    // Aave returns MaxUint256 when there is no debt — we call this SOLVENT.
    let healthFactor = null
    let hfDisplay    = 'SOLVENT'
    let isSolvent    = true
    try {
      const acct  = await aavePool.getUserAccountData(vault.address)
      const hfBig = acct.healthFactor
      if (hfBig >= BigInt('100000000000000000000')) {
        healthFactor = null
        hfDisplay    = 'SOLVENT'
        isSolvent    = true
      } else {
        healthFactor = Number(ethers.formatUnits(hfBig, 18))
        hfDisplay    = healthFactor.toFixed(2)
        isSolvent    = false
      }
    } catch (e) {
      console.warn(`[${vault.symbol}] HF:`, e.message)
    }

    // APY via Aave liquidityRate
    let apyDisplay = 'N/A'
    try {
      const firstAsset  = Object.values(vault.strategies)[0].asset
      const reserveData = await aaveDataProvider.getReserveData(firstAsset)
      const rateRay     = Number(ethers.formatUnits(reserveData.liquidityRate, 27))
      const SECONDS     = 31_536_000
      const apy         = (Math.pow(1 + rateRay / SECONDS, SECONDS) - 1) * 100
      apyDisplay        = `${apy.toFixed(2)}%`
    } catch (e) {
      console.warn(`[${vault.symbol}] APY:`, e.message)
    }

    const risk = getRiskLevel(healthFactor, isSolvent)

    return {
      ...vault,
      tvl         : tvlFormatted,
      healthFactor,
      hfDisplay,
      apyDisplay,
      isSolvent,
      riskLevel   : risk.level,
      riskColor   : risk.color,
      gaugeScore  : risk.score,
      lastUpdated : Date.now(),
      loading     : false,
      error       : null
    }
  } catch (err) {
    console.error(`[${vault.symbol}] fatal:`, err)
    return {
      ...vault,
      tvl         : 'N/A',
      healthFactor: null,
      hfDisplay   : 'ERR',
      apyDisplay  : 'N/A',
      isSolvent   : false,
      riskLevel   : 'UNKNOWN',
      riskColor   : '#6B5A3E',
      gaugeScore  : 50,
      lastUpdated : Date.now(),
      loading     : false,
      error       : err.message
    }
  }
}

export function useVaults() {
  const [vaultData, setVaultData] = useState(
    VAULTS.map(v => ({
      ...v,
      tvl         : null,
      healthFactor: null,
      hfDisplay   : '...',
      apyDisplay  : '...',
      isSolvent   : false,
      riskLevel   : 'LOADING',
      riskColor   : '#8B5E0A',
      gaugeScore  : 50,
      lastUpdated : null,
      loading     : true,
      error       : null
    }))
  )
  const [globalError, setGlobalError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const results  = await Promise.all(VAULTS.map(v => fetchVaultData(provider, v)))
      setVaultData(results)
      setLastRefresh(Date.now())
      setGlobalError(null)
    } catch (err) {
      setGlobalError(err.message)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchAll])

  return { vaultData, globalError, lastRefresh, refresh: fetchAll }
}