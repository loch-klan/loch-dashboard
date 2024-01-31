import React from "react";
import { Image } from "react-bootstrap";
import { API_LIMIT, BASE_URL_S3 } from "./Constant";
import moment from "moment";
import { DARK_MODE } from "../app/intelligence/ActionTypes";
import { SwitchDarkMode } from "../app/common/Api";
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

export const numToCurrency = (num, noDefaultDecimals) => {
  if (num < 1000 && noDefaultDecimals) {
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
  let currency = JSON.parse(window.sessionStorage.getItem("currency"));
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
  let userPlan = JSON.parse(window.sessionStorage.getItem("currentPlan"));
  let id = 0;
  let trigger = false;

  let walletAddress = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
