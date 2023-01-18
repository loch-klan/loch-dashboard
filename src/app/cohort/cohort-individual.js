import React, { Component } from "react";
import { Col, Image, Row } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import { getAllInsightsApi } from "./Api";
import { InsightType } from "../../utils/Constant";
import Loading from "../common/Loading";
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";

import netWorthIcon from "../../assets/images/icons/total-net-dark.svg";
import BellIcon from "../../assets/images/icons/bell.svg";
import BellIconColor from "../../assets/images/icons/bell-color.svg";
import VerticalIcon from "../../assets/images/icons/veritcal-line.svg";

import ClockIcon from "../../assets/images/icons/clock.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import { BarGraphFooter } from "../common/BarGraphFooter";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";

class CohortPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  handleFooter = () => {};

  render() {
    return (
      <div className="insights-section m-b-80">
        <div className="insights-page page">
          <PageHeader
            title={"AVAX Whales"}
            subTitle={"Added 10/12/22"}
            showpath={true}
            currentPage={"insights"}
            // btnText={"Edit"}

            // history={this.props.history}
          />
          <h2 className="m-b-20 inter-display-medium f-s-20 l-h-124 black-191">
            Intelligence
          </h2>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <BarGraphFooter
              cohort={true}
              handleFooterClick={this.handleFooter}
              active={this.state.activeFooter}
              footerLabels={[
                "Max",
                "5Y",
                "4Y",
                "3Y",
                "2Y",
                "1Y",
                "6M",
                "1M",
                "1 Week",
                "1 Day",
              ]}
            />
          </div>
          {/* Net Worth */}
          <div className="net-worth-wrapper m-t-30">
            <div className="left">
              <Image src={netWorthIcon} className="net-worth-icon" />
              <h3 className="inter-display-medium f-s-20 lh-24 ">
                Total net worth
              </h3>
            </div>
            <div className="right">
              <h3 className="space-grotesk-medium f-s-24 lh-29">
                {CurrencyType(false)}
                {numToCurrency(417.44)}{" "}
                {/* <span className="inter-display-semi-bold f-s-10 lh-12 grey-ADA va-m">
                  {CurrencyType(true)}
                </span> */}
              </h3>
            </div>
          </div>
          {/* Net worth end */}
          <Row>
            <Col md={3}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                }}
              >
                <Image src={netWorthIcon} className="net-worth-icon" />
                <h3 className="inter-display-medium f-s-16 lh-19 m-t-12">
                  Average net worth
                </h3>
                <h4 className="inter-display-medium f-s-16 l-h-19 m-t-46">
                  {CurrencyType(false)}3612.21{" "}
                  <span className="f-s-12 grey-ADA">USD</span>
                </h4>
              </div>
            </Col>
            <Col md={3}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                }}
              >
                <Image src={netWorthIcon} className="net-worth-icon" />
                <h3 className="inter-display-medium f-s-16 lh-19 m-t-12">
                  Most frequently purchased token
                </h3>
                <h4 className="inter-display-medium f-s-16 l-h-19 m-t-46">
                  {CurrencyType(false)}3612.21{" "}
                  <span className="f-s-12 grey-ADA">USD</span>
                </h4>
              </div>
            </Col>
            <Col md={3}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                }}
              >
                <Image src={netWorthIcon} className="net-worth-icon" />
                <h3 className="inter-display-medium f-s-16 lh-19 m-t-12">
                  Most frequently <br />
                  sold token
                </h3>
                <h4 className="inter-display-medium f-s-16 l-h-19 m-t-46">
                  {CurrencyType(false)}3612.21{" "}
                  <span className="f-s-12 grey-ADA">USD</span>
                </h4>
              </div>
            </Col>
            <Col md={3}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                }}
              >
                <Image src={netWorthIcon} className="net-worth-icon" />
                <h3 className="inter-display-medium f-s-16 lh-19 m-t-12">
                  Largest Holding
                </h3>
                <h4 className="inter-display-medium f-s-16 l-h-19 m-t-46">
                  {CurrencyType(false)}3612.21{" "}
                  <span className="f-s-12 grey-ADA">USD</span>
                </h4>
              </div>
            </Col>
          </Row>
          {/* 4 card end */}
          <h2
            className="m-t-40 m-b-20 inter-display-medium f-s-20 l-h-124 black-191"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Image src={BellIcon} style={{ marginRight: "1.2rem" }} />{" "}
            Notifications
          </h2>

          {/* Notification start */}
          <div
            style={{
              background: "rgba(229, 229, 230, 0.5)",
              borderRadius: "16px",
              padding: "2rem",
            }}
          >
            <Row>
              <Col md={4}>
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 27.5%, rgba(22, 93, 255, 0.162) 157.71%), #FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                  }}
                >
                  <Image src={BellIconColor} />
                  <h3 className="inter-display-medium f-s-20 lh-24 m-t-12">
                    Get intelligent notifications for <br />
                    your cohort
                  </h3>
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "8px",
                      padding: "18px 28px",
                      width: "max-content",
                    }}
                    className="inter-display-medium f-s-16 lh-19 m-t-30"
                  >
                    Update email
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                  }}
                >
                  <Image src={VerticalIcon} />
                  <h3 className="inter-display-medium f-s-16 lh-19 m-t-80">
                    Notify me when any wallets move more than
                  </h3>
                  {/* <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "8px",
                      padding: "18px 28px",
                      width: "max-content",
                    }}
                    className="inter-display-medium f-s-16 lh-19 m-t-30"
                  >
                    Update email
                  </div> */}
                </div>
              </Col>
              <Col md={4}>
                <div
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                  }}
                >
                  <Image src={ClockIcon} />
                  <h3 className="inter-display-medium f-s-16 lh-19 m-t-60">
                    Notify me when any wallet dormant for
                  </h3>
                  {/* <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "8px",
                      padding: "18px 28px",
                      width: "max-content",
                    }}
                    className="inter-display-medium f-s-16 lh-19 m-t-30"
                  >
                    Update email
                  </div> */}
                </div>
              </Col>
            </Row>
          </div>
          {/* notification end */}
        </div>
      </div>
    );
  }
}

export default CohortPage;
