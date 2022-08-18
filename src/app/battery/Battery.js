import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { ComponentHeader } from '../common';
import CustomTable from '../../utils/commonComponent/CustomTable';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllBatteryApi } from './Api';
import { PermissionList, START_PAGE } from '../../utils/Constant';
import { formatDate, getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';

class Battery extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      data: [],
      conditions: []
    }
  }

  componentDidMount() {
    this.props.getAllBatteryApi(this);

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
      // this.setState({ page })
      if (search) {
        this.props.getAllBatteryApi(this);
      } else {
        this.props.getAllBatteryApi(this, page - 1);
      }
    }
  }
  handleAddBattery = (rowData = null) => {
    if (rowData) {
      this.props.history.push({
        pathname: `/edit-battery/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/add-battery");
    }

  }

  onChangeMethod = (value) => {
    // console.log('Value', value);
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    this.props.getAllBatteryApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] },()=>{
      if (currentPage === START_PAGE) {
        this.props.getAllBatteryApi(this, START_PAGE);
      }
      replaceHistory(this.props.history, START_PAGE)
    });

  }

  render() {
    const { batteryList, page, totalPage, } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Battery"}
          title={"Battery"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddBattery()}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_BATTERY_INVENTORY) ? "+ Add Battery" : ""}
          isSearch={true}
          placeholder={"Search Battery"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={batteryList}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Battery Model",
                dataKey: "batteryModel",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "batteryModel") {
                    return rowData.modelInfo.modelName
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Battery Device ID",
                dataKey: "serialNo",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "serialNo") {
                    return rowData.serialNo
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Purchase Date",
                dataKey: "purchaseDate",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "purchaseDate") {
                    return formatDate(rowData.createdOn)
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Iot Status",
                dataKey: "status",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "status") {
                    return (
                      <p className='status'> <span className={`circle ${rowData.attachedTelematics ? "active" : "inactive"}`}></span> {rowData.attachedTelematics ? "Attached" : "Inactive"}</p>
                    )
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
                      handleClick: () => this.handleAddBattery(rowData),
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
            message={"Battery list is empty"}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  batteryState: state.BatteryState
});
const mapDispatchToProps = {
  getAllBatteryApi
}
Battery.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Battery);