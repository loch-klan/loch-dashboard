import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";

export const getTopAccounts = (data, ctx) => {
  //   let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-wallet/get-top-accounts", data)
    .then((res) => {
      if (!res.data.error) {
        let tableData = res?.data?.data?.accounts?.map((e) => ({
          account: e?.address,
          networth: e?.net_worth,
          tagName: e?.name,
          netflows: e?.net_flow,
          largestBought: e?.largest_bought_assets,
          largestSold: e?.largest_sold_assets,
        }));

        ctx.setState({
          accountList: tableData,
          tableLoading: false,
          totalPage: Math.ceil(res.data.data.total_count / API_LIMIT),
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};
