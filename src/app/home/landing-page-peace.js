
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
  CreateUserLandingPage,
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
  LPPeaceOfMind,
  LPPeaceOfMindPageView,
  TimeSpentDiscountEmail,
  TimeSpentOnboarding,
} from "../../utils/AnalyticsFunctions";
import DefiIcon from "../../assets/images/icons/lp-defi.svg";

import CohortImg from "../../assets/images/cohort-img.svg";
import InsightVideo from "../../assets/videos/defi-insights.mov"
import Slider from "react-slick";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import logo from "../../image/Loch.svg";

class LPPeace extends BaseReactComponent {
  constructor(props) {
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1.3,
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
      this.videoRef = React.createRef();
  }

  componentDidMount() {
      this.state.startTime = new Date() * 1;
    this.videoRef.current.play();
    LPPeaceOfMindPageView(); 
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

    LPPeaceOfMind({ email_address: this.state.email });
 let data = new URLSearchParams();
 data.append("email", this.state.email);
 data.append("signed_up_from", "landing-page-peace-of-mind");
 CreateUserLandingPage(data, this, null);
    setTimeout(() => {
    //   this.setState({
    //     showEmailPopup: false,
    //   });
    //   localStorage.setItem("discountEmail", true);
        this.props.history.push("/welcome")
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
                <video
                  ref={this.videoRef}
                  src={InsightVideo}
                  autoPlay
                  muted
                  loop
                />
                <div className="top-section">
                  <div className="content-wrapper">
                    <Image src={DefiIcon} />
                    <h3 className="inter-display-medium f-s-25 lh-28 grey-F2F m-b-10">
                      Peace of mind and assurance
                    </h3>
                    <p className="inter-display-medium f-s-13 lh-16 grey-F2F">
                      Loch informs you about token unlocks, risky assets, ponzi
                      schemes, and other degen things you may be exposed to.
                    </p>
                  </div>
                </div>

                <div className="bottom-section">
                  <h3 className="inter-display-medium f-s-22 lh-27 grey-F2F text-right">
                    Testimonials
                  </h3>
                  <hr />

                  <div className="testimonials">
                    <Slider {...this.state.settings}>
                      <div>
                        <div
                          className="review-card"
                          style={{
                            // width: "53rem",
                            marginRight: "2rem"
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Philippe H
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              ex JP Morgan Trading
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “Loch is really well designed. My workflow is super
                            simple now. I can focus on what matters, which is
                            generating returns.”
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>
                      <div>
                        <div
                          className="review-card"
                          style={{
                            // width: "53rem",
                            marginRight: "2rem"
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Anthony O
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              Hedge Fund Investor Peak Life Capital
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “Loch provides an absurd amount of detail on my
                            wallet addresses. It's super easy to use and I can't
                            imagine why no one has built something like this
                            yet. Loch is a winning product. “
                          </p>
                        </div>
                      </div>

                      <div>
                        <div
                          className="review-card"
                          style={{
                            // width: "53rem",
                            marginRight: "0.5rem"
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Pranav N
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              Crypto Fund Manager
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “Loch provides hedge fund level intelligence for the
                            average trader. Totally worth it.”
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
                          style={{ width: "38rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Philippe H
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              ex JP Morgan Trading
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch is really well designed. My workflow is super
                            simple now. I can focus on what matters, which is
                            generating returns.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Anthony O
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Hedge Fund Investor Peak Life Capital
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch provides an absurd amount of detail on my
                            wallet addresses. It's super easy to use and I can't
                            imagine why no one has built something like this
                            yet. Loch is a winning product. “
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "36rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Pranav N
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Fund Manager
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch provides hedge fund level intelligence for the
                            average trader. Totally worth it.”
                          </p>
                        </div>
                      </div>
                      <div className="card-wrapper">
                        <div
                          className="review-card"
                          style={{ width: "38rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Philippe H
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              ex JP Morgan Trading
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch is really well designed. My workflow is super
                            simple now. I can focus on what matters, which is
                            generating returns.”
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "53rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Anthony O
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Hedge Fund Investor Peak Life Capital
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch provides an absurd amount of detail on my
                            wallet addresses. It's super easy to use and I can't
                            imagine why no one has built something like this
                            yet. Loch is a winning product. “
                          </p>
                        </div>

                        <div
                          className="review-card"
                          style={{ width: "36rem", marginRight: "2rem" }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-16 lh-19 black-191 m-r-5">
                              Pranav N
                            </h5>
                            <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                              Crypto Fund Manager
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-16 lh-19 black-1D2 m-t-20">
                            “Loch provides hedge fund level intelligence for the
                            average trader. Totally worth it.”
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
                  <Image src={logo} className="logo"/>
                  <h1 className="inter-display-medium f-s-39 lh-46 m-b-26">
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
                  <h4
                    className="inter-display-medium f-s-13 lh-15 m-t-40 text-center"
                    // onClick={this.handleSkip}
                  >
                    You’ll receive an email with an invitation link to join.
                  </h4>
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
LPPeace.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(LPPeace);
