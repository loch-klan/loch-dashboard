import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import reduceCost from '../../assets/images/icons/reduce-cost.svg'
import reduceRisk from '../../assets/images/icons/reduce-risk.svg'
import increaseYield from '../../assets/images/icons/increase-yield.svg'
import { getAllInsightsApi } from "./Api";
import { BASE_URL_S3, InsightType } from "../../utils/Constant";
import Loading from "../common/Loading";
import { AllInsights, InsightPage, InsightsIncreaseYield, InsightsReduceCost, InsightsReduceRisk } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import FeedbackForm from "../common/FeedbackForm";

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
    };
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  componentDidMount() {
    InsightPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // this.props.getAllInsightsApi(this);
    GetAllPlan();
    getUser();
    this.setState({});
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
    });

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

    // console.log("share pod", shareLink);
  };

  render() {
    return (
      <div className="insights-section">
        <div className="insights-page page">
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
            />
          )}

          <PageHeader
            title={"Insights"}
            subTitle={"Valuable insights based on your assets"}
            showpath={true}
            currentPage={"insights"}
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
            ShareBtn={true}
            handleShare={this.handleShare}
            // history={this.props.history}
          />
          <div style={{ position: "relative" }}>
            {
              // this.state.insightList && this.state.insightList.length > 0 &&
              <div className="insights-filter">
                {this.state.insightFilter?.map((filter, key) => {
                  return (
                    <div
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
            <div className="insights-wrapper">
              {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
              {this.state.isLoading ? (
                <Loading />
              ) : this.state.updatedInsightList &&
                this.state.updatedInsightList.length > 0 ? (
                this.state.updatedInsightList?.map((insight, key) => {
                  return (
                    <div className="insights-card" key={key}>
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
                        Add all your wallets and exchanges to gain more insights
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

          {/* footer */}
          <Footer />
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
};


export default connect(mapStateToProps,mapDispatchToProps)(InsightsPage);
