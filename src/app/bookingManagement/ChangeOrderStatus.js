import React, { useState } from "react"
import PropTypes from "prop-types"
import { Row, Col, Image, Button, Modal } from "react-bootstrap"
// import { cancelBookingApi } from '../Api';
import { CustomModal } from "../common"
import {
  BaseReactComponent,
  Form,
  FormElement,
  FormSubmitButton,
  CustomTextControl,
  FormValidator,
  SelectControl,
  FileUploadControl
} from "../../utils/form"
import { addPenaltyDetailsApi, addUpdateKYCApi } from "./Api"
import { API_URL } from "../../utils/Constant"

class ChangeOrderStatus extends BaseReactComponent {
  constructor(props) {
    super(props)
    this.state = {
      kycDocument: ""
    }
  }

  componentDidMount() {
    if (this.props.action === 2) {
      const data = new URLSearchParams()
      data.append("order_id", this.props.bookingId)
      addPenaltyDetailsApi(data, this)
    }
  }

  onSubmit = () => {
    this.props.markReturnOrder(this.state.paymentMode)
  }

  markPickupOrder = () => {
    const data = new URLSearchParams()
    data.append("order_id", this.props.bookingId)
    data.append(
      "kyc_attachment_ids",
      this.state.kycDocument
        ? JSON.stringify([this.state.kycDocument.imageId])
        : JSON.stringify([])
    )
    addUpdateKYCApi(data, this.props.markPickupOrder)
  }

  render() {
    const pentaltyDetails = this.state.pentaltyDetails
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={
          this.props.action === 1
            ? "Do you want to mark order as picked up?"
            : "Do you want to mark order as Completed?"
        }
        modalClass={"change-password"}
      >
        {this.props.action === 1 ? (
          <>
            {this.props.action === 1 && (
              <Form>
                <FormElement
                  valueLink={this.linkState(this, "kycDocument")}
                  label="Upload KYC Document"
                  control={{
                    type: FileUploadControl,
                    settings: {
                      moduleName: "offering",
                      subModule: "vehicle",
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
                          path: "single.jpg"
                        }
                        callback(fileInfo, API_URL)
                      }
                    }
                  }}
                />
              </Form>
            )}

            <div className="submit-wrapper">
              <Button
                className={`btn black-btn`}
                onClick={
                  this.props.action === 1
                    ? this.markPickupOrder
                    : this.props.markReturnOrder
                }
              >
                Yes, Mark
              </Button>
            </div>
            <div className="text-btn">
              <Button variant="light" onClick={this.props.handleClose}>
                No
              </Button>
            </div>
          </>
        ) : (
          <>
            <Form onValidSubmit={this.onSubmit}>
              {pentaltyDetails?.payable_amount > 0 ? (
                <>
                  {pentaltyDetails && (
                    <div className="estimated-fare-wrapper">
                      <Row>
                        <Col md={6}>
                          <p className="proximanova-regular op-6 f-s-14 lh-24">
                            Damage Fee{" "}
                          </p>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.damage_amount}
                          </h4>
                        </Col>
                        <Col md={6}>
                          <p className="proximanova-regular op-6 f-s-14 lh-24">
                            Extra Km{" "}
                          </p>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.extra_kms_amount}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <p className="proximanova-regular  op-6 f-s-14 lh-24">
                            Late Fee{" "}
                          </p>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹
                            {pentaltyDetails.extra_time_amount
                              ? pentaltyDetails.extra_time_amount
                              : "0"}
                          </h4>
                        </Col>
                        <Col md={6}>
                          <p className="proximanova-regular  op-6 f-s-14 lh-24">
                            Total Tax
                          </p>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.total_tax_amount}
                          </h4>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <h4 className="proximanova-proximanova-regular op-6 f-s-14 lh-24">
                            Total Charges
                          </h4>
                        </Col>
                        <Col md={6}>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.total_amount}
                          </h4>
                        </Col>
                        <Col md={6}>
                          <h4 className="proximanova-proximanova-regular op-6 f-s-14 lh-24">
                            Deposit
                          </h4>
                        </Col>
                        <Col md={6}>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.deposit_discount}
                          </h4>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <h4 className="proximanova-proximanova-regular op-6 f-s-16 lh-24">
                            Total Payble amount
                          </h4>
                        </Col>
                        <Col md={6}>
                          <h4 className="proximanova-bold f-s-16 lh-24">
                            ₹{pentaltyDetails.payable_amount}
                          </h4>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Row>
                    <Col md={12}>
                      <FormElement
                        valueLink={this.linkState(this, "paymentMode")}
                        label="Payment Mode"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Payment Mode cannot be empty"
                          }
                        ]}
                        control={{
                          type: SelectControl,
                          settings: {
                            placeholder: "Select Payment Mode",
                            options: [
                              { label: "Payment Link", value: "20" },
                              { label: "Offline", value: "30" }
                            ],
                            multiple: false,
                            searchable: true,
                            onChangeCallback: (onBlur) => {
                              onBlur(this.state.paymentMode)
                            }
                          }
                        }}
                      />
                    </Col>
                  </Row>
                  <div
                    className="submit-wrapper"
                    style={{ justifyContent: "center" }}
                  >
                    <FormSubmitButton
                      customClass={`btn black-btn ${
                        !this.state.paymentMode && "inactive-btn"
                      }`}
                    >
                      {" "}
                      Yes, Mark
                    </FormSubmitButton>
                  </div>
                </>
              ) : (
                <div className="submit-wrapper">
                  <Button
                    className={`btn black-btn`}
                    onClick={() => this.props.markReturnOrder(null)}
                  >
                    Yes, Mark
                  </Button>
                </div>
              )}
            </Form>
            <div className="text-btn">
              <Button variant="light" onClick={this.props.handleClose}>
                No
              </Button>
            </div>
          </>
        )}
      </CustomModal>
    )
  }
}

ChangeOrderStatus.propTypes = {
  // getPosts: PropTypes.func
}

export default ChangeOrderStatus
