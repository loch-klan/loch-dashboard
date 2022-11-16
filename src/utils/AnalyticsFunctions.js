import amplitude from "amplitude-js";

//Api Config
export const initAmplitude = () => {
  amplitude.getInstance().init("4e519c7f9b80c10b4ab865e90879fd2c");
};

// send Aplitude Data
export const sendAmplitudeData = (eventType, eventProperties) => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};



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
  console.log("Test");
};

//1. Landing Page Conversion:preview demo
export const PreviewDemo = ({ session_id }) => {
  const event_name = "Landing Page Conversion:preview demo";
  const eventProperties = {
    "session id": session_id,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:preview demo");
};

//2. Landing Page Conversion:go
export const LPC_Go = ({
  addresses,
  ENS,
  chains_detected_against_them,
  unrecognized_addresses,
  unrecognized_ENS,
}) => {
  const event_name = "Landing Page Conversion:go";
  const eventProperties = {
    addresses: addresses,
    ENS: ENS,
    "chains detected against them": chains_detected_against_them,
    "unrecognized addresses": unrecognized_addresses,
    "unrecognized ENS": unrecognized_ENS,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:go");
};

//3. Landing Page Conversion:privacy message
export const PrivacyMessage = ({ session_id }) => {
  const event_name = "Landing Page Conversion:privacy_message";
  const eventProperties = {
  
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:privacy message");
};

//4. Landing Page Conversion:email address added
export const EmailAddressAdded = ({ session_id, email_address }) => {
  const event_name = "Landing Page Conversion:email address added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:email address added");
};

//5. Landing Page Conversion:email address verified
export const EmailAddressVerified = ({ session_id, email_address }) => {
  const event_name = "Landing Page Conversion:email address verified";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:email address verified");
};

//6. Landing Page Conversion:returning user signed in correctly
export const UserSignedinCorrectly = ({ session_id, email_address }) => {
  const event_name =
    "Landing Page Conversion:returning user signed in correctly";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:returning user signed in correctly");
};

//7. Landing Page Conversion:returning user wrong verification code
export const UserWrongCode = ({ session_id, email_address }) => {
  const event_name =
    "Landing Page Conversion:returning user wrong verification code";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:returning user wrong verification code");
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
  console.log("Landing Page Conversion:time spent on onboarding");
};

//9. Home:manage wallets
export const ManageWallets = ({ session_id, email_address }) => {
  const event_name = "Home:manage wallets";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:manage wallets");
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
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:add wallet_address");
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
  console.log("Home:piechart overview");
};

//12. Home:piechart specific chain name
export const PiechartChainName = ({
  session_id,
  email_address,
  asset_clicked,
}) => {
  const event_name = "Home:piechart specific chain_name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset clicked": asset_clicked,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:piechart specific chain name");
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
  console.log("Home:asset value chart deposits and withdrawals");
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
  console.log("Home:asset value chart crypto asset filter");
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
  console.log("Home:asset value chart fiat currency ");
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
  console.log("Home:asset value chart time period");
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
  console.log("Home:portfolio performance asset filter");
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
  console.log("Home:portfolio performance time period filter");
};

//19. Home:portfolio performance expanded view
export const PortfolioPerformanceEView = ({ session_id, email_address }) => {
  const event_name = "Home:portfolio performance expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:portfolio performance expanded view");
};

//20. Home:transaction history expanded view
export const TransactionHistoryEView = ({ session_id, email_address }) => {
  const event_name = "Home:transaction history expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:transaction history expanded view");
};

//21. Home:transaction history addresses
export const TransactionHistoryAddress = ({
  session_id,
  email_address,
  address_hovered,
}) => {
  const event_name = "Home:transaction history addresses";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "address hovered": address_hovered,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:transaction history addresses");
};

//22. Home:volume traded by counterparty expanded view
export const VolumeTradeByCP = ({ session_id, email_address }) => {
  const event_name = "Home:volume traded by counterparty expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:volume traded by counterparty expanded view");
};

//23. Home:average cost basis expanded view
export const AverageCostBasisEView = ({ session_id, email_address }) => {
  const event_name = "Home:average cost basis expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:average cost basis expanded view");
};

//24. Home:average cost basis specific asset selected
export const AverageCostBasisAsset = ({
  session_id,
  email_address,
  asset_clicked,
}) => {
  const event_name = "Home:average cost basis specific asset selected";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset clicked": asset_clicked,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Home:average cost basis specific asset selected");
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
  console.log("Home:language clicked");
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
  console.log("Home:language changed");
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
  console.log("Home:fiat currency clicked");
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
  console.log("Home:fiat currency changed");
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
  console.log("Home:time spent on home page");
};

//30. Menu:intelligence menu
export const IntelligenceMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:intelligence menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:intelligence menu");
};

//Menu:Home menu
export const HomeMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:Home menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:Home menu");
};

//31. Menu:wallets menu
export const WalletsMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:wallets menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:wallets menu");
};

//32. Menu:costs menu
export const CostsMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:costs menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:costs menu");
};

//33. Menu:profile menu
export const ProfileMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:profile menu";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:profile menu");
};

//34. Menu:export
export const ExportMenu = ({ session_id, email_address }) => {
  const event_name = "Menu:export";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:export");
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
  console.log("Menu:export date range drop down selected");
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
  console.log("Menu:export data downloaded");
};

//37. Menu:api
export const MenuApi = ({ session_id, email_address }) => {
  const event_name = "Menu:api";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:api");
};

//38. Menu:dark mode
export const MenuDarkMode = ({ session_id, email_address }) => {
  const event_name = "Menu:dark mode";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:dark mode");
};

//39. Menu:leave
export const MenuLeave = ({ session_id, email_address }) => {
  const event_name = "Menu:leave";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:leave");
};

//40. Menu:leave: email added
export const LeaveEmailAdded = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: email added";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:leave: email added");
};

//41. Menu:leave: link copied
export const LeaveLinkCopied = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: link copied";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:leave: link copied");
};

//42. Menu:leave: link shared
export const LeaveLinkShared = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: link shared";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:leave: link shared");
};

//43. Menu:leave: privacy message
export const LeavePrivacyMessage = ({ session_id, email_address }) => {
  const event_name = "Menu:leave: privacy message";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Menu:leave: privacy message");
};

//44. Intelligence:transaction history
export const TransactionHistory = ({ session_id, email_address }) => {
  const event_name = "Intelligence:transaction history";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Intelligence:transaction history");
};

//45. Intelligence:traded by counterparty
export const TradeByCounterParty = ({ session_id, email_address }) => {
  const event_name = "Intelligence:traded by counterparty";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Intelligence:traded by counterparty");
};

//46. Intelligence:insights
export const Insights = ({ session_id, email_address }) => {
  const event_name = "Intelligence:insights";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Intelligence:insights");
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
  console.log("Intelligence:portfolio performance asset filter");
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
  console.log("Intelligence:portfolio performance time period filter");
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
  console.log("Intelligence:portfolio performance expanded view");
};

//50. Intelligence:insights view more
export const InsightsViewMore = ({ session_id, email_address }) => {
  const event_name = "Intelligence:insights view more";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Intelligence:insights view more");
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
  console.log("Intelligence:time spent on intelligence page");
};

//52. Intelligence:yield view more
export const YieldViewMore = ({ session_id, email_address }) => {
  const event_name = "Intelligence:yield view more";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Intelligence:yield view more");
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
  console.log("Wallets:add wallet");
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
  console.log("Wallets:filter based on assets");
};

//55. Wallets:sort by amount
export const SortByAmount = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:sort by amount");
};

//56. Wallets:sort by date
export const SortByDate = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by date";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:sort by date");
};

//57. Wallets:sort by name
export const SortByName = ({ session_id, email_address }) => {
  const event_name = "Wallets:sort by name";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:sort by name");
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
  console.log("Wallets:edit specific wallet");
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
  console.log("Wallets:add name tag");
};


//60. Wallets:fix undetected wallet
export const FixUndetectedWallet = ({ session_id, email_address, wallet_type_selected, name_tag, address, ENS,blockchains_detected }) => {
  const event_name = "Wallets:fix undetected wallet";
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
  console.log("Wallets:fix undetected wallet");
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
  console.log("Wallets:add wallet type for unrecognized wallet");
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
  console.log("Wallets:add chain type for unrecognized wallet");
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
  console.log("Wallets:delete wallet");
};


//64. Wallets:Clicked done after fixing connection
export const DoneFixingConnection = ({ session_id, email_address}) => {
  const event_name = "Wallets:Clicked done after fixing connection";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:Clicked done after fixing connection");
};

//65. Wallets:hover for anonymity for wallet connection
export const AnonymityWalletConnection = ({ session_id, email_address}) => {
  const event_name = "Wallets:hover for anonymity for wallet connection";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:hover for anonymity for wallet connection");
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
  console.log("Wallets:time spent on wallet page");
};

//67. Wallets:analyze asset values for specific wallet
export const AnalyzeAssetValue = ({ session_id, email_address, address_selected, name_tag, ENS, blockchains, assets}) => {
  const event_name = "Wallets:analyze asset values for specific wallet";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "address selected": address_selected,
    "name tag":name_tag,
    "ENS":ENS,
    "blockchains":blockchains,
    "assets": assets
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Wallets:analyze asset values for specific wallet");
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
  console.log("Costs:time spent on cost page");
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
  console.log("Costs:blockchain fees asset filter");
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
  console.log("Costs:blockchain fees time period filter");
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
  console.log("Costs:blockchain fees specific bar");
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
  console.log("Costs:counterparty fees asset filter");
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
  console.log("Costs:counterparty fees time period filter");
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
  console.log("Costs:counterparty fees specific bar");
}


//75. Costs:average cost basis expanded view
export const CAverageCostBasis = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis expanded view";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis expanded view");
}


//76. Costs:average cost basis specific asset selected
export const CAverageCostBasisSpecific = ({ session_id, email_address,asset_selected}) => {
  const event_name = "Costs:average cost basis specific asset selected";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address,
    "asset selected":asset_selected
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis specific asset selected");
}


//77. Costs:average cost basis: sort by asset
export const CostSortByAsset = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by asset";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by asset");
}

//78. Costs:average cost basis: sort by average cost price
export const CostSortByCostPrice = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by average cost price";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by average cost price");
}

//79. Costs:average cost basis: sort by current price
export const CostSortByCurrentPrice = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by current price";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by current price");
}

//80. Costs:average cost basis: sort by amount
export const CostSortByAmount = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by amount";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by amount");
}

//81. Costs:average cost basis: sort by cost basis
export const SortByCostBasis = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by cost basis";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by cost basis");
}

//82. Costs:average cost basis: sort by current value
export const SortByCurrentValue = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by current value";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by current value");
}

//83. Costs:average cost basis: sort by % gain / loss
export const SortByGainLoss = ({ session_id, email_address}) => {
  const event_name = "Costs:average cost basis: sort by % gain / loss";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Costs:average cost basis: sort by % gain / loss");
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
  console.log("Profile:first name added");
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
  console.log("Profile:last name added");
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
  console.log("Profile:email added");
}

//87. Profile:mobile number added
export const MobileNumberAdded = ({ session_id, phone_number}) => {
  const event_name = "Profile:mobile number added";
  const eventProperties = {
    "session id": session_id,
    "phone number": phone_number
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Profile:mobile number added");
}

//88. Profile:language changed
export const LanguageChanged = ({ session_id, language }) => {
  const event_name = "Profile:language changed";
  const eventProperties = {
    "session id": session_id,
    language: language,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Profile:language changed");
};

//89. Profile:fiat currency changed
export const CurrencyChanged = ({ session_id, currency }) => {
  const event_name = "Profile:fiat currency changed";
  const eventProperties = {
    "session id": session_id,
    currency: currency,
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Profile:fiat currency changed");
};

//90. Profile:saved
export const ProfileSaved = ({ session_id, email_address }) => {
  const event_name = "Profile:saved";
  const eventProperties = {
    "session id": session_id,
    "email address": email_address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Profile:saved");
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
  console.log("Landing Page Conversion:WalletAddressTextbox");
};


//92. Landing Page Conversion:deleted wallet address
export const DeleteWalletAddress = ({ session_id, address}) => {
  const event_name = "Landing Page Conversion:deleted wallet address";
  const eventProperties = {
    "session id": session_id,
    "address": address
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:deleted wallet address");
};

//93. Landing Page Conversion:add textbox
export const AddTextbox = ({ session_id}) => {
  const event_name = "Landing Page Conversion:add textbox";
  const eventProperties = {
    "session id": session_id
  };
  sendAmplitudeData(event_name, eventProperties);
  console.log("Landing Page Conversion:add textbox");
};