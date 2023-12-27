import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent, CustomButton } from "../../utils/form";
import "./../../assets/scss/referral/_referral.scss";
import { ReferralBackground } from "../../assets/images";
import logo from "../../image/logo_white.svg";
import Button from "./Button";
import Input from "./Input";
import ReferralForm from "./ReferralForm";
import EmailForm from "./EmailForm";
import WaitList from "./WaitList";
import VerifyEmail from "./VerifyEmail";

export default class Referral extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      referralCode: "",
      step:1
    };
}
ChangeNextStep = (ss) =>{
    this.setState({
        step:ss?ss:this.state.step+1
    })
}

  render() {
    return (
      <div className="referral-main-container">
        <img
          src={ReferralBackground}
          className="referral-main-container__bg"
          alt=""
        />
        <div className="referral-main-container__content">
            {
                this.state.step === 1 ?
                <ReferralForm  ChangeNextStep={this.ChangeNextStep}/>
                :
                this.state.step === 2 ?
                <EmailForm ChangeNextStep={this.ChangeNextStep}/>
                :
                this.state.step === 3 ?
                <VerifyEmail ChangeNextStep={this.ChangeNextStep}/>
                :
                this.state.step === 6 ?
                <WaitList ChangeNextStep={this.ChangeNextStep}/>
                :
                <div>
                    {this.state.step}
                </div>

            }
        </div>
      </div>
    );
  }
}
