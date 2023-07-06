import axios from "axios";
import { API_BASE_URL } from "./Constant";
import { getToken, deleteToken } from "./ManageToken";

const postLoginInstance = axios.create({
  // baseURL: 'http://13.232.184.100/hbits/dev',  // Url for Dev
  // baseURL: 'http://15.206.55.156/api/', // Url for UAT
  baseURL: API_BASE_URL, // Url for UAT
  // baseURL: 'http://127.0.0.1:5000/api', // Url for Local
  // baseURL: 'http://3.7.185.1/api/',  // Url for Production
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
// SET THE AUTH TOKEN FOR ANY REQUEST
postLoginInstance.interceptors.request.use(function (config) {
  config.headers.Authorization = getToken();
  return config;
});
// INTERCEPT RESPONSE TO CHECK IF TOKEN HAS EXPIRED AND IF YES THEN REDIRECT TO LOGIN OR HOME
postLoginInstance.interceptors.response.use(undefined, (error) => {
  console.log("error", error);
  if (error?.response?.status === 401) {
    deleteToken();
    window.location = "/";
  }
  return Promise.reject(error);
});

export default postLoginInstance;
