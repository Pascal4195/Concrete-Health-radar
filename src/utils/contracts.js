// This is the ABI for the Concrete Factory to get the list of vaults
export const FACTORY_ABI = [
  "function allVaults() view returns (address[])",
  "function getVaultDetails(address) view returns (string name, uint256 health, uint256 tvl)"
];

// Placeholder Factory Address (You will update this with the real one)
export const FACTORY_ADDRESS = "0x0000000000000000000000000000000000000000";

// Your RPC URL (Use a free tier from Alchemy or Infura)
export const RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY";
