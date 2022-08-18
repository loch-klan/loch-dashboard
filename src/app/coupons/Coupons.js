import React, { Component } from 'react';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList, START_PAGE, CouponTypes } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory, formatDate } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllCouponsApi } from './Api'
class Coupons extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      couponList: [],
      showFilter: false,
      conditions: []
    }
  }

  componentDidMount() {
    this.props.getAllCouponsApi(this);
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
        this.props.getAllCouponsApi(this);
      } else {
        this.props.getAllCouponsApi(this, page - 1);
      }
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddCoupons = (rowData = "") => {
    if (rowData) {
      this.props.history.push({
        pathname: `/coupons/edit-coupon/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/coupons/add-coupon");
    }
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    this.props.getAllCouponsApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] },()=>{
      if (currentPage === START_PAGE) {
        this.props.getAllCouponsApi(this, START_PAGE);
      }
      replaceHistory(this.props.history, START_PAGE)
    });

  }

  render() {
    const { page, totalPage, couponList } = this.state;
    const permissionList = getAssignedPermission();
    console.log(this.state.couponList)
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"Coupons"}
          title={"Coupons"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddCoupons()}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY) ? "+ Add Coupons" : ""}
          isSearch={true}
          placeholder={"Search Coupons"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={couponList}
            columnList={[
              {
                coumnWidth: 200,
                labelName: "Coupon Title",
                dataKey: "coupon_code",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "coupon_code") {
                    return rowData.coupon_code
                  }
                }
              },
              {
                coumnWidth: 200,
                labelName: "Type",
                dataKey: "type",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "type") {
                    return CouponTypes.getText(rowData.type)
                  }
                }
              },
              {
                coumnWidth: 150,
                labelName: "Value (Rs.)",
                dataKey: "value",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "value") {
                    return rowData.value
                  }
                }
              },
              {
                coumnWidth: 200,
                labelName: "Expiry",
                dataKey: "valid_till",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "valid_till") {
                    return formatDate(rowData.valid_till)
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "",
                dataKey: "options",
                className: "options-column",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "options") {
                    const menuItem = [];

                    menuItem.push({
                      title: "Edit",
                      type: "event",
                      handleClick: () => this.handleAddCoupons(rowData),
                    })
                    if (permissionList.includes(PermissionList.ADD_UPDATE_BATTERY_INVENTORY)) {
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
  getAllCouponsApi
}
export default connect(mapStateToProps, mapDispatchToProps)(Coupons);