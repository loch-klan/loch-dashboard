import React from "react";
import { Col } from "react-bootstrap";
import { connect } from "react-redux";
import { API_URL } from "../../utils/Constant";
import {
  BaseReactComponent,
  CustomTextControl,
  CustomRadio,
  Form,
  FormElement,
  FormSubmitButton,
  FormValidator,
  FileUploadControl,
} from "../../utils/form";
// import { cancelBookingApi } from '../Api';
import { CustomModal } from "../common";
import { addPenaltyApi } from "./Api";

class AddPenalty extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      extraKm: "",
      penaltyAmount: "",
      damageImages: [],
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append("order_id", this.props.bookingId);
    if (this.state.penaltyAmount)
      data.append("damage_amount", this.state.penaltyAmount);
    if (this.state.note) data.append("damage_details", this.state.note);
    if (this.state.extraKm) data.append("extra_kms", this.state.extraKm);
    if (this.state.damageImages) {
      let images = [];
      this.state.damageImages.map((item) => images.push(item.imageId));
      console.log("images", images);
      data.append("damage_attachment_ids", JSON.stringify(images));
    }

    addPenaltyApi(data, this.props.getBookingDetails, this.props.handleClose);
  };

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title="Add Penalty"
        modalClass={"change-password"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <div className="">
            <Col md={12}>
              <FormElement
                valueLink={this.linkState(this, "penaltyAmount")}
                label="Damage Penalty Amount (in rupees)"
                validations={[
                  // {
                  //     validate: FormValidator.isRequired,
                  //     message: "Penalty Amount cannot be empty"
                  // },
                  {
                    validate: FormValidator.isPositiveInt,
                    message: "Damage Penalty Amount cannot be negative",
                  },
                ]}
                control={{
                  type: CustomTextControl,
                  settings: {
                    placeholder: "Enter Damage Penalty Amount",
                  },
                }}
              />
              <FormElement
                valueLink={this.linkState(this, "note")}
                label="Damage Details"
                // required
                // validations={[
                //     {
                //         validate: FormValidator.isRequired,
                //         message: "Notes cannot be empty"
                //     },
                // ]}
                control={{
                  type: CustomTextControl,
                  settings: {
                    placeholder: "Enter Damage Details",
                    as: "textarea",
                    rows: 2,
                  },
                }}
              />
              <FormElement
                valueLink={this.linkState(this, "damageImages")}
                label="Damage Images"
                // required
                // validations={[
                //   {
                //     validate: FormValidator.isRequired,
                //     message: "File is required",
                //   },
                // ]}
                control={{
                  type: FileUploadControl,
                  settings: {
                    moduleName: "offering",
                    subModule: "vehicle",
                    fileType: "IMAGE",
                    extensions: ["image/*"],
                    maxFiles: 5,
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
                          (this.state.damageImages.length + 1) +
                          ".jpg",
                      };
                      callback(fileInfo, API_URL);
                    },
                  },
                }}
              />
              <FormElement
                valueLink={this.linkState(this, "extraKm")}
                label="Extra Kilometers"
                validations={[
                  // {
                  //     validate: FormValidator.isRequired,
                  //     message: "Penalty Amount cannot be empty"
                  // },
                  {
                    validate: FormValidator.isPositiveInt,
                    message: "Penalty Amount cannot be negative",
                  },
                ]}
                control={{
                  type: CustomTextControl,
                  settings: {
                    placeholder: "Enter Extra Kilometers",
                  },
                }}
              />
            </Col>
          </div>
          <div className="submit-wrapper" style={{ justifyContent: "center" }}>
            <FormSubmitButton customClass={`btn black-btn`}>
              Confirm
            </FormSubmitButton>
          </div>
        </Form>
      </CustomModal>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
};
export default connect(mapStateToProps, mapDispatchToProps)(AddPenalty);
