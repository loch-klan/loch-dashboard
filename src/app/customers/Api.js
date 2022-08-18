import { toast } from "react-toastify"
import { postLoginInstance } from "../../utils"
import { API_LIMIT, START_PAGE } from "../../utils/Constant"

export const addUpdateCustomerApi = (data, cb) => {
  postLoginInstance
    .post("/organisation/user/add-update-customer", data)
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

export const getAllCustomersApi = (
  ctx,
  optionsList = false,
  customerInfo = null
) => {
  console.log("customerInfo", customerInfo)
  const { searchText, searchKey } = ctx.state
  console.log("ctx.state.page * API_LIMIT", ctx.state.page)
  let data = new URLSearchParams()
  if (optionsList) {
    data.append("start", -1)
    data.append("limit", -1)
  } else {
    data.append("start", (ctx.state.page - 1) * API_LIMIT || START_PAGE)
    data.append("limit", API_LIMIT)
  }
  // data.append("start", (ctx.state.page - 1) * API_LIMIT);
  // data.append("limit", API_LIMIT);
  data.append(
    "conditions",
    JSON.stringify(searchText ? [{ key: searchKey, value: searchText }] : [])
  )
  data.append("sorts", JSON.stringify([]))
  postLoginInstance
    .post("/organisation/user/search-customer", data)
    .then((res) => {
      if (!res.data.error) {
        let phoneNumberOptions = res.data.data.results.map((item) => ({
          ...item,
          label: item.mobile || "Null",
          value: item.id
        }))
        const selectedCustomer = customerInfo
          ? phoneNumberOptions.filter(
              (item) => item.id === customerInfo.user_details.id
            )
          : ""
        if (optionsList) {
          ctx.setState({
            phoneNumberOptions,
            ...(customerInfo && {
              customerInfo: customerInfo.user_details,
              showAddCustomer: false,
              phoneNumber: customerInfo.user_details.id,
              selectedCustomer
            })
          })
        } else {
          ctx.setState({
            customersList: res.data.data.results,
            totalPages: Math.ceil(res.data.data.total_count / API_LIMIT)
          })
        }
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      console.log("Catch", err)
    })
}

export const getCustomerDetailsApi = (id, ctx) => {
  let data = new URLSearchParams()
  data.append("customer_id", id)
  postLoginInstance
    .post("/organisation/user/get-customer-details", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          customerData: res.data.data
        })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      console.log("Catch", err)
    })
}

export const addRewardsApi = (data, cb) => {
  return postLoginInstance
    .post("/organisation/user/add-customer-reward", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        toast.success(res.data.message || "Rewards added.")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}

export const getRewardsByCustomerApi = (id, ctx) => {
  let data = new URLSearchParams()
  data.append("user_id", id)
  return postLoginInstance
    .post("organisation/user/get-reward-history-by-user", data)
    .then((res) => {
      if (!res.data.error) {
        // cb()
        console.log("res", res)
        ctx.setState({
          customerRewardList: res.data.data.results,
          totalPages: Math.ceil(res.data.data.total_count / API_LIMIT)
        })
        // toast.success(res.data.message || "Rewards added.")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}

export const updateCustomerStatusApi = (data, ctx) => {
  return postLoginInstance
    .post("organisation/user/activate-deactivate-customer", data)
    .then((res) => {
      if (!res.data.error) {
        getAllCustomersApi(ctx)
        toast.success(res.data.message || "Updated")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}
