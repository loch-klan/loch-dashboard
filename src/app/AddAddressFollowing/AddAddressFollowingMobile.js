import React from "react";
import { Form, Image } from "react-bootstrap";
import { connect } from "react-redux";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";
import CustomTextControl from "../../utils/form/CustomTextControl.js";
import FormElement from "../../utils/form/FormElement.js";
import TransactionTable from "../intelligence/TransactionTable.js";

class AddAddressFollowingMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter table-header-font no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16">Account</span>
          </div>
        ),
        dataKey: "account",
        coumnWidth: 0.35,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return <div />;
          }
        },
      },
      {
        labelName: (
          <div
            className={`cp history-table-header-col goToCenter table-header-font ${
              this.props.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="Accounts"
            onClick={() => {
              if (this.props.tableData.length > 0) {
                this.props.handleSort(this.props.tableSortOpt[0].title);
              }
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16">Nametag</span>
          </div>
        ),
        dataKey: "nametag",
        coumnWidth: 0.35,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "nametag") {
            return rowData.nameTag ? <div /> : "-";
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4"></span>
          </div>
        ),
        dataKey: "deleteCol",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "deleteCol") {
            return <div />;
          }
        },
      },
    ];
    return (
      <div className="add-address-following-page-container">
        <div className=" watchlist-mobile">
          <div className="mobile-header-container">
            <h4>Following</h4>
            <p>Addresses you follow</p>
          </div>
          <div
            className="combine-search-prefix-icon"
            style={{ marginTop: "1.2rem" }}
          >
            <Form
              onValidSubmit={() => this.props.onValidSubmit(this.state.search)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-betwee",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div className="searchBar top-account-search input-noshadow-dark">
                    <Image src={searchIcon} className="search-icon" />
                    <div className="form-groupContainer">
                      <FormElement
                        valueLink={this.linkState(
                          this,
                          "search",
                          this.onChangeMethod
                        )}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Search",
                          },
                        }}
                        classes={{
                          inputField: "search-input watchListSearchInput",
                          prefix: "search-prefix",
                          suffix: "search-suffix",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>

          <div
            style={{
              backgroundColor:
                this.props?.tableData.length > 0 ? "" : "var(--cardBackgroud)",
              marginBottom: this.props?.tableData.length > 0 ? "" : "2rem",
              marginTop: "2rem",
              borderRadius: "1.2rem",
            }}
            className="transaction-table-section"
          >
            <TransactionTable
              columnList={columnList}
              tableData={this.props.tableData}
              tableSortOpt={this.props.tableSortOpt}
              handleSort={this.props.handleSort}
              isMiniVersion
              message="Follow wallet addresses or ENS names effortlessly."
              headerHeight={60}
              paginationNew
              totalPage={this.props.totalPage}
              history={this.props.history}
              location={this.props.location}
              page={this.props.currentPage}
              onPageChange={this.props.onPageChange}
              minimalPagination
              hidePaginationRecords
              currentPage={this.props.page}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressFollowingMobile);
