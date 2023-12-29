import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";

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

export const GetAssetFilter = (data, ctx) => {
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
        });
        ctx.setState({
          AssetFilterList: assetFilter,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// Copy cohort
