import React from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import { connect } from "react-redux";
import { getWatchListByUser } from "../watchlist/redux/WatchListApi";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_TEXT,
  SORT_BY_AMOUNT,
  BASE_URL_S3,
  SORT_BY_ACCOUNT,
  SORT_BY_LARGEST_BOUGHT,
  SORT_BY_LARGEST_SOLD,
  SORT_BY_NET_FLOW,
  SEARCH_BY_NETWORTH,
} from "../../utils/Constant";
import {
  searchTransactionApi,
  getFilters,
  getTransactionAsset,
} from "../intelligence/Api";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
import {
  amountFormat,
  CurrencyType,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import {
  GetAllPlan,
  TopsetPageFlagDefault,
  getAllCurrencyRatesApi,
  getUser,
  setPageFlagDefault,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import TransactionTable from "../intelligence/TransactionTable";
import { getTopAccounts } from "./Api";
import DropDown from "../common/DropDown";
import { SORT_BY_NAME } from "../../utils/Constant";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { TimeFilterType } from "../../utils/Constant";
import {
  TopAccountAddAccountToWatchList,
  TopAccountClickedAccount,
  TopAccountInflowHover,
  TopAccountNameHover,
  TopAccountNetflowHover,
  TopAccountNetworthFilter,
  TopAccountOutflowHover,
  TopAccountPageNext,
  TopAccountPagePrev,
  TopAccountPageSearch,
  TopAccountPageView,
  TopAccountRemoveAccountFromWatchList,
  TopAccountSearch,
  TopAccountShare,
  TopAccountSortByNetWorth,
  TopAccountSortByNetflows,
  TopAccountSortByTag,
  TopAccountTimeFilter,
  TopAccountTimeSpent,
} from "../../utils/AnalyticsFunctions";
import CheckboxCustomTable from "../common/customCheckboxTable";
import {
  updateAddToWatchList,
  removeFromWatchList,
} from "../watchlist/redux/WatchListApi";
class TopAccountPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");

    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      accountInWatchList: [],
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_AMOUNT, value: false }],
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      delayTimer: 0,
      condition: [],
      tableLoading: true,
      tableSortOpt: [
        {
          title: "account",
          up: false,
        },
        {
          title: "networth",
          up: false,
        },
        {
          title: "netflows",
          up: true,
        },
        {
          title: "largestbought",
          up: true,
        },
        {
          title: "largestsold",
          up: true,
        },
        {
          title: "tagName",
          up: true,
        },
      ],
      showDust: false,
      // add new wallet
      // userWalletList: localStorage.getItem("addWallet")
      //   ? JSON.parse(localStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      accountList: [],
      totalPage: 0,
      timeFIlter: "Time",
      AssetList: [],
      startTime: "",

      // this is used in chain detect api to check it call from top accout or not
      topAccountPage: true,
      walletInput: [JSON.parse(localStorage.getItem("previewAddress"))],
      goToBottom: false,
    };
    this.delayTimer = 0;
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    TopAccountPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopAccountTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    // localStorage.setItem("previewAddress", "");
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.props.getAllCoins();
    this.props.getAllParentChains();
    this.callApi(this.state.currentPage || START_INDEX);
    this.assetList();
    GetAllPlan();
    getUser();
    this.startPageView();
    this.updateTimer(true);
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topAccountPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topAccountPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopAccountTimer);
    localStorage.removeItem("topAccountPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TopAccountTimeSpent({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("topAccountPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("topAccountPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  assetList = () => {
    let data = new URLSearchParams();
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this);
  };

  callApi = (page = START_INDEX) => {
    this.props.getWatchListByUser();
    this.setState({ tableLoading: true });
    setTimeout(() => {
      let data = new URLSearchParams();
      data.append("start", page * API_LIMIT);
      data.append("conditions", JSON.stringify(this.state.condition));
      data.append("limit", API_LIMIT);
      data.append("sorts", JSON.stringify(this.state.sort));
      getTopAccounts(data, this);
    }, 300);
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.tableLoading !== this.state.tableLoading &&
      this.state.goToBottom &&
      !this.state.tableLoading
    ) {
      this.setState(
        {
          goToBottom: false,
        },
        () => {
          window.scroll(0, document.body.scrollHeight);
        }
      );
    }
    // chain detection
    // if (prevState?.walletInput !== this.state.walletInput) {
    // }
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);
    if (!this.state.currency) {
      this.setState({
        currency: JSON.parse(localStorage.getItem("currency")),
      });
      getAllCurrencyRatesApi();
    }
    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      this.callApi(page);
      this.setState({
        currentPage: page,
      });
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          TopAccountPagePrev({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          TopAccountPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
          });
          this.updateTimer();
        } else {
          TopAccountPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
          });
          this.updateTimer();
        }
      }
    }

    if (
      this.props.TopAccountsInWatchListState !==
      prevProps.TopAccountsInWatchListState
    ) {
      const tempList = this.props.TopAccountsInWatchListState;
      if (tempList) {
        this.setState({
          accountInWatchList: tempList,
        });
      }
    }
  }

  onValidSubmit = () => {};

  addCondition = (key, value) => {
    let networthList = {
      // "AllNetworth": "All",
      "0-1": "less 1m",
      "1-10": "1m-10m",
      "10-100": "10m-100m",
      "100-1000": "100m- 1b",
      "1000-1000000": "more than 1b",
    };
    if (key === SEARCH_BY_NETWORTH) {
      let selectedValue =
        value === "AllNetworth" ? "All" : value?.map((e) => networthList[e]);

      TopAccountNetworthFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedValue,
      });
      this.updateTimer();
    }
    let index = this.state.condition.findIndex((e) => e.key === key);
    let arr = [...this.state.condition];
    let search_index = this.state.condition.findIndex(
      (e) => e.key === SEARCH_BY_TEXT
    );
    if (
      index !== -1 &&
      value !== "allchain" &&
      value !== "AllNetworth" &&
      value !== "Allasset" &&
      value !== "Time" &&
      value !== 1825
    ) {
      arr[index].value = value;
    } else if (
      value === "allchain" ||
      value === "AllNetworth" ||
      value === "Allasset" ||
      value === "Time" ||
      value === 1825
    ) {
      if (index !== -1) {
        arr.splice(index, 1);
      }
    } else {
      let obj = {};
      obj = {
        key: key,
        value: value,
      };
      arr.push(obj);
    }
    if (search_index !== -1) {
      if (value === "" && key === SEARCH_BY_TEXT) {
        arr.splice(search_index, 1);
      }
    }
    // On Filter start from page 0
    this.props.history.replace({
      search: `?p=${START_INDEX}`,
    });
    this.setState({
      condition: arr,
    });
  };
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);

      TopAccountSearch({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        search: this.state.search,
      });
      this.updateTimer();
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  handleSort = (val) => {
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort?.map((el) => {
      if (el.title === val) {
        if (val === "account") {
          obj = [
            {
              key: SORT_BY_ACCOUNT,
              value: !el.up,
            },
          ];
        } else if (val === "networth") {
          obj = [
            {
              key: SORT_BY_AMOUNT,
              value: !el.up,
            },
          ];
          TopAccountSortByNetWorth({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "netflows") {
          obj = [
            {
              key: SORT_BY_NET_FLOW,
              value: !el.up,
            },
          ];
          let time = TimeFilterType.getText(
            this.state.timeFIlter === "Time"
              ? "6 months"
              : this.state.timeFIlter
          );
          this.addCondition("SEARCH_BY_TIMESTAMP", time);
          TopAccountSortByNetflows({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "largestbought") {
          obj = [
            {
              key: SORT_BY_LARGEST_BOUGHT,
              value: !el.up,
            },
          ];
        } else if (val === "largestsold") {
          obj = [
            {
              key: SORT_BY_LARGEST_SOLD,
              value: !el.up,
            },
          ];
        } else if (val === "tagName") {
          obj = [
            {
              key: SORT_BY_NAME,
              value: !el.up,
            },
          ];

          TopAccountSortByTag({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };

  TruncateText = (string) => {
    return (
      string.substring(0, 3) +
      "..." +
      string.substring(string.length - 3, string.length)
    );
  };

  handleTime = (e) => {
    let title = e.split(" ")[1];
    if (e.split(" ")[2] !== undefined) {
      title = title + " " + e.split(" ")[2];
    }
    if (e.split(" ")[3] !== "undefined") {
      title = title + " " + e.split(" ")[3];
    }
    this.setState({
      timeFIlter: title,
    });

    TopAccountTimeFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      selected: title,
    });
    this.updateTimer();
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=top-accounts";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    TopAccountShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  handleAddRemoveFromWatchList = (walletAddress, addItem, tagName) => {
    let tempWatchListata = new URLSearchParams();
    if (addItem) {
      TopAccountAddAccountToWatchList({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: tagName ? tagName : walletAddress,
      });
      this.updateTimer();
      tempWatchListata.append("wallet_address", walletAddress);
      tempWatchListata.append("analysed", false);
      tempWatchListata.append("remarks", "");
      tempWatchListata.append("name_tag", tagName);
      this.props.updateAddToWatchList(tempWatchListata);
    } else {
      TopAccountRemoveAccountFromWatchList({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: tagName ? tagName : walletAddress,
      });
      this.updateTimer();
      tempWatchListata.append("address", walletAddress);
      this.props.removeFromWatchList(tempWatchListata);
    }
  };
  render() {
    let chainList = this.props.OnboardingState?.coinsList
      ?.filter((e) => ["Ethereum", "Polygon", "Avalanche"].includes(e.name))
      ?.map((e) => ({
        value: e.id,
        label: e.name,
      }));

    let assetList = this.state?.AssetList?.filter((e) =>
      ["Ethereum", "Polygon", "Avalanche"].includes(e.label)
    );

    const tableData = this.state.accountList;
    // const tableData = [
    //   {
    //     account: "vitalik.eth",
    //     networth: 2444440,
    //     netflows: 37344,
    //     largestBought: [
    //       {
    //         name: "ETH 1",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 2",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 3",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //     ],
    //     largestSold: [
    //       {
    //         name: "ETH 1",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 2",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 3",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //     ],
    //   },
    // ];
    const inflowOutflowTimePeriod = () => {
      if (this.state.timeFIlter === "2 weeks") {
        return "2 weeks";
      } else if (this.state.timeFIlter === "1 month") {
        return "last month";
      } else if (this.state.timeFIlter === "5 years") {
        return "5 years";
      } else if (this.state.timeFIlter === "1 year") {
        return "last year";
      } else if (this.state.timeFIlter === "3 years") {
        return "3 years";
      }
      return "6 months";
    };
    const columnList = [
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Account
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "account",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={rowData.account}
              // >
              //   <div className="inter-display-medium f-s-13 lh-16 grey-313">

              //   </div>
              // </CustomOverlay>
              <span
                onClick={() => {
                  resetPreviewAddress();
                  TopAccountClickedAccount({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    account: rowData.account ? rowData.account : "",
                    name_tag: rowData.tagName ? rowData.tagName : "",
                  });
                  this.updateTimer();
                  let obj = JSON.parse(localStorage.getItem("previewAddress"));
                  localStorage.setItem(
                    "previewAddress",
                    JSON.stringify({
                      ...obj,
                      address: rowData.account,
                      nameTag: rowData.tagName ? rowData.tagName : "",
                    })
                  );
                  localStorage.setItem(
                    "previewAddressGoToWhaleWatch",
                    JSON.stringify({
                      goToWhaleWatch: false,
                    })
                  );
                  this.props?.TopsetPageFlagDefault();

                  // this.getCoinBasedOnWalletAddress(rowData.account);
                  this.props.history.push("/top-accounts/home");
                }}
                // style={{ textDecoration: "underline", cursor: "pointer" }}
                className="top-account-address"
              >
                {this.TruncateText(rowData.account)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="tagName"
            onClick={() => this.handleSort(this.state.tableSortOpt[5].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Name tag
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tagName",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tagName") {
            return rowData.tagName ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.tagName}
              >
                <span
                  onMouseEnter={() => {
                    TopAccountNameHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: rowData.tagName,
                    });
                    this.updateTimer();
                  }}
                >
                  {rowData.tagName}
                </span>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="networth"
            onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net worth{" (" + CurrencyType(false) + ")"}
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "networth",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "networth") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(
                  rowData.networth * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {numToCurrency(
                        rowData.networth * this.state.currency?.rate
                      )}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="netflows"
            onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net flows {"(" + CurrencyType(false) + ")"}
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "netflows",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "netflows") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "6 months"
                : this.state.timeFIlter
            );
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(
                  rowData.netflows[type] * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss ${
                      rowData.netflows[type] < 0
                        ? "loss"
                        : rowData.netflows[type] === 0
                        ? "cost-common"
                        : "gain"
                    }`}
                    onMouseEnter={() => {
                      TopAccountNetflowHover({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        hover: amountFormat(
                          rowData.netflows[type] * this.state.currency?.rate,
                          "en-US",
                          "USD"
                        ),
                      });
                      this.updateTimer();
                    }}
                  >
                    <Image
                      src={rowData.netflows[type] < 0 ? LossIcon : GainIcon}
                    />
                    <span className="inter-display-medium f-s-13 lh-16 grey-313 ml-2">
                      {(rowData.netflows[type] < 0 ? "-" : "") +
                        numToCurrency(
                          rowData.netflows[type] * this.state.currency?.rate
                        )}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="largestBought"
            // onClick={() => this.handleSort(this.state.tableSortOpt[3].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              <div>Largest inflows</div>
              <div>{inflowOutflowTimePeriod()}</div>
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "largestBought",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "largestBought") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "6 months"
                : this.state.timeFIlter
            );
            let text = "";
            rowData?.largestBought[type]?.map((e, i) => {
              text =
                text +
                e[0] +
                (rowData?.largestBought[type]?.length - 1 === i ? "" : ", ");
            });

            return rowData?.largestBought[type].length !== 0 ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={text}
              >
                {/* <div className="">imgs</div> */}
                <div
                  className="overlap-img-topAccount"
                  onMouseEnter={() => {
                    TopAccountInflowHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: text,
                    });
                    this.updateTimer();
                  }}
                >
                  {rowData?.largestBought[type]?.map((e, i) => {
                    return (
                      <Image
                        src={e[1]}
                        style={{
                          zIndex: i,
                          marginLeft: i === 0 ? "0" : "-1rem",
                          // border: "1px solid #737373",
                          // backgroundColor: "#ffffff",
                          // padding: "0.3rem",
                          // border: `1px solid ${lightenDarkenColor(
                          //   e.colorCode,
                          //   -0.15
                          // )} `,
                        }}
                      />
                    );
                  })}
                </div>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="largestSold"
            // onClick={() => this.handleSort(this.state.tableSortOpt[4].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              <div>Largest outflows</div>
              <div>{inflowOutflowTimePeriod()}</div>
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "largestSold",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "largestSold") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "6 months"
                : this.state.timeFIlter
            );
            let text = "";
            rowData?.largestSold[type]?.map((e, i) => {
              text =
                text +
                e[0] +
                (rowData?.largestSold[type]?.length - 1 === i ? "" : ", ");
            });

            return rowData?.largestSold[type]?.length !== 0 ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={text}
              >
                {/* <div className="">imgs</div> */}
                <div
                  className="overlap-img-topAccount"
                  onMouseEnter={() => {
                    TopAccountOutflowHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: text,
                    });
                    this.updateTimer();
                  }}
                >
                  {rowData?.largestSold[type]?.map((e, i) => {
                    return (
                      <Image
                        src={e[1]}
                        style={{
                          zIndex: i,
                          marginLeft: i === 0 ? "0" : "-1rem",
                          // border: `1px solid ${lightenDarkenColor(
                          //   e.colorCode,
                          //   -0.15
                          // )} `,
                        }}
                      />
                    );
                  })}
                </div>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="isAddedToWatchList"
            // onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Watchlist
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "isAddedToWatchList",
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "isAddedToWatchList") {
            const handleOnClick = (addItem) => {
              this.handleAddRemoveFromWatchList(
                rowData.account,
                addItem,
                rowData.tagName
              );
            };
            return (
              <CheckboxCustomTable
                handleOnClick={handleOnClick}
                isChecked={this.state.accountInWatchList.includes(
                  rowData.account
                )}
              />
            );
          }
        },
      },

      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="Gain loss"
      //       onClick={() => this.handleSort(this.state.sortBy[6])}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         % Gain / Loss
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           this.state.sortBy[6].down ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "GainLoss",
      //   // coumnWidth: 128,
      //   coumnWidth: 0.25,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "GainLoss") {
      //       return (
      //         <div
      //           className={`gainLoss ${
      //             rowData.GainLoss < 0 ? "loss" : "gain"
      //           }`}
      //         >
      //           <Image src={rowData.GainLoss < 0 ? LossIcon : GainIcon} />
      //           <div className="inter-display-medium f-s-13 lh-16 grey-313">
      //             {rowData.GainLoss.toFixed(2) + "%"}
      //           </div>
      //         </div>
      //       );
      //     }
      //   },
      // },
    ];

    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                hideButton={true}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
                onHide={this.handleAddModal}
                modalIcon={AddWalletModalIcon}
                title="Add wallet address"
                subtitle="Add more wallet address here"
                modalType="addwallet"
                btnStatus={false}
                btnText="Go"
                history={this.props.history}
                changeWalletList={this.handleChangeList}
                apiResponse={(e) => this.CheckApiResponse(e)}
                from="transaction history"
              />
            )}
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={localStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
              />
            )}
            <PageHeader
              title={"Leaderboard"}
              subTitle={"Analyze the top accounts here"}
              // showpath={true}
              // currentPage={"transaction-history"}
              history={this.props.history}
              topaccount={true}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              handleShare={this.handleShare}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    {/* <CustomDropdown
                    filtername="Time"
                    options={[
                      { value: "alltime", label: "All time" },
                      { value: "1week", label: "1 week" },
                      { value: "1month", label: "1 month" },
                      { value: "6months", label: "6 months" },
                      { value: "1year", label: "1 year" },
                      { value: "5years", label: "5 years" },
                    ]}
                    action={SEARCH_BY_TIMESTAMP_IN}
                    handleClick={(key, value) => this.addCondition(key, value)}
                    isTopaccount={true}
                  /> */}
                    <DropDown
                      class="cohort-dropdown"
                      list={[
                        // "All time",
                        "2 weeks",
                        "1 month",
                        "6 months",
                        "1 year",
                        "3 years",
                        "5 years",
                      ]}
                      onSelect={this.handleTime}
                      title={this.state.timeFIlter}
                      activetab={
                        this.state.timeFIlter === "Time"
                          ? "6 months"
                          : this.state.timeFIlter
                      }
                      showChecked={true}
                      customArrow={true}
                      relative={true}
                    />
                  </div>
                  {/* <div style={{ width: "25%" }}>
                    <CustomDropdown
                      filtername="Chains"
                      options={[
                        ...[{ value: "allchain", label: "All chains" }],
                        ...chainList,
                      ]}
                      action={"SEARCH_BY_CHAIN_IN"}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      isTopaccount={true}
                    />
                  </div> */}
                  <div style={{ width: "30%" }}>
                    <CustomDropdown
                      filtername="Net worth"
                      options={[
                        { value: "AllNetworth", label: "All" },
                        { value: "0-1", label: "less 1m" },
                        { value: "1-10", label: "1m-10m" },
                        { value: "10-100", label: "10m-100m" },
                        { value: "100-1000", label: "100m-1b" },
                        { value: "1000-1000000", label: "more than 1b" },
                      ]}
                      action={SEARCH_BY_NETWORTH}
                      handleClick={(key, value) => {
                        this.addCondition(key, value);
                      }}
                      isTopaccount={true}
                    />
                  </div>
                  {/* <div style={{ width: "20%" }}>
                  <CustomDropdown
                    filtername="Assets"
                    options={[
                      ...[{ value: "Allasset", label: "All assets" }],
                      ...assetList,
                    ]}
                    action={"SEARCH_BY_ASSETS_IN"}
                    handleClick={(key, value) => this.addCondition(key, value)}
                    isTopaccount={true}
                  />
                </div> */}
                  {/* {fillter_tabs} */}
                  <div style={{ width: "50%" }}>
                    <div className="searchBar top-account-search">
                      <Image src={searchIcon} className="search-icon" />
                      <FormElement
                        valueLink={this.linkState(
                          this,
                          "search",
                          this.onChangeMethod
                        )}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Search",
                          },
                        }}
                        classes={{
                          inputField: "search-input",
                          prefix: "search-prefix",
                          suffix: "search-suffix",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <div className="transaction-history-table">
              {this.state.tableLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "69rem",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <>
                  <TransactionTable
                    tableData={tableData}
                    columnList={columnList}
                    message={"No accounts found"}
                    totalPage={this.state.totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage}
                    tableLoading={this.state.tableLoading}
                    onPageChange={this.onPageChange}
                    addWatermark
                  />
                  {/* <div className="ShowDust">
                  <p
                    onClick={this.showDust}
                    className="inter-display-medium f-s-16 lh-19 cp grey-ADA"
                  >
                    {this.state.showDust
                      ? "Reveal dust (less than $1)"
                      : "Hide dust (less than $1)"}
                  </p>
                </div> */}
                </>
              )}
            </div>
            {/* <FeedbackForm page={"Transaction History Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // portfolioState: state.PortfolioState,
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,
  TopAccountsInWatchListState: state.TopAccountsInWatchListState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  // getCoinRate,

  getAllCoins,
  getFilters,
  setPageFlagDefault,
  TopsetPageFlagDefault,
  getAllParentChains,
  getWatchListByUser,
  removeFromWatchList,
  updateAddToWatchList,
};

TopAccountPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(TopAccountPage);
