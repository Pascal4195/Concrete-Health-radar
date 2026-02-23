export const VAULT_ABI = [
  {
    "inputs": [],
    "name": "getHealthFactor", // Matches item #13 in your screenshot
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets", // Matches ERC-4626 standard
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const VAULT_ADDRESSES = [
  { name: "USDT Vault", address: "0x0E609b710da5e0AA476224b6c0e5445cCc21251E" },
  { name: "WeETH Vault", address: "0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20" },
  { name: "WBTC Vault", address: "0xacce65B9dB4810125adDEa9797BaAaaaD2B73788" },
  { name: "frxUSD+ Vault", address: "0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f" }
];
