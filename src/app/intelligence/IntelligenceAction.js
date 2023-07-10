import { TOP_ALL_TRANSACTION_HISTORY } from "../topAccount/ActionTypes";
import { ALL_TRANSACTION_HISTORY } from "./ActionTypes";

export const getAllTransactionHistory = (payload, currentPage, ctx) => ({
  type: ctx?.state?.isTopAccountPage
    ? TOP_ALL_TRANSACTION_HISTORY
    : ALL_TRANSACTION_HISTORY,
  payload,
  currentPage,
});
