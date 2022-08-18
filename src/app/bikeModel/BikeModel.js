import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import CustomTable from "../../utils/commonComponent/CustomTable";
import { PermissionList } from "../../utils/Constant";
import {
  getAssignedPermission,
  replaceHistory,
} from "../../utils/ReusableFunctions";
import { ComponentHeader } from "../common";
import ActionDropdown from "../common/_utils/ActionDropdown";
import { getAllBikeModelsApi } from "./Api";

class BikeModel extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const searchText = params.get("search");
    this.state = {
      bikeModels: [],
      page: page ? parseInt(page, 10) : 1,
      totalPages: 1,
      searchText,
      searchKey: "SEARCH_BY_TEXT",
      showFilter: false,
    };
  }

  componentDidMount() {
    getAllBikeModelsApi(this);
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p"), 10) || 1;
    const prevSearchText = prevParams.get("search");

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p"), 10) || 1;
    const searchText = params.get("search");

    if (prevPage !== page || prevSearchText !== searchText) {
      this.setState({ page, searchText }, () => {
        getAllBikeModelsApi(this);
      });
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  };

  handleAddBikeModel = () => {
    this.props.history.push("/master/bike-models/add-bike-model");
  };

  clearSearch = () => {
    this.onChangeMethod({ search: "" });
  };

  onChangeMethod = (value) => {
    this.setState({ searchText: value.search, page: 1 }, () => {
      replaceHistory(this.props.history, 1, value.search);
    });
  };

  handleEditBikeModel = (rowData) => {
    this.props.history.push({
      pathname: `/master/bike-models/edit-bike-model/`,
      state: { editData: rowData },
    });
  };

  render() {
    const { bikeModels } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Bike Models"}
          title={"Bike Models"}
          isFilter={false}
          isPrimaryBtn={this.handleAddBikeModel}
          primaryBtnText={
            permissionList.includes(PermissionList.ADD_UPDATE_VEHICLE_MODEL)
              ? "+ Add Bike Model"
              : ""
          }
          isSearch={true}
          placeholder={"Search Bike Model"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={this.clearSearch}
          searchValue={{ search: this.state.searchText }}
        />
        <div className="custom-table-wrapper">
          <CustomTable
            tableData={bikeModels}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Model Name",
                dataKey: "modelName",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelName") {
                    return rowData.modelName;
                  }
                },
              },
              {
                coumnWidth: 300,
                labelName: "Manufacturer Name",
                dataKey: "modelCompany",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelCompany") {
                    return rowData.modelCompany;
                  }
                },
              },
              {
                coumnWidth: 250,
                labelName: "No of Batteries",
                dataKey: "noOfBatteries",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "noOfBatteries") {
                    return rowData.noOfBatteries;
                  }
                },
              },
              {
                coumnWidth: 200,
                labelName: "Tax (in percentage)",
                dataKey: "taxPercentage",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "taxPercentage") {
                    return rowData.taxPercentage;
                  }
                },
              },
              {
                coumnWidth: 250,
                labelName: "Tax Code",
                dataKey: "taxCode",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "taxCode") {
                    return rowData.taxCode;
                  }
                },
              },
              {
                coumnWidth: 50,
                labelName: "",
                dataKey: "options",
                className: "options-column",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "options") {
                    const menuItem = [{
                      title: "View Details",
                      type: "",
                      linkUrl: `/master/bike-models/view-details/${rowData.id}`,
                    }];
                    if (permissionList.includes(PermissionList.ADD_UPDATE_VEHICLE_MODEL)){
                      menuItem.push({
                        title: "Edit",
                        type: "event",
                        handleClick: () => this.handleEditBikeModel(rowData),
                      })
                    }
                    return <ActionDropdown menuItem={menuItem} />
                  }
                },
              },
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={this.state.totalPages}
            currentPage={this.state.page - 1} // because of 0 based indexing
            message={"Bike models not found"}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  bikeModelState: state.BikeModelState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
};
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(BikeModel);
