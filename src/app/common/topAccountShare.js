import React, { Component } from "react";
import { connect } from "react-redux";
import {
  AppFeaturesCreateUser,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api.js";
import Loading from "../common/Loading";

import { GetAllPlan, GetDefaultPlan, TopsetPageFlagDefault, getUser } from "../common/Api";
import { deleteToken, resetPreviewAddress } from "../../utils/ManageToken.js";
import base64url from "base64url";

class TopAccountShare extends Component {
  constructor(props) {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("redirect");
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      page: page ? page : "",
        data: props?.match?.params?.id,
      hash: props?.location?.hash
    };
      
    //   console.log("data", props)
  }

    componentDidMount() {
    //   console.log("test")
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

    // this.handleResponse();
  }
  handleResponse = () => {
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    // data.append("link", this.state.id);
    AppFeaturesCreateUser(data, this, this.handleRedirection);
  };

    handleRedirection = () => {
        // resetting top accounts pages
        resetPreviewAddress();
        this.props?.TopsetPageFlagDefault();
        const decodedAddress = base64url.decode(this.state.data);
        // console.log("de add", decodedAddress,"en add", this.state.data, "hash",this.state.hash, "page",this.state.page);

         let obj = JSON.parse(localStorage.getItem("previewAddress"));
        localStorage.setItem(
          "previewAddress",
          JSON.stringify({
            ...obj,
            address: decodedAddress,
          })
        );

        let page = this.state?.hash
          ? this.state.page + this.state?.hash
            : this.state?.page;
        
        // console.log("page", page);
          this.props.history.push(`/top-accounts/${page}`);
   
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
  TopsetPageFlagDefault,
};
TopAccountShare.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(TopAccountShare);
