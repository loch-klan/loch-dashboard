import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";

import { Image } from "react-bootstrap";
import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";
import CoinChip from "../wallet/CoinChip.js";

import {
  AssetsPageTimeSpentMP,
  AssetsPageViewMP,
  CAverageCostBasisSort,
  CostAmountHover,
  CostAssetHover,
  CostAverageCostPriceHover,
  CostAvgCostBasisExport,
  CostCostBasisHover,
  CostCurrentPriceHover,
  CostCurrentValueHover,
  CostGainHover,
  CostGainLossHover,
  CostHideDust,
  CostShare,
  CostSortByAmount,
  CostSortByAsset,
  CostSortByCostPrice,
  CostSortByCurrentPrice,
  CostSortByPortfolio,
  SortByCurrentValue,
  SortByGainAmount,
  SortByGainLoss,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import {
  getAllCounterFeeApi,
  getAllFeeApi,
  getAvgCostBasis,
  updateCounterParty,
  updateFeeGraph,
} from "../cost/Api.js";

// add wallet
import { toast } from "react-toastify";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  DexScreenerClockIcon,
  DexScreenerFireIcon,
  DexScreenerGainersIcon,
  DexScreenerHeaderBellIcon,
  DexScreenerNewPairsIcon,
  DexScreenerTopIcon,
} from "../../assets/images/icons/index.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  CurrencyType,
  amountFormat,
  convertNtoNumber,
  dontOpenLoginPopup,
  isPremiumUser,
  mobileCheck,
  noExponents,
  numToCurrency,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api.js";
import MobileLayout from "../layout/MobileLayout.js";
// import AssetUnrealizedProfitAndLossMobile from "./AssetUnrealizedProfitAndLossMobile.js";
import PaywallModal from "../common/PaywallModal.js";
import "./_dexScreenerTablePage.scss";
import DexScreenerPriceAlertModal from "../DexScreener/DexScreenerPriceAlertModal/DexScreenerPriceAlertModal.js";
import DexScreenerTablePageContent from "./DexScreenerTablePageContent.js";
import DexScreenerTableMobilePage from "./DexScreenerTableMobilePage.js";

class DexScreenerTablePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobilePage: mobileCheck(),
      isPriceAlertModal: false,
      isPremiumUser: false,
      isLochPaymentModal: false,
      Average_cost_basis_local: [],
      firstTimeUnrealizedPNL: true,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      exportHeaderTitle: "Download all unrealized profit and loss",
      exportHeaderSubTitle: "Export the unrealized profit and loss from Loch",
      exportSelectExportOption: 4,
      exportModal: false,
      callFeesOverTime: true,
      callCounterpartyVolumeOverTime: true,

      startTime: "",
      // gas fees
      // GraphfeeData: [],
      // graphfeeValue: null,

      counterGraphLoading: true,
      gasFeesGraphLoading: true,

      AvgCostLoading: true,
      showDust: true,

      // counter party
      // counterPartyData: [],
      // counterPartyValue: null,
      currentPage: "Cost",
      connectModal: false,
      counterGraphDigit: 3,
      GraphDigit: 3,

      // add new wallet
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      isFeesChainSearchUsed: false,
      isVolumeChainSearchUsed: false,
      // sort
      sortBy: [
        { title: "Asset", down: true },
        { title: "Average cost price", down: true },
        { title: "Current price", down: true },
        { title: "Amount", down: true },
        { title: "Cost basis", down: true },
        { title: "Current value", down: false },
        { title: "Gain amount", down: true },
        { title: "Gain percentage", down: true },
        { title: "Portfolio perc", down: true },
      ],
    };
  }
  history = this.props;
  handleExportModal = () => {
    this.setState({
      exportModal: !this.state.exportModal,
    });
  };
  setAverageCostExportModal = () => {
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredAssetExportModal", true);
    CostAvgCostBasisExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download unrealized profit and loss",
        exportHeaderSubTitle: "Export the unrealized profit and loss from Loch",
        exportSelectExportOption: 4,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    AssetsPageViewMP({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCostTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  checkPremium = () => {
    if (isPremiumUser()) {
      this.setState({
        isPremiumUser: true,
      });
    } else {
      this.setState({
        isPremiumUser: false,
      });
    }
  };
  componentDidMount() {
    this.checkPremium();
    // const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    // if (userDetails && userDetails.email) {
    //   const shouldOpenNoficationModal = window.localStorage.getItem(
    //     "openAssetPaymentModal"
    //   );
    //   const isOpenForSearch = window.localStorage.getItem(
    //     "openSearchbarPaymentModal"
    //   );
    //   if (shouldOpenNoficationModal && !isOpenForSearch) {
    //     setTimeout(() => {
    //       removeOpenModalAfterLogin();
    //       this.setState({
    //         isLochPaymentModal: true,
    //       });
    //     }, 1000);
    //   }
    // }
    scrollToTop();
    if (
      !this.props.commonState.assetsPage ||
      !(
        this.props.intelligenceState?.Average_cost_basis &&
        this.props.intelligenceState?.Average_cost_basis.length > 0
      )
    ) {
      this.props.getAllCoins();

      this.props.getAvgCostBasis(this);
      this.props.GetAllPlan();
      this.props.getUser();
    } else {
      this.props.updateWalletListFlag("assetsPage", true);
      if (this.props.intelligenceState?.Average_cost_basis) {
        this.trimAverageCostBasisLocally(
          this.props.intelligenceState?.Average_cost_basis
        );
      }
      this.setState({
        AvgCostLoading: false,
      });
      this.combinedResults();
    }
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const addAddress = params.get("add-address");
    if (addAddress) {
      this.handleAddModal();
      this.props.history.replace("/intelligence/costs");
    }
    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkCostTimer);
    };
  }
  trimAverageCostBasisLocally = (sortedList) => {
    let tempList = [];
    if (sortedList) {
      tempList = sortedList;
    } else {
      tempList = [...this.state.Average_cost_basis_local];
    }

    if (tempList.length > 0 && this.state.showDust) {
      let array = tempList?.filter((e) => e.CurrentValue >= 1);
      this.updateAverageCostBasisLocally(array);
    } else {
      this.updateAverageCostBasisLocally(tempList);
    }
  };
  updateAverageCostBasisLocally = (newArray) => {
    this.setState({
      Average_cost_basis_local: newArray,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.Average_cost_basis !==
      this.props.intelligenceState.Average_cost_basis
    ) {
      this.checkPremium();
      this.props.updateWalletListFlag("assetsPage", true);
      if (this.state.showDust) {
        this.trimAverageCostBasisLocally(
          this.props.intelligenceState.Average_cost_basis
        );
      } else {
        this.updateAverageCostBasisLocally(
          this.props.intelligenceState.Average_cost_basis
        );
      }
      this.combinedResults();
    }
    // add wallet
    if (prevState.apiResponse !== this.state.apiResponse) {
      this.checkPremium();
      this.props.updateWalletListFlag("assetsPage", true);

      this.props.getAllCoins();

      this.props.getAvgCostBasis(this);
      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.assetsPage) {
      this.checkPremium();
      this.props.updateWalletListFlag("assetsPage", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
  }
  combinedResults = (data) => {
    let tempcombinedCostBasis = 0;
    let tempcombinedCurrentValue = 0;
    let tempcombinedUnrealizedGains = 0;
    let tempcombinedReturn = 0;
    if (this.props.intelligenceState?.net_return) {
      tempcombinedReturn = this.props.intelligenceState?.net_return;
    }
    if (this.props.intelligenceState?.total_bal) {
      tempcombinedCurrentValue = this.props.intelligenceState?.total_bal;
    }
    if (this.props.intelligenceState?.total_cost) {
      tempcombinedCostBasis = this.props.intelligenceState?.total_cost;
    }
    if (this.props.intelligenceState?.total_gain) {
      tempcombinedUnrealizedGains = this.props.intelligenceState?.total_gain;
    }

    this.setState({
      combinedCostBasis: tempcombinedCostBasis,
      combinedCurrentValue: tempcombinedCurrentValue,
      combinedUnrealizedGains: tempcombinedUnrealizedGains,
      combinedReturn: tempcombinedReturn,
    });
  };
  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
      counterGraphLoading: true,
      gasFeesGraphLoading: true,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    this.props.setPageFlagDefault();
  };

  updateTimer = (first) => {
    const tempExistingExpiryTime =
      window.localStorage.getItem("costPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("costPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkCostTimer);
    window.localStorage.removeItem("costPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      AssetsPageTimeSpentMP({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem("costPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem("costPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };

  sortArray = (key, order) => {
    let array = [...this.state.Average_cost_basis_local]; //all data
    let sortedList = array.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (key === "AssetCode") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        return order
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
      if (order) {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    // this.setState({
    //   sortedList,
    // });
    this.trimAverageCostBasisLocally(sortedList);
    // this.props.updateAverageCostBasis(sortedList, this);
  };
  // sort
  handleSort = (e) => {
    // down == true means ascending and down == false means descending
    let isDown = true;
    let sort = [...this.state.sortBy];
    sort.map((el) => {
      if (el.title === e.title) {
        el.down = !el.down;
        isDown = el.down;
      } else {
        el.down = true;
      }
    });

    if (e.title === "Asset") {
      this.sortArray("AssetCode", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByAsset({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Average cost price") {
      this.sortArray("AverageCostPrice", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByCostPrice({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Current price") {
      this.sortArray("CurrentPrice", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByCurrentPrice({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Amount") {
      this.sortArray("Amount", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByAmount({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Cost basis") {
      this.sortArray("CostBasis", isDown);
      this.setState({
        sortBy: sort,
      });
      CAverageCostBasisSort({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Current value") {
      this.sortArray("CurrentValue", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByCurrentValue({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Gain amount") {
      this.sortArray("GainAmount", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByGainAmount({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Gain percentage") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByGainLoss({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Portfolio perc") {
      this.sortArray("weight", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByPortfolio({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    }
  };

  handleDust = () => {
    this.setState(
      {
        showDust: !this.state.showDust,
      },
      () => {
        this.trimAverageCostBasisLocally(
          this.props.intelligenceState?.Average_cost_basis
        );
        CostHideDust({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
        this.updateTimer();
      }
    );
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=assets";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    CostShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  showBlurredItem = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredAssetSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openAssetPaymentModal", true);
      }, 1000);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        dontOpenLoginPopup();
      }
    }
  };
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
  };
  showPriceAlertModal = () => {
    this.setState({
      isPriceAlertModal: true,
    });
  };
  hidePriceAlertModal = () => {
    this.setState({
      isPriceAlertModal: false,
    });
  };
  render() {
    const columnData = [
      {
        labelName: (
          <div
            className="cp history-table-header-col history-table-header-col-curve-left table-header-font"
            id="Asset"
          >
            <span className="inter-display-medium f-s-12 lh-16">Token</span>
          </div>
        ),
        dataKey: "Asset",

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            const goToDexScreener = () => {
              this.props.history.push("/dex-screener");
            };
            return (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={goToDexScreener}
                className="full-width-table-row-block"
              >
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    (rowData.AssetCode ? rowData.AssetCode : "") +
                    " [" +
                    rowData?.chain?.name +
                    "]"
                  }
                >
                  <div
                    onMouseEnter={() => {
                      CostAssetHover({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        asset_hover: rowData.AssetCode,
                      });
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    className="dotDotText"
                  >
                    <div>
                      <CoinChip
                        coin_img_src={rowData.Asset}
                        coin_code={rowData.AssetCode}
                        chain={rowData?.chain}
                        hideText={true}
                      />
                    </div>
                    {rowData.Asset ? (
                      <div
                        className="dotDotText"
                        style={{
                          marginLeft: "1rem",
                        }}
                      >
                        {rowData.AssetCode ? rowData.AssetCode : ""}
                      </div>
                    ) : null}
                  </div>
                </CustomOverlay>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Current Value"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">Price</span>
          </div>
        ),
        dataKey: "CurrentValue",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentValue") {
            return (
              <div className="full-width-table-row-block">
                <div className="cost-common-container">
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.CurrentValue
                        ? CurrencyType(false) +
                          amountFormat(rowData.CurrentValue, "en-US", "USD")
                        : CurrencyType(false) + "0.00"
                    }
                  >
                    <div>
                      <span
                        onMouseEnter={() => {
                          CostCurrentValueHover({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                          });
                        }}
                        className="table-data-font"
                      >
                        {rowData.CurrentValue
                          ? CurrencyType(false) +
                            numToCurrency(
                              rowData.CurrentValue.toFixed(2)
                            ).toLocaleString("en-US")
                          : CurrencyType(false) + "0.00"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Portfolio perc"
          >
            <span className="inter-display-medium f-s-12 lh-16">Txn</span>
          </div>
        ),
        dataKey: "PortfolioPercentage",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "PortfolioPercentage") {
            let tempDataHolder = 0;
            if (rowData.weight) {
              tempDataHolder = Number(noExponents(rowData.weight.toFixed(2)));
            }
            return (
              <div className="full-width-table-row-block">
                {" "}
                <div
                  onMouseEnter={() => {
                    CostGainLossHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  className="gainLossContainer"
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"
                    }
                    colorCode="#000"
                  >
                    <div className={`gainLoss`}>
                      <span className="inter-display-medium f-s-12 lh-16 table-data-font">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col history-table-header-col-text-center table-header-font"
            id="Current Price"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">Volume</span>
          </div>
        ),
        dataKey: "CurrentPrice",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentPrice") {
            return (
              <div className="full-width-table-row-block">
                <div
                  onMouseEnter={() => {
                    CostCurrentPriceHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.CurrentPrice
                        ? CurrencyType(false) +
                          amountFormat(rowData.CurrentPrice, "en-US", "USD")
                        : CurrencyType(false) + "0.00"
                    }
                  >
                    <span className="inter-display-medium f-s-12 lh-16 table-data-font">
                      {rowData.CurrentPrice
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.CurrentPrice.toFixed(2)
                          ).toLocaleString("en-US")
                        : CurrencyType(false) + "0.00"}
                    </span>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col history-table-header-col-text-center table-header-font"
            id="Amount"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">makers</span>
          </div>
        ),
        dataKey: "Amount",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Amount") {
            return (
              <div className="full-width-table-row-block">
                <span
                  onMouseEnter={() => {
                    CostAmountHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.Amount && rowData.Amount !== 0
                        ? convertNtoNumber(rowData.Amount)
                        : "0"
                    }
                  >
                    <span className="table-data-font">
                      {rowData.Amount
                        ? numToCurrency(rowData.Amount).toLocaleString("en-US")
                        : "0"}
                    </span>
                  </CustomOverlay>
                </span>
              </div>
            );
          }
        },
      },

      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Average Cost Price"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">5m</span>
          </div>
        ),
        dataKey: "AverageCostPrice",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "AverageCostPrice") {
            return (
              <div className="full-width-table-row-block">
                <div
                  onMouseEnter={() => {
                    CostAverageCostPriceHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  onClick={this.showBlurredItem}
                  className=""
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.AverageCostPrice
                        ? CurrencyType(false) +
                          amountFormat(rowData.AverageCostPrice, "en-US", "USD")
                        : CurrencyType(false) + "0.00"
                    }
                  >
                    <span className="dst-loss-text inter-display-medium f-s-12 lh-16 table-data-font">
                      {rowData.AverageCostPrice
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.AverageCostPrice.toFixed(2)
                          ).toLocaleString("en-US")
                        : CurrencyType(false) + "0.00"}
                    </span>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Cost Basis"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">1H</span>
          </div>
        ),
        dataKey: "CostBasis",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CostBasis") {
            return (
              <div className="full-width-table-row-block">
                <div
                  onClick={this.showBlurredItem}
                  className={`cost-common-container`}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.CostBasis
                        ? CurrencyType(false) +
                          amountFormat(rowData.CostBasis, "en-US", "USD")
                        : CurrencyType(false) + "0.00"
                    }
                  >
                    <div>
                      <span
                        className="dst-profit-text table-data-font"
                        onMouseEnter={() => {
                          CostCostBasisHover({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                          });
                        }}
                      >
                        {rowData.CostBasis
                          ? CurrencyType(false) +
                            numToCurrency(
                              rowData.CostBasis.toFixed(2)
                            ).toLocaleString("en-US")
                          : CurrencyType(false) + "0.00"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Gainamount"
          >
            <span className="inter-display-medium f-s-12 lh-16 ">6H</span>
          </div>
        ),
        dataKey: "GainAmount",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainAmount") {
            const tempDataHolder = numToCurrency(rowData.GainAmount);
            return (
              <div className="full-width-table-row-block">
                <div
                  onMouseEnter={() => {
                    CostGainHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  onClick={this.showBlurredItem}
                  className={`gainLossContainer`}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.GainAmount
                        ? CurrencyType(false) +
                          amountFormat(
                            Math.abs(rowData.GainAmount),
                            "en-US",
                            "USD"
                          )
                        : CurrencyType(false) + "0.00"
                    }
                    colorCode="#000"
                  >
                    <div className={`gainLoss`}>
                      {rowData.GainAmount !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            rowData.GainAmount < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="dst-profit-text inter-display-medium f-s-12 lh-16 table-data-font">
                        {rowData.GainAmount
                          ? CurrencyType(false) +
                            tempDataHolder.toLocaleString("en-US")
                          : CurrencyType(false) + "0.00"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="Gain loss"
          >
            <span className="inter-display-medium f-s-12 lh-16">24H</span>
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            let tempDataHolder = 0;
            if (rowData.GainLoss) {
              tempDataHolder = Number(noExponents(rowData.GainLoss.toFixed(2)));
            }
            return (
              <div className="full-width-table-row-block ">
                <div
                  onMouseEnter={() => {
                    CostGainLossHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  onClick={this.showBlurredItem}
                  className={`gainLossContainer`}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"
                    }
                    colorCode="#000"
                  >
                    <div className={`gainLoss`}>
                      {rowData.GainLoss !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            rowData.GainLoss < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="dst-profit-text inter-display-medium f-s-12 lh-16 table-data-font">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="Gain loss"
          >
            <span className="inter-display-medium f-s-12 lh-16">liquidity</span>
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            const tempDataHolder = Number(
              noExponents(rowData.GainLoss.toFixed(2))
            );
            return (
              <div className="full-width-table-row-block ">
                <div
                  onMouseEnter={() => {
                    CostGainLossHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  onClick={this.showBlurredItem}
                  className={`gainLossContainer`}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"
                    }
                    colorCode="#000"
                  >
                    <div className={`gainLoss`}>
                      {rowData.GainLoss !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            rowData.GainLoss < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="inter-display-medium f-s-12 lh-16 table-data-font">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col history-table-header-col-curve-right table-header-font"
            id="Gain loss"
          >
            <span className="inter-display-medium f-s-12 lh-16">mcap</span>
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.08,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            const tempDataHolder = Number(
              noExponents(rowData.GainLoss.toFixed(2))
            );
            return (
              <div className="full-width-table-row-block full-width-table-row-block-no-border">
                <div
                  onMouseEnter={() => {
                    CostGainLossHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  onClick={this.showBlurredItem}
                  className={`gainLossContainer`}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"
                    }
                    colorCode="#000"
                  >
                    <div className={`gainLoss`}>
                      {rowData.GainLoss !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            rowData.GainLoss < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="inter-display-medium f-s-12 lh-16 table-data-font">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            );
          }
        },
      },
    ];

    if (this.state.isMobilePage) {
      return (
        <MobileLayout
          currentPage={"dex-screener-table"}
          hideFooter
          history={this.props.history}
          hideAddresses
          hideShare
        >
          <DexScreenerTableMobilePage
            Average_cost_basis_local={this.state.Average_cost_basis_local}
            columnData={columnData}
            AvgCostLoading={this.state.AvgCostLoading}
            showPriceAlertModal={this.showPriceAlertModal}
          />
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/assets"}
              title="Profit and Loss with Loch"
              description="Unlimited wallets PnL"
              hideBackBtn
              isMobile
            />
          ) : null}
        </MobileLayout>
      );
    }

    return (
      <div className="dex-screener-table-page">
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                showDexScreenerSearch
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        {this.state.isPriceAlertModal ? (
          <DexScreenerPriceAlertModal
            hideOnblur
            show
            onHide={this.hidePriceAlertModal}
            history={this.props.history}
            modalType={"price_alert"}
            hideSkip={true}
            // curToken="curToken"
          />
        ) : null}
        <div className="cost-page-section">
          <div className="cost-section page-scroll">
            <div className="page-scroll-child">
              <DexScreenerTablePageContent
                Average_cost_basis_local={this.state.Average_cost_basis_local}
                columnData={columnData}
                AvgCostLoading={this.state.AvgCostLoading}
                showPriceAlertModal={this.showPriceAlertModal}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllFeeApi,
  getAllCounterFeeApi,

  // avg cost
  getAvgCostBasis,

  // update counter party
  updateCounterParty,
  // update fee
  updateFeeGraph,
  setPageFlagDefault,

  // average cost

  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerTablePage);
