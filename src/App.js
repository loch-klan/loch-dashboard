import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
// import './App.css';
import routes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MobileDevice from "./app/common/mobileDevice";
import ReactGA from "react-ga4";

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
    ReactGA.initialize("G-5SGSCTZDGV");
  }, []);

  useEffect(() => {
    const baseName = window?.location?.origin;
    const pathName = window?.location?.pathname;
    console.log("window.location ", window.location);
    if (pathName) {
      if (pathName === "/Prithvir12") {
        const goTo =
          baseName +
          "/welcome/?utm_source=Twitter&utm_medium=Bio&utm_term=Prithvir12";
        window.location = goTo;
      } else if (pathName === "/loch_chain") {
        const goTo =
          baseName +
          "/welcome/?utm_source=Twitter&utm_medium=Bio&utm_term=loch_chain";
        window.location = goTo;
      }
    }
  }, []);

  return isMobile ? (
    <MobileDevice />
  ) : (
    <div>
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
    </div>
  );
}

export default App;
