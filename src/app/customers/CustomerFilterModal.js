import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, Form, FormElement, FormSubmitButton, FormValidator, SelectControl
} from '../../utils/form';
import { CustomModal } from "../common";
import { Button } from 'react-bootstrap';

class CustomerFilterModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      oem: "",
      dealer: "",
      status: "",
    }
  }
  componentDidMount() { }

  onSubmit = () => {

  }

  handleClearFilter = () => {
    console.log('Hey');
    this.setState({
      oem: "",
      dealer: "",
      status: "",
    })
  }
  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={"Filters"}
      >

        <Form onValidSubmit={this.onSubmit}>
          <div className='modal-wrapper'>
            <FormElement
              valueLink={this.linkState(this, "oem")}
              label="OEM"
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Field cannot be empty"
                }
              ]}
              control={{
                type: SelectControl,
                settings: {
                  placeholder: "Select OEM",
                  options: [
                    { value: 1, label: "Ola" },
                    { value: 2, label: "Uber" },
                    { value: 3, label: "Delhi" },
                  ],
                  multiple: false,
                  searchable: true,
                  onChangeCallback: (onBlur) => {
                    onBlur(this.state.oem);
                  }
                }
              }}
            />
            {
              this.state.oem &&
              <>
                <FormElement
                  valueLink={this.linkState(this, "dealer")}
                  label="Dealer"
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty"
                    }
                  ]}
                  control={{
                    type: SelectControl,
                    settings: {
                      placeholder: "Select Dealer",
                      options: [
                        { value: 1, label: "A" },
                        { value: 2, label: "B" },
                        { value: 3, label: "C" },
                      ],
                      multiple: false,
                      searchable: true,
                      onChangeCallback: (onBlur) => {
                        onBlur(this.state.dealer);
                      }
                    }
                  }}
                />
                <FormElement
                  valueLink={this.linkState(this, "status")}
                  label="Status"
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty"
                    }
                  ]}
                  control={{
                    type: SelectControl,
                    settings: {
                      placeholder: "Select Status",
                      options: [
                        { value: 1, label: "Active" },
                        { value: 2, label: "Inactive" },
                        { value: 3, label: "Processing" },
                      ],
                      multiple: false,
                      searchable: true,
                      onChangeCallback: (onBlur) => {
                        onBlur(this.state.status);
                      }
                    }
                  }}
                />
              </>
            }
          </div>
          <div className="submit-wrapper">
            <Button className={`btn clear-btn ${!this.state.oem && "inactive-state"}`} onClick={this.state.oem && this.handleClearFilter}>Clear All</Button>
            <FormSubmitButton customClass="btn black-btn">Apply Filter</FormSubmitButton>
          </div>
        </Form>
      </CustomModal>
    )
  }
}

CustomerFilterModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default CustomerFilterModal;