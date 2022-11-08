import React from "react";
import { AutoSizer, Table, Column } from "react-virtualized";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import notFoundDefault from "../../assets/images/empty-table.png";
import Pagination from "./Pagination";
import {
  Form,
  SelectControl,
  FormValidator,
  BaseReactComponent,
  FormElement,
} from "../form";
import Loading from "../../app/common/Loading";
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
      notFoundImage = notFoundDefault,
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
    } = this.props;
    return (
      <div className="table-wrapper">
        {this.props.isLoading === true 
        ? 
        (
          <>
            <div className="transaction-table-loading-wrapper">
              <div className="animation-wrapper">
                <Loading />
              </div>
            </div>
          </>
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
                          console.log("Hello world!");
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
                          />
                        );
                      })}
                  </Table>
                )}
              </AutoSizer>
            ) : (
              <div className="not-found-wrapper">
                {/* <Image src={notFoundImage} /> */}
                <p className="inter-display-medium f-s-16 black-404">
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
            {tableData && tableData.length >= 1 && totalPage > 1 && (
              <Pagination
                history={history}
                location={location}
                page={currentPage + 1}
                pageCount={totalPage}
                pagePrev={pagePrev}
                pageNext={pageNext}
              />
            )}
          
      </div>
    );
  }
}

export default CustomTable;
