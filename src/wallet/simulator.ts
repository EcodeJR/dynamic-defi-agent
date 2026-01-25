import { WalletState } from "./types";

export function simulateWallet(): WalletState {
  return {
    address: "0xSIMULATED_WALLET",
    chain: "ethereum",
    balance: 100000,
    canExecute: true,
  };
}
