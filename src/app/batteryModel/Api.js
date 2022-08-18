import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT, START_PAGE } from "../../utils/Constant";

export const addUpdateBatteryModelApi = (data, cb) => {
  return postLoginInstance.post("offering/battery/add-update-battery-model", data)
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


export const getAllBatteryModelsApi = (ctx, page = START_PAGE) => {
  let data = new URLSearchParams();
  data.append("start", (page * API_LIMIT) || START_PAGE);
  data.append("limit", API_LIMIT);
  data.append("conditions", JSON.stringify(ctx.state.conditions || []));
  data.append("sorts", JSON.stringify([]));
  postLoginInstance.post('/offering/battery/search-battery-model', data)
    .then(res => {
      if (!res.data.error) {
        ctx.setState({
          BatteryModels: res.data.data.battery_models.results,
          totalPage: Math.ceil(res.data.data.battery_models.totalCount / API_LIMIT),
          page: page
        });
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      console.log('Catch', err);
    })
}