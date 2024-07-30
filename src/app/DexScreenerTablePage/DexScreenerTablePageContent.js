import React, { Component } from "react";
import { connect } from "react-redux";

import { Image } from "react-bootstrap";
import TransactionTable from "../intelligence/TransactionTable.js";

// add wallet
import {
  DexScreenerClockIcon,
  DexScreenerFireIcon,
  DexScreenerGainersIcon,
  DexScreenerHeaderBellIcon,
  DexScreenerNewPairsIcon,
  DexScreenerTopIcon,
} from "../../assets/images/icons/index.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";
// import AssetUnrealizedProfitAndLossMobile from "./AssetUnrealizedProfitAndLossMobile.js";

class DexScreenerTablePageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  render() {
    return (
      <>
        {this.state.isMobile ? null : (
          <div className="dct-vol-txn-container">
            <div className="dct-vol-txn-block">
              <div className="dct-vol-txn-block-sub-text">24H VOLUME</div>
              <div className="dct-vol-txn-block-text">$6.55B</div>
            </div>
            <div className="dct-vol-txn-block">
              <div className="dct-vol-txn-block-sub-text">24H TXNS</div>
              <div className="dct-vol-txn-block-text">$6.55B</div>
            </div>
          </div>
        )}
        {this.state.isMobile ? null : (
          <div className="dct-toggles-container">
            <div className="dct-tc-time-container">
              <div className="dct-tc-time-block dct-tc-time-block-solid">
                <Image
                  className="dct-tc-time-block-image"
                  src={DexScreenerClockIcon}
                />
                <div>Last</div>
              </div>
              <div className="dct-tc-time-block dct-tc-time-block-selected">
                24H
              </div>
              <div className="dct-tc-time-block">5M</div>
              <div className="dct-tc-time-block">1H</div>
              <div className="dct-tc-time-block">6H</div>
            </div>
            <div className="dct-tc-trending-container">
              <div className="dct-tc-trending-block dct-tc-trending-block-solid">
                <Image
                  className="dct-tc-trending-block-image"
                  src={DexScreenerFireIcon}
                />
                <div>Trending</div>
              </div>

              <div className="dct-tc-trending-block">5M</div>
              <div className="dct-tc-trending-block">1H</div>
              <div className="dct-tc-trending-block">6H</div>
              <div className="dct-tc-trending-block dct-tc-trending-block-selected">
                24H
              </div>
            </div>
            <div className="dct-tc-options-container">
              <div className="dct-tc-options-block">
                <Image
                  className="dct-tc-options-image"
                  src={DexScreenerTopIcon}
                />
                <div className="dct-tc-options-text">Top</div>
              </div>
              <div className="dct-tc-options-block">
                <Image
                  className="dct-tc-options-image"
                  src={DexScreenerGainersIcon}
                />
                <div className="dct-tc-options-text">Gainers</div>
              </div>
              <div className="dct-tc-options-block">
                <Image
                  className="dct-tc-options-image"
                  src={DexScreenerNewPairsIcon}
                />
                <div className="dct-tc-options-text">New Pairs</div>
              </div>
              <div
                onClick={this.props.showPriceAlertModal}
                className="dct-tc-options-block"
              >
                <Image
                  className="dct-tc-options-image"
                  src={DexScreenerHeaderBellIcon}
                />
                <div className="dct-tc-options-text">Set alerts</div>
              </div>
            </div>
          </div>
        )}

        <div
          className={this.state.isMobile ? "newHomeTableContainerParent" : ""}
          style={{
            marginBottom: "2rem",
          }}
        >
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
              message="No tokens found"
              tableData={this.props.Average_cost_basis_local}
              columnList={this.props.columnData}
              isLoading={this.props.AvgCostLoading}
              yAxisScrollable
              addWatermark={!this.state.isMobile}
              fakeWatermark={this.state.isMobile}
              xAxisScrollable={this.state.isMobile}
              xAxisScrollableColumnWidth={4}
              isMiniversion={this.state.isMobile}
            />
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerTablePageContent);
