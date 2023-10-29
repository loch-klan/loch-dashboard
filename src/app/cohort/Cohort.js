import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import CoinBadges from "./../common/CoinBadges";
import { getAllCoins } from "../onboarding/Api.js";
import CohortIcon from "../../assets/images/icons/active-cohort.svg";
import SearchIcon from "../../assets/images/icons/search-icon.svg";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { Col, Image, Row } from "react-bootstrap";
import Loading from "../common/Loading";
import { getAllWalletListApi } from "../wallet/Api";
import {
  CreateWhalePod,
  PageViewWhale,
  TimeSpentWhalePod,
  WhaleFilterByChain,
  WhaleSearch,
  WhaleSortByAmt,
  WhaleSortByDate,
  WhaleSortByName,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { UpgradeTriggered } from "../../utils/ReusableFunctions";
import ExitOverlay from "../common/ExitOverlay";
import { searchCohort, updateCohort } from "./Api";
import moment from "moment";
import UpgradeModal from "../common/upgradeModal";
import {
  GetAllPlan,
  getUser,
  TopsetPageFlagDefault,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import PodCard from "./pod-card";
import WelcomeCard from "../Portfolio/WelcomeCard";
class Cohort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
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
      userPlan:
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      total_addresses: 0,
      search: "",
      sortedItem: [],
      isUpdate: 0,
      startTime: "",
      localCohortState: [],
    };
  }
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageViewWhale({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkWhalePodTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    this.props?.TopsetPageFlagDefault();
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const pod = params.get("create-pod");
    if (pod) {
      this.handleCohort();
      this.props.history.replace("/whale-watch");
    }

    this.props.getAllCoins();
    this.makeApiCall();
    this.props.GetAllPlan();
    this.props.getUser();

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
    this.startPageView();
    this.updateTimer(true);
    if (this.props.cohortState) {
      this.setState({
        localCohortState: this.props.cohortState,
      });
    }
    return () => {
      clearInterval(window.checkWhalePodTimer);
    };
  }

  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "whalePodPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("whalePodPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkWhalePodTimer);
    window.sessionStorage.removeItem("whalePodPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000;

      TimeSpentWhalePod({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "whalePodPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };

  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "whalePodPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.cohortState &&
      this.props.cohortState !== prevProps.cohortState
    ) {
      this.setState({
        localCohortState: this.props.cohortState,
      });
    }
    if (this.state.apiResponse) {
      // console.log("update");
      this.makeApiCall();
      this.setState({
        apiResponse: false,
      });
    }
    if (!this.props.commonState.whaleWatch) {
      this.props.updateWalletListFlag("whaleWatch", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });
  };

  handleCohort = () => {
    // console.log("cohort click");
    // const isDummy = window.sessionStorage.getItem("lochDummyUser");
    // const islochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));

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
        this.updateTimer();
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

    // this.props.updateCohort([]);
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
    let array = this.state.localCohortState?.sortedList; //all data
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
    this.setState({
      localCohortState: {
        ...this.props?.cohortState,
        sortedList: sortedList,
      },
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
      this.sortArray("total_net_worth", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByAmt({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
      this.updateTimer();
    } else if (e.title === "Date added") {
      this.sortArray("created_on", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByDate({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
      this.updateTimer();
    } else if (e.title === "Name") {
      this.sortArray("name", isDown);
      this.setState({
        sortBy: sort,
      });
      WhaleSortByName({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
      this.updateTimer();
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
    this.updateTimer();

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
    let allList = this.state.localCohortState?.cardList; //all data
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

    this.setState({
      localCohortState: {
        ...this.props?.cohortState,
        sortedList: value,
      },
    });
  };

  // sortByAmount = ()

  sortbyUserid = () => {
    if (this.state.localCohortState.sortedList) {
      const tempSortedData = this.state.localCohortState.sortedList.sort(
        (a, b) => {
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
        }
      );

      return tempSortedData;
    }
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

      this.setState({
        localCohortState: {
          ...this.props?.cohortState,
          sortedList: filteredItems,
        },
      });
      this.timeout = setTimeout(() => {
        WhaleSearch({
          email_address: getCurrentUser().email,
          session_id: getCurrentUser().id,
          searched_for: event.target.value,
        });
      }, 1000);
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
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                // handleUpdate={this.handleUpdateWallet}
                updateTimer={this.updateTimer}
                hideButton
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
              isShare={window.sessionStorage.getItem("share_id")}
              isStatic={this.state.isStatic}
              triggerId={this.state.triggerId}
              pname="cohort-page"
              updateTimer={this.updateTimer}
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
              updateTimer={this.updateTimer}
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
              updateTimer={this.updateTimer}
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
                this.CheckApiResponseWallet(e);
              }}
              from="transaction history"
              updateTimer={this.updateTimer}
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
              updateTimer={this.updateTimer}
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
              updateTimer={this.updateTimer}
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
                  value={this.state.search}
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
                          updateTimer={this.updateTimer}
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
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  getAllCoins,
  searchCohort,
  updateCohort,
  setPageFlagDefault,
  TopsetPageFlagDefault,
  getAllWalletListApi,
  updateWalletListFlag,
  getUser,
  GetAllPlan,
};
Cohort.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Cohort);
