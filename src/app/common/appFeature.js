import React, { Component } from "react";
import { connect } from "react-redux";
import { AppFeaturesCreateUser, getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import Loading from "../common/Loading";

import { GetAllPlan, GetDefaultPlan, getUser } from "../common/Api";
import { deleteToken } from "../../utils/ManageToken.js";

class AppFeature extends Component {
  constructor(props) {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const PageName = params.get("redirect");
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      PageName: PageName ? PageName : "",
    };
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();

    this.props.getAllCoins(this.handleResponse);
    this.props.getAllParentChains();

    localStorage.setItem(
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

    let userPlan = JSON.parse(localStorage.getItem("currentPlan"));
    if (!userPlan) {
      GetDefaultPlan();
    }
  }
  handleResponse = () => {
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    // data.append("link", this.state.id);
    AppFeaturesCreateUser(data, this, this.handleRedirection());
  };

    handleRedirection = () => {
        if (this.state.PageName === "whale-watch") {
            console.log("whale watch");
            this.props.history.push("/whale-watch")
        } else if (this.state.PageName === "average-cost-basis") {
          console.log("average-cost-basis");
        } else if (this.state.PageName === "netflows") {
          console.log("netflows");
        } else if (this.state.PageName === "insights") {
          console.log("insights");
        } else if (this.state.PageName === "asset-value-chart") {
          console.log("asset-value-chart");
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
