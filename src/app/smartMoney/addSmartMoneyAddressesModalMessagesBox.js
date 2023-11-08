import React from "react";
import { Modal, Image, Button } from "react-bootstrap";

import { CloseIcon } from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";

class AddSmartMoneyAddressesModalMessagesBox extends BaseReactComponent {
  render() {
    return (
      <div className="addCommunityTopAccountsWrapperAdded">
        <Modal.Header className="addCommunityTopAccountsAddedHeader">
          <div className="closebtn" onClick={this.props.hideModal}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body className="addCommunityTopAccountsAddedBody">
          <div className="addCommunityTopAccountsAddedBodyContent text-center">
            <div className="addCommunityTopAccountsAddedBodyContentChild">
              <Image
                className={`addCommunityTopAccountsAddedBodyIcon ${this.props.bodyImageClass}`}
                src={this.props.imageIcon}
              />
              <div
                className="exit-overlay-body mt-3"
                style={{ padding: "0rem 10.5rem" }}
              >
                <h6 className="inter-display-medium f-s-25">
                  {this.props.heading ? this.props.heading : ""}
                </h6>
                <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center mt-2">
                  {this.props.descriptionOne ? this.props.descriptionOne : ""}

                  {this.props.descriptionTwo ? (
                    <>
                      <br />
                      {this.props.descriptionTwo}
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
            <Button className="primary-btn" onClick={this.props.btnClick}>
              {this.props.btnText ? this.props.btnText : ""}
            </Button>
          </div>
        </Modal.Body>
      </div>
    );
  }
}

export default AddSmartMoneyAddressesModalMessagesBox;
