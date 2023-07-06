import axios from "axios";
import { API_BASE_URL } from "./Constant";

const preLoginInstance = axios.create({
  // baseURL: 'http://15.206.55.156/api/'
  baseURL: API_BASE_URL,
  // baseURL: 'http://13.232.184.100/hbits/dev',  // Url for Dev
  // baseURL: 'https://sapi-float.ebikego.com/api/', // Url for UAT
  //baseURL: 'http://127.0.0.1:5000/api', // Url for Local
  // baseURL: 'https://cors-anywhere.herokuapp.com/http://samples.openweathermap.org/data/2.5/',  // Url for Production
});

export default preLoginInstance;
