import React, { Component } from "react"
import { Col, Container, Row, Image, Button } from "react-bootstrap"
import { connect } from "react-redux"
import errorIcon from "../../assets/images/icons/error-icon.svg"
import { ComponentHeader } from "../common"
import { getCustomerDetailsApi, getRewardsByCustomerApi } from "./Api"
import AddCreditsModal from "./AddCreditsModal"
import CustomTable from "../../utils/commonComponent/CustomTable"

class CustomerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAllocationModal: false,
      customerData: null,
      customerRewardList: ""
    }
  }
  componentDidMount() {
    getCustomerDetailsApi(this.props.match.params.customerId, this)
    getRewardsByCustomerApi(this.props.match.params.customerId, this)
  }
  handleEditCustomer = () => {}
  handleVehicleAllocation = (data = "") => {
    this.setState({
      showAllocationModal: !this.state.showAllocationModal
    })
  }

  handleAddCredits = (userId = null) => {
    this.setState({
      showAddCreditsModal: !this.state.showAddCreditsModal,
      creditUserId: userId
    })
  }

  render() {
    const { customerData, customerRewardList } = this.state
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          moduleName={"Customer"}
          title={customerData && customerData.first_name}
        />

        <div className="customer-details-wrapper">
          {this.state.showAddCreditsModal && (
            <AddCreditsModal
              creditUserId={this.state.creditUserId}
              show={this.state.showAddCreditsModal}
              handleClose={this.handleAddCredits}
            />
          )}
          <Container fluid>
            <Row>
              <Col md={12}>
                <div className="content-left">
                  <div className="item">
                    {customerData && (
                      <Row>
                        <Col md={12}>
                          <h3>Customer Contact Details</h3>
                          <hr />
                        </Col>
                        <Col md={4}>
                          <h5>Contact Number</h5>
                          <h6>{customerData.mobile || "NA"}</h6>
                        </Col>
                        {/* <Col md={3}>
                          <h5>Gender</h5>
                          <h6>{customerData.gender || "NA"}</h6>
                        </Col> */}
                        <Col md={4}>
                          <h5>Email</h5>
                          <h6>{customerData.email || "NA"}</h6>
                        </Col>
                        <Col md={4}>
                          <h5>Referral Code</h5>
                          <h6>{customerData.referral_code || "NA"}</h6>
                        </Col>
                      </Row>
                    )}
                  </div>
                  <hr />
                  <div className="view-detail-page">
                    <div className="basic-details ">
                      <div className="map-vehicle-wrapper">
                        <h2>Credits</h2>
                        <Button
                          className="btn black-btn"
                          onClick={() => this.handleAddCredits(customerData.id)}
                        >
                          Add Credits
                        </Button>
                      </div>
                      <div className="custom-table-wrapper">
                        <CustomTable
                          tableData={customerRewardList}
                          columnList={[
                            {
                              coumnWidth: 250,
                              labelName: "Order Code",
                              dataKey: "property",
                              className: "red-hat-display-bold",
                              isCell: true,
                              cell: (rowData, dataKey) => {
                                if (dataKey === "property") {
                                  return rowData.property.order_code || "NA"
                                }
                              }
                            },
                            {
                              coumnWidth: 250,
                              labelName: "Message",
                              dataKey: "message",
                              className: "",
                              isCell: true,
                              cell: (rowData, dataKey) => {
                                if (dataKey === "message") {
                                  return rowData.property.message || "NA"
                                }
                              }
                            },
                            {
                              coumnWidth: 250,
                              labelName: "Reward Amount",
                              dataKey: "amount",
                              className: "",
                              isCell: true,
                              cell: (rowData, dataKey) => {
                                if (dataKey === "amount") {
                                  return rowData.amount
                                }
                              }
                            }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  customersState: state.CustomersState
})
const mapDispatchToProps = {
  getCustomerDetailsApi,
  getRewardsByCustomerApi
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails)
