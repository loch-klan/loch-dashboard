import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";

export const getSmartMoney = (data, ctx, apiLimit) => {
  return async function (dispatch, getState) {
    postLoginInstance

      .post("wallet/user-wallet/get-smart-money", data)
      .then((res) => {
        if (!res.data.error) {
          let tempLimit = API_LIMIT;
          if (apiLimit) {
            const numberLimit = Number(apiLimit);
            tempLimit = numberLimit;
          }
          let tableData = res?.data?.data?.accounts?.map((e) => ({
            account: e?.address,
            networth: e?.net_worth,
            tagName: e?.name_tag,
            netflows: e?.net_flow,
            profits: e?.profits,
            returns: e?.returns,
            rank: e?.rank,
          }));
          ctx.setState({
            accountList: tableData,
            tableLoading: false,
            totalPage: Math.ceil(res.data.data.total_count / tempLimit),
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
export const addSmartMoney = (data, ctx, apiLimit) => {
  return async function (dispatch, getState) {
    postLoginInstance
      // /wallet/user-wallet/add-smart-money
      // ismein address and name_tag karke do key mein pass kardo
      .post("/wallet/user-wallet/add-smart-money", data)
      .then((res) => {
        if (!res.data.error) {
          console.log("response is ", res);
          ctx.setState({
            addButtonVisible: true,
            loadAddBtn: false,
          });
          if (res.data.message === "Succesfully added") {
            ctx.setState({
              addressAdded: true,
            });
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
