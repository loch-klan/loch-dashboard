import axios from 'axios';
import { getToken, deleteToken, getScope } from "./ManageToken";

const postLoginInstance = axios.create(
  {
    // baseURL: 'http://13.232.184.100/hbits/dev',  // Url for Dev
    baseURL: 'https://sapi-float.ebikego.com/api/', // Url for UAT
    // baseURL: 'http://127.0.0.1:5000/api', // Url for Local
    // baseURL: 'http://3.7.185.1/api/',  // Url for Production
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
);
// SET THE AUTH TOKEN FOR ANY REQUEST
postLoginInstance.interceptors.request.use(function (config) {
  config.headers.Authorization = getToken();
  config.headers.Scope = JSON.stringify(
    {
      "account_ids": [getScope()],
      // FOR VEHICLE REGISTRATION NUMBER UPDATE API
      ...(config.url === "offering/vehicle/update-vehicle-registration" && { "vehicle_id": localStorage.getItem("vehicleId") })
    },
  );
  return config;
});
// INTERCEPT RESPONSE TO CHECK IF TOKEN HAS EXPIRED AND IF YES THEN REDIRECT TO LOGIN OR HOME
postLoginInstance.interceptors.response.use(undefined, (error) => {
  console.log('error',error.response);
  // if (error.response.status === 401) {
  //   deleteToken();
  //   window.location = "/";
  // }
  return Promise.reject(error);
});

export default postLoginInstance;