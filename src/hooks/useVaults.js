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
          const healthRaw = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'getHealthFactor',
          }).catch(() => 0n);

          const assetsRaw = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'totalAssets',
          }).catch(() => 0n);

          // Health Factor of 1.5e18 = 150. Anything above 100 is safe.
          const healthNum = Number(formatUnits(healthRaw, 16)); 
          const assetNum = Number(formatUnits(assetsRaw, 18));

          return {
            name: v.name,
            health: healthNum > 0 ? Math.round(healthNum) : 0,
            assets: assetNum > 0 ? `$${(assetNum / 1000000).toFixed(1)}M` : "$0.0M"
          };
        } catch (e) {
          return { name: v.name, health: 0, assets: "ERR" };
        }
      }));

      setVaults(results);
      const active = results.filter(v => v.health > 0);
      const avg = active.length > 0 ? active.reduce((acc, v) => acc + v.health, 0) / active.length : 0;
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
