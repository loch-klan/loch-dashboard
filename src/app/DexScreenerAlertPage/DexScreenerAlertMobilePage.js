import React, { Component } from "react";
import { connect } from "react-redux";
import DexScreenerAlertPageContent from "./DexScreenerAlertPageContent";

class DexScreenerTableMobilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dex-screener-alert-page dex-screener-alert-page-mobile">
        <div className="mobile-header-container">
          <h4>My Alerts</h4>
          <p>View all the alerts you have set up here</p>
        </div>

        <DexScreenerAlertPageContent
          showPriceAlertModal={this.props.showPriceAlertModal}
          curAlerts={this.props.curAlerts}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerTableMobilePage);
