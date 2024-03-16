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
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useDisconnect,
} from "@web3modal/ethers/react";

function App() {
  const [isMobile, setIsMobile] = useState(false);
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
  // useEffect(() => {
  // }, []);
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { open: openConnectWallet } = useWeb3Modal();
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
  const { disconnect } = useDisconnect();

  console.log("address ", address);
  console.log("chainId ", chainId);
  console.log("isConnected ", isConnected);
  return (
    <div>
      <div
        style={{
          zIndex: "10000",
          backgroundColor: "red",
          position: "fixed",
          left: "50rem",
          top: "50rem",
        }}
      >
        {!isConnected ? (
          <button onClick={openConnectWallet}>Connect To Wallet</button>
        ) : (
          <button onClick={disconnect}>Disconnect</button>
        )}
      </div>
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
