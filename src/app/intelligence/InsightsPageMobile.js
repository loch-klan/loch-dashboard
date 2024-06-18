import { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { InsightType } from "../../utils/Constant";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import DropDown from "../common/DropDown";
import InsightImg from "../../assets/images/icons/insight-msg.svg";
import Loading from "../common/Loading";

class InsightsPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="insights-expanded-mobile">
        <div className="mobile-header-container">
          <h4>Insights</h4>
          <p>Valuable insights based on your assets</p>
        </div>

        <div className="insights-wrapper">
          {this.props.isLoading ? (
            <div
              style={{
                borderRadius: "1.2rem",
                height: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loading />
            </div>
          ) : (
            <>
              <div
                style={{
                  marginBottom: "2.5rem",
                }}
              >
                <DropDown
                  class="cohort-dropdown mobile-insight-dropdown"
                  list={["All Insights", "Cost Reduction", "Risk Reduction"]}
                  onSelect={this.props.handleMobileInsightSelect}
                  title={
                    this.props.selectedFilter === 1
                      ? "All Insights"
                      : this.props.selectedFilter === 10
                      ? "Cost Reduction"
                      : "Risk Reduction"
                  }
                  activetab={
                    this.props.selectedFilter === 1
                      ? "All Insights"
                      : this.props.selectedFilter === 10
                      ? "Cost Reduction"
                      : "Risk Reduction"
                  }
                />
              </div>
              {this.props.updatedInsightList?.length > 0 ? (
                this.props.updatedInsightList.map((insight, index) => {
                  return (
                    <div
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "relative",
                        marginTop: index === 0 ? "0rem" : "2rem",
                        marginBottom: "0rem",
                        boxShadow: "none",
                        border: "0.1rem solid var(--borderwhiteDarkLight)",
                        alignItems: "flex-start",
                        // background: "var(--cardBackgroud)",
                      }}
                      className={`insights-card ${
                        index > 0
                          ? this.props.isPremiumUser
                            ? ""
                            : "blurred-elements"
                          : ""
                      }`}
                      key={index}
                      onClick={() => {
                        if (index > 0) {
                          this.props.goToPayModal();
                        }
                      }}
                    >
                      <div>
                        <div
                          className="insights-cards-home-left"
                          style={{ display: "flex" }}
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
                          <div>
                            <h5
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                marginTop: "0.5rem",
                              }}
                              className="inter-display-medium f-s-13 lh-12"
                            >
                              {InsightType.getText(insight.insight_type)}
                            </h5>
                            <div
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                marginTop: "0.5rem",
                              }}
                              className="chips-wrapper"
                            >
                              {insight?.sub_type && (
                                <h5
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                  className="inter-display-bold f-s-10 lh-12 risk-chip"
                                >
                                  {InsightType.getRiskType(insight.sub_type)}
                                </h5>
                              )}
                            </div>
                            <div
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                marginTop: "1rem",
                              }}
                              className="insights-content"
                            >
                              <p
                                style={{
                                  whiteSpace: "wrap",
                                  marginTop: "0rem",
                                }}
                                className="inter-display-medium f-s-12 lh-16 grey-969"
                                dangerouslySetInnerHTML={{
                                  __html: insight.sub_title,
                                }}
                              ></p>
                              <h4
                                style={{
                                  whiteSpace: "wrap",
                                }}
                                className="inter-display-medium f-s-13 lh-19 grey-313"
                                dangerouslySetInnerHTML={{
                                  __html: insight.title,
                                }}
                              ></h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
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
                    height: "27rem",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "70%",
                      height: "16rem",
                      background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 244, 158, 0.8) 100%)",
                      filter: "blur(50px)",
                      borderRadius: "10rem",
                      zIndex: 0,
                    }}
                  ></div>
                  <Image src={InsightImg} style={{ position: "relative" }} />
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
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsPageMobile);
