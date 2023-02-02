import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";

export const createCohort = (data,ctx) => {
//   let data = new URLSearchParams();
  
  postLoginInstance
    .post("wallet/user-cohort/add-update-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
          ctx.props.apiResponse(true);
          // console.log("res cohort", res.data.data)
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const deleteCohort = (data, ctx) => {
  //   let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/delete-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.props.apiResponse(true);
        // console.log("delete cohort", res.data.data);
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
        // console.log("search cohort", res.data.data?.user_cohorts.results);
        ctx.setState({
          cardList: res.data.data?.user_cohorts.results,
          sortedList: res.data.data?.user_cohorts.results,
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
        // console.log("get cohort", res.data.data.user_cohort);
        let response = res.data.data?.user_cohort;
        ctx.setState({
          walletAddresses: response?.wallet_address_details,
          totalNetWorth: response?.total_net_worth,
          createOn: response?.created_on,
          // frequentlyPurchasedAsset: response.frequently_purchased_asset,
          // frequentlySoldAsset: response.frequently_sold_asset,
          largestHoldingChain: response?.largest_holding_chain,
          LargestChainLoader: false,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};



export const GetSoldAsset = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-frequently-sold-asset", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("get-frequently-sold-asset", res.data.data);
        setTimeout(() => {
          ctx.setState({
            frequentlySoldAsset: res.data.data?.asset?.asset,
            SoldAssetLoader: false,
          });
        }, 1000);
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const GetPurchasedAsset = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-frequently-purchased-asset", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("get-frequently-purchased-asset", res.data.data);
        setTimeout(() => {
          ctx.setState({
            frequentlyPurchasedAsset: res.data.data?.asset?.asset,
            PurchasedAssetLoader: false,
          });
        }, 1000);
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const GetLargestAsset = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-largest-transacted-asset", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("largest", res.data.data);
        setTimeout(() => {
          ctx.setState({
            LargestAsset: res.data.data?.asset?.asset,
            LargestAssetLoader: false,
          });
        }, 1000);
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};