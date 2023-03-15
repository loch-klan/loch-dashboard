import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import WalletCard from "./WalletCard";
import PageHeader from "../common/PageHeader";
import CoinBadges from "./../common/CoinBadges";
import { getAllWalletListApi, getAllWalletApi } from "./Api";
import { getAllCoins } from "../onboarding/Api.js";
import {
  SEARCH_BY_CHAIN_IN,
  SORT_BY_NAME,
  SORT_BY_PORTFOLIO_AMOUNT,
  SORT_BY_CREATED_ON,
} from "../../utils/Constant.js";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import netWorthIcon from "../../assets/images/icons/net-worth.svg";
import sortByIcon from '../../assets/images/icons/triangle-down.svg'
import { Image } from "react-bootstrap";
import Loading from "../common/Loading";
import { FilterBasedAssest, SortByAmount, SortByDate, SortByName, TimeSpentWallet, WalletsPage } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import FeedbackForm from "../common/FeedbackForm";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import { GetAllPlan, getUser, setPageFlagDefault } from "../common/Api";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem('currency')),
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
    };
    // this.sortby = [{title:"Amount",down:true}, {title:"Date added",down:true},{title:"Name", down:true}];
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime / 1000);
     WalletsPage({
       session_id: getCurrentUser().id,
       email_address: getCurrentUser().email,
     });

    this.props.getAllCoins();
    this.makeApiCall();
    GetAllPlan();
    getUser();
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime / 1000);
    // console.log("Time Spent", TimeSpent);
    TimeSpentWallet({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  makeApiCall = (cond) => {
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
      this.makeApiCall(condition);
    } else if (prevState.sorts !== this.state.sorts) {
      this.makeApiCall();
    }
  }
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleUpdateWallet = () => {
    // console.log("YES API")
    this.setState({isLoading: true})
    this.makeApiCall();
    // this.props.setPageFlagDefault();
  };

  render() {
    const { walletList,totalWalletAmt } = this.props.walletState;
    const {currency, isLoading} = this.state;
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
          />
        )}
        <div className="wallet-section page">
          <PageHeader
            title="Wallets"
            subTitle="Manage all your wallets right here"
            btnText="Add wallet"
            SecondaryBtn={true}
            handleBtn={this.handleAddModal}
            handleUpdate={this.handleUpdateWallet}
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
          {walletList.length > 0 && (
            <div className="net-worth-wrapper">
              <div className="left">
                <Image src={netWorthIcon} className="net-worth-icon" />
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
          )}

          <div className="cards">
            {isLoading === true ? (
              <div className="loading-container">
                <div className="animation-wrapper">
                  <Loading />
                </div>
              </div>
            ) : walletList.length > 0 ? (
              walletList.map((wallet, index) => {
                // console.log("walletlist", walletList)
                return (
                  <WalletCard
                    key={index}
                    createdOn={wallet.created_on}
                    wallet_metadata={wallet.wallet_metadata}
                    wallet_account_number={wallet.address}
                    display_address={wallet.display_address}
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
            ) : (
              <div style={{ textAlign: "center" }}>
                {/* <Image src={noDataImage} className="no-data m-b-20" /> */}
                <h3 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8">
                  No data found
                </h3>
              </div>
            )}
          </div>
          {/* <FeedbackForm page={"Wallet Page"} /> */}
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
  setPageFlagDefault,
  // getCoinRate,
};
Wallet.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
