import { postLoginInstance, preLoginInstance } from "../../utils";

export const fetchPosts = (cityName) => {
  return function (dispatch, getState) {
    // dispatch(requestPosts());
    console.log("clicked", getState());
    return preLoginInstance
      .get(
        `weather?q=${cityName},uk&APPID=${process.env.REACT_APP_WEATHER_API}/`
      )
      .then((res) => {
        console.log("res", res);
      });
  };
};
export const addExchangeTransaction = (data) => {
  return async function () {
    console.log("add-exchange-transactions called");
    postLoginInstance

      .post("wallet/user-wallet/add-exchange-transactions", data)
      .then((response) => {
        console.log("add-exchange-transactions response is ", response);
      })
      .catch((error) => {
        console.log("add-exchange-transactions error is ", error);
      });
  };
};
