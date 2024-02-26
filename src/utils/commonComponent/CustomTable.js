import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AutoSizer, Column, MultiGrid, Table } from "react-virtualized";
// import notFoundDefault from "../../assets/images/empty-table.png";
import Loading from "../../app/common/Loading";
import {
  BaseReactComponent,
  Form,
  FormElement,
  FormValidator,
  SelectControl,
} from "../form";
import Pagination from "./Pagination";
import SmartMoneyPagination from "./SmartMoneyPagination";

class CustomTable extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
    };
  }
  onValidSubmit = () => {};
  headercolumns = [
    { name: "product", displayName: "商品", width: 120 },
    { name: "Price", displayName: "成交價", width: 80 },
    { name: "UpDown", displayName: "漲跌", width: 120 },
    { name: "TotVol", displayName: "成交量", width: 80 },
    { name: "UpDownRate", displayName: "漲跌幅(%)", width: 80 },
    { name: "Open", displayName: "開盤", width: 80 },
    { name: "high", displayName: "最高", width: 80 },
    { name: "low", displayName: "最低", width: 80 },
    { name: "PrePrice", displayName: "昨收", width: 70 },
    { name: "BPrice", displayName: "買進價", width: 80 },
    { name: "APrice", displayName: "賣出價", width: 80 },
  ];

  widthcount = 50;
  // heightcount = one.length;
  heightcount = 1000;
  data = this.generateData();

  generateData() {
    const rows = [];

    for (let i = 0; i < this.heightcount; i++) {
      rows[i] = [];

      for (let j = 0; j < this.widthcount; j++) {
        // if (j === 0) rows[i].push(one[i].displayName);
        if (j === 0) rows[i].push(`期貨${i}, ${j}`);
        else rows[i].push(`${i}, ${j}`);
      }
    }

    return rows;
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const tempData = this.props.tableData;
    const tempDataColList = this.props.columnList;
    const passedClassName = tempDataColList[columnIndex].className;
    const passedHeaderClassName = tempDataColList[columnIndex].headerClassName;
    if (rowIndex === 0) {
      return (
        <div
          key={key}
          style={style}
          className={`multigridHeaderColumnBottomBorder multigridHeaderColumnPadding ${
            rowIndex === 0 ? "multigridHeaderColumn" : "multigridBodyColumn"
          } ${passedHeaderClassName ? passedHeaderClassName : ""}`}
        >
          {tempDataColList[columnIndex].labelName}
        </div>
      );
    } else {
      return (
        <div
          key={key}
          style={style}
          className={` ReactVirtualized__Table__rowColumn ${
            rowIndex === 0 ? "multigridHeaderColumn" : "multigridBodyColumn"
          } ${passedClassName ? passedClassName : ""}`}
        >
          {tempDataColList[columnIndex].cell(
            tempData[rowIndex - 1],
            tempDataColList[columnIndex].dataKey,
            rowIndex - 1
          )}
          {/* {tempData[rowIndex].AssetCode} */}
        </div>
      );
    }
  };

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
      wrapperStyle,
      watermarkOnTop,
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
              <div
                className={`this.props.tableParentClass ${
                  this.props.addWatermark
                    ? "tableWatermark"
                    : this.props.fakeWatermark
                    ? "tableWatermarkFake"
                    : ""
                } ${
                  this.props.addWatermarkMoveUp ? "tableWatermarkMoveUp" : ""
                }`}
              >
                <AutoSizer disableHeight>
                  {({ width }) => {
                    return (
                      <MultiGrid
                        cellRenderer={this.cellRenderer}
                        fixedColumnCount={
                          this.props.freezeColumns
                            ? this.props.freezeColumns
                            : 0
                        }
                        fixedRowCount={
                          this.props.freezeRows ? this.props.freezeRows : 1
                        }
                        height={
                          (this.props.rowHeight
                            ? this.props.rowHeight
                            : this.props.showDataAtBottom && this.props.moreData
                            ? 58
                            : 60) *
                          (this.props.showHowHamyRowsAtOnce
                            ? this.props.showHowHamyRowsAtOnce <
                              this.props.tableData?.length
                              ? this.props.showHowHamyRowsAtOnce
                              : this.props.tableData?.length + 1
                            : 5)
                        }
                        width={width}
                        columnCount={this.props.columnList?.length}
                        columnWidth={({ index }) =>
                          this.props.xAxisScrollable
                            ? width *
                              this.props.columnList[index].coumnWidth *
                              (columnList.length /
                                (this.props.xAxisScrollableColumnWidth
                                  ? this.props.xAxisScrollableColumnWidth
                                  : 3.5))
                            : width * this.props.columnList[index].coumnWidth
                        }
                        rowCount={tableData.length + 1}
                        rowHeight={
                          this.props.rowHeight
                            ? this.props.rowHeight
                            : this.props.showDataAtBottom && this.props.moreData
                            ? 58
                            : 60
                        }
                      ></MultiGrid>
                    );
                  }}
                </AutoSizer>
              </div>
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
                        } ${watermarkOnTop ? "watermarkOnTop" : ""}`}
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
          </>
        )}

        {this.props.isSmartMoney ||
        this.props.paginationNew ||
        this.props.minimalPagination ? (
          tableData && tableData.length >= 1 && totalPage >= 1 && !isLoading ? (
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
              hidePaginationRecords={this.props.hidePaginationRecords}
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
