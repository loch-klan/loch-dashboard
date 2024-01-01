import React from "react";
import { connect } from "react-redux";
import { deleteToken } from "../../utils/ManageToken";
import { BaseReactComponent } from "../../utils/form";
import { getAllCoins, getAllParentChains } from "../onboarding/Api";
import { sendWhopCode } from "./Api";
// import { loginApi } from './Api';

class WhopLoader extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("code");
    this.state = {
      password: "",
      forgotPassword: false,
      code: token ? token : "",
      error: false,
      msg: "Signing your account into loch",
    };
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
    this.props.getAllCoins();
    this.props.getAllParentChains();

    const data = new URLSearchParams();
    data.append("code", this.state.code);
    sendWhopCode(this, data);
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content" style={{ textAlign: "center" }}>
          <h1 className="inter-display-bold f-s-24">Welcome to Loch</h1>
          {/* <p className="inter-display-regular f-s-18 lh-21">
            {this.state.error
              ? "Your token is expired or invalid"
              : "Your email has been verified"}
          </p> */}
          <br />
          <br />
          {/* <Button className='primary-btn' onClick={()=>this.props.history.push('/welcome')}>Home</Button> */}
          <div className="upload-loader"></div>
          {/* <h2 className="inter-display-semi-bold f-s-14 lh-16 m-t-20 grey-B0B">
           {this.state.msg}
          </h2> */}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WhopLoader);
