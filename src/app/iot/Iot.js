import React, { Component } from 'react';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList, START_PAGE } from '../../utils/Constant';
import { formatDate, getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllIotApi } from './Api';

class Iot extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      iotList: [],
      showFilter: false,
      conditions: []
    }
  }

  componentDidMount() {
    this.props.getAllIotApi(this);

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
        this.props.getAllIotApi(this);
      } else {
        this.props.getAllIotApi(this, page - 1);
      }
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  handleAddIot = (rowData = "") => {
    // console.log('rowData', rowData);
    // this.props.history.push("/add-iot");
    if (rowData) {
      this.props.history.push({
        pathname: `/edit-iot/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/add-iot");
    }
  }

  onChangeMethod = (value) => {
    // console.log('Value', value);
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    // this.props.getAllVendorsApi(START_PAGE, value);
    this.props.getAllIotApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    // console.log('Hey', currentPage);
    this.setState({ searchValue: "", conditions: [] },()=>{
      if (currentPage === START_PAGE) {
        this.props.getAllIotApi(this, START_PAGE);
      }
      replaceHistory(this.props.history, START_PAGE)
    });

  }

  render() {
    const { page, totalPage, iotList } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"IOT"}
          title={"IOT"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddIot()}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY) ? "+ Add IOT" : ""}
          isSearch={true}
          placeholder={"Search IOT"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={iotList}
            columnList={[
              {
                coumnWidth: 200,
                labelName: "IOT model",
                dataKey: "model",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "model") {
                    return rowData.modelInfo.modelName
                  }
                }
              },
              {
                coumnWidth: 350,
                labelName: "IOT Serial Number",
                dataKey: "serialNo",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "serialNo") {
                    return rowData.serialNo
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Sim Number",
                dataKey: "simCardId",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "simCardId") {
                    return rowData.simCardInfo.simcardId
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "IMEI Number",
                dataKey: "imei",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "imei") {
                    return rowData.imei
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Purchase Date",
                dataKey: "createdOn",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "createdOn") {
                    return formatDate(rowData.createdOn)
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

                    menuItem.push({
                      title: "Edit",
                      type: "event",
                      handleClick: () => this.handleAddIot(rowData),
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
            message={"IOT list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  iotState: state.IotState
});
const mapDispatchToProps = {
  getAllIotApi,
}
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(Iot);