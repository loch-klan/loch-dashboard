import React from "react";
import { connect } from "react-redux";
import searchIcon from "../../assets/images/icons/search-icon.svg";

import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form/index.js";
import Loading from "../common/Loading.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination.js";
import { Col, Image, Row } from "react-bootstrap";
import CustomDropdown from "../../utils/form/CustomDropdownPrice.js";
import {
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_CHAIN_IN,
} from "../../utils/Constant.js";

class YieldOpportunitiesPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };
  }

  onChangeMethod = () => {};

  render() {
    return (
      <div className="yield-opp-page-mobile">
        <div
          style={{
            marginBottom: "0rem",
          }}
          className="mobile-header-container"
        >
          <h4>Yield opportunities</h4>
          <p>Yield bearing opportunities personalized for this portfolio</p>
        </div>

        <div
          className="combine-search-prefix-icon"
          style={{ marginTop: "1.5rem" }}
        >
          <Form onValidSubmit={this.props.onValidSubmit}>
            <Row
              style={{
                marginLeft: "0px",
                marginRight: "0px",
                gap: "10px",
              }}
            >
              <Col
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <CustomDropdown
                  filtername="All networks"
                  options={this.props.OnboardingState.coinsList}
                  action={SEARCH_BY_CHAIN_IN}
                  handleClick={this.props.handleFunction}
                  searchIsUsed={this.props.networkSearchIsUsed}
                  isCaptialised
                  isGreyChain
                />
              </Col>

              <Col
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <CustomDropdown
                  filtername="All tokens"
                  options={this.props.intelligenceState.assetFilter}
                  action={SEARCH_BY_ASSETS_IN}
                  handleClick={(key, value) =>
                    this.props.addCondition(key, value)
                  }
                  searchIsUsed={this.props.assetSearchIsUsed}
                />
              </Col>
            </Row>
            <div
              className="searchBar input-noshadow-dark"
              style={{ marginTop: "1.5rem" }}
            >
              <Image src={searchIcon} className="search-icon" />
              <FormElement
                valueLink={this.props.parentCtx.linkState(
                  this.props.parentCtx,
                  "search",
                  this.props.onChangeMethod
                )}
                control={{
                  type: CustomTextControl,
                  settings: {
                    placeholder: "Search",
                  },
                }}
                classes={{
                  inputField: "search-input",
                  prefix: "search-prefix",
                  suffix: "search-suffix",
                }}
              />
            </div>
          </Form>
        </div>
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              backgroundColor: "var(--cardBackgroud)",
              borderRadius: "1rem",
              margin: "2rem 0rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div>
            <div
              style={{
                backgroundColor:
                  this.props?.tableData.length > 0
                    ? ""
                    : "var(--cardBackgroud)",
                marginBottom: "2rem",
                marginTop: "2rem",
                borderRadius: "1.2rem",
              }}
              className={`freezeTheFirstColumn section-table section-table-mobile-scroll hide-scrollbar ${
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
                xAxisScrollableColumnWidth={3.4}
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
                onPageChange={this.props.onPageChange}
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
