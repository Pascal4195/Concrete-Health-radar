/**
 * Concrete Vault Configuration
 * These addresses are the "Smart Contract Wallets" we are monitoring.
 */

export const VAULT_ABI = [
  {
    "inputs": [],
    "name": "getTotalAllocated",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDebt",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVaultConfig",
    "outputs": [{
      "components": [
        {"internalType": "uint64", "name": "liquidationThreshold", "type": "uint64"},
        {"internalType": "uint64", "name": "loanToValue", "type": "uint64"}
      ],
      "internalType": "struct VaultConfig",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const VAULT_ADDRESSES = [
  { 
    name: "USDT Vault", 
    address: "0x0E609b710da5e0AA476224b6c0e5445cCc21251E" 
  },
  { 
    name: "weETH Vault", 
    address: "0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20" 
  },
  { 
    name: "WBTC Vault", 
    address: "0xacce65B9dB4810125adDEa9797BaAaaaD2B73788" 
  },
  { 
    name: "frxUSD+ Vault", 
    address: "0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f" 
  }
];
