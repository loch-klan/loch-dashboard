import React, { createRef } from "react";

import Draggable from "react-draggable";
import "./../../assets/scss/common/_forms.scss";

import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import RightIcons from "../../assets/images/icons/caveronRight.svg";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import Form from "../../utils/form/Form";
import Radio from "./Forms/Radio.js";

class UserFeedbackModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      email: "",
      isShowOtp: false,
      show: props.show,
      isOptInValid: false,
      onHide: props.onHide,
      isEmailVerified: false,
      isEmailNotExist: false,
      questions: [
        {
          id: 1,
          question: "How likely are you to recommend Loch to a friend?",
          value: "",
          type: "radio",
        },
        {
          id: 2,
          question: "How did you discover Loch?",
          value: "",
          type: "input",
        },
        {
          id: 3,
          question: "What do you use Loch for?",
          value: "",
          type: "input",
        },
        {
          id: 4,
          question: "Have you noticed any issues or bugs?",
          value: "",
          type: "input",
        },
        {
          id: 5,
          question:
            "Do you use Loch to analyze your own wallets or others' wallets?",
          value: "",
          type: "input",
        },
      ],

      // metamask
      balance: 0,
      MetaAddress: "",
      btnloader: false,
      MetamaskExist: false,
      currentQuestion: 0,
    };
  }
  nextButtonRef = createRef();

  handleNext = () => {
    console.log("handleAccountCreate");
  };
  goToPrevQuestion = () => {
    if (this.state.currentQuestion > 0) {
      this.setState({
        currentQuestion: this.state.currentQuestion - 1,
      });
    }
  };
  listener = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      this.nextButtonRef.current.click();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.listener);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.listener);
  }

  render() {
    return (
      <div className="sidebarCustonDontLoseDataModalContainerTwo">
        <div className="sidebarCustonDontLoseDataModalContainer">
          <Draggable
            onDrag={(e, data) => this.props.trackPos(data)}
            position={
              this.props.dragPosition ? this.props.dragPosition : { x: 0, y: 0 }
            }
            bounds="parent"
            handle="#draggableHandle"
          >
            <div
              id="draggableHandle"
              className="sidebarCustonDontLoseDataModal "
            >
              <div className="modal-dialog exit-overlay-modal sidebarModalCustom modal-lg">
                <div className="modal-content">
                  <Modal.Body>
                    <div className="sidebarModalBodyContainer">
                      <div className="exit-overlay-body sidebarModalBody">
                        {this.state.currentQuestion > 0 ? (
                          <div
                            className="closebtnContainer"
                            style={{
                              marginRight: "12px",
                              transform: "rotate(180deg)",
                            }}
                          >
                            <div
                              className={`closebtn ${
                                this.state.email ? "active" : ""
                              }`}
                              onClick={this.goToPrevQuestion}
                              type="submit"
                              style={{
                                border: "none",
                                background: "#19191A",
                                opacity: "1",
                                cursor: "pointer",
                              }}
                            >
                              <Image
                                className="closebtnIcon"
                                src={RightIcons}
                              />
                            </div>
                          </div>
                        ) : null}
                        <div>
                          <h6
                            className="inter-display-medium f-s-16"
                            style={{
                              color: "#262626",
                              width:
                                this.state.questions[this.state.currentQuestion]
                                  .type == "radio"
                                  ? ""
                                  : "200px",
                            }}
                          >
                            {
                              this.state.questions[this.state.currentQuestion]
                                .question
                            }
                          </h6>
                        </div>
                        {/* this.props.isSkip(); */}
                        <div
                          className="email-section auth-modal f-s-14"
                          style={{ paddingRight: "0px" }}
                        >
                          {/* For Signin or Signup */}
                          <Form
                            onValidSubmit={this.handleNext}
                            style={{ alignItems: "center" }}
                          >
                            {this.state.questions[this.state.currentQuestion]
                              .type == "radio" ? (
                              <div
                                className="d-flex"
                                style={{
                                  gap: "16px",
                                  marginRight: "52px",
                                  cursor: "pointer",
                                }}
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                  <div
                                    className="hoverDarker d-flex justify-content-center"
                                    style={{
                                      flexDirection: "column",
                                      gap: "8px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Radio
                                      active={
                                        this.state.questions[
                                          this.state.currentQuestion
                                        ].value == item
                                      }
                                      handleClick={() => {
                                        let questions = this.state.questions;
                                        questions[
                                          this.state.currentQuestion
                                        ].value = item;
                                        this.setState({
                                          questions,
                                        });
                                        this.setState({
                                          currentQuestion:
                                            this.state.currentQuestion + 1,
                                        });
                                      }}
                                    />
                                    <div
                                      style={{
                                        cursor: "pointer",
                                        color:
                                          this.state.questions[
                                            this.state.currentQuestion
                                          ].value == item
                                            ? "#19191A"
                                            : "#96979A",
                                      }}
                                      onClick={() => {
                                        let questions = this.state.questions;
                                        questions[
                                          this.state.currentQuestion
                                        ].value = item;
                                        this.setState({
                                          questions,
                                        });
                                      }}
                                    >
                                      {item}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={
                                    this.state.questions[
                                      this.state.currentQuestion
                                    ].value
                                  }
                                  placeholder="Your answer"
                                  onChange={(e) => {
                                    let questions = this.state.questions;
                                    questions[
                                      this.state.currentQuestion
                                    ].value = e.target.value;
                                    this.setState({
                                      questions,
                                    });
                                  }}
                                />
                              </div>
                            )}

                            {(this.state.questions[this.state.currentQuestion]
                              .type == "radio" &&
                              this.state.questions[this.state.currentQuestion]
                                .value) ||
                            this.state.questions[this.state.currentQuestion]
                              .type != "radio" ? (
                              <div
                                className="closebtnContainer"
                                style={{
                                  marginRight:
                                    this.state.questions[
                                      this.state.currentQuestion
                                    ].type == "radio"
                                      ? "0px"
                                      : "12px",
                                }}
                              >
                                <div
                                  className={`closebtn  ${
                                    this.state.email ? "active" : ""
                                  }`}
                                  ref={this.nextButtonRef}
                                  onClick={() => {
                                    if (
                                      this.state.questions[
                                        this.state.currentQuestion
                                      ].value
                                    ) {
                                      if (
                                        this.state.currentQuestion ==
                                        this.state.questions.length - 1
                                      )
                                        this.state.onHide(this.state.questions);
                                      else
                                        this.setState({
                                          currentQuestion:
                                            this.state.currentQuestion + 1,
                                        });
                                    }
                                  }}
                                  type="submit"
                                  style={{
                                    border: "none",
                                    background: "#19191A",
                                    opacity: this.state.questions[
                                      this.state.currentQuestion
                                    ].value
                                      ? "1"
                                      : "0.5",
                                    cursor: this.state.questions[
                                      this.state.currentQuestion
                                    ].value
                                      ? "pointer"
                                      : "disabled",
                                  }}
                                >
                                  <Image
                                    className="closebtnIcon"
                                    src={RightIcons}
                                  />
                                </div>
                              </div>
                            ) : null}
                            {(this.state.questions[this.state.currentQuestion]
                              .type == "radio" &&
                              !this.state.questions[this.state.currentQuestion]
                                .value) ||
                            this.state.questions[this.state.currentQuestion]
                              .type != "radio" ? (
                              <div className="closebtnContainer">
                                <div
                                  className="closebtn"
                                  onClick={() => {
                                    this.state.onHide(this.state.questions);
                                  }}
                                >
                                  <Image
                                    className="closebtnIcon"
                                    src={CloseIcon}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </Form>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Draggable>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //   OnboardingState: state.OnboardingState,
  //   portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  //   fixWalletApi,
  //   getAllCoins,
  //   detectCoin,
  //   getAllParentChains,
  //   setPageFlagDefault,
};

UserFeedbackModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserFeedbackModal);
