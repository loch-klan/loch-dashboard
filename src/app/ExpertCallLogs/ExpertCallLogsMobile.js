import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import { getAvgCostBasis } from "../cost/Api";
import TransactionTable from "../intelligence/TransactionTable";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
// import { getNFT } from "./NftApi";
import Loading from "../common/Loading";
import "./_expertCallLogs.scss";

class ExpertCallLogsMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    return (
      <div className="assets-expanded-mobile expanded-mobile">
        <div
          style={{
            marginBottom: "0rem",
          }}
          className="mobile-header-container"
        >
          <h4>Expert Call Logs</h4>
          <p>
            Browse all calls, including those made, scheduled, and cancelled
          </p>
        </div>

        <div className="mt-4">
          <div className="fillter_tabs_section transaction-history-page-filters"></div>
        </div>
        {this.props.tableLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              backgroundColor: "var(--cardBackgroud)",
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
                backgroundColor: "var(--cardBackgroud)",
                borderRadius: "1.2rem",
                padding: "0rem",
              }}
            >
              <div
                style={{
                  overflowX: "scroll",
                  marginTop: "2rem",
                  paddingTop: "0.5rem",
                }}
                className={`freezeTheFirstColumn section-table section-table-mobile-scroll hide-scrollbar  ${
                  this.props.tableLoading || this.props.tableData < 1
                    ? ""
                    : "tableWatermarkOverlay"
                }`}
              >
                <TransactionTable
                  tableData={this.props.tableData}
                  columnList={this.props.columnList}
                  message="No transactions found"
                  xAxisScrollable
                  xAxisScrollableColumnWidth={2.3}
                  noSubtitleBottomPadding
                  disableOnLoading
                  isMiniversion
                  showHeaderOnEmpty
                  headerHeight={60}
                  isArrow={true}
                  fakeWatermark
                  minimalPagination
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  NFTState: state.NFTState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  updateWalletListFlag,
  getAllCoins,
  getAvgCostBasis,
  GetAllPlan,
  getUser,
  getAllWalletListApi,
  setPageFlagDefault,
};

ExpertCallLogsMobile.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertCallLogsMobile);
