import { ALL_WALLET, RESET_ALL_WALLET } from "./ActionTypes";

export const getAllWalletList = (payload) => ({
  type: ALL_WALLET,
  payload,
});
export const resetAllWalletList = () => ({
  type: RESET_ALL_WALLET,
});
