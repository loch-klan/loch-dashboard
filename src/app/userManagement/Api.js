import { toast } from "react-toastify"
import { postLoginInstance } from "../../utils"
import { API_LIMIT, START_PAGE } from "../../utils/Constant"
import { calculateTotalPageCount } from "../../utils/ReusableFunctions"

export const getAllAccountApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    data.append("start", page * API_LIMIT || START_PAGE)
    data.append("limit", API_LIMIT)
    data.append("conditions", JSON.stringify(ctx.state.conditions || []))
    data.append("sorts", JSON.stringify([]))

    postLoginInstance
      .post("/organisation/user/search-accounts", data)
      .then((res) => {
        ctx.setState({
          data: res.data.data.results,
          totalCount: res.data.data.total_count,
          totalPage: calculateTotalPageCount(res.data.data.total_count),
          page: page
        })
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const addUpdateAccountApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/add-new-account", data)
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

export const getAllUserApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    data.append("start", page * API_LIMIT || START_PAGE)
    data.append("limit", API_LIMIT)
    data.append("conditions", JSON.stringify(ctx.state.conditions || []))
    data.append("sorts", JSON.stringify([]))

    postLoginInstance
      .post("/organisation/user/search-users", data)
      .then((res) => {
        ctx.setState({
          data: res.data.data.results,
          totalCount: res.data.data.total_count,
          totalPage: calculateTotalPageCount(res.data.data.total_count),
          page: page
        })
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const getAllRolesApi = (ctx) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    data.append(
      "account_type",
      ctx.state.userAccountType
        ? ctx.state.userAccountType
        : JSON.parse(localStorage.getItem("userDetails")).user_account_type
    )
    postLoginInstance
      .post("/organisation/authorization/get-all-roles-by-account-type", data)
      .then((res) => {
        let rolesOption = res.data.data.roles.map((item) => ({
          label: item.name,
          value: item.id
        }))
        ctx.setState({
          rolesOption: rolesOption
        })
      })
      .catch((err) => {
        console.log("Catch", err)
      })
  }
}

export const addUserApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/invite-user", data)
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

export const editUserApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/update-user", data)
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
