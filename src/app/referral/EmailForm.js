import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import Button from "./Button";
import Input from "./Input";
import logo from "../../image/logo_white.svg";
import CaretLeft from "./../../assets/images/icons/caret-left-white.svg"

export default class EmailForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <div className="referral-main-container__mid-box referral-main-container__mid-box--padding-top" style={{position:'relative'}}>
          <Button
        className={'referral-main-container__mid-box__action-holder__cta'}
        style={{
          position:"absolute",
          left:"50px",
          top:"60px",
          height:"40px",
          width:"40px",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          padding:"0", 
        }}
        onClick={()=>this.props.ChangeNextStep(1)}
        >
          <img src={CaretLeft} style={{
            width:"20px",
            height:"20px",
          }} alt="" />
        </Button>
        <img src={logo} alt="" />
        <div className="referral-main-container__mid-box__title-holder">
          <h6 className="referral-main-container__mid-box__title">
          You’re almost in
          </h6>
          <p className="referral-main-container__mid-box__sub-title">
          Verify your email to get started
          </p>
        </div>
        <div className="referral-main-container__mid-box__action-holder">
          <Input
            style={{ width: "320px", height: "100%" }}
            className="referral-main-container__mid-box__action-holder__input"
            placeHolder={"Your email address"}
          />
          <Button
            className={
              "referral-main-container__mid-box__action-holder__cta"
            }
            onClick={()=>this.props.ChangeNextStep(3)}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}
