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
          const decimals = v.name.includes("WBTC") ? 8 : 18;

          // Pull ONLY the raw data we saw in your Etherscan screenshots
          const [allocatedRaw, assetsRaw] = await Promise.all([
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => 0n),
            client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n)
          ]);

          const allocated = Number(formatUnits(allocatedRaw, decimals));
          const total = Number(formatUnits(assetsRaw, decimals));

          // --- NEW FORMULA: SOLVENCY & UTILIZATION ---
          let score = 0;
          if (total > 0) {
            // How much of the TVL is actually 'Allocated' to strategies?
            score = (allocated / total) * 100;
          }

          return {
            name: v.name,
            health: Math.round(Math.min(score, 100)), // Caps at 100%
            assets: total > 0 ? `$${(total / 1000000).toFixed(2)}M` : "$0.00M"
          };
        } catch (e) {
          return { name: v.name, health: 0, assets: "OFFLINE" };
        }
      }));

      setVaults(results);
      
      // Global Radar is the average of all active vault scores
      const active = results.filter(v => v.assets !== "$0.00M");
      const avg = active.length > 0 ? active.reduce((a, b) => a + b.health, 0) / active.length : 0;
      
      setGlobalHealth(Math.round(avg));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 15000); // Faster refresh
    return () => clearInterval(interval);
  }, []);

  return { vaults, globalHealth, loading };
};
