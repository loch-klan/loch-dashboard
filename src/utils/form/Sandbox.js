import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ReactDOM from "react-dom";
import BaseReactComponent from "./BaseReactComponent";
import CustomButton from "./CustomButton";
import CustomTextControl from "./CustomTextControl";
import Form from "./Form";
import FormElement from "./FormElement";
import FormValidator from "./FormValidator";
import RangeInput from "./RangeInput";
import SelectControl from "./SelectControl";
import CustomRadio from "./CustomRadio";
import FileUploadControl from "./FileUploadControl";
import CustomCheckbox from "./CustomCheckbox";
import CustomTable from "../commonComponent/CustomTable";

class Sandbox extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      value: "",
      validated: false,
      name: "",
      address: "",
      lastName: "",
      gender: "",
      searchableSingleRegion: "",
      searchableMultipleRegion: "",
      regionOptions: [
        { value: 1, label: "Goa" },
        { value: 2, label: "Maha" },
        { value: 3, label: "Delhi" },
        { value: 4, label: "Goa highway" },
      ],
      attachment: {
        name: "filename.jpg",
        url: "https://image.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-260nw-407021107.jpg",
      },
      attachments: [],
      checkboxList: [
        {
          key: true,
          label: "On Premise Venue",
          // isDefault: false,
          // isChecked: true,
        },
        {
          key: false,
          label: "Retail Venue",
          // isDefault: false,
          // isChecked: false,
        },
      ],
      dummyData: [
        {
          firstName: "Nirav",
          lastName: "Panchal",
        },
        {
          firstName: "Mahesh",
          lastName: "Kadam",
        },
        {
          firstName: "Dharmik",
          lastName: "Joshi",
        },
        {
          firstName: "Uday",
          lastName: "Naidu",
        },
      ],
      currentPage: 1,
      page: page ? parseInt(page, 10) : 1,
    };
  }

  setValue = (value) => {
    this.setState({ value });
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit"));
  };

  onValidSubmit = (done, event) => {
    // console.log('hey', event);
    console.log("Value submitted" + this.state.value);
    console.log("Form Submitted" + this.state.name);
  };

  handlePageSize = (pageSize) => {
    console.log("Heyyy pageSize", pageSize);
  };

  /* onSubmit = (event) => {
    // console.log('hey', event);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  } */

  componentDidMount() {
    this.props.history.replace({
      search: `?p=${this.state.page}`,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Hey');
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p"), 10) || 1;

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p"), 10) || 1;

    if (prevPage !== page) {
      this.setState({ page });
    }
  }

  render() {
    const regionOptions = [...this.state.regionOptions];
    const { dummyData } = this.state;
    return (
      <Fragment>
        <Form onValidSubmit={this.onValidSubmit} ref={(el) => (this.form = el)}>
          <Container>
            <Row className="show-grid">
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "name")}
                  label="First Name"
                  required
                  // helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Enter First Name",
                      prefix: "Mr/Ms",
                      suffix: "is here!",
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "address")}
                  label="Address"
                  required
                  // helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Please enter address",
                      as: "textarea",
                      // multiline: true,
                      rows: 5,
                      // isValid: this.state.address ? true : false,
                      // isInvalid: this.state.address ? false : true,
                      // classes: "custom-text"
                      // readOnly: true,
                      // disabled: true,
                    },
                  }}
                  classes={{
                    inputField: "custom-input",
                    label: "custom-label",
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "lastName")}
                  label="Last Name"
                  required
                  helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Enter Last Name",
                      // prefix: "Mr/Ms",
                      // suffix: "is here!"
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "rating")}
                  label="Rating"
                  required
                  // helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: RangeInput,
                    settings: {
                      minValue: 0,
                      maxValue: 100,
                      rangeId: "ratingRange",
                      rangeName: "ratingRange",
                    },
                  }}
                />
              </Col>
              <Col sm={6}>
                <FormElement
                  valueLink={this.linkState(this, "searchableSingleRegion")}
                  label="Market"
                  required
                  helpText=""
                  hint={{
                    title: "Title Custom",
                    description: <span> Custom Hint Bro! </span>,
                  }}
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: SelectControl,
                    settings: {
                      options: regionOptions,
                      multiple: false,
                      searchable: true,
                      onChangeCallback: (onBlur) => {
                        onBlur(this.state.searchableSingleRegion);
                        // console.log('Hello world!');
                      },
                    },
                  }}
                />
              </Col>
              <Col sm={6}>
                <FormElement
                  valueLink={this.linkState(this, "searchableMultipleRegion")}
                  label="Multiple Market"
                  required
                  helpText=""
                  hint={{
                    title: "Title Custom",
                    description: <span> Custom Hint Bro! </span>,
                  }}
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: SelectControl,
                    settings: {
                      options: regionOptions,
                      multiple: true,
                      searchable: true,
                      closeMenuOnSelect: false,
                      // menuIsOpen: true,
                      onChangeCallback: (onBlur) => {
                        onBlur(this.state.searchableMultipleRegion);
                        // console.log('Hello world!');
                      },
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "gender")}
                  label="Gender Type"
                  required
                  // helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomRadio,
                    settings: {
                      radioId: "gender",
                      radioName: "gender",
                      options: [
                        {
                          key: "1",
                          label: "On Premise Venue",
                        },
                        {
                          key: "2",
                          label: "Retail Venue",
                        },
                      ],
                      isInline: true,
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "checkboxList")}
                  label="Hobby"
                  required
                  // helpText="This is helptext"
                  // toolTipText="This is tooltip"
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomCheckbox,
                    settings: {
                      radioId: "hobby",
                      radioName: "hobby",
                      options: this.state.checkboxList,
                      // isInline: true,
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "attachment")}
                  label="Upload Image"
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "File is required",
                    },
                  ]}
                  control={{
                    type: FileUploadControl,
                    settings: {
                      moduleName: "account",
                      subModule: "project",
                      fileType: "IMAGE",
                      extensions: ["image/*"],
                      maxFiles: 1,
                      maxFileSize: 100000000,
                      onSelect: (file, callback) => {
                        // You will need to generate signedURL by calling API and then call callback
                        const fileInfo = {
                          id: file.lastModified,
                          name: file.name,
                          size: file.size,
                          mimeType: file.type,
                          path: "single.jpg",
                        };
                        callback(fileInfo, "http://35.154.155.206/api");
                      },
                    },
                  }}
                />
              </Col>
              <Col md={6}>
                <FormElement
                  valueLink={this.linkState(this, "attachments")}
                  label="Upload Image Multiple"
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "File is required",
                    },
                  ]}
                  control={{
                    type: FileUploadControl,
                    settings: {
                      moduleName: "account",
                      subModule: "project",
                      fileType: "IMAGE",
                      extensions: [".png,.jpg"],
                      maxFiles: 2,
                      maxFileSize: 100000000,
                      onSelect: (file, callback) => {
                        // You will need to generate signedURL by calling API and then call callback
                        const fileInfo = {
                          id: file.lastModified,
                          name: file.name,
                          size: file.size,
                          mimeType: file.type,
                          path:
                            "multi" +
                            (this.state.attachments.length + 1) +
                            ".jpg",
                        };
                        callback(fileInfo, "http://35.154.155.206/api");
                      },
                    },
                  }}
                />
              </Col>

              <Col md={12}>
                <CustomButton
                  type={"submit"}
                  handleClick={() => {
                    this.setValue("now");
                  }}
                  variant="success"
                  buttonText="Now"
                />
                <CustomButton
                  handleClick={() => {
                    this.setValue("later");
                  }}
                  buttonText="Later"
                />
              </Col>
            </Row>
          </Container>
        </Form>
        <Container>
          <Row>
            <Col md={12}>
              <CustomTable
                tableData={dummyData}
                columnList={[
                  {
                    coumnWidth: 250,
                    labelName: "First Name",
                    dataKey: "firstName",
                    className: "first-name",
                    isCell: true,
                    cell: (rowData, dataKey) => {
                      if (dataKey === "firstName") {
                        return rowData.firstName;
                      }
                    },
                  },
                  {
                    coumnWidth: 250,
                    labelName: "Last Name",
                    dataKey: "lastName",
                    className: "",
                    isCell: true,
                    cell: (rowData, dataKey) => {
                      if (dataKey === "lastName") {
                        return rowData.lastName;
                      }
                    },
                  },
                ]}
                message="No data found"
                // For Pagination
                history={this.props.history}
                location={this.props.location}
                totalPage={2}
                currentPage={this.state.page}
                pageSize={true}
                pageSizeOptions={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 30, label: "30" },
                  { value: 40, label: "40" },
                ]}
                handlePageSize={this.handlePageSize}
              />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

Sandbox.propTypes = {
  classes: PropTypes.object,
};

export default Sandbox;
