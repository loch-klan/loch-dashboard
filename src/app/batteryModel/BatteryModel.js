import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllBatteryModelsApi } from './Api';

class BatteryModel extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const searchText = params.get("search");
    this.state = {
      BatteryModels: [],
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      totalPage: 1,
      searchText,
      searchKey: 'SEARCH_BY_TEXT',
      showFilter: false,
    }
  }

  componentDidMount() {
    getAllBatteryModelsApi(this);
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get('p'), 10) || 1;
    // const prevSearchText = prevParams.get('search');

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get('p'), 10) || 1;
    // const searchText = params.get('search');
    const search = params.get('search') || "";


    /* if (prevPage !== page || prevSearchText !== searchText) {
      this.setState({ page, searchText }, () => {
        getAllBatteryModelsApi(this);
      })
    } */
    if (prevPage !== page) {
      // this.setState({ page })
      if (search) {
        getAllBatteryModelsApi(this);
      } else {
        getAllBatteryModelsApi(this, page - 1);
      }
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddBatteryModel = () => {
    this.props.history.push("/master/battery-models/add-battery-model");
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    getAllBatteryModelsApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] }, () => {
      if (currentPage === START_PAGE) {
        getAllBatteryModelsApi(this, START_PAGE);
      }
    });

    replaceHistory(this.props.history, START_PAGE + 1)
  }

  handleEditBatteryModel = (rowData) => {
    this.props.history.push({
      pathname: `/master/battery-models/edit-battery-model/${rowData.id}`,
      state: { editData: rowData }
    });
  }

  render() {
    const { BatteryModels, page, totalPage } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>

        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Battery Models"}
          title={"Battery Models"}
          isFilter={false}
          isPrimaryBtn={this.handleAddBatteryModel}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_BATTERY_MODEL) ? "+ Add Battery Model" : ""}
          isSearch={true}
          placeholder={"Search Battery Model"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={BatteryModels}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Model Name",
                dataKey: "modelName",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelName") {
                    return rowData.modelName
                  }
                }
              },
              {
                coumnWidth: 300,
                labelName: "Manufacturer Name",
                dataKey: "modelCompany",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelCompany") {
                    return rowData.modelCompany
                  }
                }
              },
              {
                coumnWidth: 230,
                labelName: "Battery Type",
                dataKey: "batteryInformation",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "batteryInformation") {
                    return rowData.batteryInformation.type
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Charging Time",
                dataKey: "batteryInformation",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "batteryInformation") {
                    return rowData.batteryInformation.chargingTime.min + "/" + rowData.batteryInformation.chargingTime.max
                  }
                }
              },
              {
                coumnWidth: 300,
                labelName: "Optimal Voltage Range",
                dataKey: "modelCompany",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelCompany") {
                    return rowData.batteryInformation.optimalVoltageRange.min + "/" + rowData.batteryInformation.optimalVoltageRange.max
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Peak Power",
                dataKey: "modelCompany",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelCompany") {
                    return rowData.batteryInformation.peakPower.min + "/" + rowData.batteryInformation.peakPower.max
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
                    const menuItem = [
                      {
                        title: "Edit",
                        type: "event",
                        handleClick: () => this.handleEditBatteryModel(rowData),
                      },
                    ];
                    if (permissionList.includes(PermissionList.ADD_UPDATE_BATTERY_MODEL)) {
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
            currentPage={page} // because of 0 based indexing
            message={"Battery models not found"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  customersState: state.CustomersState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(BatteryModel);