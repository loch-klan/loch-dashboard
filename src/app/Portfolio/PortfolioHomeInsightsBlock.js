import { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import InsightImg from "../../assets/images/icons/insight-msg.svg";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import { InsightsEV } from "../../utils/AnalyticsFunctions";
import { InsightType } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { numToCurrency } from "../../utils/ReusableFunctions";
import Loading from "../common/Loading";

class PortfolioHomeInsightsBlock extends Component {
  goToInsightsPage = () => {
    this.props.history.push("/intelligence/insights");
    InsightsEV({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  render() {
    if (this.props.insightsBlockLoading) {
      return (
        <div
          style={{
            height: "38rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Loading />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
        className="insights-wrapper-container"
      >
        {this.props.updatedInsightList &&
        this.props.updatedInsightList.length > 0 ? (
          <>
            <div
              style={{
                overflow: "scroll",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                position: "relative",
                height: "30rem",
                padding: "0rem 0.5rem",
              }}
              className="insights-wrapper insights-wrapper-portfolio-home"
            >
              {this.props.updatedInsightList
                .slice(0, 10)
                .map((insight, key) => {
                  return (
                    <>
                      <div
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          position: "relative",
                          marginTop: "1rem",
                          marginBottom: "0rem",
                          boxShadow: "none",
                          border: "0.1rem solid #E5E5E6",
                          alignItems: "flex-start",
                        }}
                        className="insights-card"
                        key={key}
                      >
                        <div className="insights-cards-home-left">
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
                        </div>
                        <div
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            marginLeft: "1rem",
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
                    </>
                  );
                })}
            </div>

            <div className="inter-display-medium bottomExtraInfo">
              <div
                className="bottomExtraInfoText"
                onClick={this.goToInsightsPage}
              >
                Click here to see more
              </div>
            </div>
          </>
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
                width: "100%",
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
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioHomeInsightsBlock);
