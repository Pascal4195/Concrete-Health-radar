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
          // Hard-coded decimal check for WBTC
          const isWBTC = v.name.toLowerCase().includes('wbtc');
          const decimals = isWBTC ? 8 : 18;

          // Fetch values seen in your Etherscan screenshots
          const [allocated, assets, debt, config] = await Promise.all([
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' }).catch(() => null)
          ]);

          // Calculate TVL: Take whichever is higher
          const collateralRaw = allocated > assets ? allocated : assets;
          const collateral = Number(formatUnits(collateralRaw, decimals));
          const currentDebt = Number(formatUnits(debt, decimals));
          
          // Aave Health Factor Logic
          const threshold = config ? Number(config.liquidationThreshold) / 10000 : 0.82;
          
          let uiHealth = 0; 
          if (currentDebt > 0) {
            // HF = (Collateral * Threshold) / Debt
            const hf = (collateral * threshold) / currentDebt;
            uiHealth = Math.min(Math.max((hf - 1) * 100, 0), 100);
          } else if (collateral > 0) {
            // Solvent with no debt = 100% stable
            uiHealth = 100;
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
      
      // Compute weighted health: Big vaults impact the radar more
      const totalTVL = results.reduce((sum, v) => sum + parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0), 0);
      const weightedAvg = totalTVL > 0 
        ? results.reduce((sum, v) => sum + (v.health * (parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0) / totalTVL)), 0)
        : 0;

      setGlobalHealth(Math.round(weightedAvg || 0));
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
