import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loading from "../common/Loading";
import { getAllCoins } from "../onboarding/Api.js";
// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import PageHeader from "../common/PageHeader";
import FixAddModal from "../common/FixAddModal";
import {
  getAllProtocol,
  getProtocolBalanceApi,
  getYieldBalanceApi,
} from "../Portfolio/Api";
import {
  amountFormat,
  CurrencyType,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { Col, Image, Row } from "react-bootstrap";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import Coin from "../../assets/images/icons/Coin0.svg";
import Coin1 from "../../assets/images/icons/Coin0.svg";

import Coin4 from "../../assets/images/icons/Coin-3.svg";

import ReflexerIcon from "../../assets/images/icons/reflexer.svg";
import MakerIcon from "../../assets/images/icons/maker.svg";
import CoinChip from "../wallet/CoinChip";

import Coin2 from "../../assets/images/icons/temp-coin1.svg";
import Coin3 from "../../assets/images/icons/temp-coin-2.svg";

class Defi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      sortBy: [
        { title: "Amount", down: true },
        { title: "Name", down: true },
      ],
      start: 0,
      sorts: [],

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      // defi

      isYeildToggle: false,
      isDebtToggle: false,
      allProtocols: null,
      yieldData: null,

      yeldTotal: 0,
      debtTotal: 0,

      // new
      totalYield: 0,
      totalDebt: 0,
        cardList: [],
      sortedList:[],
      DebtValues: [],
      YieldValues: [],
      BalanceSheetValue: {},
    };
  }

  componentDidMount() {
    this.props.getAllCoins();
    // getAllProtocol(this);
    this.getYieldBalance();
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");

      this.props.getAllCoins();
      this.setState(
        {
          allProtocols: null,
          totalYield: 0,
          totalDebt: 0,
              cardList: [],
          sortedList:[],
          yieldData: [],
          DebtValues: [],
          YieldValues: [],
          yeldTotal: 0,
          debtTotal: 0,
          isYeildToggle: false,
          isDebtToggle: false,
          isChainToggle: false,
        },
        () => {
          //  getAllProtocol(this);
          this.getYieldBalance();
          this.setState({
            apiResponse: false,
          });
        }
      );
    }

    if (this.props.isUpdate !== prevProps.isUpdate) {
      // for balance sheet
      //  getAllProtocol(this);
    }
  }
  sortArray = (key, order) => {
    let array = this.state?.cardList; //all data
    let sortedList = array.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (key === "created_on") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (key === "name") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        return order
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (key === "amount") {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
      if (order) {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    this.setState({
      sortedList,
    });
  };

  handleSort = (e) => {
    // down == true means ascending and down == false means descending
    let isDown = true;
    let sort = [...this.state.sortBy];
    sort.map((el) => {
      if (el.title === e.title) {
        el.down = !el.down;
        isDown = el.down;
      } else {
        el.down = true;
      }
    });

    if (e.title === "Amount") {
      this.sortArray("totalUsd", isDown);
      this.setState({
        sortBy: sort,
      });
      //   WhaleSortByAmt({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
    } else if (e.title === "Date added") {
      this.sortArray("created_on", isDown);
      this.setState({
        sortBy: sort,
      });
      //   WhaleSortByDate({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
    } else if (e.title === "Name") {
      this.sortArray("name", isDown);
      this.setState({
        sortBy: sort,
      });
      //   WhaleSortByName({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
    }
  };

  getYieldBalance = () => {
    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    UserWallet &&
      UserWallet?.map((e) => {
        //  console.log("wallet_address", e.address);
        let data = new URLSearchParams();
        data.append("wallet_address", e.address);
        getProtocolBalanceApi(this, data);
        // this.state.allProtocols &&
        //   this.state.allProtocols?.map((protocol) => {
        //     let data = new URLSearchParams();
        //     // console.log("protocol_code", protocol.code,
        //     //   "wallet_address",
        //     //   e.address);
        //     // data.append("protocol_code", protocol.code);

        //   });
      });
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
  };

  render() {
    // console.log("nav list", nav_list, PageName);
    const chips = [
      {
        chain: {
          symbol: Coin2,
          name: "Avalanche",
          color: "#E84042",
        },
      },
      {
        chain: {
          symbol: Coin3,
          name: "Avalanche",
          color: "#E84042",
        },
      },
    ];

    return (
      <div className="cohort-page-section">
        <div className="cohort-section page">
          {this.state.addModal && (
            <FixAddModal
              show={this.state.addModal}
              onHide={this.handleAddModal}
              modalIcon={AddWalletModalIcon}
              title="Add wallet address"
              subtitle="Add more wallet address here"
              modalType="addwallet"
              btnStatus={false}
              btnText="Go"
              history={this.props.history}
              changeWalletList={this.handleChangeList}
              apiResponse={(e) => this.CheckApiResponse(e)}
            />
          )}
          <PageHeader
            title="Decentralized Finance"
            subTitle="Decipher all your DeFi data from one place"
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
            showpath={true}
            currentPage={"decentralized-finance"}
            // showData={totalWalletAmt}
            // isLoading={isLoading}
          />

          {/* Balance sheet */}
          <h2 className="inter-display-medium f-s-20 lh-24 m-t-40">
            Balance sheet
          </h2>
          <div style={{}} className="balance-sheet-card">
            <div className="balance-dropdown">
              <div className="balance-list-content">
                {/* For yeild */}
                <Row>
                  <Col md={6}>
                    <div className="balance-sheet-title">
                      <span
                        className="inter-display-semi-bold f-s-16 lh-19"
                        style={{ color: "#636467", marginRight: "0.8rem" }}
                      >
                        Yield
                      </span>
                      <span
                        className="inter-display-regular f-s-16 lh-19"
                        style={{ color: "#B0B1B3", marginRight: "0.8rem" }}
                      >
                        {CurrencyType(false)}
                        {this.state.totalYield &&
                          numToCurrency(this.state.totalYield)}
                      </span>
                    </div>
                    {this.state.YieldValues.length !== 0
                      ? this.state.YieldValues.map((item, i) => {
                          return (
                            <div
                              className="balance-sheet-list"
                              style={
                                i === this.state.YieldValues.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>
                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {amountFormat(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })
                      : ""}
                  </Col>
                  <Col md={6}>
                    <div className="balance-sheet-title">
                      <span
                        className="inter-display-semi-bold f-s-16 lh-19"
                        style={{ color: "#636467", marginRight: "0.8rem" }}
                      >
                        Debt
                      </span>
                      <span
                        className="inter-display-regular f-s-16 lh-19"
                        style={{ color: "#B0B1B3", marginRight: "0.8rem" }}
                      >
                        {CurrencyType(false)}
                        {this.state.totalDebt &&
                          numToCurrency(this.state.totalDebt)}
                      </span>
                    </div>

                    {this.state.DebtValues.length !== 0
                      ? this.state.DebtValues.map((item, i) => {
                          return (
                            <div
                              className="balance-sheet-list"
                              style={
                                i === this.state.DebtValues.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>
                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {amountFormat(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })
                      : ""}
                  </Col>
                </Row>

                {/* For debt */}
              </div>
            </div>
          </div>

          {/* filter */}
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
          {/* End filter */}

          {/* start card */}

          {this.state?.sortedList?.length !== 0 &&
          this.state?.sortedList !== "" ? (
            this.state?.sortedList?.map((card, i) => {
              return (
                <div className="defi-card-wrapper">
                  <div className="top-title-wrapper">
                    <div className="heading-image">
                      <Image src={card?.symbol} />
                      <h3 className="inter-display-medium f-s-16 lh-19">
                        {card?.name}
                      </h3>
                    </div>
                    <h3 className="inter-display-medium f-s-16 lh-19">
                      {CurrencyType(false)}
                      {numToCurrency(card?.totalUsd)}{" "}
                      <span className="inter-display-medium f-s-10 lh-19 grey-ADA">
                        {CurrencyType(true)}
                      </span>
                    </h3>
                  </div>

                  {/* Table head*/}
                  <Row className="table-head">
                    <Col md={3}>
                      <div
                        className="cp header-col"
                        //   onClick={() => this.handleTableSort("from")}
                      >
                        <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                          Asset
                        </span>
                        <Image src={sortByIcon} className={"rotateDown"} />
                      </div>
                    </Col>
                    <Col
                      md={3}
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className="cp header-col"
                        //   onClick={() => this.handleTableSort("from")}
                      >
                        <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                          Type
                        </span>
                        <Image src={sortByIcon} className={"rotateDown"} />
                      </div>
                    </Col>
                    <Col
                      md={3}
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className="cp header-col"
                        //   onClick={() => this.handleTableSort("from")}
                      >
                        <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                          Balance
                        </span>
                        <Image src={sortByIcon} className={"rotateDown"} />
                      </div>
                    </Col>
                    <Col
                      md={3}
                      style={{
                        justifyContent: "flex-end",
                      }}
                    >
                      <div
                        className="cp header-col"
                        //   onClick={() => this.handleTableSort("from")}
                      >
                        <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                          USD Value
                        </span>
                        <Image src={sortByIcon} className={"rotateDown"} />
                      </div>
                    </Col>
                  </Row>

                  {/* Table Content */}
                  {card?.row &&
                    card?.row.map((item, i) => {
                      return (
                        <Row className="table-content-row">
                          <Col md={3}>
                            {/* <CoinChip
                    colorCode={"#E84042"}
                    coin_img_src={Coin}
                    coin_percent={"Defi"}
                    type={"cohort"}
                  /> */}
                            {item.assets?.length > 1 ? (
                              <div className="overlap-img">
                                {item.assets?.map((e, i) => {
                                  return (
                                    <Image
                                      src={e?.symbol}
                                      style={{
                                        zIndex: item.assets?.length - i,
                                        marginLeft: i === 0 ? "0" : "-2.7rem",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  src={item.assets[0]?.symbol}
                                  style={{ width: "1.7rem",  borderRadius: "4px" }}
                                />
                                <h3 className="inter-display-medium f-s-13 lh-13 m-l-4">
                                  {item.assets[0]?.code}
                                </h3>
                              </div>
                            )}
                          </Col>
                          <Col
                            md={3}
                            style={{
                              justifyContent: "center",
                            }}
                          >
                            <div className="gray-chip inter-display-medium f-s-15 lh-15">
                              {item.type_name}
                            </div>
                          </Col>
                          <Col
                            md={3}
                            style={{
                              justifyContent: "center",
                            }}
                          >
                            <div className="gray-chip inter-display-medium f-s-15 lh-15">
                              {item?.balance.map((e, i) => {
                                return `${amountFormat(
                                  e?.value.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}  ${
                                  item.balance?.length > 1 ? " " + e.code : ""
                                }  ${
                                  item.balance?.length - 1 !== i ? " + " : ""
                                }`;
                              })}
                            </div>
                          </Col>
                          <Col
                            md={3}
                            style={{
                              justifyContent: "flex-end",
                            }}
                          >
                            <div className="gray-chip inter-display-medium f-s-15 lh-15">
                              {CurrencyType(false)}
                              {amountFormat(
                                item.usdValue.toFixed(2),
                                "en-US",
                                "USD"
                              )}
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                </div>
              );
            })
          ) : this.state?.sortedList !== "" ? (
            // <Col md={12}>
              <div className="animation-wrapper">
                <Loading />
              </div>
            // </Col>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defiState: state.DefiState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
};
Defi.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Defi);
