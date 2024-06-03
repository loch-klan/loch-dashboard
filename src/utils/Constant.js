export const API_LIMIT = 10;
export const MAX_LIMIT = 1000;
export const START_INDEX = 0;
export const GOOGLE_API_KEY = "";
// export const API_URL = "https://sapi-float.ebikego.com/api/"
export const API_BASE_URL = process.env.REACT_APP_API_BASEURL;
// export const MEDIA_URL = "https://d1r1yzhyzim0p1.cloudfront.net/"
export const DEFAULT_PRICE = 0;
export const DEFAULT_COLOR = "#2c2c2c";
// export const BASE_URL_S3 = "http://staging.loch.com.s3-website.ap-south-1.amazonaws.com/"
export const BASE_URL_S3 = process.env.REACT_APP_BASE_URL_S3;
export const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
export const COINBASE_SECRET_KEY = process.env.REACT_APP_COINBASE_SECRET_KEY;
export const ARCX_API_KEY = process.env.REACT_APP_ARCX_API_KEY;
export const BASE_GA_KEY = process.env.REACT_APP_GOOGLE_ANALYTICS_KEY;

export const SEARCH_IN_ID = "SEARCH_IN_ID";
export const SEARCH_BY_ACTIVE = "SEARCH_BY_ACTIVE";
export const SEARCH_BY_CHAIN_IN = "SEARCH_BY_CHAIN_IN";
export const SEARCH_BY_WALLET_ADDRESS = "SEARCH_BY_WALLET_ADDRESS";
export const SEARCH_BY_WALLET_ADDRESS_IN = "SEARCH_BY_WALLET_ADDRESS_IN";
export const SEARCH_BY_TEXT = "SEARCH_BY_TEXT";
export const SEARCH_BY_NOT_DUST = "SEARCH_BY_NOT_DUST";
export const SORT_BY_PORTFOLIO_AMOUNT = "SORT_BY_PORTFOLIO_AMOUNT";
export const SORT_BY_CREATED_ON = "SORT_BY_CREATED_ON";
export const SORT_BY_NAME = "SORT_BY_NAME";
export const SEARCH_BY_ASSETS_IN = "SEARCH_BY_ASSETS_IN";
export const SEARCH_BY_METHOD_IN = "SEARCH_BY_METHOD_IN";
export const SEARCH_BY_TIMESTAMP_IN = "SEARCH_BY_TIMESTAMP_IN";
export const SEARCH_BETWEEN_VALUE = "SEARCH_BETWEEN_VALUE";
export const SORT_BY_TIMESTAMP = "SORT_BY_TIMESTAMP";
export const SORT_BY_FROM_WALLET = "SORT_BY_FROM_WALLET";
export const SORT_BY_TO_WALLET = "SORT_BY_TO_WALLET";
export const SORT_BY_ASSET = "SORT_BY_ASSET";
export const SORT_BY_AMOUNT = "SORT_BY_AMOUNT";
export const SORT_BY_USD_VALUE_THEN = "SORT_BY_USD_VALUE_THEN";
export const SORT_BY_TRANSACTION_FEE = "SORT_BY_TRANSACTION_FEE";
export const SORT_BY_METHOD = "SORT_BY_METHOD";
// LINE GRAPH
export const GROUP_BY_MONTH = "GROUP_BY_MONTH";
export const GROUP_BY_YEAR = "GROUP_BY_YEAR";
export const GROUP_BY_DATE = "GROUP_BY_DATE";
export const GROUP_BY_WEEK = "GROUP_BY_WEEK";

// Yield Opportunities
export const SORT_BY_VALUE = "SORT_BY_VALUE";
export const SORT_BY_APY = "SORT_BY_APY";
export const SORT_BY_POOL = "SORT_BY_POOL";
export const SORT_BY_PROJECT = "SORT_BY_PROJECT";
// export const SORT_BY_ASSET = "SORT_BY_ASSET";
export const SORT_BY_TVL = "SORT_BY_TVL";

// Watch List
export const SORT_BY_ADDRESS = "SORT_BY_ADDRESS";
export const SORT_BY_ANALYSED = "SORT_BY_ANALYSED";
export const SORT_BY_NAME_TAG = "SORT_BY_NAME_TAG";
export const SORT_BY_REMARKS = "SORT_BY_REMARKS";
// Top Accounts
export const SORT_BY_LARGEST_SOLD = "SORT_BY_LARGEST_SOLD";
export const SORT_BY_LARGEST_BOUGHT = "SORT_BY_LARGEST_BOUGHT";
export const SORT_BY_NET_FLOW = "SORT_BY_NET_FLOW";
export const SORT_BY_NETWORTH = "SORT_BY_NETWORTH";
export const SORT_BY_ACCOUNT = "SORT_BY_ACCOUNT";
export const SORT_BY_TAG_NAME = "SORT_BY_TAG_NAME";
export const SEARCH_BY_NETWORTH = "SEARCH_BY_NETWORTH";

export const GroupByOptions = {
  GROUP_BY_MONTH: "GROUP_BY_MONTH",
  GROUP_BY_YEAR: "GROUP_BY_YEAR",
  GROUP_BY_DATE: "GROUP_BY_DATE",
  GROUP_BY_WEEK: "GROUP_BY_WEEK",
  _presentable: {
    GROUP_BY_MONTH: "Month",
    GROUP_BY_YEAR: "Year",
    GROUP_BY_DATE: "Date",
    GROUP_BY_WEEK: "Week",
  },
  getGroupBy: function (value) {
    if (value === "Week") return GROUP_BY_WEEK;
    if (value === "Day") return GROUP_BY_DATE;
    if (value === "Month") return GROUP_BY_MONTH;
    if (value === "Year") return GROUP_BY_YEAR;
  },
  getText: function (value) {
    return this._presentable[value];
  },
};

export const Gender = {
  MALE: 10,
  FEMALE: 20,
  OTHER: 30,
  presentable: {
    10: "Male",
    20: "Female",
    30: "Other",
  },
};

export const GenderOptions = Object.keys(Gender.presentable).map((gender) => ({
  label: Gender.presentable[gender],
  value: gender,
}));

export const UserType = {
  ADMIN: 10,
  CUSTOMER: 20,
  SERVER: 30,
  presentable: {
    10: "Admin",
    20: "Customer",
    30: "Server",
  },
};

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
    7: "Saturday",
  },
};

export const DayOptions = Object.keys(Days.presentable).map((day) => ({
  label: Days.presentable[day],
  value: day,
}));

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
    { value: "allMethod", label: "All Method" },
    { value: 10, label: "Burn" },
    { value: 20, label: "Transfer" },
    { value: 30, label: "Mint" },
    { value: 40, label: "Commit" },
  ],
  getText: function (value) {
    return this.presentable[value];
  },
};

export const MethodOptions = Object.keys(Method.presentable).map((day) => ({
  label: Method.presentable[day],
  value: day,
}));

export const YesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

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
    12: "December",
  },
  getText: function (value) {
    return this._presentable[value];
  },
};

export const MonthOptions = Object.keys(Months._presentable).map((month) => ({
  label: Months._presentable[month],
  value: month,
}));

export const InsightType = {
  ALL_INSIGHTS: 1,
  COST_REDUCTION: 10,
  RISK_REDUCTION: 20,
  YIELD_INCREASE: 30,
  _presentable: {
    1: "ALL INSIGHTS",
    10: "REDUCE COST",
    20: "REDUCE RISK",
    30: "INCREASE YIELD",
  },
  _presentableSmall: {
    1: "All Insights",
    10: "Reduce Cost",
    20: "Reduce Risk",
    30: "Increase Yield",
  },
  _presentableRiskType: {
    10: "Token Float Risk",
    20: "Borrower Risk",
    30: "Unlock Risk",
    40: "Lender Risk",
    50: "Market Cap Risk",
    60: "Staking Risk",
    70: "Discoverability Risk",
    80: "Concentration Risk",
  },
  _presentableRiskTypeNumber: {
    "All risks": 0,
    "Token Float Risk": 10,
    "Borrower Risk": 20,
    "Unlock Risk": 30,
    "Lender Risk": 40,
    "Market Cap Risk": 50,
    "Staking Risk": 60,
    "Discoverability Risk": 70,
    "Concentration Risk": 80,
  },
  getText: function (value) {
    return this._presentable[value];
  },
  getSmallText: function (value) {
    return this._presentableSmall[value];
  },
  getRiskType: function (value) {
    return this._presentableRiskType[value];
  },
  getRiskNumber: function (value) {
    return this._presentableRiskTypeNumber[value];
  },
};

export const FeedbackType = {
  POSITIVE: 10,
  NEGATIVE: 20,
};
// for balance sheet
export const AssetType = {
  REGULAR: 10,
  STAKED: 20,
  BORROWED: 30,
  LENT: 40,
  DEPOSITED: 50,
  POOL_DEPOSIT: 60,
  REWARD: 70,
  FARM: 80,
  _presentable: {
    10: "Regular",
    20: "Staked",
    30: "Borrowed",
    40: "Lent",
    50: "Supplied",
    60: "Pool",
    70: "Reward",
    80: "Farm",
  },
  getText: function (value) {
    return this._presentable[value];
  },
};

// for Amount Type
export const AmountType = {
  _numbers: {
    1000: "$1,000.00",
    10000: "$10k",
    100000: "$100k",
    1000000: "$1m",
    10000000: "$10m",
    100000000: "$100m",
  },

  // _numbers: {
  //   1000: `${CurrencyType(false)}1,000.00`,
  //   10000: `${CurrencyType(false)}10k`,
  //   100000: `${CurrencyType(false)}100k`,
  //   1000000: `${CurrencyType(false)}1m`,
  //   10000000: `${CurrencyType(false)}10m`,
  //   100000000: `${CurrencyType(false)}100m`,
  // },

  _presentable: {
    "$1,000.00": 1000,
    $10k: 10000,
    $100k: 100000,
    $1m: 1000000,
    $10m: 10000000,
    $100m: 100000000,
  },

  getText: function (value) {
    return this._numbers[value];
  },
  getNumber: function (value) {
    return this._presentable[value];
  },
};

// for Dormant Type
export const DormantType = {
  _numbers: { 30: ">30 days", 60: "60 days", 90: "90 days", 180: "180 days" },
  _presentable: {
    ">30 days": 30,
    "60 days": 60,
    "90 days": 90,
    "180 days": 180,
  },
  getText: function (value) {
    return this._numbers[value];
  },
  getNumber: function (value) {
    return this._presentable[value];
  },
};

// not used now
export const Plans = {
  //-1 for unlimited
  _presentable: {
    Free: {
      price: 0,
      wallet_address_limit: 5,
      whale_pod_limit: 1,
      whale_pod_addr_limit: 5,
      notifications_provided: false,
      notification_limit: 0,
      defi_details_provided: false,
      export_address_limit: 1,
      upload_csv_address: 5,
      name: "Free",
    },
    Baron: {
      price: 300,
      wallet_address_limit: 50,
      whale_pod_limit: 100,
      whale_pod_addr_limit: 50,
      notifications_provided: true,
      notification_limit: 100,
      defi_details_provided: false,
      export_address_limit: -1,
      upload_csv_address: 50,
      name: "Baron",
    },
    Sovereign: {
      price: 1000,
      wallet_address_limit: -1,
      whale_pod_limit: -1,
      whale_pod_addr_limit: -1, //update after update on sheet
      notifications_provided: false, //update after update on sheet
      notification_limit: 0, //update after update on sheet
      defi_details_provided: false,
      export_address_limit: -1,
      upload_csv_address: -1,
      name: "Sovereign",
    },
  },

  getPlan: function (value) {
    return this._presentable[value];
  },
};

// whale pod
// for balance sheet
export const PodType = {
  MANUAL: 10,
  INFLUENCER: 20,
  RECOMMENDED: 30,
  RECEIVED: 40,
  _presentable: {
    10: {
      name: "MANUALLY CREATED",
      description: "These addresses were added by you.",
    },
    20: {
      name: "INFLUENCER",
      description: "Most widely followed wallet addresses on the internet.",
    },
    30: {
      name: "RECOMMENDED",
      description:
        "These addresses were dynamically generated by Loch based on your activity and portfolio.",
    },
    40: {
      name: "RECEIVED",
      description:
        "This pod was created by someone else who shared it with you.",
    },
  },
  getText: function (value) {
    return this._presentable[value];
  },
};

// top accounts time filter

export const TimeFilterType = {
  _presentable: {
    "All time": 4000,
    "2 weeks": 14,
    "1 month": 30,
    "6 months": 183,
    "1 year": 365,
    "3 years": 1096,
    "5 years": 1825,
  },
  getText: function (value) {
    return this._presentable[value];
  },
};
export const TimeFilterInflowOutflowType = {
  _presentable: {
    Max: 5000,
    "1 Week": 7,
    "2 Weeks": 14,
    "1 Month": 30,
    "6 Months": 183,
    "1 Year": 365,
    "3 Years": 1096,
    "5 Years": 1825,
  },
  getText: function (value) {
    return this._presentable[value];
  },
};
