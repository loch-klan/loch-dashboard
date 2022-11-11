import React from 'react';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { deleteToken } from '../../utils/ManageToken';
import { loginApi } from './Api';
// import { loginApi } from './Api';

class VerifyEmail extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      forgotPassword: false,
    }
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append('password', this.state.password);
    loginApi(this, data)
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content">
          <h1 className="inter-display-bold f-s-24">Welcome to Loch</h1>
          <p className='inter-display-regular f-s-18 lh-21'>Your email id has been verified</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loginState: state.LoginState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);