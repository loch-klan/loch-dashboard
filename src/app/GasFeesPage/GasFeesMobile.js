import React, { Component } from "react";
import { connect } from "react-redux";
import BarGraphSection from "../common/BarGraphSection.js";
import { BarGraphFooter } from "../common/BarGraphFooter.js";
import Loading from "../common/Loading.js";

class GasFeesMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      activeFooter: props.activeTitle ? props.activeTitle : 0,
    };
  }
  handleFooter = (event) => {
    if (!this.props.isPremiumUser) {
      this.props.goToPayModal();
      return null;
    }
    this.setState({
      activeFooter: event.target.id,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
    });

    if (this.props.timeFunction) {
      this.props.timeFunction(event.target.id, this.state.activeBadgeList);
    }
  };
  render() {
    return (
      <>
        <div className="mobile-header-container">
          <h4>Gas fees over time</h4>
          <p>Understand your gas costs</p>
        </div>
        {this.props.netFlowLoading ? (
          <div
            style={{
              height: "70vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              backgroundColor: "white",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div
            className="mobile-portfolio-blocks mobile-portfolio-blocks-gas-fees-expanded"
            style={{
              marginTop: "0rem",
              maxHeight: "none",
            }}
          >
            <div
              style={{
                padding: "1.5rem 1rem",
              }}
              className="mobile-portfolio-blocks-content portfolio-page-section portfolio-page-section-mobile"
            >
              <div
                className="section-table section-table-mobile"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "none",
                }}
              >
                <div className="profit-chart profit-chart-mobile-expanded gas-fees-chart-mobile-expanded">
                  {this.props.counterGraphLoading ? null : (
                    <div
                      style={{
                        width: "100%",
                      }}
                    >
                      <BarGraphFooter
                        divideInTwo
                        handleFooterClick={this.handleFooter}
                        active={this.state.activeFooter}
                        isMobileGraph
                      />
                    </div>
                  )}
                  <BarGraphSection
                    goToPayModal={this.props.goToPayModal}
                    isBlurred={!this.props.isPremiumUser}
                    digit={this.props.counterGraphDigit}
                    isFromHome
                    data={
                      this.props.counterPartyValueLocal &&
                      this.props.counterPartyValueLocal[0]
                    }
                    options={
                      this.props.counterPartyValueLocal &&
                      this.props.counterPartyValueLocal[1]
                    }
                    options2={
                      this.props.counterPartyValueLocal &&
                      this.props.counterPartyValueLocal[2]
                    }
                    isScrollVisible={false}
                    isScroll={true}
                    isLoading={this.props.counterGraphLoading}
                    chainSearchIsUsed={this.props.feesChainSearchIsUsed}
                    selectedActiveBadge={this.props.selectedActiveBadgeLocal}
                    coinsList={this.props.coinsList}
                    handleBadge={this.props.handleBadge}
                    oldBar
                    noSubtitleBottomPadding
                    newHomeSetup
                    noSubtitleTopPadding
                    floatingWatermark
                    isMobileGraph={true}
                    customGraphHeight="44rem"
                    showBadges
                    customGraphLoadingHeight="100%"
                    isGasFeesMobileExpanded
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GasFeesMobile);
