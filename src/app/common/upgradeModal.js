import React from "react";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import FormValidator from "./../../utils/form/FormValidator";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import backIcon from "../../assets/images/icons/Back-icon-upgrade.svg";
import insight from "../../assets/images/icons/InactiveIntelligenceIcon.svg";
import CheckIcon from "../../assets/images/icons/check-upgrade.svg";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LochIcon from "../../assets/images/icons/loch-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  UpgradeSignInPopup,
  WhaleCreateAccountPrivacyHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding//Api";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import {
  CreatePyment,
  SendOtp,
  SigninWallet,
  UpdateCryptoPayment,
  VerifyEmail,
  fixWalletApi,
  getUser,
} from "./Api.js";
import AuthModal from "./AuthModal";

import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import DefiIcon from "../../assets/images/icons/upgrade-defi.svg";
import ExportIcon from "../../assets/images/icons/upgrade-export.svg";
import NotificationLimitIcon from "../../assets/images/icons/upgrade-notification-limit.svg";
import NotificationIcon from "../../assets/images/icons/upgrade-notifications.svg";
import UploadIcon from "../../assets/images/icons/upgrade-upload.svg";
import WalletIcon from "../../assets/images/icons/upgrade-wallet.svg";
import WhalePodAddressIcon from "../../assets/images/icons/upgrade-whale-pod-add.svg";
import WhalePodIcon from "../../assets/images/icons/upgrade-whale-pod.svg";
import { loadingAnimation, mobileCheck } from "../../utils/ReusableFunctions";
import AskEmailModal from "./AskEmailModal";
import USDT_ABI from "./USDT_ABI.json";

class UpgradeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = window.localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    const Plans = JSON.parse(window.localStorage.getItem("Plans"));

    let AllPlan = Plans?.map((plan) => {
      let price = plan.prices ? plan.prices[0]?.unit_amount / 100 : 0;
      return {
        // Upgrade plan
        price: price,
        price_id: plan.prices ? plan.prices[0]?.id : "",
        name: plan.name,
        id: plan.id,
        plan_reference_id: plan.plan_reference_id,
        trial_day: plan.trial_days,
        features: [
          {
            name: "Wallet addresses",
            limit: plan.wallet_address_limit,
            img: WalletIcon,
            id: 1,
          },
          {
            name: plan.whale_pod_limit > 1 ? "Whale pods" : "Whale pod",
            limit: plan.whale_pod_limit,
            img: WhalePodIcon,
            id: 2,
          },
          {
            name:
              plan.name === "Free"
                ? "Influencer whale pod"
                : "Influencer whale pods",
            limit: plan.name === "Free" ? 1 : -1,
            img: WhalePodAddressIcon,
            id: 3,
          },
          {
            name: "Notifications",
            limit: plan.notifications_provided,
            img: NotificationIcon,
            id: 4,
          },
          {
            name: "Notifications limit",
            limit: plan.notifications_limit,
            img: NotificationLimitIcon,
            id: 5,
          },
          {
            name: "DeFi details",
            limit: plan.defi_enabled,
            img: DefiIcon,
            id: 6,
          },
          {
            name: "Insights",
            limit: plan?.insight ? true : price > 0 ? true : false,
            img: insight,
            id: 9,
          },
          {
            name: "Export addresses",
            limit: plan.export_address_limit,
            img: ExportIcon,
            id: 7,
          },
          {
            name: "Upload address csv/txt",
            limit: plan.upload_csv,
            img: UploadIcon,
            id: 8,
          },
        ],
      };
    });

    // console.log("AllPlan ", AllPlan);

    let selectedPlan = {};
    let PlanId = props.selectedId || "63eb32759b5e4daf6b588205";
    Plans?.map((plan) => {
      if (plan.id === PlanId) {
        let price = plan.prices ? plan.prices[0]?.unit_amount / 100 : 0;
        selectedPlan = {
          // Upgrade plan
          price: plan.prices ? plan.prices[0]?.unit_amount / 100 : 0,
          price_id: plan.prices ? plan.prices[0]?.id : "",
          name: plan.name,
          id: plan.id,
          plan_reference_id: plan.plan_reference_id,
          features: [
            {
              name: "Wallet addresses",
              limit: plan.wallet_address_limit,
              img: WalletIcon,
              id: 1,
            },
            {
              name: plan.whale_pod_limit > 1 ? "Whale pods" : "Whale pod",
              limit: plan.whale_pod_limit,
              img: WhalePodIcon,
              id: 2,
            },
            {
              name:
                plan.name === "Free"
                  ? "Influencer whale pod"
                  : "Influencer whale pods",
              limit: plan.name === "Free" ? 1 : -1,
              img: WhalePodAddressIcon,
              id: 3,
            },
            {
              name: "Notifications",
              limit: plan.notifications_provided,
              img: NotificationIcon,
              id: 4,
            },
            {
              name: "Notifications limit",
              limit: plan.notifications_limit,
              img: NotificationLimitIcon,
              id: 5,
            },
            {
              name: "DeFi details",
              limit: plan.defi_enabled,
              img: DefiIcon,
              id: 6,
            },
            {
              name: "Insights",
              limit: plan?.insight ? true : price > 0 ? true : false,
              img: insight,
              id: 9,
            },
            {
              name: "Export addresses",
              limit: plan.export_address_limit,
              img: ExportIcon,
              id: 7,
            },
            {
              name: "Upload address csv/txt",
              limit: plan.upload_csv,
              img: UploadIcon,
              id: 8,
            },
          ],
        };
      }
    });

    this.state = {
      isMobile: mobileCheck(),
      // checkout
      payment_link: "",

      // limit exceed id this is used for modal message and highlight feature
      upgradeType: 4,

      // if user form pricing page set true and show auth modal if not login in else show checkout page and redirect to home
      UserFromPage: false,

      // Auth Modal
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || dummyUser || "",
      email: "",
      otp: "",
      prevOtp: "",
      isEmailNotExist: false,
      isOptInValid: false,
      isShowOtp: false,
      isLochUser: userDetails,

      dummyUser,
      show: props.show,
      email: "",
      otp: "",
      prevOtp: "",
      isEmailNotExist: false,
      isOptInValid: false,
      isShowOtp: false,
      onHide: props.onHide,
      changeList: props.changeWalletList,
      CheckOutModal: false,
      planList: AllPlan ? AllPlan : [],
      hideUpgradeModal: false,
      RegisterModal: false,
      price_id: 0,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")) || {
        price: 0,
        price_id: "",
        name: "Free",
        features: [
          {
            name: "Wallet addresses",
            limit: 5,
          },
          {
            name: "Whale pod",
            limit: 1,
          },
          {
            name: "Whale pod addresses",
            limit: 5,
          },
          {
            name: "Notifications provided",
            limit: false,
          },
          {
            name: "Notifications limit",
            limit: 0,
          },
          {
            name: "Defi details provided",
            limit: false,
          },
          {
            name: "Export addresses",
            limit: 1,
          },
          {
            name: "upload address csv/text",
            limit: 5,
          },
        ],
      },
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      selectedPlan: selectedPlan || "",

      //
      hideAuthModal: false,
      signinModal: false,
      hideModal: false,

      // meta mask
      MetamaskExist: false,
      MetaAddress: "",
      balance: 0,
      btnloader: false,
      transactionReceipt: null,
      payLoader: false,
      selectedToken: null,
      showToken: false,
      tokensList: [
        { id: 1, name: "ETH", price: null },
        { id: 2, name: "USDT", price: null },
        { id: 3, name: "USDC", price: null },
      ],
      ethPrice: null,
      usdtConversion: null,
      usdcConversion: null,

      // Ask eamil after crypto payment
      emailModal: false,

      tracking: "Create or sign in from Upgrade pop up",
    };
  }

  // Auth
  handleAccountCreate = () => {
    //   console.log("create email", this.state.email);
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    SendOtp(data, this);

    // WhaleCreateAccountEmailSaved({
    //   session_id: getCurrentUser().id,
    //   email_address: this.state.email,
    // });

    //   check email valid or not if valid set email exist to true then this will change copy of signin and if invalid then show copy for signup
  };

  handleOtp = () => {
    this.setState({
      isOptInValid: false,
    });
    // console.log("enter otp", this.state.otp, typeof this.state.otp);
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    data.append("otp_token", this.state.otp);
    data.append("signed_up_from", this.state.tracking);
    VerifyEmail(data, this);
  };

  checkoutModal = () => {
    this.setState(
      {
        CheckOutModal: !this.state.CheckOutModal,
        hideUpgradeModal: true,
      },
      () => {
        let data = new URLSearchParams();
        data.append("price_id", this.state.selectedPlan?.price_id);
        CreatePyment(data, this);
      }
    );
  };

  AddEmailModal = () => {
    // console.log("handle emailc close");
    const isDummy = window.localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    if (islochUser) {
      this.setState(
        {
          RegisterModal: false,
          email: islochUser?.email || "",
          isLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
        },
        () => {
          this.checkoutModal();
        }
      );
    } else {
      this.setState(
        {
          RegisterModal: !this.state.RegisterModal,
          hideUpgradeModal: true,
        },
        () => {
          // this.setState({});
        }
      );
    }
  };

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
    if (this.props.selectedId) {
      this.AddEmailModal();
    }

    // this for change button name
    if (window.ethereum) {
      // Do something
      this.setState({
        MetamaskExist: true,
      });
    } else {
      // alert("install metamask extension!!");
      this.setState({
        MetamaskExist: false,
      });
    }

    if (!this.state.isLochUser) {
      this.setState({
        isLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      });
    }
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  componentDidUpdate(prevProps, prevState) {}

  handleBack = () => {
    this.setState({
      hideUpgradeModal: false,
      RegisterModal: false,
      CheckOutModal: false,

      // autho
      email: "",
      otp: "",
      isShowOtp: false,
      isEmailNotExist: false,
      showToken: false,
    });
  };

  submit = () => {
    // console.log('Hey');
  };

  handleSignin = () => {
    this.setState(
      {
        signinModal: !this.state.signinModal,
        hideModal: true,
        isLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      },
      () => {
        if (this.state.signinModal)
          UpgradeSignInPopup({
            session_id: getCurrentUser().id,
          });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      }
    );
  };

  handleAskEmail = (emailUpdated = false) => {
    let user = JSON.parse(window.localStorage.getItem("lochUser"));
    // console.log("user",user)
    if (!user?.email || emailUpdated) {
      // console.log("user", user?.email);
      this.setState({
        emailModal: !this.state.emailModal,
        hideModal: true,
        isLochUser: user,
      });
    }
  };

  handleSigninBackbtn = () => {
    //  console.log("handle signin back");
    this.setState({
      signinModal: !this.state.signinModal,
      hideModal: false,
    });
  };

  connectMetamask = async (isSignin = true) => {
    if (window.ethereum) {
      try {
        // await window.ethereum.request({ method: "eth_requestAccounts" });
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        // const address = await signer.getAddress();
        // const balance = ethers.utils.formatEther(
        //   await provider.getBalance(address)
        // );
        // // console.log(
        // //   "plan price",
        // //   this.state.selectedPlan?.price,
        // //   "Eth rate",
        // //   ethRateList.rates.ETH,
        // //   "user balace",
        // //   balance,
        // //   "USD to Eth",
        // //   ethRateList.rates.ETH * this.state.selectedPlan?.price
        // // );
        // this.setState({
        //   MetaAddress: address,
        //   balance: balance,
        //   signer: signer,
        //   provider: provider,
        //   btnloader: true,
        // });
        // // call sigin Api after signin call checkoutModal
        // if (isSignin) {
        //   this.SigninWallet();
        // } else {
        //   this.handleTransaction();
        // }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Please install MetaMask!");
      toast.error("Please install Metamask extension");
    }
  };

  // get USDT and USDC amount
  getExchangeRates = async () => {
    try {
      const response = await axios.get(
        "https://api.coinbase.com/v2/exchange-rates?currency=USD"
      );
      return response.data.data.rates;
    } catch (error) {
      console.error(error);
    }
  };

  getAmount = async () => {
    const exchangeRates = await this.getExchangeRates();
    // eth rate
    let ethRateList = JSON.parse(window.localStorage.getItem("currencyRates"));

    // usd to eth
    let ethPrice = ethRateList.rates.ETH * this.state.selectedPlan?.price;

    // Convert USD to USDT
    const usdtRate = exchangeRates["USDT"];
    const usdtConversion = this.state.selectedPlan?.price / usdtRate;

    // Convert USD to USDC
    const usdcRate = exchangeRates["USDC"];
    const usdcConversion = this.state.selectedPlan?.price / usdcRate;
    // console.log(
    //   "usdt",
    //   usdtConversion,
    //   usdtRate,
    //   "usdc",
    //   usdcConversion,this.state.selectedPlan?.price,
    //   usdcRate, "eth", ethPrice
    // );
    let tokens = [
      { id: 1, name: "ETH", price: ethPrice },
      { id: 2, name: "USDT", price: usdtConversion },
      { id: 3, name: "USDC", price: usdcConversion },
    ];
    // console.log("tok", tokens);
    this.setState({
      tokensList: tokens,
    });
  };

  // Metamask transaction
  // handleTransaction = async () => {
  //   try {
  //     this.setState({
  //       payLoader: true,
  //     });
  //     // Prompt the user to connect their Metamask wallet
  //     if (this.state.MetaAddress !== "") {
  //       // already connected

  //       if (!this.state.selectedToken.price) {
  //         // if selected token null again call function
  //         await this.getAmount();
  //       }

  //       let contractAddress,
  //         contractABI,
  //         txOptions,
  //         tx,
  //         receipt,
  //         amount,
  //         gasLimit,
  //         gasPrice,
  //         usdcContract,
  //         usdtContract;
  //       let RecipientAddress = "0xb316a003B7b763Dc40Ca6C82F341B58052e46BFD";
  //       let testing = false;

  //       switch (this.state.selectedToken.name) {
  //         case "ETH":
  //           // Set the transaction options (e.g. recipient address and transaction amount)
  //           // console.log(
  //           //   this.state.selectedToken.name,
  //           //   this.state.selectedToken.price
  //           // );
  //           txOptions = {
  //             to: RecipientAddress, // recipient address - lochpj.eth
  //             value: testing
  //               ? ethers.utils.parseEther(`0.0001`)
  //               : ethers.utils.parseEther(`${this.state.selectedToken.price}`),
  //           };

  //           // Send the transaction
  //           tx = await this.state.signer.sendTransaction(txOptions);
  //           // Wait for the transaction to be confirmed
  //           receipt = await tx.wait();
  //           break;
  //         case "USDT":
  //           // console.log(
  //           //   this.state.selectedToken.name,
  //           //   this.state.selectedToken.price,
  //           //   ethers.utils.parseUnits(this.state.selectedToken.price.toString())
  //           //   //  USDT_ABI
  //           // );

  //           gasPrice = await this.state.provider.getGasPrice();

  //           if (testing) {
  //             // for testing

  //             contractAddress = "0x7c87561b129f46998fc9Afb53F98b7fdaB68696f";

  //             usdtContract = new ethers.Contract(
  //               contractAddress,
  //               USDT_ABI,
  //               this.state.signer
  //             );

  //             // Hard code for testing
  //             gasLimit = await usdtContract.estimateGas.transfer(
  //               RecipientAddress,
  //               ethers.utils.parseUnits("0", 6)
  //             );
  //             amount = ethers.utils.parseUnits("0", 6);
  //           } else {
  //             // for mainnet
  //             contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  //             usdtContract = new ethers.Contract(
  //               contractAddress,
  //               USDT_ABI,
  //               this.state.signer
  //             );
  //             // for mainnet
  //             gasLimit = await usdtContract.estimateGas.transfer(
  //               RecipientAddress,
  //               ethers.utils.parseUnits(
  //                 this.state.selectedToken.price.toString(),
  //                 6
  //               )
  //             );

  //             amount = ethers.utils.parseUnits(
  //               this.state.selectedToken.price.toString(),
  //               6
  //             );
  //           }

  //           tx = await usdtContract.transfer(RecipientAddress, amount, {
  //             gasLimit,
  //             gasPrice,
  //           });
  //           receipt = await tx.wait();
  //           break;
  //         case "USDC":
  //           // console.log(
  //           //   this.state.selectedToken.name,
  //           //   this.state.selectedToken.price,
  //           //   USDC_ABI
  //           // );

  //           gasPrice = await this.state.provider.getGasPrice();

  //           if (testing) {
  //             // if true show testing
  //             // for testing
  //             contractAddress = "0x9e2e85a927285A97902336Cb23F9De94d5Af0aF5";
  //             usdcContract = new ethers.Contract(
  //               contractAddress,
  //               USDT_ABI,
  //               this.state.signer
  //             );
  //             // for test
  //             gasLimit = await usdcContract.estimateGas.transfer(
  //               RecipientAddress,
  //               ethers.utils.parseUnits("0", 6)
  //             );

  //             amount = ethers.utils.parseUnits("0", 6);
  //           } else {
  //             // Mainnet
  //             contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  //             usdcContract = new ethers.Contract(
  //               contractAddress,
  //               USDT_ABI,
  //               this.state.signer
  //             );
  //             // for mainnet
  //             gasLimit = await usdcContract.estimateGas.transfer(
  //               RecipientAddress,
  //               ethers.utils.parseUnits(
  //                 this.state.selectedToken.price.toString(),
  //                 6
  //               )
  //             );

  //             amount = ethers.utils.parseUnits(
  //               this.state.selectedToken.price.toString(),
  //               6
  //             );
  //           }

  //           tx = await usdcContract.transfer(RecipientAddress, amount, {
  //             gasLimit,
  //             gasPrice,
  //           });
  //           //  console.log("test3");
  //           receipt = await tx.wait();
  //           break;
  //         default:
  //           throw new Error(`Unsupported token: ${this.state.selectedToken}`);
  //       }

  //       // Log the transaction receipt
  //       // console.log(receipt);
  //       this.setState({
  //         transactionReceipt: receipt.transactionHash,
  //       });
  //       this.TransactionUpdate();
  //     } else {
  //       // connect metamask
  //       this.connectMetamask(false);
  //     }
  //   } catch (error) {
  //     console.error("error", error.code);
  //     this.setState({
  //       payLoader: false,
  //     });

  //     if (error.code == "ACTION_REJECTED") {
  //       toast.error("Transaction rejected");
  //     } else if (
  //       error.code == "INSUFFICIENT_FUNDS" ||
  //       error.code == "UNPREDICTABLE_GAS_LIMIT" ||
  //       error.code == -32000
  //     ) {
  //       toast.error("Insufficient funds in your wallet");
  //     } else if (error.code == "NETWORK_ERROR") {
  //       this.connectMetamask(false);
  //     }
  //   }
  // };

  // goto Checkout section after sigin
  gotoCheckout = () => {
    // console.log("checkout");
    this.setState(
      {
        RegisterModal: false,
        btnloader: false,
        isLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      },
      () => {
        this.checkoutModal();
      }
    );
  };

  // closeUpgradeModal
  closeUpgradeModal = () => {
    // console.log("close upgrade modal");
    this.setState({
      payLoader: false,
    });

    this.props.getUser(this, true);
    // if its form welcome page then redirect to Home page
    setTimeout(() => {
      // console.log("text", this.props.from, this.props.from === "home");
      if (this.props.from === "home") {
        this.props.history.push("/home");
      } else {
        this.handleAskEmail();
        // this.state.onHide();
      }
    }, 1000);
  };

  // Signin wit wallet
  SigninWallet = () => {
    // get device id
    const deviceId = window.localStorage.getItem("deviceId") || uuidv4();

    if (!window.localStorage.getItem("deviceId")) {
      // console.log("no device id");
      window.localStorage.setItem("deviceId", deviceId);
    }

    if (!window.localStorage.getItem("connectWalletAddress")) {
      window.localStorage.setItem(
        "connectWalletAddress",
        this.state.MetaAddress
      );
    }

    let data = new URLSearchParams();
    data.append("device_id", deviceId);
    data.append("wallet_address", this.state.MetaAddress);
    // console.log(
    //   "transa",
    //   deviceId,
    //   this.state.MetaAddress
    // );
    SigninWallet(data, this, this.gotoCheckout);
  };

  // update crypto address
  TransactionUpdate = () => {
    let data = new URLSearchParams();
    data.append("plan_id", this.state.selectedPlan?.id);
    data.append("transaction_hash", this.state.transactionReceipt);
    // console.log(
    //   "transa",
    //   this.state.selectedPlan?.id,
    //   this.state.transactionReceipt
    // );
    UpdateCryptoPayment(data, this, this.closeUpgradeModal);
  };

  ShowTokens = () => {
    this.setState({
      showToken: true,
    });
  };

  render() {
    return (
      <>
        {!this.state.signinModal && !this.state.hideModal && (
          <Modal
            show={this.state.show}
            className={`exit-overlay-form ${
              this.state.isMobile ? "" : "zoomedElements"
            }`}
            onHide={this.state.onHide}
            size="xl"
            dialogClassName={"upgrade"}
            centered
            aria-labelledby="contained-modal-title-vcenter"
            backdropClassName="exitoverlaymodal"
            keyboard={false}
            // backdrop={this.props.isShare && this.props.isStatic ? "static" : true}
            backdrop={this.props.isStatic ? "static" : true}
          >
            <Modal.Header>
              <div className="UpgradeIcon">
                <Image src={LochIcon} />
              </div>
              {!this.props.isStatic && (
                <div
                  className="closebtn"
                  onClick={() => {
                    this.state.onHide();
                  }}
                >
                  <Image src={CloseIcon} />
                </div>
              )}
              {(this.state.RegisterModal || this.state.CheckOutModal) && (
                <div className="back-icon-upgrade cp" onClick={this.handleBack}>
                  <Image src={backIcon} />
                </div>
              )}
              <h6 className="inter-display-medium f-s-25 lh-30 m-t-28">
                {"Do more with Loch"}
              </h6>
              <p className="inter-display-medium f-s-16 lh-19 grey-969 text-center m-t-5">
                {"Upgrade your plan"}
              </p>
            </Modal.Header>
            <Modal.Body>
              <div className="upgrade-overlay-body">
                {/* this.props.isSkip(); */}
                {!this.state.hideUpgradeModal ? (
                  <div className="pricing-plan">
                    <Row>
                      {this.state?.planList
                        .filter((e) => e.name !== "Trial")
                        .map((plan, i) => {
                          return (
                            <Col md={4}>
                              <div className="plan-card-wrapper">
                                <div
                                  className={`plan-card ${
                                    plan.name === this.state.userPlan.name
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <div
                                    className={`pricing-section
                              ${
                                i === 1
                                  ? "baron-bg"
                                  : i === 2
                                  ? "soverign-bg"
                                  : ""
                              }
                              `}
                                  >
                                    <h3>{plan.name}</h3>
                                    <div className="price">
                                      <h4>${plan.price}</h4>
                                      {i !== 0 && <p>monthly</p>}
                                    </div>
                                  </div>
                                  <div className="feature-list-wrapper">
                                    {plan?.features.map((list) => {
                                      return (
                                        <div
                                          className={`feature-list ${
                                            this.props.triggerId === list?.id
                                              ? i === 0
                                                ? "free-plan"
                                                : i === 1
                                                ? "baron-plan"
                                                : i === 2
                                                ? "soverign-plan"
                                                : ""
                                              : ""
                                          }`}
                                        >
                                          <div className="label">
                                            <Image
                                              src={list?.img}
                                              // style={
                                              //   list?.id == 9
                                              //     ? {
                                              //         opacity: "opacity: 0.6;",
                                              //         // filter: "invert(1)",
                                              //       }
                                              //     : {}
                                              // }
                                            />
                                            <h3>{list.name}</h3>
                                          </div>
                                          <h4>
                                            {list.name !== "Insights"
                                              ? list.limit === false
                                                ? "No"
                                                : list.limit === true
                                                ? "Yes"
                                                : list.limit === -1
                                                ? "Unlimited"
                                                : list.limit
                                              : list.limit === false
                                              ? "Limited"
                                              : "Unlimited"}
                                          </h4>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <Button
                                  className={`primary-btn ${
                                    plan.name === this.state.userPlan.name
                                      ? "disabled"
                                      : ""
                                  }`}
                                  style={
                                    i === 0
                                      ? { position: "relative", top: "2.3rem" }
                                      : {}
                                  }
                                  onClick={() => {
                                    if (
                                      plan.name !== this.state.userPlan.name
                                    ) {
                                      this.AddEmailModal();
                                      this.setState(
                                        {
                                          price_id: plan.price_id,
                                          selectedPlan: plan,
                                        },
                                        () => {
                                          this.getAmount();
                                        }
                                      );
                                    }
                                  }}
                                >
                                  {plan.name === this.state.userPlan.name
                                    ? "Current tier"
                                    : "Upgrade"}
                                </Button>
                              </div>
                            </Col>
                          );
                        })}
                      {!this.state?.userPlan?.subscription &&
                        this.state?.planList
                          .filter((e) => e.name === "Trial")
                          .map((plan, i) => {
                            return (
                              <Col md={12} className="m-t-16">
                                <div
                                  className="plan-card-wrapper"
                                  //  style={{
                                  //    display: "flex",
                                  //    alignItems: "center",
                                  //    justifyContent: "space-between",
                                  //  }}
                                >
                                  <div
                                    // className={`plan-card`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: "1.5rem",
                                    }}
                                  >
                                    <div>
                                      <h3 className="inter-display-medium f-s-16 lh-25 text-center">
                                        Not sure about paying the full amount?
                                        Don't worry. The first 5 days are free.
                                        You can also unsubscribe at anytime.
                                      </h3>
                                      {/* <h3 className="inter-display-medium f-s-16 lh-25">
                                        Want to try before subscribing?
                                      </h3>
                                      <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                                        Try the unlimited Sovereign plan for{" "}
                                        {plan.trial_day}{" "}
                                        {plan.trial_day > 1 ? "days" : "day"}{" "}
                                        for ${plan.price}
                                      </h5> */}
                                    </div>
                                    {/* <Button
                                      className={`primary-btn ${
                                        plan.name === this.state.userPlan.name
                                          ? "disabled"
                                          : ""
                                      }`}
                                      style={{ width: "auto", margin: 0 }}
                                      onClick={() => {
                                        this.AddEmailModal();
                                        this.setState({
                                          price_id: plan.price_id,
                                          selectedPlan: plan,
                                        });
                                      }}
                                    >
                                      Trial
                                    </Button> */}
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                    </Row>
                  </div>
                ) : (
                  <div className="pricing-plan">
                    <Row>
                      <Col
                        md={5}
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "center",
                          display: "flex",
                          paddingRight: "1rem",
                        }}
                      >
                        <div
                          className="plan-card-wrapper"
                          style={{ width: "85%" }}
                        >
                          <div className={"plan-card active"}>
                            <div
                              className={`pricing-section
                              ${
                                this.state.selectedPlan?.name === "Baron"
                                  ? "baron-bg"
                                  : this.state.selectedPlan?.name ===
                                      "Sovereign" ||
                                    this.state.selectedPlan?.name === "Trial"
                                  ? "soverign-bg"
                                  : ""
                              }
                              `}
                            >
                              <h3>{this.state.selectedPlan?.name}</h3>
                              <div className="price">
                                <h4>${this.state.selectedPlan?.price}</h4>
                                {this.state.selectedPlan?.name !== "Free" && (
                                  <p>
                                    {this.state.selectedPlan?.name === "Trial"
                                      ? "1 day"
                                      : "monthly"}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="feature-list-wrapper">
                              {this.state.selectedPlan?.features?.map(
                                (list) => {
                                  return (
                                    <div
                                      className={`feature-list ${
                                        this.props.triggerId === list?.id
                                          ? this.state.selectedPlan?.name ===
                                            "Free"
                                            ? "free-plan"
                                            : this.state.selectedPlan?.name ===
                                              "Baron"
                                            ? "baron-plan"
                                            : this.state.selectedPlan?.name ===
                                                "Soverign" ||
                                              this.state.selectedPlan?.name ===
                                                "Trial"
                                            ? "soverign-plan"
                                            : ""
                                          : ""
                                      }`}
                                    >
                                      <div className="label">
                                        <Image
                                          src={list?.img}
                                          // style={
                                          //   list?.id == 9
                                          //     ? {
                                          //         opacity: "opacity: 0.6;",
                                          //         // filter: "invert(1)",
                                          //       }
                                          //     :{ }
                                          // }
                                        />
                                        <h3>{list.name}</h3>
                                      </div>
                                      <h4>
                                        {list.name !== "Insights"
                                          ? list.limit === false
                                            ? "No"
                                            : list.limit === true
                                            ? "Yes"
                                            : list.limit === -1
                                            ? "Unlimited"
                                            : list.limit
                                          : list.limit === false
                                          ? "Limited"
                                          : "Unlimited"}
                                      </h4>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                          <Button
                            className={`primary-btn  disabled`}
                            style={{ cursor: "auto" }}
                            onClick={() => {
                              // if (plan.name !== this.state.userPlan.name) {
                              //   this.AddEmailModal();
                              //   this.setState({
                              //     price_id: plan.price_id,
                              //     selectedPlan: plan,
                              //   });
                              // }
                            }}
                          >
                            Your choosen plan
                          </Button>
                        </div>
                      </Col>
                      <Col
                        md={7}
                        style={{
                          paddingLeft: "3.5rem",
                          paddingBottom: "10rem",
                        }}
                      >
                        {this.state.RegisterModal && !this.state.isShowOtp ? (
                          <p className="inter-display-medium f-s-16 lh-19 m-b-28 grey-969">
                            Verify your email address to create an <br />
                            account with Loch
                          </p>
                        ) : (
                          ""
                        )}
                        {this.state.isShowOtp && !this.state.CheckOutModal ? (
                          <p className="inter-display-medium f-s-16 lh-19 m-b-28 black-191">
                            We’ve sent you a verification code to your email
                          </p>
                        ) : (
                          ""
                        )}
                        {this.state.CheckOutModal ? (
                          <>
                            <Image src={CheckIcon} className="m-b-5" />
                            <p
                              className="inter-display-medium f-s-16 lh-19 m-b-20 black-191"
                              style={{ opacity: "0.8" }}
                            >
                              Great! We’ve verified your account. <br />
                              You’re just one step away to becoming a{" "}
                              <span class="inter-display-bold f-s-16 lh-19">
                                {this.state.selectedPlan?.name}!
                              </span>
                            </p>
                          </>
                        ) : (
                          ""
                        )}

                        <div
                          className="email-section auth-modal"
                          style={{ paddingRight: "3rem" }}
                        >
                          {/* For Signin or Signup */}
                          {this.state.RegisterModal && (
                            <>
                              {!this.state.isShowOtp ? (
                                <>
                                  <Form
                                    onValidSubmit={this.handleAccountCreate}
                                  >
                                    <FormElement
                                      valueLink={this.linkState(this, "email")}
                                      // label="Email Info"
                                      required
                                      validations={[
                                        {
                                          validate: FormValidator.isRequired,
                                          message: "",
                                        },
                                        {
                                          validate: FormValidator.isEmail,
                                          message:
                                            "Please enter valid email id",
                                        },
                                      ]}
                                      control={{
                                        type: CustomTextControl,
                                        settings: {
                                          placeholder: "Email",
                                        },
                                      }}
                                    />
                                    <div className="save-btn-section">
                                      <Button
                                        className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                                          this.state.email ? "active" : ""
                                        }`}
                                        type="submit"
                                      >
                                        Confirm
                                      </Button>
                                    </div>
                                  </Form>
                                  <p className="text-center inter-display-medium f-s-13 m-t-16 grey-969">
                                    or
                                  </p>
                                  <Button
                                    className={`primary-btn m-t-16 ${
                                      this.state.btnloader ? "disabled" : ""
                                    }`}
                                    style={{
                                      width: "100%",
                                      padding: "1.4rem 4rem",
                                    }}
                                    onClick={() => {
                                      if (this.state.btnloader) {
                                      } else {
                                        this.connectMetamask();
                                      }
                                    }}
                                  >
                                    {this.state.btnloader
                                      ? loadingAnimation()
                                      : "Connect metamask"}
                                  </Button>

                                  <h3 className="inter-display-medium f-s-16 lh-25 m-t-20">
                                    Not sure about paying the full amount? Don't
                                    worry. The first 5 days are free. You can
                                    also unsubscribe at anytime.
                                  </h3>
                                </>
                              ) : (
                                <>
                                  <Form onValidSubmit={this.handleOtp}>
                                    <FormElement
                                      valueLink={this.linkState(this, "otp")}
                                      // label="Email Info"
                                      required
                                      validations={
                                        [
                                          // {
                                          //   validate: FormValidator.isRequired,
                                          //   message: "",
                                          // },
                                          //   {
                                          //     validate: FormValidator.isNum,
                                          //     message: "Verification code can have only numbers",
                                          //     },
                                          // {
                                          //     validate: () => {
                                          //       console.log("state", this.state.isOptInValid);
                                          //        return !this.state.isOptInValid;
                                          //   },
                                          //     message:"invalid verification code"
                                          // }
                                        ]
                                      }
                                      control={{
                                        type: CustomTextControl,
                                        settings: {
                                          placeholder:
                                            "Enter Verification Code",
                                        },
                                      }}
                                      // className={"is-valid"}
                                    />
                                    <div className="save-btn-section">
                                      <Button
                                        className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                                          this.state.otp ? "active" : ""
                                        }`}
                                        type="submit"
                                      >
                                        Verify
                                      </Button>
                                    </div>
                                  </Form>
                                  {this.state.isOptInValid && (
                                    <p
                                      className="inter-display-regular f-s-10 lh-11 m-t-5"
                                      style={{ color: "#ea4e3c" }}
                                    >
                                      Invalid verification code
                                    </p>
                                  )}
                                  <h3 className="inter-display-medium f-s-16 lh-25 m-t-28">
                                    Not sure about paying the full amount? Don't
                                    worry. The first 5 days are free. You can
                                    also unsubscribe at anytime.
                                  </h3>
                                </>
                              )}
                            </>
                          )}
                          {this.state.CheckOutModal && (
                            <>
                              <Button
                                className={`primary-btn`}
                                onClick={() => {
                                  // if (plan.name !== this.state.userPlan.name) {
                                  //   this.AddEmailModal();
                                  //   this.setState({
                                  //     price_id: plan.price_id,
                                  //     selectedPlan: plan,
                                  //   });
                                  // }
                                  window.open(this.state.payment_link);
                                }}
                              >
                                Pay with card
                              </Button>

                              <Button
                                onClick={() => {
                                  if (this.state.payLoader) {
                                  } else {
                                    this.ShowTokens();
                                  }
                                }}
                                className={`secondary-btn m-l-10 ${
                                  this.state.payLoader ? "disabled" : ""
                                }`}
                                style={
                                  this.state.payLoader
                                    ? {
                                        padding: "1.3rem 4rem",
                                        minWidth: "20.5rem",
                                        // cursor: "not-allowed",
                                      }
                                    : {}
                                }
                              >
                                {this.state.payLoader
                                  ? loadingAnimation()
                                  : "Pay with crypto"}
                              </Button>

                              {!this.state.payLoader &&
                                this.state.showToken && (
                                  <>
                                    <p className="inter-display-medium f-s-13 lh-15 m-b-10 m-t-16 black-191">
                                      Please select token to make payment
                                    </p>
                                    <div style={{ display: "flex" }}>
                                      {this.state.tokensList.map((token) => {
                                        return (
                                          <div
                                            className="inter-display-medium f-s-13 lh-15 m-r-8 black-191 amountType"
                                            onClick={() => {
                                              this.setState(
                                                {
                                                  selectedToken: token,
                                                },
                                                () => {
                                                  if (this.state.payLoader) {
                                                  } else {
                                                    this.handleTransaction();
                                                  }
                                                }
                                              );
                                            }}
                                          >
                                            {token.price.toFixed(3) +
                                              " " +
                                              token.name}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                            </>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
                {!this.state.isLochUser && (
                  <p className="inter-display-medium f-s-16 lh-19 grey-969 text-center m-b-16">
                    Already have an account?{" "}
                    <span
                      className="black-191 cp signin-link"
                      onClick={this.handleSignin}
                    >
                      Sign in instead
                    </span>
                    .
                  </p>
                )}

                <div className="m-b-36 footer">
                  <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                    At Loch, we care intensely about your privacy and
                    pseudonymity.
                  </p>
                  <CustomOverlay
                    text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                    position="top"
                    isIcon={true}
                    IconImage={LockIcon}
                    isInfo={true}
                    className={"fix-width"}
                  >
                    <Image
                      src={InfoIcon}
                      className="info-icon"
                      onMouseEnter={() => {
                        WhaleCreateAccountPrivacyHover({
                          session_id: getCurrentUser().id,
                          email_address: this.state.email,
                        });
                        if (this.props.updateTimer) {
                          this.props.updateTimer();
                        }
                      }}
                    />
                  </CustomOverlay>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
        {this.state.signinModal ? (
          <AuthModal
            show={this.state.signinModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={
              this.props?.signinBack
                ? this.handleSigninBackbtn
                : this.handleSignin
            }
            history={this.props.history}
            modalType={"create_account"}
            iconImage={SignInIcon}
            hideSkip={true}
            title="Sign in"
            description="Get right back into your account"
            stopUpdate={true}
            tracking="Upgrade sign in popup"
            signinBack={
              this.props?.signinBack ? this.handleSigninBackbtn : false
            }
          />
        ) : (
          ""
        )}
        {this.state.emailModal && (
          <AskEmailModal
            show={this.state.emailModal}
            onHide={this.handleAskEmail}
            history={this.props.history}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  fixWalletApi,
  getAllCoins,
  detectCoin,
  getAllParentChains,
  getUser,
};

UpgradeModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeModal);
