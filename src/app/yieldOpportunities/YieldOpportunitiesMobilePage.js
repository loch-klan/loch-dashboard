import React from "react";
import { connect } from "react-redux";

import { BaseReactComponent } from "../../utils/form/index.js";
import Loading from "../common/Loading.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination.js";

class YieldOpportunitiesPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="yield-opp-page-mobile">
        <div className="mobile-header-container">
          <h4>Yield opportunities</h4>
          <p
            style={{
              lineHeight: "1.5rem",
            }}
          >
            Yield bearing opportunties personalized for your portfolio
          </p>
        </div>
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              backgroundColor: "white",
              borderRadius: "1rem",
              margin: "1.5rem 0rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div>
            <div
              style={{
                backgroundColor:
                  this.props?.tableData.length > 0 ? "" : "white",
                marginBottom: "2rem",
                marginTop: "2rem",
                borderRadius: "1.2rem",
              }}
              className={`section-table section-table-mobile-scroll ${
                this.props.tableData && this.props.tableData.length > 0
                  ? "tableWatermarkOverlayCounterParty"
                  : ""
              }`}
            >
              <TransactionTable
                tableData={this.props.tableData}
                columnList={this.props.columnList}
                message={"No yield opportunities found"}
                xAxisScrollable
                xAxisScrollableColumnWidth={3}
                noSubtitleBottomPadding
                disableOnLoading
                isMiniversion
                headerHeight={60}
                isArrow={true}
                fakeWatermark
                minimalPagination
              />
            </div>
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                isMobile
                onPageChange={this.onPageChange}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

YieldOpportunitiesPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YieldOpportunitiesPage);
