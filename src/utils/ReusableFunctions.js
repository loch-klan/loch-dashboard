import React from "react";
import { Image } from "react-bootstrap";
import { API_LIMIT } from "./Constant";
import moment from "moment";
export const mobileCheck = () => {
  // let check = false;
  // (function (a) {
  //   if (
  //     /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
  //       a
  //     ) ||
  //     /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
  //       a.substr(0, 4)
  //     )
  //   )
  //     check = true;
  // })(navigator.userAgent || navigator.vendor || window.opera);
  // return check;
  let hasTouchScreen = false;
  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ("orientation" in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      var UA = navigator.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  if (hasTouchScreen) {
    return true;
  }
  return false;
};
// TruncateText
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

export const numToCurrency = (num) => {
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
  return new Intl.NumberFormat(locals, { currency: currency_type }).format(
    number
  );
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
export const loadingAnimation = () => {
  return (
    <div className="spinner-chip-container">
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
  } else {
    return currency?.symbol;
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
