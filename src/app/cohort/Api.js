import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";

export const createCohort = (data,ctx) => {
//   let data = new URLSearchParams();
  
  postLoginInstance
    .post("wallet/user-cohort/add-update-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
          ctx.props.apiResponse(true);
          console.log("res cohort", res.data.data, ctx)
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const searchCohort = (data,ctx) => {
    // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/search-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("search cohort", res.data.data)
        ctx.setState({
          cardList: res.data.data.user_cohorts.results,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};



export const getCohort = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-cohort-details", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("get cohort", res.data.data.user_cohort);
        let response = res.data.data.user_cohort;
        ctx.setState({
          walletAddresses: response.wallet_addresses,
          totalNetWorth: response.total_net_worth,
          createOn: response.created_on,
          frequentlyPurchasedAsset: response.frequently_purchased_asset,
          frequentlySoldAsset: response.frequently_sold_asset,
          largestHoldingChain: response.largest_holding_chain,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};
