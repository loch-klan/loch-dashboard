import { Col, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import {
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_CHAIN_IN,
  SEARCH_BY_TIMESTAMP_IN,
} from "../../utils/Constant";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination";
import { BaseReactComponent } from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdown";
import CustomMinMaxDropdown from "../../utils/form/CustomMinMaxDropdown";
import TransactionTable from "./TransactionTable";
import "./intelligenceScss/_inflowOutflowChart.scss";
import Loading from "../common/Loading";

class TransactionHistoryPageMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="assets-expanded-mobile expanded-mobile">
        <div
          style={{
            marginBottom: "0rem",
          }}
          className="mobile-header-container"
        >
          <h4>Transactions</h4>
          <p>Sort, filter, and dissect all the transactions from one place</p>
        </div>
        <div
          style={{
            marginTop: "1.5rem",
          }}
          onClick={this.props.showHideDustFun}
          className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn"
        >
          <Form.Check
            type="switch"
            checked={this.props.showHideDustVal}
            // onChange={(e) => {
            //   this.setState({
            //     switchselected: e.target.checked,
            //   });
            //   if (this.props.setSwitch) {
            //     this.props.setSwitch();
            //   }
            // }}
            label={
              this.props.showHideDustVal
                ? "Reveal dust (less than $1)"
                : "Hide dust (less than $1)"
            }
          />
        </div>
        <div className="mt-4">
          <div className="fillter_tabs_section transaction-history-page-filters">
            {/* <Form onValidSubmit={this.props.onValidSubmit}>
              <Row className="transaction-history-page-filters-row">
                <Col className="transactionHistoryCol">
                  <CustomMinMaxDropdown
                    filtername="Size"
                    handleClick={(min, max) =>
                      this.props.handleAmount(min, max)
                    }
                    minAmount={this.props.minAmount}
                    maxAmount={this.props.maxAmount}
                  />
                </Col>
                <Col className="transactionHistoryCol">
                  <CustomDropdown
                    filtername="Years"
                    options={this.props.intelligenceState.yearFilter}
                    action={SEARCH_BY_TIMESTAMP_IN}
                    handleClick={(key, value) =>
                      this.props.addCondition(key, value)
                    }
                    searchIsUsed={this.props.timeSearchIsUsed}
                    selectedTokens={this.props.selectedTimes}
                    transactionHistorySavedData
                  />
                </Col>
              </Row>
              <Row className="mt-3 transaction-history-page-filters-row">
                <Col className="transactionHistoryCol">
                  <CustomDropdown
                    filtername="Assets"
                    options={this.props.intelligenceState.assetFilter}
                    action={SEARCH_BY_ASSETS_IN}
                    handleClick={(key, value) =>
                      this.props.addCondition(key, value)
                    }
                    searchIsUsed={this.props.assetSearchIsUsed}
                    selectedTokens={this.props.selectedAssets}
                    transactionHistorySavedData
                  />
                </Col>
                <Col className="transactionHistoryCol">
                  <CustomDropdown
                    filtername="Networks"
                    options={this.props.OnboardingState.coinsList}
                    action={SEARCH_BY_CHAIN_IN}
                    handleClick={this.props.handleFunction}
                    searchIsUsed={this.props.networkSearchIsUsed}
                    isCaptialised
                    isGreyChain
                    selectedTokens={this.props.selectedNetworks}
                    transactionHistorySavedData
                  />
                </Col>
              </Row>
            </Form> */}
          </div>
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
                  columnList={this.props.columnData}
                  message="No transactions found"
                  xAxisScrollable
                  xAxisScrollableColumnWidth={3.15}
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
            {this.props.tableData &&
            this.props.tableData.length > 0 &&
            !this.props.tableLoading ? (
              <div className="mt-4">
                <SmartMoneyPagination
                  isMobile
                  pageCount={this.props.totalPage}
                  history={this.props.history}
                  location={this.props.location}
                  page={this.props.currentPage + 1}
                  onPageChange={this.props.onPageChange}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

TransactionHistoryPageMobile.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionHistoryPageMobile);
