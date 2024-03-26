import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader.js";
import { getAllCoins } from "../onboarding/Api.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import {
  CopyTradeAddCopyTrade,
  CopyTradeAdded,
  CopyTradeAvailableCopiedWalletClicked,
  CopyTradeCopiedWalletClicked,
  CopyTradeExecuteTradeModalOpen,
  CopyTradeExecuteTradeRejected,
  CopyTradePageView,
  CopyTradePayWallOpen,
  CopyTradePopularAccountCopyClicked,
  CopyTradePopularAccountWalletClicked,
  CopyTradeTimeSpent,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";

// add wallet
import { Image } from "react-bootstrap";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  AvailableCopyTradeCheckIcon,
  AvailableCopyTradeCrossIcon,
  EmultionSidebarIcon,
  ExportIconWhite,
  NoCopyTradeTableIcon,
  PersonRoundedSigninIcon,
  TrendingFireIcon,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
  UserCreditScrollTopArrowIcon,
} from "../../assets/images/icons/index.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  mobileCheck,
  numToCurrency,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api.js";
import BasicConfirmModal from "../common/BasicConfirmModal.js";
import ExitOverlay from "../common/ExitOverlay.js";
import MobileLayout from "../layout/MobileLayout.js";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal.js";
import {
  addCopyTrade,
  getCopyTrade,
  updaetAvailableCopyTraes,
} from "./EmulationsApi.js";
import EmulationsMobile from "./EmulationsMobile.js";
import EmulationsTradeModal from "./EmulationsTradeModal.js";
import "./_emulations.scss";
import EmulationsPaywall from "./EmulationsPaywall.js";

class Emulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopularAccountsBlockOpen: true,
      isPayModalOpen: false,
      passedCTNotificationEmailAddress: "",
      passedCTAddress: "",
      passedCTCopyTradeAmount: "",
      popularAccountsList: [
        {
          address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
          nameTag: "@smartestmoney_",
          netWorth: 36567693.050387464,
        },
        {
          address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
          nameTag: "@Titanium_32",
          netWorth: 30361002.434807304,
        },
        {
          address: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8",
          nameTag: "@winharper",
          netWorth: 19306221.746918082,
        },
        {
          address: "0x4EE79E19c9c398e364d135F01B25DcCC0473047c",
          nameTag: "@0xvladilena",
          netWorth: 18728616.905514523,
        },
        {
          address: "0xB7FA2214c79cAbC24CB270F57D52B83A2a7fEdd8",
          nameTag: "@PseudonCrypto",
          netWorth: 8781693.634935401,
        },
      ],
      prefillCopyAddress: undefined,
      isAvailableCopyTradeBlockOpen: true,
      isRejectModal: false,
      executeCopyTradeId: undefined,
      isExecuteCopyTrade: false,
      isPopularLeftArrowDisabled: true,
      isPopularRightArrowDisabled: false,
      shadowDisablePopularArrows: false,
      isLeftArrowDisabled: true,
      isRightArrowDisabled: true,
      currentPopularCirclePosition: 0,
      currentCirclePosition: 0,
      userDetailsState: undefined,
      copyTradesAvailableLocal: [],
      paymentStatusLocal: "UNPAID",
      emulationsUpdated: false,
      isAddCopyTradeAddress: false,
      copyTradesLocal: [],
      startTime: "",
      emulationsLoading: true,
      showDust: true,
      connectModal: false,
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
    };
  }
  history = this.props;
  toggleAvailableCopyTradeBlockOpen = () => {
    this.setState({
      isAvailableCopyTradeBlockOpen: !this.state.isAvailableCopyTradeBlockOpen,
    });
  };
  togglePopularAccountsBlockOpen = () => {
    this.setState({
      isPopularAccountsBlockOpen: !this.state.isPopularAccountsBlockOpen,
    });
  };

  showAddCopyTradeAddress = () => {
    CopyTradeAddCopyTrade({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.state.userDetailsState && this.state.userDetailsState.email) {
      this.removeCopyTradeBtnClickedLocal();
      this.setState({
        isAddCopyTradeAddress: true,
      });
    } else {
      if (document.getElementById("sidebar-open-sign-in-btn-copy-trader")) {
        document.getElementById("sidebar-open-sign-in-btn-copy-trader").click();
        this.addCopyTradeBtnClickedLocal();
      } else if (
        document.getElementById("sidebar-closed-sign-in-btn-copy-trader")
      ) {
        this.addCopyTradeBtnClickedLocal();
        document
          .getElementById("sidebar-closed-sign-in-btn-copy-trader")
          .click();
      }
    }
  };
  hideAddCopyTradeAddress = (isRecall) => {
    this.removeCopyTradeBtnClickedLocal();
    this.setState({
      isAddCopyTradeAddress: false,
      prefillCopyAddress: undefined,
    });
    if (isRecall === true) {
      this.callEmulationsApi();
    }
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    CopyTradePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkEmulationsTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    scrollToTop();
    this.props.getAllCoins();
    this.props.GetAllPlan();
    this.props.getUser();
    this.callEmulationsApi();
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
    this.getAllWalletList();

    let tempHaveUserPaid = window.sessionStorage.getItem(
      "haveUserPaidForCopyTrade"
    );
    if (tempHaveUserPaid) {
      this.setState({
        paymentStatusLocal: "PAID",
      });
    }
    if (userDetails) {
      this.setState(
        {
          userDetailsState: userDetails,
        },
        () => {
          const isLoginAttmepted = window.sessionStorage.getItem(
            "copyTradeLoginClicked"
          );
          const isLoginAttmeptedValue = window.sessionStorage.getItem(
            "copyTradeLoginClickedValue"
          );

          if (isLoginAttmepted && isLoginAttmepted === "true") {
            setTimeout(() => {
              if (isLoginAttmeptedValue) {
                this.setState(
                  {
                    prefillCopyAddress: isLoginAttmeptedValue,
                  },
                  () => {
                    this.showAddCopyTradeAddress();
                  }
                );
              } else {
                this.showAddCopyTradeAddress();
              }
            }, 1500);
          }
        }
      );
    }
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const isAddTrade = params.get("addTrade");
    if (isAddTrade) {
      window.sessionStorage.setItem("haveUserPaidForCopyTrade", true);
      let emailHolder = "";
      let walletHolder = "";
      let amountHolder = 0;
      if (params.get("ctrEmail")) {
        emailHolder = params.get("ctrEmail");
      }
      if (params.get("ctrWallet")) {
        walletHolder = params.get("ctrWallet");
      }
      if (params.get("ctrAmount")) {
        amountHolder = params.get("ctrAmount");
      }
      this.addTradeFromURL(walletHolder, emailHolder, amountHolder);
    }

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkEmulationsTimer);
    };
  }
  addTradeFromURL = (passedWallet, passedEmail, passedAmount) => {
    let data = new URLSearchParams();
    data.append("deposit", passedAmount);
    data.append("email", passedEmail);
    data.append("copy_address", passedWallet);

    CopyTradeAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      copied_wallet: passedWallet,
      amount: passedAmount,
      notification_email: passedEmail,
    });

    this.props.addCopyTrade(data, this.resetPage);
  };
  resetPage = () => {
    this.props.history.replace("/copy-trade");
    this.callEmulationsApi();
  };
  addCopyTradeBtnClickedLocal = () => {
    window.sessionStorage.setItem("copyTradeLoginClicked", true);
    if (this.state.prefillCopyAddress) {
      window.sessionStorage.setItem(
        "copyTradeLoginClickedValue",
        this.state.prefillCopyAddress
      );
    }
  };
  removeCopyTradeBtnClickedLocal = () => {
    let isLoginClickedStored = window.sessionStorage.getItem(
      "copyTradeLoginClicked"
    );
    if (isLoginClickedStored) {
      window.sessionStorage.removeItem("copyTradeLoginClicked");
      window.sessionStorage.removeItem("copyTradeLoginClickedValue");
    }
  };
  callEmulationsApi = (updatedAddress) => {
    if (updatedAddress) {
      this.setState({
        emulationsUpdated: !this.state.emulationsUpdated,
      });
    }
    this.setState({
      emulationsLoading: true,
    });
    this.props.updateWalletListFlag("emulationsPage", true);
    this.props.getCopyTrade(this);
  };
  setLocalEmulationList = () => {
    if (this.props.emulationsState) {
      let tempEmulationsLocal = [];
      let tempEmulationsAvailableLocal = [];

      if (this.props.emulationsState.copyTrades) {
        tempEmulationsLocal = this.props.emulationsState.copyTrades;
      }
      if (this.props.emulationsState.availableCopyTrades) {
        tempEmulationsAvailableLocal =
          this.props.emulationsState.availableCopyTrades;
      }

      if (this.props.emulationsState.paymentStatus) {
        let tempHaveUserPaid = window.sessionStorage.getItem(
          "haveUserPaidForCopyTrade"
        );

        if (tempHaveUserPaid) {
          this.setState({
            paymentStatusLocal: "PAID",
          });
        } else {
          this.setState({
            paymentStatusLocal: this.props.emulationsState.paymentStatus,
          });
        }
      }

      this.setState({
        emulationsLoading: false,
        copyTradesLocal: tempEmulationsLocal,
        // copyTradesAvailableLocal: tempEmulationsAvailableLocal,
        copyTradesAvailableLocal: [
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
          {
            copyAddress: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
            valueFrom: 500,
            valueTo: 1000,
            assetFrom: "ETH",
            assetTo: "USDT",
          },
        ],
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.copyTradesAvailableLocal !==
        this.state.copyTradesAvailableLocal &&
      this.state.copyTradesAvailableLocal.length > 1
    ) {
      this.setState({
        isLeftArrowDisabled: true,
        isRightArrowDisabled: false,
      });
    }
    if (prevState.isAddCopyTradeAddress !== this.state.isAddCopyTradeAddress) {
      if (this.state.isAddCopyTradeAddress) {
        window.sessionStorage.setItem("copyTradeModalOpen", true);
      } else {
        if (window.sessionStorage.getItem("copyTradeModalOpen")) {
          window.sessionStorage.removeItem("copyTradeModalOpen");
        }
      }
    }

    if (prevProps.emulationsState !== this.props.emulationsState) {
      this.setLocalEmulationList();
    }
    // add wallet
    if (prevState.apiResponse !== this.state.apiResponse) {
      this.callEmulationsApi();
      this.props.getAllCoins();
      this.setState({
        apiResponse: false,
      });
      this.getAllWalletList();
    }

    if (!this.props.commonState.emulationsPage) {
      this.getAllWalletList();
    }
  }
  getAllWalletList = () => {
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (userDetails) {
      this.setState({
        userDetailsState: userDetails,
      });
    }
    this.callEmulationsApi(true);
    let tempData = new URLSearchParams();
    tempData.append("start", 0);
    tempData.append("conditions", JSON.stringify([]));
    tempData.append("limit", 50);
    tempData.append("sorts", JSON.stringify([]));
    this.props.getAllWalletListApi(tempData, this);
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    this.props.setPageFlagDefault();
  };

  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("emulationsPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkEmulationsTimer);
    window.sessionStorage.removeItem("emulationsPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      CopyTradeTimeSpent({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    this.removeCopyTradeBtnClickedLocal();
    const tempExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };
  hideExecuteCopyTrade = () => {
    this.setState({
      isExecuteCopyTrade: false,
    });
  };
  showExecuteCopyTrade = (passedTradeId) => {
    CopyTradeExecuteTradeModalOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState({
      isExecuteCopyTrade: true,
      executeCopyTradeId: passedTradeId,
    });
  };
  openRejectModal = (tradeId) => {
    this.setState({
      isRejectModal: true,
      executeCopyTradeId: tradeId,
    });
  };
  closeRejectModal = () => {
    this.setState({
      isRejectModal: false,
      executeCopyTradeId: undefined,
    });
  };
  executeRejectModal = () => {
    this.closeRejectModal();
    this.confirmOrRejectCopyTrade(this.state.executeCopyTradeId, false);
  };
  confirmOrRejectCopyTrade = (tradeId, isConfirm) => {
    let conRejData = new URLSearchParams();
    if (isConfirm) {
      conRejData.append("status", "CONFIRM");
    } else {
      CopyTradeExecuteTradeRejected({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        swapAddress: tradeId,
      });
      conRejData.append("status", "REJECT");
    }
    conRejData.append("trade_id", tradeId);
    this.props.updaetAvailableCopyTraes(
      conRejData,
      this.callEmulationsApi,
      isConfirm
    );
  };
  goToNewAddress = (passedAddress) => {
    CopyTradeAvailableCopiedWalletClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      wallet: passedAddress,
    });
    let slink = passedAddress;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?noPopup=true";

    window.open(shareLink, "_blank", "noreferrer");
  };
  newPosBase = () => {
    if (this.state.copyTradesAvailableLocal) {
      return this.state.copyTradesAvailableLocal.length;
    }
    return 1;
    // return this.state.tasksList.length;
  };

  scrollRight = () => {
    if (this.state.isRightArrowDisabled) {
      return;
    }
    // UserCreditRightScrollClickedMP({
    //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
    //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
    // });
    var myElement = document.getElementById("availableCopyTradeScrollBody");
    var myElementWidth = document.getElementById(
      "availableCopyTradeScrollBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "availableCopyTradeScrollBody"
    ).scrollLeft;

    const newPos = myElementCurrentScrollPos + myElementWidth;
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = newPos / myElementWidth;
    this.setState({
      currentCirclePosition: currentCirPos,
    });
    if (newPos === (this.newPosBase() - 1) * myElementWidth) {
      this.setState({
        isRightArrowDisabled: true,
        isLeftArrowDisabled: false,
      });
    } else {
      this.setState({
        isRightArrowDisabled: false,
        isLeftArrowDisabled: false,
      });
    }
  };
  scrollLeft = () => {
    if (this.state.isLeftArrowDisabled) {
      return;
    }
    // UserCreditLeftScrollClickedMP({
    //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
    //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
    // });
    var myElement = document.getElementById("availableCopyTradeScrollBody");
    var myElementWidth = document.getElementById(
      "availableCopyTradeScrollBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "availableCopyTradeScrollBody"
    ).scrollLeft;
    const newPos = myElementCurrentScrollPos - myElementWidth;

    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = newPos / myElementWidth;
    this.setState({
      currentCirclePosition: currentCirPos,
    });
    if (newPos <= 0) {
      this.setState({
        isLeftArrowDisabled: true,
        isRightArrowDisabled: false,
      });
    } else {
      this.setState({
        isLeftArrowDisabled: false,
        isRightArrowDisabled: false,
      });
    }
  };
  goToScrollPosition = (blockPos) => {
    var myElement = document.getElementById("availableCopyTradeScrollBody");
    var myElementWidth = document.getElementById(
      "availableCopyTradeScrollBody"
    )?.clientWidth;
    myElement.scroll({
      left: myElementWidth * blockPos,
      behavior: "smooth",
    });
  };
  handleAvailableTradeScroll = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      var myElementWidth = document.getElementById(
        "availableCopyTradeScrollBody"
      )?.clientWidth;
      var newPos = document.getElementById(
        "availableCopyTradeScrollBody"
      ).scrollLeft;
      let currentCirPos = newPos / myElementWidth;
      this.setState({
        currentCirclePosition: currentCirPos,
      });
      if (newPos === 0) {
        this.setState({
          isLeftArrowDisabled: true,
          isRightArrowDisabled: false,
        });
      } else if (newPos === (this.newPosBase() - 1) * myElementWidth) {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: true,
        });
      } else {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: false,
        });
      }
    }, 150);
  };

  // Popular accounts to copy
  newPosBasePopular = () => {
    if (this.state.popularAccountsList) {
      return this.state.popularAccountsList.length;
    }
    return 1;
  };

  scrollRightPopular = () => {
    if (
      this.state.isPopularRightArrowDisabled ||
      this.state.shadowDisablePopularArrows
    ) {
      return;
    }
    this.setState({
      shadowDisablePopularArrows: true,
    });
    var myElement = document.getElementById("popularCopyTradeScrollBody");
    var myElementWidth = document.getElementById(
      "popularCopyTradeScrollBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "popularCopyTradeScrollBody"
    ).scrollLeft;

    let newPos = 0;
    if (mobileCheck()) {
      newPos = myElementCurrentScrollPos + myElementWidth;
    } else {
      let tempPositionHolder = this.state.currentPopularCirclePosition;

      const nextBlock = document.getElementById(
        `copyTradePopularAccountNumber${tempPositionHolder}`
      )?.clientWidth;

      newPos = myElementCurrentScrollPos + nextBlock;
    }
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = this.state.currentPopularCirclePosition;
    if (currentCirPos + 1 === this.state.popularAccountsList.length - 1) {
      this.setState({
        isPopularLeftArrowDisabled: false,
        isPopularRightArrowDisabled: true,
      });
    } else {
      this.setState({
        isPopularLeftArrowDisabled: false,
        isPopularRightArrowDisabled: false,
      });
    }
    if (
      currentCirPos >= 0 &&
      currentCirPos <= this.state.popularAccountsList.length - 1
    ) {
      this.setState({
        currentPopularCirclePosition: currentCirPos + 1,
      });
    }
  };
  scrollLeftPopular = () => {
    if (
      this.state.isPopularLeftArrowDisabled ||
      this.state.shadowDisablePopularArrows
    ) {
      return;
    }
    this.setState({
      shadowDisablePopularArrows: true,
    });
    var myElement = document.getElementById("popularCopyTradeScrollBody");
    var myElementWidth = document.getElementById(
      "popularCopyTradeScrollBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "popularCopyTradeScrollBody"
    ).scrollLeft;
    let newPos = 0;
    if (mobileCheck()) {
      newPos = myElementCurrentScrollPos - myElementWidth;
    } else {
      let tempPositionHolder = this.state.currentPopularCirclePosition;
      if (tempPositionHolder === this.state.popularAccountsList.length - 1) {
        tempPositionHolder = tempPositionHolder - 1;
      }

      const nextBlock = document.getElementById(
        `copyTradePopularAccountNumber${tempPositionHolder}`
      )?.clientWidth;
      newPos = myElementCurrentScrollPos - nextBlock;
    }
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = this.state.currentPopularCirclePosition;
    if (currentCirPos - 1 === 0) {
      this.setState({
        isPopularLeftArrowDisabled: true,
        isPopularRightArrowDisabled: false,
      });
    } else {
      this.setState({
        isPopularLeftArrowDisabled: false,
        isPopularRightArrowDisabled: false,
      });
    }
    if (
      currentCirPos >= 0 &&
      currentCirPos <= this.state.popularAccountsList.length - 1
    ) {
      this.setState({
        currentPopularCirclePosition: currentCirPos - 1,
      });
    }
  };
  goToScrollPositionPopular = (blockPos) => {
    this.setState({
      currentPopularCirclePosition: blockPos,
    });
    var myElement = document.getElementById("popularCopyTradeScrollBody");
    if (mobileCheck()) {
      var myElementWidth = document.getElementById(
        "popularCopyTradeScrollBody"
      )?.clientWidth;
      myElement.scroll({
        left: myElementWidth * blockPos,
        behavior: "smooth",
      });
    } else {
      let totalWidthYet = 0;
      for (let index = 0; index < blockPos; index++) {
        const currElementWidth = document.getElementById(
          `copyTradePopularAccountNumber${index}`
        )?.clientWidth;

        totalWidthYet = totalWidthYet + currElementWidth;
      }
      myElement.scroll({
        left: totalWidthYet,
        behavior: "smooth",
      });
    }
  };
  handlePopularTradeScroll = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      var myElementWidth = document.getElementById(
        "popularCopyTradeScrollBody"
      )?.clientWidth;
      var newPos = document.getElementById(
        "popularCopyTradeScrollBody"
      ).scrollLeft;
      let currentCirPos = 0;
      if (mobileCheck()) {
        currentCirPos = newPos / myElementWidth;
      } else {
        let totalWidthYet = 0;
        for (
          let index = 0;
          index < this.state.popularAccountsList.length;
          index++
        ) {
          const currElementWidth = document.getElementById(
            `copyTradePopularAccountNumber${index}`
          )?.clientWidth;
          if (totalWidthYet - 10 <= newPos && totalWidthYet + 10 >= newPos) {
            currentCirPos = index;
            break;
          }
          totalWidthYet = totalWidthYet + currElementWidth;
        }
      }

      this.setState({
        currentPopularCirclePosition: currentCirPos,
        shadowDisablePopularArrows: false,
      });
      if (currentCirPos === 0) {
        this.setState({
          isPopularLeftArrowDisabled: true,
          isPopularRightArrowDisabled: false,
        });
      } else if (currentCirPos === this.state.popularAccountsList.length - 1) {
        this.setState({
          isPopularLeftArrowDisabled: false,
          isPopularRightArrowDisabled: true,
        });
      } else {
        this.setState({
          isPopularLeftArrowDisabled: false,
          isPopularRightArrowDisabled: false,
        });
      }
    }, 150);
  };
  openPayModal = (emailHolder, walletHolder, amountHolder) => {
    CopyTradePayWallOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        passedCTNotificationEmailAddress: emailHolder,
        passedCTAddress: walletHolder,
        passedCTCopyTradeAmount: amountHolder,
      },
      () => {
        this.setState({
          isPayModalOpen: true,
        });
      }
    );
  };
  goBackToAddCopyTradeModal = () => {
    this.setState({
      isPayModalOpen: false,
    });
  };
  closePayModal = () => {
    this.hideAddCopyTradeAddress();
    this.setState({
      isPayModalOpen: false,
    });
  };
  addPrefillCopyAddress = (passedAddress, isLoggedIn) => {
    this.setState(
      {
        prefillCopyAddress: passedAddress,
      },
      () => {
        if (isLoggedIn) {
          this.showAddCopyTradeAddress();
        } else {
          this.addCopyTradeBtnClickedLocal();
        }
      }
    );
  };
  render() {
    const columnData = [
      {
        labelName: (
          <div className="history-table-header-col" id="Average Cost Price">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Copied wallet
            </span>
          </div>
        ),
        dataKey: "Copiedwallet",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Copiedwallet") {
            const regex = /\.eth$/;
            let holderValue = "-";
            if (rowData.wallet) {
              holderValue = rowData.wallet;
            }
            if (!regex.test(holderValue)) {
              holderValue = TruncateText(rowData.wallet);
            }
            return (
              <span
                onClick={() => {
                  if (rowData.wallet) {
                    let slink = rowData.wallet;
                    let shareLink =
                      BASE_URL_S3 + "home/" + slink + "?noPopup=true";

                    CopyTradeCopiedWalletClicked({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      wallet: slink,
                    });
                    window.open(shareLink, "_blank", "noreferrer");
                  }
                }}
                className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address"
                style={{
                  textDecoration: !rowData.wallet ? "none" : "",
                }}
              >
                {holderValue}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col" id="Mycopytradedeposit">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My copy trade deposit
            </span>
          </div>
        ),
        dataKey: "Mycopytradedeposit",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Mycopytradedeposit") {
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313">
                {rowData.tradeDeposit
                  ? CurrencyType(false) +
                    amountFormat(rowData.tradeDeposit, "en-US", "USD")
                  : CurrencyType(false) + "0.00"}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col" id="Mycurrentbalance">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My current balance
            </span>
          </div>
        ),
        dataKey: "Mycurrentbalance",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Mycurrentbalance") {
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313">
                {rowData.currentBalance
                  ? CurrencyType(false) +
                    amountFormat(rowData.currentBalance, "en-US", "USD")
                  : CurrencyType(false) + "0.00"}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col" id="MyunrealizedPnL">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My unrealized PnL
            </span>
          </div>
        ),
        dataKey: "MyunrealizedPnL",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "MyunrealizedPnL") {
            return (
              <div className="dotDotText">
                {rowData.unrealizedPnL !== 0 ? (
                  <Image
                    className="mr-2"
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                    }}
                    src={
                      rowData.unrealizedPnL < 0
                        ? ArrowDownLeftSmallIcon
                        : ArrowUpRightSmallIcon
                    }
                  />
                ) : null}
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.unrealizedPnL
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(rowData.unrealizedPnL),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"}
                </span>
              </div>
            );
          }
        },
      },
    ];
    if (mobileCheck()) {
      return (
        <MobileLayout
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          hideAddresses
          hideFooter
        >
          <EmulationsMobile
            addCopyTradeBtnClickedLocal={this.addCopyTradeBtnClickedLocal}
            userDetailsState={this.state.userDetailsState}
            columnData={columnData}
            tableData={this.state.copyTradesLocal}
            emulationsLoading={this.state.emulationsLoading}
            showHideDustFun={this.handleDust}
            showHideDustVal={this.state.showDust}
            emulationsUpdated={this.state.emulationsUpdated}
            isAddCopyTradeAddress={this.state.isAddCopyTradeAddress}
            hideAddCopyTradeAddress={this.hideAddCopyTradeAddress}
            showAddCopyTradeAddress={this.showAddCopyTradeAddress}
            scrollLeft={this.scrollLeft}
            scrollRight={this.scrollRight}
            scrollRightPopular={this.scrollRightPopular}
            addPrefillCopyAddress={this.addPrefillCopyAddress}
            handleAvailableTradeScroll={this.handleAvailableTradeScroll}
            handlePopularTradeScroll={this.handlePopularTradeScroll}
            scrollLeftPopular={this.scrollLeftPopular}
            goBackToAddCopyTradeModal={this.goBackToAddCopyTradeModal}
            toggleAvailableCopyTradeBlockOpen={
              this.toggleAvailableCopyTradeBlockOpen
            }
            togglePopularAccountsBlockOpen={this.togglePopularAccountsBlockOpen}
            closePayModal={this.closePayModal}
            goToScrollPositionPopular={this.goToScrollPositionPopular}
            userDetailsprops={this.state.userDetailsprops}
            isPayModalOpen={this.state.isPayModalOpen}
            passedCTAddress={this.state.passedCTAddress}
            passedCTCopyTradeAmount={this.state.passedCTCopyTradeAmount}
            passedCTNotificationEmailAddress={
              this.state.passedCTNotificationEmailAddress
            }
            prefillCopyAddress={this.state.prefillCopyAddress}
            isPopularAccountsBlockOpen={this.state.isPopularAccountsBlockOpen}
            currentPopularCirclePosition={
              this.state.currentPopularCirclePosition
            }
            popularAccountsList={this.state.popularAccountsList}
            isPopularLeftArrowDisabled={this.state.isPopularLeftArrowDisabled}
            isPopularRightArrowDisabled={this.state.isPopularRightArrowDisabled}
            copyTradesAvailableLocal={this.state.copyTradesAvailableLocal}
            isAvailableCopyTradeBlockOpen={
              this.state.isAvailableCopyTradeBlockOpen
            }
            isRightArrowDisabled={this.state.isRightArrowDisabled}
            isLeftArrowDisabled={this.state.isLeftArrowDisabled}
            goToScrollPosition={this.goToScrollPosition}
            currentCirclePosition={this.state.currentCirclePosition}
            availableCopyTrades={this.state.copyTradesAvailableLocal}
            history={this.props.history}
            updateTimer={this.updateTimer}
            isExecuteCopyTrade={this.state.isExecuteCopyTrade}
            showExecuteCopyTrade={this.showExecuteCopyTrade}
            hideExecuteCopyTrade={this.hideExecuteCopyTrade}
            confirmOrRejectCopyTrade={this.confirmOrRejectCopyTrade}
            goToNewAddress={this.goToNewAddress}
            executeCopyTradeId={this.state.executeCopyTradeId}
            paymentStatusLocal={this.state.paymentStatusLocal}
            isRejectModal={this.state.isRejectModal}
            openPayModal={this.openPayModal}
            closeRejectModal={this.closeRejectModal}
            openRejectModal={this.openRejectModal}
            executeRejectModal={this.executeRejectModal}
          />
        </MobileLayout>
      );
    }

    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              <WelcomeCard
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div className="cost-page-section">
          {this.state.connectModal ? (
            <ConnectModal
              show={this.state.connectModal}
              onHide={this.handleConnectModal}
              history={this.props.history}
              headerTitle={"Connect exchanges"}
              modalType={"connectModal"}
              iconImage={LinkIcon}
              updateTimer={this.updateTimer}
            />
          ) : (
            ""
          )}
          <div className="cost-section page">
            {this.state.isExecuteCopyTrade ? (
              <EmulationsTradeModal
                show={this.state.isExecuteCopyTrade}
                executeCopyTradeId={this.state.executeCopyTradeId}
                confirmOrRejectCopyTrade={this.confirmOrRejectCopyTrade}
                onHide={this.hideExecuteCopyTrade}
                history={this.props.history}
                modalType={"connectModal"}
                updateTimer={this.updateTimer}
              />
            ) : null}
            {this.state.exportModal ? (
              <ExitOverlay
                show={this.state.exportModal}
                history={this.props.history}
                headerTitle={this.state.exportHeaderTitle}
                headerSubTitle={this.state.exportHeaderSubTitle}
                modalType={"exportModal"}
                iconImage={ExportIconWhite}
                selectExportOption={this.state.exportSelectExportOption}
              />
            ) : null}
            {this.state.isPayModalOpen ? (
              <EmulationsPaywall
                userDetailsState={this.state.userDetailsState}
                show={this.state.isPayModalOpen}
                onHide={this.closePayModal}
                passedCTNotificationEmailAddress={
                  this.state.passedCTNotificationEmailAddress
                }
                passedCTAddress={this.state.passedCTAddress}
                passedCTCopyTradeAmount={this.state.passedCTCopyTradeAmount}
                goBackToAddCopyTradeModal={this.goBackToAddCopyTradeModal}
              />
            ) : null}
            {this.state.isAddCopyTradeAddress ? (
              <AddEmulationsAddressModal
                show={this.state.isAddCopyTradeAddress}
                prefillCopyAddress={this.state.prefillCopyAddress}
                onHide={this.hideAddCopyTradeAddress}
                history={this.props.history}
                location={this.props.location}
                emulationsUpdated={this.state.emulationsUpdated}
                paymentStatusLocal={this.state.paymentStatusLocal}
                openPayModal={this.openPayModal}
              />
            ) : null}
            {this.state.isRejectModal ? (
              <BasicConfirmModal
                show={this.state.isRejectModal}
                history={this.props.history}
                handleClose={this.closeRejectModal}
                handleYes={this.executeRejectModal}
                title="Are you sure you want to reject this trade?"
              />
            ) : null}
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
                modalIcon={AddWalletModalIcon}
                title="Add wallet address"
                subtitle="Add more wallet address here"
                modalType="addwallet"
                btnStatus={false}
                btnText="Go"
                history={this.props.history}
                changeWalletList={this.handleChangeList}
                apiResponse={(e) => this.CheckApiResponse(e)}
                from="cost"
                updateTimer={this.updateTimer}
              />
            )}

            <PageHeader
              title="Copy Trade"
              subTitle="All the wallet addresses you have copied"
              btnText="Add copy trade"
              mainThemeBtn
              currentPage={"copy-trade"}
              ShareBtn={true}
              exportBtnTxt="Click to export costs"
              updateTimer={this.updateTimer}
              handleBtn={this.showAddCopyTradeAddress}
            />
            {!this.state.emulationsLoading ? (
              <div
                className={`available-copy-trades-popular-accounts-container ${
                  this.state.isPopularAccountsBlockOpen &&
                  this.state.isAvailableCopyTradeBlockOpen
                    ? "available-copy-trades-popular-accounts-container-both-open"
                    : ""
                }`}
              >
                <div className="available-copy-trades-popular-accounts">
                  <div
                    className={`actpacc-header ${
                      this.state.isPopularAccountsBlockOpen
                        ? "actpacc-header-open"
                        : ""
                    }`}
                    onClick={this.togglePopularAccountsBlockOpen}
                  >
                    <div className="actpacc-header-title">
                      <Image
                        src={TrendingFireIcon}
                        className="actpacc-header-icon actpacc-header-icon-more-margin"
                      />
                      <div className="inter-display-medium f-s-16">
                        Popular Accounts to Copy
                      </div>
                    </div>
                    <Image
                      src={UserCreditScrollTopArrowIcon}
                      className={`actpacc-arrow-icon ${
                        this.state.isPopularAccountsBlockOpen
                          ? ""
                          : "actpacc-arrow-icon-reversed"
                      }`}
                    />
                  </div>
                  {this.state.isPopularAccountsBlockOpen ? (
                    <>
                      <div
                        id="popularCopyTradeScrollBody"
                        className="actpacc-scroll-body"
                        onScroll={this.handlePopularTradeScroll}
                      >
                        {this.state.popularAccountsList &&
                        this.state.popularAccountsList.length > 0 ? (
                          this.state.popularAccountsList.map(
                            (curCopyTradeData, index) => {
                              return (
                                <div
                                  style={{
                                    minWidth:
                                      index ===
                                      this.state.popularAccountsList.length - 1
                                        ? "100%"
                                        : "",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                  id={`copyTradePopularAccountNumber${index}`}
                                >
                                  <div className="popular-copy-trades">
                                    <div className="popular-copy-trades-data">
                                      <div className="popular-copy-trades-data-person-container">
                                        <Image
                                          className="popular-copy-trades-data-person"
                                          src={PersonRoundedSigninIcon}
                                        />
                                      </div>
                                      <div
                                        style={{
                                          margin: "0rem 1.3rem",
                                        }}
                                        className="inter-display-medium f-s-14 popular-copy-trades-data-address"
                                        onClick={() => {
                                          if (curCopyTradeData.address) {
                                            let slink =
                                              curCopyTradeData.address;
                                            let shareLink =
                                              BASE_URL_S3 +
                                              "home/" +
                                              slink +
                                              "?noPopup=true";

                                            CopyTradePopularAccountWalletClicked(
                                              {
                                                session_id: getCurrentUser().id,
                                                email_address:
                                                  getCurrentUser().email,
                                                wallet: slink,
                                              }
                                            );
                                            window.open(
                                              shareLink,
                                              "_blank",
                                              "noreferrer"
                                            );
                                          }
                                        }}
                                      >
                                        {TruncateText(curCopyTradeData.address)}
                                      </div>
                                      <div className="inter-display-medium f-s-14 popular-copy-trades-data-nametag">
                                        {curCopyTradeData.nameTag}
                                      </div>
                                      <div
                                        style={{
                                          marginLeft: "1.3rem",
                                          whiteSpace: "nowrap",
                                        }}
                                        className="inter-display-medium f-s-14 "
                                      >
                                        {CurrencyType(false) +
                                          numToCurrency(
                                            curCopyTradeData.netWorth
                                          )}
                                      </div>
                                    </div>
                                    <div
                                      onClick={() => {
                                        if (curCopyTradeData.address) {
                                          this.setState(
                                            {
                                              prefillCopyAddress:
                                                curCopyTradeData.address,
                                            },
                                            () => {
                                              this.showAddCopyTradeAddress();
                                            }
                                          );

                                          CopyTradePopularAccountCopyClicked({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                            wallet: curCopyTradeData.address,
                                          });
                                        }
                                      }}
                                      className="inter-display-medium f-s-14 popular-copy-trades-button"
                                    >
                                      Copy
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="actpacc-scroll-body-no-data inter-display-medium f-s-14 lh-19 ">
                            Select a wallet above to copy trade to get started
                          </div>
                        )}
                      </div>

                      <div className="available-copy-trades-navigator">
                        <div className="available-copy-trades-navigator-circles-container">
                          {this.state.popularAccountsList &&
                          this.state.popularAccountsList.length > 1
                            ? this.state.popularAccountsList.map(
                                (resCircle, resCircleIndex) => {
                                  return (
                                    <div
                                      style={{
                                        opacity:
                                          resCircleIndex ===
                                          this.state
                                            .currentPopularCirclePosition
                                            ? 1
                                            : 0.2,
                                        marginLeft:
                                          resCircleIndex === 0 ? 0 : "0.5rem",
                                      }}
                                      onClick={() => {
                                        this.goToScrollPositionPopular(
                                          resCircleIndex
                                        );
                                      }}
                                      className="available-copy-trades-navigator-circle"
                                    />
                                  );
                                }
                              )
                            : null}
                        </div>
                        <div className="available-copy-trades-navigator-arrows">
                          <Image
                            style={{
                              opacity: this.state.isPopularLeftArrowDisabled
                                ? 0.5
                                : 1,
                              cursor: this.state.isPopularLeftArrowDisabled
                                ? "default"
                                : "pointer",
                            }}
                            onClick={this.scrollLeftPopular}
                            className="availableCopyTradesArrowIcon availableCopyTradesArrowIconLeft"
                            src={UserCreditScrollLeftArrowIcon}
                          />
                          <Image
                            style={{
                              opacity: this.state.isPopularRightArrowDisabled
                                ? 0.5
                                : 1,
                              cursor: this.state.isPopularRightArrowDisabled
                                ? "default"
                                : "pointer",
                            }}
                            onClick={this.scrollRightPopular}
                            className="availableCopyTradesArrowIcon"
                            src={UserCreditScrollRightArrowIcon}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="available-copy-trades-popular-accounts">
                  <div
                    className={`actpacc-header ${
                      this.state.isAvailableCopyTradeBlockOpen
                        ? "actpacc-header-open"
                        : ""
                    }`}
                    onClick={this.toggleAvailableCopyTradeBlockOpen}
                  >
                    <div className="actpacc-header-title">
                      <Image
                        src={EmultionSidebarIcon}
                        className="actpacc-header-icon"
                      />
                      <div className="inter-display-medium f-s-16">
                        Available Copy Trades
                      </div>
                    </div>
                    <Image
                      src={UserCreditScrollTopArrowIcon}
                      className={`actpacc-arrow-icon ${
                        this.state.isAvailableCopyTradeBlockOpen
                          ? ""
                          : "actpacc-arrow-icon-reversed"
                      }`}
                    />
                  </div>
                  {this.state.isAvailableCopyTradeBlockOpen ? (
                    <>
                      <div
                        id="availableCopyTradeScrollBody"
                        className="actpacc-scroll-body"
                        onScroll={this.handleAvailableTradeScroll}
                      >
                        {this.state.copyTradesAvailableLocal &&
                        this.state.copyTradesAvailableLocal.length > 0 ? (
                          this.state.copyTradesAvailableLocal.map(
                            (curTradeData, index) => {
                              return (
                                <div className="available-copy-trades">
                                  <div className="available-copy-trades-content-container">
                                    <div
                                      onClick={() => {
                                        this.goToNewAddress(
                                          curTradeData.copyAddress
                                        );
                                      }}
                                      className="inter-display-medium f-s-16 available-copy-trades-address"
                                    >
                                      {TruncateText(curTradeData.copyAddress)}
                                    </div>
                                  </div>
                                  <div className="inter-display-medium f-s-16 available-copy-trades-transaction-container ">
                                    Swap {numToCurrency(curTradeData.valueFrom)}{" "}
                                    {curTradeData.assetFrom} for{" "}
                                    {numToCurrency(curTradeData.valueTo)}{" "}
                                    {curTradeData.assetTo}
                                    ? 
                                  </div>
                                  <div className="available-copy-trades-button-container">
                                    <div
                                      className="available-copy-trades-button"
                                      onClick={() => {
                                        this.showExecuteCopyTrade(
                                          curTradeData.id
                                        );
                                      }}
                                    >
                                      <Image
                                        className="available-copy-trades-button-icons"
                                        src={AvailableCopyTradeCheckIcon}
                                      />
                                    </div>
                                    <div
                                      className="available-copy-trades-button"
                                      onClick={() => {
                                        this.openRejectModal(curTradeData.id);
                                      }}
                                      style={{
                                        marginLeft: "1rem",
                                      }}
                                    >
                                      <Image
                                        className="available-copy-trades-button-icons"
                                        src={AvailableCopyTradeCrossIcon}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="actpacc-scroll-body-no-data inter-display-medium f-s-14 lh-19 ">
                            Select a wallet above to copy trade to get started
                          </div>
                        )}
                      </div>

                      <div className="available-copy-trades-navigator">
                        <div className="available-copy-trades-navigator-circles-container">
                          {this.state.copyTradesAvailableLocal &&
                          this.state.copyTradesAvailableLocal.length > 1
                            ? this.state.copyTradesAvailableLocal.map(
                                (resCircle, resCircleIndex) => {
                                  return (
                                    <div
                                      style={{
                                        opacity:
                                          resCircleIndex ===
                                          this.state.currentCirclePosition
                                            ? 1
                                            : 0.2,
                                        marginLeft:
                                          resCircleIndex === 0 ? 0 : "0.5rem",
                                      }}
                                      onClick={() => {
                                        this.goToScrollPosition(resCircleIndex);
                                      }}
                                      className="available-copy-trades-navigator-circle"
                                    />
                                  );
                                }
                              )
                            : null}
                        </div>
                        <div className="available-copy-trades-navigator-arrows">
                          <Image
                            style={{
                              opacity: this.state.isLeftArrowDisabled ? 0.5 : 1,
                              cursor: this.state.isLeftArrowDisabled
                                ? "default"
                                : "pointer",
                            }}
                            onClick={this.scrollLeft}
                            className="availableCopyTradesArrowIcon availableCopyTradesArrowIconLeft"
                            src={UserCreditScrollLeftArrowIcon}
                          />
                          <Image
                            style={{
                              opacity: this.state.isRightArrowDisabled
                                ? 0.5
                                : 1,
                              cursor: this.state.isRightArrowDisabled
                                ? "default"
                                : "pointer",
                            }}
                            onClick={this.scrollRight}
                            className="availableCopyTradesArrowIcon"
                            src={UserCreditScrollRightArrowIcon}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div
              style={{ marginBottom: "2.8rem", marginTop: "2.5rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  showHeaderOnEmpty
                  message="Select a wallet above to copy trade to get started."
                  noDataImage={NoCopyTradeTableIcon}
                  noSubtitleBottomPadding
                  tableData={this.state.copyTradesLocal}
                  columnList={columnData}
                  headerHeight={64}
                  comingSoon={false}
                  isArrow={false}
                  isLoading={this.state.emulationsLoading}
                  isGainLoss={true}
                  isStickyHead={true}
                  addWatermark
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  emulationsState: state.EmulationsState,
});
const mapDispatchToProps = {
  getAllCoins,

  // avg cost

  // update counter party

  // update fee

  setPageFlagDefault,

  // average cost

  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
  getCopyTrade,
  updaetAvailableCopyTraes,
  addCopyTrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(Emulations);
