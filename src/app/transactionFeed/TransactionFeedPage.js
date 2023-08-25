import React from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import { connect } from "react-redux";
import "./_transactionFeed.scss";

import {
  SEARCH_BY_WALLET_ADDRESS_IN,
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_TEXT,
  BASE_URL_S3,
  SORT_BY_VALUE,
  SEARCH_BY_CHAIN_IN,
} from "../../utils/Constant";
import { searchTransactionApi } from "../intelligence/Api";

import { getFilters } from "../intelligence/Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdown";
import { UpgradeTriggered } from "../../utils/ReusableFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  TimeSpentTransactionFeed,
  TransactionHistoryPageBack,
  TransactionHistoryPageNext,
  TransactionHistoryPageSearch,
  TransactionHistoryPageView,
  TransactionHistorySearch,
  TransactionHistoryShare,
} from "../../utils/AnalyticsFunctions";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import WelcomeCard from "../Portfolio/WelcomeCard";
import Footer from "../common/footer";
import TransactionFeedBlock from "./TransactionFeedBlock";

class TransactionFeedPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const walletList = JSON.parse(localStorage.getItem("addWallet"));
    const address = walletList?.map((wallet) => {
      return wallet.address;
    });
    const cond = [
      {
        key: SEARCH_BY_WALLET_ADDRESS_IN,
        value: address,
      },
    ];
    this.state = {
      //YO

      totalPage: 0,
      //YO

      currency: JSON.parse(localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_VALUE, value: false }],
      walletList,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: cond ? cond : [],
      tableLoading: false,
      tableSortOpt: [
        {
          title: "asset",
          up: false,
        },
        {
          title: "amount",
          up: false,
        },
        {
          title: "usdValue",
          up: false,
        },

        {
          title: "project",
          up: false,
        },
        {
          title: "pool",
          up: false,
        },
        {
          title: "tvl",
          up: false,
        },
        {
          title: "apy",
          up: false,
        },
      ],
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

      // start time for time spent on page
      startTime: "",
      isTimeSearchUsed: false,
      isAssetSearchUsed: false,
      isMethodSearchUsed: false,
      timeSeries: [
        "All time",
        "5 Y",
        "4 Y",
        "3 Y",
        "2 Y",
        "1 Y",
        "6 M",
        "1 M",
        "1 W",
        "1 D",
      ],
      activeTime: 0,
      dummyDataList: [],
    };
    this.delayTimer = 0;
  }
  changeTimer = (newTime) => {
    this.setState({
      activeTime: newTime,
    });
  };
  timeSearchIsUsed = () => {
    this.setState({ isTimeSearchUsed: true });
  };
  assetSearchIsUsed = () => {
    this.setState({ isAssetSearchUsed: true });
  };
  methodSearchIsUsed = () => {
    this.setState({ isMethodSearchUsed: true });
  };
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    TransactionHistoryPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTransactionFeedTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    this.setState({
      tableLoading: true,
    });
    setTimeout(() => {
      this.setState({
        tableLoading: false,
        dummyDataList: [
          {
            from: {
              ens: "Vitalik.eth",
              address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              tag: "",
            },
            to: {
              ens: "",
              address: "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853",
              tag: "Binance",
            },
            amountUSD: 300,
            amountCoin: 12000,
            coinName: "BTC",
            dateAndTime: new Date(),
            coinIcon:
              "https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/hbly28gqvqn4ak2voluo",
          },
          {
            from: {
              ens: "",
              address: "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853",
              tag: "Alameda Research",
            },
            to: {
              ens: "Vitalik.eth",
              address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              tag: "",
            },
            amountUSD: 345,
            amountCoin: 112000,
            coinName: "ETH",
            dateAndTime: new Date(),
            coinIcon:
              "https://styles.redditmedia.com/t5_4eu1fb/styles/communityIcon_5dqhzz1g4d671.png?width=256&s=5f84e74e67e791858cb3d9980da9bfb42993220e",
          },
          {
            from: {
              ens: "mw3.eth",
              address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              tag: "",
            },
            to: {
              ens: "",
              address: "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853",
              tag: "Jump trading",
            },
            amountUSD: 2,
            amountCoin: 34,
            coinName: "BTC",
            dateAndTime: new Date(),
            coinIcon:
              "https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/hbly28gqvqn4ak2voluo",
          },
          {
            from: {
              ens: "",
              address: "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853",
              tag: "Paradigm",
            },
            to: {
              ens: "",
              address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              tag: "",
            },
            amountUSD: 99,
            amountCoin: 778,
            coinName: "ETH",
            dateAndTime: new Date(),
            coinIcon:
              "https://styles.redditmedia.com/t5_4eu1fb/styles/communityIcon_5dqhzz1g4d671.png?width=256&s=5f84e74e67e791858cb3d9980da9bfb42993220e",
          },
        ],
      });
    }, 2000);
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.callApi(this.state.currentPage || START_INDEX);

    this.props.getAllCoins();
    this.props.getFilters(this);

    GetAllPlan();
    getUser();

    let obj = UpgradeTriggered();

    if (obj.trigger) {
      this.setState(
        {
          triggerId: obj.id,
          isStatic: true,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkTransactionFeedTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "transactionFeedPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("transactionFeedPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTransactionFeedTimer);
    localStorage.removeItem("transactionFeedPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTransactionFeed({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem(
      "transactionFeedPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem(
      "transactionFeedPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  callApi = (page = START_INDEX) => {
    // this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    // this.props.getYieldOpportunities(data, page);
  };

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      // console.log("prev", prevPage, "cur", page);
      this.callApi(page);
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          TransactionHistoryPageBack({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          TransactionHistoryPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else {
          TransactionHistoryPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_search: page + 1,
          });
          this.updateTimer();
        }
      }
    }

    // add wallet
    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");
      const address = this.state.walletList?.map((wallet) => {
        return wallet.address;
      });
      const cond = [
        {
          key: SEARCH_BY_WALLET_ADDRESS_IN,
          value: address,
        },
      ];
      this.props.getAllCoins();
      this.setState({
        condition: cond ? cond : [],
        apiResponse: false,
      });

      this.callApi(this.state.currentPage || START_INDEX);
      this.props.getFilters(this);
    }
  }

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    // this.setState({
    //   // for add wallet
    //   walletList: value,
    //   isUpdate: this.state.isUpdate === 0 ? 1 : 0,
    //   // for page
    //   tableLoading: true,
    // });
  };

  CheckApiResponse = (value) => {
    // this.setState({
    //   apiResponse: value,
    // });
    // this.props.setPageFlagDefault();
    // console.log("api respinse", value);
  };

  onValidSubmit = () => {
    // console.log("Sbmit")
  };
  handleFunction = (badge) => {
    // if (badge && badge.length > 0) {
    //   const tempArr = [];
    //   if (badge[0].name !== "All") {
    //     badge.forEach((resData) => tempArr.push(resData.id));
    //   }
    //   this.addCondition(
    //     SEARCH_BY_CHAIN_IN,
    //     tempArr && tempArr.length > 0 ? tempArr : "allNetworks"
    //   );
    // }
  };
  addCondition = (key, value) => {
    //   // console.log("key, value", key, value);
    //   if (key === "SEARCH_BY_TIMESTAMP_IN") {
    //     const tempIsTimeUsed = this.state.isTimeSearchUsed;
    //     TransactionHistoryYearFilter({
    //       session_id: getCurrentUser().id,
    //       email_address: getCurrentUser().email,
    //       year_filter: value === "allYear" ? "All years" : value,
    //       isSearchUsed: tempIsTimeUsed,
    //     });
    //     this.updateTimer();
    //     this.setState({ isTimeSearchUsed: false });
    //   } else if (key === "SEARCH_BY_ASSETS_IN") {
    //     let assets = [];
    //     Promise.all([
    //       new Promise((resolve) => {
    //         // console.log("abc");
    //         if (value !== "allAssets") {
    //           console.log("test");
    //           this.props.intelligenceState?.assetFilter?.map((e) => {
    //             if (value?.includes(e.value)) {
    //               assets.push(e.label);
    //             }
    //           });
    //         }
    //         resolve(); // Resolve the promise once the code execution is finished
    //       }),
    //     ]).then(() => {
    //       // console.log("asset arr", assets, value);
    //       const tempIsAssetUsed = this.state.isAssetSearchUsed;
    //       TransactionHistoryAssetFilter({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //         asset_filter: value === "allAssets" ? "All assets" : assets,
    //         isSearchUsed: tempIsAssetUsed,
    //       });
    //       this.updateTimer();
    //       this.setState({ isAssetSearchUsed: false });
    //     });
    //   } else if (key === "SEARCH_BY_METHOD_IN") {
    //     const tempIsMethodUsed = this.state.isMethodSearchUsed;
    //     TransactionHistoryMethodFilter({
    //       session_id: getCurrentUser().id,
    //       email_address: getCurrentUser().email,
    //       method_filter: value === "allMethod" ? "All method" : value,
    //       isSearchUsed: tempIsMethodUsed,
    //     });
    //     this.updateTimer();
    //     this.setState({ isMethodSearchUsed: false });
    //   }
    //   let index = this.state.condition.findIndex((e) => e.key === key);
    //   // console.log("index", index);
    //   let arr = [...this.state.condition];
    //   let search_index = this.state.condition.findIndex(
    //     (e) => e.key === SEARCH_BY_TEXT
    //   );
    //   if (
    //     index !== -1 &&
    //     value !== "allAssets" &&
    //     value !== "allMethod" &&
    //     value !== "allYear"
    //   ) {
    //     // console.log("first if", index);
    //     arr[index].value = value;
    //   } else if (
    //     value === "allAssets" ||
    //     value === "allMethod" ||
    //     value === "allYear"
    //   ) {
    //     // console.log("second if", index);
    //     if (index !== -1) {
    //       arr.splice(index, 1);
    //     }
    //   } else {
    //     // console.log("else", index);
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
  };
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);
      TransactionHistorySearch({
        session_id: getCurrentUser().id,
        email: getCurrentUser().email,
        searched: this.state.search,
      });
      this.updateTimer();
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  handleTableSort = (val) => {
    // let sort = [...this.state.tableSortOpt];
    // let obj = [];
    // sort?.map((el) => {
    //   if (el.title === val) {
    //     if (val === "time") {
    //       obj = [
    //         {
    //           key: SORT_BY_TIMESTAMP,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortDate({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "from") {
    //       obj = [
    //         {
    //           key: SORT_BY_FROM_WALLET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortFrom({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "to") {
    //       obj = [
    //         {
    //           key: SORT_BY_TO_WALLET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortTo({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "asset") {
    //       obj = [
    //         {
    //           key: SORT_BY_ASSET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortAsset({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "amount") {
    //       obj = [
    //         {
    //           key: SORT_BY_AMOUNT,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortAmount({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "usdThen") {
    //       obj = [
    //         {
    //           key: SORT_BY_USD_VALUE_THEN,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortUSDAmount({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "usdTransaction") {
    //       obj = [
    //         {
    //           key: SORT_BY_TRANSACTION_FEE,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortUSDFee({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "method") {
    //       obj = [
    //         {
    //           key: SORT_BY_METHOD,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortMethod({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     }
    //     el.up = !el.up;
    //   } else {
    //     el.up = false;
    //   }
    // });
    // this.setState({
    //   sort: obj,
    //   tableSortOpt: sort,
    // });
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=transaction-feed?p=0";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    TransactionHistoryShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
    const timeBadge = this.state.timeSeries?.map((badge, index) => {
      const className =
        index === this.state.activeTime
          ? `inter-display-medium f-s-13 lh-16 timeBadge lineChartTimeBadge active`
          : `inter-display-medium f-s-13 lh-16 timeBadge lineChartTimeBadge`;

      const newTimePass = () => {
        this.changeTimer(index);
      };
      return (
        <div key={index} id={index} className={className} onClick={newTimePass}>
          {badge}
        </div>
      );
    });
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
                updateTimer={this.updateTimer}
                handleAddModal={this.handleAddModal}
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
                updateTimer={this.updateTimer}
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
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title="Transaction feed"
              subTitle="All your latest transactions here"
              currentPage={"transaction-history"}
              history={this.props.history}
              ShareBtn={true}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col md={3}>
                    <CustomDropdown
                      filtername="All amounts"
                      options={this.props.OnboardingState.coinsList}
                      action={SEARCH_BY_CHAIN_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.networkSearchIsUsed}
                      isCaptialised
                      isGreyChain
                    />
                  </Col>

                  <Col md={3}>
                    <CustomDropdown
                      filtername="All networks"
                      options={this.props.OnboardingState.coinsList}
                      action={SEARCH_BY_ASSETS_IN}
                      handleClick={this.handleFunction}
                      searchIsUsed={this.assetSearchIsUsed}
                      isCaptialised
                      isGreyChain
                    />
                  </Col>
                  <Col md={3}>
                    <CustomDropdown
                      filtername="All assets"
                      options={this.props.intelligenceState.assetFilter}
                      action={SEARCH_BY_ASSETS_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.assetSearchIsUsed}
                    />
                  </Col>

                  {/* {fillter_tabs} */}
                  <Col md={3}>
                    <div className="searchBar">
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
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={`fillter_tabs_section bar-graph-footer `}>
              <div className={`timeBadgeWrapper lineChart`}>{timeBadge}</div>
            </div>

            <div className="transaction-history-table">
              {this.state.tableLoading ? (
                <div className="loadingSizeContainer">
                  <Loading />
                </div>
              ) : (
                <>
                  {this.state.dummyDataList
                    ? this.state.dummyDataList.map((feedListData) => {
                        return (
                          <TransactionFeedBlock feedListData={feedListData} />
                        );
                      })
                    : null}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,

  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  searchTransactionApi,

  getAllCoins,
  setPageFlagDefault,
  updateWalletListFlag,
  getFilters,
};

TransactionFeedPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionFeedPage);
