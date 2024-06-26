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
  CostShare,
  CounterpartyFeesTimeFilter,
  FeesTimePeriodFilter,
  GasFeesPageTimeSpentMP,
  GasFeesPageViewMP,
  costFeesChainFilter,
  costVolumeChainFilter,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";
import { getAllFeeApi, updateFeeGraph } from "../cost/Api";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData";

// add wallet
import { toast } from "react-toastify";
import { ExportIconWhite } from "../../assets/images/icons/index.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  dontOpenLoginPopup,
  isPremiumUser,
  mobileCheck,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
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
import GasFeesMobile from "./GasFeesMobile.js";
import PaywallModal from "../common/PaywallModal.js";

class GasFeesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPremiumUser: false,
      isLochPaymentModal: false,
      selectedActiveBadgeLocal: [],
      graphfeeValueLocal: [],
      graphfeeDataLocal: {},
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
  setBlockChainFeesExportModal = () => {
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredGasFeesExportModal", true);
    CostBlockchainFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download all gas fees",
        exportHeaderSubTitle: "Export the gas fees over time from Loch",
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
  goToPayModal = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredGasFeesSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openGasFeesModal", true);
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
    scrollToTop();
    // const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    // if (userDetails && userDetails.email) {
    //   const shouldOpenNoficationModal =
    //     window.localStorage.getItem("openGasFeesModal");
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
    if (this.props.intelligenceState.graphfeeValue) {
      this.setState({
        graphfeeValueLocal: this.props.intelligenceState.graphfeeValue,
      });
    }
    this.props.updateFeeGraph(
      this.props.intelligenceState.GraphfeeData,
      getGraphData(
        this.props.intelligenceState.GraphfeeData,
        this,
        mobileCheck()
      ),
      this
    );
    if (this.props.intelligenceState.GraphfeeData) {
      this.setState({
        graphfeeDataLocal: this.props.intelligenceState.GraphfeeData,
      });
    }
    if (
      !this.props.commonState.gasFeesPage ||
      !(
        this.props.intelligenceState.graphfeeValue &&
        this.props.intelligenceState.graphfeeValue[0]
      )
    ) {
      this.props.getAllCoins();
      this.getBlockchainFee(0, true);

      this.props.GetAllPlan();
      this.props.getUser();
    } else {
      this.setState({
        gasFeesGraphLoading: false,
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
  setLocalGasFees = (passedGraphfeeData, passedGraphfeeValue) => {
    this.setState({
      graphfeeDataLocal: passedGraphfeeData,
      graphfeeValueLocal: passedGraphfeeValue,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.graphfeeValue !==
      this.props.intelligenceState.graphfeeValue
    ) {
      this.checkPremium();
      this.setState({
        graphfeeValueLocal: this.props.intelligenceState.graphfeeValue,
      });
    }
    if (
      prevProps.intelligenceState.GraphfeeData !==
      this.props.intelligenceState.GraphfeeData
    ) {
      this.checkPremium();
      this.setState({
        graphfeeDataLocal: this.props.intelligenceState.GraphfeeData,
      });
    }

    // add wallet
    if (
      prevState.apiResponse !== this.state.apiResponse ||
      !this.props.commonState.gasFeesPage
    ) {
      this.checkPremium();
      this.props.updateWalletListFlag("gasFeesPage", true);
      this.props.getAllCoins();
      this.getBlockchainFee(0);

      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.gasFeesPage) {
      this.props.updateWalletListFlag("gasFeesPage", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
    if (this.props.darkModeState !== prevProps.darkModeState) {
      this.props.updateFeeGraph(
        this.props.intelligenceState.GraphfeeData,
        getGraphData(this.props.intelligenceState.GraphfeeData, this),
        this
      );
      this.setState({
        selectedActiveBadgeLocal: [],
      });
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
    this.setState({
      selectedActiveBadgeLocal: [],
      gasFeesGraphLoading: true,
    });
    const today = moment().valueOf();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").valueOf();

      this.props.getAllFeeApi(this, fiveyear, today, false);
      // console.log(fiveyear, today, "5 years");
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").valueOf();
      this.props.getAllFeeApi(this, year, today, false);
      // console.log(year, today, "1 year");
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").valueOf();

      this.props.getAllFeeApi(this, sixmonth, today, false);
      // console.log(sixmonth, today, "6 months");
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").valueOf();
      this.props.getAllFeeApi(this, month, today, false);
      // console.log(month, today, "1 month");
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").valueOf();
      this.props.getAllFeeApi(this, week, today, false);
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
      GasFeesPageTimeSpentMP({
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

  handleBadge = (activeBadgeList, type) => {
    this.setState({
      selectedActiveBadgeLocal: [...activeBadgeList],
    });
    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

    const GraphfeeData = this.state.graphfeeDataLocal;
    let graphDataMaster = [];

    if (type === 1) {
      GraphfeeData.gas_fee_overtime &&
        GraphfeeData.gas_fee_overtime?.map((tempGraphData) => {
          if (
            activeBadgeList &&
            (activeBadgeList.includes(tempGraphData?.chain?._id) ||
              activeBadgeList.includes(tempGraphData?.chain?.id) ||
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
        getGraphData(graphDataObj, this, mobileCheck()),
        this,
        false
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
    }
  };

  getCounterPartyFee(option, first) {
    this.setState({
      gasFeesGraphLoading: true,
    });
    const today = moment().unix();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      this.props.getAllFeeApi(this, fiveyear, today, false);
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      this.props.getAllFeeApi(this, year, today, false);
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      this.props.getAllFeeApi(this, sixmonth, today, false);
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      this.props.getAllFeeApi(this, month, today, false);
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      this.props.getAllFeeApi(this, week, today, false);
      handleSelected = "Week";
    } else {
      this.setState({
        counterGraphLoading: false,
      });
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

  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
    if (mobileCheck()) {
      return (
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          showpath
          currentPage={"gas-fees"}
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/gas-fees"}
              title="Understand Gas Fees with Loch"
              description="Unlimited wallets gas costs"
              hideBackBtn
              isMobile
            />
          ) : null}
          <GasFeesMobile
            goToPayModal={this.goToPayModal}
            isPremiumUser={this.state.isPremiumUser}
            counterGraphDigit={this.state.GraphDigit}
            counterPartyValueLocal={this.state.graphfeeValueLocal}
            counterGraphLoading={this.state.gasFeesGraphLoading}
            timeFunction={(e) => this.getBlockchainFee(e)}
            feesChainSearchIsUsed={this.feesChainSearchIsUsed}
            coinsList={this.props.OnboardingState.coinsList}
            selectedActiveBadgeLocal={this.state.selectedActiveBadgeLocal}
            handleBadge={(activeBadgeList) =>
              this.handleBadge(activeBadgeList, 1)
            }
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
              {/* welcome card */}
              <WelcomeCard
                showTopSearchBar
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
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
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/gas-fees"}
              title="Understand Gas Fees with Loch"
              description="Unlimited wallets gas costs"
              hideBackBtn
            />
          ) : null}
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
              showpath
              currentPage={"gas-fees"}
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
              title="Gas fees over time"
              subTitle="Understand the gas costs"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
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
                maxWidth: "120rem",
                width: "120rem",
              }}
              id="gasfeesspent"
            >
              <BarGraphSection
                showPremiumHover={!this.state.isPremiumUser}
                goToPayModal={this.goToPayModal}
                isBlurred={!this.state.isPremiumUser}
                data={
                  this.state.graphfeeValueLocal &&
                  this.state.graphfeeValueLocal[0]
                }
                options={
                  this.state.graphfeeValueLocal &&
                  this.state.graphfeeValueLocal[1]
                }
                options2={
                  this.state.graphfeeValueLocal &&
                  this.state.graphfeeValueLocal[2]
                }
                digit={this.state.GraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                selectedActiveBadge={this.state.selectedActiveBadgeLocal}
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
                isCounterPartyGasFeesPage
                floatingWatermark
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
  darkModeState: state.darkModeState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllFeeApi,

  // avg cost

  // update counter party

  // update fee
  updateFeeGraph,
  setPageFlagDefault,

  // average cost

  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(GasFeesPage);
