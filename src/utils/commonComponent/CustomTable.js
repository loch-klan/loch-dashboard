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
import CustomOverlay from "./CustomOverlay";
import { CurrencyType, noExponents, numToCurrency } from "../ReusableFunctions";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
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
    } = this.props;
    return (
      <div className="table-wrapper">
        {isLoading === true ? (
          <div
            className={`transaction-table-loading-wrapper ${
              isMiniversion ? "transaction-table-loading-wrapper-smaller" : ""
            }`}
          >
            <div className="animation-wrapper">
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
                              return item.cell(rowData, item.dataKey, rowIndex);
                            }}
                            headerClassName={item.headerClassName}
                          />
                        );
                      })}
                  </Table>
                )}
              </AutoSizer>
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
            {this.props.bottomCombiedValues ? (
              <div className="bottomCombinedItem">
                <div
                  aria-colindex="1"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 67.9px",
                  }}
                ></div>
                <div
                  aria-colindex="2"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 169.75px",
                  }}
                ></div>
                <div
                  aria-colindex="3"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 169.75px",
                  }}
                ></div>
                <div
                  aria-colindex="4"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 169.75px",
                  }}
                ></div>
                <div
                  aria-colindex="5"
                  role="gridcell"
                  className="bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 169.75px",
                  }}
                ></div>
                <div
                  aria-colindex="6"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 176.54px",
                  }}
                >
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
                            noExponents(this.props.combinedCostBasis.toFixed(2))
                          ).toLocaleString("en-US")
                    }
                  >
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
                  </CustomOverlay>
                </div>
                <div
                  aria-colindex="7"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 176.54px",
                  }}
                >
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
                  </CustomOverlay>
                </div>
                <div
                  aria-colindex="8"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 176.54px",
                  }}
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
                    <div
                      onMouseEnter={() => {
                        // CostGainHover({
                        //   session_id: getCurrentUser().id,
                        //   email_address: getCurrentUser().email,
                        // });
                      }}
                      className="gainLossContainer"
                    >
                      <div
                        className={`gainLoss ${
                          this.props.combinedUnrealizedGains < 0
                            ? "loss"
                            : "gain"
                        }`}
                      >
                        {this.props.combinedUnrealizedGains &&
                        this.props.combinedUnrealizedGains !== 0 ? (
                          <Image
                            className="mr-2"
                            src={
                              this.props.combinedUnrealizedGains < 0
                                ? LossIcon
                                : GainIcon
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
                    </div>
                  </CustomOverlay>
                </div>
                <div
                  aria-colindex="9"
                  role="gridcell"
                  className="inter-display-medium bottomCombinedItemBlock"
                  style={{
                    flex: "0 1 176.54px",
                  }}
                >
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      this.props.combinedUnrealizedGains
                        ? Math.abs(
                            Number(
                              noExponents(
                                this.props.combinedUnrealizedGains.toFixed(2)
                              )
                            )
                          ).toLocaleString("en-US") + "%"
                        : "0%"
                    }
                    colorCode="#000"
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
                      <div
                        className={`gainLoss ${
                          this.props.combinedReturn < 0 ? "loss" : "gain"
                        }`}
                      >
                        {this.props.combinedReturn &&
                        this.props.combinedReturn !== 0 ? (
                          <Image
                            className="mr-2"
                            src={
                              this.props.combinedReturn < 0
                                ? LossIcon
                                : GainIcon
                            }
                          />
                        ) : null}
                        <span className="inter-display-medium f-s-13 lh-16 grey-313">
                          {this.props.combinedReturn
                            ? Math.abs(
                                noExponents(
                                  this.props.combinedReturn.toFixed(2)
                                )
                              ).toLocaleString("en-US") + "%"
                            : "0.00%"}
                        </span>
                      </div>
                    </div>
                  </CustomOverlay>
                </div>
              </div>
            ) : null}
          </>
        )}
        {this.props.isSmartMoney ? (
          tableData && tableData.length >= 1 && totalPage >= 1 ? (
            <SmartMoneyPagination
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
