import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader.js";
import { getAllCoins } from "../onboarding/Api.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import {
  CAverageCostBasisSort,
  CostAvgCostBasisExport,
  CostHideDust,
  CostShare,
  CostSortByAmount,
  CostSortByAsset,
  CostSortByCostPrice,
  CostSortByCurrentPrice,
  CostSortByPortfolio,
  EmulationsPageView,
  EmulationsTimeSpent,
  SortByCurrentValue,
  SortByGainAmount,
  SortByGainLoss,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";
import {
  getAllCounterFeeApi,
  getAllFeeApi,
  getAvgCostBasis,
  updateCounterParty,
  updateFeeGraph,
} from "../cost/Api.js";

// add wallet
import { toast } from "react-toastify";
import { ExportIconWhite } from "../../assets/images/icons/index.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  CurrencyType,
  TruncateText,
  convertNtoNumber,
  mobileCheck,
  numToCurrency,
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
import ExitOverlay from "../common/ExitOverlay.js";
import Footer from "../common/footer.js";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import AssetUnrealizedProfitAndLossMobile from "./EmulationsMobile.js";

class Emulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Average_cost_basis_local: [],
      firstTimeUnrealizedPNL: true,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      exportHeaderTitle: "Download all unrealized profit and loss",
      exportHeaderSubTitle: "Export your unrealized profit and loss from Loch",
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
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
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
    CostAvgCostBasisExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download unrealized profit and loss",
        exportHeaderSubTitle:
          "Export your unrealized profit and loss from Loch",
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
    EmulationsPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCostTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
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
      this.props.updateWalletListFlag("assetsPage", true);

      this.props.getAllCoins();

      this.props.getAvgCostBasis(this);
      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.assetsPage) {
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
      window.sessionStorage.getItem("costPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("costPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkCostTimer);
    window.sessionStorage.removeItem("costPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      EmulationsTimeSpent({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem("costPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem("costPageExpiryTime");
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
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
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

  render() {
    const columnData = [
      {
        labelName: (
          <div
            className="history-table-header-col"
            id="Average Cost Price"
            // onClick={() => this.handleSort(this.state.sortBy[1])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Copied wallet
            </span>
          </div>
        ),
        dataKey: "Copiedwallet",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Copiedwallet") {
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address">
                {TruncateText("exyzabcd")}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col" id="Mycopytradedeposit">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My copy trade deposit
            </span>
          </div>
        ),
        dataKey: "Mycopytradedeposit",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Mycopytradedeposit") {
            return (
              <div>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.CurrentPrice
                      ? CurrencyType(false) +
                        convertNtoNumber(rowData.CurrentPrice)
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {rowData.CurrentPrice
                      ? CurrencyType(false) +
                        numToCurrency(
                          rowData.CurrentPrice.toFixed(2)
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </span>
                </CustomOverlay>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col" id="Mycurrentbalance">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My current balance
            </span>
          </div>
        ),
        dataKey: "Mycurrentbalance",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Mycurrentbalance") {
            return (
              <span>
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
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {rowData.Amount
                      ? numToCurrency(rowData.Amount).toLocaleString("en-US")
                      : "0"}
                  </span>
                </CustomOverlay>
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col"
            id="Transactions"
            onClick={() => this.handleSort(this.state.sortBy[4])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Transactions
            </span>
          </div>
        ),
        dataKey: "Transactions",

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Transactions") {
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address">
                View
              </span>
            );
          }
        },
      },
    ];

    if (mobileCheck()) {
      return (
        <MobileLayout
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
        >
          <AssetUnrealizedProfitAndLossMobile
            columnData={columnData}
            handleShare={this.handleShare}
            tableData={this.state.Average_cost_basis_local}
            AvgCostLoading={this.state.AvgCostLoading}
            showHideDustFun={this.handleDust}
            showHideDustVal={this.state.showDust}
          />
        </MobileLayout>
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
              <WelcomeCard
                handleShare={this.handleShare}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div className="cost-page-section">
          {this.state.connectModal ? (
            <ConnectModal
              show={this.state.connectModal}
              onHide={this.handleConnectModal}
              history={this.props.history}
              headerTitle={"Connect exchanges"}
              modalType={"connectModal"}
              iconImage={LinkIcon}
              updateTimer={this.updateTimer}
            />
          ) : (
            ""
          )}
          <div className="cost-section page">
            <TopWalletAddressList
              apiResponse={(e) => this.CheckApiResponse(e)}
              handleShare={this.handleShare}
            />
            {this.state.exportModal ? (
              <ExitOverlay
                show={this.state.exportModal}
                onHide={this.handleExportModal}
                history={this.history}
                headerTitle={this.state.exportHeaderTitle}
                headerSubTitle={this.state.exportHeaderSubTitle}
                modalType={"exportModal"}
                iconImage={ExportIconWhite}
                selectExportOption={this.state.exportSelectExportOption}
              />
            ) : null}
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
                from="cost"
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title="Portfolio Emulation"
              subTitle="All the trades you have copied"
              btnText="Add emulation"
              // handleBtn={this.handleAddModal}
              currentPage={"costs"}
              ShareBtn={true}
              exportBtnTxt="Click to export costs"
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
              mainThemeBtn
            />
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  message="No emulations found"
                  noSubtitleBottomPadding
                  tableData={this.state.Average_cost_basis_local}
                  columnList={columnData}
                  headerHeight={64}
                  comingSoon={false}
                  isArrow={false}
                  isLoading={this.state.AvgCostLoading}
                  isGainLoss={true}
                  isStickyHead={true}
                  addWatermark
                />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Emulations);
