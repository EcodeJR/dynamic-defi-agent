import { WalletState } from "./types";

export function simulateWallet(): WalletState {
  return {
    address: "0xSIMULATED_WALLET",
    chain: "ethereum",
    balances: [
      { asset: "ETH", amount: 10 },
      { asset: "USDC", amount: 5000 },
    ],
  };
}
