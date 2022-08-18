import React, { Component } from 'react';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getOrdersApi } from './Api';
import moment from "moment";
import { OrderStatus } from "../../utils/Constant";

class BookingManagement extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      bookingsList: [],
      showFilter: false,
      conditions: [],
    }
  }

  componentDidMount() {
    getOrdersApi(this);
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get('p'), 10) || 1;

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get('p'), 10) || 1;
    const search = params.get('search') || "";

    if (prevPage !== page) {
      if (search) {
        getOrdersApi(this);
      } else {
        getOrdersApi(this, page - 1);
      }
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddBookings = (rowData = "") => {
    if (rowData) {
      this.props.history.push({
        pathname: `/booking-management/edit-booking/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/booking-management/add-booking");
    }
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    getOrdersApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] }, () => {
      if (currentPage === START_PAGE) {
        getOrdersApi(this, START_PAGE);
      }
      replaceHistory(this.props.history, START_PAGE + 1)
    });

  }
  render() {
    const { page, totalPage, bookingsList } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"Booking Management"}
          title={"Booking Management"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddBookings()}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_ORDER) ? "+ Add Booking" : ""}
          isSearch={true}
          placeholder={"Search Bookings"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />

        <div className='custom-table-wrapper'>
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
                    return rowData.code
                  }
                }
              },
              {
                coumnWidth: 230,
                labelName: "Customer Email",
                dataKey: "customer",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "customer") {
                    return rowData.customer ?.email
                  }
                }
              },
              {
                coumnWidth: 230,
                labelName: "Start Time",
                dataKey: "start_datetime",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "start_datetime") {
                    return moment(rowData.start_datetime).format('LLL')
                  }
                }
              },
              {
                coumnWidth: 230,
                labelName: "End Time",
                dataKey: "end_datetime",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "end_datetime") {
                    return moment(rowData.end_datetime).format('LLL')
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
                coumnWidth: 120,
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
                coumnWidth: 120,
                labelName: "Status",
                dataKey: "status",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "status") {
                    return OrderStatus.getText(rowData.status)
                  }
                }
              },
              {
                coumnWidth: 50,
                labelName: "",
                dataKey: "options",
                className: "options-column",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "options") {
                    const menuItem = [];
                    // menuItem.push({
                    //   title: "Edit",
                    //   type: "event",
                    //   handleClick: () => this.handleAddBookings(rowData),
                    // })
                    menuItem.push({
                      title: "View Details",
                      type: "",
                      linkUrl: `booking-management/view-booking/${rowData.id}`,
                    })
                    if (permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY)) {
                      return (
                        <ActionDropdown
                          menuItem={menuItem}
                        />
                      )
                    }
                  }
                }
              }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"Coupons list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  couponsState: state.CouponsState
});
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(BookingManagement);