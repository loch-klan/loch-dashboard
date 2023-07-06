import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
// import './App.css';
import routes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MobileDevice from "./app/common/mobileDevice";

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
