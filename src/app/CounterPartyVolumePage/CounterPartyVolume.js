import React, { Component } from "react";
import { connect } from "react-redux";
import BarGraphSection from "../common/BarGraphSection.js";
import PageHeader from "../common/PageHeader.js";
import { getAllCoins } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import moment from "moment/moment";
import LinkIcon from "../../assets/images/icons/link.svg";
import {
  CostAvgCostBasisExport,
  CostBlockchainFeesExport,
  CostCounterpartyFeesExport,
  CostShare,
  CounterpartyFeesTimeFilter,
  CounterpartyVolumePageTimeSpentMP,
  CounterpartyVolumePageViewMP,
  costFeesChainFilter,
  costVolumeChainFilter,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";
import {
  ResetAverageCostBasis,
  getAllCounterFeeApi,
  getAllFeeApi,
  updateAverageCostBasis,
  updateCounterParty,
  updateFeeGraph,
} from "../cost/Api.js";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData.js";

// add wallet
import { toast } from "react-toastify";
import { ExportIconWhite } from "../../assets/images/icons/index.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";
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

class CounterPartyVolume extends Component {
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
        exportHeaderTitle: "Download all blockchain fees",
        exportHeaderSubTitle: "Export your blockchain fees over time from Loch",
        exportSelectExportOption: 2,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };
  setCounterpartyVolumeExportModal = () => {
    CostCounterpartyFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download counterparty volume",
        exportHeaderSubTitle:
          "Export your counterparty volume over time from Loch",
        exportSelectExportOption: 3,
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
  counterpartyVolumeOverTimeOn = () => {
    if (!this.state.callCounterpartyVolumeOverTime) {
      this.setState({
        callCounterpartyVolumeOverTime: true,
      });
    }
  };
  counterpartyVolumeOverTimeOff = () => {
    if (this.state.callCounterpartyVolumeOverTime) {
      this.setState({
        callCounterpartyVolumeOverTime: false,
      });
    }
  };
  feesChainSearchIsUsed = () => {
    this.setState({ isFeesChainSearchUsed: true });
  };
  volumeChainSearchIsUsed = () => {
    this.setState({ isVolumeChainSearchUsed: true });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    CounterpartyVolumePageViewMP({
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
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    if (
      !this.props.commonState.counterpartyVolumePage ||
      !(
        this.props.intelligenceState.counterPartyValue &&
        this.props.intelligenceState.counterPartyValue[0]
      )
    ) {
      this.props.getAllCoins();
      this.getCounterPartyFee(0, true);
      this.props.GetAllPlan();
      this.props.getUser();
    } else {
      if (this.props.intelligenceState.counterPartyData) {
        this.props.updateCounterParty(
          this.props.intelligenceState.counterPartyData,
          getCounterGraphData(
            this.props.intelligenceState.counterPartyData,
            this
          ),
          this
        );
      }
      this.setState({
        counterGraphLoading: false,
      });
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
    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");

      this.props.getAllCoins();
      this.getCounterPartyFee(0);
      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.counterpartyVolumePage) {
      this.props.updateWalletListFlag("counterpartyVolumePage", true);
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

  getCounterPartyFee(option, first) {
    const today = moment().unix();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllCounterFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      this.props.getAllCounterFeeApi(this, fiveyear, today);
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      this.props.getAllCounterFeeApi(this, year, today);
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      this.props.getAllCounterFeeApi(this, sixmonth, today);
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      this.props.getAllCounterFeeApi(this, month, today);
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      this.props.getAllCounterFeeApi(this, week, today);
      handleSelected = "Week";
    }
    if (!first) {
      CounterpartyFeesTimeFilter({
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
      CounterpartyVolumePageTimeSpentMP({
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

  sortArray = (key, order) => {
    let array = this.props.intelligenceState?.Average_cost_basis; //all data
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
    this.props.updateAverageCostBasis(sortedList, this);
  };
  // sort

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=counterparty-volume";
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
              title="Counterparty volume over time"
              subTitle="Understand where you’ve exchanged the most value"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              currentPage={"counterparty-volume"}
              ShareBtn={true}
              ExportBtn
              exportBtnTxt="Click to export counterparty volume"
              handleExportModal={this.setCounterpartyVolumeExportModal}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />

            <div
              style={{
                position: "relative",
                // minHeight: "66.5rem",
                minWidth: "85rem",
                cursor: "pointer",
              }}
              id="counterpartyvolume"
            >
              <BarGraphSection
                data={
                  this.props.intelligenceState.counterPartyValue &&
                  this.props.intelligenceState.counterPartyValue[0]
                }
                options={
                  this.props.intelligenceState.counterPartyValue &&
                  this.props.intelligenceState.counterPartyValue[1]
                }
                options2={
                  this.props.intelligenceState.counterPartyValue &&
                  this.props.intelligenceState.counterPartyValue[2]
                }
                digit={this.state.counterGraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => this.getCounterPartyFee(e)}
                showFooter={true}
                showBadges={true}
                isScrollVisible={false}
                isScroll={true}
                isLoading={this.state.counterGraphLoading}
                // isLoading={true}
                handleBadge={(activeBadgeList) =>
                  this.handleBadge(activeBadgeList, 2)
                }
                // height={"400px"}
                // width={"824px"}
                // comingSoon={true}
                chainSearchIsUsed={this.volumeChainSearchIsUsed}
                oldBar
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

export default connect(mapStateToProps, mapDispatchToProps)(CounterPartyVolume);
