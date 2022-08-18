import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import { getAllLocationApi, addUpdateLocationApi } from '../common/Api';
import ReactDOM from 'react-dom';
import MyGoogleMap from './_utils/MyGoogleMap';
import { LocationType } from '../../utils/Constant';
import { toast } from "react-toastify";

class AddEditArea extends BaseReactComponent {
  constructor(props) {
    super(props);
    const data = props.location.state ? props.location.state.editData : null;
    this.state = {
      areaId: data ? data.id : "",
      polygon: data ? data : false,
      areaName: data ? data.name : "",
      code: data ? data.code : "",
      cityId: data ? data.parent_id : "",
      path: data ? data.geo_fencing.coordinates[0] :[],
      cityList: [],
      stateId: "",
    }
  }
  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.CITY);
  }

  onSubmit = () => {
    if (this.state.path.length === 0) {
      toast.error("Please map geofence")
      return false
    }
    const data = new URLSearchParams();
    data.append("location_type", LocationType.AREA);
    data.append("parent_id", this.state.cityId);
    data.append("name", this.state.areaName);
    data.append("code", this.state.code);
    data.append("is_operational", true);
    data.append("geo_fencing", JSON.stringify(this.state.path));
    if (this.state.areaId) {
      data.append("location_id", this.state.areaId);
    }
    addUpdateLocationApi(data, () => this.props.history.goBack());
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  handlePath = (path) => {
    console.log('path',path);
    let dummy = [];
    path.map((item) => {
      return (dummy.push([item.lat, item.lng]))
    })
    this.setState({
      path: dummy
    })
  }

  render() {
    const { cityList } = this.state;
    let newCityList = cityList.filter(row => row.is_operational === true);
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.areaId ? "Edit Area" : "Add Area"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Area"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onSubmit} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "areaName")}
                    label="Area Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Area name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter area name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "code")}
                    label="Code"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Area code cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter area code",
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "cityId")}
                    label="Select City"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "City cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select City",
                        options: newCityList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          let cityName = newCityList.filter((item) => item.id === this.state.cityId);
                          this.setState({
                            cityName
                          })
                          onBlur(this.state.cityId);
                          console.log('Hello world!');
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <h4 className='red-hat-display-medium f-s-14 grey-AAA'> Draw Polygon </h4>
                  <MyGoogleMap polygon={this.state.polygon} setPath={(path) => this.handlePath(path)} />
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
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditArea);