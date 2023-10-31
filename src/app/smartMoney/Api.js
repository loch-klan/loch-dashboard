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
