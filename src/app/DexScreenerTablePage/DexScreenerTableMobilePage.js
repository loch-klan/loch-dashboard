import React, { Component } from "react";
import { connect } from "react-redux";
import DexScreenerTablePageContent from "./DexScreenerTablePageContent";

class DexScreenerTableMobilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dex-screener-table-page dex-screener-table-page-mobile">
        <div className="mobile-header-container">
          <h4>Scooby Doo</h4>
        </div>

        <DexScreenerTablePageContent
          Average_cost_basis_local={this.props.Average_cost_basis_local}
          columnData={this.props.columnData}
          AvgCostLoading={this.props.AvgCostLoading}
          showPriceAlertModal={this.props.showPriceAlertModal}
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
