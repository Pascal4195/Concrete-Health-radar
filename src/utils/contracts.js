export const VAULT_ABI = [
  // New School / Modular
  { "inputs": [], "name": "getTotalAllocated", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getVaultConfig", "outputs": [{ "components": [{"name": "liquidationThreshold", "type": "uint64"}], "type": "tuple" }], "stateMutability": "view", "type": "function" },
  // Old School / Standard
  { "inputs": [], "name": "totalAssets", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalDebt", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "decimals", "outputs": [{ "type": "uint8" }], "stateMutability": "view", "type": "function" }
];

export const VAULT_ADDRESSES = [
  { name: "USDT Vault", address: "0x0E609b710da5e0AA476224b6c0e5445cCc21251E" },
  { name: "weETH Vault", address: "0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20" },
  { name: "WBTC Vault", address: "0xacce65B9dB4810125adDEa9797BaAaaaD2B73788" },
  { name: "frxUSD+ Vault", address: "0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f" }
];
