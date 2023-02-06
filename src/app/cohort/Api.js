import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { AmountType, DormantType } from "../../utils/Constant";

export const createCohort = (data,ctx) => {
//   let data = new URLSearchParams();
  
  postLoginInstance
    .post("wallet/user-cohort/add-update-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log("res cohort", ctx);
          ctx.props.apiResponse && ctx.props.apiResponse(true);
         
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
          largestHoldingChain: response?.largest_holding_asset?.asset,
          LargestChainLoader: false,
          cohortId: response?.id,
          cohortName: response?.name,
          cohortSlug: response?.slug,
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
        ctx.setState({
          frequentlySoldAsset: res.data.data?.asset?.asset,
          SoldAssetLoader: false,
        });
        
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
         ctx.setState({
           frequentlyPurchasedAsset: res.data.data?.asset?.asset,
           PurchasedAssetLoader: false,
         });
        
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
        ctx.setState({
          LargestAsset: res.data.data?.asset?.asset,
          LargestValue: res.data.data?.asset?.total_value,
          LargestAssetLoader: false,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const GetLargestVolumeSold = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-largest-sold-asset", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("largest sold", res.data.data);
        ctx.setState({
          // LargestAsset: res.data.data?.asset?.asset,
          SoldVolumeLoader: false,
          LargestSoldVolume: res.data.data?.asset?.asset,
         
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const GetLargestVolumeBought = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-largest-purchased-asset", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("largest purchased asset", res.data.data);
        ctx.setState({
          // LargestAsset: res.data.data?.asset?.asset,
          // LargestValue: res.data.data?.asset?.total_value,
          // LargestAssetLoader: false,
          LargestBoughtVolume: res.data.data?.asset?.asset,
          VolumeBoughtLoader: false,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


// add-update-whale-notification
export const CreateUpdateNotification = (data,ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("communication/notification/add-update-whale-notification", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("create user", res.data.data);
        // ctx.setState({
        //   // LargestAsset: res.data.data?.asset?.asset,
        //   // LargestValue: res.data.data?.asset?.total_value,
        //   // LargestAssetLoader: false,
        //   LargestBoughtVolume: res.data.data?.asset?.asset,
        //   VolumeBoughtLoader: false,
        // });
          
      toast.success(
        <div className="custom-toast-msg" style={{ width: "43rem" }}>
          <div>Email updated</div>
          <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
            You will be receiving notifications from us there
          </div>
        </div>
      );
        
        ctx.getNotificationApi();

      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


// get-whale-notification
export const GetNotification = (data,ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("communication/notification/get-whale-notification", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("get notification", res.data.data);
        let response = res.data.data.notification;
        // console.log(
        //   DormantType.getText(response.dormant_type),
        //   AmountType.getText(response.amount_type)
        // );
        ctx.setState({
          // LargestAsset: res.data.data?.asset?.asset,
          // LargestValue: res.data.data?.asset?.total_value,
          // LargestAssetLoader: false,
          title: response?.amount_type
            ? AmountType.getText(response?.amount_type)
            : "$1,000.00",
          titleday: response?.dormant_type
            ? DormantType.getText(response?.dormant_type)
            : ">30 days",
          email: response?.email ? response?.email : "",
          walletNotification: response?.amount_type ? true : false,
          dayNotification: response?.dormant_type ? true : false,
          notificationId: response ? response.id : false,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};