import React from "react";

import { connect } from "react-redux";
import { deleteToken } from "../../utils/ManageToken";
import { BaseReactComponent } from "../../utils/form";

import Loading from "../common/Loading";
import { getAllCoins, getAllParentChains } from "../onboarding/Api";
import { verifyEmailLinkApi } from "./Api";
// import { loginApi } from './Api';

class VerifySmartMoneyEmailLink extends BaseReactComponent {
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
    };
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
    const data = new URLSearchParams();
    data.append("token", this.state.token);
    verifyEmailLinkApi(this, data);
  }

  render() {
    return (
      // <div className="login-wrapper">
      //   <div className="login-content" style={{ textAlign: "center" }}>
      //     <h1 className="inter-display-bold f-s-24">Welcome to Loch</h1>
      //     <p className="inter-display-regular f-s-18 lh-21">
      //       {this.state.error
      //         ? "Your token is expired or invalid"
      //         : "Your email has been verified"}
      //     </p>
      //     <br />
      //     <br />
      //     {/* <Button className='primary-btn' onClick={()=>this.props.history.push('/welcome')}>Home</Button> */}
      //     <div className="upload-loader"></div>
      //     <h2 className="inter-display-semi-bold f-s-14 lh-16 m-t-20 grey-B0B">
      //       Redirecting you to Loch
      //     </h2>
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
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getAllParentChains,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifySmartMoneyEmailLink);
