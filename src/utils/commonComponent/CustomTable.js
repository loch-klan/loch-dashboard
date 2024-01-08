import React from "react";
import { AutoSizer, Table, Column, ScrollSync } from "react-virtualized";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
// import notFoundDefault from "../../assets/images/empty-table.png";
import Pagination from "./Pagination";
import {
  Form,
  SelectControl,
  FormValidator,
  BaseReactComponent,
  FormElement,
} from "../form";
import Loading from "../../app/common/Loading";
import SmartMoneyPagination from "./SmartMoneyPagination";
import { ContributeTrophyIcon } from "../../assets/images/icons";
import CustomOverlay from "./CustomOverlay";
import { CurrencyType, noExponents, numToCurrency } from "../ReusableFunctions";

import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
} from "../../assets/images/icons";
class CustomTable extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
    };
  }
  onValidSubmit = () => {};

  render() {
    const {
      istopPagination = false,
      tableData,
      className = "",
      columnList = [],
      // notFoundImage = notFoundDefault,
      moduleName,
      message = "",
      isButton,
      buttonText,
      linkUrl,
      linkText,
      currentPage = 1,
      totalPage,
      history,
      location,
      pageSize = false,
      pageSizeOptions = [],
      handlePageSize = "",
      headerHeight,
      pagePrev,
      pageNext,
      isLoading,
      isStickyHead,
      isMiniversion,
      wrapperStyle
    } = this.props;
    return (
      <div
        className={`table-wrapper ${
          this.props.xAxisScrollable ? "table-wrapper-mobile-x-scroll" : ""
        } ${this.props.yAxisScrollable ? "table-wrapper-mobile-y-scroll" : ""}`}
        style={wrapperStyle}
      >
        {isLoading === true ? (
          <div
            className={`transaction-table-loading-wrapper ${
              isMiniversion ? "transaction-table-loading-wrapper-smaller" : ""
            }`}
          >
            <div
              style={{
                minHeight: this.props.xAxisScrollable ? "25rem" : "",
              }}
              className="animation-wrapper"
            >
              <Loading />
            </div>
          </div>
        ) : (
          <>
            <div className="header-navigation">
              {istopPagination &&
                tableData &&
                tableData.length >= 1 &&
                totalPage > 1 && (
                  <Pagination
                    history={history}
                    location={location}
                    page={currentPage}
                    pageCount={totalPage}
                    onPageChange={this.props.onPageChange}
                  />
                )}
              {pageSize && (
                <Form
                  onValidSubmit={this.onValidSubmit}
                  ref={(el) => (this.form = el)}
                >
                  <FormElement
                    valueLink={this.linkState(this, "pageSize")}
                    label="Page Size"
                    hint={{
                      title: "Title Custom",
                      description: <span> Custom Hint Bro! </span>,
                    }}
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty",
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        options: pageSizeOptions,
                        multiple: false,
                        searchable: true,
                        // menuIsOpen: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.pageSize);
                          handlePageSize(this.state.pageSize);
                          // console.log("Hello world!");
                        },
                      },
                    }}
                  />
                </Form>
              )}
            </div>
            {tableData && tableData.length > 0 ? (
              <>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <Table
                      width={
                        this.props.xAxisScrollable
                          ? width * (columnList.length / 3.5)
                          : width
                      }
                      height={
                        (this.props.showDataAtBottom && this.props.moreData
                          ? 58
                          : 60) *
                          (tableData.length + 1) -
                        10
                      }
                      headerHeight={headerHeight ? headerHeight : 80}
                      rowHeight={
                        this.props.showDataAtBottom && this.props.moreData
                          ? 58
                          : 60
                      }
                      rowCount={tableData.length}
                      rowGetter={({ index }) => tableData[index]}
                      className={`custom-table ${className}`}
                      gridClassName={`${
                        this.props.addWatermark ? "tableWatermark" : ""
                      } ${
                        this.props.bottomCombiedValues
                          ? "topMarginForCombiedValues"
                          : ""
                      } ${
                        this.props.addWatermarkMoveUp
                          ? "tableWatermarkMoveUp"
                          : ""
                      }`}
                    >
                      {columnList &&
                        columnList.length > 0 &&
                        columnList.map((item, key) => {
                          return (
                            <Column
                              key={key}
                              // width={item.coumnWidth}
                              width={
                                this.props.xAxisScrollable
                                  ? width *
                                    item.coumnWidth *
                                    (columnList.length / 3.5)
                                  : width * item.coumnWidth
                              }
                              className={item.className}
                              label={item.labelName}
                              dataKey={item.dataKey}
                              cellRenderer={({ rowData, rowIndex }) => {
                                return item.cell(
                                  rowData,
                                  item.dataKey,
                                  rowIndex
                                );
                              }}
                              headerClassName={item.headerClassName}
                            />
                          );
                        })}
                    </Table>
                  )}
                </AutoSizer>
                {/* {this.props.smartMoneyBlur ? (
                  <div className="smartMoneyBlurContainer">
                    <div className="smartMoneyBlurContainerTwo">
                      <div className="smartMoneyBlur">
                        <Image
                          className="smartMoneyBlurLogo"
                          src={ContributeTrophyIcon}
                        />
                        <div className="exit-overlay-body">
                          <h6 className="inter-display-medium f-s-24">
                            Sign in to view the Leaderboard
                          </h6>
                          <p className="inter-display-medium f-s-14 grey-969 mt-2">
                            View the smartest money on-chain
                          </p>
                        </div>
                      </div>
                      <Button
                        className="secondary-btn"
                        onClick={this.props.onBlurSignInClick}
                      >
                        Sign in / up now
                      </Button>
                    </div>
                  </div>
                ) : null} */}
              </>
            ) : (
              <>
                {this.props.showHeaderOnEmpty ? (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <Table
                        width={width}
                        height={60 * (tableData.length + 1) - 10}
                        headerHeight={headerHeight ? headerHeight : 80}
                        rowHeight={60}
                        rowCount={tableData.length}
                        rowGetter={({ index }) => tableData[index]}
                        className={`custom-table ${className}`}
                        gridClassName={`${
                          this.props.addWatermark ? "tableWatermark" : ""
                        } ${
                          this.props.addWatermarkMoveUp
                            ? "tableWatermarkMoveUp"
                            : ""
                        }`}
                      >
                        {columnList &&
                          columnList.length > 0 &&
                          columnList.map((item, key) => {
                            return (
                              <Column
                                key={key}
                                // width={item.coumnWidth}
                                width={width * item.coumnWidth}
                                className={item.className}
                                label={item.labelName}
                                dataKey={item.dataKey}
                                cellRenderer={({ rowData, rowIndex }) => {
                                  return item.cell(
                                    rowData,
                                    item.dataKey,
                                    rowIndex
                                  );
                                }}
                                headerClassName={item.headerClassName}
                              />
                            );
                          })}
                      </Table>
                    )}
                  </AutoSizer>
                ) : null}
                <div
                  className={`not-found-wrapper ${
                    isMiniversion ? "not-found-mini-wrapper" : ""
                  }`}
                >
                  {/* <Image src={notFoundImage} /> */}
                  <p className="inter-display-medium f-s-16 lh-19 grey-313">
                    {" "}
                    {moduleName ? "No " + moduleName + " Found" : message}
                  </p>
                  {isButton && (
                    <Button className="primary-btn" onClick={isButton}>
                      {buttonText}
                    </Button>
                  )}
                  {linkUrl && (
                    <Link className="primary-btn" to={linkUrl}>
                      {linkText}
                    </Link>
                  )}
                </div>
              </>
            )}
            {this.props.showDataAtBottom && this.props.moreData ? (
              <div className="inter-display-medium bottomExtraInfo">
                <div
                  className="bottomExtraInfoText"
                  onClick={this.props.moreDataHandleClick}
                >
                  {this.props.moreData}
                </div>
              </div>
            ) : null}
            {this.props.bottomCombiedValues ? (
              <div className="bottomCombinedItem">
                <div
                  aria-colindex="1"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0.05",
                  }}
                ></div>
                <div
                  aria-colindex="2"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0.1",
                  }}
                >
                  <div className="inter-display-medium bottomCombinedItemBlock">
                    Total:
                  </div>
                </div>
                <div
                  aria-colindex="3"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0.12",
                  }}
                ></div>
                <div
                  aria-colindex="4"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0.1",
                  }}
                ></div>
                <div
                  aria-colindex="5"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0.1",
                  }}
                ></div>
                <div
                  aria-colindex="6"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0.11",
                  }}
                >
                  <div className="cost-common-container">
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={
                        this.props.combinedCostBasis === 0
                          ? "N/A"
                          : CurrencyType(false) +
                            Number(
                              noExponents(
                                this.props.combinedCostBasis.toFixed(2)
                              )
                            ).toLocaleString("en-US")
                      }
                    >
                      <div className="cost-common">
                        <span
                          onMouseEnter={() => {
                            // CostCostBasisHover({
                            //   session_id: getCurrentUser().id,
                            //   email_address: getCurrentUser().email,
                            // });
                          }}
                        >
                          {this.props.combinedCostBasis === 0
                            ? "N/A"
                            : CurrencyType(false) +
                              numToCurrency(
                                this.props.combinedCostBasis.toFixed(2)
                              ).toLocaleString("en-US")}
                        </span>
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
                <div
                  aria-colindex="7"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0.11",
                  }}
                >
                  <div className="cost-common-container">
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={
                        this.props.combinedCurrentValue === 0
                          ? "N/A"
                          : CurrencyType(false) +
                            Number(
                              noExponents(
                                this.props.combinedCurrentValue.toFixed(2)
                              )
                            ).toLocaleString("en-US")
                      }
                    >
                      <div className="cost-common">
                        <span
                          onMouseEnter={() => {
                            // CostCostBasisHover({
                            //   session_id: getCurrentUser().id,
                            //   email_address: getCurrentUser().email,
                            // });
                          }}
                        >
                          {this.props.combinedCurrentValue === 0
                            ? "N/A"
                            : CurrencyType(false) +
                              numToCurrency(
                                this.props.combinedCurrentValue.toFixed(2)
                              ).toLocaleString("en-US")}
                        </span>
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
                <div
                  aria-colindex="8"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0.11",
                  }}
                >
                  <div
                    onMouseEnter={() => {
                      // CostGainHover({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }}
                    className="gainLossContainer"
                  >
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={
                        this.props.combinedUnrealizedGains
                          ? CurrencyType(false) +
                            Math.abs(
                              Number(
                                noExponents(
                                  this.props.combinedUnrealizedGains.toFixed(2)
                                )
                              )
                            ).toLocaleString("en-US")
                          : CurrencyType(false) + "0.00"
                      }
                      colorCode="#000"
                    >
                      <div className={`gainLoss`}>
                        {this.props.combinedUnrealizedGains &&
                        this.props.combinedUnrealizedGains !== 0 ? (
                          <Image
                            className="mr-2"
                            style={{
                              height: "1.5rem",
                              width: "1.5rem",
                            }}
                            src={
                              this.props.combinedUnrealizedGains < 0
                                ? ArrowDownLeftSmallIcon
                                : ArrowUpRightSmallIcon
                            }
                          />
                        ) : null}
                        <span className="inter-display-medium f-s-13 lh-16 grey-313">
                          {this.props.combinedUnrealizedGains
                            ? CurrencyType(false) +
                              numToCurrency(
                                this.props.combinedUnrealizedGains
                              ).toLocaleString("en-US")
                            : "0.00"}
                        </span>
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
                <div
                  aria-colindex="9"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0.11",
                  }}
                >
                  <div
                    onMouseEnter={() => {
                      // CostGainLossHover({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }}
                    className="gainLossContainer"
                  >
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={
                        this.props.combinedReturn &&
                        this.props.combinedReturn !== 0
                          ? Math.abs(this.props.combinedReturn).toLocaleString(
                              "en-US"
                            ) + "%"
                          : "0.00%"
                      }
                      colorCode="#000"
                    >
                      <div className={`gainLoss`}>
                        {this.props.combinedReturn &&
                        this.props.combinedReturn !== 0 ? (
                          <Image
                            className="mr-2"
                            style={{
                              height: "1.5rem",
                              width: "1.5rem",
                            }}
                            src={
                              this.props.combinedReturn < 0
                                ? ArrowDownLeftSmallIcon
                                : ArrowUpRightSmallIcon
                            }
                          />
                        ) : null}
                        <span className="inter-display-medium f-s-13 lh-16 grey-313">
                          {this.props.combinedReturn &&
                          this.props.combinedReturn !== 0
                            ? Math.abs(
                                noExponents(
                                  this.props.combinedReturn.toFixed(2)
                                )
                              ).toLocaleString("en-US") + "%"
                            : "0.00%"}
                        </span>
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
                <div
                  aria-colindex="9"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0.11",
                  }}
                >
                  <div
                    onMouseEnter={() => {
                      // CostGainLossHover({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }}
                    className="gainLossContainer"
                  >
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={"100%"}
                      colorCode="#000"
                    >
                      <div className={`gainLoss`}>
                        <span className="inter-display-medium f-s-13 lh-16 grey-313">
                          100%
                        </span>
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
        {this.props.isSmartMoney || this.props.paginationNew ? (
          tableData && tableData.length >= 1 && totalPage >= 1 ? (
            <SmartMoneyPagination
              openSignInOnclickModal={this.props.openSignInOnclickModal}
              smartMoneyBlur={this.props.smartMoneyBlur}
              history={history}
              location={location}
              page={currentPage + 1}
              pageCount={totalPage}
              pagePrev={pagePrev}
              pageNext={pageNext}
              pageLimit={this.props.pageLimit}
              changePageLimit={this.props.changePageLimit}
              onPageChange={this.props.onPageChange}
            />
          ) : null
        ) : (
          tableData &&
          tableData.length >= 1 &&
          totalPage > 1 && (
            <Pagination
              history={history}
              location={location}
              page={currentPage + 1}
              pageCount={totalPage}
              pagePrev={pagePrev}
              pageNext={pageNext}
              onPageChange={this.props.onPageChange}
            />
          )
        )}
      </div>
    );
  }
}

export default CustomTable;
