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
          let threshold = 0.85; // Default safety buffer (85%)
          
          // Specific Decimals: WBTC is 8, USDT/ETH are usually 18
          const decimals = v.name.includes("WBTC") ? 8 : 18;

          // --- INDIVIDUAL VAULT LOGIC ---
          // Each vault uses the specific functions from your Etherscan screenshots
          
          if (v.name.includes("WBTC")) {
            // WBTC Vault (Standard ERC-4626 style)
            collateralRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' 
            }).catch(() => 0n);
            
            debtRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' 
            }).catch(() => 0n);
          } 
          else {
            // Modular Vaults (USDT, weETH, frxUSD+)
            collateralRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' 
            }).catch(() => 0n);

            debtRaw = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' 
            }).catch(() => 0n);

            // Fetch real threshold from the contract config
            const config = await client.readContract({ 
              address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' 
            }).catch(() => null);
            
            if (config && config.liquidationThreshold) {
              threshold = Number(config.liquidationThreshold) / 10000;
            }
          }

          // --- THE AAVE FORMULA MATH ---
          // Health Factor = (Collateral * Threshold) / Debt
          
          const collateral = Number(formatUnits(collateralRaw, decimals));
          const debt = Number(formatUnits(debtRaw, decimals));
          
          let uiHealth = 0;

          if (debt > 0) {
            const healthFactor = (collateral * threshold) / debt;
            // Map 1.0 (Liquidation) to 0% and 2.0+ to 100% Stability
            uiHealth = Math.min(Math.max((healthFactor - 1) * 100, 0), 100);
          } else if (collateral > 0) {
            // Money is in, but no one has borrowed. 100% Healthy.
            uiHealth = 100;
          } else {
            // Vault is empty. Show 0% so the radar reflects the lack of data.
            uiHealth = 0;
          }

          return {
            name: v.name,
            health: Math.round(uiHealth),
            assets: collateral > 0 ? `$${(collateral / 1000000).toFixed(2)}M` : "$0.0M"
          };

        } catch (e) {
          console.error(`Error fetching ${v.name}:`, e);
          return { name: v.name, health: 0, assets: "---" };
        }
      }));

      setVaults(results);

      // Average health only for vaults that have assets
      const activeVaults = results.filter(v => v.assets !== "$0.0M");
      const avg = activeVaults.length > 0 
        ? activeVaults.reduce((a, b) => a + b.health, 0) / activeVaults.length 
        : 0;

      setGlobalHealth(Math.round(avg));
      setLoading(false);
    } catch (err) {
      console.error("Global Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { vaults, globalHealth, loading };
};
