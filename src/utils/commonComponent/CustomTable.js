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
import { ContributeTrophyIcon } from "../../assets/images/icons";
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
    } = this.props;
    return (
      <div className="table-wrapper">
        {isLoading === true ? (
          <div className="transaction-table-loading-wrapper">
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

              <>
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
                      gridClassName={
                      this.props.addWatermark ? "tableWatermark" : ""
                    }
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
                              cellRenderer={({ rowData }) => {
                                return item.cell(rowData, item.dataKey);
                              }}
                              headerClassName={item.headerClassName}
                            />
                          );
                        })}
                    </Table>
                  )}
                </AutoSizer>
                {this.props.topAccountBlur ? (
                  <div className="topAccountLeaderBoardBlurContainer">
                    <div className="topAccountLeaderBoardBlurContainerTwo">
                      <div className="topAccountLeaderBoardBlur">
                        <Image
                          className="topAccountLeaderBoardBlurLogo"
                          src={ContributeTrophyIcon}
                        />
                        <div className="exit-overlay-body">
                          <h6 className="inter-display-medium f-s-24">
                            Contribute to the community to see more
                          </h6>
                          <p className="inter-display-medium f-s-14 grey-969 mt-2">
                            Add an address worth at least $1m to the community
                            board to view the full list
                          </p>
                        </div>
                      </div>
                      <Button
                        className="secondary-btn"
                        onClick={this.props.blurButtonClick}
                      >
                        Add address now
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="not-found-wrapper">
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
            )}
          </>
        )}
        {!this.props.topAccountBlur &&
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
          )}
      </div>
    );
  }
}

export default CustomTable;
