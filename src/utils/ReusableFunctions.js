import React from "react"
import { Image } from "react-bootstrap"
import { API_LIMIT } from "./Constant"
import moment from "moment"

// GET EXTENSION NAME WRAPPER
export const getExtensionNameWrapper = (
  attachmentName,
  attachmentUrl,
  className
) => {
  const re = /(?:\.([^.]+))?$/
  let ext = re.exec(attachmentName)[1]
  let attachmentWrapper
  // console.log(attachmentName, attachmentUrl, className);
  if (ext === "jpeg" || ext === "png" || ext === "jpg") {
    attachmentWrapper = <Image src={attachmentUrl} alt="link-preview" />
  } else {
    attachmentWrapper = <span className={className}>{ext}</span>
  }
  return attachmentWrapper
}

export const replaceHistory = (history, page = 1, searchValue = "") => {
  history.replace({
    search: `?p=${page}${searchValue && `&&search=${searchValue}`}`
  })
}

export const calculateTotalPageCount = (totalCount) => {
  return Math.ceil(totalCount / API_LIMIT)
}

export const formatDate = (date) => {
  if (date) return moment(date).format("DD-MMM-YYYY")
  else return "NA"
}

export const formatDuration = (data) => {
  const dateFormat = "YYYY-MM-DD HH:mm:ss"
  const start = moment(data.startDate || data.start_datetime).format(dateFormat)
  const end = moment(data.endDate || data.end_datetime).format(dateFormat)
  const difference = moment.duration(moment(end).diff(start))
  // Get Days
  const days = Math.floor(difference.asDays())
  // Get Hours
  const hours = difference.hours()
  //Get Minutes
  const minutes = difference.minutes()
  return days + " Days " + hours + " hrs " + minutes + " mins "
}

export const compareDate = (dateTimeA, dateTimeB) => {
  var momentA = moment(dateTimeA).format("DD/MM/YYYY")
  var momentB = moment(dateTimeB).format("DD/MM/YYYY")
  if (momentA > momentB) return false
  else if (momentA < momentB) return false
  else return true
}

export const numToCurrency = (num) => {
  num = num.toString().replace(/[^0-9.]/g, '');
  
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
}

export const lightenDarkenColor = (hex, lum) => {
  // var num = parseInt(col, 16);
  // var r = (num >> 16) + amt;
  // var b = ((num >> 8) & 0x00FF) + amt;
  // var g = (num & 0x0000FF) + amt;
  // var newColor = g | (b << 8) | (r << 16);
  // return newColor.toString(16);

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

export const amountFormat = (number, locals, currency_type) => {
  return new Intl.NumberFormat(locals, { currency: currency_type }).format(number)
}
export const getPadding = (val, e ,OnboardingState) => {
  let paddRight = 120
  if (document.getElementById(val)) {
    // console.log(document.getElementById(val).lastChild.offsetWidth)
    if (document.getElementById(val).lastChild.offsetWidth) {
      if (document.getElementById(val).lastChild.offsetWidth < 60)
        paddRight = 120
      else
        paddRight = document.getElementById(val).lastChild.offsetWidth + 10
    }
    // condition when unregognize coin detected
    if (e.coins.length === OnboardingState.coinsList.length && e.coinFound === false)
      paddRight = 150
    let style = { paddingRight: paddRight }
    return style
  }

  return { paddingRight: paddRight }
}
export const loadingAnimation = () => {
  return (
    <div className="spinner-chip-container">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  )
}

export const noExponents = (value) => {
  var data = String(value).split(/[eE]/);
  if (data.length === 1) return data[0];

  var z = '',
    sign = value < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + '0.';
    while (mag++) z += '0';
    return z + str.replace(/^\-/,'');
  }
  mag -= str.length;
  while (mag--) z += '0';
  return str + z;
}

export const CurrencyType = (code = "both") => {
  let currency = JSON.parse(localStorage.getItem('currency'))
  if(code === "both"){
    return currency?.symbol + " " + currency?.code
  } else if(code){
    return currency?.code
  } else{
    return currency?.symbol
  }
}

export const UpgradeTriggered = () => {
  let userPlan = JSON.parse(localStorage.getItem("currentPlan"));
  let id = 0;
  let trigger = false;

   let walletAddress = JSON.parse(localStorage.getItem("addWallet"));

  if (walletAddress?.length > userPlan?.wallet_address_limit) {
  }
}