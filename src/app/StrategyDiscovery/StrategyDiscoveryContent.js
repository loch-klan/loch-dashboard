import React from "react";

import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import { mobileCheck } from "../../utils/ReusableFunctions";
import TransactionTable from "../intelligence/TransactionTable";
import { Image } from "react-bootstrap";
import { StrategyDiscoveryHeadingFloatingBlocks } from "../../assets/images";
import { StrategyDiscoveryHeadingArrowIcon } from "../../assets/images/icons";

class StrategyDiscoveryContent extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: mobileCheck(),
      prevHeight: 0,
    };
  }

  componentDidMount() {}
  render() {
    return (
      <div className="strategy-discovery-page-content">
        <div
          onClick={this.props.goToStrategyBuilderPage}
          className="strategy-discovery-page-heading"
        >
          <div className="strategy-discovery-page-heading-text">
            <div className="strategy-discovery-page-heading-text-subheading">
              Get started with
            </div>
            <div className="strategy-discovery-page-heading-text-heading">
              <div>Strategy Builder</div>
              <Image
                src={StrategyDiscoveryHeadingArrowIcon}
                className="strategy-discovery-page-heading-text-heading-icon"
              />
            </div>
          </div>
          <Image
            className="strategy-discovery-page-heading-images"
            src={StrategyDiscoveryHeadingFloatingBlocks}
          />
        </div>
        <div className="strategy-discovery-page-content-block">
          <div className="btpcb-title">
            <div>Discover</div>
          </div>

          <div className="btpcb-right-table-container">
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : "cost-table-section"
              }`}
            >
              <TransactionTable
                message="No performance metric found"
                tableData={this.props.performanceMetricTableData}
                columnList={this.props.performanceMetricColumnList}
                isLoading={this.props.performanceMetricTableLoading}
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={3.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

StrategyDiscoveryContent.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StrategyDiscoveryContent);
