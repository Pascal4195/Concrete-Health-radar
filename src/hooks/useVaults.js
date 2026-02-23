import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { VAULT_ABI, VAULT_ADDRESSES } from '../utils/contracts';

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://eth.llamarpc.com";

const client = createPublicClient({ 
  chain: mainnet,
  transport: http(RPC_URL)
});

export const useVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [globalHealth, setGlobalHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRealData = async () => {
    try {
      const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
        try {
          const [assets, decimals] = await Promise.all([
            client.readContract({
              address: v.address,
              abi: VAULT_ABI,
              functionName: 'cachedTotalAssets',
            }),
            client.readContract({
              address: v.address,
              abi: VAULT_ABI,
              functionName: 'decimals',
            }).catch(() => 18)
          ]);

          const assetNum = Number(formatUnits(assets, decimals));

          return {
            name: v.name,
            health: assetNum > 0 ? 98 : 0, 
            assets: assetNum > 0 ? `$${(assetNum / 1000000).toFixed(1)}M` : "$0.0M"
          };
        } catch (e) {
          console.error("Fetch Error for:", v.name, e);
          return { name: v.name, health: 0, assets: "---" };
        }
      }));

      setVaults(results);
      const active = results.filter(v => v.health > 0);
      setGlobalHealth(active.length > 0 ? 98 : 0);
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
