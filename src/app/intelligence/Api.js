import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllTransactionHistory } from "./IntelligenceAction";
import { getProfitAndLossData} from "./getProfitAndLossData";
import { CurrencyType } from "../../utils/ReusableFunctions";
import { getProfitLossAsset } from "./stackGrapgh";

export const searchTransactionApi = (data , ctx, page = 0) => {
    return function (dispatch, getState) {
        postLoginInstance.post("wallet/transaction/search-transaction", data)
            .then((res) => {
                // console.log(page)
                if (!res.data.error) {
                    dispatch(getAllTransactionHistory(res.data.data, page))
                    if(ctx){
                        ctx.setState({
                            tableLoading: false,
                        })
                    }
                }
                else {
                    toast.error(res.data.message || "Something Went Wrong")
                }
            })
            .catch((err) => {
                // console.log("Search transaction ", err)
            })
    }
}

export const getFilters = (ctx) => {
    let data = new URLSearchParams()
    postLoginInstance.post("wallet/transaction/get-transaction-filter", data)
        .then((res) => {
            let assetFilter = [{value : "allAssets" , label : "All assets"}]
            res.data.data.filters.asset_filters.map((item) => {
                let obj = {
                    value: item._id,
                    label: item.asset.name,
                }
                assetFilter.push(obj)
            })
            let yearFilter = [{value:'allYear',label:'All years'}]
            res.data.data.filters.year_filter.map((item)=>{
                let obj  = {
                    value: item,
                    label: item,
                }
                yearFilter.push(obj)
            })
            let methodFilter = [{value:'allMethod',label:'All methods'}]
            res.data.data.filters.method_filters.map((item)=>{
                let obj  = {
                    value: item,
                    label: item,
                }
                methodFilter.push(obj)
            })
            if (ctx){
                ctx.setState({
                    assetFilter,
                    yearFilter,
                    methodFilter
                })
            }
        })
        .catch((err) => {
            // console.log("getFilter ", err)
        })
}

export const getProfitAndLossApi = (
  ctx,
  startDate,
  endDate,
  selectedChains = false,
  selectedAsset = false
) => {
  // console.log("inside api", startDate,endDate)

  let data = new URLSearchParams();
  if (startDate) {
    data.append("start_datetime", startDate);
    data.append("end_datetime", endDate);
  }
  if (selectedChains && selectedChains.length > 0) {
    data.append("chains", JSON.stringify(selectedChains));
  }
  if (selectedAsset && selectedAsset.length > 0) {
    data.append("asset_ids", JSON.stringify(selectedAsset));
  }
  postLoginInstance
    .post("wallet/transaction/get-profit-loss", data)
    .then((res) => {
      //   console.log("calling get profit and loss");
      if (!res.data.error) {
        ctx.setState({
          GraphData: res.data.data.profit_loss,
          netFlowLoading: false,
          graphValue: getProfitAndLossData(res.data.data.profit_loss),
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

 export const getAllInsightsApi = (ctx) =>{
  let data = new URLSearchParams();
  data.append("currency_code", CurrencyType(true))
  postLoginInstance.post("wallet/user-wallet/get-wallet-insights", data)
  .then((res)=>{
      if (!res.data.error) {
        // console.log("insights", res.data.data.insights);
     

        if (ctx?.currentPage === "Home") {
           ctx.setState({
             insightList: res.data.data.insights,
             updatedInsightList: res.data.data.insights,
             isLoadingInsight: false,
           });
          
        } else {
           ctx.setState({
             insightList: res.data.data.insights,
             updatedInsightList: res.data.data.insights,
             isLoading: false,
           });
        }
    } else{
      toast.error(res.data.message || "Something Went Wrong")
    }
  })
  .catch((err)=>{
    // console.log("err ", err)
  })
 }

 export const getAssetProfitLoss = (
   ctx,
   startDate,
   endDate,
   selectedChains = false,
   selectedAsset = false
 ) => {
   let data = new URLSearchParams();
   if (startDate) {
     data.append("start_datetime", startDate);
     data.append("end_datetime", endDate);
   }
   if (selectedChains && selectedChains.length > 0) {
     data.append("chains", JSON.stringify(selectedChains));
   }
if (selectedAsset && selectedAsset.length > 0) {
  data.append("asset_ids", JSON.stringify(selectedAsset));
}

   

   postLoginInstance
     .post("wallet/transaction/get-asset-profit-loss", data)
     .then((res) => {
       if (!res.data.error) {
        //  console.log("get profit loss", res.data.data);
         ctx.setState({
           ProfitLossAsset: getProfitLossAsset(res.data.data?.profit_loss),
           //    updatedInsightList: res.data.data.insights,
           //    isLoading: false,
         });
       } else {
         toast.error(res.data.message || "Something Went Wrong");
       }
     })
     .catch((err) => {
       // console.log("err ", err)
     });
 };

 export const getTransactionAsset = (data,ctx) => {
   postLoginInstance
     .post("wallet/transaction/get-transaction-asset-filter")
     .then((res) => {
       if (!res.data.error) {
        
          let assetFilter = [{ value: "allAssets", label: "All assets" }];
          res?.data?.data?.assets?.map((e) => {
            assetFilter.push({
              value: e._id,
              label: e.asset.name,
            });
          });
         ctx.setState({
           AssetList: assetFilter,
         });
       } else {
         toast.error(res.data.message || "Something Went Wrong");
       }
     })
     .catch((err) => {
       // console.log("err ", err)
     });
 };