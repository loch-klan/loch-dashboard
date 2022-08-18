export const API_LIMIT = 10
export const MAX_LIMIT = 1000
export const START_PAGE = 0
export const GOOGLE_API_KEY = ""
export const API_URL = "https://sapi-float.ebikego.com/api/"
export const MEDIA_URL = "https://d1r1yzhyzim0p1.cloudfront.net/"

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

