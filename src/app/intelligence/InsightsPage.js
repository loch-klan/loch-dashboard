import React, { Component } from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import reduceCost from '../../assets/images/icons/reduce-cost.svg'
import reduceRisk from '../../assets/images/icons/reduce-risk.svg'
import increaseYield from '../../assets/images/icons/increase-yield.svg'
import { getAllInsightsApi } from "./Api";
import { InsightType } from "../../utils/Constant";
import Loading from "../common/Loading";
import { AllInsights, InsightPage, InsightsIncreaseYield, InsightsReduceCost, InsightsReduceRisk } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import FeedbackForm from "../common/FeedbackForm";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import { connect } from "react-redux";
import FixAddModal from "../common/FixAddModal";


class InsightsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insightList: "",
      isLoading: true,
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
    };
  }
  componentDidMount() {
    InsightPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    getAllInsightsApi(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

     if (prevState.apiResponse != this.state.apiResponse) {
       console.log("update");

       getAllInsightsApi(this);
       this.setState({
         apiResponse: false,
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
      isLoading: true,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    console.log("api respinse", value);
  };
  handleSelect = (value) => {
    // console.log("value",value)
    let insightList = this.state.insightList;
    insightList = insightList.filter((item) =>
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
            />
          )}
          <PageHeader
            title={"Insights"}
            subTitle={"Valuable insights based on your assets"}
            showpath={true}
            currentPage={"insights"}
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
            // history={this.props.history}
          />
          <div style={{ position: "relative" }}>
            {
              // this.state.insightList && this.state.insightList.length > 0 &&
              <div className="insights-filter">
                {this.state.insightFilter.map((filter, key) => {
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
                this.state.updatedInsightList.map((insight, key) => {
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
                <h5 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8 text-center">
                  {
                    "This wallet is not active enough for us to generate any useful insights here :)."
                  }
                </h5>
              )}
            </div>
          </div>
          <FeedbackForm page={"Insights Page"} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});

const mapDispatchToProps = {
  getAllCoins,
};


export default connect(mapStateToProps,mapDispatchToProps)(InsightsPage);
