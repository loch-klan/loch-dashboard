import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import { getAllLocationApi } from '../common/Api';
import ReactDOM from 'react-dom';
import { AccountType, GOOGLE_API_KEY, LocationType } from '../../utils/Constant';
import { getUserAccountType } from '../../utils/ManageToken';
import { getAllFranchiseApi, addUpdateFranchiseLocationApi } from './Api';
import { Autocomplete, GoogleMap, LoadScript } from '@react-google-maps/api';

class AddEditFranchiseLocation extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    // this.autocompleteInput = React.createRef();
    const userAccountType = getUserAccountType();
    const data = props.location.state ? props.location.state.data : null;
    this.state = {
      data,
      locationId: data ? data.id : "",
      userAccountType,
      areaId: data ? data.area_id : "",
      areaList: [],
      franchiseId: data ? data.franchise_account_id : "",
      geoLocation: data ? data.location_details : "",
      formattedAddress: data ? data.location_details.formatted_address : "",
    }
  }
  componentDidMount() {
    // const google = window.google
    // this.service = new google.maps.DistanceMatrixService();
    this.state.userAccountType === AccountType.COMPANY &&
      this.props.getAllFranchiseApi(this, -1);
    this.props.getAllLocationApi(this, LocationType.AREA);
  }

  onLoad = (autocomplete) => {
    // console.log('autocomplete: ', autocomplete)

    this.autocomplete = autocomplete
  }

  onPlaceChanged = () => {
    // console.log('this.autocomplete',this.autocomplete);
    if (this.autocomplete !== null) {
      // console.log("placessssss",this.autocomplete.getPlace())
      this.place = this.autocomplete.getPlace();
      let lat = this.place.geometry.location.lat();
      let lng = this.place.geometry.location.lng();
      this.setState({
        formattedAddress: this.place.formatted_address,
        geoLocation: {
          formatted_address: this.place.formatted_address,
          geometry: {
            location: {
              lat: lat,
              lng: lng,
            }
          }
        }
      })
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }


  // onRefChange = (ref) => {
  //   if (ref) {
  //     this.autocompleteInput = ref;
  //     this.autoComplete = new window.google.maps.places.Autocomplete(ref);
  //     this.refCompleted = true;
  //     this.autoComplete.setFields(["formatted_address", "geometry"]);
  //     this.autoComplete.addListener('place_changed', this.autoCompletePlaceSelected);
  //   }
  // }

  // clearAutoComplete = () => {
  //   // this.setState({ isData: false, notServicable: false, outGeoFence: false });
  //   this.autocompleteInput.value = "";
  // }

  // autoCompletePlaceSelected = () => {
  //   // Call place details to get address components
  //   this.place = this.autoComplete.getPlace();
  //   let lat = this.place.geometry.location.lat();
  //   let lng = this.place.geometry.location.lng();
  //   this.setState({
  //     geoLocation: {
  //       formatted_address: this.place.formatted_address,
  //       geometry: {
  //         location: {
  //           lat: lat,
  //           lng: lng,
  //         }
  //       }
  //     }
  //   })
  // }

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append("area_id", this.state.areaId);
    data.append("franchise_id", this.state.userAccountType === AccountType.COMPANY ? this.state.franchiseId : JSON.parse(localStorage.getItem('userDetails')).id);
    data.append("geo_location", JSON.stringify(this.state.geoLocation));
    if (this.state.locationId) {
      data.append("franchise_location_id", this.state.locationId);
    }
    addUpdateFranchiseLocationApi(data, () => this.props.history.goBack());
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  render() {
    const { areaList, userAccountType, franchiseOptionsList } = this.state;
    let newAreaList = areaList.filter(row => row.is_operational === true);
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.areaId ? "Edit Franchise Location" : "Add Franchise Location"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Franchise Location"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onSubmit} ref={el => this.form = el}>
              <Row>
                {
                  userAccountType === AccountType.COMPANY &&
                  <Col sm={4}>
                    <FormElement
                      valueLink={this.linkState(this, "franchiseId")}
                      label="Select Franchise"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Franchise cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Franchise",
                          options: franchiseOptionsList,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.franchiseId);
                            console.log('Hello world!');
                          }
                        }
                      }}
                    />
                  </Col>
                }
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "areaId")}
                    label="Select Area"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Area cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Area",
                        options: newAreaList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          // let areaName = newAreaList.filter((item) => item.id === this.state.areaId);
                          this.setState({
                            formattedAddress: "",
                            geoLocation: "",
                          })
                          onBlur(this.state.areaId);
                          console.log('Hello world!');
                        }
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <div className="form-group">
                    <label>Search Franchise Location <span style={{ color: "red" }}>*</span> </label>
                    {/* <input autoFocus autoComplete="off"
            ref={this.onRefChange}
            value={this.state.formattedAddress}
            onChange={(e)=>this.setState({formattedAddress: e.target.value})}
            placeholder={"Search location"}
            type="text" className="form-control" /> */}
                    <LoadScript
                      libraries={["places"]}
                      id="script-loader"
                      googleMapsApiKey={GOOGLE_API_KEY}
                      language="en"
                      region="us"
                    >
                      <Autocomplete
                        fields={["formatted_address", "geometry"]}
                        onLoad={this.onLoad}
                        onPlaceChanged={this.onPlaceChanged}
                      >
                        <input
                          type="text"
                          placeholder={"Search location"}
                          className="form-control"
                          value={this.state.formattedAddress}
                          onChange={(e) => this.setState({ formattedAddress: e.target.value })}
                        />
                      </Autocomplete>
                    </LoadScript>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = {
  getAllLocationApi,
  getAllFranchiseApi,
  addUpdateFranchiseLocationApi,
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditFranchiseLocation);