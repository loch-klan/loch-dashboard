import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PageHeader from "../common/PageHeader";
import CoinBadges from "./../common/CoinBadges";
import { getAllWalletListApi, getAllWalletApi } from "../wallet/Api";
import { getAllCoins } from "../onboarding/Api.js";
import EditIcon from "../../assets/images/EditIcon.svg";
import CohortIcon from "../../assets/images/icons/active-cohort.svg";
import SearchIcon from "../../assets/images/icons/search-icon.svg";

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
  PageViewWhale,
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
import { CurrencyType, numToCurrency, UpgradeTriggered } from "../../utils/ReusableFunctions";
import Coin from "../../assets/images/coin-ava.svg";
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";
import CoinChip from "../wallet/CoinChip";
import ExitOverlay from "../common/ExitOverlay";
import { searchCohort, updateCohort } from "./Api";
import moment from "moment";
import CustomChip from "../../utils/commonComponent/CustomChip";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser, setPageFlagDefault } from "../common/Api";
import PodCard from "./pod-card";
import WelcomeCard from "../Portfolio/WelcomeCard";
class Cohort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      sortBy: [
        { title: "Amount", down: true },
        { title: "Date added", down: true },
        { title: "Name", down: true },
      ],
      activeBadge: [{ name: "All", id: "" }],
      // activeBadgeIds: [],
      addModal: false,
      isLoading: true,
      cohortModal: false,

      start: 0,
      sorts: [],
      // sortByAmount: false,
      // sortByDate: false,
      // sortByName: false,
      apiResponse: false,

      cardList: [],
      isEditModal: false,
      createOn: "",
      editItemName: "",
      editWalletAddressList: [],
      editcohortId: "",
      sortedList: [],
      RegisterModal: false,
      skip: false,
      chainImages: [],
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      total_addresses: 0,
      search: "",
      sortedItem: [],
      isUpdate: 0,
      startTime:"",
    };
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime / 1000);
    PageViewWhale({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const pod = params.get("create-pod");
    if (pod) {
      this.handleCohort();
      this.props.history.replace("/whale-watch");
    }

    this.props.getAllCoins();
    this.makeApiCall();
    GetAllPlan();
    getUser();

    let obj = UpgradeTriggered();

    if (obj.trigger) {
      this.setState(
        {
          triggerId: obj.id,
          isStatic: true,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000;

    TimeSpentWhalePod({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_spent: TimeSpent,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.apiResponse) {
      // console.log("update");
      this.makeApiCall();
      this.setState({
        apiResponse: false,
      });
    }
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  handleCohort = () => {
    // console.log("cohort click");
    // const isDummy = localStorage.getItem("lochDummyUser");
    // const islochUser = JSON.parse(localStorage.getItem("lochUser"));

    // console.log(
    //   this.state.userPlan?.whale_pod_limit,
    //   this.props.cohortState?.total_addresses,
    //   this.props.cohortState.cardList?.length
    // );
    const cohortCards = this.props.cohortState.cardList?.filter(
      (e) => e.user_id
    );
    // console.log("cohort",cohortCards )
    if (
      this.props.cohortState?.total_addresses >=
        this.state.userPlan.wallet_address_limit &&
      this.state.userPlan.wallet_address_limit !== -1
    ) {
      this.setState(
        {
          triggerId: 1,
        },
        () => {
          this.upgradeModal();
        }
      );
    } else {
      if (
        cohortCards?.length < this.state.userPlan?.whale_pod_limit ||
        this.state.userPlan?.whale_pod_limit === -1
      ) {
        this.setState({
          cohortModal: !this.state.cohortModal,
          // skip: islochUser ? true : this.state.skip,
        });

        CreateWhalePod({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      } else {
        this.setState(
          {
            triggerId: 2,
          },
          () => {
            this.upgradeModal();
          }
        );
      }
    }
  };

  // AddEmailModal = () => {
  //   // console.log("handle emailc close");
  //   this.setState({
  //     RegisterModal: !this.state.RegisterModal,

  //   });
  // };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // console.log("api respinse", value);
  };

  // handleSkip = () => {
  //   // console.log("handle skip")
  //   this.setState({
  //     skip: true,
  //   }, () => {
  //     if (this.state.skip) {
  //       this.AddEmailModal();
  //     }
  //   });
  // };

  handleEdit = (i, images) => {
    let walletList = this.props.cohortState?.sortedList;
    this.setState({
      isEditModal: !this.state.isEditModal,
      createOn: walletList[i]?.created_on,
      editItemName: walletList[i]?.name,
      editWalletAddressList: walletList[i]?.wallet_address_details,
      editcohortId: walletList[i]?.id,
      chainImages: images,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      isLoading: true,
      // cardList: [],
      // sortedList: [],
    });

    this.props.updateCohort([]);
    // if (!this.state.skip) {
    //   this.AddEmailModal();
    // }

    // this.makeApiCall();
  };

  makeApiCall = (cond) => {
    let data = new URLSearchParams();
    data.append("start", this.state.start);
    data.append("conditions", JSON.stringify(cond ? cond : []));
    data.append("limit", -1);
    // data.append("limit", API_LIMIT)
    data.append("sorts", JSON.stringify(this.state.sorts));
    this.props.searchCohort(data, this);
    // console.log(data);
  };

  sortArray = (key, order) => {
    let array = this.props.cohortState?.cardList; //all data
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

    // this.setState({
    //   sortedList,
    // });
    this.props.updateCohort(sortedList);
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
      this.sortArray("total_net_worth", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByAmt({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
    } else if (e.title === "Date added") {
      this.sortArray("created_on", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByDate({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
    } else if (e.title === "Name") {
      this.sortArray("name", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByName({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
    }
  };

  handleFunction = (badge) => {
    // console.log("badge", badge)
    // analytics
    WhaleFilterByChain({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
      chain_name: badge.name,
    });

    let newArr = [...this.state.activeBadge];
    let activeBadgeIds = [];
    if (this.state.activeBadge.some((e) => e.name === badge.name)) {
      let index = newArr.findIndex((x) => x.name === badge.name);
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        this.setState({
          activeBadge: [{ name: "All", id: "" }],
        });
        activeBadgeIds = [];
      } else {
        this.setState({
          activeBadge: newArr,
        });
        activeBadgeIds = newArr?.map((e) => e.id);
      }
    } else if (badge.name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
      });
      activeBadgeIds = [];
    } else {
      let index = newArr.findIndex((x) => x.name === "All");
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.push(badge);
      this.setState({
        activeBadge: newArr,
      });
      activeBadgeIds = newArr?.map((e) => e.id);
    }

    // console.log("active badge id", activeBadgeIds);
    let allList = this.props.cohortState?.cardList; //all data
    let sortedList = [];
    let uniqueitems = [];

    allList &&
      allList?.map((item) => {
        item?.wallet_address_details?.map((address) => {
          address?.chains?.map((chain) => {
            if (
              activeBadgeIds.includes(chain.id) &&
              !uniqueitems.includes(item.id)
            ) {
              sortedList.push(item);
              uniqueitems.push(item.id);
            }
          });
        });
      });

    // this.setState({
    //   sortedList:
    //     activeBadgeIds.length === 0
    //       ? allList
    //       : sortedList.length === 0
    //       ? ""
    //       : sortedList,
    // });
    // console.log("kjejhfe",allList ,sortedList, activeBadgeIds)
    let value =
      activeBadgeIds.length === 0
        ? allList
        : sortedList.length === 0
        ? ""
        : sortedList;
    this.props.updateCohort(value);
  };

  // sortByAmount = ()

  sortbyUserid = () => {
    const sortedData = this.props.cohortState?.sortedList.sort((a, b) => {
      // Compare the user_id property of each object
      const userA = a.user_id !== null;
      const userB = b.user_id !== null;

      // If both objects have a user_id, sort them by the user_id value
      if (userA && userB) {
        return a.user_id.localeCompare(b.user_id);
      }

      // If only one of the objects has a user_id, put it first
      if (userA) {
        return -1;
      }
      if (userB) {
        return 1;
      }

      // If neither object has a user_id, maintain their original order
      return a.id - b.id;
    });

    return sortedData;
  };

  handleSearch = (event) => {
    // console.log(
    //   "search",
    //   event.target.value,
    //   this.props.cohortState?.sortedList
    // );
    this.setState({ search: event.target.value });
    let filteredItems = [];

    if (!event.target.value) {
      // console.log("show")
      this.props.updateCohort(this.props.cohortState?.cardList);
      this.setState({
        searchNotFound: false,
      });
    } else {
      filteredItems = this.props?.cohortState?.sortedList?.filter((item) =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase())
      );

      this.props.updateCohort(filteredItems);
      if (filteredItems.length === 0) {
        this.setState({
          searchNotFound: true,
        });
        // console.log("show true");
      } else {
        this.setState({
          searchNotFound: false,
        });
        // console.log("show false");
      }
    }
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  CheckApiResponseWallet = (value) => {
   

    this.props.setPageFlagDefault();
  
  };

  render() {
    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                // handleUpdate={this.handleUpdateWallet}
              />
            </div>
          </div>
        </div>
        <div className="cohort-page-section m-t-80">
          {/* <Sidebar ownerName="" /> */}
          {this.state.upgradeModal && (
            <UpgradeModal
              show={this.state.upgradeModal}
              onHide={this.upgradeModal}
              history={this.props.history}
              isShare={localStorage.getItem("share_id")}
              isStatic={this.state.isStatic}
              triggerId={this.state.triggerId}
              pname="cohort-page"
            />
          )}

          {this.state.cohortModal ? (
            <ExitOverlay
              show={this.state.cohortModal}
              // link="http://loch.one/a2y1jh2jsja"
              onHide={this.handleCohort}
              history={this.props.history}
              modalType={"cohort"}
              iconImage={CohortIcon}
              headerTitle={"Create a whale pod"}
              changeWalletList={this.handleChangeList}
              apiResponse={(e) => this.CheckApiResponse(e)}
              total_addresses={this.props.cohortState?.total_addresses}
            />
          ) : this.state.RegisterModal ? (
            <ExitOverlay
              show={this.state.RegisterModal}
              // link="http://loch.one/a2y1jh2jsja"
              onHide={this.AddEmailModal}
              history={this.props.history}
              modalType={"create_account"}
              iconImage={CohortIcon}
              isSkip={() => this.handleSkip()}

              // headerTitle={"Create a Wallet cohort"}
              // changeWalletList={this.handleChangeList}
              // apiResponse={(e) => this.CheckApiResponse(e)}
            />
          ) : (
            ""
          )}

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
              // changeWalletList={this.handleChangeList}
              apiResponse={(e) => {
                this.CheckApiResponseWallet(e)
               
              }}
              from="transaction history"
            />
          )}

          {this.state.isEditModal ? (
            <ExitOverlay
              show={this.state.isEditModal}
              // link="http://loch.one/a2y1jh2jsja"
              onHide={this.handleEdit}
              history={this.props.history}
              modalType={"cohort"}
              headerTitle={this.state.editItemName}
              isEdit={true}
              changeWalletList={this.handleChangeList}
              apiResponse={(e) => this.CheckApiResponse(e)}
              walletaddress={this.state.editWalletAddressList}
              addedon={moment(this.state?.createOn).format("MM/DD/YY")}
              cohortId={this.state.editcohortId}
              chainImages={this.state?.chainImages}
              total_addresses={this.props.cohortState?.total_addresses}
              totalEditAddress={this.state.editWalletAddressList?.length}
            />
          ) : (
            ""
          )}

          <div className="cohort-section page">
            <PageHeader
              title="Pods"
              subTitle="Track all your whale pods here"
              btnText="Create a pod"
              handleBtn={this.handleCohort}
              handleSearch={this.handleSearch}
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
              <div className="page-search-wrapper">
                <Image src={SearchIcon} />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={this.handleSearch}
                  className="page-search-input"
                />
              </div>
            </div>
            {/* card  */}
            {!this.state.searchNotFound ? (
              <Row style={{ minWidth: "91rem" }}>
                {this.props.cohortState?.sortedList?.length !== 0 &&
                this.props.cohortState?.sortedList !== "" ? (
                  this.sortbyUserid()?.map((item, i) => {
                    let sortedAddress = (item?.wallet_address_details).sort(
                      (a, b) => b.net_worth - a.net_worth
                    );
                    let sortedChains = [];
                    sortedAddress &&
                      sortedAddress?.map((e) => {
                        e.chains?.map((chain) => {
                          if (!sortedChains.includes(chain?.symbol)) {
                            sortedChains.push(chain?.symbol);
                          }
                        });
                      });
                    // if(item.name === "test")
                    //   console.log("sort", sortedChains)
                    return (
                      <Col
                        md={4}
                        style={{ padding: "10px", marginBottom: "1rem" }}
                        key={item.id}
                      >
                        <PodCard
                          item={item}
                          total_addresses={
                            this.props.cohortState?.total_addresses
                          }
                          index={i}
                          handleEdit={this.handleEdit}
                          history={this.props.history}
                        />
                      </Col>
                    );
                  })
                ) : this.props.cohortState?.sortedList !== "" ? (
                  <Col md={12}>
                    <div className="animation-wrapper">
                      <Loading />
                    </div>
                  </Col>
                ) : (
                  <div
                    className="animation-wrapper"
                    style={{
                      width: "100%",
                      height: "20rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <h3 className="inter-display-medium f-s-16 lh-19 grey-313">
                      No data found
                    </h3>
                  </div>
                )}
              </Row>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  cohortState: state.CohortState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  getAllCoins,
  searchCohort,
  updateCohort,
  setPageFlagDefault
};
Cohort.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Cohort);
