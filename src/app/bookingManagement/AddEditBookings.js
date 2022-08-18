import React from 'react';
import { Button, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { START_PAGE } from '../../utils/Constant';
import { BaseReactComponent, CustomTextControl, DatePickerControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { format } from 'date-fns';
import { getAllFranchiseLocationApi } from '../franchise/Api';
import { getAllCustomersApi } from '../customers/Api';
import DatePicker from 'react-datepicker';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import addDays from "date-fns/addDays";
import { getApplicableCouponsApi } from '../coupons/Api';
import AddCustomerModal from './AddCustomerModal';
import moment from 'moment';
import { createOrderApi, getAvailableVehiclesApi } from './Api';

class AddEditBookings extends BaseReactComponent {
  constructor(props) {
    super(props);
    const editData = props.location.state ? props.location.state.editData : null;
    // console.log('editData', editData);
    this.state = {
      editId: editData ? editData.id : "",
      isCashCollected: 'false',
      pickupLocation: "",
      franchiseLocationOption: [],
      phoneNumberOptions: [],
      showAddCustomer: false,
      couponList: [],
      bike: "",
      bikeList: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + (3600 * 1000 * 24)), //Current date +1 day
    }
  }
  componentDidMount() {
    this.props.getAllFranchiseLocationApi(this, START_PAGE, true);
    getAllCustomersApi(this, true);
  }

  handleSelectCustomer = ()=>{
    console.log('Heyyy',this.state.phoneNumberOptions);
    const selectedCustomer = this.state.phoneNumberOptions.filter(item=> item.id === this.state.phoneNumber)
    this.setState({selectedCustomer});
  }

  handleAddCustomer = (data)=>{
    console.log('data',data);
    getAllCustomersApi(this, true, data);
    // const selectedCustomer = this.state.phoneNumberOptions.filter(item=> item.id === this.state.phoneNumber)
    // this.setState({
    //   customerInfo: data,
    //   showAddCustomer: false,
    //   phoneNumber: data.user_details.id,
    // },()=>this.handleSelectCustomer)
  }

  callCouponApi = () =>{
    const data = new URLSearchParams();
    data.append("franchise_location_id", this.state.pickupLocation);
    getApplicableCouponsApi(data,this);
    this.handleSelectBike();
  }

  setStartDate = (date) =>{
    this.setState({
      startDate: date,
      endDate: ""
    })
  }
  setEndDate = (date) =>{
    this.setState({
      endDate: date
    },()=>{
      this.handleSelectBike();
    })
  }

  handleSelectBike = () =>{
    const data = new URLSearchParams();
    data.append("start", -1);
    data.append("limit", -1);
    data.append("franchise_location_id", this.state.pickupLocation);
    data.append("from_datetime", moment(this.state.startDate).format("DD-MM-YYYY hh:mm"));
    data.append("to_datetime", moment(this.state.endDate).format("DD-MM-YYYY hh:mm"));
    getAvailableVehiclesApi(data,this);
  }

  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  onValidSubmit = () => {
    const { startDate, endDate, pickupLocation, selectedCustomer, bike, bikeList, coupon, couponList, paymentMode } = this.state;
    let selectedBike = bikeList.filter(item=>item.id === bike)
    let selectedCoupon = couponList.filter(item=>item.id === coupon)
    const data = new URLSearchParams();
    data.append('vehicle_inventory_id', bike);
    data.append('franchise_location_id', pickupLocation);
    data.append('start_datetime', moment(startDate).format("DD-MM-YYYY hh:mm"));
    data.append('end_datetime', moment(endDate).format("DD-MM-YYYY hh:mm"));
    data.append('pricing_id', selectedBike[0].price_data.id);
    data.append('customer_id', selectedCustomer[0].id);
    data.append('payment_mode', paymentMode);
    // if(pointsApplied){
    //   data.append('points', points);
    // }
    if(coupon){
      data.append('coupon_id', selectedCoupon[0].id);
    }
    createOrderApi(data,this);
  }

  render() {
    const {franchiseLocationOption, phoneNumberOptions, startDate, endDate, couponList, bikeList} = this.state;
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.editId ? "Edit Booking" : "Add Booking"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Booking"}
        />
        {
          this.state.showAddCustomer &&
          <AddCustomerModal
            show={this.state.showAddCustomer}
            handleClose={()=>this.setState({showAddCustomer: false})}
            handleAddCustomer={(data)=>this.handleAddCustomer(data)}
          />
        }
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <Row>
                {/* <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "franchiseName")}
                    label="Franchise Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Franchise name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Franchise Name",
                      }
                    }}
                  />
                </Col> */}
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "pickupLocation")}
                    label="Pickup Location"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Pickup location cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Pickup Location",
                        options: franchiseLocationOption,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.pickupLocation);
                          this.callCouponApi();
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "phoneNumber")}
                    label="Customer Phone Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Phone number cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Phone Number",
                        options: phoneNumberOptions,
                        noOptionAction: ()=>{this.setState({showAddCustomer: true})},
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.phoneNumber);
                          this.handleSelectCustomer();
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
              {
                this.state.selectedCustomer && this.state.pickupLocation &&
                <>
                <hr/>
                <br/>
                <br/>
                <Row>
                  <Col md={4}>
                    <label className="form-label">Customer Name</label>
                    <h4 className='red-hat-display-bold f-s-16'>{this.state.selectedCustomer[0].first_name || "NA"}</h4>
                  </Col>
                </Row>
                <br/>
                <br/>
              <Row>
                <Col md={4}>
                <div className='form-wrapper'>
                          <label className="form-label">Pickup Date/Time<span>*</span></label>
                            <FormGroup
                              controlId="scheduleDate"
                              className="date-group"
                            >
                              <DatePicker
                                minTime={startDate.getDay() === new Date().getDay() && startDate.getDay() && setHours(setMinutes(new Date(), startDate.getMinutes()), startDate.getHours())}
                                maxTime={startDate.getDay() === new Date().getDay() && startDate.getDay() && setHours(setMinutes(new Date(), 45), 23)}
                                minDate={new Date()}
                                selected={startDate}
                                onChange={(date) => this.setStartDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm aa"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className='form-control'
                              />
                            </FormGroup>
                          </div>
                </Col>
                <Col md={4}>
                <div className='form-wrapper'>
                          <label className="form-label">Return Date/Time<span>*</span></label>
                            <FormGroup
                              controlId="scheduleDate"
                              className="date-group"
                            >
                              <DatePicker
                                minTime={startDate.getDay() === endDate && endDate.getDay() && setHours(setMinutes(new Date(), 0), startDate.getHours()+1)}
                                maxTime={startDate.getDay() === endDate && endDate.getDay() && setHours(setMinutes(new Date(), 30), 23)}
                                minDate={addDays(startDate,1)}
                                selected={endDate}
                                onChange={(date) => this.setEndDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm aa"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className='form-control'
                              />
                            </FormGroup>
                          </div>
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "bike")}
                    label="Select Bike"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Bike cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Bike",
                        options: bikeList,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.bike);
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                <FormElement
                    valueLink={this.linkState(this, "coupon")}
                    label="Select Coupon"
                    // required
                    // validations={[
                    //   {
                    //     validate: FormValidator.isRequired,
                    //     message: "Coupon cannot be empty"
                    //   },
                    // ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Coupon",
                        options: couponList,
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "paymentMode")}
                    label="Payment Mode"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Payment Mode cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Payment Mode",
                        options: [{ label: "Payment Link", value: "20" }, { label: "Offline", value: "30" }],
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.paymentMode);
                        }
                      }
                    }}
                    />
                </Col>
              </Row>
              </>
              }
            </Form>
          </div>
          {/* </Container> */}
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({
  customersState: state.CustomersState
});
const mapDispatchToProps = {
  getAllFranchiseLocationApi,
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditBookings);