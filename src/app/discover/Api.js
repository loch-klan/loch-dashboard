import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";


export const getTopAccounts = (data,ctx) => {
  //   let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-wallet/get-top-accounts",data)
    .then((res) => {
      if (!res.data.error) {
        let tableData = res?.data?.data?.accounts?.map((e) => ({
          account: e?.address,
          networth: e?.net_worth,
          tagName: e?.name,
          // netflows: 37344,
          // largestBought: [
          //   {
          //     name: "ETH 1",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          //   {
          //     name: "ETH 2",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          //   {
          //     name: "ETH 3",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          // ],
          // largestSold: [
          //   {
          //     name: "ETH 1",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          //   {
          //     name: "ETH 2",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          //   {
          //     name: "ETH 3",
          //     symbol: Ethereum,
          //     colorCode: "#7B44DA",
          //   },
          // ],
        }));

        ctx.setState({
          accountList: tableData,
          tableLoading: false,
          totalPage:  Math.ceil(res.data.data.total_count / API_LIMIT)
        });

      
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};
