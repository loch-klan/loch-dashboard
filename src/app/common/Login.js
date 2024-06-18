import React from "react";
import { connect } from "react-redux";
import { setLocalStoraage } from "../../utils/ManageToken";
import { BaseReactComponent } from "../../utils/form";
import { GetDefaultPlan, loginApi } from "./Api";
// import { loginApi } from './Api';
import { getDetailsByLinkApi } from "../Portfolio/Api";
import { createAnonymousUserApi, getAllCoins } from "../onboarding/Api";
import Loading from "./Loading";

class Login extends BaseReactComponent {
  constructor(props) {
    super(props);
    let redirect = JSON.parse(window.localStorage.getItem("ShareRedirect"));
    this.state = {
      link: props.location?.state?.from?.pathname || "",
      id: props.location?.state?.params?.id || "",
      // redirectPath:
      //   props.location?.state?.page === "route"
      //     ? redirect.path
      //     : props.location?.state?.params?.redirectPath || "",
      // hash:
      //   props.location?.state?.page === "route"
      //     ? redirect.hash
      //     : props?.location?.state?.params?.hash || "",
      redirectPath: redirect?.path || "",
      hash: redirect?.hash || "",
      password: "",
      podName: props.location?.state?.params?.podName,
      forgotPassword: false,
    };
  }

  componentDidMount() {
    // if (!this.state.hash && !this.state.redirectPath && !redirect) {
    //   this.setState({
    //     redirectPath: this.props.location?.state?.params?.redirectPath || "",
    //     hash: this.props?.location?.state?.params?.hash || "",
    //   });
    //   console.log("test");
    // }
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    // deleteToken();
    // window.localStorage.setItem("defi_access", true);
    // window.localStorage.setItem("isPopup", true);
    // // window.localStorage.setItem("whalepodview", true);
    // window.localStorage.setItem(
    //   "whalepodview",
    //   JSON.stringify({ access: true, id: "" })
    // );
    setLocalStoraage();

    window.localStorage.setItem(
      "currency",
      JSON.stringify({
        active: true,
        code: "USD",
        id: "6399a2d35a10114b677299fe",
        name: "United States Dollar",
        symbol: "$",
        rate: 1,
      })
    );

    let userPlan = JSON.parse(window.localStorage.getItem("currentPlan"));
    if (!userPlan) {
      GetDefaultPlan();
    }

    if (this.state.link && !this.state.podName) {
      // console.log("login in")
      this.props.getAllCoins(this.handleShareLinkUser);
    } else if (this.state.link && this.state.podName) {
      // console.log("cohort name", this.state.cohortName);
      this.props.getAllCoins(this.handleResponse);
    } else {
      // console.log("welcome")
      this.props.history.push("/welcome");
    }
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append("password", this.state.password);
    window.localStorage.setItem("baseToken", this.state.password);
    loginApi(this, data);
  };

  handleShareLinkUser = () => {
    // console.log("handle share");
    // console.log("this",this.state.id)
    this.props.getDetailsByLinkApi(this.state.id, this);
  };

  handleResponse = () => {
    if (this.state.podName) {
      // console.log("podname login create user")
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify([]));
      // data.append("link", this.state.id);
      this.props.createAnonymousUserApi(data, this, [], null);
    } else {
      let addWallet = JSON.parse(window.localStorage.getItem("addWallet"));
      // console.log('Heyyyy',addWallet);
      let walletAddress = [];
      let AddressList = [];
      for (let i = 0; i < addWallet.length; i++) {
        let curr = addWallet[i];
        if (!walletAddress.includes(curr.address) && curr.address) {
          walletAddress.push(curr.address);
          AddressList.push(curr.displayAddress || curr.address);
        }
      }

      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(AddressList));
      data.append("link", this.state.id);
      this.props.createAnonymousUserApi(data, this, addWallet, null);
    }
  };

  render() {
    return (
      // <div className="login-wrapper">
      //   <div className="login-content">
      //     <div className="login-container">
      //       <Image className="beta-icon" src={beta} />
      //       {/* <h1 className="inter-display-bold f-s-24">Login</h1> */}
      //       <Image className="logo-icon" src={logo} />
      //       <p className="login-title inter-display-regular f-s-25 lh-30 black-191">
      //         Welcome to <b>Loch</b>
      //       </p>
      //       <Form onValidSubmit={this.onValidSubmit}>
      //         <FormElement
      //           valueLink={this.linkState(this, "password")}
      //           // label="Password"
      //           required
      //           validations={[
      //             {
      //               validate: FormValidator.isRequired,
      //               message: "Field cannot be empty",
      //             },
      //           ]}
      //           control={{
      //             type: CustomTextControl,
      //             settings: {
      //               placeholder: "Access code",
      //               type: "password",
      //             },
      //           }}
      //         />
      //         <div className="submit-wrapper">
      //           <FormSubmitButton customClass="primary-btn">
      //             Log in
      //           </FormSubmitButton>
      //         </div>
      //       </Form>
      //     </div>
      //     {/* <div className="request-early-access inter-display-regular f-s-16 lh-19">Request early access</div> */}
      //   </div>
      // </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Loading />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.LoginState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getDetailsByLinkApi,
  getAllCoins,
  createAnonymousUserApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
