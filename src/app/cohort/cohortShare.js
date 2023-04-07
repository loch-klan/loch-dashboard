import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PageHeader from "../common/PageHeader";
import CoinBadges from "./../common/CoinBadges";
import { getAllWalletListApi, getAllWalletApi } from "../wallet/Api";
import { getAllCoins } from "../onboarding/Api.js";
import EditIcon from "../../assets/images/EditIcon.svg";
import CohortIcon from "../../assets/images/icons/active-cohort.svg";
import {
  SEARCH_BY_CHAIN_IN,
  SORT_BY_NAME,
  SORT_BY_PORTFOLIO_AMOUNT,
  SORT_BY_CREATED_ON,
  Plans,
} from "../../utils/Constant.js";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import netWorthIcon from "../../assets/images/icons/net-worth.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { Col, Image, Row } from "react-bootstrap";
import Loading from "../common/Loading";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import {
  CreateWhalePod,
  TimeSpentWhalePod,
  WhaleExpandedPod,
  WhaleFilterByChain,
  WhaleHoverPod,
  WhaleSortByAmt,
  WhaleSortByDate,
  WhaleSortByName,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser, getToken } from "../../utils/ManageToken";
import FeedbackForm from "../common/FeedbackForm";
import {
  CurrencyType,
  numToCurrency,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import Coin from "../../assets/images/coin-ava.svg";
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";
import CoinChip from "../wallet/CoinChip";
import ExitOverlay from "../common/ExitOverlay";
import { CopyCohort, searchCohort, updateCohort } from "./Api";
import moment from "moment";
import CustomChip from "../../utils/commonComponent/CustomChip";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import PodCard from "./pod-card";
class CohortSharePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      total_addresses: 0,
    };
  }

  componentDidMount() {
    console.log("mount clog", this.props);
    if (
      this.props.match.params &&
      this.props.match.params.podName &&
      this.props.match.params.userId
    ) {
      console.log("found search");
      if (getToken()) {
        console.log("token found");
        const data = new URLSearchParams();
        data.append("slug", this.props.match.params.podName);
        data.append("user_id", this.props.match.params.userId);
        CopyCohort(data, this);
      } else {
        // create user then run api
        console.log("token create");
      }
    }

  }

  componentWillUnmount() {
    // let endTime = new Date() * 1;
    // let TimeSpent = (endTime - this.state.startTime) / 1000;

    // TimeSpentWhalePod({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   time_spent: TimeSpent,
    // });
  }

  componentDidUpdate(prevProps, prevState) {
   
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };
 

  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
                width: "100vw",
          zIndex:999
        }}
      >
        <Loading />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
 
});
const mapDispatchToProps = {

};
CohortSharePage.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CohortSharePage);
