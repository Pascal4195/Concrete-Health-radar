const fetchRealData = async () => {
  try {
    const results = await Promise.all(VAULT_ADDRESSES.map(async (v) => {
      try {
        // WBTC uses 8 decimals, everything else uses 18
        const decimals = v.name.includes("WBTC") ? 8 : 18;

        // Fetching exactly what your screenshots showed
        const [allocated, assets, debt, config] = await Promise.all([
          client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getTotalAllocated' }).catch(() => 0n),
          client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalAssets' }).catch(() => 0n),
          client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'totalDebt' }).catch(() => 0n),
          client.readContract({ address: v.address, abi: VAULT_ABI, functionName: 'getVaultConfig' }).catch(() => null)
        ]);

        // Use the higher of the two asset values for TVL
        const collateralRaw = allocated > assets ? allocated : assets;
        const collateral = Number(formatUnits(collateralRaw, decimals));
        const currentDebt = Number(formatUnits(debt, decimals));
        
        // Threshold: Use contract value or default to a conservative 80%
        const threshold = config ? Number(config.liquidationThreshold) / 10000 : 0.80;

        let uiHealth = 0; 

        if (currentDebt > 0) {
          // THE AAVE FORMULA
          const hf = (collateral * threshold) / currentDebt;
          uiHealth = Math.min(Math.max((hf - 1) * 100, 0), 100);
        } else if (collateral > 0) {
          // If there is money but no debt, the vault is 100% stable
          uiHealth = 100;
        }

        return {
          name: v.name,
          health: Math.round(uiHealth),
          assets: collateral > 0 ? `$${(collateral / 1000000).toFixed(2)}M` : "$0.00M"
        };
      } catch (e) {
        return { name: v.name, health: 0, assets: "OFFLINE" };
      }
    }));

    setVaults(results);
    // Weighted global health based on TVL
    const totalTVL = results.reduce((sum, v) => sum + parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0), 0);
    const weightedAvg = totalTVL > 0 
      ? results.reduce((sum, v) => sum + (v.health * (parseFloat(v.assets.replace(/[^0-9.]/g, '') || 0) / totalTVL)), 0)
      : 0;

    setGlobalHealth(Math.round(weightedAvg));
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
