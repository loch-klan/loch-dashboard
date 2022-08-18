import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
// import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllUserApi } from './Api';

class Users extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      data: [],
      conditions: [],
      page: page ? parseInt(page, 10) : START_PAGE + 1,
    }
  }

  componentDidMount() {
    this.props.getAllUserApi(this)
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
        this.props.getAllUserApi(this);
      } else {
        this.props.getAllUserApi(this, page - 1);
      }
    }
  }

  handleAddEditUser = (rowData = "") => {
    if (rowData) {
      this.props.history.push({
        pathname: `/user-management/users/edit-user/${rowData.id}`,
        state: { data: rowData }
      });
    } else {
      this.props.history.push("/user-management/users/add-user");
    }
  }

  handleViewUser = (rowData = "") => {
    this.props.history.push({
      pathname: `/user-management/users/view-user/${rowData.id}`,
      state: { data: rowData }
    });
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    this.props.getAllUserApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] }, () => {
      if (currentPage === START_PAGE) {
        this.props.getAllUserApi(this, START_PAGE);
      }
    });

    replaceHistory(this.props.history, START_PAGE + 1)
  }

  render() {
    const { data, page, totalPage, } = this.state;
    const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Users"}
          title={"Users"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddEditUser()}
          primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_USER) ? "+ Add User" : ""}
          isSearch={true}
          placeholder={"Search User"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={data}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Name",
                dataKey: "first_name",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "first_name") {
                    return rowData.first_name + " " + rowData.last_name
                  }
                }
              },
              /* {
                coumnWidth: 250,
                labelName: "Contact",
                dataKey: "mobile",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "mobile") {
                    return rowData.mobile
                  }
                }
              }, */
              {
                coumnWidth: 250,
                labelName: "Email",
                dataKey: "email",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "email") {
                    return rowData.email
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
                        handleClick: () => this.handleAddEditUser(rowData),
                      },
                      {
                        title: "View Details",
                        type: "event",
                        handleClick: () => this.handleViewUser(rowData),
                      },
                    ];
                    if (permissionList.includes(PermissionList.ADD_UPDATE_USER)) {
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
            message={"User list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  userManagementState: state.UserManagementState
});
const mapDispatchToProps = {
  getAllUserApi,
}
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(Users);