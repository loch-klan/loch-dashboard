import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PageHeader from "../common/PageHeader";
import CoinBadges from "./../common/CoinBadges";
import { getAllWalletListApi, getAllWalletApi } from "../wallet/Api";
import { getAllCoins } from "../onboarding/Api.js";
import EditIcon from "../../assets/images/EditIcon.svg";
import {
  SEARCH_BY_CHAIN_IN,
  SORT_BY_NAME,
  SORT_BY_PORTFOLIO_AMOUNT,
  SORT_BY_CREATED_ON,
} from "../../utils/Constant.js";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import netWorthIcon from "../../assets/images/icons/net-worth.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { Col, Image, Row } from "react-bootstrap";
import Loading from "../common/Loading";
import {
  FilterBasedAssest,
  SortByAmount,
  SortByDate,
  SortByName,
  TimeSpentWallet,
  WalletsPage,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import FeedbackForm from "../common/FeedbackForm";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import Coin from "../../assets/images/coin-ava.svg";
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";
import CoinChip from "../wallet/CoinChip";
import ExitOverlay from "../common/ExitOverlay";
import { searchCohort } from "./Api";
class Cohort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: [
        { title: "Amount", down: true },
        { title: "Date added", down: true },
        { title: "Name", down: true },
      ],
      activeBadge: [{ name: "All", id: "" }],
      addModal: false,
      isLoading: true,
      cohortModal: false,

      start: 0,
      sorts: [],
      sortByAmount: false,
      sortByDate: false,
      sortByName: false,
    };
  }

  componentDidMount() {
    // this.state.startTime = new Date() * 1;
    // // console.log("page Enter", this.state.startTime / 1000);
    // WalletsPage({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });

    this.props.getAllCoins();
    this.makeApiCall();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeBadge !== this.state.activeBadge) {
      let arr = [...this.state.activeBadge];
      let index = arr.findIndex((e) => e.id === "");
      if (index !== -1) {
        arr.splice(index, 1);
      }
      let condition = [{ key: SEARCH_BY_CHAIN_IN, value: [] }];
      if (arr.length > 0) {
        arr.map((badge) => {
          condition[0].value.push(badge.id);
          // console.log("cond", condition);
        });
      } else {
        condition = [];
      }

      // console.log("cond", condition)
      this.makeApiCall(condition);
    } else if (prevState.sorts !== this.state.sorts) {
      this.makeApiCall();
    }
  }

  handleCohort = () => {
    console.log("cohort click");
    this.setState({
      cohortModal: !this.state.cohortModal,
    });
  };

  handleChangeList = (value) => {
    // this.setState({
    //   // userWalletList: value,
      
    //   // isLoading: true,
    // });
    this.makeApiCall();
    
  };

  makeApiCall = (cond) => {
    let data = new URLSearchParams();
    data.append("start", this.state.start);
    data.append("conditions", JSON.stringify(cond ? cond : []));
    data.append("limit", 50);
    // data.append("limit", API_LIMIT)
    data.append("sorts", JSON.stringify(this.state.sorts));
    searchCohort(data, this);
    // console.log(data);
  };

  handleSort = (e) => {
    let sort = [...this.state.sortBy];
    sort.map((el) => {
      if (el.title === e.title) {
        el.down = !el.down;
      } else {
        el.down = true;
      }
    });

    if (e.title === "Amount") {
      let obj = [
        {
          key: SORT_BY_PORTFOLIO_AMOUNT,
          value: !this.state.sortByAmount,
        },
      ];
      this.setState({
        sorts: obj,
        sortByAmount: !this.state.sortByAmount,
        sortBy: sort,
      });
      // SortByAmount({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    } else if (e.title === "Date added") {
      let obj = [
        {
          key: SORT_BY_CREATED_ON,
          value: !this.state.sortByDate,
        },
      ];
      this.setState({
        sorts: obj,
        sortByDate: !this.state.sortByDate,
        sortBy: sort,
      });
      // SortByDate({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    } else if (e.title === "Name") {
      let obj = [
        {
          key: SORT_BY_NAME,
          value: !this.state.sortByName,
        },
      ];
      this.setState({
        sorts: obj,
        sortByName: !this.state.sortByName,
        sortBy: sort,
      });
      // SortByName({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    }

    // this.makeApiCall()
  };

  handleFunction = (badge) => {
    let newArr = [...this.state.activeBadge];
    if (this.state.activeBadge.some((e) => e.name === badge.name)) {
      let index = newArr.findIndex((x) => x.name === badge.name);
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        this.setState({
          activeBadge: [{ name: "All", id: "" }],
        });
      } else {
        this.setState({
          activeBadge: newArr,
        });
      }
    } else if (badge.name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
      });
    } else {
      let index = newArr.findIndex((x) => x.name === "All");
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.push(badge);
      this.setState({
        activeBadge: newArr,
      });
    }
  };

  render() {
    return (
      <div className="cohort-page-section">
        {/* <Sidebar ownerName="" /> */}

        {this.state.cohortModal ? (
          <ExitOverlay
            show={this.state.cohortModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.handleCohort}
            history={this.props.history}
            modalType={"cohort"}
            headerTitle={"Create a Wallet cohort"}
            changeWalletList={this.handleChangeList}
          />
        ) : (
          ""
        )}

        <div className="cohort-section page">
          <PageHeader
            title="Cohorts"
            subTitle="Track all your cohorts here"
            btnText="Create Cohort"
            handleBtn={this.handleCohort}
            // showData={totalWalletAmt}
            // isLoading={isLoading}
          />
          <CoinBadges
            activeBadge={this.state.activeBadge}
            chainList={this.props.OnboardingState.coinsList}
            handleFunction={this.handleFunction}
          />
          <div className="m-b-16 sortby-section">
            <div className="dropdown-section">
              <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-313 naming">
                Sort by
              </span>
              {this.state.sortBy.map((e, index) => {
                return (
                  <span
                    className="sort-by-title"
                    key={index}
                    onClick={() => this.handleSort(e)}
                  >
                    <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-7C7 ">
                      {e.title}
                    </span>{" "}
                    {/* <Image src={sort} style={{ width: "1rem" }} /> */}
                    <Image
                      src={sortByIcon}
                      // style={{ width: "1.6rem" }}
                      className={e.down ? "rotateDown" : "rotateUp"}
                    />
                  </span>
                );
              })}
            </div>
          </div>
          {/* card  */}
          <Row style={{ minWidth: "91rem" }}>
            <Col md={4} style={{ padding: "10px" }}>
              <div
                className="cards"
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "16px",
                  marginBottom: "3rem",
                }}
              >
                {/* Top Section */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229, 229, 230, 0) 0%, #E5E5E6 250.99%)",
                    borderRadius: "16px 16px 0px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px - 6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "12px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "69px",
                    }}
                  >
                    <Image src={Coin1} style={{ margin: "0px 5px 5px 0px" }} />
                    <Image src={Coin2} style={{ margin: "0px 0px 5px 0px" }} />
                    <Image src={Coin3} style={{ margin: "0px 5px 0px 0px" }} />
                    <Image src={Coin4} style={{ margin: "0px 0px 0px 0px" }} />
                  </div>
                  {/* title*/}
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      this.props.history.push("/cohort/avax-whales")
                    }
                  >
                    <h4 className="inter-display-medium f-s-16 l-h-19 black-000">
                      My AVAX Whales
                    </h4>
                    <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                      3612.21 <span className="f-s-10 grey-CAC">USD</span>
                    </h4>
                  </div>
                  {/* edit icon */}
                  <Image
                    src={EditIcon}
                    className="cp editIcon"
                    onClick={this.handleCohort}
                  />
                </div>
                {/* Top Section END */}
                {/* Bottom Section Address list */}
                <div
                  style={
                    {
                      // padding: "20px",
                    }
                  }
                >
                  {/* List Item */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <div>
                      <CoinChip
                        colorCode={"#E84042"}
                        coin_img_src={Coin}
                        coin_percent={"Avalanche"}
                        type={"cohort"}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md={4} style={{ padding: "10px" }}>
              <div
                className="cards"
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "16px",
                  marginBottom: "3rem",
                }}
              >
                {/* Top Section */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229, 229, 230, 0) 0%, #E5E5E6 250.99%)",
                    borderRadius: "16px 16px 0px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px - 6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "12px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "69px",
                    }}
                  >
                    <Image src={Coin1} style={{ margin: "0px 5px 5px 0px" }} />
                    <Image src={Coin2} style={{ margin: "0px 0px 5px 0px" }} />
                    <Image src={Coin3} style={{ margin: "0px 5px 0px 0px" }} />
                    <Image src={Coin4} style={{ margin: "0px 0px 0px 0px" }} />
                  </div>
                  {/* title*/}
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      this.props.history.push("/cohort/my-curve-whales")
                    }
                  >
                    <h4 className="inter-display-medium f-s-16 l-h-19 black-000">
                      My Curve Whales
                    </h4>
                    <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                      3612.21 <span className="f-s-10 grey-CAC">USD</span>
                    </h4>
                  </div>
                  {/* edit icon */}
                  <Image
                    src={EditIcon}
                    className="cp editIcon"
                    onClick={this.handleCohort}
                  />
                </div>
                {/* Top Section END */}
                {/* Bottom Section Address list */}
                <div
                  style={
                    {
                      // padding: "20px",
                    }
                  }
                >
                  {/* List Item */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <div>
                      <CoinChip
                        colorCode={"#E84042"}
                        coin_img_src={Coin}
                        coin_percent={"Avalanche"}
                        type={"cohort"}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md={4} style={{ padding: "10px" }}>
              <div
                className="cards"
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "16px",
                  marginBottom: "3rem",
                }}
              >
                {/* Top Section */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229, 229, 230, 0) 0%, #E5E5E6 250.99%)",
                    borderRadius: "16px 16px 0px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      boxShadow:
                        "0px 8px 28px - 6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                      borderRadius: "12px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "69px",
                    }}
                  >
                    <Image src={Coin1} style={{ margin: "0px 5px 5px 0px" }} />
                    <Image src={Coin2} style={{ margin: "0px 0px 5px 0px" }} />
                    <Image src={Coin3} style={{ margin: "0px 5px 0px 0px" }} />
                    <Image src={Coin4} style={{ margin: "0px 0px 0px 0px" }} />
                  </div>
                  {/* title*/}
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      this.props.history.push("/cohort/my-uniswap-whales")
                    }
                  >
                    <h4 className="inter-display-medium f-s-16 l-h-19 black-000">
                      My Uniswap Whales
                    </h4>
                    <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                      3612.21 <span className="f-s-10 grey-CAC">USD</span>
                    </h4>
                  </div>
                  {/* edit icon */}
                  <Image
                    src={EditIcon}
                    className="cp editIcon"
                    onClick={this.handleCohort}
                  />
                </div>
                {/* Top Section END */}
                {/* Bottom Section Address list */}
                <div
                  style={
                    {
                      // padding: "20px",
                    }
                  }
                >
                  {/* List Item */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <div>
                      <CoinChip
                        colorCode={"#E84042"}
                        coin_img_src={Coin}
                        coin_percent={"Avalanche"}
                        type={"cohort"}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                      borderBottom: "1px solid rgba(229, 229, 230, 0.5)",
                    }}
                  >
                    <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                      0x9450...CB0
                    </h4>

                    {/* chip */}
                    <CoinChip
                      colorCode={"#E84042"}
                      coin_img_src={Coin}
                      coin_percent={"Avalanche"}
                      type={"cohort"}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  walletState: state.WalletState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllWalletListApi,
  getAllWalletApi,
};
Cohort.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Cohort);
