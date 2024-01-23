import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import Button from "./Button";
import Input from "./Input";
import logo from "../../image/logo_white.svg";
import CaretLeft from "./../../assets/images/icons/caret-left-white.svg"

export default class VerifyEmail extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
      disable: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  

  handleChange(value1, event) {
    this.setState({ [value1]: event.target.value });
  }

  inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      console.log("next");

      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  handleSubmit(event) {
      event.preventDefault();
      this.props.ChangeNextStep(4)
    // console.log(this.state);
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
        onClick={()=>this.props.ChangeNextStep(2)}
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
            Enter the code sent to your email
          </p>
        </div>
        <form action="" onSubmit={this.handleSubmit}>
          <div
            className="referral-main-container__mid-box__action-holder"
            style={{ flexDirection: "column" }}
          >
            <div
              className="d-flex"
              style={{ gap: "8px", justifyContent: "center" }}
            >
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="1"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp1}
                onChange={(e) => this.handleChange("otp1", e)}
              />
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="2"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp2}
                onChange={(e) => this.handleChange("otp2", e)}
              />
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="3"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp3}
                onChange={(e) => this.handleChange("otp3", e)}
              />
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="4"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp4}
                onChange={(e) => this.handleChange("otp4", e)}
              />
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="5"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp5}
                onChange={(e) => this.handleChange("otp5", e)}
              />
              <Input
                style={{ width: "52px", height: "60px", textAlign: "center" }}
                className="referral-main-container__mid-box__action-holder__input"
                placeHolder={""}
                tabIndex="6"
                maxLength="1"
                onKeyUp={(e) => this.inputfocus(e)}
                value={this.state.otp6}
                onChange={(e) => this.handleChange("otp6", e)}
              />
            </div>
            <Button
              style={{ width: "100%" }}
              type={"submit"}
              className={"referral-main-container__mid-box__action-holder__cta"}
              onClick={this.handleSubmit}
            >
              Verify
            </Button>
            <div className="referral-main-container__mid-box__last-cta">
              <div className="referral-main-container__mid-box__last-cta--pointer">
                Send code again
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
