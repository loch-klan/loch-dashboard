import { toast } from "react-toastify"
import { postLoginInstance } from "../../utils"
import { API_LIMIT, START_PAGE } from "../../utils/Constant"
import { calculateTotalPageCount } from "../../utils/ReusableFunctions"

export const getAllCouponsApi = (ctx, page = START_PAGE) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams()
    data.append("start", page * API_LIMIT || START_PAGE)
    data.append("limit", API_LIMIT)
    data.append("conditions", JSON.stringify(ctx.state.conditions || []))
    data.append("sorts", JSON.stringify([]))

    postLoginInstance
      .post("/commerce/coupon/search-coupon", data)
      .then((res) => {
        ctx.setState({
          couponList: res.data.data.results,
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

export const addEditCouponsApi = (data, cb) => {
  return postLoginInstance
    .post("/commerce/coupon/add-update-coupon", data)
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

export const getApplicableCouponsApi = (data, ctx) => {
  return postLoginInstance
    .post("/commerce/coupon/get-applicable-coupons", data)
    .then((res) => {
      if (!res.data.error) {
        const couponList = res.data.data.results.map((coupon) => ({
          ...coupon,
          label: coupon.coupon_code,
          couponValue: coupon.value,
          value: coupon.id
        }))
        ctx.setState({ couponList })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong")
    })
}
