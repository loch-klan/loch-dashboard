import amplitude from "amplitude-js";
import Mixpanel from "mixpanel-browser";
import { deleteToken } from "./ManageToken";


//Api Config
export const initAmplitude = () => {

  // amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_KEY);
  Mixpanel.init(process.env.REACT_APP_MIXPANEL_KEY, {
    loaded: function (mixpanel) {
      // let distinct_id = mixpanel.get_distinct_id();
      // // Mixpanel.alias("test");
      // Mixpanel.identify(distinct_id);
      //  mixpanel.people.set({
      //   //  $first_name: "Test",
      //   //  $last_name: "Test",
      //   //  $email: "Test",
      //  });
    },
  });
 

};



// send Aplitude Data
export const sendAmplitudeData = (eventType, eventProperties) => {
  // amplitude.getInstance().logEvent(eventType, eventProperties);
  let baseToken = localStorage.getItem("baseToken");
  let newEventProperties = {
    ...eventProperties, "access_code": baseToken,
    "email address": ""
  }
  delete newEventProperties["email address"];
  Mixpanel.track(eventType, newEventProperties);
};


export const signInUser = ({
  email_address,
  userId,
  first_name,
  last_name,
  track,
  mobile,
}) => {
  // console.log(userId);
  // Mixpanel.people.set_once(properties);
  //  console.log(email_address, userId, first_name, last_name);
  Mixpanel.alias(userId);
  Mixpanel.identify(userId);
  Mixpanel.people.set({
    $email: email_address,
    $first_name: first_name,
    $last_name: last_name,
    $user_id: userId,
    $email_came_from: track,
    $mobile: mobile,
  });
};

export const signUpProperties = ({
  email_address,
  userId,
  first_name,
  last_name,
  // track,
}) => {
  //  console.log(email_address, userId, first_name, last_name);
  Mixpanel.alias(userId);
  Mixpanel.identify(userId);
  Mixpanel.people.set_once({
    $email: email_address,
    $first_name: first_name,
    $last_name: last_name,
    $user_id: userId,
    $email_came_from: "",
  });
};

export const resetUser = () => {
  Mixpanel.reset();
  deleteToken();
  // console.log("reset");
}

//use this to call function
//  <button onClick={() => { test({ name: "abdul", email: "test@gmail.com", organisation: "Organisation name" }); }}> Button Name </button>

//for testing Test
export const test = ({ session_id, chains }) => {
  const event_name = "Test";
  const eventProperties = {
    "session id": session_id,
    "list of all chains detected": chains,
  };
  sendAmplitudeData(event_name, eventProperties);
  // //console.log("Test");
};

//1. Landing Page Conversion:preview demo
export const PreviewDemo = ({ session_id }) => {
  const event_name = "Landing Page Conversion:preview demo";
  const eventProperties = {
    "session id": session_id,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:preview demo");
};

//2. Landing Page Conversion:go
export const LPC_Go = ({
  addresses,
  ENS,
  chains_detected_against_them,
  unrecognized_addresses,
  unrecognized_ENS,
  nicknames
}) => {
  const event_name = "Landing Page Conversion:go";
  const eventProperties = {
    addresses: addresses,
    ENS: ENS,
    "chains detected against them": chains_detected_against_them,
    "unrecognized addresses": unrecognized_addresses,
    "unrecognized ENS": unrecognized_ENS,
    nicknames:nicknames
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:go");
};

//3. Landing Page Conversion:privacy message
export const PrivacyMessage = ({ session_id }) => {
  const event_name = "Landing Page Conversion:privacy_message";
  const eventProperties = {

  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:privacy message");
};

//4. Landing Page Conversion:email address added
export const EmailAddressAdded = ({ session_id, email_address }) => {
  const event_name = "Landing Page Conversion:email address added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:email address added");
};

//5. Landing Page Conversion:email address verified
export const EmailAddressVerified = ({ session_id, email_address }) => {
  const event_name = "Landing Page Conversion:email address verified";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:email address verified");
};

//6. Landing Page Conversion:returning user signed in correctly
export const UserSignedinCorrectly = ({ session_id, email_address }) => {
  const event_name =
    "Landing Page Conversion:returning user signed in correctly";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:returning user signed in correctly");
};

//7. Landing Page Conversion:returning user wrong verification code
export const UserWrongCode = ({ session_id, email_address }) => {
  const event_name =
    "Landing Page Conversion:returning user wrong verification code";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:returning user wrong verification code");
};

//8. Landing Page Conversion:time spent on onboarding
export const TimeSpentOnboarding = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Landing Page Conversion:time spent on onboarding";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent onboarding": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//8. Landing Page Conversion:time spent on onboarding
export const TimeSpentDiscountEmail = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Landing Page Conversion:time spent on discount email";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent onboarding": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//4. Landing Page Conversion: nickname
export const LandingPageNickname = ({ session_id, email_address, nickname, address }) => {
  const event_name = "Landing Page Conversion: nickname";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "nickname": nickname,
    address:address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion: nickname");
};

//9. Home:manage wallets
export const ManageWallets = ({ session_id, email_address }) => {
  const event_name = "Home:manage wallets";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:manage wallets");
};

//10. Home:add wallet address
export const AddWalletAddress = ({
  session_id,
  email_address,
  addresses_added,
  ENS_added,
  addresses_deleted,
  ENS_deleted,
  unrecognized_addresses,
  recognized_addresses,
  blockchains_detected,
  nicknames
}) => {
  const event_name = "Home:add wallet_address";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses added": addresses_added,
    "ENS added": ENS_added,
    "addresses deleted": addresses_deleted.length == 0 ? ["None"] : addresses_deleted,
    "ENS deleted": ENS_deleted.length == 0 ? ["None"]: ENS_deleted,
    "unrecognized addresses":
      unrecognized_addresses.length == 0 ? ["None"] : unrecognized_addresses,
    "recognized addresses": recognized_addresses,
    "blockchains detected": blockchains_detected,
    nicknames:nicknames
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:add wallet_address");
};


//10. Home:add wallet address nickname
export const AddWalletAddressNickname = ({
  session_id,
  email_address,
  addresses_added,
  nickname
}) => {
  const event_name = "Home:add wallet_address nickname";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses added": addresses_added,
    nickname: nickname
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:add wallet_address");
};

//11. Home:piechart overview
export const PiechartOverview = ({
  session_id,
  email_address,
  list_of_assets_and_amounts,
}) => {
  const event_name = "Home:piechart overview";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "list of assets and amounts": list_of_assets_and_amounts,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:piechart overview");
};

//12. Home:piechart specific chain name
export const PiechartChainName = ({
  session_id,
  email_address,
  asset_clicked,
  asset_amount
}) => {
  const event_name = "Home:piechart specific chain_name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset clicked": asset_clicked,
    "asset amount": asset_amount,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:piechart specific chain name");
};

//13. Home:asset value chart deposits and withdrawals
export const AssetValueChart = ({
  session_id,
  email_address,
  asset_hovered,
}) => {
  const event_name = "Home:asset value chart deposits and withdrawals";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset hovered": asset_hovered,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Home:asset value chart deposits and withdrawals");
};

//14. Home:asset value chart crypto asset filter
export const AssetValueFilter = ({
  session_id,
  email_address,
  filter_clicked,
}) => {
  const event_name = "Home:asset value chart crypto asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "filter clicked": filter_clicked,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:asset value chart crypto asset filter");
};

//15. Home:asset value chart fiat currency
export const AssetValueFaitCurrency = ({
  session_id,
  email_address,
  fiat_currency_selected,
}) => {
  const event_name = "Home:asset value chart fiat currency ";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "fiat currency selected": fiat_currency_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:asset value chart fiat currency ");
};

//16. Home:asset value chart time period
export const AssetValueTimePeriod = ({
  session_id,
  email_address,
  time_filter_selected,
}) => {
  const event_name = "Home:asset value chart time period";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time filter selected": time_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:asset value chart time period");
};




//17. Home:portfolio performance asset filter
export const PortfolioAssetFilter = ({
  session_id,
  email_address,
  asset_filter_selected,
}) => {
  const event_name = "Home:portfolio performance asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset filter(s) selected": asset_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:portfolio performance asset filter");
};

//18. Home:portfolio performance time period filter
export const PortfolioTimePeriodFilter = ({
  session_id,
  email_address,
  time_period_filter_selected,
}) => {
  const event_name = "Home:portfolio performance time period filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time period filter selected": time_period_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:portfolio performance time period filter");
};

//19. Home:portfolio performance expanded view
export const PortfolioPerformanceEView = ({ session_id, email_address }) => {
  const event_name = "Home:portfolio performance expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:portfolio performance expanded view");
};

//20. Home:transaction history expanded view
export const TransactionHistoryEView = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:transaction history expanded view");
};

//21. Home:transaction history addresses
export const TransactionHistoryAddress = ({
  session_id,
  email_address,
  address_hovered,
  display_name
}) => {
  const event_name = "Home:transaction history addresses";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "address hovered": address_hovered,
    "display address": display_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:transaction history addresses");
};

//22. Home:volume traded by counterparty expanded view
export const VolumeTradeByCP = ({ session_id, email_address }) => {
  const event_name = "Home:volume traded by counterparty expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:volume traded by counterparty expanded view");
};

//25. Home:language clicked
export const LanguageClicked = ({
  session_id,
  email_address,
  language_selected,
}) => {
  const event_name = "Home:language clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "language selected": language_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:language clicked");
};

//26. Home:language changed
export const LanguageChnaged = ({
  session_id,
  email_address,
  language_selected,
}) => {
  const event_name = "Home:language changed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "language selected": language_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:language changed");
};

//27. Home:fiat currency clicked
export const FiatCurrencyClicked = ({
  session_id,
  email_address,
  currency_selected,
}) => {
  const event_name = "Home:fiat currency clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "currency selected": currency_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:fiat currency clicked");
};

//28. Home:fiat currency changed
export const FiatCurrencyChanged = ({
  id,
  email_address,
  prev_currency,
  latest_currency,
}) => {
  const event_name = "Home:fiat currency changed";
  const eventProperties = {
    "account id/session id": id,
    "email address": email_address,
    "prev fiat currency": prev_currency,
    "latest fiat currency": latest_currency,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:fiat currency changed");
};

//29. Home:time spent on home page
export const TimeSpentHome = ({ session_id, email_address, time_spent }) => {
  const event_name = "Home:time spent on home page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent home": time_spent
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:time spent on home page");
};

//30. Menu:intelligence menu
export const IntelligenceMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:intelligence menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//Menu:Home menu
export const HomeMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:Home menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:Home menu");
};

//31. Menu:wallets menu
export const WalletsMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:wallets menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:wallets menu");
};

//32. Menu:costs menu
export const CostsMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:costs menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:costs menu");
};

//33. Menu:profile menu
export const ProfileMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:profile menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:profile menu");
};

//34. Menu:export
export const ExportMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:export";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:export");
};

//35. Menu:export date range drop down selected
export const ExportDateSelected = ({
  session_id,
  email_address,
  date_range_selected,
}) => {
  const event_name = "Menu:export date range drop down selected";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "date range selected": date_range_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  // console.log("Menu:export date range drop down selected");
};

//36. Menu:export data downloaded
export const ExportDataDownlaod = ({
  session_id,
  email_address,
  date_range_selected,
  data_exported,
}) => {
  const event_name = "Menu:export data downloaded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "date range selected": date_range_selected,
    "data exported": data_exported,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:export data downloaded");
};

//37. Menu:api
export const MenuApi = ({ session_id, email_address }) => {
  const event_name = "Menu:api";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:api");
};

//38. Menu:dark mode
export const MenuDarkMode = ({ session_id, email_address }) => {
  const event_name = "Menu:dark mode";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:dark mode");
};

//39. Menu:leave
export const MenuLeave = ({ session_id, email_address }) => {
  const event_name = "Menu:leave";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave");
};

//40. Menu:leave: email added
export const LeaveEmailAdded = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: email added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave: email added");
};

//41. Menu:leave: link copied
export const LeaveLinkCopied = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: link copied";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave: link copied");
};

//42. Menu:leave: link shared
export const LeaveLinkShared = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: link shared";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave: link shared");
};

//43. Menu:leave: privacy message
export const LeavePrivacyMessage = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: privacy message";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave: privacy message");
};

//44. Intelligence:transaction history
export const TransactionHistory = ({ session_id, email_address }) => {
  const event_name = "Intelligence:transaction history";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:transaction history");
};

//45. Intelligence:traded by counterparty - removed page
export const TradeByCounterParty = ({ session_id, email_address }) => {
  const event_name = "Intelligence:traded by counterparty";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:traded by counterparty");
};

// 45. Intelligence:asset value graph
export const AssetValueAnalytics = ({ session_id, email_address }) => {
   const event_name = "Intelligence:asset value";
   const eventProperties = {
     "session id": session_id,
     "email address": email_address,
   };
   sendAmplitudeData(event_name, eventProperties);
   //console.log("Intelligence:asset value");
};


//46. Intelligence:insights
export const Insights = ({ session_id, email_address }) => {
  const event_name = "Intelligence:insights";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights");
};

//47. Intelligence:portfolio performance asset filter
export const PPAssetFilter = ({
  session_id,
  email_address,
  asset_filter_selected,
}) => {
  const event_name = "Intelligence:portfolio performance asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset filter(s) selected": asset_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:portfolio performance asset filter");
};

//48. Intelligence:portfolio performance time period filter
export const PPTimePeriodFilter = ({
  session_id,
  email_address,
  time_period_filter_selected,
}) => {
  const event_name = "Intelligence:portfolio performance time period filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset filter(s) selected": time_period_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:portfolio performance time period filter");
};

//49. Intelligence:portfolio performance expanded view
export const PPTimePeriodFilterEView = ({
  session_id,
  email_address,
  time_period_filter_selected,
}) => {
  const event_name = "Intelligence:portfolio performance expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset filter(s) selected": time_period_filter_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:portfolio performance expanded view");
};

//50. Intelligence:insights view more
export const InsightsViewMore = ({ session_id, email_address }) => {
  const event_name = "Intelligence:insights view more";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights view more");
};

//51. Intelligence:time spent on intelligence page
export const TimeSpentIntelligence = ({ session_id, email_address,time_spent }) => {
  const event_name = "Intelligence:time spent on intelligence page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent Intelligence":time_spent
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:time spent on intelligence page");
};

//52. Intelligence:yield view more
export const YieldViewMore = ({ session_id, email_address }) => {
  const event_name = "Intelligence:yield view more";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:yield view more");
};

//53. Wallets:add wallet
export const AddWallets = ({
  session_id,
  email_address,
  wallet_type_selected,
  name_tag,
  address,
  ENS,
  blockchains_detected,
}) => {
  const event_name = "Wallets:add wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    address: address,
    ENS: ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:add wallet");
};

//54. Wallets:filter based on assets
export const FilterBasedAssest = ({
  session_id,
  email_address,
  assets_selected,
}) => {
  const event_name = "Wallets:filter based on assets";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "assets selected": assets_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:filter based on assets");
};

//55. Wallets:sort by amount
export const SortByAmount = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:sort by amount");
};

//56. Wallets:sort by date
export const SortByDate = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by date";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:sort by date");
};

//57. Wallets:sort by name
export const SortByName = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:sort by name");
};

//58. Wallets:edit specific wallet
export const EditSpecificWallet = ({
  session_id,
  email_address,
  wallet_type_selected,
  name_tag,
  address,
  ENS,
  blockchains_detected,
}) => {
  const event_name = "Wallets:edit specific wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    address: address,
    ENS: ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:edit specific wallet");
};


//59. Wallets:add name tag
export const AddNameTag = ({
  session_id,
  email_address,
  wallet_type_selected,
  name_tag,
  address,
  ENS,
  blockchains_detected,
}) => {
  const event_name = "Wallets:add name tag";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    "address": address,
    "ENS": ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:add name tag");
};


//60. Wallets:fix undetected wallet
export const FixUndetectedWallet = ({ session_id, email_address,undetected_address }) => {
  const event_name = "Wallets:fix undetected wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "undetected address": undetected_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:fix undetected wallet");
};

//61. Wallets:add wallet type for unrecognized wallet
export const AddWalletType = ({ session_id, email_address, wallet_type_selected, name_tag, address, ENS,blockchains_detected }) => {
  const event_name = "Wallets:add wallet type for unrecognized wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    "address": address,
    "ENS": ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:add wallet type for unrecognized wallet");
};


//62. Wallets:add chain type for unrecognized wallet
export const AddChainType = ({ session_id, email_address, wallet_type_selected, name_tag, address, ENS,blockchains_detected }) => {
  const event_name = "Wallets:add chain type for unrecognized wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    "address": address,
    "ENS": ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:add chain type for unrecognized wallet");
};

//63. Wallets:delete wallet
export const DeleteWallet = ({ session_id, email_address, wallet_type_selected, name_tag, address, ENS,blockchains_detected }) => {
  const event_name = "Wallets:delete wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet type selected": wallet_type_selected,
    "name tag": name_tag,
    "address": address,
    "ENS": ENS,
    "blockchains detected": blockchains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:delete wallet");
};


//64. Wallets:Clicked done after fixing connection
export const DoneFixingConnection = ({
  session_id,
  email_address,
  wallet_address,
  blockchainDetected,
}) => {
  const event_name = "Wallets:Clicked done after fixing connection";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet address": wallet_address,
    "blockchain detected": blockchainDetected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:Clicked done after fixing connection");
};

//65. Wallets:hover for anonymity for wallet connection
export const AnonymityWalletConnection = ({ session_id, email_address}) => {
  const event_name = "Wallets:hover for anonymity for wallet connection";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:hover for anonymity for wallet connection");
}


//66. Wallets:time spent on wallet page
export const TimeSpentWallet = ({ session_id, email_address, time_spent }) => {
  const event_name = "Wallets:time spent on wallet page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent wallet": time_spent
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:time spent on wallet page");
};

//67. Wallets:analyze asset values for specific wallet
export const AnalyzeAssetValue = ({ session_id, email_address, wallet_address, chain_name, percent_value}) => {
  const event_name = "Wallets:analyze asset values for specific wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "wallet address": wallet_address,
    "chain name": chain_name,
    "percent value": percent_value
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Wallets:analyze asset values for specific wallet");
}

//68. Costs:time spent on costs page
export const TimeSpentCosts = ({ session_id, email_address, time_spent}) => {
  const event_name = "Costs:time spent on cost page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent cost": time_spent
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:time spent on cost page");
}

//69. Costs:blockchain fees asset filter
export const BlockchainFeesFilter = ({ session_id, email_address, asset_selected}) => {
  const event_name = "Costs:blockchain fees asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected":asset_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:blockchain fees asset filter");
}

//70. Costs:blockchain fees time period filter
export const FeesTimePeriodFilter = ({ session_id, email_address, time_period_selected}) => {
  const event_name = "Costs:blockchain fees time period filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time period selected": time_period_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:blockchain fees time period filter");
}


//71. Costs:blockchain fees specific bar
export const FeesSpecificBar = ({ session_id, email_address, blockchain_selected}) => {
  const event_name = "Costs:blockchain fees specific bar";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "blockchain selected": blockchain_selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:blockchain fees specific bar");
}

//72. Costs:counterparty fees asset filter
export const CounterpartyFeesFilter = ({ session_id, email_address, asset_selected}) => {
  const event_name = "Costs:counterparty fees asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected": asset_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:counterparty fees asset filter");
}

//73. Costs:counterparty fees time period filter
export const CounterpartyFeesTimeFilter = ({ session_id, email_address, time_period_selected}) => {
  const event_name = "Costs:counterparty fees time period filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time period selected": time_period_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:counterparty fees time period filter");
}

//74. Costs:counterparty fees specific bar
export const CounterpartyFeesSpecificBar = ({ session_id, email_address, counterparty_selected}) => {
  const event_name = "Costs:counterparty fees specific bar";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "counterparty selected": counterparty_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs:counterparty fees specific bar");
}


//84. Profile:first name added
export const FirstNameAdded = ({ session_id, email_address,first_name}) => {
  const event_name = "Profile:first name added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "first name":first_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:first name added");
}

//85. Profile:last name added
export const LastNameAdded = ({ session_id, email_address,last_name}) => {
  const event_name = "Profile:last name added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "last name":last_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:last name added");
}

//86. Profile:email added
export const EmailAdded = ({ session_id, new_email_address,prev_email_address}) => {
  const event_name = "Profile:email added";
  const eventProperties = {
    "session id": session_id,
    "new email address": new_email_address,
    "prev email address": prev_email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:email added");
}

//87. Profile:mobile number added
export const MobileNumberAdded = ({ session_id, phone_number}) => {
  const event_name = "Profile:mobile number added";
  const eventProperties = {
    "session id": session_id,
    "phone number": phone_number
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:mobile number added");
}

//88. Profile:language changed
export const LanguageChanged = ({ session_id, language }) => {
  const event_name = "Profile:language changed";
  const eventProperties = {
    "session id": session_id,
    language: language,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:language changed");
};

//89. Profile:fiat currency changed
export const CurrencyChanged = ({ session_id, currency }) => {
  const event_name = "Profile:fiat currency changed";
  const eventProperties = {
    "session id": session_id,
    currency: currency,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:fiat currency changed");
};

//90. Profile:saved
export const ProfileSaved = ({ session_id, email_address }) => {
  const event_name = "Profile:saved";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Profile:saved");
};

//91. Landing Page Conversion:WalletAddressTextbox
export const WalletAddressTextbox = ({ session_id, address, chains_detected }) => {
  const event_name = "Landing Page Conversion:WalletAddressTextbox";
  const eventProperties = {
    "session id": session_id,
    "address": address,
    "list of all chains detected":chains_detected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:WalletAddressTextbox");
};


//92. Landing Page Conversion:deleted wallet address
export const DeleteWalletAddress = ({ session_id, address}) => {
  const event_name = "Landing Page Conversion:deleted wallet address";
  const eventProperties = {
    "session id": session_id,
    "address": address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:deleted wallet address");
};

//93. Landing Page Conversion:add textbox
export const AddTextbox = ({ session_id}) => {
  const event_name = "Landing Page Conversion:add textbox";
  const eventProperties = {
    "session id": session_id
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:add textbox");
};

//94. Landing Page Conversion:Email not Found
export const EmailNotFound = ({ session_id, email_address}) => {
  const event_name = "Landing Page Conversion:email not found";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:Email Not found");
};

//95. Landing Page Conversion:Invalid Email
export const InvalidEmail = ({ email_address}) => {
  const event_name = "Landing Page Conversion:invalid email";
  const eventProperties = {

    "email added": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Landing Page Conversion:Invalid Email");
};

//96. Home:asset value chart internal events
export const AssetValueInternalEvent = ({ session_id, email_address, no_of_events }) => {
  const event_name = "Home:asset value chart internal events";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "no of internal events": no_of_events
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:asset value chart internal events ");
};

//97.Home:asset value chart hover 
export const AssetValueHover = ({ session_id, email_address, value, address }) => {
  const event_name = "Home:asset value chart hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "point hovered": value,
    "Wallet address": address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:asset value chart hover");
};


//97.Home Page: transaction history date
export const TransactionHistoryDate = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history date";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home: transaction history date");
};

//97.Home Page: transaction history from
export const TransactionHistoryFrom = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history from";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home: transaction history from");
};


//97.Home Page: transaction history to
export const TransactionHistoryTo = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history to";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: transaction history to");
};


//97.Home Page:transaction history asset
export const TransactionHistoryAsset = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history asset";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:transaction history asset");
};

//97.Home Page:transaction history USD value
export const TransactionHistoryUSD = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history USD value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:transaction history USD value");
};


//97.Home Page:transaction history method
export const TransactionHistoryMethod = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history method";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:transaction history method");
};


//97.Home Page:transaction history hover
export const TransactionHistoryHover = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:transaction history hover");
};



//97.Home Page:Profit and Loss expanded view
export const ProfitLossEV = ({ session_id, email_address }) => {
  const event_name = "Home:Profit and Loss expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:Profit and Loss expanded view");
};


//97.Home Page:Profit and Loss hover
export const ProfitLossHover = ({ session_id, email_address, hover_value }) => {
  const event_name = "Home:Profit and Loss hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "bar hovered": hover_value
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:Profit and Loss hover");
};


//97.Home Page:counterparty fees hover
export const HomeCounterPartyHover = ({ session_id, email_address, counterparty_selected}) => {
  const event_name = "Home:counterparty fees hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "counterparty selected": counterparty_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:counterparty fees hover");
}


//97.Intelligence:insights: all insights
export const AllInsights = ({ session_id, email_address}) => {
  const event_name = "Insights: all insights";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights: all insights");
}


//97.Intelligence:insights: reduce cost
export const InsightsReduceCost = ({ session_id, email_address}) => {
  const event_name = "Insights: reduce cost";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights: reduce cost");
}


//97.Intelligence:insights: increase yield
export const InsightsIncreaseYield = ({ session_id, email_address}) => {
  const event_name = "Insights: increase yield";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights: increase yield");
}



//97.Intelligence:insights: reduce risk
export const InsightsReduceRisk = ({ session_id, email_address}) => {
  const event_name = "Insights: reduce risk";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:insights: reduce risk");
}

//14. Intelligent:asset value chart chain filter
export const IntlAssetValueFilter = ({
  session_id,
  email_address,
  filter_clicked,
}) => {
  const event_name = "Intelligence:asset value chart chain filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "filter clicked": filter_clicked,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//Intelligence:asset value chart hover 
export const IntlAssetValueHover = ({ session_id, email_address, value, address }) => {
  const event_name = "Intelligence:asset value chart hover ";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "point hovered": value,
    "Wallet address": address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart hover ");
};

//Intelligence:asset value chart internal events
export const IntlAssetValueInternalEvent = ({ session_id, email_address, no_of_events }) => {
  const event_name = "Intelligence:asset value chart internal events";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "no of internal events": no_of_events
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart internal events");
};


//97.Home Page:asset value hover
export const TitleAssetValueHover = ({ session_id, email_address }) => {
  const event_name = "Home:asset value hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page:asset value hover");
};

// Menu: share
export const MenuShare = ({ session_id, email_address }) => {
  const event_name = "Menu:share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:share");
};

// Menu:share: link copied
export const ShareLinkCopy = ({ session_id, email_address, link }) => {
  const event_name = "Menu:share: link copied";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "Copied Link": link
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:share: link copied");
};


// Page View: HomePage
export const HomePage = ({ session_id, email_address}) => {
  const event_name = "Page View: Home";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Home");
};

// Page View: IntelligencePage
export const IntelligencePage = ({ session_id, email_address}) => {
  const event_name = "Page View: Intelligence";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Intelligence");
};

// Page View: Cost page
export const CostsPage = ({ session_id, email_address}) => {
  const event_name = "Page View: Costs";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Cost");
};

// Page View: wallets page
export const WalletsPage = ({ session_id, email_address}) => {
  const event_name = "Page View: Wallets";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Wallets");
};

// Page View: Profile page
export const ProfilePage = ({ session_id, email_address}) => {
  const event_name = "Page View: Profile";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Profile");
};

// Page View: Transaction History
export const TransactionHistoryPageView = ({ session_id, email_address}) => {
  const event_name = "Page View: Transaction History";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Transaction History");
};

// Page View: Asset Value
export const AssetValuePage = ({ session_id, email_address}) => {
  const event_name = "Page View: Asset Value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Asset Value");
};

// Page View: Insights
export const InsightPage = ({ session_id, email_address}) => {
  const event_name = "Page View: Insights";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Pageview Insights");
};

// Page View: Onboarding
export const OnboardingPage = () => {
  const event_name = "Page View: Onboarding";
  const eventProperties = {
  
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Pageview Onboarding");
};

// Page View: Onboarding
export const DiscountEmailPage = () => {
  const event_name = "Page View: Discount email";
  const eventProperties = {
  
  };
  sendAmplitudeData(event_name, eventProperties);
  // console.log("Pageview Onboarding");
};


// Home Page: Updated refresh button

export const HomeRefreshButton = ({ session_id, email_address}) => {
  const event_name = "Home Page: Updated refresh button";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Updated refresh button");
};


// Menu:leave: let me leave

export const MenuLetMeLeave = ({ session_id, email_address}) => {
  const event_name = "Menu:leave: let me leave";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:leave: let me leave");
};


// Menu:whale

export const MenuWhale = ({ session_id, email_address }) => {
  const event_name = "Menu:whale";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:whale");
};


//Intelligence:netflows: click to show breakdown

export const NetflowSwitch = ({ session_id, email_address }) => {
  const event_name = "Intelligence:netflows: click to show breakdown";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:whale");
};

//Whale:create a whale pod: save

export const CreateWhalePodSave = ({
  session_id,
  email_address,
  pod_name,
  addresses,
  unrecognized_addresses,
  chains_detected_against_them,
}) => {
  const event_name = "Whale:create a whale pod: save";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    addressess: addresses,
    unrecognized_addresses: unrecognized_addresses,
    chains_detected_against_them: chains_detected_against_them,
  };
  sendAmplitudeData(event_name, eventProperties);
  // console.log("Whale:create a pod: save");
};


//Whale:sort by amount

export const WhaleSortByAmt = ({ session_id, email_address }) => {
  const event_name = "Whale:sort by amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:sort by amount");
};


//Whale:sort by date added

export const WhaleSortByDate = ({ session_id, email_address }) => {
  const event_name = "Whale:sort by date added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:sort by date added");
};

//Whale:sort by name

export const WhaleSortByName = ({ session_id, email_address }) => {
  const event_name = "Whale:sort by name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:sort by name");
};


//Whale:hover pods

export const WhaleHoverPod = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale:hover pods";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:hover pods");
};


//Whale:filter by chain

export const WhaleFilterByChain = ({ session_id, email_address, chain_name }) => {
  const event_name = "Whale:filter by chain";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "chain name": chain_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:filter by chain");
};

//Whale:don’t lose your data

export const WhaleCreateAccountModal = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale:don’t lose your data";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:don’t lose your data");
};

//Whale:don’t lose your data: skip

export const WhaleCreateAccountSkip = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale:don’t lose your data: skip";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:don’t lose your data: skip");
};


//Whale:don’t lose your data: email saved

export const WhaleCreateAccountEmailSaved = ({ session_id, email_address }) => {
  const event_name = "Whale:don’t lose your data: email saved";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:don’t lose your data: email saved");
};

//Whale:don’t lose your data: email verified

export const WhaleCreateAccountEmailVerified= ({ session_id, email_address }) => {
  const event_name = "Whale:don’t lose your data: email verified";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:don’t lose your data: email saved");
};

//Whale:don’t lose your data: privacy hover
export const WhaleCreateAccountPrivacyHover = ({ session_id, email_address }) => {
  const event_name = "Whale:don’t lose your data: privacy hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:don’t lose your data: privacy hover");
};

//Whale:whale pod deleted
export const WhalePodDeleted = ({ session_id, email_address, pod_name, addresses}) => {
  const event_name = "Whale:whale pod deleted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    addresses:addresses
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:whale pod deleted");
};

//Whale:Expanded Pod page
export const WhaleExpandedPod = ({ session_id, email_address, pod_name}) => {
  const event_name = "Whale:Expanded Pod page clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page");
};


//Whale:Expanded Pod page: time filter
export const WhaleExpandedPodFilter = ({ session_id, email_address, pod_name,time_period_selected}) => {
  const event_name = "Whale:Expanded Pod page: time filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    "time period selected": time_period_selected,
    
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page: time filter");
};

// Whale:create a whale pod: csv or text file uploaded
export const WhalePodUploadFile = ({
  session_id,
  email_address,
  addresses,
}) => {
  const event_name = "Whale:create a whale pod: csv or text file uploaded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses": addresses,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page: time filter");
};


// Whale:create a whale pod: WalletAddress added
export const WhaleWalletAddressTextbox = ({
  session_id,
  email_address,
  address,
  chains_detected,
}) => {
  const event_name = "Whale:create a whale pod: WalletAddress added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    address: address,
    "list of all chains detected": chains_detected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:create a whale pod: WalletAddress added");
};

// Whale:create a whale pod: delete wallet address
export const WhalePodAddressDelete = ({
  session_id,
  email_address,
  address,
}) => {
  const event_name = "Whale:create a whale pod: delete wallet address";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    address: address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:create a whale pod: delete wallet address");
};


// Whale:create a whale pod: add textbox
export const WhalePodAddTextbox = ({
  session_id,
  email_address,
}) => {
  const event_name = "Whale:create a whale pod: add textbox";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:create a whale pod: add textbox");
};

// Whale:create a whale pod
export const CreateWhalePod = ({
  session_id,
  email_address,
}) => {
  const event_name = "Whale:create a whale pod";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:create a whale pod");
};

// Whale:create a whale pod
export const PodName = ({
  session_id,
  email_address,
  pod_name
}) => {
  const event_name = "Whale:create a whale pod: pod name added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:create a whale pod: pod name added");
};

// Whale:Expanded Pod page: email notification checked 1
export const NotificationAmount = ({
  session_id,
  email_address,
  is_checked,
  pod_name,
  amount_selected

}) => {
  const event_name = "Whale:Expanded Pod page: amount email notification";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    checked: is_checked,
    "amount selected": amount_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page: email notification checked 1");
};


// Whale:Expanded Pod page: email notification checked 2
export const NotificationDays = ({
  session_id,
  email_address,
  is_checked,
  pod_name,
  day_selected

}) => {
  const event_name = "Whale:Expanded Pod page: dormant email notification";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    checked: is_checked,
    "days selected": day_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page: email notification checked 2");
};

// Whale:Expanded Pod page: email notification saved
export const NotificationSaved = ({
  session_id,
  email_address,
  dropdown_name1,
  dropdown_name2,
  checked1,
  checked2,
  pod_name
}) => {
  const event_name = "Whale:Expanded Pod page: email notification saved";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    "amount dropdown": dropdown_name1,
    "dormant dropdown": dropdown_name2,
    "amount checked": checked1,
    "dormant checked": checked2,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale:Expanded Pod page: email notification saved");
};


//Whale: Expanded Pod page: nickname
export const PodNickname = ({
  session_id,
  email_address,
  pod_name,
  nickname,
  address,
  pod_id,

}) => {
  const event_name = "Whale: Expanded Pod page: nickname";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
    "address": address,
    nickname: nickname,
    "pod id":pod_id
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: nickname");
};

//8. Landing Page Conversion:time spent on onboarding
export const TimeSpentWhalePod = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Whale: time spent on whale pod page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//8. Landing Page Conversion:time spent on onboarding
export const TimeSpentWhalePodPage = ({
  session_id,
  email_address,
  time_spent,
  pod_name
}) => {
  const event_name = "Whale: time spent on Expanded whale pod page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//8. Landing Page Conversion:time spent on onboarding
export const SigninModalTrack = ({
  session_id,
  email_address,
  from
}) => {
  const event_name = "Sign in Popup";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
    "from": from,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};
// Start from here
// -------- Home connect exchange -----------
//8. Landing Page Conversion: connect exchange 
export const HomeConnectExchange = ({
  session_id,
  email_address,
}) => {
  const event_name = "Home Page: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//8. Landing Page Conversion: connect exchanges: connect exchange
export const HomeConnectExchangeSelected = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Home Page: connect exchanges: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: API sync attempted
export const Home_CE_ApiSyncAttmepted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Home Page: connect exchanges: connect exchange: API sync attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: API sync completed
export const Home_CE_ApiSyncCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Home Page: connect exchanges: connect exchange: API sync completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const Home_CE_OAuthAttempted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Home Page: connect exchanges: connect exchange: oAuth attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const Home_CE_OAuthCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Home Page: connect exchanges: connect exchange: oAuth completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};



// -------- LP connect exchange -----------
//8. Landing Page Conversion: connect exchange 
export const LPConnectExchange = ({
  session_id,
  email_address,
}) => {
  const event_name = "Landing Page Conversion: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//8. Landing Page Conversion: connect exchanges: connect exchange
export const LPConnectExchangeSelected = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Landing Page Conversion: connect exchanges: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: API sync attempted
export const LP_CE_ApiSyncAttmepted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Landing Page Conversion: connect exchanges: connect exchange: API sync attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: API sync completed
export const LP_CE_ApiSyncCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Landing Page Conversion: connect exchanges: connect exchange: API sync completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const LP_CE_OAuthAttempted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const LP_CE_OAuthCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Landing Page Conversion: connect exchanges: connect exchange: oAuth completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};




// -------- Wallet Page connect exchange -----------
//8. Landing Page Conversion: connect exchange 
export const WalletConnectExchange = ({
  session_id,
  email_address,
}) => {
  const event_name = "Wallets: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//8. Landing Page Conversion: connect exchanges: connect exchange
export const WalletConnectExchangeSelected = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name = "Wallets: connect exchanges: connect exchange";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: API sync attempted
export const Wallet_CE_ApiSyncAttmepted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Wallets: connect exchanges: connect exchange: API sync attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: API sync completed
export const Wallet_CE_ApiSyncCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Wallets: connect exchanges: connect exchange: API sync completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const Wallet_CE_OAuthAttempted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Wallets: connect exchanges: connect exchange: oAuth attempted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


//Landing Page Conversion: connect exchanges: connect exchange: oAuth attempted
export const Wallet_CE_OAuthCompleted = ({
  session_id,
  email_address,
  exchange_name,
}) => {
  const event_name =
    "Wallets: connect exchanges: connect exchange: oAuth completed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "exchange name": exchange_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


// Home Page: insights expanded - done
export const HomeInsightsExpand = ({
  session_id,
  email_address,
}) => {
  const event_name =
    "Home Page: insights expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


// Home Page: insights expanded  - done
export const HomeDefiYield = ({
  session_id,
  email_address,
}) => {
  const event_name = "Home Page: DeFi balance sheet: Yield expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};


// Home Page: DeFi balance sheet: Debt expanded - done
export const HomeDefiDebt = ({
  session_id,
  email_address,
}) => {
  const event_name = "Home Page: DeFi balance sheet: Debt expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Landing Page Conversion:time spent on onboarding");
};

// Menu: DeFi - done
export const DeFiMenu = ({ session_id, email_address }) => {
  const event_name = "Menu: DeFi";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//  Menu: Feedback - done
export const FeedbackMenu = ({ session_id, email_address }) => {
  const event_name = "Menu: Feedback";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//  Menu: Menu signin - done
export const SigninMenu = ({ session_id, email_address }) => {
  const event_name = "Menu: Sign in";
  const eventProperties = {
    "session id": session_id,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//  Menu: Sign in: email added - done
export const SigninMenuEmailAdded = ({ session_id, email_address }) => {
  const event_name = "Menu: Sign in: email added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//  Menu: Sign in: email verified - done
export const SigninMenuEmailVerified = ({ session_id, email_address }) => {
  const event_name = "Menu: Sign in: email verified";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

//  Menu: Currency drop down - done

export const MenuCurrencyDropdown = ({ session_id, email_address, currency }) => {
  const event_name = "Menu: Currency drop down";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "current fiat currency": currency,
  };
  sendAmplitudeData(event_name, eventProperties);
  // console.log("Menu: Currency drop down");
};

//  Menu: Currency drop down selected - done

export const MenuCurrencyDropdownSelected = ({
  session_id,
  email_address,
  currency,
  prev_currency,
}) => {
  const event_name = "Menu: Currency drop down: currency selected";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "prevoius currency": prev_currency,
    "current fiat currency": currency,
  };
  sendAmplitudeData(event_name, eventProperties);
  // console.log("Menu: Currency drop down: currency selected");
};



// Intelligence:netflows: explainer1 closed - done

export const netflowExplainer1 = ({
  session_id,
  email_address,
}) => {
  const event_name = "Intelligence:netflows: explainer1 closed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Intelligence:netflows: explainer1 closed - done

export const netflowExplainer2 = ({
  session_id,
  email_address,
}) => {
  const event_name = "Intelligence:netflows: explainer2 closed";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Intelligence:netflows: time filter - done

export const netflowTimeFilter = ({
  session_id,
  email_address,
  selected
}) => {
  const event_name = "Intelligence:netflows: time filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time filter selected": selected
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Intelligence:netflows: chain filter - done

export const netflowChainFilter = ({
  session_id,
  email_address,
  selected
}) => {
  const event_name = "Intelligence:netflows: chain filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "chain selected": selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Intelligence:netflows: assets filter - done

export const netflowAssetFilter = ({
  session_id,
  email_address,
  selected
}) => {
  const event_name = "Intelligence:netflows: assets filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected": selected,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Intelligence:netflows: inflows hover - done

export const netflowInflowHover = ({
  session_id,
  email_address,
  hovered
}) => {
  const event_name = "Intelligence:netflows: inflows hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "inflows hovered": hovered,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Intelligence:netflows: outflows hover - done

export const netflowOutflowHover = ({
  session_id,
  email_address,
  hovered
}) => {
  const event_name = "Intelligence:netflows: outflows hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "outflows hovered": hovered,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Intelligence:netflows: net hover - done
export const netflowNetHover = ({
  session_id,
  email_address,
  hovered
}) => {
  const event_name = "Intelligence:netflows: net hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "net hovered": hovered,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: add wallet - done
export const TransactionHistoryAddWallet = ({
  session_id,
  email_address,
  addresses_added,
  ENS_added,
  addresses_deleted,
  ENS_deleted,
  unrecognized_addresses,
  recognized_addresses,
  blockchains_detected,
  nicknames

}) => {
  const event_name = "Transaction History: add wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses added": addresses_added,
    "ENS added": ENS_added,
    "addresses deleted":
      addresses_deleted.length == 0 ? ["None"] : addresses_deleted,
    "ENS deleted": ENS_deleted.length == 0 ? ["None"] : ENS_deleted,
    "unrecognized addresses":
      unrecognized_addresses.length == 0 ? ["None"] : unrecognized_addresses,
    "recognized addresses": recognized_addresses,
    "blockchains detected": blockchains_detected,
    nicknames: nicknames,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};



// Transaction History: search - done
export const TransactionHistorySearch = ({
  session_id,
  email_address,
  searched
}) => {
  const event_name = "Transaction History: search";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "searched": searched,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: years filter - done
export const TransactionHistoryYearFilter = ({
  session_id,
  email_address,
  year_filter
}) => {
  const event_name = "Transaction History: years filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "year selected": year_filter,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: assets filter - done
export const TransactionHistoryAssetFilter = ({
  session_id,
  email_address,
  asset_filter
}) => {
  const event_name = "Transaction History: assets filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected": asset_filter,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: methods filter - done
export const TransactionHistoryMethodFilter = ({
  session_id,
  email_address,
  method_filter
}) => {
  const event_name = "Transaction History: methods filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "method selected": method_filter,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Transaction History: sort date - done
export const TransactionHistorySortDate = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort date";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: sort from - done
export const TransactionHistorySortFrom = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort from";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Transaction History: sort to - done
export const TransactionHistorySortTo = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort to";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: sort asset - done
export const TransactionHistorySortAsset = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort asset";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Transaction History: sort amount - done
export const TransactionHistorySortAmount = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: sort usd amount - done

export const TransactionHistorySortUSDAmount = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort usd amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: sort usd fee - done

export const TransactionHistorySortUSDFee = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort usd fee";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: sort method - done

export const TransactionHistorySortMethod = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: sort method";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: hide dust - done

export const TransactionHistoryHideDust = ({
  session_id,
  email_address
}) => {
  const event_name = "Transaction History: hide dust";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Transaction History: page next - done

export const TransactionHistoryPageNext = ({
  session_id,
  email_address,
  page_no
}) => {
  const event_name = "Transaction History: page next";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "page number": page_no
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: page back - done

export const TransactionHistoryPageBack = ({
  session_id,
  email_address,
  page_no
}) => {
  const event_name = "Transaction History: page back";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "page number": page_no
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Transaction History: page search
export const TransactionHistoryPageSearch = ({
  session_id,
  email_address,
  page_search
}) => {
  const event_name = "Transaction History: page search";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "page search": page_search
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};

// Transaction History: add wallet - done
export const AssetValueAddWallet = ({
  session_id,
  email_address,
  addresses_added,
  ENS_added,
  addresses_deleted,
  ENS_deleted,
  unrecognized_addresses,
  recognized_addresses,
  blockchains_detected,
  nicknames

}) => {
  const event_name = "Asset value: add wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses added": addresses_added,
    "ENS added": ENS_added,
    "addresses deleted":
      addresses_deleted.length == 0 ? ["None"] : addresses_deleted,
    "ENS deleted": ENS_deleted.length == 0 ? ["None"] : ENS_deleted,
    "unrecognized addresses":
      unrecognized_addresses.length == 0 ? ["None"] : unrecognized_addresses,
    "recognized addresses": recognized_addresses,
    "blockchains detected": blockchains_detected,
    nicknames: nicknames,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


// Asset Value: explainer hover - done
export const AssetValueExplainer = ({
  session_id,
  email_address,
}) => {
  const event_name = "Asset Value: explainer hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu:intelligence menu");
};


//14. Intelligent:asset value chart asset filter - done
export const IntlAssetValueAssetFilter = ({
  session_id,
  email_address,
  filter_clicked,
}) => {
  const event_name = "Asset Value: asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected": filter_clicked,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Asset Value: x axis manipulation - done
export const IntlAssetValueNavigator = ({
  session_id,
  email_address,
}) => {
  const event_name = "Asset Value: x axis manipulation";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Asset Value: day
export const IntlAssetValueDay = ({
  session_id,
  email_address,
}) => {
  const event_name = "Asset Value: day";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

//14. Asset Value: Year
export const IntlAssetValueYear = ({
  session_id,
  email_address,
}) => {
  const event_name = "Asset Value: year";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

//14. Asset Value: Month
export const IntlAssetValueMonth = ({
  session_id,
  email_address,
}) => {
  const event_name = "Asset Value: month";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. General pop up - done
export const GeneralPopup = ({
  session_id,
  from,
}) => {
  const event_name = "General pop up";
  const eventProperties = {
    "session id": session_id,
    "from": from,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. General pop up: email added - done
export const GeneralPopupEmailAdded = ({ session_id, from, email_added }) => {
  const event_name = "General pop up: email added";
  const eventProperties = {
    "session id": session_id,
    from: from,
    "email added": email_added,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14.General pop up: email verified - done
export const GeneralPopupEmailVerified = ({ session_id, from, email_added }) => {
  const event_name = "General pop up: email verified";
  const eventProperties = {
    "session id": session_id,
    from: from,
    "email added": email_added,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14.Whale pods pop up - done
export const WhalePopup = ({
  session_id,
}) => {
  const event_name = "Whale pods pop up";
  const eventProperties = {
    "session id": session_id,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email added - done
export const WhalePopupEmailAdded = ({ session_id, email_address }) => {
  const event_name = "Whale pods pop up: email added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email verified - done
export const WhalePopupEmailVerified = ({ session_id, email_address }) => {
  const event_name = "Whale pods pop up: email verified";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14.Whale pods pop up - done
export const ConnectExPopup = ({ session_id, from }) => {
  const event_name = "Exchange connected pop up";
  const eventProperties = {
    "session id": session_id,
    "from": from
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email added - done
export const ConnectExPopupEmailAdded = ({ session_id, email_address,from }) => {
  const event_name = "Exchange connected pop up: email added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
    "from":from
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email verified - done
export const ConnectExEmailVerified = ({ session_id, email_address,from }) => {
  const event_name = "Exchange connected pop up: email verified";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
    "from": from
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

export const UpgradeSignInPopup = ({ session_id, from }) => {
  const event_name = "Upgrade sign in pop up";
  const eventProperties = {
    "session id": session_id,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email added - done
export const UpgradeSignInPopupEmailAdded = ({ session_id, email_address,from }) => {
  const event_name = "Upgrade sign in pop up: email added";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
    "from":from
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//14. Whale pods pop up: email verified - done
export const UpgradeSignInEmailVerified = ({ session_id, email_address,from }) => {
  const event_name = "Upgrade sign in pop up: email verified";
  const eventProperties = {
    "session id": session_id,
    "email added": email_address,
    "from": from
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const EmailAddedDiscount = ({ email_address}) => {
  const event_name = "Landing Page Conversion: Discount Email added";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const DiscountEmailSkip = () => {
  const event_name =
    "Landing Page Conversion: Discount: no thanks just let me enter";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


// email added for discount
export const LPWhaleTrack = ({ email_address }) => {
  const event_name = "Landing Page: whale";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const LPPeaceOfMind = ({ email_address}) => {
  const event_name = "Landing Page: Peace of mind";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const LPIntelligenceTrack = ({ email_address }) => {
  const event_name = "Landing Page: Intelligence";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


// email added for discount
export const LPWhaleTrackPageView = () => {
  const event_name = "Page View: Landing Page: whale";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const LPPeaceOfMindPageView = () => {
  const event_name = "Page View: Landing Page: Peace of mind";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for discount
export const LPIntelligenceTrackPageView = () => {
  const event_name = "Page View: Landing Page: Intelligence";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};



// email added for mopbile device 
export const MobileEmail = ({ email_address }) => {
  const event_name = "Mobile coming soon page: email added";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const MobileEmailPageView = () => {
  const event_name = "Page View :Mobile coming soon";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const EmailAddedWhale = ({email_address}) => {
  const event_name = "Landing Page: Whale: Email added";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const EmailAddedInt = ({email_address}) => {
  const event_name = "Landing Page: Intelligence: Email added";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const EmailAddedPeace = ({email_address}) => {
  const event_name = "Landing Page: Peace of mind: Email added";
  const eventProperties = {
    "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


// email added for mopbile device 
export const TextboxWhale = () => {
  const event_name = "Landing Page: Whale: Textbox clicked";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const TextboxInt = () => {
  const event_name = "Landing Page: Intelligence: Textbox clicked";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};

// email added for mopbile device 
export const TextboxPeace = () => {
  const event_name = "Landing Page: Peace of mind: Textbox clicked";
  const eventProperties = {
    // "email added": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:asset value chart crypto asset filter");
};


//23. Home Page: Average cost basis expanded view
export const AverageCostBasisEView = ({ session_id, email_address }) => {
  const event_name = "Home Page: Average cost basis expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home:average cost basis expanded view");
};


// Home Page: insight add more address clicked - done
export const AddMoreAddres = ({ session_id, email_address }) => {
  const event_name = "Home Page: insight add more address clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: insight add more address clicked");
};

// Home Page: Network tab expanded - done
export const NetworkTab = ({ session_id, email_address }) => {
  const event_name = "Home Page: Network tab expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Network tab expanded");
};


// Home Page: Asset value expanded page - done
export const AssetValueExpandview = ({ session_id, email_address }) => {
  const event_name = "Home Page: Asset value expanded page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Asset value expanded page");
};

//Home Page: Asset Value: x axis manipulation - done
export const HomeAssetValueNavigator = ({
  session_id,
  email_address,
}) => {
  const event_name = "Home Page: Asset Value: x axis manipulation";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home Page: Asset Value: x axis manipulation");
};

// average cost basis


//77. Home Page: Average cost basis: sort by asset - done
export const HomeCostSortByAsset = ({ session_id, email_address}) => {
  const event_name = "Home Page: Average cost basis: sort by asset";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Average cost basis: sort by asset");
}


//81. Home Page: Average cost basis: sort by cost basis - done
export const HomeSortByCostBasis = ({ session_id, email_address}) => {
  const event_name = "Home Page: Average cost basis: sort by cost basis";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Average cost basis: sort by cost basis");
}


//82. Home Page: Average cost basis: sort by current value - done
export const HomeSortByCurrentValue = ({ session_id, email_address}) => {
  const event_name = "Home Page: Average cost basis: sort by current value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Average cost basis: sort by current value");
}

//83. Home Page: Average cost basis: sort by percent gain and loss - done
export const HomeSortByGainLoss = ({ session_id, email_address}) => {
  const event_name =
    "Home Page: Average cost basis: sort by percent gain and loss";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Average cost basis: sort by percent gain and loss");
}

//83. Home Page: Average cost basis: asset hover - done
export const HomeCostAssetHover = ({ session_id, email_address, asset_hover}) => {
  const event_name =
    "Home Page: Average cost basis: asset hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset hovered": asset_hover
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Home Page: Average cost basis: asset hover");
}

// ------

//75. Costs: Average Cost Basis: sort cost basis - done
export const CAverageCostBasisSort = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort cost basis";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort cost basis");
}


//77.Costs: Average Cost Basis: sort asset - done
export const CostSortByAsset = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort asset";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort asset");
}

//78. Costs: Average Cost Basis: sort Average cost price - done
export const CostSortByCostPrice = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort Average cost price";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort Average cost price");
}

//79. Costs: Average Cost Basis: sort current price - done
export const CostSortByCurrentPrice = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort current price";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort current price");
}

//80.Costs: Average Cost Basis: sort amount - done
export const CostSortByAmount = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort amount");
}


//82. Costs: Average Cost Basis: sort current value - done

export const SortByCurrentValue = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort current value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort current value);
}

//83. Costs: Average Cost Basis: sort % gain loss - done
export const SortByGainLoss = ({ session_id, email_address}) => {
  const event_name = "Costs: Average Cost Basis: sort % gain loss";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: sort % gain loss");
}

// ------------

// Menu: Intelligence submenu: netflow - done
export const MenuIntNetflow = ({ session_id, email_address}) => {
  const event_name = "Menu: Intelligence submenu: netflow";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu: Intelligence submenu: netflow");
}

// Menu: Intelligence submenu: asset value - done
export const MenuIntAssetValue = ({ session_id, email_address}) => {
  const event_name = "Menu: Intelligence submenu: asset value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu: Intelligence submenu: asset value");
}


// Menu: Intelligence submenu: insights - done
export const MenuIntInsight = ({ session_id, email_address}) => {
  const event_name = "Menu: Intelligence submenu: insights";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu: Intelligence submenu: insights");
}


// Menu: Intelligence submenu: costs - done
export const MenuIntCosts = ({ session_id, email_address}) => {
  const event_name = "Menu: Intelligence submenu: costs";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu: Intelligence submenu: costs");
}

// Menu: Intelligence submenu: transaction history - done
export const MenuIntTransactionHistory = ({ session_id, email_address}) => {
  const event_name = "Menu: Intelligence submenu: transaction history";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Menu: Intelligence submenu: transaction history");
}

//46. Intelligence:costs - done
export const IntCost = ({ session_id, email_address }) => {
  const event_name = "Intelligence:costs";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence:costs");
};


//46. Intelligence: share - done
export const IntShare = ({ session_id, email_address }) => {
  const event_name = "Intelligence: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Intelligence: share");
};


//8.Transaction History: time spent on transaction history page
export const TimeSpentTransactionHistory = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name =
    "Transaction History: time spent on transaction history page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Transaction History: time spent on transaction history page");
};



//46.Transaction history: share - done
export const TransactionHistoryShare = ({ session_id, email_address }) => {
  const event_name = "Transaction history: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Transaction history: share");
};

// Asset value: time spent on asset value page - done

export const TimeSpentAssetValue = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Asset value: time spent on asset value page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Asset value: time spent on asset value page");
};

// Asset Value: share - done
export const AssetValueShare = ({ session_id, email_address }) => {
  const event_name = "Asset Value: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Asset Value: share");
};


// Insights: time spent on insights page - done

export const TimeSpentInsights = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Insights: time spent on insights page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Insights: time spent on insights page");
};

// Insights: share - done
export const InsightsShare = ({ session_id, email_address }) => {
  const event_name = "Insights: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Insights: share");
};

// Insights: risk type dropdown clicked - done
export const RiskTypeDropdownClicked = ({ session_id, email_address }) => {
  const event_name = "Insights: risk type dropdown clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Insights: risk type dropdown clicked");
};

// Insights: risk type selected- done
export const RiskTypeSelected = ({ session_id, email_address, type }) => {
  const event_name = "Insights: risk type selected";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "risk selected": type
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Insights: risk type selected");
};

// Insights: risk type dropdown hover - done
export const RiskTypeHover = ({ session_id, email_address }) => {
  const event_name = "Insights: risk type dropdown hover";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Insights: risk type dropdown hover");
};

// Page View: Whale watch - done
export const PageViewWhale = ({ session_id, email_address }) => {
  const event_name = "Page View: Whale watch";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Page View: Whale watch");
};

// Page View: Whale pod expanded page - done
export const PageViewWhaleExpanded = ({ session_id, email_address, pod_name }) => {
  const event_name = "Page View: Whale pod expanded page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Page View: Whale pod expanded page");
};

// Whale: Expanded Pod page: share - done
export const WhaleExpandShare = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale: Expanded Pod page: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: share");
};

// Whale: Expanded Pod page: Defi balance sheet: yield expanded - done
export const WhaleExpandDefiCredit = ({ session_id, email_address, pod_name }) => {
  const event_name =
    "Whale: Expanded Pod page: Defi balance sheet: yield expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: Defi balance sheet: yield expanded");
};

// Whale: Expanded Pod page: Defi balance sheet: debt expanded - done
export const WhaleExpandDefiDebt = ({ session_id, email_address, pod_name }) => {
  const event_name =
    "Whale: Expanded Pod page: Defi balance sheet: debt expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: Defi balance sheet: debt expanded");
};


// Whale: Expanded Pod page: asset filter - done
export const WhaleExpandAssetFilter = ({
  session_id,
  email_address,
  selected,
  pod_name,
}) => {
  const event_name = "Whale: Expanded Pod page: asset filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "selected asset": selected,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: asset filter");
};


// Whale: Expanded Pod page: chain filter - done
export const WhaleExpandChainFilter = ({
  session_id,
  email_address,
  selected,
  pod_name,
}) => {
  const event_name = "Whale: Expanded Pod page: chain filter";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "selected asset": selected,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("WWhale: Expanded Pod page: chain filter");
};

// Whale: Expanded Pod page: hide dust - done
export const WhaleExpandHideDust = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale: Expanded Pod page: hide dust";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: hide dust");
};

// Whale: Expanded Pod page: address copied - done
export const WhaleExpandAddressCopied = ({
  session_id,
  email_address,
  address,
  pod_name,
}) => {
  const event_name = "Whale: Expanded Pod page: address copied";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "copied address": address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: address copied");
};

// Whale: Expanded Pod page: address deleted - done
export const WhaleExpandAddressDelete = ({
  session_id,
  email_address,
  address,
  pod_name,
}) => {
  const event_name = "Whale: Expanded Pod page: address deleted";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "deleted address": address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: address deleted");
};

// Whale: Expanded Pod page: Edit button clicked - done
export const WhaleExpandEdit = ({ session_id, email_address, pod_name }) => {
  const event_name = "Whale: Expanded Pod page: Edit button clicked";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "pod name": pod_name,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Whale: Expanded Pod page: Edit button clicked");
};


// Costs: share - done
export const CostShare = ({ session_id, email_address }) => {
  const event_name = "Costs: share";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: share");
};

// Costs: Add wallet - done
export const CostAddWallet = ({
  session_id,
  email_address,
  addresses_added,
  ENS_added,
  addresses_deleted,
  ENS_deleted,
  unrecognized_addresses,
  recognized_addresses,
  blockchains_detected,
  nicknames

}) => {
  const event_name = "Costs: Add wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "addresses added": addresses_added,
    "ENS added": ENS_added,
    "addresses deleted":
      addresses_deleted.length == 0 ? ["None"] : addresses_deleted,
    "ENS deleted": ENS_deleted.length == 0 ? ["None"] : ENS_deleted,
    "unrecognized addresses":
      unrecognized_addresses.length == 0 ? ["None"] : unrecognized_addresses,
    "recognized addresses": recognized_addresses,
    "blockchains detected": blockchains_detected,
    nicknames: nicknames,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Add wallet");
};

// Costs: Average Cost Basis: hide dust - done
export const CostHideDust = ({ session_id, email_address }) => {
  const event_name = "Costs: Average Cost Basis: hide dust";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  //console.log("Costs: Average Cost Basis: hide dust");
};


//Profile: time spent on profile page - done

export const TimeSpentProfile = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Profile: time spent on profile page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Profile: time spent on profile page");
};


//Defi: time spent on defi page - done
export const TimeSpentDefi = ({
  session_id,
  email_address,
  time_spent,
}) => {
  const event_name = "Defi: time spent on defi page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "time spent": time_spent,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Defi: time spent on defi page");
};


//Page View: Defi page - done
export const PageviewDefi = ({
  session_id,
  email_address
}) => {
  const event_name = "Page View: Defi page";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Page View: Defi page");
};

//Defi: balance sheet: yield expanded - done
export const DefiCredit = ({
  session_id,
  email_address
}) => {
  const event_name = "Defi: balance sheet: yield expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Defi: balance sheet: yield expanded");
};


//Defi: balance sheet: debt expanded - done
export const DefiDebt = ({
  session_id,
  email_address
}) => {
  const event_name = "Defi: balance sheet: debt expanded";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Defi: balance sheet: debt expanded");
};

//Defi: sort by amount - done
export const DefiSortByAmount = ({
  session_id,
  email_address
}) => {
  const event_name = "Defi: sort by amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Defi: sort by amount");
};


//Defi: sort by name - done
export const DefiSortByName = ({
  session_id,
  email_address
}) => {
  const event_name = "Defi: sort by name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Defi: sort by name");
};


//Menu: Me tab - done
export const MenuMeTab = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu: Me tab";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu: Me tab");
};


//Menu: Discover tab - done
export const MenuDiscoverTab = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu: Discover tab";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu: Discover tab");
};

//Menu: Top accounts - done
export const MenuTopAccounts = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu: Top accounts";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu: Top accounts");
};


//Menu: Twitter influencers - done
export const MenuTwitterInfluencers = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu: Twitter influencers";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu: Twitter influencers");
};

//Menu: Watchlist - done
export const MenuWatchlist = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu: Watchlist";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu: Watchlist");
};

//Menu:export hide dust - done
export const MenuExportHideDust = ({
  session_id,
  email_address
}) => {
  const event_name = "Menu:export hide dust";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Menu:export hide dust");
};



//Topbar sign up - done
export const TopbarSignup = ({
  session_id,
  email_address
}) => {
  const event_name = "Topbar: sign up";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Topbar: sign up");
};


//Topbar sign up - done
export const TopbarSignin = ({
  session_id,
  email_address
}) => {
  const event_name = "Topbar: sign up";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  ////console.log("Topbar: sign up");
};

