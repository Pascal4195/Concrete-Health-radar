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
          const health = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'health', // Ensure this function exists on-chain
          }).catch(() => 0n);

          const assets = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'totalAssets',
          }).catch(() => 0n);

          const formattedHealth = Number(formatUnits(health, 16)); 

          return {
            name: v.name,
            health: formattedHealth > 0 ? Math.round(formattedHealth) : 0,
            assets: assets > 0 ? `$${(Number(formatUnits(assets, 18)) / 1000000).toFixed(1)}M` : "$0M"
          };
        } catch (e) {
          return { name: v.name, health: 0, assets: "---" };
        }
      }));

      setVaults(results);
      const activeVaults = results.filter(v => v.health > 0);
      const avg = activeVaults.length > 0 
        ? activeVaults.reduce((acc, v) => acc + v.health, 0) / activeVaults.length 
        : 0;
      
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
