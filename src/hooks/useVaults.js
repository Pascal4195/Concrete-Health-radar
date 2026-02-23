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

  const fetchRealData = async () => {
    try {
      const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
        try {
          let collateralRaw = 0n;
          let debtRaw = 0n;
          let threshold = 0.85; // Default safety buffer
          let decimals = 18;

          // 1. SET PARAMETERS BY VAULT NAME
          if (v.name.includes("WBTC")) {
            decimals = 8;
            threshold = 0.75; // Typical WBTC safety
            collateralRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' 
            }).catch(() => 0n);
            debtRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' 
            }).catch(() => 0n);
          } 
          else if (v.name.includes("USDT") || v.name.includes("frxUSD+")) {
            decimals = 18;
            collateralRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' 
            }).catch(() => 0n);
            debtRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' 
            }).catch(() => 0n);
            
            // Try to get real threshold from config
            const config = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' 
            }).catch(() => null);
            if (config?.liquidationThreshold) {
              threshold = Number(config.liquidationThreshold) / 10000;
            }
          }
          else {
            // Default/Institutional (weETH)
            decimals = 18;
            collateralRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' 
            }).catch(() => 0n);
            debtRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' 
            }).catch(() => 0n);
          }

          // 2. THE MATH (Aave Health Factor)
          const collateral = Number(formatUnits(collateralRaw, decimals));
          const debt = Number(formatUnits(debtRaw, decimals));
          
          let uiHealth = 0;

          if (debt > 0) {
            // Formula: (Collateral * Threshold) / Debt
            const healthFactor = (collateral * threshold) / debt;
            // Map 1.0 (Liquidation) to 0% and 2.0 to 100% Stability
            uiHealth = Math.min(Math.max((healthFactor - 1) * 100, 0), 100);
          } else if (collateral > 0) {
            uiHealth = 100; // Solvent with no debt
          } else {
            uiHealth = 0; // Empty vault
          }

          return {
            name: v.name,
            health: Math.round(uiHealth),
            assets: collateral > 0 ? `$${(collateral / 1000000).toFixed(2)}M` : "$0.0M"
          };

        } catch (e) {
          console.error(`Failed ${v.name}:`, e);
          return { name: v.name, health: 0, assets: "---" };
        }
      }));

      setVaults(results);
      const active = results.filter(v => v.health > 0);
      setGlobalHealth(active.length > 0 ? Math.round(active.reduce((a, b) => a + b.health, 0) / active.length) : 0);
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
