import React, { Component } from "react"
// import PropTypes from 'prop-types';
import { connect } from "react-redux"
import { CustomerFilterModal } from "."
import CustomTable from "../../utils/commonComponent/CustomTable"
import { PermissionList, START_PAGE } from "../../utils/Constant"
// import { PermissionList } from '../../utils/Constant';
import { replaceHistory } from "../../utils/ReusableFunctions"
import { ComponentHeader } from "../common"
// import { ComponentHeader } from '../common';
import ActionDropdown from "../common/_utils/ActionDropdown"
import Switch from "../common/_utils/Switch"
import { getAllCustomersApi, updateCustomerStatusApi } from "./Api"

class Customers extends Component {
  constructor(props) {
    super(props)
    const search = props.location.search
    const params = new URLSearchParams(search)
    const page = params.get("p")
    const searchText = params.get("search")
    this.state = {
      customersList: [],
      showFilter: false,
      // page: page ? parseInt(page, 10) : 1,
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      totalPages: 1,
      searchText,
      searchKey: "SEARCH_BY_TEXT"
    }
  }

  componentDidMount() {
    getAllCustomersApi(this)
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search)
    const prevPage = parseInt(prevParams.get("p"), 10) || 1
    const prevSearchText = prevParams.get("search")

    const params = new URLSearchParams(this.props.location.search)
    const page = parseInt(params.get("p"), 10) || 1
    const searchText = params.get("search")

    if (prevPage !== page || prevSearchText !== searchText) {
      this.setState({ page, searchText }, () => {
        getAllCustomersApi(this)
      })
    }
  }

  clearSearch = () => {
    this.onChangeMethod({ search: "" })
  }

  onChangeMethod = (value) => {
    this.setState({ searchText: value.search, page: 1 }, () => {
      replaceHistory(this.props.history, 1, value.search)
    })
  }

  handleEditCustomer = (rowData) => {
    this.props.history.push({
      pathname: `/edit-customer/`,
      state: { editData: rowData }
    })
  }

  handleAddCustomer = () => {
    this.props.history.push("/add-customer")
  }

  handleToggle = (rowData) => {
    console.log("rowData", rowData)
    let data = new URLSearchParams()
    data.append("customer_id", rowData.id)
    data.append("active", !rowData.active)
    updateCustomerStatusApi(data, this)
  }

  render() {
    const { customersList } = this.state
    // const permissionList = getAssignedPermission();
    return (
      <>
        {this.state.showFilter && (
          <CustomerFilterModal
            show={this.state.showFilter}
            handleClose={this.handleFilter}
          />
        )}
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Customers"}
          title={"Customers"}
          isSearch={true}
          placeholder={"Search Customer"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={this.clearSearch}
          searchValue={{ search: this.state.searchText }}
        />
        <div className="custom-table-wrapper">
          <CustomTable
            tableData={customersList}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Customer Name",
                dataKey: "name",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "name") {
                    return (
                      <span
                        className="cursor"
                        onClick={() =>
                          this.props.history.push(`/customer/${rowData.id}`)
                        }
                      >
                        {rowData.first_name}
                      </span>
                    )
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Contact Number",
                dataKey: "mobile",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "mobile") {
                    return rowData.mobile || "NA"
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Email Id",
                dataKey: "email",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "email") {
                    return rowData.email || "NA"
                  }
                }
              },
              // {
              //   coumnWidth: 250,
              //   labelName: "Status",
              //   dataKey: "status",
              //   className: "",
              //   isCell: true,
              //   cell: (rowData, dataKey) => {
              //     if (dataKey === "status") {
              //       return (
              //         <p className="status">
              //           {" "}
              //           <span
              //             className={`circle ${
              //               rowData.active ? "active" : "inactive"
              //             }`}
              //           ></span>{" "}
              //           {rowData.active ? "Attached" : "Inactive"}
              //         </p>
              //       )
              //     }
              //   }
              // },
              {
                coumnWidth: 350,
                labelName: "Status",
                dataKey: "active",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "active") {
                    return (
                      <Switch
                        checked={rowData.active}
                        handleClick={() => this.handleToggle(rowData)}
                      />
                    )
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
                        title: "View Details",
                        type: "",
                        linkUrl: `/customer/${rowData.id}`
                      }
                    ]
                    return <ActionDropdown menuItem={menuItem} />
                  }
                }
              }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={this.state.totalPages}
            currentPage={this.state.page - 1} // because of 0 based indexing
            // message={"Customer list is empty"}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  customersState: state.CustomersState
})
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(Customers)
