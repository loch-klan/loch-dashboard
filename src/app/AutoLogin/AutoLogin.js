import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../common/Loading.js";
import { deleteToken } from "../../utils/ManageToken.js";
import { autoLoginApi } from "./AutoLoginApi.js";
import { setPageFlagDefault } from "../common/Api.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";

class AppFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }
  componentDidMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    let passedToken = "";
    let redirectTo = "";
    if (params.get("token")) {
      passedToken = params.get("token");
    }
    if (params.get("redirect")) {
      redirectTo = params.get("redirect");
    }

    if (passedToken) {
      deleteToken();
      setTimeout(() => {
        // My Token
        // window.localStorage.setItem(
        //   "lochToken",
        //   "117794e1-37fa-42aa-ad18-639474d4356c"
        // );

        // Sumanyas Token
        // window.localStorage.setItem(
        //   "lochToken",
        //   "14bc68be-826d-4871-b6b2-fc95f278a39d"
        // );
        window.localStorage.setItem("lochToken", passedToken);
        setTimeout(() => {
          this.props.autoLoginApi(this, redirectTo);
        }, 300);
      }, 300);
    } else {
      this.props.history.push("/welcome");
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          zIndex: 999,
          zoom: this.state.isMobile ? "" : "1.176",
        }}
      >
        <Loading />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  autoLoginApi,
  setPageFlagDefault,
};
AppFeature.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppFeature);
