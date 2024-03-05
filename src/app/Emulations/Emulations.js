import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader.js";
import { getAllCoins } from "../onboarding/Api.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import {
  CopyTradePageView,
  CopyTradeTimeSpent,
  CopyTradeWalletClicked,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";

// add wallet
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
import MobileLayout from "../layout/MobileLayout.js";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal.js";
import { getEmulations } from "./EmulationsApi.js";
import EmulationsMobile from "./EmulationsMobile.js";
import "./_emulations.scss";

class Emulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emulationsUpdated: false,
      isAddCopyTradeAddress: false,
      emulationsLocal: [],
      startTime: "",
      emulationsLoading: true,
      showDust: true,
      connectModal: false,
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
    };
  }
  history = this.props;
  showAddCopyTradeAddress = () => {
    this.setState({
      isAddCopyTradeAddress: true,
    });
  };
  hideAddCopyTradeAddress = (isRecall) => {
    this.setState({
      isAddCopyTradeAddress: false,
    });
    if (isRecall) {
      this.callEmulationsApi();
    }
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    CopyTradePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkEmulationsTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    scrollToTop();
    if (
      !this.props.commonState.emulationsPage ||
      !(this.props.emulationsState && this.props.emulationsState.length > 0)
    ) {
      this.props.getAllCoins();
      this.props.GetAllPlan();
      this.props.getUser();
    } else {
      this.props.updateWalletListFlag("emulationsPage", true);
      this.setLocalEmulationList();
    }

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkEmulationsTimer);
    };
  }

  callEmulationsApi = (updatedAddress) => {
    if (updatedAddress) {
      this.setState({
        emulationsUpdated: !this.state.emulationsUpdated,
      });
    }
    this.setState({
      emulationsLoading: true,
    });
    this.props.updateWalletListFlag("emulationsPage", true);
    this.props.getEmulations(this);
  };
  setLocalEmulationList = () => {
    if (this.props.emulationsState) {
      this.setState({
        emulationsLoading: false,
        emulationsLocal: this.props.emulationsState,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAddCopyTradeAddress !== this.state.isAddCopyTradeAddress) {
      if (this.state.isAddCopyTradeAddress) {
        window.sessionStorage.setItem("copyTradeModalOpen", true);
      } else {
        if (window.sessionStorage.getItem("copyTradeModalOpen")) {
          window.sessionStorage.removeItem("copyTradeModalOpen");
        }
      }
    }
    if (prevProps.emulationsState !== this.props.emulationsState) {
      this.setLocalEmulationList();
    }
    // add wallet
    if (prevState.apiResponse !== this.state.apiResponse) {
      this.callEmulationsApi();
      this.props.getAllCoins();
      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.emulationsPage) {
      this.callEmulationsApi(true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
  }

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    this.props.setPageFlagDefault();
  };

  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("emulationsPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkEmulationsTimer);
    window.sessionStorage.removeItem("emulationsPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      CopyTradeTimeSpent({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "emulationsPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };

  render() {
    const columnData = [
      {
        labelName: (
          <div className="history-table-header-col" id="Average Cost Price">
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
              <span
                onClick={() => {
                  if (rowData.wallet) {
                    let slink = rowData.wallet;
                    let shareLink =
                      BASE_URL_S3 + "home/" + slink + "?noPopup=true";

                    CopyTradeWalletClicked({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      wallet: slink,
                    });
                    window.open(shareLink, "_blank", "noreferrer");
                  }
                }}
                className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address"
              >
                {rowData.wallet ? TruncateText(rowData.wallet) : "-"}
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
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.tradeDeposit
                    ? CurrencyType(false) +
                      convertNtoNumber(rowData.tradeDeposit)
                    : CurrencyType(false) + "0.00"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.tradeDeposit
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.tradeDeposit.toFixed(2)
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
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.currentBalance
                    ? CurrencyType(false) +
                      convertNtoNumber(rowData.currentBalance)
                    : CurrencyType(false) + "0.00"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.currentBalance
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.currentBalance.toFixed(2)
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
          <div className="history-table-header-col" id="Transactions">
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
          <EmulationsMobile
            columnData={columnData}
            tableData={this.state.emulationsLocal}
            emulationsLoading={this.state.emulationsLoading}
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
                history={this.history}
                headerTitle={this.state.exportHeaderTitle}
                headerSubTitle={this.state.exportHeaderSubTitle}
                modalType={"exportModal"}
                iconImage={ExportIconWhite}
                selectExportOption={this.state.exportSelectExportOption}
              />
            ) : null}
            {this.state.isAddCopyTradeAddress ? (
              <AddEmulationsAddressModal
                show={this.state.isAddCopyTradeAddress}
                onHide={this.hideAddCopyTradeAddress}
                history={this.props.history}
                location={this.props.location}
                emulationsUpdated={this.state.emulationsUpdated}
              />
            ) : null}
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
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
              title="Copy Trade"
              subTitle="All the wallet addresses you have copied"
              btnText="Add copy trade"
              mainThemeBtn
              currentPage={"emulations"}
              ShareBtn={true}
              exportBtnTxt="Click to export costs"
              updateTimer={this.updateTimer}
              handleBtn={this.showAddCopyTradeAddress}
            />
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  message="No copy trades found"
                  noSubtitleBottomPadding
                  tableData={this.state.emulationsLocal}
                  columnList={columnData}
                  headerHeight={64}
                  comingSoon={false}
                  isArrow={false}
                  isLoading={this.state.emulationsLoading}
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
  emulationsState: state.EmulationsState,
});
const mapDispatchToProps = {
  getAllCoins,

  // avg cost

  // update counter party

  // update fee

  setPageFlagDefault,

  // average cost

  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
  getEmulations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Emulations);
