import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import configureStore from "./store";

import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-calendar/dist/Calendar.css"; // theme css file
// import 'react-calendar/dist/Calendar.less'; // theme css file
import "react-datepicker/dist/react-datepicker.css";
import "react-virtualized/styles.css";
import "./assets/scss/style.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./assets/scss/common/_commonClasses.scss";
import "./assets/scss/common/_colorVariables.scss";

//Amplitude
import {
  initAmplitude,
  initAmplitudeAnalytics,
} from "./utils/AnalyticsFunctions";

//sentry
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";
import MobileDevice from "./app/common/mobileDevice";

//Sentry Init
// if (process.env.NODE_ENV === "production") {
//   Sentry.init({
//     dsn: "https://e6783c2c434b4624a9067bf8dcee2878@o4504133712936960.ingest.sentry.io/4504156691431424",
//     integrations: [new BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
//   });
// }

// Testing Sentry
//  throw new Error("Santry Successfully added");

//Amplitude Analytics initialization
initAmplitude();
initAmplitudeAnalytics();

// test({ session_id: "session id", chains: ["value1", "value2", "value3"] });

/* ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); */

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.unregister();
