import React, { Component } from "react";
import { connect } from "react-redux";
import BarGraphSection from "../common/BarGraphSection.js";
import { BarGraphFooter } from "../common/BarGraphFooter.js";
import Loading from "../common/Loading.js";
import InflowOutflowPortfolioHome from "../intelligence/InflowOutflowPortfolioHome.js";

class PriceGuageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="realized-profit-and-loss-expanded-mobile">
        <div className="mobile-header-container">
          <h4>Price gauge</h4>
          <p>Understand when this token was bought and sold</p>
        </div>

        <div
          className="profit-chart profit-chart-mobile"
          style={{
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <InflowOutflowPortfolioHome
              hideExplainer
              showEth
              userWalletList={this.props.userWalletList}
              lochToken={this.props.lochToken}
              callChildPriceGaugeApi={this.props.callChildPriceGaugeApi}
              isMobileGraph
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PriceGuageMobile);
