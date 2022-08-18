// import React from 'react';
// import PropTypes from 'prop-types';
// import { CustomModal } from '../common';

// const AddCustomerModal = props => {
//     return (
//       <CustomModal
//       show={props.show}
//       onHide={props.handleClose}
//       title={"Add New Customer"}
//       modalClass={"change-password"}
//     >
//       <Form onValidSubmit={this.onSubmit}>
//           <FormElement
//             valueLink={this.linkState(this, "oldPassword")}
//             label="Current Password"
//             required
//             validations={[
//               {
//                 validate: FormValidator.isRequired,
//                 message: "Field cannot be empty"
//               }
//             ]}
//             control={{
//               type: CustomTextControl,
//               settings: {
//                 placeholder: "Enter Current Password",
//                 type: this.state.showOldPassword ? "text" : "password",
//                 suffix: <Image src={this.state.showOldPassword ? eyeVisible : eyeIcon} onClick={() => this.handleEye("showOldPassword")} className="eye-icon" />
//               }
//             }}
//           />
//           <div className="submit-wrapper">
//             <FormSubmitButton customClass="btn black-btn">Reset Password</FormSubmitButton>
//           </div>
//         </Form>
//       </CustomModal>
//     );
// };
// AddCustomerModal.propTypes = {
//     // getPosts: PropTypes.func
// };
// export default AddCustomerModal;

import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator
} from '../../utils/form';
import { CustomModal } from "../common";
import { sendOtpApi, verifyOtpApi } from './Api';

class AddCustomerModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showVerifyOtp: false,
      phone: "",
      otp: "",
    }
  }
  componentDidMount() { }

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append("mobile", this.state.phone);
    if(this.state.showVerifyOtp){
      data.append("otp_code", this.state.otp);
      verifyOtpApi(this, data);
    } else{
      sendOtpApi(this, data);
    }

  }

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={this.state.showVerifyOtp ? "Verification Code" : "Add New Customer"}
        modalClass={"change-password"}
      >
        <Form onValidSubmit={this.onSubmit}>
                  {
                    this.state.showVerifyOtp
                    ?
<FormElement
                    valueLink={this.linkState(this, "otp")}
                    label="OTP"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Number cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter OTP",
                      }
                    }}
                  />
                    :
<FormElement
                    valueLink={this.linkState(this, "phone")}
                    label="Contact Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Number cannot be empty"
                      },
                      {
                        validate: FormValidator.isPhone,
                        message: "Please enter a valid number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Number",
                      }
                    }}
                  />
                  }

          <div className="submit-wrapper">
            <FormSubmitButton customClass="btn black-btn">{this.state.showVerifyOtp ? "Verify & Add Customer" : "Next"}</FormSubmitButton>
          </div>
        </Form>

      </CustomModal>
    )
  }
}

AddCustomerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddCustomerModal;