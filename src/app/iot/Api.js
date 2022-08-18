import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT, START_PAGE } from "../../utils/Constant";
import { calculateTotalPageCount } from "../../utils/ReusableFunctions";

export const getAllIotApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("start", (page * API_LIMIT) || START_PAGE);
    data.append("limit", API_LIMIT);
    data.append("conditions", JSON.stringify(ctx.state.conditions || []));
    data.append("sorts", JSON.stringify([]));

    postLoginInstance.post('/offering/telematics/search-telematics', data)
      .then(res => {
        ctx.setState({
          iotList: res.data.data.telematics.results,
          totalCount: res.data.data.telematics.totalCount,
          totalPage: calculateTotalPageCount(res.data.data.telematics.totalCount),
          page: page
        })
      })
      .catch((err) => {
        console.log('Catch', err);
      })
  };
}


export const getIotApi = (ctx) => {
  return function (dispatch, getState) {
    postLoginInstance.post('/offering/telematics/get-all-telematics')
      .then(res => {
        let iotModalOptions = res.data.data.iot_devices.map(item => ({
          label: item.serialNo,
          value: item.id,
        }))
        ctx.setState({
          iotModalOptions: iotModalOptions
        })
      })
      .catch((err) => {
        console.log('Catch', err);
      })
  };
}

export const getIotModelApi = (ctx) => {
  return function (dispatch, getState) {
    postLoginInstance.post('/offering/telematics/get-all-telematics-model')
      .then(res => {
        let iotModalOptions = res.data.data.iot_models.map(item => ({
          label: item.modelCompany + " - " + item.modelName,
          value: item.id,
        }))
        ctx.setState({
          iotModalOptions: iotModalOptions
        })
      })
      .catch((err) => {
        console.log('Catch', err);
      })
  };
}


export const addUpdateIotApi = (data, cb) => {
  return postLoginInstance.post("/offering/telematics/add-update-telematics", data)
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
