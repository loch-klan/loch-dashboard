import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
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
import { BASE_URL_S3, InsightType } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import Loading from "../common/Loading";
import PageHeader from "../common/PageHeader";
import { getAllWalletListApi } from "../wallet/Api";
import { getAllInsightsApi, sendAmount } from "./Api";

// add wallet
import { connect } from "react-redux";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import GradientImg from "../../assets/images/insight-upgrade.png";
import { GetAllPlan, getUser } from "../common/Api";
import FixAddModal from "../common/FixAddModal";
import UpgradeModal from "../common/upgradeModal";
import { getAllCoins } from "../onboarding/Api.js";

import { toast } from "react-toastify";
import InsightImg from "../../assets/images/icons/insight-msg.svg";
import {
  dontOpenLoginPopup,
  isPremiumUser,
  mobileCheck,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import DropDown from "../common/DropDown";
import Footer from "../common/footer";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import InsightsPageMobile from "./InsightsPageMobile.js";

// Dark theme scss
import "./intelligenceScss/_darkInsightPage.scss";
import PaywallModal from "../common/PaywallModal.js";
import CustomOverlayUgradeToPremium from "../../utils/commonComponent/CustomOverlayUgradeToPremium.js";

class InsightsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPremiumUser: false,
      isLochPaymentModal: false,
      // insightList: "",
      isLoading: false,
      updatedInsightList: [],
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
      ],
      selectedFilter: 1,

      // add new wallet
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 9,

      riskType: "All risks",

      // start time for time spent on page
      startTime: "",
      sendAdd: "",
      receiveAdd: "",
      amount: "",
    };
  }
  sendAmountFun = () => {
    let tempData = new URLSearchParams();
    tempData.append("send_address", this.state.sendAdd);
    tempData.append("receive_address", this.state.receiveAdd);
    tempData.append("amount", this.state.amount);
    this.props.sendAmount(tempData);
  };
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
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
  checkIsMetaMaskConnected = async () => {
    if (window.ethereum) {
      try {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((metaRes) => {
            if (metaRes && metaRes.length > 0) {
              this.setState({
                sendAdd: metaRes[0],
              });
            } else {
            }
          })
          .catch((metaErr) => {
            console.log("metaError ", metaErr);
          });
      } catch (passedError) {
        console.log("Api issue ", passedError);
      }
    }
  };
  applyInsightsPropsToState = () => {
    if (this.props.intelligenceState?.updatedInsightList) {
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
      });
    }
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
    //     "openInsightsPaymentModal"
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
      !this.props.commonState.insight ||
      !this.props.intelligenceState.updatedInsightList
    ) {
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
    } else {
      this.applyInsightsPropsToState();
    }

    this.checkIsMetaMaskConnected();
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
    const tempExistingExpiryTime = window.localStorage.getItem(
      "insightsPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("insightsPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkInsightsTimer);
    window.localStorage.removeItem("insightsPageExpiryTime");
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
    const tempExpiryTime = window.localStorage.getItem(
      "insightsPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "insightsPageExpiryTime"
    );
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
      this.checkPremium();
      // insight_type: 30
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
      });
    }

    if (
      prevState.apiResponse !== this.state.apiResponse ||
      !this.props.commonState.insight
    ) {
      this.props.updateWalletListFlag("insight", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
      this.setState({
        isLoading: true,
      });
      this.props.getAllInsightsApi(this);
      this.setState({
        apiResponse: false,
      });
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
    if (!this.state.isPremiumUser) {
      this.goToPayModal();
      return;
    }
    let insightList = this.props.intelligenceState?.updatedInsightList
      ? this.props.intelligenceState?.updatedInsightList
      : [];
    insightList = insightList?.filter((item) =>
      value === 1 ? item : item.insight_type === value
    );
    const newTempHolder = insightList.filter(
      (resRes) => resRes.insight_type !== 30
    );

    this.setState({
      selectedFilter: value,
      updatedInsightList: newTempHolder,
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
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
    if (!this.state.isPremiumUser) {
      this.goToPayModal();
      return;
    }
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
        let insightList = this.props.intelligenceState?.updatedInsightList
          ? this.props.intelligenceState?.updatedInsightList
          : [];

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
        const newTempHolder = insightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
        this.setState({
          updatedInsightList: newTempHolder,
        });
      }
    );
  };
  handleMobileInsightSelect = (e) => {
    let title = e.split(" ")[1];
    console.log(e.split(" "));
    if (e.split(" ")[2] !== "undefined") {
      title = title + " " + e.split(" ")[2];
    }
    if (e.split(" ")[3] !== "undefined") {
      title = title + " " + e.split(" ")[3];
    }
    // this.setState({
    //   selectedFilter:
    //     title == "All Insights" ? 1 : title == "Cost Reduction" ? 2 : 3,
    // });
    // console.log(title.replace("  ", " "));
    // title = title.replace("  ", " ");

    this.handleSelect(
      title == "All Insights" ? 1 : title == "Cost Reduction" ? 10 : 20
    );

    console.log(
      title == "All Insights" ? 1 : title == "Cost Reduction" ? 10 : 20
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
  goToPayModal = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredInsightsSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openInsightsPaymentModal", true);
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
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          history={this.props.history}
          isSidebarClosed={this.props.isSidebarClosed}
          showpath
          currentPage={"insights"}
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/intelligence/insights"}
              title="Access Risk and Cost Reduction Insights"
              description="Unlimited wallets insights"
              hideBackBtn
              isMobile
            />
          ) : null}
          <InsightsPageMobile
            updatedInsightList={this.state.updatedInsightList}
            handleMobileInsightSelect={this.handleMobileInsightSelect}
            goToPayModal={this.goToPayModal}
            selectedFilter={this.state.selectedFilter}
            isLoading={this.state.isLoading}
            isPremiumUser={this.state.isPremiumUser}
          />
        </MobileLayout>
      );
    } else
      return (
        <div className="insightsPageContainer">
          {/* topbar */}
          <div className="portfolio-page-section ">
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
          <div className="insights-section m-t-80">
            <div className="insights-page page">
              <TopWalletAddressList
                apiResponse={(e) => this.CheckApiResponse(e)}
                handleShare={this.handleShare}
                showpath
                currentPage={"insights"}
              />
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
                  isShare={window.localStorage.getItem("share_id")}
                  isStatic={this.state.isStatic}
                  triggerId={this.state.triggerId}
                  pname="insight-page"
                  updateTimer={this.updateTimer}
                />
              )}
              {this.state.isLochPaymentModal ? (
                <PaywallModal
                  show={this.state.isLochPaymentModal}
                  onHide={this.hidePaymentModal}
                  redirectLink={BASE_URL_S3 + "/intelligence/insights"}
                  title="Access Risk and Cost Reduction Insights"
                  description="Unlimited wallets insights"
                  hideBackBtn
                />
              ) : null}

              <PageHeader
                title={"Insights"}
                subTitle={"Valuable insights based on your assets"}
                currentPage={"insights"}
                // btnText={"Add wallet"}
                // handleBtn={this.handleAddModal}
                ShareBtn={true}
                handleShare={this.handleShare}
                // history={this.props.history}updateTimer={this.updateTimer}
              />
              <div
                style={{
                  position: "relative",
                  minWidth: "85rem",
                  maxWidth: "100rem",
                  width: "100rem",
                }}
              >
                {
                  // this.state.insightList && this.state.insightList.length > 0 &&
                  <div className="insights-filter">
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
                    marginBottom: "0.8rem",
                  }}
                >
                  <h2 className="inter-display-medium f-s-25 l-h-30 black-191">
                    This week
                  </h2>

                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={this.onClickDropdown}
                    onMouseEnter={this.onHoverDropdown}
                    className="insights-dropdown-wrapper"
                  >
                    <DropDown
                      class="cohort-dropdown"
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
                <div className="insights-wrapper">
                  {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                  {this.state.isLoading ? (
                    <Loading />
                  ) : this.state.updatedInsightList &&
                    this.state.updatedInsightList.length > 0 ? (
                    this.state.updatedInsightList?.map((insight, key) => {
                      return (
                        <CustomOverlayUgradeToPremium
                          position="top"
                          disabled={this.state.isPremiumUser || key === 0}
                        >
                          <div
                            style={{
                              marginBottom:
                                key === this.state.updatedInsightList.length - 1
                                  ? "3rem"
                                  : "",
                            }}
                            className={`insights-card ${
                              key > 0
                                ? this.state.isPremiumUser
                                  ? ""
                                  : "blurred-elements"
                                : ""
                            }`}
                            key={key}
                            onClick={() => {
                              if (key > 0) {
                                this.goToPayModal();
                              }
                            }}
                          >
                            <Image
                              src={
                                insight.insight_type ===
                                InsightType.COST_REDUCTION
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
                                <h5 className="inter-display-bold f-s-10 lh-12 title-chip">
                                  {InsightType.getText(insight.insight_type)}
                                </h5>
                                {insight?.sub_type && (
                                  <h5 className="inter-display-bold f-s-10 lh-12 risk-chip">
                                    {InsightType.getRiskType(insight.sub_type)}
                                  </h5>
                                )}
                              </div>
                              <p
                                className="inter-display-medium f-s-13 lh-16 grey-969"
                                dangerouslySetInnerHTML={{
                                  __html: insight.sub_title,
                                }}
                              ></p>
                              <h4
                                className="inter-display-medium f-s-16 lh-19 grey-313"
                                dangerouslySetInnerHTML={{
                                  __html: insight.title,
                                }}
                              ></h4>
                            </div>
                          </div>
                        </CustomOverlayUgradeToPremium>
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
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "16rem",
                              height: "16rem",
                              background:
                                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 244, 158, 0.8) 100%)",
                              filter: "blur(50px)",
                              borderRadius: "10rem",
                              zIndex: 0,
                            }}
                          ></div>
                          <Image
                            src={InsightImg}
                            style={{ position: "relative" }}
                          />
                          <h5
                            className="inter-display-medium f-s-16 lh-19 grey-313 text-center"
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
                            className="inter-display-medium f-s-13 lh-15 grey-7C7 text-center"
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
                    <h3 className="inter-display-medium f-s-25 lh-30 m-b-5 text-center">
                      More insights with Loch
                    </h3>
                    <h5 className="inter-display-medium f-s-16 lh-19 grey-969 m-b-24 text-center">
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
              {/* <div>
              <input
                value={this.state.sendAdd}
                onChange={(changed) => {
                  this.setState({
                    sendAdd: changed.target.value,
                  });
                }}
                placeholder="send address"
                type="text"
              />
              <input
                onChange={(changed) => {
                  this.setState({
                    receiveAdd: changed.target.value,
                  });
                }}
                value={this.state.receiveAdd}
                placeholder="receive address"
                type="text"
              />
              <input
                onChange={(changed) => {
                  this.setState({
                    amount: changed.target.value,
                  });
                }}
                value={this.state.amount}
                placeholder="amount"
                type="text"
              />
              <button onClick={this.sendAmountFun}>Send</button>
            </div> */}
              {/* footer */}
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
});

const mapDispatchToProps = {
  getAllCoins,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  GetAllPlan,
  getUser,
  sendAmount,
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsPage);
