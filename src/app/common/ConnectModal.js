import React from 'react'
import { connect } from 'react-redux';
import { Modal, Image, Button, Row, Col, Container } from 'react-bootstrap';
import {Form, FormElement, FormValidator, BaseReactComponent, CustomTextControl} from '../../utils/form'
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import BinanceIcon from "../../assets/images/icons/Binance.svg";
import CoinbaseIcon from "../../assets/images/icons/coinbase.svg";

import BitstampIcon from "../../assets/images/icons/Bitstamp.jpg";
import BybitIcon from "../../assets/images/icons/bybit.jpg";
import GateIcon from "../../assets/images/icons/Gate.jpg";
import GeminiIcon from "../../assets/images/icons/Gemini.jpg";
import HuobiIcon from "../../assets/images/icons/Huobi.jpg";
import OkxIcon from "../../assets/images/icons/okx.jpg";
import krakanIcon from "../../assets/images/icons/krakan.svg";
import KuCoinIcon from "../../assets/images/icons/kucoin.svg";
import BitfinexIcon from "../../assets/images/icons/Bitfinex.png";

import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import backIcon from "../../assets/images/icons/back-icon.svg";
import Slider from 'react-slick';
import { addUpdateAccount, getUserAccount } from '../cost/Api';
import {getExchangeBalance } from "../Portfolio/Api";
import { GetAuthUrl, setPageFlagDefault, updateAccessToken } from './Api';

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
      api_passphrase: null,
      connectExchangesList: [
        {
          name: "Binance",
          icon: BinanceIcon,
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
                      In <b>Give the API Key a Label</b> field type in what you
                      want to call it, ex. <b>Loch Binance</b>, then click{" "}
                      <b>Create</b>
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
                      Open your verification email Binance sent you and click{" "}
                      <b>Confirm new API key</b>
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
                      <b>Loch</b> app by tapping <b>Scan QR Code</b> below and
                      pointing the camera at the <b>QR code</b> on the screen,
                      or manually copy/paste your <b>API</b> and{" "}
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
          icon: CoinbaseIcon,
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
                      Copy/paste your <b>API</b> and <b>Secret Keys</b> into the
                      app
                    </p>
                  </div>
                </div>
              </Slider>
            );
          },
        },
        {
          name: "Kraken",
          icon: krakanIcon,
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
                      Click on your <b>name</b> on the top rightof the screen
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 3
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Select <b>API</b> from the Security dropdown menu, then
                      click on the <b>Add key</b> button
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
                      Your <b>API</b> and <b>Private Keys</b> will appear below
                      the message Success: Created API key.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 6
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Copy and paste your API Key and API Secret (Private) into
                      the Loch website and click <b>Connect</b>
                    </p>
                  </div>
                </div>
              </Slider>
            );
          },
        },
        {
          name: "Kucoin",
          icon: KuCoinIcon,
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
                      <b>API Passphrase</b> (the API Passphrase will be used to
                      verify the API allocation, so make sure to record and
                      backup it on paper or mobile terminal). Then click{" "}
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
                      Go through Security Verification by entering your Trade
                      Password, Email Verification Code, and Google Verification
                      Code
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 6
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Copy and paste your <b>API Key</b>, <b>API Secret</b>, and <b>API Passphrase</b> into the Loch website and click <b>Connect</b>
                    </p>
                  </div>
                </div>
              </Slider>
            );
          },
        },
        // {
        //   name: "OKX",
        //   icon: OkxIcon,
        // },
        // {
        //   name: "Bitfinex",
        //   icon: BitfinexIcon,
        // },
        // {
        //   name: "Bitstamp",
        //   icon: BitstampIcon,
        // },
        // {
        //   name: "Bybit",
        //   icon: BybitIcon,
        // },
        {
          name: "Gemini",
          icon: GeminiIcon,
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
                      Select <b>API Settings</b> from the My Account dropdown on
                      the top right of the screen
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 3
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Click on <b>Create A New Account API Key</b> and enter the
                      code sent to you by SMS
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 4
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Name your API with any name you'd like (e.g. Loch Gemini),
                      grant access to the Auditor, and store your Secret Key in
                      a safe place
                    </p>
                  </div>
                </div>
                <div>
                  <div className="steps">
                    <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
                      STEP 5
                    </h6>
                    <p className="inter-display-medium f-s-14 lh-16">
                      Copy and paste your API Key and API Secret into the Loch
                      app, then click <b>Connect</b>
                    </p>
                  </div>
                </div>
              </Slider>
            );
          },
        },
        // {
        //   name: "Huobi",
        //   icon: HuobiIcon,
        // },
        // {
        //   name: "Gate.io",
        //   icon: GateIcon,
        // },
      ],
      selection: null,
      apiActive: false,
      coinBase: true,
      AuthUrl: "",
      popup: false,
    };
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
    this.setState({ selection: item }, () => {
      this.getUrl();
      this.getUserConnectExchange();

    });
  };

  getUrl = () => {
     let data = new URLSearchParams();
     data.append("exchange", this.state.selection.name.toLowerCase());
    GetAuthUrl(data,this);
  }
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
    let exchangename = this.state?.selection?.name?.toLowerCase();
    let cname = this.state?.connectionName;
    let parentState = this;
    if (this.state.coinBase && this.state.AuthUrl !== "") {

      var win = window.open(
        this.state.AuthUrl,
        "test",
        "width=600,height=600,left=400,top=100"
      );

      var timer = setInterval(function () {
        //  console.log("win", win.location.href, win.location.search);
        const searchParams = new URLSearchParams(win.location.search);
        const code = searchParams.get("code");
        // console.log(code, exchangename,cname);
        if (code) {
          // run api
          let data = new URLSearchParams();
          data.append("exchange", exchangename);
          data.append("access_code", code);
          data.append("account_name", cname);
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
      if (
        this.state.apiKey &&
        this.state.connectionName &&
        this.state.apiSecret
      ) {
        let data = new URLSearchParams();

        data.append("exchange", this.state.selection.name.toLowerCase());
        data.append("account_name", this.state.connectionName);
        data.append("api_secret", this.state.apiSecret);
        data.append("api_key", this.state.apiKey);

        if (this.state.selection.name.toLowerCase() === "kucoin") {
          data.append("api_passphrase", this.state.api_passphrase);
        }

        addUpdateAccount(data, this);
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
      >
        <Modal.Header>
          {selection && (
            <Image
              className="back-icon cp"
              src={backIcon}
              onClick={this.handleBack}
            />
          )}
          {selection ? (
            <Image src={selection.icon} className="connect-icon" />
          ) : (
            <div className="api-modal-header">
              <Image src={this.props.iconImage} />
            </div>
          )}
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          {selection ? (
            <div className="connect-modal-body">
              <div className="connect-head">
                <h6 className="inter-display-medium f-s-25 lh-30 m-b-8 black-191">
                  Connecting to {selection.name}
                </h6>
              </div>
              {this.state.AuthUrl !== "" && (
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
              {this.state.AuthUrl !== "" && <hr style={{ margin: 0 }} />}
              <div className="selection-wrapper">
                <Container>
                  <Row>
                    <Col sm={6}>
                      <div className="exchange-form">
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
                            this.state.AuthUrl === "") && (
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
                            this.state.AuthUrl === "") && (
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
                            this.state.AuthUrl === "") &&
                            selection.name === "Kucoin" && (
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
                        {this.state.coinBase && this.state.AuthUrl !== ""
                          ? this.showCoinbaseAuthSteps()
                          : selection.slider()}
                      </div>
                      {(!this.state.coinBase || this.state.AuthUrl === "") && (
                        <Button
                          className="primary-btn connect-btn"
                          onClick={this.handleConnect}
                          style={(!this.state.coinBase ||
                            this.state.AuthUrl === "") &&
                            selection.name === "Kucoin" ?{marginTop: "8.5rem"}:{}}
                        >
                          Connect
                        </Button>
                      )}
                    </Col>
                    {this.state.coinBase && this.state.AuthUrl !== "" && (
                      <Col
                        md={12}
                        style={{ textAlign: "center", marginTop: "5rem" }}
                      >
                        <Button
                          className="primary-btn"
                          onClick={this.handleConnect}
                        >
                          Continue with {selection.name}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Container>
              </div>
            </div>
          ) : (
            <div className="connect-modal-body">
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

                          <h3 className="inter-display-medium f-s-16 lh-19 ">
                            {item.name}
                          </h3>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                {/* </Row> */}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
  getExchangeBalance,
  setPageFlagDefault,
};
ConnectModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectModal);