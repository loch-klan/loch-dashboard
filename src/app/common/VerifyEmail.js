import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { deleteToken } from '../../utils/ManageToken';
import { verifyEmailApi } from './Api';
// import { loginApi } from './Api';

class VerifyEmail extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    this.state = {
      password: "",
      forgotPassword: false,
      token: token ? token : "",
      error: false,
    }
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
    const data = new URLSearchParams();
    data.append('token', this.state.token);
    verifyEmailApi(this, data);
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content" style={{textAlign: "center"}}>
          <h1 className="inter-display-bold f-s-24">Welcome to Loch</h1>
          <p className='inter-display-regular f-s-18 lh-21'>{this.state.error ? "Your token is expired or invalid" : "Your email id has been verified"}</p>
          <br/><br/>
          <Button className='primary-btn' onClick={()=>this.props.history.push('/home')}>Home</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({

});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);