import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { LocationType } from "../../utils/Constant";
export const getAllLocationApi = (ctx, locationType) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("location_type", locationType);

    if (locationType === LocationType.STATE && ctx.state.countryId)
      data.append("parent_id", ctx.state.countryId);

    if (locationType === LocationType.CITY && ctx.state.stateId)
      data.append("parent_id", ctx.state.stateId);

    preLoginInstance
      .post("/common/master/get-location-by-type", data)
      .then((res) => {
        let locationList = res.data.data.location.map((item) => ({
          ...item,
          value: item.id,
          label: item.name,
        }));
        ctx.setState({
          ...(locationType === LocationType.COUNTRY && {
            countryList: locationList,
          }),
          ...(locationType === LocationType.STATE && {
            stateList: locationList,
          }),
          ...(locationType === LocationType.CITY && { cityList: locationList }),
          ...(locationType === LocationType.AREA && { areaList: locationList }),
        });
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const updateLocationApi = (data, ctx) => {
  return function (dispatch, getState) {
    preLoginInstance
      .post("/common/master/add-update-location", data)
      .then((res) => {
        // let countryList = ctx.state.countryList
        // countryList =
        ctx.setState({
          ...(ctx.state.countryList && {
            countryList: ctx.state.countryList.map((item) =>
              item.id !== res.data.data.location.id
                ? item
                : res.data.data.location
            ),
          }),
          ...(ctx.state.cityList && {
            cityList: ctx.state.cityList.map((item) =>
              item.id !== res.data.data.location.id
                ? item
                : res.data.data.location
            ),
          }),
          ...(ctx.state.areaList && {
            areaList: ctx.state.areaList.map((item) =>
              item.id !== res.data.data.location.id
                ? item
                : res.data.data.location
            ),
          }),
        });
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const addUpdateLocationApi = (data, cb) => {
  // return function (dispatch, getState) {
  preLoginInstance
    .post("/common/master/add-update-location", data)
    .then((res) => {
      // console.log("res", res);
      if (!res.data.error) {
        cb();
        toast.success(res.data.message || "Something went wrong");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
  // };
};

export const resetPasswordApi = (ctx, data) => {
  preLoginInstance
    .post("organisation/user/set-reset-password", data)
    .then((res) => {
      toast.success(res.data.message || "Password set successfully");
      ctx.props.history.push("/login");
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const changePasswordApi = (ctx, data) => {
  postLoginInstance
    .post("organisation/user/change-password", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log('ctx.props', ctx.props.handleClose);
        toast.success("Password changed successfully");
        // ctx.props.history.push('/login');
        ctx.props.handleClose();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const forgotPasswordApi = (data, handleClose) => {
  preLoginInstance
    .post("organisation/user/forgot-password", data)
    .then((res) => {
      if (!res.data.error) {
        toast.success(res.data.message || "Please check your email");
        handleClose();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};
