import React from "react";
import { Col, Container, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import BinanceIcon from "../../assets/images/icons/Binance.svg";
import BitBtnIcon from "../../assets/images/icons/bitbns.png";
import CoinbaseIcon from "../../assets/images/icons/coinbase.svg";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form";

import BitstampIcon from "../../assets/images/icons/Bitstamp.jpg";
import GeminiIcon from "../../assets/images/icons/Gemini.jpg";
import HuobiIcon from "../../assets/images/icons/Huobi.jpg";
import BybitIcon from "../../assets/images/icons/bybit.jpg";
import krakanIcon from "../../assets/images/icons/krakan.svg";
import KuCoinIcon from "../../assets/images/icons/kucoin.svg";
import OkxIcon from "../../assets/images/icons/okx.jpg";

import Slider from "react-slick";
import backIcon from "../../assets/images/icons/backIcon.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import WalletIconBtn from "../../assets/images/icons/wallet_icon.svg";
import {
  HomeConnectExchangeSelected,
  Home_CE_ApiSyncAttmepted,
  Home_CE_OAuthAttempted,
  LPC_Go,
  LPConnectExchangeSelected,
  LP_CE_ApiSyncAttmepted,
  LP_CE_OAuthAttempted,
  WalletConnectExchangeSelected,
  Wallet_CE_ApiSyncAttmepted,
  Wallet_CE_OAuthAttempted,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomButton from "../../utils/form/CustomButton";
import { getExchangeBalance } from "../Portfolio/Api";
import { addUpdateAccount, getUserAccount } from "../cost/Api";
import { addExchangeTransaction } from "../home/Api";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api";
import { addUserCredits } from "../profile/Api";
import { GetAuthUrl, setPageFlagDefault, updateAccessToken } from "./Api";
class ConnectModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1.03,
      slidesToScroll: 1,
      nextArrow: <Image src={nextIcon} />,
      prevArrow: <Image src={prevIcon} />,
    };
    this.state = {
      settings,
      show: props.show,
      onHide: props.onHide,
      connectionName: "",
      apiKey: "",
      apiSecret: "",
      connectedExchangeList: [],
      api_passphrase: null,
      connectExchangesList: props?.exchanges
        ? props?.exchanges
        : [
            {
              name: "Binance",
              code: "BINANCE",
              icon: BinanceIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Binance</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click on <b>API Management</b> from your Profile icon
                          dropdown menu on the top right
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          In <b>Give the API Key a Label</b> field type in what
                          you want to call it, ex. <b>Loch Binance</b>, then
                          click <b>Create</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Input your <b>Google Authentication Code</b> (2FA) for
                          Binance
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Open your verification email Binance sent you and
                          click <b>Confirm new API key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          You can either scan the <b>QR code</b> with the{" "}
                          <b>Loch</b> app by tapping <b>Scan QR Code</b> below
                          and pointing the camera at the <b>QR code</b> on the
                          screen, or manually copy/paste your <b>API</b> and{" "}
                          <b>Secret Keys</b> into the app
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Coinbase",
              code: "COINBASE",
              icon: CoinbaseIcon,
              isActive: false,
              isOAuth: true,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Coinbase</b> account
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click on your <b>Profile icon</b> and go to the{" "}
                          <b>Settings</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          In Settings open <b>API Tab</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click on <b>New API Key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Enable the <b>2FA</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Set permissions for your account <b>API</b>, it's
                          recommended to check all 'read' permission checkboxes
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 7
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>Create</b> on the bottom right corner
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 8
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy/paste your <b>API</b> and <b>Secret Keys</b> into
                          the app
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Kraken",
              code: "KRAKEN",
              icon: krakanIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Kraken</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click on your <b>name</b> on the top rightof the
                          screen
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>API</b> from the Security dropdown menu,
                          then click on the <b>Add key</b> button
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Grant permission to <b>Query Funds</b>,{" "}
                          <b> Query Open Orders & Trades</b> and{" "}
                          <b>Query Closed Orders & Trades</b> then click on the{" "}
                          <b>Generate Key</b> button
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Your <b>API</b> and <b>Private Keys</b> will appear
                          below the message Success: Created API key.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy and paste your API Key and API Secret (Private)
                          into the Loch website and click <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Kucoin",
              code: "KUCOIN",
              icon: KuCoinIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>KuCoin</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Hover over your profile icon on the top right of the
                          screen and select <b>Api Management</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>Create API</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Fill in <b>API Name</b> (e.g. Loch Kucoin) and{" "}
                          <b>API Passphrase</b> (the API Passphrase will be used
                          to verify the API allocation, so make sure to record
                          and backup it on paper or mobile terminal). Then click{" "}
                          <b>Confirm</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Go through Security Verification by entering your
                          Trade Password, Email Verification Code, and Google
                          Verification Code
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy and paste your <b>API Key</b>, <b>API Secret</b>,
                          and <b>API Passphrase</b> into the Loch website and
                          click <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "OKX",
              code: "OKX",
              icon: OkxIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>OKX</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Hover over the <b>profile</b> icon on the top right of
                          the screen and select <b>API</b> from the dropdown
                          menu
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>+Create V5 API Key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select API Trading as your <b>Purpose</b>. Enter an{" "}
                          <b>API Name</b> like “OKX - Loch” and enter a{" "}
                          <b>passphrase</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Only grant <b>Read</b> permissions and click{" "}
                          <b>Confirm</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          After completing Two-factor authentication, copy and
                          paste your <b>API Key</b>, <b>API Secret</b>, and{" "}
                          <b>Passphrase</b> into the Loch website and click{" "}
                          <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            // {
            //   name: "Bitfinex",
            //   icon: BitfinexIcon,
            //  isActive:false,
            //  isOAuth:false,
            // },
            {
              name: "Bitstamp",
              code: "BITSTAMP",
              icon: BitstampIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Bitstamp</b> account on your
                          computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Hover over the <b>profile</b> icon on the top right of
                          the screen and select <b>Settings</b> from the
                          dropdown menu
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>API access</b> under Account settings on the
                          left
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>Create new API key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Only grant{" "}
                          <b>Read main account and balance transactions</b>
                          and click <b>Create new API key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          After completing two-factor authentication, click{" "}
                          <b>Activate API key</b> and click{" "}
                          <b>Activate API Key</b> on the confirmation email
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 7
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy and paste your <b>API Key</b>, <b>API Secret</b>{" "}
                          into the Loch website and click <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Bybit",
              code: "BYBIT",
              icon: BybitIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Bybit</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Hover over the <b>profile</b> icon on the top right of
                          the screen and select <b>API</b> from the dropdown
                          menu
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>Create New Key</b> and select{" "}
                          <b>System-generated API key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Set up <b>Two-Factor Authentication</b> if you haven’t
                          already
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select API Transaction as your <b>Purpose</b>. Enter
                          an <b>API Name</b> like “Bybit - Loch” and grant{" "}
                          <b>Read-Only</b> API Key permissions
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>No IP restriction</b>, click the check mark
                          for all <b>Read</b> permissions, and select{" "}
                          <b>Submit</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 7
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          After completing two-factor authentication, Copy and
                          paste your <b>API Key</b> and <b>API Secret</b> into
                          the Loch website and click <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Gemini",
              code: "GEMINI",
              icon: GeminiIcon,
              isActive: false,
              isOAuth: true,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Gemini</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>API Settings</b> from the My Account
                          dropdown on the top right of the screen
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click on <b>Create A New Account API Key</b> and enter
                          the code sent to you by SMS
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Name your API with any name you'd like (e.g. Loch
                          Gemini), grant access to the Auditor, and store your
                          Secret Key in a safe place
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy and paste your API Key and API Secret into the
                          Loch app, then click <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Huobi",
              code: "HOUBI",
              icon: HuobiIcon,
              isActive: false,
              isOAuth: false,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>Huobi</b> account on your computer
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Hover over the <b>profile</b> icon on the top right of
                          the screen and select <b>API Management</b> from the
                          dropdown menu
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Enter <b>Notes</b> like “Huobi - Loch”, select{" "}
                          <b>read-only</b>, and click <b>Create</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Carefully read the Risk Reminder, select the check
                          marks, and click <b>I understand</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Enter the verification code from your email
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 6
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy and paste your <b>API (Access) Key</b> and{" "}
                          <b>Secret Key</b> into the Loch website and click{" "}
                          <b>Connect</b>
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            {
              name: "Bitbns",
              code: "BITBNS",
              icon: BitBtnIcon,
              isActive: false,
              isOAuth: true,
              apiKey: "",
              apiSecretKey: "",
              connectionName: "",
              slider: () => {
                return (
                  <Slider {...this.state.settings}>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 1
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Log in to your <b>BitBNS</b> account from your desktop
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 2
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>More</b> in the menu on the top and then
                          click on <b>API Trading</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 3
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Click <b>+ Get New Keys</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 4
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Select <b>Read Only</b> and click{" "}
                          <b>Create New Key</b>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="steps">
                        <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                          STEP 5
                        </h6>
                        <p className="inter-display-medium f-s-14 lh-16">
                          Copy/paste your <b>Public Key</b> and{" "}
                          <b>Secret Key</b> into Loch
                        </p>
                      </div>
                    </div>
                  </Slider>
                );
              },
            },
            // {
            //   name: "Gate.io",
            //   icon: GateIcon,
            //  isActive:false,
            //  isOAuth:false,
            // },
          ],
      selection: null,
      apiActive: false,
      coinBase: true,
      AuthUrl: "",
      popup: false,
      walletCount: 0,
    };
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  handleApi = () => {
    this.setState({
      apiActive: true,
      coinBase: false,
    });
  };
  handleCoinbase = () => {
    this.setState({
      apiActive: false,
      coinBase: true,
    });
  };

  handleSelect = (item) => {
    if (this.props.tracking === "home page") {
      HomeConnectExchangeSelected({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        exchange_name: item.name,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (this.props.tracking === "landing page") {
      LPConnectExchangeSelected({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        exchange_name: item.name,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (this.props.tracking === "wallet page") {
      WalletConnectExchangeSelected({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        exchange_name: item.name,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    }
    this.setState(
      {
        selection: item,
      },
      () => {
        const islochUser =
          window.localStorage.getItem("lochUser") ||
          window.localStorage.getItem("lochDummyUser");
        if (islochUser) {
          this.getUrl();
          this.getUserConnectExchange();
        }
      }
    );
  };

  // only for home page
  handleUpdateList = () => {
    let name = this.state.selection?.name;
    this.setState((prevState) => {
      const connectExchangesList = prevState.connectExchangesList.map(
        (exchange) => {
          if (exchange.name === name) {
            return { ...exchange, isActive: true };
          }
          return exchange;
        }
      );
      return { connectExchangesList };
    });
  };

  getUrl = () => {
    let data = new URLSearchParams();
    data.append("exchange", this.state.selection.name.toLowerCase());
    GetAuthUrl(data, this);
  };
  handleBack = () => {
    this.setState({
      selection: null,
      apiActive: false,
      coinBase: true,
      connectionName: "",
      apiKey: "",
      apiSecret: "",
    });
  };

  getUserConnectExchange = () => {
    let data = new URLSearchParams();

    data.append("exchange", this.state.selection.name.toLowerCase());

    getUserAccount(data, this);
  };
  applyWalletList = () => {
    if (this.props.walletState?.walletList?.length > 0) {
      const walletList = this.props.walletState.walletList;

      const tempExchangeList = [];

      walletList.map((data) => {
        if (data?.chains.length === 0) {
          if (data.protocol) {
            if (data.protocol.code) {
              tempExchangeList.push(data.protocol.code);
            }
          }
        }
        return null;
      });
      this.setState({
        connectedExchangeList: tempExchangeList,
      });
    }
  };
  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
    this.applyWalletList();

    if (this.props.ishome) {
      let count = 0;
      this.props?.walletAddress?.map((e) => {
        if (e.address !== "") {
          count = count + 1;
        }
      });

      this.setState({
        walletCount: count,
      });
    }
  }

  componentDidUpdate() {
    // console.log("dejkfe",this.state.selection)
    // if (this.state.popup) {
    // var win = window.open(
    //   "http://localhost:3000/success?code=3ffd0d652b7e060511b206b596fbb80c04e62e7a80bc1a59fe46ae3382d5ac48",
    //   "test",
    //   "width=600,height=600,left=400,top=100"
    // );
    // //  var win = window.open(
    // //    this.state.AuthUrl,
    // //    "test",
    // //    "width=600,height=600,left=400,top=100"
    // //  );
    // var timer = setInterval(function () {
    //     //  console.log("win", win.location.href, win.location.search);
    //    const searchParams = new URLSearchParams(win.location.search);
    //    const code = searchParams.get("code");
    //    console.log(code);
    //   if (code) {
    //     // run api
    //     let data = new URLSearchParams();
    //     data.append("exchange", this.state?.selection?.name?.toLowerCase());
    //     data.append("access_code", code);
    //      data.append("account_name", this.state?.connectionName);
    //     updateAccessToken(data,this);
    //    setTimeout(() => {
    //      win.close();
    //      clearInterval(timer);
    //    }, 500);
    //   }
    // }, 1000);
    // }
  }

  handleConnect = () => {
    // console.log("Hey");
    // if (this.state.AuthUrl === "") {
    //    const islochUser =
    //      window.localStorage.getItem("lochUser") ||
    //      window.localStorage.getItem("lochDummyUser");
    //    if (islochUser) {
    //      this.getUrl();
    //    }
    // }
    const islochUser = window.localStorage.getItem("lochDummyUser");
    if (!islochUser && this.props.ishome) {
      // console.log("user not found create user then connect exchnage");
      if (
        (this.state.apiKey &&
          this.state.connectionName &&
          this.state.apiSecret) ||
        this.state.coinBase
      ) {
        this.onValidSubmit(false);
      }
    } else {
      // Auth Attempted
      if (this.props.tracking === "home page") {
        Home_CE_OAuthAttempted({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          exchange_name: this.state.selection?.name,
        });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      } else if (this.props.tracking === "landing page") {
        LP_CE_OAuthAttempted({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          exchange_name: this.state.selection?.name,
        });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      } else if (this.props.tracking === "wallet page") {
        Wallet_CE_OAuthAttempted({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          exchange_name: this.state.selection?.name,
        });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      }

      //  console.log("user found connect exchnage");
      let exchangename = this.state?.selection?.name?.toLowerCase();
      let cname = this.state?.connectionName;
      let parentState = this;
      if (this.state.coinBase && this.state?.selection.isOAuth) {
        //  console.log("auth url", this.state.AuthUrl)
        var win = window.open(
          this.state.AuthUrl,
          "test",
          "width=600,height=600,left=400,top=100"
        );

        var timer = setInterval(function () {
          //  console.log("win", win.location.href, win.location.search);
          const searchParams = new URLSearchParams(win.location.search);
          const code = searchParams.get("code");

          if (code) {
            // run api
            let data = new URLSearchParams();
            data.append("exchange", exchangename);
            data.append("access_code", code);
            data.append("account_name", cname);
            const exchangeCreditScore = new URLSearchParams();
            exchangeCreditScore.append("credits", "exchange_connected");
            this.props.addUserCredits(exchangeCreditScore);
            updateAccessToken(
              data,
              parentState,
              parentState.state?.selection?.name
            );
            win.close();
            clearInterval(timer);
          }
        }, 1000);
      } else {
        // Api sync attempted
        if (this.props.tracking === "home page") {
          Home_CE_ApiSyncAttmepted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: this.state.selection?.name,
          });
          if (this.props.updateTimer) {
            this.props.updateTimer();
          }
        } else if (this.props.tracking === "landing page") {
          LP_CE_ApiSyncAttmepted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: this.state.selection?.name,
          });
          if (this.props.updateTimer) {
            this.props.updateTimer();
          }
        } else if (this.props.tracking === "wallet page") {
          Wallet_CE_ApiSyncAttmepted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: this.state.selection?.name,
          });
          if (this.props.updateTimer) {
            this.props.updateTimer();
          }
        }
        if (
          this.state.apiKey &&
          this.state.connectionName &&
          this.state.apiSecret
        ) {
          this.setState({
            isLoadingbtn: true,
          });
          let data = new URLSearchParams();

          data.append("exchange", this.state.selection.name.toLowerCase());
          data.append("account_name", this.state.connectionName);
          data.append("api_secret", this.state.apiSecret);
          data.append("api_key", this.state.apiKey);
          if (this.state.connectExchangesList?.length > 0) {
            this.setState(
              (prevState) => {
                const connectExchangesList = prevState.connectExchangesList.map(
                  (resExchange) => {
                    if (
                      resExchange.name?.toLowerCase() ===
                      this.state.selection?.name?.toLowerCase()
                    ) {
                      return {
                        ...resExchange,
                        apiKey: this.state.apiKey,
                        apiSecretKey: this.state.apiSecret,
                        connectionName: this.state.connectionName,
                      };
                    }
                    return resExchange;
                  }
                );
                return { connectExchangesList };
              },
              () => {
                if (this.props.onboardingHandleUpdateConnect) {
                  this.props.onboardingHandleUpdateConnect(
                    this.state.connectExchangesList
                  );
                } else {
                  this.handleSubmitAfterWelcomePage();
                }
              }
            );
          }
          if (
            this.state.selection.name.toLowerCase() === "kucoin" ||
            this.state.selection.name.toLowerCase() === "okx"
          ) {
            data.append("api_passphrase", this.state.api_passphrase);
          }
          const exchangeCreditScore = new URLSearchParams();
          exchangeCreditScore.append("credits", "exchange_connected");
          this.props.addUserCredits(exchangeCreditScore);
          addUpdateAccount(data, this);
        }
      }
    }
  };

  showCoinbaseAuthSteps = () => {
    return (
      <Slider {...this.state.settings}>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 1
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click on Continue with <b>{this.state.selection.name}</b>. It will
              lead you to your <b>{this.state.selection.name}</b> account
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 2
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Log in to your <b>{this.state.selection.name}</b> account if you
              are not logged in yet
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 3
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click on the <b> Authorize</b> button
            </p>
          </div>
        </div>
      </Slider>
    );
  };

  // call create user
  onValidSubmit = (isConnect) => {
    this.setState({
      isLoadingbtn: true,
    });
    // console.log("on submit clicked")
    let walletAddress = [];
    let addWallet = this.props?.walletAddress;
    let finalArr = [];

    //  console.log("cjeb", addWallet);
    let addressList = [];

    let nicknameArr = {};

    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (
        !walletAddress.includes(curr?.apiAddress?.trim()) &&
        curr?.address?.trim()
      ) {
        finalArr.push(curr);
        walletAddress.push(curr?.address?.trim());
        walletAddress.push(curr?.displayAddress?.trim());
        walletAddress.push(curr?.apiAddress?.trim());
        let address = curr?.address?.trim();
        nicknameArr[address] = curr?.nickname;
        addressList.push(curr?.address?.trim());
      }
    }

    finalArr = finalArr?.map((item, index) => {
      return {
        ...item,
        id: `wallet${index + 1}`,
      };
    });

    // console.log("final array", addressList);

    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    if (isConnect) {
      // console.log("create user and go to home");
      this.props.createAnonymousUserApi(data, this, finalArr, null);
    } else {
      // console.log("create user and connect exhcnage");
      this.props.createAnonymousUserApi(
        data,
        this,
        finalArr,
        this.handleConnect
      );
    }

    // console.log(finalArr);

    const address = finalArr?.map((e) => e.address);
    // console.log("address", address);

    const unrecog_address = finalArr
      .filter((e) => !e.coinFound)
      .map((e) => e.address);
    // console.log("Unreq address", unrecog_address);

    const blockchainDetected = [];
    const nicknames = [];
    finalArr
      .filter((e) => e.coinFound)
      .map((obj) => {
        let coinName = obj.coins
          .filter((e) => e.chain_detected)
          .map((name) => name.coinName);
        let address = obj.address;
        let nickname = obj.nickname;
        blockchainDetected.push({ address: address, names: coinName });
        nicknames.push({ address: address, nickname: nickname });
      });

    // console.log("blockchain detected", blockchainDetected);

    LPC_Go({
      addresses: address,
      ENS: address,
      chains_detected_against_them: blockchainDetected,
      unrecognized_addresses: unrecog_address,
      unrecognized_ENS: unrecog_address,
      nicknames: nicknames,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

  handleGo = () => {
    const theExchangeData = [];
    if (this.props.exchanges) {
      this.props.exchanges.forEach((exchangeEle) => {
        if (exchangeEle.apiKey) {
          const newObj = {
            apiKey: exchangeEle.apiKey,
            apiSecretKey: exchangeEle.apiSecretKey,
            connectionName: exchangeEle.connectionName,
            exchangeCode: exchangeEle.code,
          };
          theExchangeData.push(newObj);
        }
      });
    }
    let passingData = new URLSearchParams();
    passingData.append("user_account", JSON.stringify(theExchangeData));

    const islochUser = window.localStorage.getItem("lochDummyUser");
    if (islochUser) {
      this.props.addExchangeTransaction(passingData);
      // already login go to ho page
      //  console.log("user found go to home");
      this.props.history.push("/home");
    } else {
      //  console.log("user not found create user then go to home");
      this.onValidSubmit(true);
    }
  };
  handleSubmitAfterWelcomePage = () => {
    const theExchangeData = [];
    if (this.state.connectExchangesList) {
      this.state.connectExchangesList.forEach((exchangeEle) => {
        if (exchangeEle.apiKey) {
          const newObj = {
            apiKey: exchangeEle.apiKey,
            apiSecretKey: exchangeEle.apiSecretKey,
            connectionName: exchangeEle.connectionName,
            exchangeCode: exchangeEle.code,
          };
          theExchangeData.push(newObj);
        }
      });
    }
    let passingData = new URLSearchParams();
    passingData.append("user_account", JSON.stringify(theExchangeData));
    this.props.addExchangeTransaction(passingData);
  };

  render() {
    const { selection } = this.state;
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal connect-exchange"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={
          this.props.modalAnimation !== undefined
            ? this.props.modalAnimation
            : true
        }
      >
        <Modal.Header>
          {(selection !== null || this.props.ishome) &&
            this.props.handleBackConnect && (
              <Image
                className="back-icon cp"
                src={backIcon}
                onClick={() => {
                  if (this.props.ishome && !selection) {
                    this.props.handleBackConnect(
                      this.state.connectExchangesList
                    );
                  } else {
                    this.handleBack();
                  }
                }}
              />
            )}
          {selection ? (
            <Image src={selection.icon} className="connect-icon" />
          ) : (
            <div className="api-modal-header popup-main-icon-with-border">
              <Image src={this.props.iconImage} />
            </div>
          )}
          <div
            className="closebtn"
            onClick={() => {
              this.state.onHide();
            }}
          >
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          {selection ? (
            <div className="connect-modal-body input-noshadow-dark input-hover-states">
              <div className="connect-head">
                <h6 className="inter-display-medium f-s-25 lh-30 m-b-8 black-191">
                  Connecting to {selection.name}
                </h6>
              </div>
              {this.state?.selection.isOAuth && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "3rem",
                  }}
                  className="exchange-tab"
                >
                  <h3
                    className={`${
                      this.state.coinBase ? "black-191" : "grey-B0B"
                    } inter-display-semi-bold f-s-16 lh-16 m-r-32 p-b-20 cp`}
                    style={
                      this.state.coinBase
                        ? {
                            borderBottom: "2px solid #19191A",
                          }
                        : { borderBottom: "2px solid transparent" }
                    }
                    onClick={this.handleCoinbase}
                  >
                    {selection.name}
                  </h3>
                  <h3
                    className={`${
                      this.state.apiActive ? "black-191" : "grey-B0B"
                    } inter-display-semi-bold f-s-16 lh-16 m-r-32 p-b-20 cp`}
                    style={
                      this.state.apiActive
                        ? {
                            borderBottom: "2px solid #19191A",
                          }
                        : { borderBottom: "2px solid transparent" }
                    }
                    onClick={this.handleApi}
                  >
                    API Sync
                  </h3>
                </div>
              )}
              {this.state?.selection.isOAuth && <hr style={{ margin: 0 }} />}
              <div className="selection-wrapper">
                <Container>
                  <Row>
                    <Col sm={6}>
                      <div className="exchange-form input-hover-states">
                        <Form>
                          <FormElement
                            valueLink={this.linkState(this, "connectionName")}
                            label="Connection name"
                            control={{
                              type: CustomTextControl,
                              settings: {
                                placeholder: "Enter connection name here",
                              },
                            }}
                            // classes={{
                            //   inputField:
                            //     this.state.connectionName !== "" ? "done" : "",
                            // }}
                          />
                          {(!this.state.coinBase ||
                            !this.state?.selection.isOAuth) && (
                            <FormElement
                              valueLink={this.linkState(this, "apiKey")}
                              label="API Key"
                              control={{
                                type: CustomTextControl,
                                settings: {
                                  placeholder: "Enter api key here",
                                },
                              }}
                              // classes={{
                              //   inputField:
                              //     this.state.apiKey !== "" ? "done" : "",
                              // }}
                            />
                          )}
                          {(!this.state.coinBase ||
                            !this.state?.selection.isOAuth) && (
                            <FormElement
                              valueLink={this.linkState(this, "apiSecret")}
                              label="API Secret"
                              control={{
                                type: CustomTextControl,
                                settings: {
                                  placeholder: "Enter api secret here",
                                },
                              }}
                              // classes={{
                              //   inputField:
                              //     this.state.apiSecret !== "" ? "done" : "",
                              // }}
                            />
                          )}
                          {(!this.state.coinBase ||
                            !this.state?.selection.isOAuth) &&
                            (selection.name === "Kucoin" ||
                              selection.name === "OKX") && (
                              <FormElement
                                valueLink={this.linkState(
                                  this,
                                  "api_passphrase"
                                )}
                                label="API Passphrase"
                                control={{
                                  type: CustomTextControl,
                                  settings: {
                                    placeholder: "Enter api passphrase here",
                                  },
                                }}
                                // classes={{
                                //   inputField:
                                //     this.state.apiSecret !== "" ? "done" : "",
                                // }}
                              />
                            )}
                        </Form>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="connect-steps">
                        <h4 className="inter-display-medium f-s-13 lh-16 grey-313 m-b-12">
                          {this.state.coinBase
                            ? "How to Add Your Account"
                            : "How to connect"}
                        </h4>
                        {this.state.coinBase && this.state?.selection.isOAuth
                          ? this.showCoinbaseAuthSteps()
                          : selection.slider()}
                      </div>
                      {(!this.state.coinBase ||
                        !this.state?.selection.isOAuth) && (
                        // <Button
                        //   className="primary-btn connect-btn"
                        //   onClick={this.handleConnect}
                        //   style={
                        //     (!this.state.coinBase ||
                        //       !this.state?.selection.isOAuth) &&
                        //     selection.name === "Kucoin"
                        //       ? { marginTop: "8.5rem" }
                        //       : {}
                        //   }
                        // >
                        //   Connect
                        // </Button>
                        <CustomButton
                          className={`primary-btn connect-btn main-button-invert ${
                            (!this.state.coinBase ||
                              !this.state?.selection.isOAuth) &&
                            (selection.name === "Kucoin" ||
                              selection.name === "OKX")
                              ? "m-t-8"
                              : ""
                          }
                            `}
                          isLoading={this.state.isLoadingbtn}
                          isDisabled={this.state.isLoadingbtn}
                          buttonText={`Connect`}
                          handleClick={this.handleConnect}
                        />
                      )}
                    </Col>
                    {this.state.coinBase && this.state?.selection.isOAuth && (
                      <Col
                        md={12}
                        style={{ textAlign: "center", marginTop: "5rem" }}
                      >
                        {/* <Button
                          className="primary-btn"
                          onClick={this.handleConnect}
                        >
                          Continue with {selection.name}
                        </Button> */}
                        <CustomButton
                          className="primary-btn go-btn main-button-invert"
                          isLoading={this.state.isLoadingbtn}
                          isDisabled={this.state.isLoadingbtn}
                          buttonText={`Continue with ${selection.name}`}
                          handleClick={this.handleConnect}
                        />
                      </Col>
                    )}
                  </Row>
                </Container>
              </div>
            </div>
          ) : (
            <div className="connect-modal-body input-noshadow-dark input-hover-states">
              <div className="connect-head">
                <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                  {this.props.headerTitle}
                </h6>
                <p className="inter-display-medium f-s-16 lh-19 grey-969 sub-heading">
                  Connect your exchange(s) securely and privately for more
                  accurate analysis.
                </p>
              </div>
              <div className="connect-wrapper">
                {/* <Row> */}
                {/* {this.state.connectExchangesList.map((item) => {
                  return (
                    <div
                      className="connect-div"
                      onClick={() => this.handleSelect(item)}
                    >
                      <div className="img-wrapper">
                        <Image src={item.icon} />
                      </div>

                      <h3 className="inter-display-medium f-s-16 lh-19 ">
                        {item.name}
                      </h3>
                    </div>
                  );
                })} */}

                <Row>
                  {this.state.connectExchangesList.map((item) => {
                    return (
                      <Col md={4}>
                        <div
                          className="connect-div"
                          onClick={() => this.handleSelect(item)}
                        >
                          <div className="img-wrapper">
                            <Image src={item.icon} />
                          </div>
                          <div>
                            <h3 className="inter-display-medium f-s-16 lh-19 ">
                              {item.name}
                            </h3>
                            {this.state.connectedExchangeList.includes(
                              item?.code
                            ) ? (
                              <p className="inter-display-semi-bold f-s-10 lh-13 grey-7C7">
                                Connected
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                {/* </Row> */}
                {this.props.ishome && (
                  <>
                    {this.props.handleBackConnect ? (
                      <div className="ob-connect-exchange">
                        <div
                          className="inter-display-semi-bold f-s-13 lh-16 black-191 connect-exchange-btn"
                          onClick={() => {
                            this.props.handleBackConnect(
                              this.state.connectExchangesList
                            );
                          }}
                        >
                          <Image
                            src={WalletIconBtn}
                            style={{
                              width: "1.2rem",
                              marginRight: "4px",
                              marginBottom: "1px",
                            }}
                          />
                          {this.state.walletCount === 0
                            ? "Add wallet addresses"
                            : this.state.walletCount > 1
                            ? this.state.walletCount + " addresses added"
                            : this.state.walletCount + " address added"}
                        </div>
                      </div>
                    ) : null}
                    <div style={{ textAlign: "center" }}>
                      <CustomButton
                        className="primary-btn go-btn main-button-invert"
                        type="submit"
                        isLoading={this.state.isLoadingbtn}
                        isDisabled={this.state.isLoadingbtn}
                        buttonText="Go"
                        handleClick={this.handleGo}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  walletState: state.WalletState,
});
const mapDispatchToProps = {
  getAllCoins,
  detectCoin,
  getAllParentChains,
  getExchangeBalance,
  setPageFlagDefault,
  createAnonymousUserApi,
  addExchangeTransaction,
  addUserCredits,
};
ConnectModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectModal);
