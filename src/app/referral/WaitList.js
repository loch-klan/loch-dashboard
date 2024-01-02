import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import Button from "./Button";
import Input from "./Input";
import logo from "../../image/logo_white.svg";
import CaretLeft from "./../../assets/images/icons/caret-left-white.svg"

export default class WaitList extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <div className="referral-main-container__mid-box" style={{position:'relative'}}>
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
          Get on the waitlist now
          </h6>
          <p className="referral-main-container__mid-box__sub-title">
          And get access in no time
          </p>
        </div>
        <div className="referral-main-container__mid-box__action-holder" style={{flexDirection:'column', width:'400px'}}>
          <Input
            style={{ width:'100%'}}
            className="referral-main-container__mid-box__action-holder__input"
            placeHolder={'Your email'}
          />
          <Button
            style={{ width:'100%'}}
            className={
              "referral-main-container__mid-box__action-holder__cta"
            }
            onClick={()=>this.props.ChangeNextStep(4)}
          >
            Join Waitlist
          </Button>
        <div className="referral-main-container__mid-box__last-cta">
          <div className="referral-main-container__mid-box__last-cta--pointer" onClick={()=>this.props.ChangeNextStep(1)}>
            Have a referral code?
          </div>
        </div>
        </div>
      </div>
    );
  }
}
