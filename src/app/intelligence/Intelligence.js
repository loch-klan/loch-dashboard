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
import { getAssetProfitLoss, getProfitAndLossApi } from "./Api";
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
import { info } from "./stackGrapgh";

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
      // profit loss asset data
      ProfitLossAsset: [],
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
      isSwitch:false,
    };
  }
  
  setSwitch = () => {
    this.setState({
      isSwitch: !this.state.isSwitch,
    });
    // console.log("switch")
  }

  componentDidMount() {
     if (this.props.location.hash !== "") {
       setTimeout(() => {
         const id = this.props.location.hash.replace("#", "");
         // console.log('id',id);
         const element = document.getElementById(id);
         if (element) {
           element.scrollIntoView();
         }
       }, 0);
     } else {
       window.scrollTo(0, 0);
     }
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime);
    IntelligencePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.props.getAllCoins();
    this.timeFilter(0);
    getAllInsightsApi(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");
     
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
      // for asset Breakdown
      getAssetProfitLoss(this, false, false, selectedChains);
     
    } else if (option == 1) {
      // console.log("inside 1")
      const fiveyear = moment().subtract(5, "years").unix();
      getProfitAndLossApi(this, fiveyear, today, selectedChains);
      // for asset Breakdown
      getAssetProfitLoss(this, fiveyear, today, selectedChains);
    } else if (option == 2) {
      const fouryear = moment().subtract(4, "years").unix();
      getProfitAndLossApi(this, fouryear, today, selectedChains);
      getAssetProfitLoss(this, fouryear, today, selectedChains);
    } else if (option == 3) {
      const threeyear = moment().subtract(3, "years").unix();
      getProfitAndLossApi(this, threeyear, today, selectedChains);
      getAssetProfitLoss(this, threeyear, today, selectedChains);
    } else if (option == 4) {
      const twoyear = moment().subtract(2, "years").unix();
      getProfitAndLossApi(this, twoyear, today, selectedChains);
      getAssetProfitLoss(this, twoyear, today, selectedChains);
    } else if (option == 5) {
      const year = moment().subtract(1, "years").unix();
      getProfitAndLossApi(this, year, today, selectedChains);
      getAssetProfitLoss(this, year, today, selectedChains);
    } else if (option == 6) {
      const sixmonth = moment().subtract(6, "months").unix();
      getProfitAndLossApi(this, sixmonth, today, selectedChains);
      getAssetProfitLoss(this, sixmonth, today, selectedChains);
    } else if (option == 7) {
      const month = moment().subtract(1, "month").unix();
      getProfitAndLossApi(this, month, today, selectedChains);
      getAssetProfitLoss(this, month, today, selectedChains);
    } else if (option == 8) {
      const week = moment().subtract(1, "week").unix();
      getProfitAndLossApi(this, week, today, selectedChains);
      getAssetProfitLoss(this, week, today, selectedChains);
    } else if (option == 9) {
      const day = moment().subtract(1, "day").unix();
      getProfitAndLossApi(this, day, today, selectedChains);
      getAssetProfitLoss(this, day, today, selectedChains);
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
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

    if ((activeFooter = 0)) {
      getProfitAndLossApi(this, false, false, selectedChains);
      getAssetProfitLoss(this, false, false, selectedChains);
    } else {
      getProfitAndLossApi(this, startDate, endDate, selectedChains);

      // for asset Breakdown
       getAssetProfitLoss(this, startDate, endDate, selectedChains);
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
    // console.log("api respinse", value);
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
          <div className="insights-image m-b-60">
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
                    ?.slice(0, 2)
                    .map((insight, key) => {
                      // console.log("insignt", insight);
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
          <div className="portfolio-bar-graph" id="netflow">
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
              <Col md={5} style={{ paddingRight: "10px" }} sm={12}>
                {this.state.LeftShow && (
                  <div className="InfoCard">
                    <Image
                      src={NetflowClose}
                      className="CloseBtn"
                      onClick={this.LeftClose}
                    />
                    <div className="m-b-30 InfoItem">
                      <div className="title">
                        <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                          Inflows
                        </h3>
                      </div>
                      <div className="description">
                        <p className="inter-display-medium f-s-13 lh-15 grey-969">
                          sum total of all assets received by your portfolio
                        </p>
                      </div>
                    </div>

                    <div className="m-b-30 InfoItem">
                      <div className="title">
                        <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                          Outflows
                        </h3>
                      </div>
                      <div className="description">
                        <p className="inter-display-medium f-s-13 lh-15 grey-969">
                          sum total of all assets and fees sent out by your
                          portfolio
                        </p>
                      </div>
                    </div>

                    <div className="InfoItem">
                      <div className="title">
                        <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                          Net
                        </h3>
                      </div>
                      <div className="description">
                        <p className="inter-display-medium f-s-13 lh-15 grey-969">
                          outflows - inflows
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Col>

              {/* Second */}
              <Col md={7} style={{ paddingLeft: "10px" }} sm={12}>
                {this.state.RightShow && (
                  <div className="InfoCardRight">
                    <Image
                      src={NetflowClose}
                      className="CloseBtn"
                      onClick={this.RightClose}
                    />
                    <div className="imageSection">
                      <Image src={NetflowImg} />
                      <h3 className="inter-display-bold f-s-10 lh-12 black-191 m-t-12 explainer-text">
                        EXPLAINER
                      </h3>
                    </div>

                    <div className="RightSection">
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

            <div style={{ position: "relative", minWidth: "85rem" }}>
              {this.state.graphValue ? (
                <BarGraphSection
                  isScrollVisible={false}
                  data={this.state.graphValue[0]}
                  options={this.state.graphValue[1]}
                  coinsList={this.props.OnboardingState.coinsList}
                  timeFunction={(e, activeBadgeList) =>
                    this.timeFilter(e, activeBadgeList)
                  }
                  showSwitch={true}
                  isSwitch={this.state.isSwitch}
                  setSwitch={this.setSwitch}
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
                    "1 W",
                    "1 D",
                  ]}
                  activeTitle={this.state.title}
                  // handleSelect={(opt) => this.handleSelect(opt)}
                  showBadges={true}
                  showPercentage={this.state.graphValue[2]}
                  handleBadge={(activeBadgeList, activeFooter) =>
                    this.handleBadge(activeBadgeList, activeFooter)
                  }
                  ProfitLossAsset={this.state.ProfitLossAsset}

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
