import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
// import './App.css';
import routes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MobileDevice from "./app/common/mobileDevice";
import ReactGA from "react-ga4";
import { ARCX_API_KEY, BASE_GA_KEY } from "./utils/Constant";
import { ArcxAnalyticsProvider } from "@arcxmoney/analytics";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    setIsMobile(mediaQuery.matches);

    function handleResize() {
      setIsMobile(mediaQuery.matches);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const isRendered = window.sessionStorage.getItem("isRendered");
    if (!isRendered) {
      setTimeout(() => {
        window.sessionStorage.setItem("isRendered", true);
        window.location.reload(true);
      }, 1000);
    }
    return () => {
      window.sessionStorage.removeItem("isRendered");
    };
  }, []);
  useEffect(() => {
    ReactGA.initialize(BASE_GA_KEY);
  }, []);

  // return isMobile ? (
  //   <MobileDevice />
  // ) : (
  return (
    <div>
      <ArcxAnalyticsProvider apiKey={ARCX_API_KEY}>
        <BrowserRouter>
          <Switch>
            {routes.map((prop, key) => {
              return (
                <prop.type
                  exact
                  path={prop.path}
                  key={key}
                  component={prop.component}
                />
              );
            })}
            {/* <Route exact path="/" component={Home} /> */}
          </Switch>
        </BrowserRouter>
        {/* <ToastContainer hideProgressBar /> */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          // closeOnClick
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ArcxAnalyticsProvider>
    </div>
  );
  // );
}

export default App;
