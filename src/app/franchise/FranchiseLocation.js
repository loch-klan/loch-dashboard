import React from "react"
import { Col, Row } from "react-bootstrap"
import { connect } from "react-redux"
import CustomTable from "../../utils/commonComponent/CustomTable"
import { AccountType, PermissionList, START_PAGE } from "../../utils/Constant"
import {
  getAssignedPermission,
  replaceHistory
} from "../../utils/ReusableFunctions"
import { ComponentHeader } from "../common"
import ActionDropdown from "../common/_utils/ActionDropdown"
import { getAllFranchiseLocationApi, getAllFranchiseApi } from "./Api"
import {
  BaseReactComponent,
  FormElement,
  FormValidator,
  SelectControl,
  Form
} from "../../utils/form"
import ShowQRCode from "./_utils/ShowQRCode"

class FranchiseLocation extends BaseReactComponent {
  constructor(props) {
    super(props)
    const search = props.location.search
    const params = new URLSearchParams(search)
    const page = params.get("p")
    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    this.state = {
      userDetails,
      data: [],
      franchiseOptionsList: [],
      franchiseId: "",
      conditions:
        userDetails.user_account_type !== AccountType.COMPANY
          ? [{ key: "SEARCH_BY_FRANCHISE_ID", value: userDetails.id }]
          : [],
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      showQRCode: false,
      franchiseData: ""
    }
  }

  componentDidMount() {
    if (this.state.userDetails.user_account_type !== AccountType.COMPANY) {
      this.props.getAllFranchiseLocationApi(this)
    } else {
      this.props.getAllFranchiseApi(this, -1)
    }
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search)
    const prevPage = parseInt(prevParams.get("p"), 10) || 1

    const params = new URLSearchParams(this.props.location.search)
    const page = parseInt(params.get("p"), 10) || 1
    const search = params.get("search") || ""

    if (prevPage !== page) {
      // this.setState({ page })
      if (search) {
        this.props.getAllFranchiseLocationApi(this)
      } else {
        this.props.getAllFranchiseLocationApi(this, page - 1)
      }
    }
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
    })
    replaceHistory(this.props.history, START_PAGE, value.search)
    this.props.getAllFranchiseLocationApi(this, START_PAGE)
  }

  clearSearch = (currentPage) => {
    this.setState({ searchValue: "", conditions: [] }, () => {
      if (currentPage === START_PAGE) {
        this.props.getAllFranchiseLocationApi(this, START_PAGE)
      }
    })

    replaceHistory(this.props.history, START_PAGE + 1)
  }

  handleAddEditFranchiseLocation = (data = "") => {
    if (data) {
      this.props.history.push({
        pathname: `/franchise-location/edit-franchise-location/${data.franchise_account_id}`,
        state: { data: data }
      })
    } else {
      this.props.history.push("/franchise-location/add-franchise-location")
    }
  }

  handleViewFranchiseLocation = (data = "") => {
    this.props.history.push({
      pathname: `/franchise-location/view-franchise-location/${data.id}`
    })
  }

  handleViewQRCode = (data = "") => {
    this.setState({
      franchiseData: data
        ? {
            franchise_location_id: data.id,
            latitude: data.location_details.geometry.location.lat,
            longitude: data.location_details.geometry.location.lng
          }
        : "",
      showQRCode: !this.state.showQRCode
    })
  }

  render() {
    const {
      data,
      page,
      totalPage,
      userDetails,
      franchiseOptionsList,
      showQRCode,
      franchiseData
    } = this.state
    const permissionList = getAssignedPermission()
    return (
      <>
        {showQRCode && (
          <ShowQRCode
            show={showQRCode}
            handleClose={() => this.handleViewQRCode()}
            value={franchiseData}
          />
        )}
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Franchise Location"}
          title={"Franchise Location"}
          isFilter={false}
          isPrimaryBtn={() => this.handleAddEditFranchiseLocation()}
          primaryBtnText={
            permissionList.includes(
              PermissionList.ADD_UPDATE_FRANCHISE_LOCATION
            )
              ? "+ Add Franchise Location"
              : ""
          }
          // isSearch={true}
          // placeholder={"Search Franchise Location"}
          // onChangeMethod={this.onChangeMethod}
          // clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        {userDetails.user_account_type === AccountType.COMPANY && (
          <div className="state-wrapper">
            <Form
              onValidSubmit={this.onValidSubmit}
              ref={(el) => (this.form = el)}
            >
              <Row>
                <Col sm={6}>
                  <FormElement
                    valueLink={this.linkState(this, "franchiseId")}
                    label="Select Franchise"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Franchise cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Franchise",
                        options: franchiseOptionsList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          this.setState(
                            {
                              conditions: [
                                {
                                  key: "SEARCH_BY_FRANCHISE_ID",
                                  value: this.state.franchiseId
                                }
                              ]
                            },
                            () => {
                              this.props.getAllFranchiseLocationApi(this)
                            }
                          )

                          onBlur(this.state.franchiseId)
                          console.log("Hello world!")
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        )}

        <div className="custom-table-wrapper">
          <CustomTable
            tableData={data}
            columnList={[
              // {
              //     coumnWidth: 200,
              //     labelName: "Franchise Name",
              //     dataKey: "franchise_account_id",
              //     className: "red-hat-display-bold",
              //     isCell: true,
              //     cell: (rowData, dataKey) => {
              //         if (dataKey === "franchise_account_id") {
              //             return franchiseOptionsList.map((item)=>{ if (item.value === rowData.franchise_account_id){return item.label} else {return ""}})
              //           }
              //     }
              // },
              {
                coumnWidth: 200,
                labelName: "Franchise Area",
                dataKey: "area_details",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "area_details") {
                    return rowData.area_details.name || ""
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
                coumnWidth: 550,
                labelName: "Location",
                dataKey: "location_details",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "location_details") {
                    return rowData.location_details
                      ? rowData.location_details.formatted_address
                      : "NA"
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
                    const menuItem = []
                    if (
                      permissionList.includes(
                        PermissionList.ADD_UPDATE_FRANCHISE_LOCATION
                      )
                    ) {
                      menuItem.push({
                        title: "Edit",
                        type: "event",
                        handleClick: () =>
                          this.handleAddEditFranchiseLocation(rowData)
                      })
                    }
                    menuItem.push({
                      title: "View",
                      type: "event",
                      handleClick: () =>
                        this.handleViewFranchiseLocation(rowData)
                    })
                    menuItem.push({
                      title: "View QR Code",
                      type: "event",
                      handleClick: () => this.handleViewQRCode(rowData)
                    })

                    return <ActionDropdown menuItem={menuItem} />
                  }
                }
              }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"Franchise Location list is empty"}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  franchiseState: state.FranchiseState
})
const mapDispatchToProps = {
  getAllFranchiseLocationApi,
  getAllFranchiseApi
}
FranchiseLocation.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(FranchiseLocation)
