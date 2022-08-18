import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { ComponentHeader } from "../common"
import { Grid, Image, Row, Col, Button, Tab, Tabs } from "react-bootstrap"
import CustomTable from "../../utils/commonComponent/CustomTable"
import SettlePaymentModal from "./SettlePayment"
import settleIcon from "../../assets/images/icons/settlement-icon.svg"
import { getSettlementReportApi } from "./Api"
import { OrderStatus } from "../../utils/Constant"
import moment from "moment"
import { AccountType, PermissionList, START_PAGE } from "../../utils/Constant"
import ActionDropdown from "../common/_utils/ActionDropdown"
import {
  getAssignedPermission,
  replaceHistory
} from "../../utils/ReusableFunctions"
import { getAllFranchiseApi } from "../franchise/Api"
import notFoundImage from "../../assets/images/empty-table.png"

class Settlement extends Component {
  constructor(props) {
    super(props)
    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    this.state = {
      settlementReport: [],
      selectedTab: "30",
      showSettlePaymentModal: false,
      userDetails,
      isFranchise: false
    }
  }

  componentDidMount() {
    // this.getSettlementReport();
    // API CALL FOR SETTLEMENT FILTER
    if (this.state.userDetails.user_account_type !== AccountType.COMPANY) {
      this.setState({ isFranchise: true })
    } else {
      this.props.getAllFranchiseApi(this, -1)
    }
  }

  filterSearch = (fromDate, toDate, franchiseId) => {
    this.setState({ fromDate, toDate, franchiseId })
    this.getSettlementReport(
      this.state.selectedTab,
      fromDate,
      toDate,
      franchiseId
    )
  }

  getSettlementReport = (selectedTab, fromDate, toDate, franchiseId) => {
    getSettlementReportApi(this, selectedTab, fromDate, toDate, franchiseId)
  }

  setKey = (k) => {
    this.setState(
      {
        selectedTab: k,
        page: 1,
        conditions: [
          {
            key: k === "default" ? "Settled" : "Unsettled",
            value: k === "default" ? true : parseInt(k)
          }
        ]
      },
      () => {
        const data2 = new URLSearchParams()
        this.getSettlementReport(
          this.state.selectedTab,
          this.state.fromDate,
          this.state.toDate,
          this.state.franchiseId
        )
      }
    )
    this.props.history.replace({
      search: `?tab=${k}&p=1`
    })
  }

  handleSettlementPayModal = () => {
    this.setState({
      showSettlePaymentModal: !this.state.showSettlePaymentModal
    })
  }

  showSettledData = (pricingData, permissionList) => {
    return (
      <div className="custom-table-wrapper">
        <CustomTable
          tableData={pricingData}
          columnList={[
            {
              coumnWidth: 280,
              labelName: "Settlement ID",
              dataKey: "id",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "id") {
                  return rowData.id
                }
              }
            },
            {
              coumnWidth: 250,
              labelName: "Amount (₹)",
              dataKey: "final_amount",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "final_amount") {
                  return rowData.final_amount
                }
              }
            },

            {
              coumnWidth: 300,
              labelName: "End Time",
              dataKey: "settled_on",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "settled_on") {
                  return moment(rowData.settled_on).format("LLL")
                }
              }
            },
            {
              coumnWidth: 350,
              labelName: "Transaction Reference ID",
              dataKey: "reference_id",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "reference_id") {
                  return rowData.reference_id
                }
              }
            }
          ]}

        // For Pagination
        //   history={this.props.history}
        //   location={this.props.location}
        //   totalPages={this.state.totalPages}
        //   currentPage={this.state.page - 1} // because of 0 based indexing
        //   message={"Pricing list is empty"}
        />
      </div>
    )
  }

  showTable = (pricingData, permissionList) => {
    return (
      <div className="custom-table-wrapper">
        <CustomTable
          tableData={pricingData}
          columnList={[
            {
              coumnWidth: 150,
              labelName: "Order Id",
              dataKey: "code",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "code") {
                  return rowData.code
                }
              }
            },
            {
              coumnWidth: 150,
              labelName: "Vehicle",
              dataKey: "status",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "status") {
                  return (
                    rowData?.vehicle_inventory_details?.name +
                    "-" +
                    rowData?.vehicle_inventory_details?.registration_no
                  )
                }
              }
            },
            {
              coumnWidth: 250,
              labelName: "Start Time",
              dataKey: "start_datetime",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "start_datetime") {
                  return moment(rowData.start_datetime).format("LLL")
                }
              }
            },
            {
              coumnWidth: 250,
              labelName: "End Time",
              dataKey: "end_datetime",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "end_datetime") {
                  return moment(rowData.end_datetime).format("LLL")
                }
              }
            },
            // {
            //   coumnWidth: 300,
            //   labelName: "Franchisee Name",
            //   dataKey: "end_datetime",
            //   className: "",
            //   isCell: true,
            //   cell: (rowData, dataKey) => {
            //     if (dataKey === "end_datetime") {
            //       return moment(rowData.end_datetime).format('LLL')
            //     }
            //   }
            // },
            {
              coumnWidth: 150,
              labelName: "Total Fare (₹)",
              dataKey: "total_amount",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "total_amount") {
                  return rowData.total_amount
                }
              }
            },
            {
              coumnWidth: 150,
              labelName: "Status",
              dataKey: "status",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "status") {
                  return OrderStatus.getText(rowData.status)
                }
              }
            }

            // {
            //     coumnWidth: 50,
            //     labelName: "",
            //     dataKey: "options",
            //     className: "options-column",
            //     isCell: true,
            //     cell: (rowData, dataKey) => {
            //         if (dataKey === "options") {
            //             const menuItem = [];
            //             menuItem.push({
            //                 title: "View Details",
            //                 type: "",
            //                 linkUrl: `booking-management/view-booking/${rowData.id}`,
            //             })
            //             if (permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY)) {
            //                 return (
            //                     <ActionDropdown
            //                         menuItem={menuItem}
            //                     />
            //                 )
            //             }
            //         }
            //     }
            // }
          ]}
          // For Pagination
          //   history={this.props.history}
          //   location={this.props.location}
          //   totalPages={this.state.totalPages}
          //   currentPage={this.state.page - 1} // because of 0 based indexing
          message={"No Data Found"}
        />
      </div>
    )
  }

  render() {
    const { settlementData, settlementReport, franchiseOptionsList } =
      this.state
    const permissionList = getAssignedPermission()

    return (
      <>
        {this.state.showSettlePaymentModal && (
          <SettlePaymentModal
            bookingId={this.state.bookingId}
            show={this.state.showSettlePaymentModal}
            handleClose={this.handleSettlementPayModal}
            paybleAmount={settlementData?.payable_to_franchise.toFixed(2)}
          />
        )}

        <ComponentHeader
          breadcrumb={true}
          currentPage={"Company Settlement"}
          title={"Settlement"}
          isFilter={false}
          //isPrimaryBtn={() => this.handleAddBookings()}
          isSearch={false}
          placeholder={"Search Bookings"}
          isSettleSearch={true}
          franchiseOptionsList={franchiseOptionsList}
          filterSearch={this.filterSearch}
          isFranchise={this.state.isFranchise}
        //onChangeMethod={this.onChangeMethod}
        //clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        {settlementReport ? (
          <div className="settlement-wrapper">
            <div className="header">
              <h1 className="red-hat-display-bold f-s-16">
                Revenue & Payment Settlement
              </h1>
              <div className="settlement-box">
                <div className="card-info b-right">
                  {/* <div>
                                        <Image src={settleIcon} />
                                    </div> */}
                  <div>
                    <h3 className="red-hat-display-bold f-s-20">
                      ₹{" "}
                      {settlementData?.total_platform_amount
                        ? (
                          settlementData?.total_franchise_amount +
                          settlementData?.total_platform_amount
                        ).toFixed(2)
                        : "0"}{" "}
                    </h3>
                    <p className="red-hat-display-regular f-s-16">
                      Total Revenue
                    </p>
                  </div>
                </div>

                <div className="card-info b-right">
                  {/* <div>
                                        <Image src={settleIcon} />
                                    </div> */}
                  <div>
                    <h3 className="red-hat-display-bold f-s-20">
                      ₹{" "}
                      {settlementData
                        ? settlementData.total_platform_amount.toFixed(2)
                        : "0"}
                    </h3>
                    <p className="red-hat-display-regular f-s-16">
                      Company Revenue
                    </p>
                  </div>
                </div>

                <div className="card-info b-right">
                  {/* <div>
                                                <Image src={settleIcon} />
                                            </div> */}
                  <div>
                    <h3 className="red-hat-display-bold f-s-20">
                      ₹{" "}
                      {settlementData
                        ? settlementData.total_franchise_amount.toFixed(2)
                        : "0"}{" "}
                    </h3>
                    <p className="red-hat-display-regular f-s-16">
                      Franchise Revenue
                    </p>
                  </div>
                </div>

                <div className="card-info">
                  {/* <div>
                                                <Image src={settleIcon} />
                                            </div> */}
                  <div>
                    <h3 className="red-hat-display-bold f-s-20">
                      ₹{" "}
                      {settlementData
                        ? settlementData.payable_to_franchise.toFixed(2)
                        : "0"}{" "}
                    </h3>
                    <p className="red-hat-display-regular f-s-16">
                      Payable Amount
                    </p>
                  </div>
                </div>
                {
                  !this.state.isFranchise &&
                  <div>
                    {settlementData?.payable_to_franchise && (
                      <Button
                        className="btn black-btn"
                        onClick={this.handleSettlementPayModal}
                      >
                        Settle Payment
                      </Button>
                    )}
                  </div>
                }

              </div>
            </div>
            <div className="settlement-info">
              <h2 className="red-hat-display-bold f-s-20">Orders</h2>
              <Tabs
                id="controlled-tab-example"
                activeKey={this.state.selectedTab}
                onSelect={(k) => this.setKey(k)}
                className="pricing-tabs"
              >
                <Tab eventKey="30" title="Unsettled">
                  {this.showTable(settlementReport, permissionList)}
                </Tab>
                <Tab eventKey="default" title="Settled">
                  {this.showSettledData(settlementReport, permissionList)}
                </Tab>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="not-found-wrapper">
            <Image src={notFoundImage} />
            <p className="red-hat-display-medium f-s-16 black-404">
              {" "}
              No Data Found
            </p>
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  settlementState: state.SettlementState
})
const mapDispatchToProps = {
  getAllFranchiseApi
}
Settlement.propTypes = {
  // getPosts: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Settlement)
