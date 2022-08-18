import React, { Component } from "react"
import { connect } from "react-redux"
import { ComponentHeader } from "../common"
import { Grid, Image, Row, Col, Button } from "react-bootstrap"
import EstimatedFare from "./EstimatedFare"
import { getBookingDetailsApi } from "./Api"
import { compareDate, formatDuration } from "../../utils/ReusableFunctions"
import moment from "moment"
import { OrderStatus, PaymentStatus } from "../../utils/Constant"
import greenCircle from "../../assets/images/icons/greenCircle.png"
import circle from "../../assets/images/icons/circle.svg"
import square from "../../assets/images/icons/square.svg"
import cancelBox from "../../assets/images/icons/cancelBox.svg"
import AssignBikeModal from "./AssignBike"
import ChangeOrderStatusModal from "./ChangeOrderStatus"
import CancelBookingModal from "./CancelBooking"
import AddPenaltyModal from "./AddPenalty"
import {
  reassignVehicleOrderApi,
  markPickupOrderApi,
  markReturnOrderApi,
  cancelOrderApi
} from "./Api"
import ExtendBookingModal from "./_utils/ExtendBookingModal"

class ViewBookingDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookingId: this.props.match.params.id,
      showAssignBikeModal: false,
      paymentMode: 30,
      cancelBookingModal: false,
      addPenaltyModal: false,
      showExtendBookingModal: false
    }
  }

  componentDidMount() {
    this.getBookingDetails()
  }

  getBookingDetails = () => {
    getBookingDetailsApi(this.state.bookingId, this)
  }

  handleAddPenaltyModal = () => {
    this.setState({ addPenaltyModal: !this.state.addPenaltyModal })
  }

  handleAssignBikeModal = () => {
    this.setState({ showAssignBikeModal: !this.state.showAssignBikeModal })
  }

  handleChangeOrderStatusModal = (action = null) => {
    this.setState({
      changeOrderStatusModal: !this.state.changeOrderStatusModal,
      action
    })
  }

  handleCancelOrderModal = () => {
    this.setState({ cancelBookingModal: !this.state.cancelBookingModal })
  }

  cancelOrder = (reason) => {
    cancelOrderApi(
      this.state.bookingId,
      reason,
      this.getBookingDetails,
      this.handleCancelOrderModal
    )
  }

  reAssignBike = (bikeId) => {
    //console.log(bikeId)
    reassignVehicleOrderApi(
      this.state.bookingId,
      bikeId,
      this.getBookingDetails,
      this.handleAssignBikeModal
    )
  }

  markPickupOrder = () => {
    markPickupOrderApi(
      this.state.bookingId,
      this.getBookingDetails,
      this.handleChangeOrderStatusModal
    )
  }

  markReturnOrder = (paymentMode) => {
    markReturnOrderApi(
      this.state.bookingId,
      paymentMode,
      this.getBookingDetails,
      this.handleChangeOrderStatusModal
    )
  }

  toggleExtendBooking = () => {
    this.setState({
      showExtendBookingModal: !this.state.showExtendBookingModal
    })
  }

  render() {
    const data = this.state.bookingData
    let duration
    if (data) {
      duration = formatDuration(data)
    }
    const pricing = {
      total_price: data && data.booking_info.total_amount,
      allowed_kms: data && data.booking_info.allowed_kms,
      booking_price: data && data.booking_info.booking_amount,
      price: data && data.model_pricing.price,
      total_tax_amount: data && data.total_tax_amount,
      total_amount: data && data.total_amount,
      deposit: data && data.booking_info.deposit,
      penalty_price_per_hour: data && data.model_pricing.penalty_price_per_hour,
      per_km_price: data && data.model_pricing.per_km_price
    }
    const discountAmount = data && data.booking_info.coupon_discount
    const pointsApplied = data && data.booking_info.points ? true : false
    const points = data && data.booking_info.points
    const status = data && data.status
    const totalPenaltyAmount = data && data?.extra_charges?.total_amount
    // Below Data Required In Extend Order
    const dateTimeInfo = {
      startdDate: data && data.booking_info.start_datetime,
      endDate: data && data.booking_info.end_datetime
    }
    const orderId = data && data.id
    return (
      <>
        {this.state.showExtendBookingModal && (
          <ExtendBookingModal
            show={this.state.showExtendBookingModal}
            handleClose={() => this.toggleExtendBooking()}
            bookingDetails={dateTimeInfo}
            orderId={orderId}
            getBookingDetails={() => this.getBookingDetails()}
          />
        )}
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"Booking Details"}
          moduleName={`# ${data?.code}`}
          secondaryBtnText={
            status !== OrderStatus.CANCELLED &&
            status !== OrderStatus.INITIATED &&
            status !== OrderStatus.NOT_PLACED &&
            status !== OrderStatus.RETURN_PAYMENT_SETTLED &&
            status !== OrderStatus.PICKED_UP
              ? "Cancel Booking"
              : false
          }
          isSecondaryBtn={this.handleCancelOrderModal}
          primaryBtnText={
            data &&
            (data.extension_info ||
              status === OrderStatus.CANCELLED ||
              status === OrderStatus.RETURN_PAYMENT_SETTLED ||
              status === OrderStatus.NOT_PLACED ||
              status === OrderStatus.INITIATED)
              ? ""
              : "Extend Booking"
          }
          isPrimaryBtn={this.toggleExtendBooking}
        />
        {this.state.addPenaltyModal && (
          <AddPenaltyModal
            bookingId={this.state.bookingId}
            show={this.state.addPenaltyModal}
            handleClose={this.handleAddPenaltyModal}
            getBookingDetails={this.getBookingDetails}
          />
        )}
        {this.state.cancelBookingModal && (
          <CancelBookingModal
            show={this.state.cancelBookingModal}
            handleClose={this.handleCancelOrderModal}
            cancelOrder={(reason) => this.cancelOrder(reason)}
          />
        )}
        {this.state.showAssignBikeModal && (
          <AssignBikeModal
            bookingId={this.state.bookingId}
            show={this.state.showAssignBikeModal}
            handleClose={this.handleAssignBikeModal}
            reAssignBike={(bikeId) => this.reAssignBike(bikeId)}
          />
        )}
        {this.state.changeOrderStatusModal && (
          <ChangeOrderStatusModal
            bookingId={this.state.bookingId}
            action={this.state.action}
            show={this.state.changeOrderStatusModal}
            handleClose={this.handleChangeOrderStatusModal}
            markPickupOrder={this.markPickupOrder}
            markReturnOrder={(paymentMode) => this.markReturnOrder(paymentMode)}
          />
        )}
        <Row>
          <Col sm={7}>
            <div className="add-edit-customer-wrapper">
              <div className="booking-content view-detail-page">
                <div className="header">
                  <div className="red-hat-display-bold f-s-12 grey-757">
                    Pickup/Return Details
                  </div>
                  <div className="time-wrapper red-hat-display-regular">
                    {duration}
                  </div>
                  <p
                    className={`order-status proximanova-regular f-s-16 lh-24 ${OrderStatus.getClass(
                      status
                    )}`}
                  >
                    {OrderStatus.getText(status)}
                  </p>
                </div>
                <hr />
                <div className="basic-details">
                  <Row>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Franchisee Name</h4>
                        <h3 className="regular lg">
                          {data?.franchise?.legal_name}
                        </h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Pickup Date</h4>
                        <h3 className="regular lg">
                          {moment(data?.start_datetime).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Return Date</h4>
                        <h3 className="regular lg">
                          {moment(data?.end_datetime).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </h3>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="detail">
                        <h4 className="regular">Pickup & Return Address</h4>
                        <h3 className="regular lg">
                          {
                            data?.franchise_location?.location_details
                              ?.formatted_address
                          }
                        </h3>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* NEW ROW */}
                <div className="header m-t-5">
                  <div className="red-hat-display-bold f-s-12 grey-757">
                    Booking Status
                  </div>
                </div>
                <hr />
                <div className="timeline-wrapper">
                  {/* <h2 className='proximanova-bold f-s-20 lh-30'>Date time</h2> */}
                  <Row>
                    <Col sm={3}>
                      <div
                        className={`timeline ${
                          status === OrderStatus.CANCELLED ||
                          status === OrderStatus.NOT_PLACED ||
                          status === OrderStatus.INITIATED
                            ? "cancelled"
                            : status === OrderStatus.PLACED ||
                              status >= OrderStatus.PICKED_UP
                            ? "success"
                            : ""
                        }`}
                      >
                        <Image
                          src={
                            status === OrderStatus.CANCELLED ||
                            status === OrderStatus.NOT_PLACED ||
                            status === OrderStatus.INITIATED
                              ? cancelBox
                              : greenCircle
                          }
                        />
                        <h3 className="proximanova-medium f-s-16 lh-26">
                          {status === OrderStatus.NOT_PLACED ||
                          status === OrderStatus.INITIATED
                            ? "Booking unsuccessful"
                            : status === OrderStatus.CANCELLED
                            ? "Booking Cancelled"
                            : "Booking successful"}
                        </h3>
                        <h6 className="proximanova-regular f-s-14 lh-21 op-6">
                          {moment(data?.created_on).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </h6>
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div
                        className={`timeline ${
                          status === OrderStatus.CANCELLED
                            ? "cancelled"
                            : status >= OrderStatus.PICKED_UP
                            ? "success"
                            : ""
                        }`}
                      >
                        <Image
                          src={
                            status === OrderStatus.CANCELLED ||
                            status === OrderStatus.NOT_PLACED ||
                            status === OrderStatus.INITIATED
                              ? cancelBox
                              : status >= OrderStatus.PLACED
                              ? greenCircle
                              : circle
                          }
                        />
                        <h3 className="proximanova-medium f-s-16 lh-26">
                          Bike Assignment
                        </h3>
                        {/* <h6 className='proximanova-regular f-s-14 lh-21 op-6'>{moment(data ?.start_datetime).format("DD MMM YYYY hh:mm a")}</h6> */}
                        {status === OrderStatus.PLACED && (
                          <>
                            <Button
                              className="btn secondary-btn"
                              onClick={this.handleAssignBikeModal}
                            >
                              Reassign Bike
                            </Button>
                          </>
                        )}
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div
                        className={`timeline ${
                          status === OrderStatus.CANCELLED
                            ? "cancelled"
                            : status >= OrderStatus.RETURN_PAYMENT_PENDING
                            ? "success"
                            : ""
                        }`}
                      >
                        <Image
                          src={
                            status === OrderStatus.CANCELLED
                              ? cancelBox
                              : status >= OrderStatus.PICKED_UP
                              ? greenCircle
                              : circle
                          }
                        />
                        <h3 className="proximanova-medium f-s-18 lh-26">
                          Pickup
                        </h3>

                        <h6 className="proximanova-regular f-s-14 lh-21 op-6">
                          {moment(data?.start_datetime).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </h6>
                        {status === OrderStatus.PLACED &&
                          compareDate(dateTimeInfo.startdDate, new Date()) && (
                            <>
                              <Button
                                className="btn secondary-btn"
                                onClick={() =>
                                  this.handleChangeOrderStatusModal(1)
                                }
                              >
                                Mark Picked up
                              </Button>
                            </>
                          )}
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div
                        className={`timeline last ${
                          status === OrderStatus.CANCELLED ? "cancelled" : ""
                        }`}
                      >
                        <Image
                          src={
                            status === OrderStatus.CANCELLED
                              ? cancelBox
                              : status >= OrderStatus.RETURN_PAYMENT_PENDING
                              ? greenCircle
                              : square
                          }
                        />
                        <h3 className="proximanova-medium f-s-18 lh-26">
                          Return
                        </h3>
                        <h6 className="proximanova-regular f-s-14 lh-21 op-6">
                          {moment(data?.end_datetime).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </h6>
                        {data?.extension_info &&
                          data.extension_info.payment_status ===
                            PaymentStatus.SUCCESS && (
                            <p
                              className={`order-status proximanova-regular f-s-16 lh-24 extended`}
                            >
                              Extended
                            </p>
                          )}
                        {status === OrderStatus.PICKED_UP &&
                          compareDate(dateTimeInfo.endDate, new Date()) && (
                            <Button
                              className="btn secondary-btn"
                              onClick={() =>
                                this.handleChangeOrderStatusModal(2)
                              }
                            >
                              Mark Return
                            </Button>
                          )}
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* NEW ROW */}
                <div className="header m-t-5">
                  <div className="red-hat-display-bold f-s-12 grey-757">
                    Customer Details
                  </div>
                  {/* <div className="">
                                        <Button
                                            className="btn secondary-btn"
                                        //onClick={}
                                        >
                                            Complete KYC
                                        </Button>
                                    </div> */}
                </div>
                <hr />
                <div className="basic-details">
                  <Row>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Name</h4>
                        <h3 className="regular lg">
                          {data?.customer?.first_name}
                        </h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Contact Number</h4>
                        <h3 className="regular lg">{data?.customer?.mobile}</h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="detail">
                        <h4 className="regular">Email</h4>
                        <h3 className="regular lg">{data?.customer?.email}</h3>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col sm={5}>
            <div className="add-edit-customer-wrapper">
              <div className="booking-content">
                <EstimatedFare
                  duration={duration}
                  pricing={pricing}
                  discountAmount={discountAmount || "0"}
                  pointsApplied={pointsApplied}
                  points={points || "0"}
                  isViewBooking={true}
                  handleAddPenaltyModal={this.handleAddPenaltyModal}
                  totalPenaltyAmount={totalPenaltyAmount || false}
                  extensionInfo={data && data?.extension_info}
                  cancellationFee={
                    data && data?.cancellation_fee + data.cancellation_tax
                  }
                  extraCharges={data && data?.extra_charges}
                  status={status}
                />
              </div>
            </div>
          </Col>
        </Row>
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewBookingDetails)
