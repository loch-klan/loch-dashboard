import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import TransactionTable from "./TransactionTable";
import { Col, Form, Image, Row } from "react-bootstrap";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination";
import CustomMinMaxDropdown from "../../utils/form/CustomMinMaxDropdown";
import CustomDropdown from "../../utils/form/CustomDropdown";
import "./intelligenceScss/_inflowOutflowChart.scss";
import {
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_CHAIN_IN,
  SEARCH_BY_METHOD_IN,
  SEARCH_BY_TIMESTAMP_IN,
} from "../../utils/Constant";

class TransactionHistoryPageMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="assets-expanded-mobile expanded-mobile">
        <div className="mobile-header-container">
          <h4>Transactions</h4>
          <p>Sort, filter, and dissect all your transactions from one place</p>
        </div>
        <div
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
            <Form onValidSubmit={this.props.onValidSubmit}>
              <Row className="transaction-history-page-filters-row">
                <Col className="transactionHistoryCol">
                  {/* <DropDown
                      class="cohort-dropdown"
                      list={[
                        // "All time",
                        "$10K or less",
                        "$10K - $100K",
                        "$100K - $1M",
                        "$1M - $10M",
                        "$10M - $100M",
                        "$100M or more",
                      ]}
                      onSelect={this.handleAmount}
                      title={this.state.amountFilter}
                      activetab={
                        this.state.amountFilter === "Size"
                          ? ""
                          : this.state.amountFilter
                      }
                      showChecked={true}
                      customArrow={true}
                      relative={true}
                      arrowClassName="singleArrowClassName"
                    /> */}
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
            </Form>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1.2rem",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              overflowX: "scroll",
              marginTop: "1.5rem",
            }}
            className={`newHomeTableContainer  ${
              this.props.tableLoading || this.props.tableData < 1
                ? ""
                : "tableWatermarkOverlay"
            }`}
          >
            <TransactionTable
              noSubtitleBottomPadding
              disableOnLoading
              isMiniversion
              message="No transactions found"
              tableData={this.props.tableData}
              columnList={this.props.columnData}
              headerHeight={60}
              isArrow={true}
              isLoading={this.props.tableLoading}
              isAnalytics="average cost basis"
              fakeWatermark
              xAxisScrollable
              yAxisScrollable
              xAxisScrollableColumnWidth={3}
              tableSortOpt={this.props.tableSortOpt}
              handleSort={this.props.handleSort}
              isMiniVersion
              // paginationNew
              // totalPage={this.props.totalPage}
              // history={this.props.history}
              // location={this.props.location}
              // page={this.props.currentPage}
              // onPageChange={this.props.onPageChange}
              // minimalPagination
              // hidePaginationRecords
              // currentPage={this.props.currentPage}
            />
          </div>
        </div>
        {this.props.tableData && this.props.tableData.length > 0 ? (
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
