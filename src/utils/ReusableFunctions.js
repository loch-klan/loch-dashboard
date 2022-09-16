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
      return num;
  }
  let si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
    ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
          break;
      }
  }
  return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}
