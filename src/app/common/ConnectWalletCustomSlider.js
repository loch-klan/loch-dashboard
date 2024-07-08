import React, { Component } from "react";
import { connect } from "react-redux";
import {
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons";
import { Image } from "react-bootstrap";
import { mobileCheck } from "../../utils/ReusableFunctions";

class ConnectWalletCustomSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLeftArrowDisabled: true,
      isRightArrowDisabled: false,
      currentCirclePosition: 0,
    };
  }

  handleScroll = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      var myElementWidth = document.getElementById(
        "connectWalletSliderBody"
      )?.clientWidth;
      var newPos = document.getElementById(
        "connectWalletSliderBody"
      )?.scrollLeft;
      let currentCirPos = 0;
      if (mobileCheck()) {
        currentCirPos = newPos / myElementWidth;
      } else {
        let totalWidthYet = 0;
        for (let index = 0; index <= this.props.totalElements - 1; index++) {
          const currElementWidth = document.getElementById(
            `connectWalletSliderAccountNumber${index + 1}`
          )?.clientWidth;
          if (totalWidthYet - 20 <= newPos && totalWidthYet + 20 >= newPos) {
            currentCirPos = index;
            break;
          }

          totalWidthYet = totalWidthYet + currElementWidth + 10;
        }
      }
      this.setState({
        currentCirclePosition: currentCirPos,
        shadowDisablePopularArrows: false,
      });
      if (currentCirPos === 0) {
        this.setState({
          isLeftArrowDisabled: true,
          isRightArrowDisabled: false,
        });
      } else if (currentCirPos === this.props.totalElements - 1) {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: true,
        });
      } else {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: false,
        });
      }
    }, 150);
  };

  scrollLeftFun = () => {
    if (
      this.state.isLeftArrowDisabled ||
      this.state.shadowDisablePopularArrows
    ) {
      return;
    }
    this.setState({
      shadowDisablePopularArrows: true,
    });
    var myElement = document.getElementById("connectWalletSliderBody");
    var myElementWidth = document.getElementById(
      "connectWalletSliderBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "connectWalletSliderBody"
    )?.scrollLeft;

    let newPos = 0;
    if (mobileCheck()) {
      newPos = myElementCurrentScrollPos + myElementWidth;
    } else {
      let tempPositionHolder = this.state.currentCirclePosition;
      const nextBlock = document.getElementById(
        `connectWalletSliderAccountNumber${tempPositionHolder + 1}`
      )?.clientWidth;

      newPos = myElementCurrentScrollPos - nextBlock;
    }
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = this.state.currentCirclePosition;
    if (currentCirPos - 1 === 0) {
      this.setState({
        isLeftArrowDisabled: true,
        isRightArrowDisabled: false,
      });
    } else {
      this.setState({
        isLeftArrowDisabled: false,
        isRightArrowDisabled: false,
      });
    }
    if (currentCirPos >= 0 && currentCirPos <= this.props.totalElements - 1) {
      this.setState({
        myElementCurrentScrollPos: currentCirPos - 1,
      });
    }
  };
  scrollRightFun = () => {
    if (
      this.state.isRightArrowDisabled ||
      this.state.shadowDisablePopularArrows
    ) {
      return;
    }
    this.setState({
      shadowDisablePopularArrows: true,
    });
    var myElement = document.getElementById("connectWalletSliderBody");
    var myElementWidth = document.getElementById(
      "connectWalletSliderBody"
    )?.clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "connectWalletSliderBody"
    )?.scrollLeft;

    let newPos = 0;
    if (mobileCheck()) {
      newPos = myElementCurrentScrollPos + myElementWidth;
    } else {
      let tempPositionHolder = this.state.currentCirclePosition;
      const nextBlock = document.getElementById(
        `connectWalletSliderAccountNumber${tempPositionHolder + 1}`
      )?.clientWidth;

      newPos = myElementCurrentScrollPos + nextBlock;
    }
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    let currentCirPos = this.state.currentCirclePosition;
    if (currentCirPos + 1 === this.props.totalElements - 1) {
      this.setState({
        isLeftArrowDisabled: false,
        isRightArrowDisabled: true,
      });
    } else {
      this.setState({
        isLeftArrowDisabled: false,
        isRightArrowDisabled: false,
      });
    }
    if (currentCirPos >= 0 && currentCirPos <= this.props.totalElements - 1) {
      this.setState({
        myElementCurrentScrollPos: currentCirPos + 1,
      });
    }
  };
  render() {
    return (
      <div className="connect-modal-steps-scroll-container">
        <div
          id="connectWalletSliderBody"
          className="connect-modal-steps-scroll-item"
          onScroll={this.handleScroll}
        >
          {this.props.children}
        </div>
        <div className="connect-modal-steps-scroll-navigator">
          <Image
            onClick={this.scrollLeftFun}
            className={`connect-modal-steps-scroll-arrow ${
              this.state.isLeftArrowDisabled
                ? "connect-modal-steps-scroll-arrow-disabled"
                : ""
            }`}
            src={UserCreditScrollLeftArrowIcon}
          />
          <Image
            onClick={this.scrollRightFun}
            className={`connect-modal-steps-scroll-arrow ${
              this.state.isRightArrowDisabled
                ? "connect-modal-steps-scroll-arrow-disabled"
                : ""
            }`}
            src={UserCreditScrollRightArrowIcon}
          />
        </div>
      </div>
    );
  }
}

ConnectWalletCustomSlider.defaultProps = {};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectWalletCustomSlider);
