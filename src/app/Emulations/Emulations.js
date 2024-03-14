import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader.js";
import { getAllCoins } from "../onboarding/Api.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import {
  CopyTradeAddCopyTrade,
  CopyTradeAvailableCopiedWalletClicked,
  CopyTradeCopiedWalletClicked,
  CopyTradeExecuteTradeModalOpen,
  CopyTradeExecuteTradeRejected,
  CopyTradePageView,
  CopyTradeTimeSpent,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";

// add wallet
import { Image } from "react-bootstrap";
import {
  EmultionSidebarIcon,
  ExportIconWhite,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons/index.js";
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
import MobileLayout from "../layout/MobileLayout.js";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal.js";
import { getCopyTrade, updaetAvailableCopyTraes } from "./EmulationsApi.js";
import EmulationsMobile from "./EmulationsMobile.js";
import EmulationsTradeModal from "./EmulationsTradeModal.js";
import "./_emulations.scss";

class Emulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      executeCopyTradeId: undefined,
      isExecuteCopyTrade: false,
      isLeftArrowDisabled: true,
      isRightArrowDisabled: false,
      currentCirclePosition: 0,
      userDetailsState: undefined,
      copyTradesAvailableLocal: [],
      emulationsUpdated: false,
      isAddCopyTradeAddress: false,
      copyTradesLocal: [],
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
    CopyTradeAddCopyTrade({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.state.userDetailsState && this.state.userDetailsState.email) {
      this.removeCopyTradeBtnClickedLocal();
      this.setState({
        isAddCopyTradeAddress: true,
      });
    } else {
      if (document.getElementById("sidebar-open-sign-in-btn-copy-trader")) {
        document.getElementById("sidebar-open-sign-in-btn-copy-trader").click();
        this.addCopyTradeBtnClickedLocal();
      } else if (
        document.getElementById("sidebar-closed-sign-in-btn-copy-trader")
      ) {
        this.addCopyTradeBtnClickedLocal();
        document
          .getElementById("sidebar-closed-sign-in-btn-copy-trader")
          .click();
      }
    }
  };
  hideAddCopyTradeAddress = (isRecall) => {
    this.removeCopyTradeBtnClickedLocal();
    this.setState({
      isAddCopyTradeAddress: false,
    });
    if (isRecall === true) {
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
      !(
        this.props.emulationsState &&
        this.props.emulationsState.copyTrades?.length > 0
      )
    ) {
      this.props.getAllCoins();
      this.props.GetAllPlan();
      this.props.getUser();
    } else {
      this.props.updateWalletListFlag("emulationsPage", true);
      this.setLocalEmulationList();
    }
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));

    if (userDetails) {
      this.setState(
        {
          userDetailsState: userDetails,
        },
        () => {
          const isLoginAttmepted = window.sessionStorage.getItem(
            "copyTradeLoginClicked"
          );

          if (isLoginAttmepted && isLoginAttmepted === "true") {
            setTimeout(() => {
              this.showAddCopyTradeAddress();
            }, 1500);
          }
        }
      );
    }

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkEmulationsTimer);
    };
  }
  addCopyTradeBtnClickedLocal = () => {
    window.sessionStorage.setItem("copyTradeLoginClicked", true);
  };
  removeCopyTradeBtnClickedLocal = () => {
    let isLoginClickedStored = window.sessionStorage.getItem(
      "copyTradeLoginClicked"
    );
    if (isLoginClickedStored) {
      window.sessionStorage.removeItem("copyTradeLoginClicked");
    }
  };
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
    this.props.getCopyTrade(this);
  };
  setLocalEmulationList = () => {
    if (this.props.emulationsState) {
      let tempEmulationsLocal = [];
      let tempEmulationsAvailableLocal = [];

      if (this.props.emulationsState.copyTrades) {
        tempEmulationsLocal = this.props.emulationsState.copyTrades;
      }
      if (this.props.emulationsState.availableCopyTrades) {
        tempEmulationsAvailableLocal =
          this.props.emulationsState.availableCopyTrades;
      }

      this.setState({
        emulationsLoading: false,
        copyTradesLocal: tempEmulationsLocal,
        copyTradesAvailableLocal: tempEmulationsAvailableLocal,
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
      const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (userDetails) {
        this.setState({
          userDetailsState: userDetails,
        });
      }
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
    this.removeCopyTradeBtnClickedLocal();
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
  hideExecuteCopyTrade = () => {
    this.setState({
      isExecuteCopyTrade: false,
    });
  };
  showExecuteCopyTrade = (passedTradeId) => {
    CopyTradeExecuteTradeModalOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState({
      isExecuteCopyTrade: true,
      executeCopyTradeId: passedTradeId,
    });
  };
  confirmOrRejectCopyTrade = (tradeId, isConfirm) => {
    let conRejData = new URLSearchParams();
    if (isConfirm) {
      conRejData.append("status", "CONFIRM");
    } else {
      CopyTradeExecuteTradeRejected({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        swapAddress: tradeId,
      });
      conRejData.append("status", "REJECT");
    }
    conRejData.append("trade_id", tradeId);
    this.props.updaetAvailableCopyTraes(conRejData, this.callEmulationsApi);
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

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Copiedwallet") {
            const regex = /\.eth$/;
            let holderValue = "-";
            if (rowData.wallet) {
              holderValue = rowData.wallet;
            }
            if (!regex.test(holderValue)) {
              holderValue = TruncateText(rowData.wallet);
            }
            return (
              <span
                onClick={() => {
                  if (rowData.wallet) {
                    let slink = rowData.wallet;
                    let shareLink =
                      BASE_URL_S3 + "home/" + slink + "?noPopup=true";

                    CopyTradeCopiedWalletClicked({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      wallet: slink,
                    });
                    window.open(shareLink, "_blank", "noreferrer");
                  }
                }}
                className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address"
                style={{
                  textDecoration: !rowData.wallet ? "none" : "",
                }}
              >
                {holderValue}
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

        coumnWidth: 0.2,
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

        coumnWidth: 0.2,
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
          <div className="history-table-header-col" id="MyunrealizedPnL">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              My unrealized PnL
            </span>
          </div>
        ),
        dataKey: "MyunrealizedPnL",

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "MyunrealizedPnL") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.unrealizedPnL
                    ? CurrencyType(false) +
                      convertNtoNumber(rowData.unrealizedPnL)
                    : CurrencyType(false) + "0.00"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.unrealizedPnL
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.unrealizedPnL.toFixed(2)
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

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Transactions") {
            const regex = /\.eth$/;
            let holderValue = "-";
            if (rowData.wallet) {
              holderValue = rowData.wallet;
            }
            if (!regex.test(holderValue)) {
              holderValue = TruncateText(rowData.wallet);
            }
            const goToTransactions = () => {
              this.props.history.push({
                pathname: "/copy-trade/transactions",
                state: {
                  passedAddress: holderValue,
                },
              });
            };
            return (
              <span
                onClick={goToTransactions}
                className="inter-display-medium f-s-13 lh-16 grey-313 top-account-address"
              >
                View
              </span>
            );
          }
        },
      },
    ];
    const newPosBase = () => {
      if (this.state.copyTradesAvailableLocal) {
        return this.state.copyTradesAvailableLocal.length;
      }
      return 1;
      // return this.state.tasksList.length;
    };

    const scrollRight = () => {
      if (this.state.isRightArrowDisabled) {
        return;
      }
      // UserCreditRightScrollClickedMP({
      //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
      //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
      // });
      var myElement = document.getElementById("availableCopyTradeScrollBody");
      var myElementWidth = document.getElementById(
        "availableCopyTradeScrollBody"
      ).clientWidth;
      var myElementCurrentScrollPos = document.getElementById(
        "availableCopyTradeScrollBody"
      ).scrollLeft;

      const newPos = myElementCurrentScrollPos + myElementWidth;
      myElement.scroll({
        left: newPos,
        behavior: "smooth",
      });
      let currentCirPos = newPos / myElementWidth;
      this.setState({
        currentCirclePosition: currentCirPos,
      });
      if (newPos === (newPosBase() - 1) * myElementWidth) {
        this.setState({
          isRightArrowDisabled: true,
          isLeftArrowDisabled: false,
        });
      } else {
        this.setState({
          isRightArrowDisabled: false,
          isLeftArrowDisabled: false,
        });
      }
    };
    const scrollLeft = () => {
      if (this.state.isLeftArrowDisabled) {
        return;
      }
      // UserCreditLeftScrollClickedMP({
      //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
      //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
      // });
      var myElement = document.getElementById("availableCopyTradeScrollBody");
      var myElementWidth = document.getElementById(
        "availableCopyTradeScrollBody"
      ).clientWidth;
      var myElementCurrentScrollPos = document.getElementById(
        "availableCopyTradeScrollBody"
      ).scrollLeft;
      const newPos = myElementCurrentScrollPos - myElementWidth;

      myElement.scroll({
        left: newPos,
        behavior: "smooth",
      });
      let currentCirPos = newPos / myElementWidth;
      this.setState({
        currentCirclePosition: currentCirPos,
      });
      if (newPos <= 0) {
        this.setState({
          isLeftArrowDisabled: true,
          isRightArrowDisabled: false,
        });
      } else {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: false,
        });
      }
    };
    const goToScrollPosition = (blockPos) => {
      var myElement = document.getElementById("availableCopyTradeScrollBody");
      var myElementWidth = document.getElementById(
        "availableCopyTradeScrollBody"
      ).clientWidth;
      myElement.scroll({
        left: myElementWidth * blockPos,
        behavior: "smooth",
      });
    };
    const handleAvailableTradeScroll = () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        var myElementWidth = document.getElementById(
          "availableCopyTradeScrollBody"
        ).clientWidth;
        var newPos = document.getElementById(
          "availableCopyTradeScrollBody"
        ).scrollLeft;
        let currentCirPos = newPos / myElementWidth;
        this.setState({
          currentCirclePosition: currentCirPos,
        });
        if (newPos === 0) {
          this.setState({
            isLeftArrowDisabled: true,
            isRightArrowDisabled: false,
          });
        } else if (newPos === (newPosBase() - 1) * myElementWidth) {
          this.setState({
            isLeftArrowDisabled: false,
            isRightArrowDisabled: true,
          });
        } else {
          this.setState({
            isLeftArrowDisabled: false,
            isRightArrowDisabled: false,
          });
        }
      }, 150);
    };
    const goToNewAddress = (passedAddress) => {
      CopyTradeAvailableCopiedWalletClicked({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        wallet: passedAddress,
      });
      let slink = passedAddress;
      let shareLink = BASE_URL_S3 + "home/" + slink + "?noPopup=true";

      window.open(shareLink, "_blank", "noreferrer");
    };
    if (mobileCheck()) {
      return (
        <MobileLayout
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          hideAddresses
          hideFooter
        >
          <EmulationsMobile
            addCopyTradeBtnClickedLocal={this.addCopyTradeBtnClickedLocal}
            userDetailsState={this.state.userDetailsState}
            columnData={columnData}
            tableData={this.state.copyTradesLocal}
            emulationsLoading={this.state.emulationsLoading}
            showHideDustFun={this.handleDust}
            showHideDustVal={this.state.showDust}
            emulationsUpdated={this.state.emulationsUpdated}
            isAddCopyTradeAddress={this.state.isAddCopyTradeAddress}
            hideAddCopyTradeAddress={this.hideAddCopyTradeAddress}
            showAddCopyTradeAddress={this.showAddCopyTradeAddress}
            scrollLeft={scrollLeft}
            scrollRight={scrollRight}
            isRightArrowDisabled={this.state.isRightArrowDisabled}
            isLeftArrowDisabled={this.state.isLeftArrowDisabled}
            goToScrollPosition={goToScrollPosition}
            currentCirclePosition={this.state.currentCirclePosition}
            availableCopyTrades={this.state.copyTradesAvailableLocal}
            handleAvailableTradeScroll={handleAvailableTradeScroll}
            history={this.props.history}
            updateTimer={this.updateTimer}
            isExecuteCopyTrade={this.state.isExecuteCopyTrade}
            showExecuteCopyTrade={this.showExecuteCopyTrade}
            hideExecuteCopyTrade={this.hideExecuteCopyTrade}
            confirmOrRejectCopyTrade={this.confirmOrRejectCopyTrade}
            goToNewAddress={this.goToNewAddress}
            executeCopyTradeId={this.state.executeCopyTradeId}
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
            {this.state.isExecuteCopyTrade ? (
              <EmulationsTradeModal
                show={this.state.isExecuteCopyTrade}
                executeCopyTradeId={this.state.executeCopyTradeId}
                confirmOrRejectCopyTrade={this.confirmOrRejectCopyTrade}
                onHide={this.hideExecuteCopyTrade}
                history={this.props.history}
                modalType={"connectModal"}
                updateTimer={this.updateTimer}
              />
            ) : null}
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
              currentPage={"copy-trade"}
              ShareBtn={true}
              exportBtnTxt="Click to export costs"
              updateTimer={this.updateTimer}
              handleBtn={this.showAddCopyTradeAddress}
              showpath
            />
            {this.state.userDetailsState &&
            this.state.userDetailsState.email &&
            this.state.copyTradesAvailableLocal &&
            this.state.copyTradesAvailableLocal.length > 0 &&
            !this.state.emulationsLoading ? (
              <div className="available-copy-trades-container">
                <div
                  id="availableCopyTradeScrollBody"
                  className="availableCopyTradeScrollBodyClass"
                  onScroll={handleAvailableTradeScroll}
                >
                  {this.state.copyTradesAvailableLocal.map(
                    (curTradeData, index) => {
                      return (
                        <div className="available-copy-trades">
                          <div className="available-copy-trades-content-container">
                            <Image
                              src={EmultionSidebarIcon}
                              className="available-copy-trades-icon"
                            />
                            <div className="inter-display-medium f-s-16">
                              Available Copy Trade
                            </div>
                            <div
                              onClick={() => {
                                goToNewAddress(curTradeData.copyAddress);
                              }}
                              className="inter-display-medium f-s-16 available-copy-trades-address"
                            >
                              {TruncateText(curTradeData.copyAddress)}
                            </div>
                          </div>
                          <div className="inter-display-medium f-s-16 available-copy-trades-transaction-container">
                            Swap {numToCurrency(curTradeData.valueFrom)}{" "}
                            {curTradeData.assetFrom} for{" "}
                            {numToCurrency(curTradeData.valueTo)}{" "}
                            {curTradeData.assetTo}
                            ? 
                          </div>
                          <div className="available-copy-trades-button-container">
                            <div
                              className={`topbar-btn`}
                              id="address-button-two"
                              onClick={() => {
                                this.confirmOrRejectCopyTrade(
                                  curTradeData.id,
                                  false
                                );
                              }}
                            >
                              <span className="dotDotText">Reject</span>
                            </div>
                            <div
                              className={`topbar-btn ml-2 topbar-btn-dark`}
                              onClick={() => {
                                this.showExecuteCopyTrade(curTradeData.id);
                              }}
                              id="address-button-two"
                            >
                              <span className="dotDotText">Confirm</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                {this.state.copyTradesAvailableLocal.length > 1 ? (
                  <div className="available-copy-trades-navigator">
                    <div className="available-copy-trades-navigator-circles-container">
                      {this.state.copyTradesAvailableLocal.map(
                        (resCircle, resCircleIndex) => {
                          return (
                            <div
                              style={{
                                opacity:
                                  resCircleIndex ===
                                  this.state.currentCirclePosition
                                    ? 1
                                    : 0.2,
                                marginLeft: resCircleIndex === 0 ? 0 : "0.5rem",
                              }}
                              onClick={() => {
                                goToScrollPosition(resCircleIndex);
                              }}
                              className="available-copy-trades-navigator-circle"
                            />
                          );
                        }
                      )}
                    </div>
                    <div className="available-copy-trades-navigator-arrows">
                      <Image
                        style={{
                          marginRight: "1rem",
                          opacity: this.state.isLeftArrowDisabled ? 0.5 : 1,
                        }}
                        onClick={scrollLeft}
                        className="availableCopyTradesArrowIcon"
                        src={UserCreditScrollLeftArrowIcon}
                      />
                      <Image
                        style={{
                          opacity: this.state.isRightArrowDisabled ? 0.5 : 1,
                        }}
                        onClick={scrollRight}
                        className="availableCopyTradesArrowIcon"
                        src={UserCreditScrollRightArrowIcon}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  message="No copy trades found"
                  noSubtitleBottomPadding
                  tableData={this.state.copyTradesLocal}
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
  getCopyTrade,
  updaetAvailableCopyTraes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Emulations);
