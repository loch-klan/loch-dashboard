import { WALLET_LIST } from "./ActionTypes";

export const getAllWalletList = (payload) => ({
  type: WALLET_LIST,
  payload,
});
