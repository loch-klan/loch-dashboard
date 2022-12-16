import React from 'react';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { Image } from 'react-bootstrap'

class FeedbackForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      favorite: "",
      worst: "",
    }
  }

  componentDidMount() {

  }

  handleInput = (value, type) =>{
    this.setState({
      ...(type === 1 && {favorite: value}),
      ...(type === 2 && {worst: value}),
    })
  }
  handleKeyDown = (e) =>{
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }

  render() {
    return (
      <div className={`feedback-form-wrapper ${this.props.attribution && "attribution"}`}>
{this.props.attribution && <h6 className='inter-display-medium f-s-16 lh-19 grey-ADA data-provided'>Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a></h6>}
        <div className='feedback-wrapper'>
          <input
            value={this.state.favorite}
            type="text"
            name="favorite"
            id="favorite"
            placeholder={"My favorite thing about this page is ..."}
            onChange={(event)=>{this.handleInput(event.target.value, 1)}}
            onKeyDown={(e)=>this.handleKeyDown(e)}
          />
          <input
            value={this.state.worst}
            type="text"
            name="worst"
            id="worst"
            placeholder={"The worst thing about this page is ..."}
            onChange={(event)=>{this.handleInput(event.target.value, 2)}}
            onKeyDown={(e)=>this.handleKeyDown(e)}
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