import React, { Component } from "react";
import { connect } from "react-redux";
import { ComponentHeader } from "../common";
import { Grid, Image, Row, Col, Button, Tab, Tabs } from "react-bootstrap";
import CustomTable from "../../utils/commonComponent/CustomTable";
import {
  AccountType,
  API_LIMIT,
  OrderStatus,
  START_PAGE,
} from "../../utils/Constant";
import { getOrderRevenueReportApi, getReportsFranchiseWiseApi } from "./Api";
import moment from "moment";
import { getUserAccountType } from "../../utils/ManageToken";
import { getOrdersApi } from "../bookingManagement/Api";

class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conditions: [{ key: "SEARCH_BY_STATUS_IN", value: [30] }],
      orderRevenueReport: "",
      isDetail: true,
      selectedTab: "default",
      franchiseData: [
        {
          name: "F1",
          totalBooking: 23,
          totalVehicle: 20,
          deployed: 32,
          undeployed: 22,
          revenue: 2345,
        },
        {
          name: "F2",
          totalBooking: 23,
          totalVehicle: 20,
          deployed: 32,
          undeployed: 22,
          revenue: 2345,
        },
      ],
    };
  }

  componentDidMount() {
    getOrdersApi(this);
  }

  setKey = (k) => {
    this.setState(
      {
        selectedTab: k,
        page: 1,
        conditions: [
          {
            key: "SEARCH_BY_STATUS_IN",
            value: k === "default" ? [30] : [40],
          },
        ],
      },
      () => {
        getOrdersApi(this);
      }
    );
    this.props.history.replace({
      search: `?tab=${k}&p=1`,
    });
  };

  handleOnChange = (details) => {
    if (getUserAccountType() === AccountType.FRANCHISE) {
      this.setState(
        {
          conditions: [
            ...this.state.conditions,
            {
              key: "SEARCH_BY_DATE_BETWEEN",
              value: [
                moment(details.fromDate).unix(),
                moment(details.toDate).unix(),
              ],
            },
          ],
        },
        () => {
          // getOrdersApi(this);
          const data2 = new URLSearchParams();
          data2.append(
            "start_date",
            moment(details.fromDate).format("DD-MM-YYYY")
          );
          data2.append("end_date", moment(details.toDate).format("DD-MM-YYYY"));
          getOrderRevenueReportApi(data2, this);
        }
      );
    } else {
      console.log("data", details);
      const data = new URLSearchParams();
      data.append("start_date", moment(details.fromDate).format("DD-MM-YYYY"));
      data.append("end_date", moment(details.toDate).format("DD-MM-YYYY"));
      data.append("start", START_PAGE);
      data.append("limit", API_LIMIT);
      getReportsFranchiseWiseApi(data, this);
      const data2 = new URLSearchParams();
      data2.append("start_date", moment(details.fromDate).format("DD-MM-YYYY"));
      data2.append("end_date", moment(details.toDate).format("DD-MM-YYYY"));
      getOrderRevenueReportApi(data2, this);
    }
  };

  showOrders = (bookingsList) => {
    return (
      <div className="custom-table-wrapper">
        <CustomTable
          tableData={bookingsList}
          columnList={[
            {
              coumnWidth: 120,
              labelName: "Order Id",
              dataKey: "code",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "code") {
                  return rowData.code;
                }
              },
            },
            {
              coumnWidth: 230,
              labelName: "Customer Email",
              dataKey: "customer",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "customer") {
                  return rowData.customer?.email;
                }
              },
            },
            {
              coumnWidth: 230,
              labelName: "Start Time",
              dataKey: "start_datetime",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "start_datetime") {
                  return moment(rowData.start_datetime).format("LLL");
                }
              },
            },
            {
              coumnWidth: 230,
              labelName: "End Time",
              dataKey: "end_datetime",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "end_datetime") {
                  return moment(rowData.end_datetime).format("LLL");
                }
              },
            },
            {
              coumnWidth: 120,
              labelName: "Total Fare (₹)",
              dataKey: "total_amount",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "total_amount") {
                  return rowData.total_amount;
                }
              },
            },
            {
              coumnWidth: 120,
              labelName: "Status",
              dataKey: "status",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "status") {
                  return OrderStatus.getText(rowData.status);
                }
              },
            },
          ]}
          // For Pagination
          history={this.props.history}
          location={this.props.location}
          totalPages={this.state.totalPage}
          currentPage={this.state.page}
          message={"List is empty"}
        />
      </div>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p"), 10) || 1;

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p"), 10) || 1;
    const search = params.get("search") || "";

    if (prevPage !== page) {
      if (this.state.key === "default") {
        // getOrdersApi(this);
      } else {
        getOrdersApi(this, page - 1);
      }
    }
  }

  render() {
    const { franchiseData, reportData, orderRevenueReport, bookingsList } =
      this.state;
    return (
      <div>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"Company Report"}
          title={"Report"}
          isFilter={false}
          isSearch={false}
          isSettleSearch={false}
          isReport={true}
          onChangeMethod={(data) => this.handleOnChange(data)}
        />
        <div className="report-section">
          <div className="report-data">
            <Row>
              <Col sm={3}>
                <div className="report-box">
                  <h4>Total Hours</h4>
                  <h6>
                    {orderRevenueReport
                      ? parseFloat(
                          orderRevenueReport.total_booked_hours
                        ).toFixed(2)
                      : "NA"}
                  </h6>
                </div>
              </Col>
              <Col sm={3}>
                <div className="report-box">
                  <h4>Total Bookings</h4>
                  <h6>{orderRevenueReport.total_orders || "NA"}</h6>
                </div>
              </Col>
              <Col sm={6}>
                <div className="report-box">
                  <div className="left">
                    <h4>Total Revenue</h4>
                    <h6>
                      {orderRevenueReport
                        ? parseFloat(
                            orderRevenueReport.total_platform_amount +
                              orderRevenueReport.total_platform_amount
                          ).toFixed(2)
                        : "NA"}
                    </h6>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="analytic-data">
            <div className="data">
              <h3 className="red-hat-display-bold f-s-20 lh-26">
                Franchise wise data
              </h3>
            </div>
            <div className="data">
              <h3 className="red-hat-display-bold f-s-24 lh-32">
                {orderRevenueReport.total_franchise || "NA"}
              </h3>
              <h5 className="red-hat-display-medium lh-16">Franchise</h5>
            </div>
            <div className="data">
              <h3 className="red-hat-display-bold f-s-24 lh-32">
                {orderRevenueReport.total_vehicles || "NA"}
              </h3>
              <h5 className="red-hat-display-medium lh-16">Total vehicle</h5>
            </div>
            <div className="data">
              <h3 className="red-hat-display-bold f-s-24 lh-32">
                {orderRevenueReport
                  ? parseFloat(orderRevenueReport.avg_booked_hours).toFixed(2)
                  : "NA"}
              </h3>
              <h5 className="red-hat-display-medium lh-16">
                Average Booking Hours
              </h5>
            </div>
            <div className="data">
              <h3 className="red-hat-display-bold f-s-24 lh-32">
                {orderRevenueReport
                  ? parseFloat(orderRevenueReport.total_booked_hours).toFixed(2)
                  : "NA"}
              </h3>
              <h5 className="red-hat-display-medium lh-16">
                Total Booked Hours
              </h5>
            </div>
          </div>
          {getUserAccountType() === AccountType.FRANCHISE ? (
            <div className="tabular-data">
              <Tabs
                id="controlled-tab-example"
                activeKey={this.state.selectedTab}
                onSelect={(k) => this.setKey(k)}
                className="pricing-tabs"
              >
                <Tab eventKey="default" title="Upcoming">
                  {this.showOrders(bookingsList)}
                </Tab>

                <Tab eventKey="30" title="Return">
                  {this.showOrders(bookingsList)}
                </Tab>
              </Tabs>
            </div>
          ) : (
            <div className="tabular-data">
              <div className="custom-table-wrapper">
                <CustomTable
                  tableData={reportData}
                  columnList={[
                    {
                      coumnWidth: 280,
                      labelName: "Franchise Name",
                      dataKey: "franchise_name",
                      className: "red-hat-display-bold",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "franchise_name") {
                          return rowData.franchise_name;
                        }
                      },
                    },
                    {
                      coumnWidth: 250,
                      labelName: "Total Bookings",
                      dataKey: "total_orders",
                      className: "",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "total_orders") {
                          return rowData.total_orders;
                        }
                      },
                    },

                    {
                      coumnWidth: 300,
                      labelName: "Total Vehicle",
                      dataKey: "total_vehicles",
                      className: "",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "total_vehicles") {
                          return rowData.total_vehicles;
                        }
                      },
                    },
                    {
                      coumnWidth: 350,
                      labelName: "Average Booked Hours",
                      dataKey: "avg_booked_hours",
                      className: "",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "avg_booked_hours") {
                          return parseFloat(rowData.avg_booked_hours).toFixed(
                            2
                          );
                        }
                      },
                    },
                    {
                      coumnWidth: 350,
                      labelName: "Total Booked Hours",
                      dataKey: "total_booked_hours",
                      className: "",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "total_booked_hours") {
                          return parseFloat(rowData.total_booked_hours).toFixed(
                            2
                          );
                        }
                      },
                    },
                    {
                      coumnWidth: 350,
                      labelName: "Revenue",
                      dataKey: "total_platform_amount",
                      className: "",
                      isCell: true,
                      cell: (rowData, dataKey) => {
                        if (dataKey === "total_platform_amount") {
                          return parseFloat(
                            rowData.total_platform_amount +
                              rowData.total_franchise_amount
                          ).toFixed(2);
                        }
                      },
                    },
                  ]}
                  // For Pagination
                  history={this.props.history}
                  location={this.props.location}
                  totalPages={this.state.totalPage}
                  currentPage={this.state.page}
                  message={"List is empty"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  settlementState: state.SettlementState,
});
const mapDispatchToProps = {
  getReportsFranchiseWiseApi,
  getOrderRevenueReportApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
