import { toast } from "react-toastify"
import { postLoginInstance } from "../../utils"
import { API_LIMIT, START_PAGE } from "../../utils/Constant"
import { calculateTotalPageCount } from "../../utils/ReusableFunctions"
import { getAllVehiclesApi } from "../vehicles/Api"
// import {setFranchiseLocation} from './FranchiseAction';

export const getAllFranchiseApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    if (page === -1) {
      data.append("start", -1)
      data.append("limit", -1)
    } else {
      data.append("start", page * API_LIMIT || START_PAGE)
      data.append("limit", API_LIMIT)
    }
    data.append("conditions", JSON.stringify(ctx.state.conditions || []))
    data.append("sorts", JSON.stringify([]))

    postLoginInstance
      .post("/organisation/user/search-franchises", data)
      .then((res) => {
        if (page === -1) {
          let franchiseOptionsList = res.data.data.results.map((item) => ({
            value: item.id,
            label: item.legal_name
          }))
          ctx.setState({
            franchiseOptionsList
          })
        } else {
          ctx.setState({
            data: res.data.data.results,
            totalCount: res.data.data.total_count,
            totalPage: calculateTotalPageCount(res.data.data.total_count),
            page: page
          })
        }
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const addEditFranchiseApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/add-new-franchise", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        toast.success(res.data.message || "Something went wrong")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}

export const updatetFranchiseApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/update-franchise", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        toast.success(res.data.message || "Something went wrong")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}

export const getFranchiseByIdApi = (franchiseId, cb) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    data.append("franchise_id", franchiseId)

    postLoginInstance
      .post("/organisation/user/get-franchise-details", data)
      .then((res) => {
        cb(res.data.data.franchise)
        // ctx.setState({
        //     franchiseSet:,
        // })
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const getAllFranchiseLocationApi = (
  ctx,
  page = START_PAGE,
  optionsList = false
) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    // data.append("franchise_id", ctx.state.franchiseId);
    if (optionsList) {
      data.append("start", -1)
      data.append("limit", -1)
    } else {
      data.append("start", page * API_LIMIT || START_PAGE)
      data.append("limit", API_LIMIT)
    }
    data.append("conditions", JSON.stringify(ctx.state.conditions || []))
    data.append("sorts", JSON.stringify([]))
    postLoginInstance
      .post("/offering/franchise/search-franchise-locations", data)
      .then((res) => {
        // console.log('res',res);
        let franchiseLocationOption =
          res.data.data.franchise_locations.results.map((item) => ({
            label: item.location_details?.formatted_address || "Null",
            value: item.id
          }))
        if (optionsList) {
          ctx.setState({ franchiseLocationOption })
        } else {
          ctx.setState({
            data: res.data.data.franchise_locations.results,
            totalCount: res.data.data.franchise_locations.total_count,
            totalPage: calculateTotalPageCount(
              res.data.data.franchise_locations.total_count
            ),
            page: page
          })
        }
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const addUpdateFranchiseLocationApi = (data, cb) => {
  // return function (dispatch, getState) {
  postLoginInstance
    .post("/offering/franchise/add-update-franchise-location", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        toast.success(res.data.message || "Something went wrong")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      console.log("Catch", err)
    })
  // };
}

export const getFranchiseLocationByIdApi = (ctx) => {
  let data = new URLSearchParams()
  data.append("franchise_location_id", ctx.state.locationId)
  postLoginInstance
    .post("/offering/franchise/get-franchise-location-details", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log('res',res);
        ctx.setState(
          {
            data: res.data.data.franchise_location,
            conditions: [
              {
                key: "SEARCH_BY_FRANCHISE_LOCATION_ID",
                value: res.data.data.franchise_location.id
              }
            ]
          },
          () => {
            getAllVehiclesApi(ctx)
          }
        )
        // toast.success(res.data.message || "Something went wrong")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      console.log("Catch", err)
    })
}
