import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT, START_PAGE } from "../../utils/Constant";
import { calculateTotalPageCount } from "../../utils/ReusableFunctions";

export const getAllBatteryApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("start", (page * API_LIMIT) || START_PAGE);
    data.append("limit", API_LIMIT);
    data.append("conditions", JSON.stringify(ctx.state.conditions || []));
    data.append("sorts", JSON.stringify([]));

    postLoginInstance.post('/offering/battery/search-battery', data)
      .then(res => {
        /* let data = res.data.data.batteries.results.map(item => ({
          modelInfo: item.modelInfo,
          batteryModel: item.modelInfo.modelName,
          batteryDeviceId: item.id,
          orderDate: item.createdOn,
          status: item.active ? "Attached" : "InActive"
        })) */
        ctx.setState({
          // data: data,
          batteryList: res.data.data.batteries.results,
          totalCount: res.data.data.batteries.totalCount,
          totalPage: calculateTotalPageCount(res.data.data.batteries.totalCount),
          page: page
        })
      })
      .catch((err) => {
        console.log('Catch', err);
      })
  };
}


export const getBatteryModelApi = (ctx) => {
  return function (dispatch, getState) {
    postLoginInstance.post('/offering/battery/get-all-battery-models')
      .then(res => {
        let batteryModalOptions = res.data.data.battery_models.map(item => ({
          label: item.modelCompany + " - " + item.modelName,
          value: item.id,
        }))
        ctx.setState({
          batteryModalOptions: batteryModalOptions
        })
      })
      .catch((err) => {
        console.log('Catch', err);
      })
  };
}

export const addUpdateBatteryApi = (data, cb) => {
  return postLoginInstance.post("/offering/battery/add-update-battery", data)
    .then((res) => {
      if (!res.data.error) {
        cb();
        toast.success(res.data.message || "Something went wrong")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong");
    });
};

