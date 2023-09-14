import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import { getAllInsightsApi } from "./Api";
import { BASE_URL_S3, InsightType } from "../../utils/Constant";
import Loading from "../common/Loading";
import { getAllWalletListApi } from "../wallet/Api";
import {
  AllInsights,
  InsightPage,
  InsightsIncreaseYield,
  InsightsReduceCost,
  InsightsReduceRisk,
  InsightsShare,
  RiskTypeDropdownClicked,
  RiskTypeHover,
  RiskTypeSelected,
  TimeSpentInsights,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import GradientImg from "../../assets/images/insight-upgrade.png";
import { getAllCoins } from "../onboarding/Api.js";
import { connect } from "react-redux";
import FixAddModal from "../common/FixAddModal";
import { GetAllPlan, getUser } from "../common/Api";
import UpgradeModal from "../common/upgradeModal";

import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import InsightImg from "../../assets/images/icons/insight-msg.svg";
import { toast } from "react-toastify";
import Footer from "../common/footer";
import DropDown from "../common/DropDown";
import WelcomeCard from "../Portfolio/WelcomeCard";
import "./intelligenceScss/_insightsPage.scss";
import {
  switchToDarkMode,
  switchToLightMode,
} from "../../utils/ReusableFunctions";
class InsightsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // insightList: "",
      isLoading: false,
      updatedInsightList: this.props.intelligenceState.updatedInsightList,
      selected: "",
      insightFilter: [
        {
          name: "All Insights",
          value: 1,
        },
        {
          name: "Reduce Cost",
          value: 10,
        },
        {
          name: "Reduce Risk",
          value: 20,
        },
        {
          name: "Increase Yield",
          value: 30,
        },
      ],
      selectedFilter: 1,

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 9,

      riskType: "All risks",

      // start time for time spent on page
      startTime: "",
    };
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    InsightPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkInsightsTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    // this.props.getAllInsightsApi(this);
    this.props.GetAllPlan();
    this.props.getUser();
    this.setState({});

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const addAddress = params.get("add-address");
    if (addAddress) {
      this.handleAddModal();
      this.props.history.replace("/intelligence/insights");
    }
    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkInsightsTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "insightsPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("insightsPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkInsightsTimer);
    localStorage.removeItem("insightsPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentInsights({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("insightsPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("insightsPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

    // used for filter
    if (
      prevProps.intelligenceState.updatedInsightList !==
      this.props.intelligenceState.updatedInsightList
    ) {
      this.setState({
        updatedInsightList: this.props.intelligenceState.updatedInsightList,
      });
    }

    if (!this.props.commonState.insight) {
      this.props.updateWalletListFlag("insight", true);
      this.setState({
        isLoading: true,
      });
      this.props.getAllInsightsApi(this);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }

    // if (this.state.apiResponse) {
    //   //  console.log("update");

    //   this.props.getAllInsightsApi(this);
    //   this.setState({
    //     apiResponse: false,
    //   });
    // }
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
      isLoading: true,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // wallet updated set all falg to default
    // this.props.updateWalletListFlag("home", false);
    this.props.setPageFlagDefault();
    // console.log("api respinse", value);
  };
  handleSelect = (value) => {
    // console.log("value",value)
    let insightList = this.props.intelligenceState.updatedInsightList;
    insightList = insightList?.filter((item) =>
      value === 1 ? item : item.insight_type === value
    );
    this.setState({
      selectedFilter: value,
      updatedInsightList: insightList,
      riskType: "All risks",
    });
    this.updateTimer();
    if (value === 1) {
      AllInsights({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      // console.log("All");
    } else if (value === 10) {
      InsightsReduceCost({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      //  console.log("Reduce Cost");
    } else if (value === 20) {
      InsightsReduceRisk({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      //  console.log("Reduce Risk");
    } else if (value === 30) {
      InsightsIncreaseYield({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else {
      // console.log("not valid value")
    }
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
      BASE_URL_S3 + "home/" + slink + "?redirect=intelligence/insights";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    InsightsShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();

    // console.log("share pod", shareLink);
  };

  handleInsights = (e) => {
    let title = e.split(" ")[1];
    if (e.split(" ")[2] !== undefined) {
      title = title + " " + e.split(" ")[2];
    }
    if (e.split(" ")[3] !== "undefined") {
      title = title + " " + e.split(" ")[3];
    }
    // console.log("title", title);
    this.setState(
      {
        riskType: title,
      },
      () => {
        RiskTypeSelected({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          type: title,
        });
        this.updateTimer();
        let riskType = InsightType.getRiskNumber(this.state.riskType);
        let insightList = this.props.intelligenceState.updatedInsightList;

        if (riskType !== 0) {
          insightList =
            this.state.selectedFilter === 1
              ? insightList?.filter((item) => item.sub_type === riskType)
              : insightList?.filter(
                  (item) =>
                    item.sub_type === riskType &&
                    item.insight_type === this.state.selectedFilter
                );
        } else {
          if (this.state.selectedFilter !== 1) {
            insightList = insightList?.filter(
              (item) => item.insight_type === this.state.selectedFilter
            );
          }
        }

        this.setState({
          updatedInsightList: insightList,
        });
      }
    );
  };
  onClickDropdown = () => {
    RiskTypeDropdownClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  onHoverDropdown = () => {
    RiskTypeHover({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  getTotalAssetValue = () => {
    if (this.props.portfolioState) {
      const tempWallet = this.props.portfolioState.walletTotal
        ? this.props.portfolioState.walletTotal
        : 0;
      const tempCredit = this.props.defiState.totalYield
        ? this.props.defiState.totalYield
        : 0;
      const tempDebt = this.props.defiState.totalDebt
        ? this.props.defiState.totalDebt
        : 0;

      return tempWallet + tempCredit - tempDebt;
    }
    return 0;
  };
  render() {
    return (
      <div className="insightsPageContainer">
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                assetTotal={this.getTotalAssetValue()}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div className="insightsSection m-t-80">
          <div className="insightsPage page">
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
                from="insights"
                updateTimer={this.updateTimer}
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
                pname="insight-page"
                updateTimer={this.updateTimer}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              <Button
                className="primary-btn white-bg"
                onClick={switchToDarkMode}
                style={{ transform: "scale(0.5)" }}
              >
                Dark Mode
              </Button>
              <Button
                className="primary-btn white-bg"
                onClick={switchToLightMode}
                style={{ transform: "scale(0.5)" }}
              >
                Light Mode
              </Button>
            </div>
            <PageHeader
              title={"Insights"}
              subTitle={"Valuable insights based on your assets"}
              showpath={true}
              currentPage={"insights"}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              handleShare={this.handleShare}
              // history={this.props.history}updateTimer={this.updateTimer}
            />
            <div style={{ position: "relative" }}>
              {
                // this.state.insightList && this.state.insightList.length > 0 &&
                <div className="insightsFilter">
                  {this.state.insightFilter?.map((filter, key) => {
                    return (
                      <div
                        key={key}
                        id={key}
                        className={`filter ${
                          filter.value === this.state.selectedFilter
                            ? "active"
                            : ""
                        }`}
                        onClick={() => this.handleSelect(filter.value)}
                      >
                        {filter.name}
                      </div>
                    );
                  })}
                </div>
              }
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h2 className="interDisplayMediumText f-s-25 l-h-30">
                  This week
                </h2>

                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={this.onClickDropdown}
                  onMouseEnter={this.onHoverDropdown}
                >
                  <DropDown
                    class="insightDropdown"
                    list={[
                      "All risks",
                      "Token Float Risk",
                      "Borrower Risk",
                      "Unlock Risk",
                      "Lender Risk",
                      "Market Cap Risk",
                      "Staking Risk",
                      "Discoverability Risk",
                      "Concentration Risk",
                    ]}
                    onSelect={this.handleInsights}
                    title={this.state.riskType}
                    activetab={this.state.riskType}
                  />
                </div>
              </div>
              <div className="insightsWrapper">
                {/* <h2 className="interDisplayMediumText f-s-25 lh-30 black-191">This week</h2> */}
                {this.state.isLoading ? (
                  <Loading />
                ) : this.state.updatedInsightList &&
                  this.state.updatedInsightList.length > 0 ? (
                  this.state.updatedInsightList?.map((insight, key) => {
                    return (
                      <div className="insightsCard" key={key}>
                        <Image
                          src={
                            insight.insight_type === InsightType.COST_REDUCTION
                              ? reduceCost
                              : insight.insight_type ===
                                InsightType.RISK_REDUCTION
                              ? reduceRisk
                              : increaseYield
                          }
                          className="insight-icon"
                        />
                        <div className="insights-content">
                          <div className="chips-wrapper">
                            <h5 className="interDisplayBoldText f-s-10 lh-12 titleChip">
                              {InsightType.getText(insight.insight_type)}
                            </h5>
                            {insight?.sub_type && (
                              <h5 className="interDisplayBoldText f-s-10 lh-12 riskChip">
                                {InsightType.getRiskType(insight.sub_type)}
                              </h5>
                            )}
                          </div>
                          <p
                            className="interDisplayMediumText f-s-13 lh-16 interDisplaySubText"
                            dangerouslySetInnerHTML={{
                              __html: insight.sub_title,
                            }}
                          ></p>
                          <h4
                            className="interDisplayMediumText f-s-16 lh-19"
                            dangerouslySetInnerHTML={{ __html: insight.title }}
                          ></h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  this.state.userPlan.name !== "Free" && (
                    <>
                      <div
                        style={{
                          // height:
                          //   this.props.intelligenceState.updatedInsightList
                          //     ?.length === 0
                          //     ? "35rem"
                          //     : this.props.intelligenceState.updatedInsightList
                          //         ?.length === 1
                          //     ? "25rem"
                          //     : "16rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          position: "relative",
                          marginTop: "5rem",
                        }}
                        className="insightBlankCard"
                      >
                        <div className="insightBlankCardBlurBackground"></div>
                        <Image
                          src={InsightImg}
                          style={{ position: "relative" }}
                          className="invertFilter"
                        />
                        <h5
                          className="interDisplayMediumText f-s-16 lh-19 text-center"
                          style={{
                            marginBottom: "1rem",
                            width: "90%",
                            marginTop: "1.2rem",
                            position: "relative",
                          }}
                        >
                          Add all your wallets and exchanges to gain more
                          insights
                        </h5>
                        <p
                          className="interDisplayMediumText interDisplaySubText f-s-13 lh-15 text-center"
                          style={{ position: "relative" }}
                        >
                          Insights increase with your usage
                        </p>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
            {/* Upgrade Insight section */}
            {this.state.userPlan.name === "Free" && (
              <div className="Insight-upgrade-wrapper m-t-16">
                <div className="Insight-upgrade">
                  <Image src={GradientImg} />
                  <h3 className="interDisplayMediumText f-s-25 lh-30 m-b-5 text-center">
                    More insights with Loch
                  </h3>
                  <h5 className="interDisplayMediumText f-s-16 lh-19 grey-969 m-b-24 text-center">
                    Upgrade your plan
                  </h5>
                  <Button
                    className="secondary-btn text-center"
                    onClick={this.upgradeModal}
                  >
                    Upgrade
                  </Button>
                </div>
                <div className="inner-box"></div>
                <div className="inner-box2"></div>
              </div>
            )}
          </div>
          {/* footer */}
          <div className="footerContainer">
            <Footer />
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
  portfolioState: state.PortfolioState,
  defiState: state.DefiState,
});

const mapDispatchToProps = {
  getAllCoins,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  GetAllPlan,
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsPage);
