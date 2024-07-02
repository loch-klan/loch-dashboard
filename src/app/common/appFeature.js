import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../common/Loading";
import {
  AppFeaturesCreateUser,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api.js";

import { deleteToken } from "../../utils/ManageToken.js";
import { GetDefaultPlan } from "../common/Api";
import { mobileCheck } from "../../utils/ReusableFunctions.js";

class AppFeature extends Component {
  constructor(props) {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const PageName = params.get("redirect");
    super(props);
    this.state = {
      currency: JSON.parse(window.localStorage.getItem("currency")),
      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
      PageName: PageName ? PageName : "",
      isMobile: mobileCheck(),
    };
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();

    this.props.getAllCoins(this.handleResponse);
    this.props.getAllParentChains();

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

    // this.handleResponse();
  }
  handleResponse = () => {
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    // data.append("link", this.state.id);
    AppFeaturesCreateUser(data, this, this.handleRedirection);
  };

  handleRedirection = () => {
    if (this.state.PageName === "whale-watch") {
      this.props.history.push("/whale-watch?create-pod=true");
    } else if (this.state.PageName === "average-cost-basis") {
      // console.log("average-cost-basis");

      this.props.history.push("/intelligence/costs?add-address=true");
    } else if (this.state.PageName === "netflow") {
      // console.log("netflows");
      this.props.history.push({
        pathname: "/intelligence",
        hash: "netflow",
        search: "?add-address=true",
      });
    } else if (this.state.PageName === "insights") {
      // console.log("insights");
      this.props.history.push("/intelligence/insights?add-address=true");
    } else if (this.state.PageName === "asset-value-chart") {
      // console.log("asset-value-chart");
      this.props.history.push("/intelligence/asset-value?add-address=true");
    }
  };

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

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllParentChains,
};
AppFeature.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(AppFeature);
