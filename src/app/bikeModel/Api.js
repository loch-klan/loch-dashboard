import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";
import { getAllVehiclePricing } from "./BikeModelAction";

export const addUpdateBikeModelApi = (data, cb) => {
  return postLoginInstance
    .post("offering/vehicle/add-update-vehicle-model", data)
    .then((res) => {
      if (!res.data.error) {
        cb();
        toast.success(res.data.message || "Something went wrong");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong");
    });
};

export const getAllBikeModelsApi = (ctx) => {
  const { searchText, searchKey } = ctx.state;
  let data = new URLSearchParams();
  data.append("start", (ctx.state.page - 1) * API_LIMIT);
  data.append("limit", API_LIMIT);
  data.append(
    "conditions",
    JSON.stringify(searchText ? [{ key: searchKey, value: searchText }] : [])
  );
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/offering/vehicle/search-vehicle-model", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          bikeModels: res.data.data.data.results,
          totalPages: Math.ceil(res.data.data.data.totalCount / API_LIMIT),
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getBikeModelByIdApi = (data, ctx) => {
  postLoginInstance
    .post("offering/vehicle/get-vehicle-model", data)
    .then((res) => {
      // console.log("res", res);
      ctx.setState({
        bikeModelData: res.data.data.vehicle_model,
      });
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllVehiclePricingApi = (data) => {
  return function (dispatch, getState) {
    data.append("start", -1);
    data.append("limit", -1);
    data.append("sorts", JSON.stringify([]));
    postLoginInstance
      .post("offering/vehicle/get-vehicle-model-pricing-list", data)
      .then((res) => {
        dispatch(getAllVehiclePricing(res.data.data));
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const addUpdateVehiclePricingApi = (data, ctx, data2) => {
  // console.log('ctx',ctx);
  return postLoginInstance
    .post("offering/vehicle/add-update-vehicle-model-pricing", data)
    .then((res) => {
      if (!res.data.error) {
        // ctx.props.getAllVehiclePricingApi(data2);
        ctx.props.history.goBack();
        toast.success(res.data.message || "Something went wrong");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong");
    });
};
