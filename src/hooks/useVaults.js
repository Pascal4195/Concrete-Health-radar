import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { VAULT_ABI, VAULT_ADDRESSES } from '../utils/contracts';

const client = createPublicClient({ 
  chain: mainnet,
  transport: http(import.meta.env.VITE_RPC_URL || "https://eth.llamarpc.com")
});

export const useVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [globalHealth, setGlobalHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVaultData = async (v) => {
    try {
      // 1. FEATURE DETECTION: Detect "New School" vs "Old School"
      const [decimals, debtRaw] = await Promise.all([
        client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'decimals' }).catch(() => 18),
        client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' }).catch(() => 0n)
      ]);

      let collateralRaw = 0n;
      let threshold = 0.85;

      // Check for New School (getTotalAllocated)
      const allocated = await client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => null);
      
      if (allocated !== null) {
        collateralRaw = allocated;
        const config = await client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' }).catch(() => null);
        if (config?.liquidationThreshold) threshold = Number(config.liquidationThreshold) / 10000;
      } else {
        // Fallback to Old School (totalAssets)
        collateralRaw = await client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n);
        threshold = 0.75; // Standard safety for WBTC/Simple vaults
      }

      // 2. APPLY AAVE FORMULA
      const collateral = Number(formatUnits(collateralRaw, decimals));
      const debt = Number(formatUnits(debtRaw, decimals));
      
      let hf = 2.0; 
      if (debt > 0) hf = (collateral * threshold) / debt;
      else if (collateral === 0) hf = 0; // Empty = No health

      // Map HF 1.0 -> 0% UI, 2.0+ -> 100% UI
      const uiHealth = debt > 0 ? Math.min(Math.max((hf - 1) * 100, 0), 100) : (collateral > 0 ? 100 : 0);

      return {
        name: v.name,
        health: Math.round(uiHealth),
        hf: hf,
        tvl: collateral,
        assets: `$${(collateral / 1000000).toFixed(2)}M`
      };
    } catch (e) {
      return { name: v.name, health: 0, hf: 0, tvl: 0, assets: "ERR" };
    }
  };

  const updateAll = async () => {
    const results = await Promise.all(VAULT_ADDRESSES.map(fetchVaultData));
    
    // 3. COMPUTE WEIGHTED GLOBAL HEALTH
    const totalTVL = results.reduce((sum, v) => sum + v.tvl, 0);
    if (totalTVL > 0) {
      const weightedHealth = results.reduce((sum, v) => sum + (v.health * (v.tvl / totalTVL)), 0);
      setGlobalHealth(Math.round(weightedHealth));
    } else {
      setGlobalHealth(0);
    }

    setVaults(results);
    setLoading(false);
  };

  useEffect(() => {
    updateAll();
    const interval = setInterval(updateAll, 30000);
    return () => clearInterval(interval);
  }, []);

  return { vaults, globalHealth, loading };
};
