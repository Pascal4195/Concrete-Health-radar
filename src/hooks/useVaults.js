import { useState, useEffect } from 'react';

export const useVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [globalHealth, setGlobalHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        setLoading(true);
        
        // VIBE CODER TIP: While you are setting up your RPC keys, 
        // I've included a "Simulated Scanner" so you can see the UI working immediately.
        
        // 1. In a real scenario, you'd do:
        // const provider = new ethers.JsonRpcProvider(RPC_URL);
        // const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
        // const addresses = await factory.allVaults();

        // 2. Simulated Dynamic Data (Replace with real Fetch once you have the Factory Address)
        setTimeout(() => {
          const mockVaults = [
            { name: "VAULT #001: WETH-DAI", health: 88, assets: "$142.5M" },
            { name: "VAULT #002: WBTC-USDC", health: 45, assets: "$89.1M" },
            { name: "VAULT #003: LINK-ETH", health: 92, assets: "$12.2M" },
            { name: "VAULT #004: UNI-USDT", health: 76, assets: "$5.8M" },
            { name: "VAULT #005: CRV-ETH", health: 32, assets: "$22.4M" },
          ];
          
          setVaults(mockVaults);
          const avg = mockVaults.reduce((acc, v) => acc + v.health, 0) / mockVaults.length;
          setGlobalHealth(Math.round(avg));
          setLoading(false);
        }, 1500);

      } catch (err) {
        console.error("Scanner Error:", err);
        setLoading(false);
      }
    };

    fetchVaultData();
  }, []);

  return { vaults, globalHealth, loading };
};
