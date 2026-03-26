// Concrete Protocol ERC-4626 Vault Addresses — Ethereum Mainnet
export const VAULTS = [
  {
    id: 'usdt',
    name: 'USDT Vault',
    symbol: 'USDT',
    address: '0x0E609b710da5e0AA476224b6c0e5445cCc21251E',
    decimals: 6,
    strategies: {
      aave: {
        asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        type: 'aave_v3'
      },
      morpho: {
        asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        type: 'morpho'
      }
    }
  },
  {
    id: 'weeth',
    name: 'weETH Vault',
    symbol: 'weETH',
    address: '0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20',
    decimals: 18,
    strategies: {
      aave: {
        asset: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
        type: 'aave_v3'
      },
      silo: {
        asset: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
        type: 'silo'
      }
    }
  },
  {
    id: 'wbtc',
    name: 'WBTC Vault',
    symbol: 'WBTC',
    address: '0xacce65B9dB4810125adDEa9797BaAaaaD2B73788',
    decimals: 8,
    strategies: {
      morpho: {
        asset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        type: 'morpho'
      },
      radiant: {
        asset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        type: 'radiant'
      }
    }
  },
  {
    id: 'frxusd',
    name: 'frxUSD+ Vault',
    symbol: 'frxUSD+',
    address: '0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f',
    decimals: 18,
    // frxUSD is not listed on Aave — use USDC as APY proxy (closest USD benchmark)
    apyProxyAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    strategies: {
      morpho: {
        asset: '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29',
        type: 'morpho'
      },
      silo: {
        asset: '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29',
        type: 'silo'
      }
    }
  }
]

export const AAVE_POOL_ABI = [
  'function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
]

export const AAVE_DATA_PROVIDER_ABI = [
  'function getReserveData(address asset) view returns (uint256 unbacked, uint256 accruedToTreasuryScaled, uint256 totalAToken, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp)'
]

export const VAULT_ABI = [
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function asset() view returns (address)'
]

export const AAVE_POOL_ADDRESS     = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'
export const AAVE_DATA_PROVIDER    = '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3'

// HF thresholds → gauge risk zones
export const RISK_THRESHOLDS = {
  CRITICAL : 1.1,
  HIGH     : 1.5,
  MEDIUM   : 2.0,
  LOW      : 3.0,
  SAFE     : 999
}