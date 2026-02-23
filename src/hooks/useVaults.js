import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { VAULT_ABI, VAULT_ADDRESSES } from '../utils/contracts';

const client = createPublicClient({ 
  chain: mainnet,
  transport: http(import.meta.env.VITE_RPC_URL || "https://eth.llamarpc.com")
});

// IMPORTANT: Ensure this is a named export to fix your build error
export const useVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [globalHealth, setGlobalHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRealData = async () => {
    try {
      const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
        try {
          // 1. Determine Decimals (WBTC = 8, others = 18)
          const isWBTC = v.name.toLowerCase().includes('wbtc');
          const decimals = isWBTC ? 8 : 18;

          // 2. Fetch Data (Allocated for Modular, totalAssets for Standard)
          const [allocated, assets, debt, config] = await Promise.all([
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' }).catch(() => null)
          ]);

          // 3. Calculate TVL and Debt
          const collateralRaw = allocated > assets ? allocated : assets;
          const collateral = Number(formatUnits(collateralRaw, decimals));
          const currentDebt = Number(formatUnits(debt, decimals));
          
          // 4. Formula: (Collateral * Threshold) / Debt
          const threshold = config ? Number(config.liquidationThreshold) / 10000 : 0.82;
          
          let uiHealth = 0; // Default to 0 to stop "Fake 100%"

          if (currentDebt > 0) {
            const hf = (collateral * threshold) / currentDebt;
            uiHealth = Math.min(Math.max((hf - 1) * 100, 0), 100);
          } else if (collateral > 0) {
            uiHealth = 100; // Solvent but no debt
          }

          return {
            name: v.name,
            health: Math.round(uiHealth),
            assets: collateral > 0 ? `$${(collateral / 1000000).toFixed(2)}M` : "$0.00M"
          };
        } catch (e) {
          return { name: v.name, health: 0, assets: "SYNCING" };
        }
      }));

      setVaults(results);
      
      // Calculate Weighted Global Health
      const totalTVL = results.reduce((sum, v) => sum + parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0), 0);
      const weightedAvg = totalTVL > 0 
        ? results.reduce((sum, v) => sum + (v.health * (parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0) / totalTVL)), 0)
        : 0;

      setGlobalHealth(Math.round(weightedAvg));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { vaults, globalHealth, loading };
};
