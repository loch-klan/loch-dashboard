import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import Button from "./Button";
import Input from "./Input";
import logo from "../../image/logo_white.svg";
import Check from "./../../assets/images/success-referral.svg"
import TwitterIcon from "../../assets/images/icons/twitter-x-white.svg"
import GlobeIcon from "../../assets/images/icons/globe-white.svg"
import { hi } from "date-fns/locale";
import { UserCreditTelegramIcon } from "../../assets/images/icons";
import TelegramIcons from "./../../assets/images/icons/telegram-white.svg"

export default class ThanksBanner extends BaseReactComponent {
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
          <h6 className="referral-main-container__mid-box__title" style={{fontSize:'38px'}}>
          Thanks for signing up
          </h6>
          <p className="referral-main-container__mid-box__sub-title" style={{fontSize:'20px'}}>
          You’ll here from us in less than a week
          </p>
        </div>
        <div className="d-flex justify-content-center">
            <img src={Check} alt="" />
        </div>
        <div className="referral-main-container__mid-box__action-holder" style={{}}>
          <Button
          onClick={()=>{window.open("https://t.me/loch_chain", "_blank");}}
          style={{display:'flex', alignItems:'center', padding:"12px 32px", gap:'8px'}} className={"referral-main-container__mid-box__action-holder__cta"}>

            <img src={TelegramIcons} style={{height:'17px', width:'17px'}} alt="" />
            Join Us
          </Button>
          <Button onClick={()=>{window.open("https://twitter.com/loch_chain", "_blank");}} style={{display:'flex', alignItems:'center', padding:"12px 32px", gap:'8px'}} className={"referral-main-container__mid-box__action-holder__cta"}>
            <img src={TwitterIcon} alt="" />
            Follow us
          </Button>
        </div>
      </div>
    );
  }
}
