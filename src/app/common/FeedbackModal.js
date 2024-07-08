import React from "react";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import starIconActive from "../../assets/images/icons/star-active.svg";
import starIcon from "../../assets/images/icons/star.svg";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "./../../utils/form";
import { sendFeedbackApi } from "./Api";
import DropDown from "./DropDown";
import { mobileCheck } from "../../utils/ReusableFunctions";

class FeedbackModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      feedback: "",
      page: "Select Section",
      hoverStar: 0,
      starSelected: 0,
    };
  }

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  starClicked = (number) => {
    this.setState({
      starSelected: number,
    });
  };
  handleSubmit = () => {
    // console.log("values", this.state.page, this.state.starSelected, this.state.feedback)g
    if (
      this.state.page !== "Select Section" &&
      this.starSelected != 0 &&
      this.state.feedback != ""
    ) {
      let data = new URLSearchParams();
      data.append("page", this.state.page);
      data.append("rating", this.state.starSelected);
      data.append("feedback", this.state.feedback);
      sendFeedbackApi(data, this);
    }
  };

  handleDropdown = (e) => {
    const second = e?.split(" ")[2] != "undefined" ? e.split(" ")[2] : "";
    const title = e.split(" ")[1] + " " + second;
    // console.log(e, "title",title);
    this.setState({
      page: title,
    });
  };

  render() {
    const { feedbackType, show, onHide } = this.props;
    return (
      <Modal
        show={show}
        className={`exit-overlay-form ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        onHide={onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal feedback-modal"}
        centered
        animation={true}
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          <div className="closebtn" onClick={onHide}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <h6 className="inter-display-medium f-s-24 lh-30 m-b-8 black-191">
            Your feedback is invaluable to us.
          </h6>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "2.2rem 0rem 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // columnGap: "1.2rem",
              }}
              onMouseLeave={() => {
                this.setState({
                  hoverStar: 0,
                });
              }}
            >
              <Image
                src={
                  this.state.hoverStar >= 1 || this.state.starSelected >= 1
                    ? starIconActive
                    : starIcon
                }
                onMouseEnter={() => {
                  this.setState({
                    hoverStar: 1,
                  });
                }}
                onClick={() => this.starClicked(1)}
                className="cp m-r-12"
              />
              <Image
                src={
                  this.state.hoverStar >= 2 || this.state.starSelected >= 2
                    ? starIconActive
                    : starIcon
                }
                onMouseEnter={() => {
                  this.setState({
                    hoverStar: 2,
                  });
                }}
                onClick={() => this.starClicked(2)}
                className="cp  m-r-12"
              />
              <Image
                src={
                  this.state.hoverStar >= 3 || this.state.starSelected >= 3
                    ? starIconActive
                    : starIcon
                }
                onMouseEnter={() => {
                  this.setState({
                    hoverStar: 3,
                  });
                }}
                onClick={() => this.starClicked(3)}
                className="cp  m-r-12"
              />
              <Image
                src={
                  this.state.hoverStar >= 4 || this.state.starSelected >= 4
                    ? starIconActive
                    : starIcon
                }
                onMouseEnter={() => {
                  this.setState({
                    hoverStar: 4,
                  });
                }}
                onClick={() => this.starClicked(4)}
                className="cp  m-r-12"
              />
              <Image
                src={
                  this.state.hoverStar >= 5 || this.state.starSelected >= 5
                    ? starIconActive
                    : starIcon
                }
                onMouseEnter={() => {
                  this.setState({
                    hoverStar: 5,
                  });
                }}
                onClick={() => this.starClicked(5)}
                className="cp"
              />
            </div>
          </div>

          {/* {this.state.hoverStar === 0 && this.state.starSelected === 0 ? (
            <p className="inter-display-medium f-s-16 lh-19 grey-969 m-b-63">
              Rate our platform with the stars
            </p>
          ) : (
            ""
          )} */}

          <p
            className="inter-display-medium f-s-16 lh-19 m-b-63"
            style={{ height: "20px" }}
          >
            {this.state.hoverStar === 5 || this.state.starSelected === 5
              ? "It was excellent"
              : this.state.hoverStar === 4 || this.state.starSelected === 4
              ? "It was good"
              : this.state.hoverStar === 3 || this.state.starSelected === 3
              ? "It was alright"
              : this.state.hoverStar === 2 || this.state.starSelected === 2
              ? "It was bad"
              : this.state.hoverStar === 1 || this.state.starSelected === 1
              ? "It was terrible"
              : " "}
          </p>

          <Form>
            <Row>
              <Col md={4}>
                {/* <h3
                  className="inter-display-medium f-s-12 "
                  styele={{ color: "#313233" }}
                >
                  Area
                </h3> */}
                <DropDown
                  class="feedback-dropdown"
                  list={[
                    "Overview",
                    "Balance Sheet",
                    "Asset Value",
                    "Net Flows",
                    "Transaction History",
                    "Counterparty Volume",
                    "Insights",
                    "Wallets",
                    "Blockchain Fees",
                    "Profile",
                    "Export Data",
                  ]}
                  onSelect={this.handleDropdown}
                  title={this.state.page}
                  activetab={this.state.page}
                />
              </Col>
              <Col md={8}>
                <FormElement
                  valueLink={this.linkState(this, "feedback")}
                  // label="Feedback"
                  control={{
                    type: CustomTextControl,

                    settings: {
                      placeholder:
                        "Please enter any feedback or requests here.",
                      as: "textarea",
                      rows: 4,
                    },
                  }}
                  classes={{
                    inputField: this.state.feedback !== "" ? "done" : "",
                  }}
                />
              </Col>
            </Row>

            <div className="button-wrapper">
              <Button className="secondary-btn" onClick={onHide}>
                Cancel
              </Button>
              <Button className="primary-btn" onClick={this.handleSubmit}>
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};
FeedbackModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);
