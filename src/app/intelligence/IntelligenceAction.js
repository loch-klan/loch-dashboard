import { ALL_TRANSACTION_HISTORY } from "./ActionTypes";

export const getAllTransactionHistory = (payload, currentPage, ctx) => ({
  type: ALL_TRANSACTION_HISTORY,
  payload,
  currentPage,
});
