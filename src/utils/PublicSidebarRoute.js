import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalEvents,
} from "@web3modal/ethers/react";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Sidebar from "../app/common/Sidebar";
import { mobileCheck } from "./ReusableFunctions";

const PublicSidebarRoute = ({ component: Component, ...rest }) => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [isMobile] = useState(mobileCheck());
  const toggleSideBar = () => {
    window.localStorage.setItem("isSidebarClosed", !isSidebarClosed);
    setIsSidebarClosed(!isSidebarClosed);
  };
  useEffect(() => {
    const isSidebarClosed = window.localStorage.getItem("isSidebarClosed");
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
        window.localStorage.setItem("isSidebarClosed", true);
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
  const walletevents = useWeb3ModalEvents();
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

        return (
          // <div className="main-section">
          //   <div className={`main-section-right`}>
          //     <div className="main-content-wrapper">
          //       <Component
          //         connectedWalletAddress={address}
          //         connectedWalletevents={walletevents}
          //         openConnectWallet={openDisconnectConnectWallet}
          //         disconnectWallet={disconnect}
          //         key={props.location.pathname}
          //         {...props}
          //       />
          //     </div>
          //   </div>
          // </div>
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
                    ? `main-section-right-margin-handler-closed  ${
                        props.location.pathname === "/copy-trade-welcome"
                          ? "main-section-right-margin-handler-closed-ctw"
                          : ""
                      }`
                    : "main-section-right-margin-handler"
                  : ""
              }`}
            >
              <div className="main-content-wrapper">
                <Component
                  connectedWalletAddress={address}
                  connectedWalletevents={walletevents}
                  openConnectWallet={openDisconnectConnectWallet}
                  disconnectWallet={disconnect}
                  isSidebarClosed={isSidebarClosed}
                  key={props.location.pathname}
                  {...props}
                />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default PublicSidebarRoute;
