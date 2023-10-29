import React from "react";
import { Redirect, Route } from "react-router-dom";
import Sidebar from "../app/common/Sidebar";
import { getToken } from "./ManageToken";
import { mobileCheck } from "./ReusableFunctions";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // ON EVERY ROUTE GET PARAMS FROM URL AND SET TO LOCAL STORAGE.
      // console.log('props',props);
      const searchParams = new URLSearchParams(props.location.search);
      const redirectPath = searchParams.get("redirect");

      let redirect = JSON.parse(localStorage.getItem("ShareRedirect"));
      //  console.log("redirect", redirect);
      if (!redirect && redirectPath) {
        localStorage.setItem(
          "ShareRedirect",
          JSON.stringify({ path: redirectPath, hash: props?.location?.hash })
        );
      }
      const isMobile = mobileCheck();
      return requireAuth() ? (
        // key ADDED TO MAKE EVERY ROUTE WITH DIFFERENT PARAMS ID UNIQUE AND CALL DID MOUNT
        // WHEN PARAM ID CHANGES.
        <div className="main-section">
          {props.location.pathname !== "/welcome" &&
          !props.match.params.podName &&
          !isMobile ? (
            <Sidebar ownerName={""} {...props} />
          ) : null}
          <div
            className={`main-section-right ${
              props.location.pathname !== "/welcome" &&
              !props.match.params.podName
                ? "m-l-27"
                : ""
            }`}
          >
            <div className="main-content-wrapper">
              <Component key={props.location.pathname} {...props} />
            </div>
          </div>
        </div>
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: {
              from: props.location,
              params: props.match.params,
              page: "route",
            },
          }}
        />
      );
    }}
  />
);

const requireAuth = () => {
  const token = getToken();
  return token;
};

export default PrivateRoute;
