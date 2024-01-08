import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import Button from "./Button";
import Input from "./Input";
import logo from "../../image/logo_white.svg";

export default class ReferralForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <div className="referral-main-container__mid-box">
        <img src={logo} alt="" />
        <div className="referral-main-container__mid-box__title-holder">
          <h6 className="referral-main-container__mid-box__title">
            Lazy Analyst's Guide <br />
            to Mastering Crypto Returns
          </h6>
          <p className="referral-main-container__mid-box__sub-title">
          Get early access now
          </p>
        </div>
        <div className="referral-main-container__mid-box__action-holder">
          <Input
            style={{ width: "320px", height: "100%" }}
            className="referral-main-container__mid-box__action-holder__input"
            placeHolder={'Enter referral code'}
          />
          <Button
            className={
              "referral-main-container__mid-box__action-holder__cta"
            }
            onClick={()=>this.props.ChangeNextStep(2)}
          >
            Get Started
          </Button>
        </div>
        <div className="referral-main-container__mid-box__last-cta">
          <div className="referral-main-container__mid-box__last-cta--pointer" onClick={()=>this.props.ChangeNextStep(6)}>
            No referral code?
          </div>
        </div>
      </div>
    );
  }
}
