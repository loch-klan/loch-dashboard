import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import Sidebar from "../app/common/Sidebar";
import { getToken } from "./ManageToken";
import { mobileCheck } from "./ReusableFunctions";
import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

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
  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  };
  const metadata = {
    name: "Loch",
    description: "My Website description",
    url: "https://app.loch.one/", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };
  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet],
    projectId: "4ba0f16b53f8888a667cbbb8bb366918",
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { open: openConnectWallet } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const openDisconnectConnectWallet = () => {
    if (isConnected) {
      disconnect();
      setTimeout(() => {
        openConnectWallet();
      }, 1000);
    } else {
      openConnectWallet();
    }
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        // ON EVERY ROUTE GET PARAMS FROM URL AND SET TO LOCAL STORAGE.
        // console.log('props',props);
        const searchParams = new URLSearchParams(props.location.search);
        const redirectPath = searchParams.get("redirect");
        const noPopupFlag = searchParams.get("noPopup");
        const passedRefrenceId = searchParams.get("refrenceId");
        const transHistoryPageNumber = searchParams.get(
          "transHistoryPageNumber"
        );
        const transHistoryConditions = searchParams.get(
          "transHistoryConditions"
        );
        const transHistorySorts = searchParams.get("transHistorySorts");
        const followThisAddressInLink = searchParams.get("followThisAddress");
        if (noPopupFlag === "true") {
          window.sessionStorage.setItem("noPopupFlag", true);
        }
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
                const noPopupFlagLastTime =
                  window.sessionStorage.getItem("noPopupFlag");
                if (noPopupFlag !== "true" && noPopupFlagLastTime !== "true") {
                  window.sessionStorage.setItem(
                    "followThisAddress",
                    linkAddress
                  );
                }
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
            const noPopupFlagLastTime =
              window.sessionStorage.getItem("noPopupFlag");
            if (
              followThisAddressInLink === "true" &&
              linkAddress &&
              noPopupFlag !== "true" &&
              noPopupFlagLastTime !== "true"
            ) {
              console.log("Two here");
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
          props.location.pathname.includes("/leaderboard")
        ) {
          return (
            <div className="main-section">
              <div className={`main-section-right`}>
                <div className="main-content-wrapper">
                  <Component
                    openConnectWallet={openConnectWallet}
                    disconnectWallet={disconnect}
                    key={props.location.pathname}
                    {...props}
                  />
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
                props.location.pathname === "/nft" && isMobile
                  ? ""
                  : props.location.pathname !== "/welcome" &&
                    !props.match.params.podName
                  ? isSidebarClosed
                    ? "main-section-right-margin-handler-closed"
                    : "main-section-right-margin-handler"
                  : ""
              }`}
            >
              <div className="main-content-wrapper">
                <Component
                  connectedWalletAddress={address}
                  openConnectWallet={openDisconnectConnectWallet}
                  disconnectWallet={disconnect}
                  isSidebarClosed={isSidebarClosed}
                  key={props.location.pathname}
                  {...props}
                />
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
