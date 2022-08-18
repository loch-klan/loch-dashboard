import moment from "moment"
import { toast } from "react-toastify"
import { postLoginInstance, preLoginInstance } from "../../utils"
import { API_LIMIT, START_PAGE } from "../../utils/Constant"
import { calculateTotalPageCount } from "../../utils/ReusableFunctions"

export const getOrdersApi = (ctx, page = START_PAGE) => {
  let data = new URLSearchParams()
  data.append("start", page * API_LIMIT || START_PAGE)
  data.append("limit", API_LIMIT)
  data.append("conditions", JSON.stringify(ctx.state.conditions || []))
  data.append(
    "sorts",
    JSON.stringify([{ key: "SORT_BY_CREATED_ON", value: false }])
  )

  return postLoginInstance
    .post("/commerce/order/search-order", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          bookingsList: res.data.data.results,
          totalCount: res.data.data.total_count,
          totalPage: calculateTotalPageCount(res.data.data.total_count),
          page: page
        })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const getBookingDetailsApi = (id, ctx) => {
  const data = new URLSearchParams()
  data.append("order_id", id)
  return postLoginInstance
    .post("commerce/order/get-order-details-by-id", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({ bookingData: res.data.data.order })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const cancelOrderApi = (bookingId, reason, cb, handleClose) => {
  const data = new URLSearchParams()
  data.append("order_id", bookingId)
  data.append("cancellation_reason", reason)
  return postLoginInstance
    .post("commerce/order/cancel-order", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        handleClose()
        toast.success(res.data.message || "Order Cancelled Successfully")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const getVehiclesForOrderApi = (id, ctx) => {
  const data = new URLSearchParams()
  data.append("order_id", id)
  data.append("start", -1)
  data.append("limit", -1)
  return postLoginInstance
    .post("commerce/order/get-vehicles-for-order", data)
    .then((res) => {
      if (!res.data.error) {
        let vehicleOptions = res.data.data.results.map((item) => ({
          label: item.name + " - " + item.registration_no,
          value: item.id
        }))
        ctx.setState({ vehicleOptions: vehicleOptions })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const reassignVehicleOrderApi = (bookingId, bikeId, cb, handleClose) => {
  const data = new URLSearchParams()
  data.append("order_id", bookingId)
  data.append("vehicle_id", bikeId)
  return postLoginInstance
    .post("commerce/order/reassign-vehicle-on-order", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        handleClose()
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const markPickupOrderApi = (bookingId, cb, handleClose) => {
  const data = new URLSearchParams()
  data.append("order_id", bookingId)
  return postLoginInstance
    .post("commerce/order/mark-order-for-pickup", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        handleClose()
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const markReturnOrderApi = (bookingId, paymentMode, cb, handleClose) => {
  const data = new URLSearchParams()
  data.append("order_id", bookingId)
  data.append("payment_mode", paymentMode)
  return postLoginInstance
    .post("commerce/order/mark-order-for-return", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        handleClose()
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const addPenaltyApi = (data, cb, handleClose) => {
  return postLoginInstance
    .post("commerce/order/add-update-penalty-details", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
        handleClose()
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const addPenaltyDetailsApi = (data, ctx) => {
  return postLoginInstance
    .post("commerce/order/get-penalty-details", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          pentaltyDetails: res.data.data.extra_charges
        })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const getExtendBookingPricingApi = (
  extendDate,
  props,
  toggleStatus,
  handleExtend
) => {
  const data = new URLSearchParams()
  data.append("order_id", props.orderId)
  data.append("end_datetime", moment(extendDate).format("DD-MM-YYYY hh:mm"))
  return postLoginInstance
    .post("commerce/order/get-pricing-for-extend-order", data)
    .then((res) => {
      if (!res.data.error) {
        handleExtend({ ...res.data.data, extendDate })
      } else {
        toggleStatus(true)
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      console.log(" error: ", error)
    })
}

export const extendOrderApi = (data, props) => {
  // return function (dispatch, getState) {
  return postLoginInstance
    .post("commerce/order/extend-order", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log('res',res);
        props.handleClose()
        props.getBookingDetails()
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong")
    })
  // }
}

export const getAvailableVehiclesApi = (data, ctx) => {
  // return function (dispatch, getState) {
  return postLoginInstance
    .post("offering/vehicle/get-available-vehicles", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log('res',res);
        const bikeList = res.data.data.results.map((item) => ({
          ...item,
          label: item.model_info.model_name + " - " + item.registration_no,
          value: item.id
        }))
        ctx.setState({ bikeList })
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong")
    })
  // }
}

export const createOrderApi = (data, ctx) => {
  // return function (dispatch, getState) {
  return postLoginInstance
    .post("commerce/order/create-order", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log('res',res);
        ctx.props.history.push("/booking-management")
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong")
    })
  // }
}

export const sendOtpApi = (ctx, data) => {
  preLoginInstance
    .post("/organisation/user/send-otp", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("res", res)
        ctx.setState({ showVerifyOtp: true })
      } else {
        toast.error(res.data.message || "Something went wrong")
        ctx.setState({
          errorMessage: res.data.message || "Invalid Credentials"
        })
      }
    })
    .catch((err) => {
      ctx.setState({
        errorMessage: "Something went wrong"
      })
    })
}

export const verifyOtpApi = (ctx, data) => {
  preLoginInstance
    .post("/organisation/user/verify-otp", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("res", res)
        ctx.props.handleAddCustomer(res.data.data)
      } else {
        toast.error(res.data.message || "Something went wrong")
        ctx.setState({
          errorMessage: res.data.message || "Invalid Credentials"
        })
      }
    })
    .catch((err) => {
      ctx.setState({
        errorMessage: "Something went wrong"
      })
    })
}

export const addUpdateKYCApi = (data, cb) => {
  return postLoginInstance
    .post("commerce/order/add-update-kyc-details", data)
    .then((res) => {
      if (!res.data.error) {
        cb()
      } else {
        toast.error(res.data.message || "Something went wrong")
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong")
    })
}
