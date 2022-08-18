import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllIotModelsApi } from './Api';

class IotModel extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const searchText = params.get("search");
    this.state = {
      iotModels: [],
      page: page ? parseInt(page, 10) : 1,
      totalPages: 1,
      searchText,
      searchKey: 'SEARCH_BY_TEXT',
      showFilter: false,
    }
  }

  componentDidMount() {
    getAllIotModelsApi(this);
    console.log("test")
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get('p'), 10) || 1;
    const prevSearchText = prevParams.get('search');

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get('p'), 10) || 1;
    const searchText = params.get('search');


    if (prevPage !== page || prevSearchText !== searchText) {
      this.setState({ page, searchText }, () => {
        getAllIotModelsApi(this);
      })
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddIotModel = () => {
    this.props.history.push("/master/iot-models/add-iot-model");
  }

  clearSearch = () => {
    this.onChangeMethod({ search: "" });
  }

  onChangeMethod = (value) => {
    this.setState({ searchText: value.search, page: 1 }, () => {
      replaceHistory(this.props.history, 1, value.search);
    });
  }

  handleEditIotModel = (rowData) => {
    this.props.history.push({
      pathname: `/master/iot-models/edit-iot-model/`,
      state: { editData: rowData }
    });
  }

  render() {
    const { iotModels } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Iot Models"}
          title={"Iot Models"}
          isFilter={false}
          isPrimaryBtn={this.handleAddIotModel}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_MODEL) ? "+ Add Iot Model" : ""}
          isSearch={true}
          placeholder={"Search Iot Model"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={this.clearSearch}
          searchValue={{ search: this.state.searchText }}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={iotModels}
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
                        handleClick: () => this.handleEditIotModel(rowData),
                      },
                    ];
                    if (permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_MODEL)) {
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
            totalPages={this.state.totalPages}
            currentPage={this.state.page - 1} // because of 0 based indexing
            message={"Iot models not found"}
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
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(IotModel);