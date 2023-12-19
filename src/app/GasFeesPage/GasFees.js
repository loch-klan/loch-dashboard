import React, { Component } from "react";
import BarGraphSection from "../common/BarGraphSection.js";
import PageHeader from "../common/PageHeader.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";

import { getAllWalletListApi } from "../wallet/Api.js";

import {
  TimeSpentCosts,
  FeesTimePeriodFilter,
  CostsPage,
  CostShare,
  costFeesChainFilter,
  costVolumeChainFilter,
  CostAvgCostBasisExport,
  CostBlockchainFeesExport,
  GasFeesPageViewMP,
  GasFeesPageTimeSpentMP,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData";
import {
  getAllFeeApi,
  getAllCounterFeeApi,
  updateCounterParty,
  updateFeeGraph,
  updateAverageCostBasis,
  ResetAverageCostBasis,
} from "../cost/Api";
import moment from "moment/moment";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { toast } from "react-toastify";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import ExitOverlay from "../common/ExitOverlay.js";
import { ExportIconWhite } from "../../assets/images/icons/index.js";
import Footer from "../common/footer.js";

class GasFeesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  setBlockChainFeesExportModal = () => {
    CostBlockchainFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download all gas fees",
        exportHeaderSubTitle: "Export your gas fees over time from Loch",
        exportSelectExportOption: 2,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };

  feesOverTimeOn = () => {
    if (!this.state.callFeesOverTime) {
      this.setState({
        callFeesOverTime: true,
      });
    }
  };
  feesOverTimeOff = () => {
    if (this.state.callFeesOverTime) {
      this.setState({
        callFeesOverTime: false,
      });
    }
  };

  feesChainSearchIsUsed = () => {
    this.setState({ isFeesChainSearchUsed: true });
  };

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    GasFeesPageViewMP({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCostTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }

    this.props.getAllCoins();
    this.getBlockchainFee(0, true);

    this.props.GetAllPlan();
    this.props.getUser();

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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.Average_cost_basis !==
      this.props.intelligenceState.Average_cost_basis
    ) {
      let array = this.props.intelligenceState?.Average_cost_basis?.filter(
        (e) => e.CurrentValue < 1
      );

      if (array.length > 0 && this.state.showDust) {
        let array = this.props.intelligenceState?.Average_cost_basis?.filter(
          (e) => e.CurrentValue >= 1
        );
        this.props.updateAverageCostBasis(array, this);
      } else {
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
          tempcombinedUnrealizedGains =
            this.props.intelligenceState?.total_gain;
        }

        this.setState({
          combinedCostBasis: tempcombinedCostBasis,
          combinedCurrentValue: tempcombinedCurrentValue,
          combinedUnrealizedGains: tempcombinedUnrealizedGains,
          combinedReturn: tempcombinedReturn,
        });
      }
    }
    // add wallet
    if (prevState.apiResponse !== this.state.apiResponse) {
      // console.log("update");

      this.props.getAllCoins();
      this.getBlockchainFee(0);

      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.cost) {
      this.props.updateWalletListFlag("cost", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
  }

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
    // console.log("api respinse", value);
    this.props.setPageFlagDefault();
  };

  getBlockchainFee(option, first) {
    const today = moment().valueOf();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").valueOf();

      this.props.getAllFeeApi(this, fiveyear, today);
      // console.log(fiveyear, today, "5 years");
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").valueOf();
      this.props.getAllFeeApi(this, year, today);
      // console.log(year, today, "1 year");
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").valueOf();

      this.props.getAllFeeApi(this, sixmonth, today);
      // console.log(sixmonth, today, "6 months");
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").valueOf();
      this.props.getAllFeeApi(this, month, today);
      // console.log(month, today, "1 month");
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").valueOf();
      this.props.getAllFeeApi(this, week, today);
      // console.log(week, today, "week");
      handleSelected = "Week";
    }
    // console.log("handle select", handleSelected);
    if (!first) {
      FeesTimePeriodFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_period_selected: handleSelected,
      });
      this.updateTimer();
    }
  }

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
      GasFeesPageTimeSpentMP({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
      this.props.ResetAverageCostBasis(this);
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

  handleBadge = (activeBadgeList, type) => {
    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });
    const { GraphfeeData, counterPartyData } = this.props.intelligenceState;
    let graphDataMaster = [];
    let counterPartyDataMaster = [];
    if (type === 1) {
      GraphfeeData.gas_fee_overtime &&
        GraphfeeData.gas_fee_overtime?.map((tempGraphData) => {
          if (
            activeBadgeList &&
            (activeBadgeList.includes(tempGraphData?.chain?._id) ||
              activeBadgeList.length === 0)
          ) {
            graphDataMaster.push(tempGraphData);
          }
        });
      let gas_fee_overtime = graphDataMaster;
      let asset_prices = GraphfeeData.asset_prices;
      let graphDataObj = { asset_prices, gas_fee_overtime };
      // this.setState({
      //   graphfeeValue: getGraphData(graphDataObj, this),
      // });
      this.props.updateFeeGraph(
        GraphfeeData,
        getGraphData(graphDataObj, this),
        this
      );
      const tempIsSearchUsed = this.state.isFeesChainSearchUsed;
      costFeesChainFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedChains,
        isSearchUsed: tempIsSearchUsed,
      });
      this.updateTimer();
      this.setState({ isFeesChainSearchUsed: false });
    } else {
      counterPartyData &&
        counterPartyData?.map((tempGraphData) => {
          if (
            activeBadgeList &&
            (activeBadgeList.includes(tempGraphData?.chain?._id) ||
              activeBadgeList.length === 0)
          ) {
            counterPartyDataMaster.push(tempGraphData);
          }
        });
      // this.setState({
      //   counterPartyValue: getCounterGraphData(counterPartyDataMaster, this),
      // });
      this.props.updateCounterParty(
        counterPartyData,
        getCounterGraphData(counterPartyDataMaster, this),
        this
      );
      const tempIsSearchUsed = this.state.isVolumeChainSearchUsed;
      costVolumeChainFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedChains,
        isSearchUsed: tempIsSearchUsed,
      });
      this.updateTimer();
      this.setState({ isVolumeChainSearchUsed: false });
    }
  };
  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=gas-fees";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    CostShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
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
              title="Gas fees over time"
              subTitle="Understand your gas costs"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              showpath={true}
              currentPage={"gas-fees"}
              ShareBtn={true}
              ExportBtn
              exportBtnTxt="Click to export blockchain fees"
              handleExportModal={this.setBlockChainFeesExportModal}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />

            <div
              style={{
                position: "relative",
                // minHeight: "66.25rem",
                minWidth: "85rem",
              }}
              id="gasfeesspent"
            >
              <BarGraphSection
                data={
                  this.props.intelligenceState.graphfeeValue &&
                  this.props.intelligenceState.graphfeeValue[0]
                }
                options={
                  this.props.intelligenceState.graphfeeValue &&
                  this.props.intelligenceState.graphfeeValue[1]
                }
                options2={
                  this.props.intelligenceState.graphfeeValue &&
                  this.props.intelligenceState.graphfeeValue[2]
                }
                digit={this.state.GraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => {
                  this.getBlockchainFee(e);
                }}
                marginBottom="marginBot2point8"
                showFooter={true}
                showBadges={true}
                isScrollVisible={false}
                isScroll={true}
                isLoading={this.state.gasFeesGraphLoading}
                // isLoading={true}
                handleBadge={(activeBadgeList) =>
                  this.handleBadge(activeBadgeList, 1)
                }
                chainSearchIsUsed={this.feesChainSearchIsUsed}
                oldBar
                // height={420}
                // width={824}
                // comingSoon={false}
              />
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

  // update counter party
  updateCounterParty,
  // update fee
  updateFeeGraph,
  setPageFlagDefault,

  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(GasFeesPage);
