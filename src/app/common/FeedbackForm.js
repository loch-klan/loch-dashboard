import React, { createRef } from 'react';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { Image } from 'react-bootstrap'
import { FeedbackType } from '../../utils/Constant';
import { sendFeedbackApi } from './Api';

class FeedbackForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      favorite: "",
      worst: "",
      disabled: false,
    }
  }

  componentDidMount() {

  }

  handleInput = (value, type) =>{
    this.setState({
      ...(type === FeedbackType.POSITIVE && {favorite: value}),
      ...(type === FeedbackType.NEGATIVE && {worst: value}),
    })
  }
  handleKeyDown = (e, type) =>{
    if (e.key === 'Enter') {
      console.log('do validate');
      this.setState({disabled:true})
      let data = new URLSearchParams();
      data.append("page", this.props.page)
      data.append("feedback_type", type)
      data.append("feedback", type === FeedbackType.POSITIVE ? this.state.favorite : this.state.worst)
      sendFeedbackApi(data, this, type);
    }
  }

  render() {
    return (
      <div className={`feedback-form-wrapper ${this.props.attribution && "attribution"}`}>
{this.props.attribution && <h6 className='inter-display-medium f-s-13 lh-19 grey-CAC data-provided'>Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a></h6>}
        <div className='feedback-wrapper'>
          <input
            value={this.state.favorite}
            type="text"
            name="favorite"
            id="favorite"
            placeholder={"My favorite thing about this page is ..."}
            autocomplete="off"
            onChange={(event)=>{this.handleInput(event.target.value, FeedbackType.POSITIVE)}}
            disabled={this.state.disabled? "disabled":""}
            onKeyDown={(e)=>this.handleKeyDown(e, FeedbackType.POSITIVE)}
          />
          <input
            value={this.state.worst}
            type="text"
            name="worst"
            id="worst"
            autocomplete="off"
            placeholder={"The worst thing about this page is ..."}
            disabled={this.state.disabled? "disabled":""}
            onChange={(event)=>{this.handleInput(event.target.value, FeedbackType.NEGATIVE)}}
            onKeyDown={(e)=>this.handleKeyDown(e, FeedbackType.NEGATIVE)}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({

});
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackForm);