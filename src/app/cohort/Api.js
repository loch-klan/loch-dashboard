import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { AmountType, AssetType, DormantType, PodType } from "../../utils/Constant";
import { GET_ALL_COHORT, UPDATE_COHORT } from "./ActionTypes";

export const createCohort = (data,ctx) => {
//   let data = new URLSearchParams();
  
  postLoginInstance
    .post("wallet/user-cohort/add-update-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log("res cohort", ctx);
        ctx.setState(
          {
            podId: res?.data?.data?.cohort_id,
            uploadStatus: "Indexing",
          },
          () => {
            if (ctx.state.showWarningMsg) {
              // console.log("in")
              ctx.getPodStatusFunction();
            }
          }
        );
        if (!ctx.state.showWarningMsg) {
          // ctx.state.onHide();
           ctx.props.apiResponse && ctx.props.apiResponse(true);
        }
        // if (!ctx.state.showWarningMsg) {
           
        // }
         
      } else {
         ctx.props.apiResponse && ctx.props.apiResponse(true);
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const getPodStatus = (data, ctx) => {
  //   let data = new URLSearchParams();
  // console.log("api")

  postLoginInstance
    .post("wallet/user-cohort/get-user-cohort-status", data)
    .then((res) => {
      if (!res.data.error) {
        // getStateApi;
        ctx.setState({
          isIndexed: res?.data?.data?.indexed,
        });
        //  console.log("res cohort", ctx);
        // ctx.props.apiResponse && ctx.props.apiResponse(true);
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const notificationSend = (data, ctx) => {
  //   let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/send-cohort-update-email", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log("res cohort", ctx);
        // ctx.props.apiResponse && ctx.props.apiResponse(true);
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
        if (ctx.props.isEdit && ctx.props.isRedirect) {
          ctx.props.history.push("/whale-watching");
        }
        // console.log("delete cohort", res.data.data);
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const searchCohort = (data,ctx) => {
    // let data = new URLSearchParams();
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-cohort/search-user-cohort", data)
      .then((res) => {
        if (!res.data.error) {
          // console.log("search cohort", res.data.data?.user_cohorts.results);
          let isShare = localStorage.getItem("share_id");
          let walletAddress = JSON.parse(localStorage.getItem("addWallet"));
           const cohortCards = res.data.data?.user_cohorts.results?.filter(
             (e) => e.user_id
           );
          let isLimitExceed = ctx.state.userPlan?.whale_pod_limit == -1 ? false : cohortCards?.length > ctx.state.userPlan?.whale_pod_limit;

          let isWhaleAddressLimitExceed = false;

          // ctx.state.userPlan?.whale_pod_address_limit;
          let total_addresses = 0;

          res.data.data?.user_cohorts.results?.map((e) => {
            if (e.user_id) {
              total_addresses =
                total_addresses + e.wallet_address_details?.length;
              if (
                e.wallet_address_details?.length >
                ctx.state.userPlan?.whale_pod_address_limit
              ) {
                isWhaleAddressLimitExceed = true;
              }
            }
          });

          total_addresses = total_addresses + walletAddress?.length;

          // console.log(total_addresses);
          // console.log(walletAddress);

          if (
            (isLimitExceed && isShare) ||
            (isWhaleAddressLimitExceed && isShare)
          ) {
            ctx.setState(
              {
                isStatic: true,
              },
              () => {
                ctx.upgradeModal();
              }
            );
          }
          dispatch({
            type: GET_ALL_COHORT,
            payload: {
              cardList: res.data.data?.user_cohorts.results.sort(
                (a, b) => b.total_net_worth - a.total_net_worth)
              ,
              sortedList: res.data.data?.user_cohorts.results.sort((a, b) => b.total_net_worth - a.total_net_worth),
              total_addresses,
            },
          });


          if (ctx.state.pageName === "share") {
            ctx.handleCohort();
          }
          ctx.setState({
            // cardList: res.data.data?.user_cohorts.results,
            // sortedList: res.data.data?.user_cohorts.results,
            // total_addresses,
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
   }

  
};

// update cohort detail
export const updateCohort = (sortedList) => {
  // console.log(sortedList)
  return async function (dispatch, getState) {
    dispatch({
      type: UPDATE_COHORT,
      payload: {
        sortedList,
      },
    });
  };
};

export const getCohort = (data, ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-cohort-details", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("get cohort", res.data.data.user_cohort);
        let response = res.data.data?.user_cohort;
        if (response) {
          let sortedAddress = response?.wallet_address_details?.sort(
            (a, b) => b?.net_worth - a?.net_worth
          );

          let sortedChains = [];
          sortedAddress &&
            sortedAddress?.map((e) => {
              e.chains?.map((chain) => {
                if (!sortedChains.includes(chain?.symbol)) {
                  sortedChains.push(chain?.symbol);
                }
              });
            });
          // console.log("sorted chain", sortedChains)
          let nicknames = {};
          response?.wallet_address_details.map((item, i) => {
            nicknames[`nickname-${i + 1}`] = item.nickname;
          });
          ctx.setState({
            walletAddresses: response?.wallet_address_details,
            totalNetWorth: response?.total_net_worth,
            createOn: response?.created_on,
            addressList:response?.wallet_addresses,
            // frequentlyPurchasedAsset: response.frequently_purchased_asset,
            // frequentlySoldAsset: response.frequently_sold_asset,
            largestHoldingChain: response?.largest_holding_asset?.asset,
            LargestChainLoader: false,
            cohortId: response?.id,
            userId: response?.user_id,
            cohortName: response?.name,
            cohortSlug: response?.slug,
            chainImages: sortedChains,
            cohortType: response?.cohort_type,
            ...nicknames,
          });

          // call get defi api after getting address
          ctx.getDefiDetail();
          
        } else {
          ctx.props.history.push("/whale-watching");
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// get defi detail for cohort
export const getDefiCohort = (data, ctx) => {

  postLoginInstance
    .post("wallet/user-wallet/get-defi-balance-sheet", data)
    .then((res) => {
      if (!res.data.error) {
        let YieldValues = [];
        let DebtValues = [];
        let response = res?.data?.data?.balance_sheet;
        let totalYield = 0;
        let totalDebt = 0

         let allAssetType = [20, 30, 40, 50, 60, 70];
        allAssetType.map((e) => { 
          if (e != 30) {
            if (response[e]) {
              YieldValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: response[e],
              });
              totalYield = totalYield + response[e]; 
            } else {
              YieldValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: 0,
              });
            }
              
          } else {
            if (response[e]) {
              DebtValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: response[e],
              });
               totalDebt = totalDebt + response[e]; 
            } else {
              DebtValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: 0,
              });
            }
          }
        })
        // console.log("get-frequently-sold-asset", res.data.data);
                ctx.setState({
                  YieldValues,
                  totalYield,
                  totalDebt,
                  DebtValues,
                  DefiLoader: false,
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
         const userDetails = JSON.parse(localStorage.getItem("lochUser"));
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
          email: response?.email ? response?.email : userDetails?.email || "",
          walletNotification: response?.amount_type ? true : false,
          dayNotification: response?.dormant_type ? true : false,
          notificationId: response ? response.id : false,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};



// Update cohort name
export const UpdateCohortNickname = (data,ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/update-user-cohort-nickname", data)
    .then((res) => {
      if (!res.data.error) {
        
        // let response = res.data.data;
        toast.success("Nickname updated");
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const DeleteCohortAddress = (data, ctx) => {
  // console.log("delete")
   postLoginInstance
     .post("wallet/user-cohort/delete-cohort-address", data)
     .then((res) => {
       if (!res.data.error) {

         ctx.CheckApiResponse(true);
       } else {
         toast.error(res.data.message || "Something Went Wrong");
       }
     });
}

// Get Asset filter by  Cohort
export const GetAssetFilter= (data,ctx) => {
  // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/get-asset-filter", data)
    .then((res) => {
      if (!res.data.error) {
        let response = res.data.data?.assets;
        let assetFilter = [{ value: "allAssets", label: "All assets" }];
        response?.map((e) => {
          assetFilter.push({
            value: e._id,
            label: e.asset.name,
          });
        })
          ctx.setState({
            AssetFilterList: assetFilter,
          });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// Copy cohort
export const CopyCohort = (data, ctx) => {
 
  postLoginInstance
    .post("wallet/user-cohort/copy-user-cohort", data)
    .then((res) => {
      // console.log("test")
      if (!res.data.error) {
        // console.log("res", res.data.data)
        if (PodType.INFLUENCER === res.data.data.cohort.cohort_type) {
          let isAccess = JSON.parse(localStorage.getItem("whalepodview"));

          if (
            isAccess.access ||
            isAccess.id == res.data.data.cohort.id ||
            ctx.state.userPlan.influencer_pod_limit == -1
          ) {
            // if true
            localStorage.setItem(
              "whalepodview",
              JSON.stringify({ access: false, id: res.data.data.cohort.id })
            );
            ctx.props.history.push({
              pathname: `/whale-watching/${res.data.data.cohort.slug}`,
              state: {
                id: res.data.data.cohort.id,
                // cohortWalletList: item?.wallet_address_details,
                // chainImages: sortedChains,
                total_addresses: ctx.props.cohortState?.total_addresses,
              },
            });
          } else {
            ctx.setState(
              {
                triggerId: 3,
              },
              () => {
                ctx.upgradeModal();
              }
            );
          }
        }
        else {
              ctx.props.history.push({
                pathname: `/whale-watching/${res.data.data.cohort.slug}`,
                state: {
                  id: res.data.data.cohort.id,
                  // cohortWalletList: item?.wallet_address_details,
                  // chainImages: sortedChains,
                  // total_addresses: total_addresses,
                },
              });
        
        }
    
      } else {
        toast.error(res.data.message || "Something Went Wrong");
         ctx.props.history.push(`/whale-watching`);
      }
    });
};
