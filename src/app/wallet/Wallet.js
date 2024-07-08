import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import netWorthIcon from "../../assets/images/icons/net-worth.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  FilterBasedAssest,
  SortByAmount,
  SortByDate,
  SortByName,
} from "../../utils/AnalyticsFunctions";
import {
  SEARCH_BY_CHAIN_IN,
  SORT_BY_CREATED_ON,
  SORT_BY_NAME,
  SORT_BY_PORTFOLIO_AMOUNT,
} from "../../utils/Constant.js";
import { getCurrentUser } from "../../utils/ManageToken";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import FixAddModal from "../common/FixAddModal";
import Loading from "../common/Loading";
import PageHeader from "../common/PageHeader";
import { getAllCoins } from "../onboarding/Api.js";
import CoinBadges from "./../common/CoinBadges";
import { getAllWalletApi, getAllWalletListApi } from "./Api";
import WalletCard from "./WalletCard";
import { PieChartPorifleIcon } from "../../assets/images/icons/index.js";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(window.localStorage.getItem("currency")),
      walletList: [],
      start: 0,
      sorts: [],
      sortByAmount: false,
      sortByDate: false,
      sortByName: false,
      walletNameList: [],
      userWalletList: [],
      activeBadge: [{ name: "All", id: "" }],
      addModal: false,
      isLoading: true,
      sortBy: [
        { title: "Amount", down: true },
        { title: "Date added", down: true },
        { title: "Name", down: true },
      ],
      startTime: "",
      totalWalletAmt: 0,
      conditions: [],
    };
    // this.sortby = [{title:"Amount",down:true}, {title:"Date added",down:true},{title:"Name", down:true}];
  }

  componentDidMount() {
    // this.state.startTime = new Date() * 1;
    // // console.log("page Enter", this.state.startTime / 1000);
    //  WalletsPage({
    //    session_id: getCurrentUser().id,
    //    email_address: getCurrentUser().email,
    //  });

    this.props.getAllCoins();
    this.makeApiCall();
    this.props.GetAllPlan();
    this.props.getUser();
  }

  componentWillUnmount() {
    // let endTime = new Date() * 1;
    // let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime / 1000);
    // console.log("Time Spent", TimeSpent);
    // TimeSpentWallet({
    //   time_spent: TimeSpent,
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  }

  makeApiCall = (cond = this.state.conditions) => {
    let data = new URLSearchParams();
    data.append("start", this.state.start);
    data.append("conditions", JSON.stringify(cond ? cond : []));
    data.append("limit", 50);
    // data.append("limit", API_LIMIT)
    data.append("sorts", JSON.stringify(this.state.sorts));
    this.props.getAllWalletListApi(data, this);
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
      SortByAmount({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
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
      SortByDate({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
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
      SortByName({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    }

    // this.makeApiCall()
  };
  handleFunction = (badge) => {
    this.setState({ isLoading: true });
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
    FilterBasedAssest({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      assets_selected: badge.name,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

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
        });
      } else {
        condition = [];
      }
      this.setState({
        conditions: condition,
      });
      this.makeApiCall(condition);
    } else if (prevState.sorts !== this.state.sorts) {
      this.makeApiCall();
    }

    if (!this.props.commonState.profilePageWalletModal) {
      this.props.updateWalletListFlag("profilePageWalletModal", true);
      this.handleUpdateWallet();
    }
    if (this.props.isUpdate !== prevProps.isUpdate) {
      this.handleUpdateWallet();
    }
  }
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleUpdateWallet = () => {
    // console.log("YES API")
    this.setState({ isLoading: true });
    this.makeApiCall();
  };

  render() {
    let { walletList, totalWalletAmt } = this.props.walletState;
    const { currency, isLoading } = this.state;
    return (
      <div className="wallet-page-section">
        {/* <Sidebar ownerName="" /> */}
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
            handleUpdateWallet={this.handleUpdateWallet}
            pathName="/wallets"
            from="wallet"
          />
        )}
        {walletList.length > 0 ? (
          <div
            className="wallet-section page"
            style={
              this.props.hidePageHeader
                ? { marginTop: "0rem", marginBottom: "1rem" }
                : {}
            }
          >
            <PageHeader
              title="Wallets"
              subTitle="Manage all the wallets right here"
              btnText={this.props.hidePageHeader ? false : "Add wallet"}
              SecondaryBtn={this.props.hidePageHeader ? false : true}
              handleBtn={this.handleAddModal}
              handleUpdate={this.handleUpdateWallet}
              // showData={totalWalletAmt}
              // isLoading={isLoading}
            />
            {this.props.isMobileDevice ? null : (
              <div
                style={{
                  minWidth: "85rem",
                  maxWidth: "120rem",
                  width: "120rem",
                }}
              >
                <CoinBadges
                  activeBadge={this.state.activeBadge}
                  chainList={this.props.OnboardingState.coinsList}
                  handleFunction={this.handleFunction}
                  hideDropdown
                />
              </div>
            )}
            {this.props.isMobileDevice ? null : (
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
            )}

            {!isLoading ? (
              <div className="net-worth-wrapper">
                <div className="left">
                  <div className="net-worth-icon-container">
                    <Image
                      src={PieChartPorifleIcon}
                      className="net-worth-icon"
                    />
                  </div>
                  <h3 className="inter-display-medium f-s-20 lh-24 ">
                    Total net worth
                  </h3>
                </div>
                <div className="right">
                  <h3 className="space-grotesk-medium f-s-24 lh-29">
                    {CurrencyType(false)}
                    {numToCurrency(totalWalletAmt)}{" "}
                    <span className="inter-display-semi-bold f-s-10 lh-12 grey-ADA va-m">
                      {CurrencyType(true)}
                    </span>
                  </h3>
                </div>
              </div>
            ) : null}

            <div className="cards">
              {isLoading === true ? (
                <div className="loading-container">
                  <div className="animation-wrapper">
                    <Loading />
                  </div>
                </div>
              ) : (
                walletList.map((wallet, index) => {
                  return (
                    <WalletCard
                      isMobileDevice={this.props.isMobileDevice}
                      key={index}
                      createdOn={wallet.created_on}
                      wallet_metadata={wallet.wallet_metadata}
                      wallet_account_number={wallet.address}
                      display_address={wallet.display_address}
                      nameTag={wallet.tag}
                      wallet_amount={wallet.total_value * currency?.rate}
                      wallet_coins={wallet?.chains}
                      makeApiCall={this.makeApiCall}
                      handleUpdateWallet={this.handleUpdateWallet}
                      history={this.props.history}
                      nickname={wallet.nickname}
                      protocol={wallet.protocol}
                      // isLoading={this.state.isLoading}
                    />
                  );
                })
              )}
            </div>

            {/* <FeedbackForm page={"Wallet Page"} /> */}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  walletState: state.WalletState,
  OnboardingState: state.OnboardingState,
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllWalletListApi,
  getAllWalletApi,
  setPageFlagDefault,
  GetAllPlan,
  getUser,
  updateWalletListFlag,
  // getCoinRate,
};
Wallet.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
