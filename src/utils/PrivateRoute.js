import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import Sidebar from "../app/common/Sidebar";
import { getToken } from "./ManageToken";
import { mobileCheck } from "./ReusableFunctions";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const toggleSideBar = () => {
    window.sessionStorage.setItem("isSidebarClosed", !isSidebarClosed);
    setIsSidebarClosed(!isSidebarClosed);
  };
  useEffect(() => {
    const isSidebarClosed = window.sessionStorage.getItem("isSidebarClosed");
    if (isSidebarClosed === "true") {
      setIsSidebarClosed(true);
    } else {
      setIsSidebarClosed(false);
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      // do magic for resize
      const isSmall = window.matchMedia("(max-width: 1300px)");

      if (isSmall && isSmall.matches) {
        setIsSidebarClosed(true);
        window.sessionStorage.setItem("isSidebarClosed", true);
      } else {
        // setIsSidebarClosed(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        // ON EVERY ROUTE GET PARAMS FROM URL AND SET TO LOCAL STORAGE.
        // console.log('props',props);
        const searchParams = new URLSearchParams(props.location.search);
        const redirectPath = searchParams.get("redirect");
        const passedRefrenceId = searchParams.get("refrenceId");
        const transHistoryPageNumber = searchParams.get(
          "transHistoryPageNumber"
        );
        const transHistoryConditions = searchParams.get(
          "transHistoryConditions"
        );
        const transHistorySorts = searchParams.get("transHistorySorts");
        const followThisAddressInLink = searchParams.get("followThisAddress");

        let linkAddress = "";

        if (props.location?.pathname) {
          if (props.location?.pathname.includes("/wallet")) {
            const justAddress = props.location?.pathname.replace(
              "/wallet/",
              ""
            );
            window.sessionStorage.setItem("urlWasWallet", true);
            linkAddress = justAddress;
          } else {
            const wasWalletBefore =
              window.sessionStorage.getItem("urlWasWallet");
            const justAddress = props.location?.pathname.replace("/home/", "");
            linkAddress = justAddress;
            if (!wasWalletBefore) {
              if (!window.sessionStorage.getItem("followThisAddress")) {
                console.log("linkAddress ? ", linkAddress);
                window.sessionStorage.setItem("followThisAddress", linkAddress);
              }
            }
          }
        }
        let redirect = JSON.parse(
          window.sessionStorage.getItem("ShareRedirect")
        );

        if (!redirect) {
          if (redirectPath) {
            window.sessionStorage.setItem(
              "ShareRedirect",
              JSON.stringify({
                path: redirectPath,
                hash: props?.location?.hash,
              })
            );
            if (followThisAddressInLink === "true" && linkAddress) {
              window.sessionStorage.setItem("followThisAddress", linkAddress);
            }
            if (passedRefrenceId) {
              window.sessionStorage.setItem(
                "PassedRefrenceId",
                passedRefrenceId
              );
            }
            if (transHistoryPageNumber) {
              window.sessionStorage.setItem(
                "transHistoryPageNumber",
                transHistoryPageNumber
              );
            }
            if (transHistoryConditions) {
              window.sessionStorage.setItem(
                "transHistoryConditions",
                transHistoryConditions
              );
            }
            if (transHistorySorts) {
              window.sessionStorage.setItem(
                "transHistorySorts",
                transHistorySorts
              );
            }
          } else {
            window.sessionStorage.setItem(
              "ShareRedirect",
              JSON.stringify({
                path: "home",
                hash: props?.location?.hash,
              })
            );
          }
        }
        if (
          props.location.pathname &&
          props.location.pathname.includes("/smart-money")
        ) {
          const isMobile = mobileCheck();
          // if (isMobile) {
          //   return (
          //     <Redirect
          //       to={{
          //         pathname: "/",
          //         state: {
          //           from: props.location,
          //           params: props.match.params,
          //           page: "route",
          //         },
          //       }}
          //     />
          //   );
          // }
          return (
            <div className="main-section">
              <div className={`main-section-right`}>
                <div className="main-content-wrapper">
                  <Component key={props.location.pathname} {...props} />
                </div>
              </div>
            </div>
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
              <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleSideBar={toggleSideBar}
                ownerName={""}
                {...props}
              />
            ) : null}
            <div
              className={`main-section-right ${
                props.location.pathname !== "/welcome" &&
                !props.match.params.podName
                  ? isSidebarClosed
                    ? "main-section-right-margin-handler-closed"
                    : "main-section-right-margin-handler"
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
};

const requireAuth = () => {
  const token = getToken();
  return token;
};

export default PrivateRoute;
