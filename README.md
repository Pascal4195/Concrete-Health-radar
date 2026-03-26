# 🗿 Concrete Risk Radar

Community-built real-time risk dashboard for [Concrete Protocol](https://concrete.xyz) ERC-4626 vaults on Ethereum Mainnet.

Built by [@zerodollar_Anon](https://x.com/zerodollar_Anon) — not affiliated with Concrete Protocol.

---

## Tracked Vaults

| Symbol   | Address                                      | Strategies        |
|----------|----------------------------------------------|-------------------|
| USDT     | `0x0E609b710da5e0AA476224b6c0e5445cCc21251E` | Aave V3, Morpho   |
| weETH    | `0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20` | Aave V3, Silo     |
| WBTC     | `0xacce65B9dB4810125adDEa9797BaAaaaD2B73788` | Morpho, Radiant   |
| frxUSD+  | `0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f` | Morpho, Silo      |

---

## Features

- Animated gauge meter per vault showing liquidation risk
- Live Health Factor from `Aave V3 Pool.getUserAccountData(vaultAddress)`
- APY estimated from Aave liquidityRate (Ray-scaled, annualised)
- TVL from `ERC-4626 totalAssets()`
- Auto-refresh every 60 seconds
- Golden brown cyberpunk terminal aesthetic
- Tiled `moai.png` background (add your own to `/public/moai.png`)

---

## Deploy on Render

1. Push this repo to GitHub
2. New **Static Site** on [Render](https://render.com)
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Environment variable: `VITE_ALCHEMY_RPC_URL` = your Alchemy Ethereum Mainnet URL

Or use the included `render.yaml` for automatic config.

---

## Local Dev

```bash
cp .env.example .env.local
# Paste your Alchemy key into .env.local
npm install
npm run dev
```

---

## Methodology

**Health Factor** — read from `Aave V3 Pool.getUserAccountData(vaultAddress)`.  
Returns `healthFactor` scaled by 1e18. HF < 1.0 = liquidatable. HF = MaxUint256 = no debt.

**APY** — estimated from the primary strategy asset's Aave `liquidityRate` (Ray = 1e27):  
`APY = (1 + liquidityRate / SECONDS_PER_YEAR) ^ SECONDS_PER_YEAR - 1`

**TVL** — from `ERC-4626.totalAssets()` divided by asset decimals.

---

## Risk Zones

| Level    | Health Factor | Gauge color    |
|----------|---------------|----------------|
| SAFE     | > 3.0         | `#EDD97A` amber |
| LOW      | 2.0 – 3.0     | `#E8A020` gold  |
| MEDIUM   | 1.5 – 2.0     | `#C8860A` bronze|
| HIGH     | 1.1 – 1.5     | `#cc6600` orange|
| CRITICAL | < 1.1         | `#cc2233` red   |
