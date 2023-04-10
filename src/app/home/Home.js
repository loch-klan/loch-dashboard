import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Button, Image } from "react-bootstrap";
import Banner from "../../assets/images/Overlay.png";
import { deleteToken, getToken } from '../../utils/ManageToken';
import { getAllCurrencyRatesApi, GetDefaultPlan, setPageFlagDefault } from '../common/Api';
import UpgradeModal from '../common/upgradeModal';
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import LochIcon from "../../assets/images/icons/loch-icon-white.svg";
import Form from "../../utils/form/Form";
import { DiscountEmailPage, DiscountEmailSkip, EmailAddedDiscount, TimeSpentDiscountEmail, TimeSpentOnboarding } from '../../utils/AnalyticsFunctions';

class Home extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: true,
      upgradeModal: false,
      isStatic: true,
      triggerId: 0,
      selectedId: 0,

      showPrevModal: true,

      showEmailPopup: true,
      emailAdded: false,
      startTime: 0,
    };
  }

  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
      },
      () => {
        let value = this.state.upgradeModal ? false : true;
        this.setState({
          showPrevModal: value,
        });
      }
    );
  };

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    DiscountEmailPage();
    let isEmailadded = JSON.parse(localStorage.getItem("discountEmail"));
    // console.log("is",isEmailadded)
    if (isEmailadded) {
      this.setState({
        emailAdded: true,
        showEmailPopup: false,
      });
    }
    const searchParams = new URLSearchParams(this.props.location.search);
    const planId = searchParams.get("plan_id");
    let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
    if (!currencyRates) {
      getAllCurrencyRatesApi();
    }

    // console.log("test mount home.js");
    if (planId) {
      // console.log("plan id", planId);
      this.setState(
        {
          selectedId: planId,
        },
        () => {
          this.upgradeModal();
        }
      );
    } else {
      if (getToken()) {
        // console.log("move to home");
        let isStopRedirect =
          localStorage.getItem("stop_redirect") &&
          JSON.parse(localStorage.getItem("stop_redirect"));
        if (isStopRedirect) {
          this.props.setPageFlagDefault();
          deleteToken();
        } else {
          this.props.history.push("/home");
        }
      } else {
        this.props.setPageFlagDefault();
        deleteToken();
        // console.log("inside else after derlete token")
        localStorage.setItem("defi_access", true);
        localStorage.setItem("isPopup", true);
        let isRefresh = JSON.parse(localStorage.getItem("refresh"));
        if (!isRefresh) {
          localStorage.setItem("refresh", true);
          window.location.reload(true);
        }
      }
    }

    GetDefaultPlan();
  }


  componentWillUnmount() {
     let endTime = new Date() * 1;
     let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    //  console.log("page Leave", endTime/1000);
    //  console.log("Time Spent", TimeSpent);
    TimeSpentDiscountEmail({ time_spent: TimeSpent });
  }

  hideModal = (value) => {};
  handleSave = () => {

    this.setState({
      emailAdded: true,
    })

    EmailAddedDiscount({email_address:this.state.email});

    setTimeout(() => {
      this.setState({
        showEmailPopup: false,
      });
      localStorage.setItem("discountEmail", true);
    }, 2000);
    
  }
  handleSkip = () => {
    DiscountEmailSkip();
    this.setState({
      showEmailPopup: false,
    });
  }

  render() {
    return (
      <>
        {this.state.showEmailPopup && (
          <div className="discount-email-wrapper">
            <div className="discount-row">
              <div className="img-section">
                <Image src={LochIcon} />
              </div>
              <div className="content-section">
                {!this.state.emailAdded ? (
                  <>
                    <h1 className="inter-display-medium f-s-39 lh-46 grey-B0B m-b-26">
                      Get exclusive discounts to Loch
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
                        Get discount
                      </Button>
                    </Form>

                    <h3
                      className="inter-display-medium f-s-16 lh-19 m-t-40"
                      onClick={this.handleSkip}
                    >
                      No thanks, just let me enter
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
        )}
        {this.state.showPrevModal && (
          <div>
            {!this.state.showEmailPopup && (
              <>
                <Image src={Banner} className="overlay-banner" />
                <OnBoarding {...this.props} hideModal={this.hideModal} />
              </>
            )}
          </div>
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            selectedId={this.state.selectedId}
            signinBack={true}
            form="home"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  homeState: state.HomeState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault
}
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);