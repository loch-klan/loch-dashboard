export const API_LIMIT = 10
export const MAX_LIMIT = 1000
export const START_PAGE = 0
export const GOOGLE_API_KEY = "AIzaSyAKncPaSejL7yv4F1Rm7jj9TdW57eF27Jg"
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

export const ModelName = {
  RUGGEDG1: 1,
  RUGGEDG2: 2,
  presentable: {
    1: "Rugged G1",
    2: "Rugged G1+"
  }
}

export const ModelOptions = Object.keys(ModelName.presentable).map((model) => ({
  label: ModelName.presentable[model],
  value: model
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

export const AccountType = {
  COMPANY: 10,
  FRANCHISE: 20,
  presentable: {
    10: "Company",
    20: "Franchise"
  },
  getText: function (value) {
    return this.presentable[value]
  }
}

export const LocationType = {
  COUNTRY: 10,
  STATE: 20,
  CITY: 30,
  AREA: 40,
  presentable: {
    10: "Country",
    20: "State",
    30: "City",
    40: "Area"
  }
}

export const LocationTypeOptions = Object.keys(LocationType.presentable).map(
  (location) => ({
    label: LocationType.presentable[location],
    value: location
  })
)

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

export const DayType = {
  WEEKDAY: 1,
  WEEKEND: 2,
  presentable: {
    1: "Weekday",
    2: "Weekend"
  }
}

export const DayTypeOptions = Object.keys(DayType.presentable).map((day) => ({
  label: DayType.presentable[day],
  value: day
}))

export const PermissionList = {
  VIEW_FRANCHISE: "VIEW_FRANCHISE",
  ADD_UPDATE_FRANCHISE: "ADD_UPDATE_FRANCHISE",
  DELETE_FRANCHISE: "DELETE_FRANCHISE",

  VIEW_FRANCHISE_LOCATION: "VIEW_FRANCHISE_LOCATION",
  ADD_UPDATE_FRANCHISE_LOCATION: "ADD_UPDATE_FRANCHISE_LOCATION",
  DELETE_FRANCHISE_LOCATION: "DELETE_FRANCHISE_LOCATION",

  VIEW_COUPON: "VIEW_COUPON",
  ADD_UPDATE_COUPON: "ADD_UPDATE_COUPON",
  DELETE_COUPON: "DELETE_COUPON",

  ADD_UPDATE_ACCOUNT: "ADD_UPDATE_ACCOUNT",
  VIEW_ACCOUNT: "VIEW_ACCOUNT",
  DELETE_ACCOUNT: "DELETE_ACCOUNT",

  ADD_UPDATE_USER: "ADD_UPDATE_USER",
  VIEW_USER: "VIEW_USER",
  DELETE_USER: "DELETE_USER",

  ADD_UPDATE_CUSTOMER: "ADD_UPDATE_CUSTOMER",
  VIEW_CUSTOMER: "VIEW_CUSTOMER",
  DELETE_CUSTOMER: "DELETE_CUSTOMER",
  ADD_UPDATE_CUSTOMER_PROFILE: "ADD_UPDATE_CUSTOMER_PROFILE",
  VIEW_CUSTOMER_PROFILE: "VIEW_CUSTOMER_PROFILE",
  DELETE_CUSTOMER_PROFILE: "DELETE_CUSTOMER_PROFILE",

  ADD_UPDATE_ROLE: "ADD_UPDATE_ROLE",
  VIEW_ROLE: "VIEW_ROLE",
  DELETE_ROLE: "DELETE_ROLE",

  ADD_UPDATE_VEHICLE_INVENTORY: "ADD_UPDATE_VEHICLE_INVENTORY",
  VIEW_VEHICLE_INVENTORY: "VIEW_VEHICLE_INVENTORY",
  DELETE_VEHICLE_INVENTORY: "DELETE_VEHICLE",

  ADD_UPDATE_VEHICLE_MODEL: "ADD_UPDATE_VEHICLE_MODEL",
  VIEW_VEHICLE_MODEL: "VIEW_VEHICLE_MODEL",
  DELETE_VEHICLE_MODEL: "DELETE_VEHICLE_MODEL",

  ADD_UPDATE_TELEMATICS_MODEL: "ADD_UPDATE_TELEMATICS_MODEL",
  VIEW_TELEMATICS_MODEL: "VIEW_TELEMATICS_MODEL",
  DELETE_TELEMATICS_MODEL: "DELETE_TELEMATICS_MODEL",

  ADD_UPDATE_TELEMATICS_INVENTORY: "ADD_UPDATE_TELEMATICS_INVENTORY",
  VIEW_TELEMATICS_INVENTORY: "VIEW_TELEMATICS_INVENTORY",
  DELETE_TELEMATICS_INVENTORY: "DELETE_TELEMATICS_INVENTORY",

  ADD_UPDATE_BATTERY_MODEL: "ADD_UPDATE_BATTERY_MODEL",
  VIEW_BATTERY_MODEL: "VIEW_BATTERY_MODEL",
  DELETE_BATTERY_MODEL: "DELETE_BATTERY_MODEL",

  ADD_UPDATE_BATTERY_INVENTORY: "ADD_UPDATE_BATTERY_INVENTORY",
  VIEW_BATTERY_INVENTORY: "VIEW_BATTERY_INVENTORY",
  DELETE_BATTERY_INVENTORY: "DELETE_BATTERY_INVENTORY",

  ADD_UPDATE_COUPON: "ADD_UPDATE_COUPON",
  VIEW_COUPON: "VIEW_COUPON",
  DELETE_COUPON: "DELETE_COUPON",
  ADD_UPDATE_ORDER: "ADD_UPDATE_ORDER",
  VIEW_ORDER: "VIEW_ORDER",
  DELETE_ORDER: "DELETE_ORDER",

  VIEW_SETTLEMENT_REPORT: "VIEW_SETTLEMENT_REPORT",
  ADD_UPDATE_SETTLEMENT_REPORT: "ADD_UPDATE_SETTLEMENT_REPORT",
  VIEW_REPORTS: "VIEW_REPORTS"
}

export const CouponTypes = {
  FLAT: 10,
  PERCENTAGE: 20,
  presentable: {
    10: "Flat",
    20: "Percentage"
  },
  getText: function (value) {
    return this.presentable[value]
  }
}

export const CouponTypeOptions = Object.keys(CouponTypes.presentable).map(
  (type) => ({
    label: CouponTypes.presentable[type],
    value: type
  })
)

export const YesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
]

export const DocType = {
  KYC: 10
}

export const PricingType = {
  HOURLY: 10,
  DAILY: 20,
  WEEKLY: 30,
  MONTHLY: 40,
  presentable: {
    10: "Hourly",
    20: "Daily",
    30: "Weekly",
    40: "Monthly"
  },
  formatedText: {
    10: "hr/hrs",
    20: "day/days",
    30: "week/weeks",
    40: "month/months"
  },
  getFormatedText: function (value) {
    return this.formatedText[value]
  },
  getText: function (value) {
    return this.presentable[value]
  }
}

export const PricingTypeOptions = Object.keys(PricingType.presentable).map(
  (type) => ({
    label: PricingType.presentable[type],
    value: type
  })
)

export const PricingLevel = {
  CITY: 30,
  AREA: 40,
  presentable: {
    30: "City",
    40: "Area"
  },
  getText: function (value) {
    return this.presentable[value]
  }
}

export const PricingLevelOptions = Object.keys(PricingLevel.presentable).map(
  (type) => ({
    label: PricingLevel.presentable[type],
    value: type
  })
)

export const OrderStatus = {
  INITIATED: 10,
  PLACED: 20,
  NOT_PLACED: 30,
  PICKED_UP: 40,
  RETURN_PAYMENT_PENDING: 50,
  RETURN_PAYMENT_SETTLED: 55,
  CANCELLED: 60,
  _presentable: {
    10: "Initiated",
    20: "Upcoming",
    30: "Not Placed",
    40: "Ongoing",
    50: "Returned",
    55: "Returned",
    60: "Cancelled"
  },
  _class: {
    10: "cancelled",
    20: "upcoming",
    30: "cancelled",
    40: "ongoing",
    50: "",
    55: "ongoing",
    60: "cancelled"
  },
  getText: function (value) {
    return this._presentable[value]
  },
  getClass: function (value) {
    return this._class[value]
  }
}

export const PaymentType = {
  PAYMENTLINK: 20,
  OFFLINE: 30,
  _presentable: {
    20: "PaymentLink",
    30: "Offline"
  }
}

export const VehicleStatus = {
  AVAILABLE: 10,
  RESERVED: 20,
  IN_SERVICE: 50,
  DECOMMISSIONED: 60,
  _presentable: {
    10: "Available",
    20: "Reserved",
    50: "In Service",
    60: "Decommissioned"
  },
  getText: function (value) {
    return this._presentable[value]
  }
}

export const VehicleStatusOptions = Object.keys(VehicleStatus._presentable).map(
  (type) => ({
    label: VehicleStatus._presentable[type],
    value: type
  })
)

export const PaymentStatus = {
  PENDING: 10,
  SUCCESS: 20,
  FAILED: 30,
  PARTIAL_REFUND_IN_PROGRESS: 40,
  PARTIALLY_REFUNDED: 50,
  REFUND_IN_PROGRESS: 60,
  REFUNDED: 70,
  REFUND_FAILED: 80,
  _presentable: {
    10: "Pending",
    20: "Success",
    30: "Failed",
    40: "Partial refund in progress",
    50: "Pratially Refunded",
    60: "Refund in progress",
    70: "Refunded",
    80: "Refund Failed"
  },
  getText: function (value) {
    return this._presentable[value]
  }
}
