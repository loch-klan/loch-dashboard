import React, { Component } from "react";
import { Image } from "react-bootstrap";
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
      <div className="insights-section">
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
                <div style={{
                    display:"flex",
                }}>

                </div>
                {/* 4 card end */}
        </div>
      </div>
    );
  }
}

export default CohortPage;
