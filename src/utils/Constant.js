export const API_LIMIT = 10
export const MAX_LIMIT = 1000
export const START_PAGE = 0
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

export const YesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
]


