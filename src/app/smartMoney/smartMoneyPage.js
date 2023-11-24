import React from "react";
import { Button, Image } from "react-bootstrap";

import { connect } from "react-redux";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  Method,
  API_LIMIT,
  START_INDEX,
  SORT_BY_AMOUNT,
  BASE_URL_S3,
} from "../../utils/Constant";
import { searchTransactionApi, getFilters } from "../intelligence/Api";
import { BaseReactComponent } from "../../utils/form";
import ConformSmartMoneyLeaveModal from "./ConformSmartMoneyLeaveModal";
import {
  amountFormat,
  CurrencyType,
  mobileCheck,
  noExponents,
  numToCurrency,
  TruncateText,
} from "../../utils/ReusableFunctions";
import { deleteToken, getCurrentUser } from "../../utils/ManageToken";
import Loading from "../common/Loading";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import {
  GetAllPlan,
  TopsetPageFlagDefault,
  getAllCurrencyRatesApi,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import TransactionTable from "../intelligence/TransactionTable";
import { createAnonymousUserSmartMoneyApi, getSmartMoney } from "./Api";

import {
  SmartMoneyChangeLimit,
  SmartMoneyFAQClicked,
  SmartMoneyHowItWorksClicked,
  SmartMoneyNameTagHover,
  SmartMoneyRealizedPNLHover,
  SmartMoneyNetWorthHover,
  SmartMoneyPageNext,
  SmartMoneyPagePrev,
  SmartMoneyPageSearch,
  SmartMoneyPageView,
  SmartMoneyUnrealizedPNLHover,
  SmartMoneyTimeSpent,
  SmartMoneyWalletClicked,
  resetUser,
} from "../../utils/AnalyticsFunctions";
import {
  updateAddToWatchList,
  removeFromWatchList,
} from "../watchlist/redux/WatchListApi";
import SmartMoneyHeader from "./smartMoneyHeader";
import "./_smartMoney.scss";
import SmartMoneyMobilePage from "./SmartMoneyMobileBlocks/smartMoneyMobilePage.js";

import AddSmartMoneyAddressesModal from "./addSmartMoneyAddressesModal.js";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
} from "../../assets/images/icons/index.js";
import MobileDevice from "../common/mobileDevice.js";
import SmartMoneyFaqModal from "./smartMoneyFaqModal.js";
import SmartMoneyHowItWorksModal from "./smartMoneyHowItWorksModal.js";
import AuthSmartMoneyModal from "./AuthSmartMoneyModal.js";
import ExitSmartMoneyOverlay from "./ExitSmartMoneyOverlay.js";

class SmartMoneyPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");

    this.state = {
      signInModalAnimation: true,
      signInModal: false,
      signUpModal: false,
      faqModal: false,
      howItWorksModal: false,
      showSignOutModal: false,
      showWithLogin: false,
      blurTable: true,
      addSmartMoneyAddressModal: false,
      pageLimit: 1,
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
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
          up: true,
        },
        {
          title: "netflows",
          up: false,
        },
        {
          title: "largestbought",
          up: false,
        },
        {
          title: "largestsold",
          up: false,
        },
        {
          title: "tagName",
          up: false,
        },
      ],
      showDust: false,
      // add new wallet
      // userWalletList: window.sessionStorage.getItem("addWallet")
      //   ? JSON.parse(window.sessionStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      userPlan:
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      accountList: [],
      totalPage: 0,
      timeFIlter: "Time",
      startTime: "",

      // this is used in chain detect api to check it call from top accout or not
      topAccountPage: true,
      walletInput: [
        JSON.parse(window.sessionStorage.getItem("previewAddress")),
      ],
      goToBottom: false,
    };
    this.delayTimer = 0;
  }
  handleSignUpRedirection = () => {
    resetUser();
    setTimeout(function () {
      this.props.history.push("/smart-money");
    }, 3000);
  };
  showSignInModal = () => {
    this.setState({
      signInModal: true,
      signUpModal: false,
    });
  };
  hideSignInSignUpModal = () => {
    this.setState({
      signInModalAnimation: true,
      signInModal: false,
      signUpModal: false,
    });
  };
  openSignUpModal = () => {
    this.setState({
      signInModalAnimation: false,
      signInModal: false,
      signUpModal: true,
    });
    // setSignInModalAnimation(false);
    // setSigninModal(false);
    // setSignupModal(true);
    // SignupMenu({
    //   session_id: getCurrentUser().id,
    // });
  };

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });
  };

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    SmartMoneyPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: mobileCheck(),
    });
    // Inactivity Check
    window.checkSmartMoneyTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  changePageLimit = (dropdownResponse) => {
    const tempHolder = dropdownResponse.split(" ");
    if (tempHolder && tempHolder.length > 1) {
      const params = new URLSearchParams(this.props.location.search);
      params.set("p", 0);
      if (this.props.history) {
        this.props.history.push(
          `${this.props.history.location.pathname}?${params}`
        );
      }
      SmartMoneyChangeLimit({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        wallet: tempHolder[1],
      });
      this.setState({
        pageLimit: tempHolder[1],
      });
    }
  };
  createEmptyUser = () => {
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    this.props.createAnonymousUserSmartMoneyApi(data);
  };
  componentDidMount() {
    let token = window.sessionStorage.getItem("lochToken");
    let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (token && lochUser && lochUser.email) {
      this.setState({
        blurTable: false,
      });
    } else {
      this.setState({
        blurTable: true,
      });
    }
    this.createEmptyUser();
    if (API_LIMIT) {
      if (mobileCheck()) {
        this.setState({
          pageLimit: 5,
        });
      } else {
        this.setState({
          pageLimit: API_LIMIT,
        });
      }
    }
    // window.sessionStorage.setItem("previewAddress", "");
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.props.getAllCoins();
    this.props.getAllParentChains();
    this.callApi(this.state.currentPage || START_INDEX);

    this.props.GetAllPlan();

    this.startPageView();
    this.updateTimer(true);
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("smartMoneyPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkSmartMoneyTimer);
    window.sessionStorage.removeItem("smartMoneyPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      SmartMoneyTimeSpent({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        isMobile: mobileCheck(),
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    setTimeout(() => {
      let data = new URLSearchParams();
      data.append("start", page * this.state.pageLimit);
      data.append("conditions", JSON.stringify(this.state.condition));
      data.append("limit", this.state.pageLimit);
      data.append("sorts", JSON.stringify(this.state.sort));
      this.props.getSmartMoney(data, this, this.state.pageLimit);
    }, 300);
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.commonState.smart_money) {
      let token = window.sessionStorage.getItem("lochToken");
      this.props.updateWalletListFlag("smart_money", true);
      let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (token && lochUser && lochUser.email) {
        this.setState({
          blurTable: false,
        });
      } else {
        this.setState({
          blurTable: true,
        });
      }
    }
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
        currency: JSON.parse(window.sessionStorage.getItem("currency")),
      });
      getAllCurrencyRatesApi();
    }
    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort ||
      prevState.pageLimit !== this.state.pageLimit
    ) {
      this.callApi(page);
      this.setState({
        currentPage: page,
      });
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          SmartMoneyPagePrev({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
            isMobile: mobileCheck(),
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          SmartMoneyPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
            isMobile: mobileCheck(),
          });
          this.updateTimer();
        } else {
          SmartMoneyPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
            isMobile: mobileCheck(),
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

  // addCondition = (key, value) => {
  //   let networthList = {
  //     // "AllNetworth": "All",
  //     "0-1": "less 1m",
  //     "1-10": "1m-10m",
  //     "10-100": "10m-100m",
  //     "100-1000": "100m- 1b",
  //     "1000-1000000": "more than 1b",
  //   };
  //   if (key === SEARCH_BY_NETWORTH) {
  //     let selectedValue =
  //       value === "AllNetworth" ? "All" : value?.map((e) => networthList[e]);

  //     TopAccountNetworthFilter({
  //       session_id: getCurrentUser().id,
  //       email_address: getCurrentUser().email,
  //       selected: selectedValue,
  //     });
  //     this.updateTimer();
  //   }
  //   let index = this.state.condition.findIndex((e) => e.key === key);
  //   let arr = [...this.state.condition];
  //   let search_index = this.state.condition.findIndex(
  //     (e) => e.key === SEARCH_BY_TEXT
  //   );
  //   if (
  //     index !== -1 &&
  //     value !== "allchain" &&
  //     value !== "AllNetworth" &&
  //     value !== "Allasset" &&
  //     value !== "Time" &&
  //     value !== 1825
  //   ) {
  //     arr[index].value = value;
  //   } else if (
  //     value === "allchain" ||
  //     value === "AllNetworth" ||
  //     value === "Allasset" ||
  //     value === "Time" ||
  //     value === 1825
  //   ) {
  //     if (index !== -1) {
  //       arr.splice(index, 1);
  //     }
  //   } else {
  //     let obj = {};
  //     obj = {
  //       key: key,
  //       value: value,
  //     };
  //     arr.push(obj);
  //   }
  //   if (search_index !== -1) {
  //     if (value === "" && key === SEARCH_BY_TEXT) {
  //       arr.splice(search_index, 1);
  //     }
  //   }
  //   // On Filter start from page 0
  //   this.props.history.replace({
  //     search: `?p=${START_INDEX}`,
  //   });
  //   this.setState({
  //     condition: arr,
  //   });
  // };
  // onChangeMethod = () => {
  //   clearTimeout(this.delayTimer);
  //   this.delayTimer = setTimeout(() => {
  //     this.addCondition(SEARCH_BY_TEXT, this.state.search);

  //     TopAccountSearch({
  //       session_id: getCurrentUser().id,
  //       email_address: getCurrentUser().email,
  //       search: this.state.search,
  //     });
  //     this.updateTimer();
  //   }, 1000);
  // };
  // handleSort = (val) => {
  //   let sort = [...this.state.tableSortOpt];
  //   let obj = [];
  //   sort?.map((el) => {
  //     if (el.title === val) {
  //       if (val === "account") {
  //         obj = [
  //           {
  //             key: SORT_BY_ACCOUNT,
  //             value: !el.up,
  //           },
  //         ];
  //       } else if (val === "networth") {
  //         obj = [
  //           {
  //             key: SORT_BY_AMOUNT,
  //             value: !el.up,
  //           },
  //         ];
  //         TopAccountSortByNetWorth({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "netflows") {
  //         obj = [
  //           {
  //             key: SORT_BY_NET_FLOW,
  //             value: !el.up,
  //           },
  //         ];
  //         let time = TimeFilterType.getText(
  //           this.state.timeFIlter === "Time"
  //             ? "6 months"
  //             : this.state.timeFIlter
  //         );
  //         this.addCondition("SEARCH_BY_TIMESTAMP", time);
  //         TopAccountSortByNetflows({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "largestbought") {
  //         obj = [
  //           {
  //             key: SORT_BY_LARGEST_BOUGHT,
  //             value: !el.up,
  //           },
  //         ];
  //       } else if (val === "largestsold") {
  //         obj = [
  //           {
  //             key: SORT_BY_LARGEST_SOLD,
  //             value: !el.up,
  //           },
  //         ];
  //       } else if (val === "tagName") {
  //         obj = [
  //           {
  //             key: SORT_BY_NAME,
  //             value: !el.up,
  //           },
  //         ];

  //         TopAccountSortByTag({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       }
  //       el.up = !el.up;
  //     } else {
  //       el.up = false;
  //     }
  //   });
  //   if (obj && obj.length > 0) {
  //     obj = [{ key: obj[0].key, value: !obj[0].value }];
  //   }
  //   this.setState({
  //     sort: obj,
  //     tableSortOpt: sort,
  //   });
  // };

  handleAddModal = () => {};

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
  };
  showAddSmartMoneyAddresses = () => {
    this.setState({
      addSmartMoneyAddressModal: true,
    });
  };
  hideAddSmartMoneyAddresses = () => {
    this.setState({
      addSmartMoneyAddressModal: false,
      showWithLogin: false,
    });
  };
  showFaqModal = () => {
    SmartMoneyFAQClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: false,
    });
    this.setState({
      faqModal: true,
    });
  };
  hideFaqModal = () => {
    this.setState({
      faqModal: false,
    });
  };
  showHowItWorksModal = () => {
    SmartMoneyHowItWorksClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: false,
    });
    this.setState({
      howItWorksModal: true,
    });
  };
  hideHowItWorksModal = () => {
    this.setState({
      howItWorksModal: false,
    });
  };
  loginFunction = () => {
    this.setState(
      {
        showWithLogin: true,
      },
      () => {
        this.setState({
          addSmartMoneyAddressModal: true,
        });
      }
    );
  };
  openSignOutModal = () => {
    this.setState({
      showSignOutModal: true,
    });
  };
  closeSignOutModal = () => {
    this.setState({
      showSignOutModal: false,
    });
  };
  signOutFun = () => {
    this.props.setPageFlagDefault();
    deleteToken(true);
    this.closeSignOutModal();
    this.createEmptyUser();
  };

  render() {
    const tableData = this.state.accountList;

    const columnList = [
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Rank
            </span>
            {/* <Image
          src={sortByIcon}
          className={
            this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
          }
        /> */}
          </div>
        ),
        dataKey: "Numbering",
        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey, index) => {
          if (dataKey === "Numbering" && index > -1) {
            let rank = index + 1;
            if (rowData.rank) {
              rank = rowData.rank;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(rank)).toLocaleString("en-US")}
              >
                <span className="inter-display-medium f-s-13">
                  {Number(noExponents(rank)).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Wallet
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "account",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return (
              <span
                onClick={() => {
                  let lochUser = getCurrentUser().id;

                  let slink = rowData.account;
                  let shareLink =
                    BASE_URL_S3 + "home/" + slink + "?redirect=home";
                  if (lochUser) {
                    const alreadyPassed =
                      window.sessionStorage.getItem("PassedRefrenceId");
                    if (alreadyPassed) {
                      shareLink = shareLink + "&refrenceId=" + alreadyPassed;
                    } else {
                      shareLink = shareLink + "&refrenceId=" + lochUser;
                    }
                  }
                  SmartMoneyWalletClicked({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    wallet: slink,
                    isMobile: false,
                  });
                  window.open(shareLink, "_blank", "noreferrer");
                }}
                className="top-account-address"
              >
                {TruncateText(rowData.account)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="tagName"
            // onClick={() => this.handleSort(this.state.tableSortOpt[5].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Nametag
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "tagName",

        coumnWidth: 0.225,
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
                    SmartMoneyNameTagHover({
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
            className=" history-table-header-col no-hover"
            id="networth"
            // onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net worth
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "networth",

        coumnWidth: 0.175,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "networth") {
            let tempNetWorth = rowData.networth ? rowData.networth : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  amountFormat(tempNetWorth * tempCurrencyRate, "en-US", "USD")
                }
              >
                <div
                  onMouseEnter={() => {
                    SmartMoneyNetWorthHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover:
                        CurrencyType(false) +
                        numToCurrency(tempNetWorth * tempCurrencyRate),
                    });
                    this.updateTimer();
                  }}
                  className="cost-common-container"
                >
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {CurrencyType(false) +
                      numToCurrency(tempNetWorth * tempCurrencyRate)}
                  </span>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className=" history-table-header-col no-hover" id="netflows">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Realized PnL (1yr)
            </span>
          </div>
        ),
        dataKey: "netflows",

        coumnWidth: 0.175,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "netflows") {
            let tempNetflows = rowData.netflows ? rowData.netflows : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempNetflows * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempNetflows * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    onMouseEnter={() => {
                      SmartMoneyRealizedPNLHover({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        hover:
                          tempNetflows * tempCurrencyRate
                            ? CurrencyType(false) +
                              amountFormat(
                                Math.abs(tempNetflows * tempCurrencyRate),
                                "en-US",
                                "USD"
                              )
                            : CurrencyType(false) + "0.00",
                      });
                      this.updateTimer();
                    }}
                  >
                    {tempNetflows !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempNetflows < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false) +
                        numToCurrency(tempNetflows * tempCurrencyRate)}
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
            className=" history-table-header-col no-hover"
            id="netflows"
            // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Unealized PnL
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "profits",

        coumnWidth: 0.175,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "profits") {
            let tempProfits = rowData.profits ? rowData.profits : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempProfits * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempProfits * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    onMouseEnter={() => {
                      SmartMoneyUnrealizedPNLHover({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        hover:
                          tempProfits * tempCurrencyRate
                            ? CurrencyType(false) +
                              amountFormat(
                                Math.abs(tempProfits * tempCurrencyRate),
                                "en-US",
                                "USD"
                              )
                            : CurrencyType(false) + "0.00",
                      });
                      this.updateTimer();
                    }}
                  >
                    {tempProfits !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempProfits < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false) +
                        numToCurrency(tempProfits * tempCurrencyRate)}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      // {
      //   labelName: (
      //     <div
      //       className=" history-table-header-col no-hover"
      //       id="netflows"
      //       // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Unrealized
      //       </span>
      //       {/* <Image
      //         src={sortByIcon}
      //         className={
      //           this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
      //         }
      //       /> */}
      //     </div>
      //   ),
      //   dataKey: "returns",

      //   coumnWidth: 0.15,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "returns") {
      //       let tempReturns = rowData.returns ? rowData.returns : 0;
      //       let tempCurrencyRate = this.state.currency?.rate
      //         ? this.state.currency.rate
      //         : 0;
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={
      //             tempReturns * tempCurrencyRate
      //               ? amountFormat(
      //                   Math.abs(tempReturns * tempCurrencyRate),
      //                   "en-US",
      //                   "USD"
      //                 ) + "%"
      //               : "0.00%"
      //           }
      //         >
      //           <div className="gainLossContainer">
      //             <div
      //               className={`gainLoss `}
      //               onMouseEnter={() => {
      //                 SmartMoneyReturnHover({
      //                   session_id: getCurrentUser().id,
      //                   email_address: getCurrentUser().email,
      //                   hover:
      //                     tempReturns * tempCurrencyRate
      //                       ? amountFormat(
      //                           Math.abs(tempReturns * tempCurrencyRate),
      //                           "en-US",
      //                           "USD"
      //                         ) + "%"
      //                       : "0.00%",
      //                 });
      //                 this.updateTimer();
      //               }}
      //             >
      //               {tempReturns !== 0 ? (
      //                 <Image
      //                   style={{
      //                     height: "1.5rem",
      //                     width: "1.5rem",
      //                   }}
      //                   src={
      //                     tempReturns < 0
      //                       ? ArrowDownLeftSmallIcon
      //                       : ArrowUpRightSmallIcon
      //                   }
      //                   className="mr-2"
      //                 />
      //               ) : null}
      //               <span className="inter-display-medium f-s-13 lh-16 grey-313">
      //                 {numToCurrency(tempReturns * tempCurrencyRate) + "%"}
      //               </span>
      //             </div>
      //           </div>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
    ];

    if (mobileCheck()) {
      return (
        // <MobileDevice isSmartMoney />
        <SmartMoneyMobilePage
          location={this.props.location}
          history={this.props.history}
          accountList={this.state.accountList}
          currency={this.state.currency}
          isLoading={this.state.tableLoading}
          currentPage={this.state.currentPage}
          totalPage={this.state.totalPage}
          pageLimit={this.state.pageLimit}
          changePageLimit={this.changePageLimit}
          onPageChange={this.onPageChange}
          blurTable={this.state.blurTable}
          signOutFun={this.signOutFun}
        />
      );
    }

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
              <SmartMoneyHeader
                openAddAddressModal={this.showAddSmartMoneyAddresses}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                hideButton={true}
                onSignInClick={this.showSignInModal}
                blurTable={this.state.blurTable}
                signOutFun={this.openSignOutModal}
                showFaqModal={this.showFaqModal}
                showHowItWorksModal={this.showHowItWorksModal}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table smartMoneyPage">
            {this.state.showSignOutModal ? (
              <ConformSmartMoneyLeaveModal
                show={this.state.showSignOutModal}
                history={this.props.history}
                handleClose={this.closeSignOutModal}
                handleYes={this.signOutFun}
              />
            ) : null}
            {this.state.faqModal ? (
              <SmartMoneyFaqModal
                show={this.state.faqModal}
                onHide={this.hideFaqModal}
                history={this.props.history}
              />
            ) : null}
            {this.state.signInModal ? (
              <AuthSmartMoneyModal
                hideOnblur
                showHiddenError
                modalAnimation={this.state.signInModalAnimation}
                show={this.state.signInModal}
                onHide={this.hideSignInSignUpModal}
                history={this.props.history}
                modalType={"create_account"}
                iconImage={SignInIcon}
                hideSkip={true}
                title="Sign in"
                description="Get right back into your account"
                stopUpdate={true}
                tracking="Sign in button"
                goToSignUp={this.openSignUpModal}
              />
            ) : null}
            {this.state.signUpModal ? (
              <ExitSmartMoneyOverlay
                hideOnblur
                showHiddenError
                modalAnimation={false}
                show={this.state.signUpModal}
                onHide={this.hideSignInSignUpModal}
                history={this.props.history}
                modalType={"exitOverlay"}
                handleRedirection={this.handleSignUpRedirection}
                signup={true}
                goToSignIn={this.showSignInModal}
              />
            ) : null}
            {this.state.howItWorksModal ? (
              <SmartMoneyHowItWorksModal
                show={this.state.howItWorksModal}
                onHide={this.hideHowItWorksModal}
                history={this.props.history}
              />
            ) : null}
            {this.state.addSmartMoneyAddressModal ? (
              <AddSmartMoneyAddressesModal
                show={this.state.addSmartMoneyAddressModal}
                onHide={this.hideAddSmartMoneyAddresses}
                history={this.props.history}
                signInVar={this.state.showWithLogin}
                blurTable={this.state.blurTable}
              />
            ) : null}
            {/* <Button onClick={this.loginFunction}>Login</Button>
            <Button onClick={this.signUpFunction}>Sign up</Button> */}
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
                isShare={window.sessionStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
              />
            )}

            <div style={{ paddingBottom: "2rem" }}>
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
                  <div className="smartMoneyTable">
                    <TransactionTable
                      smartMoneyBlur={this.state.blurTable}
                      blurButtonClick={this.showAddSmartMoneyAddresses}
                      isSmartMoney
                      noSubtitleBottomPadding
                      tableData={tableData}
                      columnList={columnList}
                      message={"No accounts found"}
                      totalPage={this.state.totalPage}
                      history={this.props.history}
                      location={this.props.location}
                      page={this.state.currentPage}
                      tableLoading={this.state.tableLoading}
                      onPageChange={this.onPageChange}
                      pageLimit={this.state.pageLimit}
                      changePageLimit={this.changePageLimit}
                      addWatermark
                      className={this.state.blurTable ? "noScroll" : ""}
                      onBlurSignInClick={this.showSignInModal}
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
                  </div>
                )}
              </div>
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
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  getSmartMoney,

  getAllCoins,
  getFilters,
  setPageFlagDefault,
  TopsetPageFlagDefault,
  getAllParentChains,
  updateWalletListFlag,

  removeFromWatchList,
  updateAddToWatchList,
  createAnonymousUserSmartMoneyApi,
  GetAllPlan,
};

SmartMoneyPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(SmartMoneyPage);
