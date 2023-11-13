import React from "react";
import { Modal, Image, Button } from "react-bootstrap";

import { CloseIcon, TrophyIcon } from "../../assets/images/icons";
import { BaseReactComponent, CustomButton } from "../../utils/form";

class AddSmartMoneyAddressesModalMessagesBox extends BaseReactComponent {
  render() {
    return (
      <div className="addCommunityTopAccountsWrapperAdded">
        <Modal.Header className="addCommunityTopAccountsAddedHeader">
          <div className="api-modal-header">
            <Image src={TrophyIcon} />
          </div>
          {!this.props.hideCrossBtn ? (
            <div className="closebtn" onClick={this.props.hideModal}>
              <Image src={CloseIcon} />
            </div>
          ) : null}
        </Modal.Header>
        <Modal.Body className="addCommunityTopAccountsAddedBody">
          <div
            style={{
              paddingTop: "0rem",
            }}
            className="addCommunityTopAccountsAddedBodyContent text-center"
          >
            <div
              style={{
                justifyContent: "flex-start",
              }}
              className="addCommunityTopAccountsAddedBodyContentChild"
            >
              {/* addCommunityTopAccountsAddedBodyContentChild */}
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
              <div
                style={{
                  width: "100%",
                }}
                className="addCommunityTopAccountsWrapperParent"
              >
                <div className="addCommunityTopAccountsWrapperContainer">
                  <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                    <div
                      className={`awInputWrapper ${
                        this.props.inputVal ? "isAwInputWrapperValid" : null
                      }`}
                    >
                      <>
                        <div className="awTopInputWrapper">
                          <div className="awInputContainer">
                            <input
                              autoFocus
                              value={this.props.inputVal || ""}
                              className={`inter-display-regular f-s-15 lh-20 awInput`}
                              placeholder={
                                this.props.inputPlaceholder
                                  ? this.props.inputPlaceholder
                                  : ""
                              }
                              title={this.props.inputVal || ""}
                              onChange={(e) => this.props.handleOnChange(e)}
                              onKeyDown={this.props.handleEnterPress}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    opacity: this.props.showErrorMessage ? 1 : 0,
                  }}
                  className="addCommunityTopAccountsAddedBodyContentChildErrorMeaageContainer"
                >
                  Please enter valid email id
                </div>
              </div>
            </div>
            <CustomButton
              className="primary-btn go-btn"
              type="submit"
              isLoading={this.props.loadingBtn}
              isDisabled={this.props.disableBtn}
              buttonText={this.props.btnText ? this.props.btnText : ""}
              handleClick={this.props.btnClick}
            />
          </div>
        </Modal.Body>
      </div>
    );
  }
}

export default AddSmartMoneyAddressesModalMessagesBox;
