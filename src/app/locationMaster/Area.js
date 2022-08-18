import React, { Component } from 'react';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { LocationType, PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
// import ActionDropdown from '../common/_utils/ActionDropdown';
import {getAllLocationApi, updateLocationApi} from '../common/Api';
import ActionDropdown from '../common/_utils/ActionDropdown';
import Switch from '../common/_utils/Switch';

class Area extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      areaList: [],
      showFilter: false,
      conditions: []
    }
  }

  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.AREA);
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
        // this.props.getAllIotApi(this);
      } else {
        // this.props.getAllIotApi(this, page - 1);
      }
    }
  }

  handleToggle = (rowData) => {
    const { id, is_operational, code, name, type, parent_id } = rowData;
    let data = new URLSearchParams();
    data.append("location_id", id);
    data.append("location_type", type);
    data.append("name", name);
    data.append("code", code);
    data.append("is_operational", !is_operational);
    data.append("parent_id", parent_id);
    this.props.updateLocationApi(data, this);
  };

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddCountry = (rowData = "") => {
    if (rowData) {
      this.props.history.push({
        pathname: `/location-master/area/edit-area/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/location-master/area/add-area");
    }
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    // this.props.getAllIotApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] });
    if (currentPage === START_PAGE) {
      // this.props.getAllIotApi(this, START_PAGE);
    }
    replaceHistory(this.props.history, START_PAGE)
  }

  handleEditArea = (rowData) =>{
    console.log('rowData',rowData);
    this.props.history.push({
      pathname: `/location-master/area/edit-area/${rowData.id}`,
      state: { editData: rowData }
    });
  }
  render() {
    const { page, totalPage, areaList } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"Area"}
          title={"Area"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddCountry("")}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY) ? "+ Add Area" : ""}
          // isSearch={true}
          // placeholder={"Search Area"}
          // onChangeMethod={this.onChangeMethod}
          // clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={areaList}
            columnList={[
              {
                coumnWidth: 200,
                labelName: "Area Name",
                dataKey: "name",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "name") {
                    return rowData.name
                  }
                }
              },
              {
                coumnWidth: 350,
                labelName: "Code",
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
                coumnWidth: 350,
                labelName: "Operation Status",
                dataKey: "is_operational",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "is_operational") {
                    return (
                      <Switch
                      checked={rowData.is_operational}
                      handleClick={() => this.handleToggle(rowData)}
                    />
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
                    const menuItem = [
                      {
                        title: "Edit",
                        type: "event",
                        handleClick: () => this.handleEditArea(rowData),
                      }
                    ];
                    return (
                      <ActionDropdown
                        menuItem={menuItem}
                      />
                    )
                  }
                }
              }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"Area list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  locationMasterState: state.LocationMasterState
});
const mapDispatchToProps = {
  getAllLocationApi,
  updateLocationApi
}
Area.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Area);