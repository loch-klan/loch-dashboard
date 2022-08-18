import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";
// import { getCustomerDetailsApi } from "../customers/Api";

export const getAllVehiclesApi = (ctx, optionData) => {
  // console.log('ctx',ctx);
  const { searchText, searchKey, conditions } = ctx.state;
  let data = new URLSearchParams();
  data.append("start", (ctx.state.page - 1) * API_LIMIT);
  data.append("limit", API_LIMIT);
  data.append(
    "conditions",
    JSON.stringify(
      searchText
        ? [{ key: searchKey, value: searchText }]
        : conditions
        ? conditions
        : []
    )
  );
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/offering/vehicle/search-vehicle", data)
    .then((res) => {
      if (!res.data.error) {
        if (optionData) {
          const bikeOptions = res.data.data.data.results.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          ctx.setState({
            bikeOptions,
          });
        } else {
          ctx.setState({
            vehiclesList: res.data.data.data.results,
            totalPages: Math.ceil(res.data.data.data.totalCount / API_LIMIT),
          });
        }
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllBikeModelsDropdownApi = (ctx) => {
  let data = new URLSearchParams();
  data.append("start", 0);
  data.append("limit", 1000);
  data.append("conditions", JSON.stringify([]));
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/offering/vehicle/search-vehicle-model", data)
    .then((res) => {
      if (!res.data.error) {
        const bikeModelOptions = res.data.data.data.results.map((item) => ({
          value: item.id,
          label: item.modelName,
          noOfBatteries: item.noOfBatteries,
        }));
        ctx.setState({
          bikeModelOptions,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllVehiclesDropdownApi = (ctx) => {
  let data = new URLSearchParams();
  data.append("start", 0);
  data.append("limit", -1);
  data.append(
    "conditions",
    JSON.stringify([{ key: "SEARCH_BY_ACCOUNT_ID", value: ctx.state.dealer }])
  );
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/offering/vehicle/search-vehicle", data)
    .then((res) => {
      if (!res.data.error) {
        const vehicleOptions = res.data.data.data.results.map((item) => ({
          value: item.id,
          label: item.chassisNo,
        }));
        ctx.setState({
          vehicleOptions,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllIotDropdownApi = (ctx) => {
  postLoginInstance
    .post("/offering/telematics/get-all-telematics")
    .then((res) => {
      if (!res.data.error) {
        const iotOptions = res.data.data.iot_devices.map((item) => ({
          value: item.id,
          label: item.serialNo,
        }));
        ctx.setState({
          iotOptions,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllBatteriesDropdownApi = (ctx) => {
  let data = new URLSearchParams();
  data.append("start", 0);
  data.append("limit", -1);
  data.append("conditions", JSON.stringify([]));
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/offering/battery/search-battery", data)
    .then((res) => {
      if (!res.data.error) {
        const batteryOptions = res.data.data.batteries.results.map((item) => ({
          value: item.id,
          label: item.serialNo,
        }));
        ctx.setState({
          batteryOptions,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const addUpdateVehicleApi = (data, cb) => {
  return postLoginInstance
    .post("/offering/vehicle/add-update-vehicle", data)
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

export const getAllAccounts = (ctx, accountType, stateKey) => {
  let data = new URLSearchParams();
  data.append("start", 0);
  data.append("limit", 5000);
  data.append(
    "conditions",
    JSON.stringify([
      { key: "SEARCH_BY_TYPE", value: accountType, context: null },
    ])
  );
  data.append("sorts", JSON.stringify([]));
  postLoginInstance
    .post("/organisation/user/search-accounts", data)
    .then((res) => {
      if (!res.data.error) {
        const options = res.data.data.results.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        ctx.setState({
          [stateKey]: options,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const updateVehicleRegistrationApi = (ctx, data, cb) => {
  // console.log('ctx.state.customerData', ctx);
  postLoginInstance
    .post("offering/vehicle/update-vehicle-registration", data)
    .then((res) => {
      toast.success(res.data.message);
      // console.log('res.data.vehicle', res.data.data.vehicle);
      cb(res.data.data.vehicle);
      // ctx.props.handleClose();
      // getCustomerDetailsApi(ctx.state.customerData.id, ctx)
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const assignVehiclesToFranchiseApi = (data, cb, ctx) => {
  postLoginInstance
    .post("offering/vehicle/assign-vehicles-to-franchise", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message);
        cb();
        getAllVehiclesApi(ctx, false);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const removeVehiclesToFranchiseApi = (data, cb, ctx) => {
  postLoginInstance
    .post("offering/vehicle/remove-vehicles-from-franchise", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message);
        cb();
        getAllVehiclesApi(ctx, false);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const assignVehiclesToFranchiseLocationApi = (data, cb, ctx) => {
  // console.log('ctx',ctx);
  postLoginInstance
    .post("offering/vehicle/add-update-vehicle-franchise-location", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message);
        cb();
        getAllVehiclesApi(ctx);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const removeVehiclesFromFranchiseLocationApi = (data, cb, ctx) => {
  postLoginInstance
    .post("offering/vehicle/remove-vehicle-franchise-location", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message);
        cb();
        getAllVehiclesApi(ctx, false);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const updateStatusApi = (data, cb) => {
  postLoginInstance
    .post("offering/vehicle/update-vehicle-status", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message);
        cb();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};
