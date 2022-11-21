export const API_LIMIT = 10
export const MAX_LIMIT = 1000
export const START_INDEX = 0
export const GOOGLE_API_KEY = ""
export const API_URL = "https://sapi-float.ebikego.com/api/"
export const MEDIA_URL = "https://d1r1yzhyzim0p1.cloudfront.net/"
export const DEFAULT_PRICE = 0
export const DEFAULT_COLOR = "#2c2c2c"
export const BASE_URL_S3 = "http://staging.loch.com.s3-website.ap-south-1.amazonaws.com/"

export const SEARCH_IN_ID = 'SEARCH_IN_ID'
export const SEARCH_BY_ACTIVE = 'SEARCH_BY_ACTIVE'
export const SEARCH_BY_CHAIN_IN = 'SEARCH_BY_CHAIN_IN'
export const SEARCH_BY_WALLET_ADDRESS = 'SEARCH_BY_WALLET_ADDRESS'
export const SEARCH_BY_WALLET_ADDRESS_IN = 'SEARCH_BY_WALLET_ADDRESS_IN'
export const SEARCH_BY_TEXT = 'SEARCH_BY_TEXT'
export const SORT_BY_PORTFOLIO_AMOUNT = 'SORT_BY_PORTFOLIO_AMOUNT'
export const SORT_BY_CREATED_ON = 'SORT_BY_CREATED_ON'
export const SORT_BY_NAME = 'SORT_BY_NAME'
export const SEARCH_BY_ASSETS_IN = 'SEARCH_BY_ASSETS_IN'
export const SEARCH_BY_METHOD_IN = 'SEARCH_BY_METHOD_IN'
export const SEARCH_BY_TIMESTAMP_IN = 'SEARCH_BY_TIMESTAMP_IN'
export const SORT_BY_TIMESTAMP = 'SORT_BY_TIMESTAMP'
export const SORT_BY_FROM_WALLET = 'SORT_BY_FROM_WALLET'
export const SORT_BY_TO_WALLET = 'SORT_BY_TO_WALLET'
export const SORT_BY_ASSET = 'SORT_BY_ASSET'
export const SORT_BY_AMOUNT = 'SORT_BY_AMOUNT'
export const SORT_BY_USD_VALUE_THEN = 'SORT_BY_USD_VALUE_THEN'
export const SORT_BY_TRANSACTION_FEE = 'SORT_BY_TRANSACTION_FEE'
export const SORT_BY_METHOD = 'SORT_BY_METHOD'
// LINE GRAPH
export const GROUP_BY_MONTH = 'GROUP_BY_MONTH'
export const GROUP_BY_YEAR = 'GROUP_BY_YEAR'
export const GROUP_BY_DATE = 'GROUP_BY_DATE'
export const GROUP_BY_WEEK = 'GROUP_BY_WEEK'

export const GroupByOptions = {
  GROUP_BY_MONTH: 'GROUP_BY_MONTH',
  GROUP_BY_YEAR: 'GROUP_BY_YEAR',
  GROUP_BY_DATE: 'GROUP_BY_DATE',
  GROUP_BY_WEEK: 'GROUP_BY_WEEK',
  _presentable:{
    GROUP_BY_MONTH: 'Month',
    GROUP_BY_YEAR: 'Year',
    GROUP_BY_DATE: 'Date',
    GROUP_BY_WEEK: 'Week',
  },
  getGroupBy : function(value){
    if(value === 'Week') return GROUP_BY_WEEK
    if(value === 'Day') return GROUP_BY_DATE
    if(value === 'Month') return GROUP_BY_MONTH
    if(value === 'Year') return GROUP_BY_YEAR
  },
  getText : function(value){
    return this._presentable[value]
  }
}

export const Gender = {
  MALE: 10,
  FEMALE: 20,
  OTHER: 30,
  presentable: {
    10: "Male",
    20: "Female",
    30: "Other"
  }
}

export const GenderOptions = Object.keys(Gender.presentable).map((gender) => ({
  label: Gender.presentable[gender],
  value: gender
}))

export const UserType = {
  ADMIN: 10,
  CUSTOMER: 20,
  SERVER: 30,
  presentable: {
    10: "Admin",
    20: "Customer",
    30: "Server"
  }
}

export const Days = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,
  presentable: {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday"
  }
}

export const DayOptions = Object.keys(Days.presentable).map((day) => ({
  label: Days.presentable[day],
  value: day
}))

export const Method = {
  BURN: 10,
  TRANSFER: 20,
  MINT: 30,
  COMMIT: 40,
  presentable: {
    10: "Burn",
    20: "Transfer",
    30: "Mint",
    40: "Commit",
  },
  // opt:["Burn","Transfer","Mint","Commit"],
  opt: [
    {value : "allMethod" , label : "All Method"},
    { value: 10, label: "Burn" },
    { value: 20, label: "Transfer" },
    { value: 30, label: "Mint" },
    { value: 40, label: "Commit" }
  ],
  getText : function(value){
    return this.presentable[value]
  }
}

export const MethodOptions = Object.keys(Method.presentable).map((day) => ({
  label:Method.presentable[day],
  value: day
}))

export const YesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
]



export const Months = {
  JANUARY: 1,
  FEBUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
  _presentable: {
    1: "January",
    2: "Febuary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  },
  getText : function(value){
    return this._presentable[value]
  }
}

export const MonthOptions = Object.keys(Months._presentable).map((month) => ({
  label: Months._presentable[month],
  value: month
}))
