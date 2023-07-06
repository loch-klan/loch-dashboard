import React, { createRef } from "react";
import { connect } from "react-redux";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormSubmitButton,
  FormValidator,
} from "../../utils/form";
import { Image } from "react-bootstrap";
import { FeedbackType } from "../../utils/Constant";
import { sendFeedbackApi } from "./Api";
import downGrey from "../../assets/images/icons/thumbs-down-grey.svg";
import upGrey from "../../assets/images/icons/thumbs-up-grey.svg";
import downBlack from "../../assets/images/icons/thumbs-down-black.svg";
import upBlack from "../../assets/images/icons/thumbs-up-black.svg";
import FeedbackModal from "./FeedbackModal";

class FeedbackForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      favorite: "",
      worst: "",
      disabled: false,
      disabledFav: false,
      showFeedbackModal: false,
      type: "",
    };
  }

  componentDidMount() {}

  handleInput = (value, type) => {
    this.setState({
      ...(type === FeedbackType.POSITIVE && { favorite: value }),
      ...(type === FeedbackType.NEGATIVE && { worst: value }),
    });
  };
  handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      // console.log('do validate');
      this.setState({
        ...(type === FeedbackType.POSITIVE
          ? { disabledFav: true }
          : { disabled: true }),
      });
      let data = new URLSearchParams();
      data.append("page", this.props.page);
      data.append("feedback_type", type);
      data.append(
        "feedback",
        type === FeedbackType.POSITIVE ? this.state.favorite : this.state.worst
      );
      sendFeedbackApi(data, this, type);
    }
  };

  handleFeedback = (type = "") => {
    this.setState({
      type,
      showFeedbackModal: !this.state.showFeedbackModal,
    });
  };

  render() {
    // return (
    {
      /* <div className={`feedback-form-wrapper ${this.props.attribution && "attribution"}`}>
{this.props.attribution && <h6 className='inter-display-medium f-s-13 lh-19 grey-CAC data-provided'>Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a></h6>}
        <div className='feedback-wrapper'>
          <input
            value={this.state.favorite}
            type="text"
            name="favorite"
            id="favorite"
            placeholder={"My favorite thing about this page is ..."}
            autoComplete="off"
            onChange={(event)=>{this.handleInput(event.target.value, FeedbackType.POSITIVE)}}
            disabled={this.state.disabledFav? "disabled":""}
            onKeyDown={(e)=>this.handleKeyDown(e, FeedbackType.POSITIVE)}
          />
          <input
            value={this.state.worst}
            type="text"
            name="worst"
            id="worst"
            autoComplete="off"
            placeholder={"The worst thing about this page is ..."}
            disabled={this.state.disabled? "disabled":""}
            onChange={(event)=>{this.handleInput(event.target.value, FeedbackType.NEGATIVE)}}
            onKeyDown={(e)=>this.handleKeyDown(e, FeedbackType.NEGATIVE)}
          />
        </div>
      </div> */
    }
    // )
    return (
      <div className="feedback-div">
        {this.state.showFeedbackModal && (
          <FeedbackModal
            feedbackType={this.state.type}
            show={this.state.showFeedbackModal}
            onHide={this.handleFeedback}
            page={this.props.page}
          />
        )}
        <div className="left">
          <h3 className="inter-display-medium f-s-13 lh-16 grey-7C7">
            Let us know how we did, <br /> and help to improve our product :)
          </h3>
        </div>
        <div className="right">
          <span
            className="left-side"
            onMouseOver={(e) => (e.currentTarget.children[0].src = downBlack)}
            onMouseLeave={(e) => (e.currentTarget.children[0].src = downGrey)}
          >
            <Image
              src={downGrey}
              className="icons"
              onClick={() => this.handleFeedback(FeedbackType.NEGATIVE)}
            />
          </span>
          <span
            className="right-side"
            onMouseOver={(e) => (e.currentTarget.children[0].src = upBlack)}
            onMouseLeave={(e) => (e.currentTarget.children[0].src = upGrey)}
          >
            <Image
              src={upGrey}
              className="icons"
              onClick={() => this.handleFeedback(FeedbackType.POSITIVE)}
            />
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackForm);
