import moment from "moment";
import React from "react";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  StrategyBuilderAssetAdaIcon,
  StrategyBuilderAssetAvaxIcon,
  StrategyBuilderAssetBnbIcon,
  StrategyBuilderAssetBtcIcon,
  StrategyBuilderAssetDogeIcon,
  StrategyBuilderAssetEthIcon,
  StrategyBuilderAssetSolIcon,
  StrategyBuilderAssetTonIcon,
  StrategyBuilderAssetTrxIcon,
  StrategyBuilderAssetXrpIcon,
} from "../assets/images/icons";
import { API_LIMIT, BASE_URL_S3 } from "./Constant";
import { getCurrentUser, getToken } from "./ManageToken";

export const strategyBuilderWeightTypeToEnum = (passedItem) => {
  console.log("passedItem is ", passedItem);

  if (passedItem.toUpperCase() === "EQUAL") {
    return "EQUAL";
  } else if (passedItem.toUpperCase() === "SPECIFIED") {
    return "SPECIFIED";
  }
  return "";
};
export const isArrayInArrayOfArrays = (arr1, arrOfArr) => {
  // Convert both arrays to strings to compare easily
  const arr1Str = JSON.stringify(arr1);

  for (let i = 0; i < arrOfArr.length; i++) {
    if (JSON.stringify(arrOfArr[i]) === arr1Str) {
      return true; // Found a match
    }
  }

  return false; // No match found
};
export const strategyByilderChartWhichSymbol = (passedItem) => {
  if (
    passedItem === "CUMULATIVE_RETURN" ||
    passedItem === "MAX_DRAWDOWN" ||
    passedItem === "VOLUME" ||
    passedItem === "MARKET_CAPITALIZATION" ||
    passedItem === "MOVING_AVERAGE_CONVERGENCE_DIVERGENCE"
  ) {
    return "%";
  }
  return "$";
};
export const strategyByilderChartShouldShowDate = (passedItem) => {
  if (
    passedItem === "MARKET_CAPITALIZATION" ||
    passedItem === "BOLLINGER_BAND" ||
    passedItem === "MOVING_AVERAGE_CONVERGENCE_DIVERGENCE" ||
    passedItem === "RELATIVE_STRENGTH_INDEX" ||
    passedItem === "MOVING_AVERAGE_RETURN" ||
    passedItem === "MOVING_AVERAGE_PRICE" ||
    passedItem === "EXPONENTIAL_MOVING_AVERAGE" ||
    passedItem === "MAX_DRAWDOWN"
  ) {
    return true;
  }
  return false;
};
export const strategyByilderChartLineColorByIndexLowOpacity = (passedIndex) => {
  // if (passedIndex === 0) {
  //   return "rgba(128, 67, 243,0.1)";
  // } else if (passedIndex === 1) {
  //   return "rgba(162, 220, 0,0.1)";
  // } else if (passedIndex === 2) {
  //   return "rgba(43, 127, 255,0.1)";
  // }
  // return "black";
  return `var(--strategyBuilderGraphLowOpacity${passedIndex + 1})`;
};
export const strategyByilderChartLineColorByIndex = (passedIndex) => {
  return `var(--strategyBuilderGraph${passedIndex + 1})`;
};

export const strategyByilderAssetList = () => {
  return [
    {
      name: "BTC",
      icon: StrategyBuilderAssetBtcIcon,
      color: "#F7931A",
    },
    {
      name: "ETH",
      icon: StrategyBuilderAssetEthIcon,
      color: "#627EEA",
    },
    {
      name: "BNB",
      icon: StrategyBuilderAssetBnbIcon,
      color: "#F0B90A",
    },
    {
      name: "SOL",
      icon: StrategyBuilderAssetSolIcon,
      color: "#9F99D8",
    },
    {
      name: "DOGE",
      icon: StrategyBuilderAssetDogeIcon,
      color: "#FDA523",
    },
    {
      name: "XRP",
      icon: StrategyBuilderAssetXrpIcon,
      color: "#00AAE5",
    },
    {
      name: "TON",
      icon: StrategyBuilderAssetTonIcon,
      color: "#0098EA",
    },
    {
      name: "TRX",
      icon: StrategyBuilderAssetTrxIcon,
      color: "#FE0001",
    },
    {
      name: "ADA",
      icon: StrategyBuilderAssetAdaIcon,
      color: "#3468D1",
    },
    {
      name: "AVAX",
      icon: StrategyBuilderAssetAvaxIcon,
      color: "#E84142",
    },
  ];
};
export const strategyByilderAssetDetailFromName = (passedItem) => {
  const curAssetList = strategyByilderAssetList();
  return curAssetList.find((element) => element.name === passedItem);
};
export const strategyByilderTypeConvertorSymbolToText = (passedItem) => {
  if (passedItem === "CURRENT_PRICE") {
    return "Current price";
  } else if (passedItem === "CUMULATIVE_RETURN") {
    return "Cumulative return";
  } else if (passedItem === "EXPONENTIAL_MOVING_AVERAGE") {
    return "Exponential moving average";
  } else if (passedItem === "MAX_DRAWDOWN") {
    return "Max drawdown";
  } else if (passedItem === "MOVING_AVERAGE_PRICE") {
    return "Moving average price";
  } else if (passedItem === "MOVING_AVERAGE_RETURN") {
    return "Moving average return";
  } else if (passedItem === "RELATIVE_STRENGTH_INDEX") {
    return "Relative strength index";
  } else if (passedItem === "STANDARD_DEVIATION_OF_PRICE") {
    return "Standard deviation of price";
  } else if (passedItem === "STANDARD_DEVIATION_OF_RETURN") {
    return "Standard deviation of return";
  } else if (passedItem === "MONEY_FLOW_INDEX") {
    return "Money flow index";
  } else if (passedItem === "MOVING_AVERAGE_CONVERGENCE_DIVERGENCE") {
    return "Moving average convergence divergence";
  } else if (passedItem === "BOLLINGER_BAND") {
    return "Bollinger band";
  } else if (passedItem === "VOLUME") {
    return "Volume";
  } else if (passedItem === "MARKET_CAPITALIZATION") {
    return "Market capitalization";
  } else if (passedItem === "OPEN_HIGH_LOW_CLOSE") {
    return "Open high low close";
  }

  return "";
};
export const strategyByilderTypeConvertorTextToSymbol = (passedItem) => {
  if (passedItem === "Current price") {
    return "CURRENT_PRICE";
  } else if (passedItem === "Cumulative return") {
    return "CUMULATIVE_RETURN";
  } else if (passedItem === "Exponential moving average") {
    return "EXPONENTIAL_MOVING_AVERAGE";
  } else if (passedItem === "Max drawdown") {
    return "MAX_DRAWDOWN";
  } else if (passedItem === "Moving average price") {
    return "MOVING_AVERAGE_PRICE";
  } else if (passedItem === "Moving average return") {
    return "MOVING_AVERAGE_RETURN";
  } else if (passedItem === "Relative strength index") {
    return "RELATIVE_STRENGTH_INDEX";
  } else if (passedItem === "Standard deviation of price") {
    return "STANDARD_DEVIATION_OF_PRICE";
  } else if (passedItem === "Standard deviation of return") {
    return "STANDARD_DEVIATION_OF_RETURN";
  } else if (passedItem === "Money flow index") {
    return "MONEY_FLOW_INDEX";
  } else if (passedItem === "Moving average convergence divergence") {
    return "MOVING_AVERAGE_CONVERGENCE_DIVERGENCE";
  } else if (passedItem === "Bollinger band") {
    return "BOLLINGER_BAND";
  } else if (passedItem === "Volume") {
    return "VOLUME";
  } else if (passedItem === "Market capitalization") {
    return "MARKET_CAPITALIZATION";
  } else if (passedItem === "Open high low close") {
    return "OPEN_HIGH_LOW_CLOSE";
  }

  return "";
};
export const strategyByilderOperatorConvertorSymbolToText = (passedItem) => {
  if (passedItem === ">") {
    return "greater than";
  } else if (passedItem === "<") {
    return "less than";
  } else if (passedItem === "=") {
    return "equals to";
  } else if (passedItem === "+") {
    return "increase by";
  } else if (passedItem === "-") {
    return "decrease by";
  }
  return "";
};
export const strategyByilderOperatorConvertorTextToSymbol = (passedItem) => {
  if (passedItem === "greater than") {
    return ">";
  } else if (passedItem === "less than") {
    return "<";
  } else if (passedItem === "equals to") {
    return "=";
  } else if (passedItem === "increase by") {
    return "+";
  } else if (passedItem === "decrease by") {
    return "-";
  }
  return "";
};
export const scrollToBottomAfterPageChange = () => {
  if (mobileCheck()) {
    const itemItem = document.getElementById("mobileLayoutScrollContainer");

    if (itemItem && itemItem.clientHeight) {
      window.scroll(0, itemItem.clientHeight);
    }
  } else {
    window.scroll(0, document.body.scrollHeight);
  }
};

export const hasUserAddedAddressesFun = () => {
  let tempToken = getToken();
  if (tempToken && tempToken !== "jsk") {
    const userWalletList = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
      : [];
    if (userWalletList && userWalletList.length > 0) {
      return true;
    }
  }
  return false;
};
export const openAddressInSameTab = (address, setPageFlagDefault) => {
  const shareLink = BASE_URL_S3 + "replace-address?address=" + address;
  // const shareLink =
  //   "http://localhost:3000/" + "replace-address?address=" + address;

  window.open(shareLink, "_self").focus();
  if (setPageFlagDefault) {
    setTimeout(() => {
      setPageFlagDefault();
    }, 3000);
    setTimeout(() => {
      setPageFlagDefault();
    }, 4000);
    setTimeout(() => {
      setPageFlagDefault();
    }, 5000);
  }
};
export const isPremiumUser = () => {
  const currentUserPaymentPlan = window.localStorage.getItem(
    "currentUserPaymentPlan"
  );
  if (currentUserPaymentPlan === "Loch Premium") {
    return true;
  }
  return false;
};
export const getShareLink = () => {
  let pathName = window.location.pathname;
  if (pathName.substring(0, 1) === "/") {
    pathName = pathName.substring(1, pathName.length);
  }
  let lochUser = getCurrentUser().id;
  if (lochUser) {
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=" + pathName;

    return shareLink;
  }
  return "";
};
export const getCopyTradeWalletShareLink = (walletList) => {
  let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
  let firstWallet = "";
  if (userWallet && userWallet.length > 0) {
    firstWallet = userWallet[0].displayAddress || userWallet[0].address;
  }
  if (walletList && walletList.length > 0) {
    if (walletList[0][1] && walletList[0][1].endsWith("eth")) {
      firstWallet = walletList[0][1];
    } else {
      firstWallet = walletList[0][0];
    }
  }
  let lochUser = getCurrentUser().id;
  if (lochUser) {
    let slink = firstWallet ? firstWallet : "";
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=copy-trade-share";

    return shareLink;
  }
  return "";
};
export const openSignUpPopUpDirectly = () => {
  window.sessionStorage.setItem("dontOpenLoginPopup", true);
  if (document.getElementById("sidebar-sign-up-btn")) {
    document.getElementById("sidebar-sign-up-btn").click();
  }
};
export const openLoginPopUp = () => {
  window.sessionStorage.setItem("dontOpenLoginPopup", true);
  if (document.getElementById("sidebar-open-sign-in-btn")) {
    document.getElementById("sidebar-open-sign-in-btn").click();
  } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
    document.getElementById("sidebar-closed-sign-in-btn").click();
  }
};
export const openSignInModalFromAnywhere = () => {
  if (document.getElementById("sidebar-open-sign-in-btn")) {
    document.getElementById("sidebar-open-sign-in-btn").click();
    dontOpenLoginPopup();
  } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
    document.getElementById("sidebar-closed-sign-in-btn").click();
    dontOpenLoginPopup();
  }
};
export const dontOpenLoginPopup = () => {
  window.localStorage.setItem("dontOpenLoginPopup", true);
};
export const whichBlurMethod = () => {
  if (window.localStorage.getItem("copyTradeWelcome")) {
    return "Copy Trade Welcome";
  }
  if (window.localStorage.getItem("blurredHomeAssetSignInModal")) {
    return "Home Assets Block";
  }
  if (window.localStorage.getItem("blurredHomeFlowsSignInModal")) {
    return "Home Flows Block";
  }
  if (window.localStorage.getItem("blurredHomeYieldOppSignInModal")) {
    return "Home Yield Opp Block";
  }
  if (window.localStorage.getItem("blurredHomeInsightsSignInModal")) {
    return "Home Insights Block";
  }
  if (window.localStorage.getItem("blurredHomeGasFeesSignInModal")) {
    return "Home Gas Fees Block";
  }
  if (window.localStorage.getItem("blurredAssetSignInModal")) {
    return "Assets Page";
  }
  if (window.localStorage.getItem("blurredFlowsSignInModal")) {
    return "Flows Page";
  }
  if (window.localStorage.getItem("blurredYieldOppSignInModal")) {
    return "Yield Opp Page";
  }
  if (window.localStorage.getItem("blurredInsightsSignInModal")) {
    return "Insights Page";
  }
  if (window.localStorage.getItem("blurredGasFeesSignInModal")) {
    return "Gas Fees Page";
  }

  if (window.localStorage.getItem("blurredAddMultipleAddressSignInModal")) {
    return "Multiple Wallet Connect";
  }
  if (window.localStorage.getItem("blurredAssetExportModal")) {
    return "Tokens Export";
  }
  if (window.localStorage.getItem("blurredGasFeesExportModal")) {
    return "Gas Fees Export";
  }
  if (window.localStorage.getItem("blurredCounterPartyExportModal")) {
    return "Counterparty Export";
  }
  if (window.localStorage.getItem("blurredTransactionHistoryExportModal")) {
    return "Transaction History Export";
  }
  if (window.localStorage.getItem("blurredCopyTradeAddModal")) {
    return "Add Copy Trade";
  }
  if (window.localStorage.getItem("blurredSubscribeToPremiumLochPoint")) {
    return "Subscribe To Premium Loch Point";
  }
  if (window.localStorage.getItem("upgradePremiumProfileBannerSignInModal")) {
    return "Profile loch premium banner";
  }

  return "";
};
export const removeBlurMethods = () => {
  window.localStorage.removeItem("blurredHomeAssetSignInModal");
  window.localStorage.removeItem("blurredHomeFlowsSignInModal");
  window.localStorage.removeItem("blurredHomeYieldOppSignInModal");
  window.localStorage.removeItem("blurredHomeInsightsSignInModal");
  window.localStorage.removeItem("blurredHomeGasFeesSignInModal");
  window.localStorage.removeItem("blurredAssetSignInModal");
  window.localStorage.removeItem("blurredFlowsSignInModal");
  window.localStorage.removeItem("blurredYieldOppSignInModal");
  window.localStorage.removeItem("blurredInsightsSignInModal");
  window.localStorage.removeItem("blurredGasFeesSignInModal");
  window.localStorage.removeItem("blurredAddMultipleAddressSignInModal");
  window.localStorage.removeItem("blurredAssetExportModal");
  window.localStorage.removeItem("blurredGasFeesExportModal");
  window.localStorage.removeItem("blurredCounterPartyExportModal");
  window.localStorage.removeItem("blurredTransactionHistoryExportModal");
  window.localStorage.removeItem("blurredCopyTradeAddModal");
  window.localStorage.removeItem("blurredSubscribeToPremiumLochPoint");
  window.localStorage.removeItem("upgradePremiumProfileBannerSignInModal");
  window.localStorage.removeItem("copyTradeWelcome");
};
export const whichSignUpMethod = () => {
  if (window.localStorage.getItem("copyTradeWelcome")) {
    return "Copy Trade Welcome";
  }
  if (window.localStorage.getItem("lochPointsSignInModal")) {
    return "Loch points";
  }
  if (window.localStorage.getItem("referralCodesSignInModal")) {
    return "Referral code";
  }
  if (window.localStorage.getItem("upgradePremiumProfileBannerSignInModal")) {
    return "Profile loch premium banner";
  }
  if (window.localStorage.getItem("blurredHomeAssetSignInModal")) {
    return "Home Assets Block";
  }
  if (window.localStorage.getItem("blurredHomeFlowsSignInModal")) {
    return "Home Flows Block";
  }
  if (window.localStorage.getItem("blurredHomeYieldOppSignInModal")) {
    return "Home Yield Opp Block";
  }
  if (window.localStorage.getItem("blurredHomeInsightsSignInModal")) {
    return "Home Insights Block";
  }
  if (window.localStorage.getItem("blurredHomeGasFeesSignInModal")) {
    return "Home Gas Fees Block";
  }
  if (window.localStorage.getItem("blurredAssetSignInModal")) {
    return "Assets Page";
  }
  if (window.localStorage.getItem("blurredFlowsSignInModal")) {
    return "Flows Page";
  }
  if (window.localStorage.getItem("blurredYieldOppSignInModal")) {
    return "Yield Opp Page";
  }
  if (window.localStorage.getItem("blurredInsightsSignInModal")) {
    return "Insights Page";
  }
  if (window.localStorage.getItem("blurredGasFeesSignInModal")) {
    return "Gas Fees Page";
  }
  if (window.localStorage.getItem("fifteenSecSignInModal")) {
    return "15 sec";
  }
  if (window.localStorage.getItem("blurredAddMultipleAddressSignInModal")) {
    return "Multiple Wallet Connect";
  }
  if (window.localStorage.getItem("blurredAssetExportModal")) {
    return "Tokens Export";
  }
  if (window.localStorage.getItem("blurredGasFeesExportModal")) {
    return "Gas Fees Export";
  }
  if (window.localStorage.getItem("blurredCounterPartyExportModal")) {
    return "Counterparty Export";
  }
  if (window.localStorage.getItem("blurredTransactionHistoryExportModal")) {
    return "Transaction History Export";
  }
  if (window.localStorage.getItem("blurredCopyTradeAddModal")) {
    return "Add Copy Trade";
  }
  if (window.localStorage.getItem("blurredSubscribeToPremiumLochPoint")) {
    return "Subscribe To Premium Loch Point";
  }

  return "Sidebar";
};
export const removeSignUpMethods = () => {
  window.localStorage.removeItem("fifteenSecSignInModal");
  window.localStorage.removeItem("referralCodesSignInModal");
  window.localStorage.removeItem("upgradePremiumProfileBannerSignInModal");
  window.localStorage.removeItem("lochPointsSignInModal");
  window.localStorage.removeItem("blurredHomeAssetSignInModal");
  window.localStorage.removeItem("blurredHomeFlowsSignInModal");
  window.localStorage.removeItem("blurredHomeYieldOppSignInModal");
  window.localStorage.removeItem("blurredHomeInsightsSignInModal");
  window.localStorage.removeItem("blurredHomeGasFeesSignInModal");
  window.localStorage.removeItem("blurredAssetSignInModal");
  window.localStorage.removeItem("blurredFlowsSignInModal");
  window.localStorage.removeItem("blurredYieldOppSignInModal");
  window.localStorage.removeItem("blurredInsightsSignInModal");
  window.localStorage.removeItem("blurredGasFeesSignInModal");
  window.localStorage.removeItem("blurredAddMultipleAddressSignInModal");
  window.localStorage.removeItem("blurredAssetExportModal");
  window.localStorage.removeItem("blurredGasFeesExportModal");
  window.localStorage.removeItem("blurredCounterPartyExportModal");
  window.localStorage.removeItem("blurredTransactionHistoryExportModal");
  window.localStorage.removeItem("blurredCopyTradeAddModal");
  window.localStorage.removeItem("blurredSubscribeToPremiumLochPoint");
  window.localStorage.removeItem("copyTradeWelcome");
};
export const removeOpenModalAfterLogin = () => {
  window.localStorage.removeItem("openHomePaymentModal");
  window.localStorage.removeItem("openAssetPaymentModal");
  window.localStorage.removeItem("openFlowsPaymentModal");
  window.localStorage.removeItem("openYieldOppPaymentModal");
  window.localStorage.removeItem("openInsightsPaymentModal");
  window.localStorage.removeItem("openSearchbarPaymentModal");
  window.localStorage.removeItem("openExportPaymentModal");
  window.localStorage.removeItem("openGasFeesModal");
};
export const goToTelegram = () => {
  window.open("https://t.me/loch_chain", "_blank");
};
export const goToTwitter = () => {
  window.open("https://twitter.com/loch_chain", "_blank");
};
export const emailPrithvir = () => {
  window.open("mailto:prithvir@loch.one", "_blank");
};
export const copyText = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Copied");
    })
    .catch(() => {
      console.log("something went wrong");
    });
};
export const scrollToTop = () => {
  window.scrollTo(0, 0);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 200);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 300);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 500);
};
export const mobileCheck = () => {
  // if (
  //   BASE_URL_S3 ===
  //   "http://staging.loch.com.s3-website.ap-south-1.amazonaws.com/"
  // ) {
  //   return false;
  // }
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  }
  return false;
};
// TruncateText
export const isSameDateAs = function (dateOne, dateTwo) {
  return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getDate() === dateTwo.getDate()
  );
};
export const compareTwoArrayOfObjects = (
  first_array_of_objects,
  second_array_of_objects
) => {
  return (
    first_array_of_objects.length === second_array_of_objects.length &&
    first_array_of_objects.every((element_1) =>
      second_array_of_objects.some((element_2) =>
        Object.keys(element_1).every((key) => element_1[key] === element_2[key])
      )
    )
  );
};
export const convertNtoNumber = (n) => {
  if (n === undefined || n === null) {
    return "";
  }
  var sign = +n < 0 ? "-" : "",
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, "")
    .replace(/^([0-9]+)(e.*)/, "$1.$2")
    .split(/e|\./);
  return +pow < 0
    ? sign +
        "0." +
        "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
        lead +
        decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
};
export const ShorterText = (string) => {
  if (string === undefined || string === null) {
    return "";
  }
  if (string.length > 15) {
    return string.substring(0, 15) + "...";
  }
  return string;
};
export const TruncateText = (string) => {
  if (string === undefined || string === null) {
    return "";
  }
  if (string.length > 3) {
    return string.substring(0, 4);
  }
  return string;
};
// GET EXTENSION NAME WRAPPER
export const getExtensionNameWrapper = (
  attachmentName,
  attachmentUrl,
  className
) => {
  const re = /(?:\.([^.]+))?$/;
  let ext = re.exec(attachmentName)[1];
  let attachmentWrapper;
  // console.log(attachmentName, attachmentUrl, className);
  if (ext === "jpeg" || ext === "png" || ext === "jpg") {
    attachmentWrapper = <Image src={attachmentUrl} alt="link-preview" />;
  } else {
    attachmentWrapper = <span className={className}>{ext}</span>;
  }
  return attachmentWrapper;
};

export const replaceHistory = (history, page = 1, searchValue = "") => {
  history.replace({
    search: `?p=${page}${searchValue && `&&search=${searchValue}`}`,
  });
};

export const switchToDarkMode = () => {
  document.querySelector("body").setAttribute("data-theme", "dark");
  localStorage.setItem("isDarkTheme", true);
  // SwitchDarkMode(true);
};
export const switchToLightMode = () => {
  document.querySelector("body").setAttribute("data-theme", "light");
  localStorage.setItem("isDarkTheme", false);
  // SwitchDarkMode(false);
};

export const calculateTotalPageCount = (totalCount) => {
  return Math.ceil(totalCount / API_LIMIT);
};

export const formatDate = (date) => {
  if (date) return moment(date).format("DD-MMM-YYYY");
  else return "NA";
};

export const formatDuration = (data) => {
  const dateFormat = "YYYY-MM-DD HH:mm:ss";
  const start = moment(data.startDate || data.start_datetime).format(
    dateFormat
  );
  const end = moment(data.endDate || data.end_datetime).format(dateFormat);
  const difference = moment.duration(moment(end).diff(start));
  // Get Days
  const days = Math.floor(difference.asDays());
  // Get Hours
  const hours = difference.hours();
  //Get Minutes
  const minutes = difference.minutes();
  return days + " Days " + hours + " hrs " + minutes + " mins ";
};

export const compareDate = (dateTimeA, dateTimeB) => {
  var momentA = moment(dateTimeA).format("DD/MM/YYYY");
  var momentB = moment(dateTimeB).format("DD/MM/YYYY");
  if (momentA > momentB) return false;
  else if (momentA < momentB) return false;
  else return true;
};

export const numToCurrency = (
  num,
  noDefaultDecimals,
  toFixedSmallerNumber = false
) => {
  if (num < 1000 && noDefaultDecimals) {
    if (toFixedSmallerNumber) {
      return parseFloat(num).toFixed(2);
    }
    return num;
  }
  if (num === undefined || num === null) {
    return "";
  }
  num = num.toString().replace(/[^0-9.]/g, "");

  if (num < 1000) {
    return parseFloat(num).toFixed(2);
    // return Math.round(num);
  }
  let number;
  if (CurrencyType(true) == "INR" && num >= 100000) {
    if (num >= 10000000) {
      number =
        (num / 10000000).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
        " cr";
    } else if (num >= 100000) {
      number =
        (num / 100000).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
        " lac";
    } else {
      number = num;
    }
  } else {
    let si = [
      { v: 1e3, s: "K" },
      { v: 1e6, s: "M" },
      { v: 1e9, s: "B" },
      { v: 1e12, s: "T" },
      { v: 1e15, s: "P" },
      { v: 1e18, s: "E" },
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }

    number =
      (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
      si[index].s;
  }

  return number;
};

export const lightenDarkenColor = (hex, lum) => {
  if (hex === undefined || hex === "xxxxx") {
    hex = "#ffffff";
  }
  // var num = parseInt(col, 16);
  // var r = (num >> 16) + amt;
  // var b = ((num >> 8) & 0x00FF) + amt;
  // var g = (num & 0x0000FF) + amt;
  // var newColor = g | (b << 8) | (r << 16);
  // return newColor.toString(16);

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
};

export const amountFormat = (number, locals, currency_type) => {
  return new Intl.NumberFormat(locals, {
    currency: currency_type,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
export const getPadding = (val, e, OnboardingState) => {
  let paddRight = 120;
  if (document.getElementById(val)) {
    // console.log(document.getElementById(val).lastChild.offsetWidth)
    if (document.getElementById(val).lastChild.offsetWidth) {
      if (document.getElementById(val).lastChild.offsetWidth < 60)
        paddRight = 120;
      else paddRight = document.getElementById(val).lastChild.offsetWidth + 10;
    }
    // condition when unregognize coin detected
    if (
      e.coins.length === OnboardingState.coinsList.length &&
      e.coinFound === false
    )
      paddRight = 150;
    let style = { paddingRight: paddRight };
    return style;
  }

  return { paddingRight: paddRight };
};
export const loadingAnimation = (noMargin = false) => {
  return (
    <div
      style={{
        marginLeft: noMargin ? "0rem" : "",
      }}
      className="spinner-chip-container"
    >
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
};

export const noExponents = (value) => {
  var data = String(value).split(/[eE]/);
  if (data.length === 1) return data[0];

  var z = "",
    sign = value < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

export const CurrencyType = (code = "both") => {
  let currency = JSON.parse(window.localStorage.getItem("currency"));
  if (code === "both") {
    return currency?.symbol + " " + currency?.code;
  } else if (code) {
    return currency?.code;
  } else if (currency?.symbol) {
    return currency?.symbol;
  } else {
    return "";
  }
};

export const UpgradeTriggered = () => {
  let userPlan = JSON.parse(window.localStorage.getItem("currentPlan"));
  let id = 0;
  let trigger = false;

  let walletAddress = JSON.parse(window.localStorage.getItem("addWallet"));
  // console.log("wal", walletAddress?.length, userPlan?.wallet_address_limit);

  if (
    walletAddress?.length > userPlan?.wallet_address_limit &&
    userPlan?.wallet_address_limit !== -1
  ) {
    id = 1;
    trigger = true;
  } else if (userPlan?.whale_pod_limit && false) {
    id = 2;
    trigger = true;
  }
  // else if (userPlan?.notifications_provided) {
  //   id = 1;
  //   trigger = true;
  // }
  // else if (userPlan?.notifications_limit) {
  //   id = 1;
  //   trigger = true;
  // }
  // else if (userPlan?.defi_enabled) {
  //   id = 1;
  //   trigger = true;
  // }
  // else if (userPlan?.insight) {
  //   id = 1;
  //   trigger = true;
  // }
  // else if (userPlan?.export_address_limit) {
  //   id = 1;
  //   trigger = true;
  // }
  // else if (userPlan?.upload_csv) {
  //   id = 1;
  //   trigger = true;
  // }

  return { id, trigger };
};
