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
  LPWhaleTrack,
  LPWhaleTrackPageView,
  TimeSpentDiscountEmail,
  TimeSpentOnboarding,
} from "../../utils/AnalyticsFunctions";
import BellIcon from "../../assets/images/icons/lp-bell.svg";
import EyeIcon from "../../assets/images/icons/lp-eye.svg";
import EmailImage from "../../assets/images/email-whale.svg";
import NotificationImage from "../../assets/images/notification-whale.svg";

import NotificationDormantImage from "../../assets/images/notification-dormant.svg";
import CohortImg from "../../assets/images/cohort.png";
import Slider from "react-slick";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import logo from "../../image/Loch.svg";


class LPWhale extends BaseReactComponent {
  constructor(props) {
    super(props);
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1.3,
      slidesToScroll: 1,
      variableHeight: true,
      // adaptiveHeight:true,
      nextArrow: <Image src={nextIcon} />,
      prevArrow: <Image src={prevIcon} />,
    };
    this.state = {
      settings,
      emailAdded: false,
      startTime: 0,
    };
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    LPWhaleTrackPageView();
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

    // Twitter conversion tracking event code
    // Insert Twitter Event ID
    // twq("event", "tw-oekqq-oekro", {
    //   email_address: this.state.email, // use this to pass a user’s email address
    // });
    // End Twitter conversion tracking event code
   this.trackTwitterConversion(this.state.email);
    LPWhaleTrack({ email_address: this.state.email });
 let data = new URLSearchParams();
    data.append("email", this.state.email);
    data.append("signed_up_from", "landing-page-whale");
    CreateUserLandingPage(data,this, null);
    setTimeout(() => {
      this.props.history.push("/welcome");
    }, 2000);
  };

  trackTwitterConversion = (email) => {
    // console.log("e",email)
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = ` console.log("twq is defined:", typeof twq !== "undefined");
    twq('event', 'tw-oekqq-oekro', {
      email_address: '${email}'
    });`;

    document.body.appendChild(script);
  };
  render() {
    return (
      <>
        <div className="discount-email-wrapper">
          <div className="discount-row black">
            <div className="gradient-section">
              <Image src={LochIcon} className="img-loch" />
              <div className="content-wrap text-center">
                {/* <div className="top-section">
                  <div className="content-wrapper">
                    <Image src={BellIcon} />
                    <h3 className="inter-display-medium f-s-25 lh-28 grey-F2F m-b-10">
                      Get notified when a highly correlated whale makes a move
                    </h3>
                    <p className="inter-display-medium f-s-13 lh-16 grey-F2F">
                      Find out when a certain whale moves more than any preset
                      amount on-chain or when a dormant whale you care about
                      becomes active.
                    </p>
                  </div>
                  <div className="images-section">
                    <div className="marquee-holder">
                      <div className="left-shadow"></div>
                      <div className="right-shadow"></div>
                      <div className="card-wrapper">
                        <div className="marquee-item">
                          <Image src={EmailImage} />
                        </div>
                        <div className="marquee-item">
                          <Image src={NotificationImage} />
                        </div>
                        <div className="marquee-item">
                          <Image src={NotificationDormantImage} />
                        </div>
                      </div>
                      <div className="card-wrapper">
                        <div className="marquee-item">
                          <Image src={EmailImage} />
                        </div>
                        <div className="marquee-item">
                          <Image src={NotificationImage} />
                        </div>
                        <div className="marquee-item">
                          <Image src={NotificationDormantImage} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <Image src={CohortImg} className="cohort-img" />
                <div className="top-section">
                  <div
                    className="content-wrapper text-center"
                    style={{ width: "100%", paddingRight: "5rem" }}
                  >
                    <Image src={EyeIcon} />
                    <h3 className="inter-display-medium f-s-25 lh-28 grey-F2F m-b-10 text-center">
                      🔎 🐋 Track your favorite crypto whales’ trades in
                      real-time
                    </h3>
                    <p className="inter-display-medium f-s-13 lh-16 grey-F2F text-center">
                      Loch allows you to follow specific wallets and track their
                      trades in <br />
                      real-time across all chains. Get notified when relevant
                      whales become <br /> active or start making big trades.
                    </p>
                  </div>
                </div>
                <div
                  className="bottom-section"
                  // style={{ marginTop: "-2.5rem" }}
                >
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
                            // width:
                            //   "47.5rem",
                            marginRight: "2rem",
                            height: "9rem",
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Jack F
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              Ex Blackrock PM
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “Love how Loch integrates portfolio analytics and
                            whale watching into one unified app.”
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>
                      <div>
                        {" "}
                        <div
                          className="review-card"
                          style={{
                            // width: "47.5rem",
                            marginRight: "2rem",
                            height: "9rem",
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Yash P
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              Research, 3poch Crypto Hedge Fund
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “I use Loch everyday now. I don't think I could
                            analyze crypto whale trends markets without it. I'm
                            addicted!”
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>

                      <div>
                        <div
                          className="review-card"
                          style={{
                            // width: "47.5rem",
                            marginRight: "0.5rem",
                            height: "9rem",
                          }}
                        >
                          <div className="heading">
                            <h5 className="inter-display-semi-bold f-s-13 lh-16 black-191 m-r-5">
                              Shiv S
                            </h5>
                            <h5 className="inter-display-medium f-s-12 lh-15 grey-969">
                              Co-Founder Magik Labs
                            </h5>
                          </div>
                          <p className="inter-display-medium f-s-13 lh-16 black-1D2 m-t-12">
                            “Managing my own portfolio is helpful and well
                            designed. What’s really interesting is watching the
                            whales though. No one else has made whale tracking
                            so simple.”
                          </p>
                        </div>
                      </div>
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-section shadow">
              {!this.state.emailAdded ? (
                <>
                  <Image src={logo} className="logo" />
                  <h1 className="inter-display-medium f-s-39 lh-46 m-b-26 text-center">
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
LPWhale.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(LPWhale);
