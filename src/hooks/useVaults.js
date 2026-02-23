import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
// This line below is what "grabs" the addresses from your other file
import { VAULT_ABI, VAULT_ADDRESSES } from '../utils/contracts';

const client = createPublicClient({ 
  chain: mainnet,
  transport: http(import.meta.env.VITE_RPC_URL || "https://eth.llamarpc.com")
});

export const useVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [globalHealth, setGlobalHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRealData = async () => {
    try {
      const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
        try {
          // 1. Get Collateral & Debt
          const [allocated, totalAssets, debt, config, decimals] = await Promise.all([
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' }).catch(() => null),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'decimals' }).catch(() => 18)
          ]);

          const collateralRaw = allocated > totalAssets ? allocated : totalAssets;
          const collateral = Number(formatUnits(collateralRaw, decimals));
          const currentDebt = Number(formatUnits(debt, decimals));
          
          // 2. Apply Liquidation Threshold (Aave Style)
          const threshold = config ? Number(config.liquidationThreshold) / 10000 : 0.85;

          // 3. Formula: (Collateral * Threshold) / Debt
          let healthFactor = 2.0; 
          if (currentDebt > 0) {
            healthFactor = (collateral * threshold) / currentDebt;
          }

          // 4. Map to UI (1.0 Health = 0% Stress, 2.0+ Health = 100% Stability)
          const uiHealth = currentDebt > 0 
            ? Math.min(Math.max((healthFactor - 1) * 100, 0), 100) 
            : 100;

          return {
            name: v.name,
            health: Math.round(uiHealth),
            assets: collateral > 0 ? `$${(collateral / 1000000).toFixed(1)}M` : "$0.0M"
          };
        } catch (e) {
          return { name: v.name, health: 100, assets: "$0.0M" };
        }
      }));

      setVaults(results);
      const active = results.filter(v => v.assets !== "$0.0M");
      const avg = active.length > 0 ? active.reduce((a, b) => a + b.health, 0) / active.length : 100;
      setGlobalHealth(Math.round(avg));
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
