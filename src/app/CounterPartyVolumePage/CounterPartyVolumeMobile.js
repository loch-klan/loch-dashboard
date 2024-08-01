import React, { Component } from "react";
import { connect } from "react-redux";
import TransactionTable from "../intelligence/TransactionTable.js";

class CounterPartyVolume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      activeFooter: props.activeTitle ? props.activeTitle : 0,
    };
  }
  handleFooter = (event) => {
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
          <h4>Counterparty volume over time</h4>
          <p>Understand where this portfolio has exchanged the most value</p>
        </div>
        <div
          style={{
            backgroundColor: "var(--cardBackgroud",
            borderRadius: "1.2rem",
            padding: "0rem",
            paddingBottom: "0.5rem",
          }}
          className="assets-expanded-mobile"
        >
          <div
            style={{
              overflowX: "scroll",
              padding: "0rem 0.5rem",
              paddingTop: "0.5rem",
            }}
            className={`freezeTheFirstColumn newHomeTableContainer hide-scrollbar  ${
              this.props.counterGraphLoading || this.props.tableData < 1
                ? ""
                : "tableWatermarkOverlay"
            }`}
          >
            <TransactionTable
              noSubtitleBottomPadding
              disableOnLoading
              isMiniversion
              message="No counterparties found"
              tableData={this.props.tableData}
              columnList={this.props.columnData}
              headerHeight={60}
              isArrow={true}
              isLoading={this.props.counterGraphLoading}
              isAnalytics="counterparty page"
              fakeWatermark
              yAxisScrollable
              xAxisScrollable
              xAxisScrollableColumnWidth={3.6}
            />
          </div>
        </div>
        {/* <div
          className="mobile-portfolio-blocks"
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
              <div className="profit-chart profit-chart-mobile-expanded">
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
                  oldBar
                  noSubtitleBottomPadding
                  newHomeSetup
                  noSubtitleTopPadding
                  floatingWatermark
                  isMobileGraph
                  customGraphHeight="44rem"
                  customGraphLoadingHeight="100%"
                />
              </div>
            </div>
          </div>
        </div> */}
      </>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CounterPartyVolume);
