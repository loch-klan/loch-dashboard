import React from "react";

import { connect } from "react-redux";
import backIcon from "../../../assets/images/icons/Icon-back.svg";
import { BaseReactComponent, CustomButton } from "../../../utils/form/index.js";

import { Image } from "react-bootstrap";

import { CrossSmartMoneyIcon } from "../../../assets/images/icons/index.js";

class smartMoneyAddressAddedBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      CrossSmartMoneyIconLoaded: false,
      backIconLoaded: false,
      imageIconLoaded: false,
    };
  }

  render() {
    return (
      <>
        <div className="msmpModalClosebtnContainer">
          <div
            className="back-icon"
            style={{
              opacity: 0,
            }}
          >
            <Image
              className="cp"
              src={backIcon}
              onLoad={() => {
                this.setState({
                  backIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.backIconLoaded ? 1 : 0,
              }}
            />
          </div>
          <div className="msmpModalClosebtn" onClick={this.props.onHide}>
            <Image
              src={CrossSmartMoneyIcon}
              onLoad={() => {
                this.setState({
                  CrossSmartMoneyIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.CrossSmartMoneyIconLoaded ? 1 : 0,
              }}
            />
          </div>
        </div>
        <div
          className={
            this.props.heading === "Congratulations"
              ? "msmpModalMainIconDirectImage"
              : "msmpModalMainIconWhiteContainer"
          }
        >
          <Image
            src={this.props.imageIcon}
            onLoad={() => {
              this.setState({
                imageIconLoaded: true,
              });
            }}
            style={{
              opacity: this.state.imageIconLoaded ? 1 : 0,
            }}
          />
        </div>
        <div
          className={`msmpModalTexts ${
            this.props.heading === "Congratulations" ? "msmpModalTextsCong" : ""
          }`}
        >
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-10">
            {this.props.heading}
          </h6>
          <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
            {this.props.descriptionOne}
          </p>
        </div>
        <div
          className={`msmModalBtnContainer m-t-24 ${
            this.props.heading === "Congratulations"
              ? "msmModalBtnContainerCong"
              : ""
          }`}
        >
          <CustomButton
            className="inter-display-regular f-s-15 lh-20 msmModalBtn"
            type="submit"
            handleClick={this.props.btnClick}
            buttonText={this.props.btnText}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

smartMoneyAddressAddedBlock.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(smartMoneyAddressAddedBlock);
