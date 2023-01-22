import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IntelWelcomeCard from "./IntelWelcomeCard";
import PageHeader from "../common/PageHeader";
import eyeIcon from "../../assets/images/icons/eyeIcon.svg";
import insight from "../../assets/images/icons/insight.svg";
import BarGraphSection from "../common/BarGraphSection";
import { getAllCoins } from "../onboarding/Api.js";
import { Col, Image, Row } from "react-bootstrap";
import {
  InsightsViewMore,
  IntelligencePage,
  TimeSpentIntelligence,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment/moment";
import { getProfitAndLossApi } from "./Api";
import Loading from "../common/Loading";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import { getAllInsightsApi } from "./Api";
import { InsightType } from "../../utils/Constant";
import FeedbackForm from "../common/FeedbackForm";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import NetflowImg from "../../assets/images/icons/netflow.svg";
import NetflowClose from "../../assets/images/icons/netflow-close.svg";

// Add new Wallet
import {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
} from "../Portfolio/Api";

import FixAddModal from "../common/FixAddModal";

class Intelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showPercentage: {
      //   icon: arrowUpRight,
      //   percent: "25",
      //   status: "Increase",
      //   GraphData: [],
      //   graphValue: "null",
      // },
      startTime: "",
      updatedInsightList: "",
      isLoading: true,
      // title: "Max",
      title: 0,
      RightShow: true,
      LeftShow: true,

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
    };
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime);
    IntelligencePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    window.scrollTo(0, 0);
    this.props.getAllCoins();
    this.timeFilter(0);
    getAllInsightsApi(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      console.log("update");
     
        this.props.getAllCoins();
        this.timeFilter(0);
      getAllInsightsApi(this);
      this.setState({
        apiResponse: false,
      });
     
    }
  }
  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime);
    // console.log("Time Spent", TimeSpent);
    TimeSpentIntelligence({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  timeFilter = (option) => {
    // console.log("time filter", option)
    let selectedChains = [];
    // if(activeBadgeList){
    //   this.props.OnboardingState.coinsList.map((item)=>{
    //     if(activeBadgeList.includes(item.id)){
    //       selectedChains.push(item.code)
    //     }
    //   })
    // }
    this.setState({ graphValue: "" });
    const today = moment().unix();
    if (option == 0) {
      getProfitAndLossApi(this, false, false, selectedChains);
    } else if (option == 1) {
      // console.log("inside 1")
      const fiveyear = moment().subtract(5, "years").unix();
      getProfitAndLossApi(this, fiveyear, today, selectedChains);
    } else if (option == 2) {
      const fouryear = moment().subtract(4, "years").unix();
      getProfitAndLossApi(this, fouryear, today, selectedChains);
    } else if (option == 3) {
      const threeyear = moment().subtract(3, "years").unix();
      getProfitAndLossApi(this, threeyear, today, selectedChains);
    } else if (option == 4) {
      const twoyear = moment().subtract(2, "years").unix();
      getProfitAndLossApi(this, twoyear, today, selectedChains);
    } else if (option == 5) {
      const year = moment().subtract(1, "years").unix();
      getProfitAndLossApi(this, year, today, selectedChains);
    } else if (option == 6) {
      const sixmonth = moment().subtract(6, "months").unix();
      getProfitAndLossApi(this, sixmonth, today, selectedChains);
    } else if (option == 7) {
      const month = moment().subtract(1, "month").unix();
      getProfitAndLossApi(this, month, today, selectedChains);
    } else if (option == 8) {
      const week = moment().subtract(1, "week").unix();
      getProfitAndLossApi(this, week, today, selectedChains);
    } else if (option == 9) {
      const day = moment().subtract(1, "day").unix();
      getProfitAndLossApi(this, day, today, selectedChains);
    }
    this.setState({
      title: option,
    });
  };

  handleBadge = (activeBadgeList, activeFooter = this.state.title) => {
    // console.log("handle badge", activeBadgeList, activeFooter);
    let startDate = moment().unix();
    let endDate;
    if (activeFooter == "0") {
      startDate = "";
      endDate = "";
    } else if (activeFooter == "1") {
      endDate = moment().subtract(5, "years").unix();
    } else if (activeFooter == "2") {
      endDate = moment().subtract(4, "years").unix();
    } else if (activeFooter == "3") {
      endDate = moment().subtract(3, "years").unix();
    } else if (activeFooter == "4") {
      endDate = moment().subtract(2, "years").unix();
    } else if (activeFooter == "5") {
      endDate = moment().subtract(1, "years").unix();
    } else if (activeFooter == "6") {
      endDate = moment().subtract(6, "months").unix();
    } else if (activeFooter == "7") {
      endDate = moment().subtract(1, "month").unix();
    } else if (activeFooter == "8") {
      endDate = moment().subtract(1, "week").unix();
    } else if (activeFooter == "9") {
      endDate = moment().subtract(1, "day").unix();
    }

    let selectedChains = [];
    this.props.OnboardingState.coinsList.map((item) => {
      if (activeBadgeList.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

    if ((activeFooter = 0)) {
      getProfitAndLossApi(this, false, false, selectedChains);
    } else {
      getProfitAndLossApi(this, startDate, endDate, selectedChains);
    }
  };

  handleSelect = (opt) => {
    const t = opt.split(" ")[1];
    const x = opt.split(" ")[2];
    this.setState({
      title: t == "Max" ? t : t + " " + x,
    });
    this.timeFilter(t == "Max" ? t : t + " " + x);
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
      isLoading: true,
      graphValue: null,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    console.log("api respinse", value);
  };

  RightClose = () => {
    this.setState({
      RightShow: false,
    });
  };

  LeftClose = () => {
    this.setState({
      LeftShow: false,
    });
  };

  render() {
    return (
      <div className="intelligence-page-section">
        <div className="intelligence-section page">
          <PageHeader
            title="Intelligence"
            subTitle="Automated and personalized financial intelligence"
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
          />
          <IntelWelcomeCard history={this.props.history} />
          <div className="insights-image m-b-40">
            <PageHeader
              title="Insights"
              showImg={insight}
              viewMore={true}
              viewMoreRedirect={"/intelligence/insights"}
              handleClick={() => {
                InsightsViewMore({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                });
              }}
            />
            <div style={{ position: "relative" }}>
              <div className="insights-wrapper">
                {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                {this.state.isLoading ? (
                  <Loading />
                ) : this.state.updatedInsightList &&
                  this.state.updatedInsightList.length > 0 ? (
                  this.state.updatedInsightList
                    .slice(0, 2)
                    .map((insight, key) => {
                      console.log("insignt", insight);
                      return (
                        <div className="insights-card" key={key}>
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
                            <h5 className="inter-display-bold f-s-10 lh-12 title-chip">
                              {InsightType.getText(insight.insight_type)}
                            </h5>
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
                      );
                    })
                ) : (
                  <h5 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8 text-center">
                    {
                      "This wallet is not active enough for us to generate any useful insights here :)."
                    }
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div className="portfolio-bar-graph">
            <PageHeader title="Net Flows" showImg={eyeIcon} />
            {/* Netflow Info Start */}

            <Row
              style={
                this.state.RightShow || this.state.LeftShow
                  ? { marginBottom: "2.6rem" }
                  : {}
              }
            >
              {/* 1st */}
              <Col md={5} style={{ padding: "10px" }}>
                {this.state.LeftShow && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                      borderRadius: "1.2rem",
                      padding: "2rem",
                      position: "relative",
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "start",
                      flexDirection: "column",
                      // width: "40%",
                      height: "100%",
                      minHeight: "15.3rem",
                    }}
                  >
                    <Image
                      src={NetflowClose}
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        cursor: "pointer",
                      }}
                      onClick={this.LeftClose}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                      className="m-b-30"
                    >
                      <h3
                        className="inter-display-medium f-s-13 lh-15 black-191"
                        style={{ width: "75px" }}
                      >
                        Inflows
                      </h3>
                      <p
                        className="inter-display-medium f-s-13 lh-15 grey-969"
                        style={{ width: "215px" }}
                      >
                        sum total of all assets received by your portfolio
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                      className="m-b-30"
                    >
                      <h3
                        className="inter-display-medium f-s-13 lh-15 black-191"
                        style={{ width: "75px" }}
                      >
                        Outflows
                      </h3>
                      <p
                        className="inter-display-medium f-s-13 lh-15 grey-969"
                        style={{ width: "223px" }}
                      >
                        sum total of all assets and fees sent out by your
                        portfolio
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                    >
                      <h3
                        className="inter-display-medium f-s-13 lh-15 black-191"
                        style={{ width: "75px" }}
                      >
                        Net
                      </h3>
                      <p
                        className="inter-display-medium f-s-13 lh-15 grey-969"
                        style={{ width: "215px" }}
                      >
                        outflows - inflows
                      </p>
                    </div>
                  </div>
                )}
              </Col>

              {/* Second */}
              <Col md={7} style={{ padding: "10px" }}>
                {this.state.RightShow && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                      borderRadius: "1.2rem",
                      padding: "2rem 3.8rem 2rem 2rem",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      // width: "58%",
                      height: "100%",
                      minHeight: "15.3rem",
                    }}
                  >
                    <Image
                      src={NetflowClose}
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        cursor: "pointer",
                      }}
                      onClick={this.RightClose}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        width: "30%",
                      }}
                    >
                      <Image src={NetflowImg} />
                      <h3
                        className="inter-display-bold f-s-10 lh-12 black-191 m-t-12"
                        style={{
                          background: "#F2F2F2",
                          border: "1px solid rgba(229, 229, 230, 0.5)",
                          borderRadius: "8px",
                          padding: "4px 8px",
                        }}
                      >
                        EXPLAINER
                      </h3>
                    </div>

                    <div
                      style={{
                        width: "68%",
                      }}
                    >
                      <h3
                        className="inter-display-medium f-s-16 lh-19 black-191 m-b-12"
                        // style={{ width: "75px" }}
                      >
                        Inflows and Outflows might appear inflated if the same
                        funds went in and out of a single wallet multiple times.
                      </h3>
                      <p
                        className="inter-display-medium f-s-13 lh-15 grey-969"
                        // style={{ width: "215px" }}
                      >
                        This chart is most accurate when all your wallet
                        addresses are added to Loch. This way we don't double
                        count funds.
                      </p>
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            {/* Netflow Info End */}

            <div style={{ position: "relative" }}>
              {this.state.graphValue ? (
                <BarGraphSection
                  isScrollVisible={false}
                  data={this.state.graphValue[0]}
                  options={this.state.graphValue[1]}
                  coinsList={this.props.OnboardingState.coinsList}
                  timeFunction={(e, activeBadgeList) =>
                    this.timeFilter(e, activeBadgeList)
                  }
                  marginBottom="m-b-32"
                  // showFooter={false}
                  showFooterDropdown={false}
                  showFooter={true}
                  footerLabels={[
                    "Max",
                    "5 Y",
                    "4 Y",
                    "3 Y",
                    "2 Y",
                    "1 Y",
                    "6 M",
                    "1 M",
                    "1 Week",
                    "1 Day",
                  ]}
                  activeTitle={this.state.title}
                  // handleSelect={(opt) => this.handleSelect(opt)}
                  showBadges={true}
                  showPercentage={this.state.graphValue[2]}
                  handleBadge={(activeBadgeList, activeFooter) =>
                    this.handleBadge(activeBadgeList, activeFooter)
                  }
                  // comingSoon={true}
                />
              ) : (
                <div className="loading-wrapper">
                  <Loading />
                  <br />
                  <br />
                </div>
              )}
            </div>
            <FeedbackForm page={"Intelligence Page"} />
          </div>
        </div>
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
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,

  // add wallet
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
};

// const mapDispatchToProps = {
//   getCoinRate,
//   getUserWallet,
//   settingDefaultValues,
//   getAllCoins,
//   searchTransactionApi,
//   getAssetGraphDataApi,
//   getDetailsByLinkApi,
// };

Intelligence.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Intelligence);
