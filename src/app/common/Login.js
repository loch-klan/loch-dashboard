import React from 'react';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { deleteToken } from '../../utils/ManageToken';
import { loginApi } from './Api';
// import { loginApi } from './Api';
import logo from '../../image/Loch.svg'
import beta from '../../image/BetaIcon.svg'
import { Image } from 'react-bootstrap'
import {getDetailsByLinkApi} from '../Portfolio/Api';
import { createAnonymousUserApi, getAllCoins } from '../onboarding/Api';

class Login extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      link: props.location?.state?.from?.pathname || "",
      id: props.location?.state?.params?.id || "",
      password: "",
      forgotPassword: false,
    }
  }

  componentDidMount() {
    // console.log('this.props',this.props);
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append('password', this.state.password);
    localStorage.setItem("baseToken", this.state.password);
    loginApi(this, data)
  }

  handleShareLinkUser = () =>{
    this.props.getDetailsByLinkApi(this.state.id, this);
  }

  handleResponse = () =>{
    let addWallet = JSON.parse(localStorage.getItem("addWallet"));
    console.log('Heyyyy',addWallet);
    let walletAddress = [];
    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (!walletAddress.includes(curr.address) && curr.address) {
        walletAddress.push(curr.address);
      }
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(walletAddress));
    createAnonymousUserApi(data, this, addWallet);
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-container">

            <Image className="beta-icon" src={beta}/>
            {/* <h1 className="inter-display-bold f-s-24">Login</h1> */}
            <Image className="logo-icon" src={logo}/>
            <p className="login-title inter-display-regular f-s-25 lh-30 black-191">Welcome to <b>Loch</b></p>
            <Form onValidSubmit={this.onValidSubmit}>

              <FormElement
                valueLink={this.linkState(this, "password")}
                // label="Password"
                required
                validations={[
                  {
                    validate: FormValidator.isRequired,
                    message: "Field cannot be empty"
                  }
                ]}
                control={{
                  type: CustomTextControl,
                  settings: {
                    placeholder: "Access code",
                    type: "password"
                  }
                }}
              />
              <div className="submit-wrapper">
                <FormSubmitButton customClass="primary-btn">Log in</FormSubmitButton>
              </div>
            </Form>
          </div>
          {/* <div className="request-early-access inter-display-regular f-s-16 lh-19">Request early access</div> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loginState: state.LoginState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getDetailsByLinkApi,
  getAllCoins,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);