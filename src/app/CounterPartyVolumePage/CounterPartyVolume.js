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
  getAllCounterFeeApi,
  updateCounterParty,
  updateFeeGraph,
} from "../cost/Api.js";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData.js";

// add wallet
import { toast } from "react-toastify";
import { ExportIconWhite } from "../../assets/images/icons/index.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  mobileCheck,
  numToCurrency,
  openAddressInSameTab,
  removeBlurMethods,
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
import CounterPartyVolumeMobile from "./CounterPartyVolumeMobile.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import CustomTableBtn from "../common/CustomTableBtn.js";

class CounterPartyVolume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileDevice: false,
      counterPartyDataLocal: [],
      counterPartyValueLocal: [],
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
    CostBlockchainFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download all blockchain fees",
        exportHeaderSubTitle: "Export the blockchain fees over time from Loch",
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
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredCounterPartyExportModal", true);
    CostCounterpartyFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download counterparty volume",
        exportHeaderSubTitle:
          "Export the counterparty volume over time from Loch",
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
  setLocalCounterParty = (passedGraphfeeData, passedGraphfeeValue) => {
    this.setState({
      counterPartyDataLocal: passedGraphfeeData,
      counterPartyValueLocal: passedGraphfeeValue,
    });
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    scrollToTop();
    if (
      !this.props.commonState.counterpartyVolumePage ||
      !(
        this.props.intelligenceState.counterPartyValue &&
        this.props.intelligenceState.counterPartyValue[0]
      )
    ) {
      // this.props.getAllCoins();
      this.getCounterPartyFee(0, true);
      // this.props.GetAllPlan();
      // this.props.getUser();
    } else {
      this.setState({
        counterGraphLoading: false,
        counterPartyDataLocal: this.props.intelligenceState.counterPartyData,
        counterPartyValueLocal: getCounterGraphData(
          this.props.intelligenceState.counterPartyData,
          this
        ),
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
    // add wallet
    if (
      this.props.intelligenceState.counterPartyData !==
      prevProps.intelligenceState.counterPartyData
    ) {
      this.setState({
        counterPartyDataLocal: this.props.intelligenceState.counterPartyData,
        counterPartyValueLocal: this.props.intelligenceState.counterPartyValue,
      });
    }
    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");

      // this.props.getAllCoins();
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
    if (this.props.darkModeState != prevProps.darkModeState) {
      this.props.updateCounterParty(
        this.props.intelligenceState.counterPartyData,
        getCounterGraphData(
          this.props.intelligenceState.counterPartyData,
          this
        ),
        this
      );
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
    this.setState({
      counterGraphLoading: true,
    });
    const today = moment().unix();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllCounterFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      this.props.getAllCounterFeeApi(this, fiveyear, today, false);
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      this.props.getAllCounterFeeApi(this, year, today, false);
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      this.props.getAllCounterFeeApi(this, sixmonth, today, false);
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      this.props.getAllCounterFeeApi(this, month, today, false);
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      this.props.getAllCounterFeeApi(this, week, today, false);
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
      CounterpartyVolumePageTimeSpentMP({
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
    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });
    const { GraphfeeData } = this.props.intelligenceState;
    const counterPartyData = [...this.state.counterPartyDataLocal];
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

  // sort

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
    console.log(
      "this.props.intelligenceState.counterPartyData ",
      this.props.intelligenceState.counterPartyData
    );
    const columnList = [
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Rank</span>
          </div>
        ),
        dataKey: "counterRank",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "counterRank") {
            return (
              <span
                style={{
                  textDecoration: "none",
                  pointerEvents: "none",
                }}
                className="top-account-address table-data-font"
              >
                {dataIndex + 1}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Account</span>
          </div>
        ),
        dataKey: "counterAddress",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "counterAddress") {
            if (rowData.clickable_address) {
              return (
                <span
                  onClick={() => {
                    openAddressInSameTab(
                      rowData.clickable_address,
                      this.props.setPageFlagDefault
                    );
                  }}
                  className="top-account-address table-data-font"
                >
                  {TruncateText(rowData.clickable_address)}
                </span>
              );
            }
            return (
              <span
                style={{
                  textDecoration: "none",
                  pointerEvents: "none",
                }}
                className="top-account-address table-data-font"
              >
                {rowData._id}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Volume</span>

            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "counterVolume",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "counterVolume") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.total_volume
                    ? CurrencyType(false) +
                      amountFormat(rowData.total_volume, "en-US", "USD")
                    : CurrencyType(false) + "0.00"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                  {rowData.total_volume
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.total_volume.toFixed(2)
                      ).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Fees</span>
          </div>
        ),
        dataKey: "counterFees",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "counterFees") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.total_fees_amount
                    ? CurrencyType(false) +
                      amountFormat(rowData.total_fees_amount, "en-US", "USD")
                    : CurrencyType(false) + "0.00"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                  {rowData.total_fees_amount
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.total_fees_amount.toFixed(2)
                      ).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Count</span>
          </div>
        ),
        dataKey: "counterCount",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "counterCount") {
            return (
              <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                {rowData.total_fees_amount ? (dataIndex + 1) * 100 : "0"}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Action</span>
          </div>
        ),
        dataKey: "counterFollow",

        coumnWidth: 0.16666667,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "counterFollow") {
            const handleOnClick = (addItem) => {
              // if (this.props.justShowTable) {
              //   this.props.passedActionFun(rowData.account);
              // } else {
              //   this.handleFollowUnfollow(
              //     rowData.account,
              //     addItem,
              //     rowData.tagName
              //   );
              // }
            };
            return (
              <CustomTableBtn
                isChecked={rowData.following}
                handleOnClick={handleOnClick}
                checkedText={"Following"}
                uncheckedText={"Follow"}
              />
            );
          }
        },
      },
    ];
    if (this.state.isMobileDevice) {
      return (
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          history={this.props.history}
          CheckApiResponse={(e) => this.CheckApiResponse(e)}
          showpath
          currentPage={"counterparty-volume"}
        >
          <CounterPartyVolumeMobile
            tableData={this.state.counterPartyDataLocal}
            columnData={columnList}
            counterGraphDigit={this.state.counterGraphDigit}
            counterPartyValueLocal={this.state.counterPartyValueLocal}
            counterGraphLoading={this.state.counterGraphLoading}
            timeFunction={(e) => this.getCounterPartyFee(e)}
          />
        </MobileLayout>
      );
    }
    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section scroll-bar-affects-parent">
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
          <div className="cost-section page-scroll">
            <div className="page-scroll-child">
              <TopWalletAddressList
                apiResponse={(e) => this.CheckApiResponse(e)}
                handleShare={this.handleShare}
                showpath
                currentPage={"counterparty-volume"}
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
                subTitle="Understand where this portfolio has exchanged the most value"
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
                style={{ marginBottom: "2.8rem" }}
                className="cost-table-section"
              >
                <div style={{ position: "relative" }}>
                  <TransactionTable
                    noSubtitleBottomPadding
                    tableData={this.state.counterPartyDataLocal}
                    columnList={columnList}
                    message={"No counterparties found"}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage}
                    isLoading={this.state.counterGraphLoading}
                    addWatermark
                  />
                </div>
              </div>
              {/* <div
              style={{
                position: "relative",
                // minHeight: "66.5rem",
                minWidth: "85rem",
              }}
              id="counterpartyvolume"
            >
              <BarGraphSection
                data={
                  this.state.counterPartyValueLocal &&
                  this.state.counterPartyValueLocal[0]
                }
                options={
                  this.state.counterPartyValueLocal &&
                  this.state.counterPartyValueLocal[1]
                }
                options2={
                  this.state.counterPartyValueLocal &&
                  this.state.counterPartyValueLocal[2]
                }
                digit={this.state.counterGraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => this.getCounterPartyFee(e)}
                showFooter={true}
                // showBadges={true}
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
                floatingWatermark
                isCounterPartyGasFeesPage
              />
            </div> */}
              <Footer />
            </div>
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

  getAllCounterFeeApi,

  // avg cost

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

export default connect(mapStateToProps, mapDispatchToProps)(CounterPartyVolume);
