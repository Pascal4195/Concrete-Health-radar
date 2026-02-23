import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { VAULT_ABI, VAULT_ADDRESSES } from '../utils/contracts';

// Get your API key from Alchemy or Infura
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
      setLoading(true);
      
      const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
        try {
          // Fetch Health Factor (Assuming it returns a value where 1e18 = 1.0)
          const health = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'getHealthFactor',
          });

          // Fetch Total Assets
          const assets = await client.readContract({
            address: v.address,
            abi: VAULT_ABI,
            functionName: 'totalAssets',
          });

          return {
            name: v.name,
            health: Number(formatUnits(health, 16)), // Adjust decimals based on Concrete's spec
            assets: `$${Math.round(Number(formatUnits(assets, 18)) / 1000000)}M`
          };
        } catch (e) {
          console.error(`Error fetching ${v.name}:`, e);
          return { name: v.name, health: 0, assets: "Error" };
        }
      }));

      setVaults(results);
      const avg = results.reduce((acc, v) => acc + v.health, 0) / results.length;
      setGlobalHealth(Math.round(avg));
      setLoading(false);
    } catch (err) {
      console.error("Global Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { vaults, globalHealth, loading };
};
