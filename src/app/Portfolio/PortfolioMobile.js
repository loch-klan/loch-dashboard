import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import {
  getCoinRate,
  getDetailsByLinkApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
  getExchangeBalances,
} from "./Api";
import { Form, Image } from "react-bootstrap";
import SearchIcon from "../../assets/images/icons/search-icon.svg";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api";
import {
  getAllInsightsApi,
  getAssetProfitLoss,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";
import {
  getAllCurrencyRatesApi,
  getDetectedChainsApi,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import { getAssetGraphDataApi } from "./Api";
import {
  getAvgCostBasis,
  ResetAverageCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import Loading from "../common/Loading";
import { GetAllPlan, getUser } from "../common/Api";
import "./_mobilePortfolio.scss";
import PieChart2 from "./PieChart2";
import Footer from "../common/footer";
import WelcomeCard from "./WelcomeCard";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  MacIcon,
  SharePortfolioIconWhite,
} from "../../assets/images/icons";
import { getCurrentUser } from "../../utils/ManageToken";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";
import {
  CostHideDustMobile,
  MobileHomePageView,
  Mobile_Home_Search_New_Address,
  Mobile_Home_Share,
  TimeSpentMobileHome,
} from "../../utils/AnalyticsFunctions";
import TransactionTable from "../intelligence/TransactionTable.js";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions.js";
import CoinChip from "../wallet/CoinChip.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";

class PortfolioMobile extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
      showPopupModal: true,
      showSearchIcon: false,
      showShareIcon: false,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      showHideDustVal:true
    };
  }
  searchIconLoaded = () => {
    this.setState({
      showSearchIcon: true,
    });
  };
  shareIconLoaded = () => {
    this.setState({
      showShareIcon: true,
    });
  };
  hideThePopupModal = () => {
    window.sessionStorage.setItem("mobileHomePagePopupModalHidden", true);
    this.setState({
      showPopupModal: false,
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    MobileHomePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkMobileHomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.Average_cost_basis !==
      this.props.intelligenceState.Average_cost_basis
    ) {
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
    }
  }
  componentDidMount() {
    if (this.props.intelligenceState.Average_cost_basis) {
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
    }
    getAllCurrencyRatesApi();
    const tempIsModalPopuRemoved = window.sessionStorage.getItem(
      "mobileHomePagePopupModalHidden"
    );
    if (tempIsModalPopuRemoved) {
      this.setState({
        showPopupModal: false,
      });
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);

    this.startPageView();
    this.updateTimer(true);
    return () => {
      clearInterval(window.checkMobileHomeTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("mobileHomePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkMobileHomeTimer);
    window.sessionStorage.removeItem("mobileHomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentMobileHome({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  handleDust = () => {
    this.setState({
      showHideDustVal: !this.state.showHideDustVal,
    });
    CostHideDustMobile({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  }
  handleShare = () => {
    Mobile_Home_Share({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=home";
    // navigator.clipboard.writeText(shareLink);
    this.copyTextToClipboard(shareLink);

    // HomeShare({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  };
  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  goToWelcome = () => {
    Mobile_Home_Search_New_Address({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.props.history.push("/welcome?FromMobileHome=true");
  };
  render() {
    const columnData = [
      // {
      //   labelName: "",
      //   dataKey: "Numbering",
      //   coumnWidth: 0.05,
      //   isCell: true,
      //   cell: (rowData, dataKey, index) => {
      //     if (dataKey === "Numbering" && index > -1) {
      //       return (
      //         <span className="inter-display-medium f-s-13">
      //           {Number(noExponents(index + 1)).toLocaleString("en-US")}
      //         </span>
      //       );
      //     }
      //   },
      // },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Asset"
            // onClick={() => this.handleSort(this.state.sortBy[0])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
          </div>
        ),
        dataKey: "Asset",

        coumnWidth: 0.12,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Asset") {
            if (dataIndex === 0) {
              return <span>Total:</span>;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData?.AssetCode ? rowData?.AssetCode : ""}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CoinChip
                    coin_img_src={rowData.Asset}
                    coin_code={rowData.AssetCode}
                    chain={rowData?.chain}
                  />
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Average Cost Price"
            // onClick={() => this.handleSort(this.state.sortBy[1])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Avg cost price
            </span>
          </div>
        ),
        dataKey: "AverageCostPrice",

        coumnWidth: 0.12,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "AverageCostPrice") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  !rowData.AverageCostPrice || rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.AverageCostPrice.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {!rowData.AverageCostPrice || rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      numToCurrency(
                        rowData.AverageCostPrice.toFixed(2)
                      ).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Current Price"
            // onClick={() => this.handleSort(this.state.sortBy[2])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current price
            </span>
          </div>
        ),
        dataKey: "CurrentPrice",

        coumnWidth: 0.12,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CurrentPrice") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.CurrentPrice
                    ? CurrencyType(false) +
                      Number(
                        noExponents(rowData.CurrentPrice.toFixed(2))
                      ).toLocaleString("en-US")
                    : "N/A"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.CurrentPrice
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.CurrentPrice.toFixed(2)
                      ).toLocaleString("en-US")
                    : "N/A"}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Amount"
            // onClick={() => this.handleSort(this.state.sortBy[3])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
          </div>
        ),
        dataKey: "Amount",

        coumnWidth: 0.12,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Amount") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.Amount
                    ? Number(noExponents(rowData.Amount)).toLocaleString(
                        "en-US"
                      )
                    : 0.0
                }
              >
                <span>
                  {numToCurrency(rowData.Amount).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Cost Basis"
            // onClick={() => this.handleSort(this.state.sortBy[4])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Cost basis
            </span>
          </div>
        ),
        dataKey: "CostBasis",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CostBasis") {
            if (dataIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    !this.state.combinedCostBasis ||
                    this.state.combinedCostBasis === 0
                      ? "N/A"
                      : CurrencyType(false) +
                        Number(
                          noExponents(this.state.combinedCostBasis.toFixed(2))
                        ).toLocaleString("en-US")
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span>
                        {!this.state.combinedCostBasis ||
                        this.state.combinedCostBasis === 0
                          ? "N/A"
                          : CurrencyType(false) +
                            numToCurrency(
                              this.state.combinedCostBasis.toFixed(2)
                            ).toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  !rowData.CostBasis || rowData.CostBasis === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.CostBasis.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span>
                      {!rowData.CostBasis || rowData.CostBasis === 0
                        ? "N/A"
                        : CurrencyType(false) +
                          numToCurrency(
                            rowData.CostBasis.toFixed(2)
                          ).toLocaleString("en-US")}
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
            className="cp history-table-header-col"
            id="Current Value"
            // onClick={() => this.handleSort(this.state.sortBy[5])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current value
            </span>
          </div>
        ),
        dataKey: "CurrentValue",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CurrentValue") {
            if (dataIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    this.state.combinedCurrentValue
                      ? CurrencyType(false) +
                        Number(
                          noExponents(
                            this.state.combinedCurrentValue.toFixed(2)
                          )
                        ).toLocaleString("en-US")
                      : "N/A"
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span>
                        {this.state.combinedCurrentValue
                          ? CurrencyType(false) +
                            numToCurrency(
                              this.state.combinedCurrentValue.toFixed(2)
                            ).toLocaleString("en-US")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.CurrentValue
                    ? CurrencyType(false) +
                      Number(
                        noExponents(rowData.CurrentValue.toFixed(2))
                      ).toLocaleString("en-US")
                    : "N/A"
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span>
                      {rowData.CurrentValue
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.CurrentValue.toFixed(2)
                          ).toLocaleString("en-US")
                        : "N/A"}
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
            className="cp history-table-header-col"
            id="Gainamount"
            // onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Unrealized gain
            </span>
          </div>
        ),
        dataKey: "GainAmount",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "GainAmount") {
            if (dataIndex === 0) {
              const tempDataHolder = numToCurrency(
                this.state.combinedUnrealizedGains
              );
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    this.state.combinedUnrealizedGains
                      ? CurrencyType(false) +
                        Math.abs(
                          Number(
                            noExponents(
                              this.state.combinedUnrealizedGains.toFixed(2)
                            )
                          )
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"
                  }
                  colorCode="#000"
                >
                  <div className="gainLossContainer">
                    <div className={`gainLoss`}>
                      {this.state.combinedUnrealizedGains !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            this.state.combinedUnrealizedGains < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="inter-display-medium f-s-13 lh-16 grey-313">
                        {tempDataHolder
                          ? CurrencyType(false) +
                            tempDataHolder.toLocaleString("en-US")
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            const tempDataHolder = numToCurrency(rowData.GainAmount);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.GainAmount
                    ? CurrencyType(false) +
                      Math.abs(
                        Number(noExponents(rowData.GainAmount.toFixed(2)))
                      ).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
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
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? CurrencyType(false) +
                          tempDataHolder.toLocaleString("en-US")
                        : "0.00"}
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
            className="cp history-table-header-col"
            id="Gain loss"
            // onClick={() => this.handleSort(this.state.sortBy[7])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Return
            </span>
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "GainLoss") {
            if (dataIndex === 0) {
              let tempDataHolder = undefined;
              if (this.state.combinedReturn) {
                tempDataHolder = Number(
                  noExponents(this.state.combinedReturn.toFixed(2))
                );
              }
              return (
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
                  <div className="gainLossContainer">
                    <div className={`gainLoss`}>
                      {this.state.combinedReturn !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            this.state.combinedReturn < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="inter-display-medium f-s-13 lh-16 grey-313">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            let tempDataHolder = undefined;
            if (rowData.GainLoss) {
              tempDataHolder = Number(noExponents(rowData.GainLoss.toFixed(2)));
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempDataHolder
                    ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                    : "0%"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
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
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"}
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
            className="cp history-table-header-col"
            id="Gain loss"
            // onClick={() => this.handleSort(this.state.sortBy[7])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Portfolio (%)
            </span>
          </div>
        ),
        dataKey: "PortfolioPercentage",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "PortfolioPercentage") {
            if (dataIndex === 0) {
              let tempTempVal = 100;
              let tempDataHolder = undefined;
              if (tempTempVal) {
                tempDataHolder = Number(noExponents(tempTempVal.toFixed(2)));
              }
              return (
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
                  <div className="gainLossContainer">
                    <div className={`gainLoss`}>
                      <span className="inter-display-medium f-s-13 lh-16 grey-313">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            let tempDataHolder = undefined;

            if (rowData.weight) {
              tempDataHolder = Number(noExponents(rowData.weight.toFixed(2)));
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempDataHolder
                    ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                    : "0%"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
                  <div className={`gainLoss`}>
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];
    return (
      <div className="mobilePortfolioContainer">
        {this.props.loader ? (
          <div className="mpLoadingContainer">
            <Loading />
          </div>
        ) : (
          <div className="mpcHomeContainer">
            {this.state.showPopupModal ? (
              <div className="mpcHomeFloatingContainer">
                <div className="mpcHomeFloatingElement">
                  <div className="mpcHFMacIconContainer">
                    <Image src={MacIcon} className="mpcHFMacIcon" />
                  </div>
                  <div className="mpcHFText inter-display-medium f-s-13">
                    Visit app.loch.one from your desktop for all the details
                  </div>
                  <div
                    onClick={this.hideThePopupModal}
                    className="mpcHFGoBtn inter-display-medium f-s-13"
                  >
                    Ok
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mpcMobileSearch">
              <div onClick={this.goToWelcome} className="mpcMobileSearchInput">
                <Image
                  style={{
                    opacity: this.state.showSearchIcon ? 1 : 0,
                  }}
                  onLoad={this.searchIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SearchIcon}
                />
                <div className="mpcMobileSearchPlaceholder inter-display-medium f-s-12">
                  Search for another address / ENS
                </div>
              </div>
              <div className="mpcMobileShare" onClick={this.handleShare}>
                <Image
                  style={{
                    opacity: this.state.showShareIcon ? 1 : 0,
                  }}
                  onLoad={this.shareIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SharePortfolioIconWhite}
                />
              </div>
            </div>
            <div className="mpcHomePage">
              <WelcomeCard
                handleShare={this.handleShare}
                isSidebarClosed={this.props.isSidebarClosed}
                changeWalletList={this.props.handleChangeList}
                apiResponse={(e) => this.props.CheckApiResponse(e)}
                showNetworth={true}
                // yesterday balance
                yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                // toggleAddWallet={this.state.toggleAddWallet}
                // handleToggleAddWallet={this.handleToggleAddWallet}

                // decrement={true}

                // total network and percentage calculate
                assetTotal={this.props.getTotalAssetValue()}
                // assetTotal={
                //   this.props.portfolioState &&
                //   this.props.portfolioState.walletTotal
                //     ? this.props.portfolioState.walletTotal +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                //     : 0 +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                // }
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.props.handleAddModal}
                // net worth total
                isLoading={this.props.isLoadingNet}
                // walletTotal={
                //   this.props.portfolioState.walletTotal +
                //   this.state.totalYield -
                //   this.state.totalDebt
                // }

                // manage wallet
                handleManage={() => {}}
                isMobileRender
              />
              <PieChart2
                setLoader={this.props.setLoader}
                chainLoader={this.props.chainLoader}
                totalChainDetechted={this.state.totalChainDetechted}
                userWalletData={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainWallet &&
                  Object.keys(this.props.portfolioState.chainWallet).length > 0
                    ? Object.values(this.props.portfolioState.chainWallet)
                    : null
                }
                chainPortfolio={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainPortfolio &&
                  Object.keys(this.props.portfolioState.chainPortfolio).length >
                    0
                    ? Object.values(this.props.portfolioState.chainPortfolio)
                    : null
                }
                allCoinList={
                  this.props.OnboardingState &&
                  this.props.OnboardingState.coinsList &&
                  Object.keys(this.props.OnboardingState.coinsList).length > 0
                    ? Object.values(this.props.OnboardingState.coinsList)
                    : null
                }
                assetTotal={this.props.getTotalAssetValue()}
                assetPrice={
                  this.props.portfolioState.assetPrice &&
                  Object.keys(this.props.portfolioState.assetPrice).length > 0
                    ? Object.values(this.props.portfolioState.assetPrice)
                    : null
                }
                isLoading={this.props.isLoading}
                isUpdate={this.props.isUpdate}
                walletTotal={this.props.portfolioState.walletTotal}
                // handleAddModal={this.handleAddModal}
                // handleManage={() => {
                //   this.props.history.push("/wallets");
                //   ManageWallets({
                //     session_id: getCurrentUser().id,
                //     email_address: getCurrentUser().email,
                //   });
                // }}
                undetectedWallet={(e) => this.props.undetectedWallet(e)}
                getProtocolTotal={this.props.getProtocolTotal}
                updateTimer={this.props.updateTimer}
              />
              <div className="d-flex justify-content-between" style={{
                    marginTop: "3rem",
                    alignItems:"start"
                  }}>
                
              <div>
                <h2
                  className="inter-display-semi-bold f-s-16 lh-19 grey-313 m-b-5"
                >
                  {/* Unrealized profit and loss */}
                  Assets
                </h2>
                <p
                  class="inter-display-medium f-s-13 lh-16 grey-ADA"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Scroll left and right to view more
                </p>
              </div>
                  <div className="d-flex" style={{alignItems:'center', paddingTop:'2px'}}>

                    
                <div onClick={this.handleDust} className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn">
                    <Form.Check
                      type="switch"
                      checked={this.state.showHideDustVal}
                      // onChange={(e) => {
                      //   this.setState({
                      //     switchselected: e.target.checked,
                      //   });
                      //   if (this.props.setSwitch) {
                      //     this.props.setSwitch();
                      //   }
                      // }}
                      label={
                        this.state.showHideDustVal
                          ? "Reveal dust (less than $1)"
                          : "Hide dust (less than $1)"
                      }
                    />
                  </div>
                  </div>
                </div>
              <div className="section-table section-table-mobile-scroll">
                {/* <div className="section-table-mobile-scroll-top-cover" /> */}
                <TransactionTable
                  noSubtitleBottomPadding
                  disableOnLoading
                  isMiniversion
                  title=""
                  handleClick={() => {
                    if (this.state.lochToken) {
                      this.props.history.push("/intelligence/costs");
                      // AverageCostBasisEView({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }
                  }}
                  message=" "
                  subTitle=""
                  tableData={
                    this.props.intelligenceState.Average_cost_basis &&
                    this.props.intelligenceState.Average_cost_basis.length < 1
                      ?
                      []
                      :
                      (this.state.showHideDustVal && this.props.intelligenceState.Average_cost_basis.filter((item) => {
                        return item.CurrentValue > 1;
                      }).length > 0)
                      ? 
                      [
                        {},
                        ...this.props.intelligenceState.Average_cost_basis.filter((item) => {
                          return item.CurrentValue > 1;
                        })
                      ]
                      :
                      (this.state.showHideDustVal && this.props.intelligenceState.Average_cost_basis.filter((item) => {
                        return item.CurrentValue > 1;
                      }).length < 1)
                      ? 
                      []
                      :
                       [{}, ...this.props.intelligenceState.Average_cost_basis]
                  }
                  columnList={columnData}
                  headerHeight={60}
                  isArrow={true}
                  // isLoading={this.props.AvgCostLoading}
                  isAnalytics="average cost basis"
                  addWatermark
                  xAxisScrollable
                  // yAxisScrollable
                />
              </div>
              <div className="mobileFooterContainer">
                <div>
                  <Footer isMobile />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  defiState: state.DefiState,
});
const mapDispatchToProps = {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
  getAllCoins,
  getAllParentChains,
  searchTransactionApi,
  getAssetGraphDataApi,
  getDetailsByLinkApi,
  getProfitAndLossApi,
  // getExchangeBalance,
  getExchangeBalances,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  // avg cost
  getAvgCostBasis,
  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
  getAssetProfitLoss,
  getDetectedChainsApi,
  GetAllPlan,
  getUser,
};
PortfolioMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMobile);
