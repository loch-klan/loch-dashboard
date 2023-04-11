
import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Button, Image } from "react-bootstrap";
import Banner from "../../assets/images/Overlay.png";
import { deleteToken, getToken } from "../../utils/ManageToken";
import {
  getAllCurrencyRatesApi,
  GetDefaultPlan,
  setPageFlagDefault,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import LochIcon from "../../assets/images/icons/loch-icon-white.svg";
import Form from "../../utils/form/Form";
import {
  DiscountEmailPage,
  DiscountEmailSkip,
  EmailAddedDiscount,
  LPIntelligenceTrack,
  LPWhale,
  TimeSpentDiscountEmail,
  TimeSpentOnboarding,
} from "../../utils/AnalyticsFunctions";
import InsightIcon from "../../assets/images/icons/lp-insight.svg";

import OverviewImg from "../../assets/images/lp-overview.svg";
import Slider from "react-slick";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";

class LPIntelligence extends BaseReactComponent {
  constructor(props) {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1.4,
      slidesToScroll: 1,
      nextArrow: <Image src={nextIcon} />,
      prevArrow: <Image src={prevIcon} />,
    };
    super(props);
    this.state = {
      settings,
      emailAdded: false,
      startTime: 0,
    };
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    //  console.log("page Leave", endTime/1000);
    //  console.log("Time Spent", TimeSpent);
    TimeSpentDiscountEmail({ time_spent: TimeSpent });
  }

  handleSave = () => {
    this.setState({
      emailAdded: true,
    });

    LPIntelligenceTrack({ email_address: this.state.email });

    setTimeout(() => {
     this.props.history.push("/welcome");
    }, 2000);
  };

  render() {
    return (
      <>
        <div className="discount-email-wrapper">
          <div className="discount-row black">
            <div className="gradient-section">
              <Image src={LochIcon} className="img-loch" />
              <div className="content-wrap text-center">
                <Image src={OverviewImg} className="overview-img" />
                <div className="top-section">
                  <div
                    className="content-wrapper text-center"
                    style={{ width: "100%", paddingRight: "5rem" }}
                  >
                    <Image src={InsightIcon} />
                    <h3 className="inter-display-medium f-s-28 lh-34 grey-F2F m-b-16 text-center">
                      Receive real time <br />
                      intelligence
                    </h3>
                    <p className="inter-display-medium f-s-13 lh-16 grey-F2F text-center">
                      Loch algorithmically generates insights to mitigate
                      <br />
                      transaction costs, reduce risk, and increase yield.
                    </p>
                  </div>
                </div>

                <div className="bottom-section">
                  <h3 className="inter-display-medium f-s-22 lh-27 grey-F2F m-b-16 text-right">
                    Testimonials
                  </h3>
                  <hr />

                  <div className="testimonials">
                    <Slider {...this.state.settings}>
                      <div>
                        {" "}
                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Dillon L
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch has allowed me to condense my portfolio
                            management into one singular app. Great UI and
                            onboarding.”
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>

                      <div>
                        {" "}
                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Chris B
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “The onboarding is really fast and simple. I was
                            able to get started in literally 5 seconds. I like
                            that I can see my asset distribution across multiple
                            wallets. No one else supports that.”
                          </p>
                        </div>
                      </div>

                      <div>
                        {" "}
                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Jain N
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Founder of Navana Tech
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “This is sick. I have multiple wallets and managing
                            my entire portfolio is painful. Loch makes it super
                            simple.”
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>
                    </Slider>
                    {/* <div className="marquee-holder">
                      <div className="card-wrapper">
                        <div
                          className="review-card"
                          style={{ width: "35rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Dillon L
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch has allowed me to condense my portfolio
                            management into one singular app. Great UI and
                            onboarding.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Chris B
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “The onboarding is really fast and simple. I was
                            able to get started in literally 5 seconds. I like
                            that I can see my asset distribution across multiple
                            wallets. No one else supports that.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "35rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Jain N
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Founder of Navana Tech
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “This is sick. I have multiple wallets and managing
                            my entire portfolio is painful. Loch makes it super
                            simple.”
                          </p>
                        </div>
                      </div>
                      <div className="card-wrapper">
                        <div
                          className="review-card"
                          style={{ width: "35rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Dillon L
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch has allowed me to condense my portfolio
                            management into one singular app. Great UI and
                            onboarding.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Chris B
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Protocol Founder
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “The onboarding is really fast and simple. I was
                            able to get started in literally 5 seconds. I like
                            that I can see my asset distribution across multiple
                            wallets. No one else supports that.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "35rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Jain N
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Founder of Navana Tech
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “This is sick. I have multiple wallets and managing
                            my entire portfolio is painful. Loch makes it super
                            simple.”
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="content-section shadow">
              {!this.state.emailAdded ? (
                <>
                  <h1 className="inter-display-medium f-s-39 lh-46 grey-B0B m-b-26">
                    Sign up for exclusive access.
                  </h1>
                  <Form onValidSubmit={this.handleSave}>
                    <FormElement
                      valueLink={this.linkState(this, "email")}
                      // label="Email Info"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "",
                        },
                        {
                          validate: FormValidator.isEmail,
                          message: "Enter valid email",
                        },
                        // {
                        //     validate: () => {
                        //       console.log("state", this.state.isOptInValid);
                        //        return !this.state.isOptInValid;
                        //   },
                        //     message:"invalid verification code"
                        // }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Your email address",
                        },
                      }}
                      // className={"is-valid"}
                    />
                    <Button
                      className={`primary-btn inter-display-semi-bold f-s-16 lh-19`}
                      type="submit"
                    >
                      Get started
                    </Button>
                  </Form>
                  <h3
                    className="inter-display-medium f-s-15 lh-19 m-t-40 text-center"
                    // onClick={this.handleSkip}
                  >
                    You’ll receive an email with an invite link to join.
                  </h3>
                </>
              ) : (
                <>
                  <h1 className="inter-display-medium f-s-26 lh-30 m-b-26">
                    Great! <br />
                    You’ll hear from us very soon!
                  </h1>
                  <div className="upload-loader"></div>
                  <h2 className="inter-display-semi-bold f-s-14 lh-16 m-t-20 grey-B0B">
                    Directing you to Loch
                  </h2>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  homeState: state.HomeState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
};
LPIntelligence.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(LPIntelligence);
