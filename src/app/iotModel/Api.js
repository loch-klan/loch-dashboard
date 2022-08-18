import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";

export const addUpdateIotModelApi = (data, cb) => {
    return postLoginInstance.post("offering/telematics/add-update-telematics-model", data)
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


export const getAllIotModelsApi = (ctx) => {
    const { searchText, searchKey } = ctx.state;
    let data = new URLSearchParams();
    data.append("start", (ctx.state.page - 1) * API_LIMIT);
    data.append("limit", API_LIMIT);
    data.append("conditions", JSON.stringify(
        searchText ? [{ key: searchKey, value: searchText }] : [],
    ));
    data.append("sorts", JSON.stringify([]));
    postLoginInstance.post('/offering/telematics/search-telematics-model', data)
        .then(res => {
            if (!res.data.error) {
                ctx.setState({
                    iotModels: res.data.data.telematics_model.results,
                    totalPages: Math.ceil(res.data.data.telematics_model.totalCount / API_LIMIT)
                });
            } else {
                toast.error(res.data.message || "Something went wrong")
            }
        })
        .catch((err) => {
            console.log('Catch', err);
        })
}