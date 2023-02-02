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
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
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
import moment from "moment";
import CustomChip from "../../utils/commonComponent/CustomChip";
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
      chainImages:[],
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
   

    if (this.state.apiResponse) {
      // console.log("update");
      this.makeApiCall();
      this.setState({
        apiResponse: false,
      });
    }
  }

  handleCohort = () => {
    // console.log("cohort click");
    const isDummy = localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(localStorage.getItem("lochUser"));
    // console.log("skip", this.state.skip)
  
    if (islochUser || this.state.skip) {
      // console.log("loch user");
      this.setState(
        {
          RegisterModal: false,
          skip: true,
        },
        () => {
          this.setState({
            cohortModal: !this.state.cohortModal,
          });
        }
      );
    } else if (isDummy && !this.state.skip) {
      // console.log("create account");
      this.setState({
        RegisterModal: !this.state.RegisterModal,
        cohortModal: false,
      });
    } 
   
  };

  handleEdit = (i,images) => {
    let walletList = this.state?.sortedList;
    this.setState({
      isEditModal: !this.state.isEditModal,
      createOn: walletList[i]?.created_on,
      editItemName: walletList[i]?.name,
      editWalletAddressList: walletList[i]?.wallet_address_details,
      editcohortId: walletList[i]?.id,
      chainImages: images
    });
  };

  handleChangeList = (value) => {
    this.setState({
      isLoading: true,
      cardList: [],
      sortedList:[],
    });
    // this.makeApiCall();
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
      this.sortArray("total_net_worth", isDown);
      this.setState({
        sortBy: sort,
      });
     
    } else if (e.title === "Date added") {
      this.sortArray("created_on", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Name") {
      this.sortArray("name", isDown);
      this.setState({
        sortBy: sort,
      });
    }

    
  };

  handleFunction = (badge) => {
    let newArr = [...this.state.activeBadge];
    let activeBadgeIds = [];
    if (this.state.activeBadge.some((e) => e.name === badge.name)) {
      let index = newArr.findIndex((x) => x.name === badge.name);
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        this.setState({
          activeBadge: [{ name: "All", id: "" }],
         
        });
         activeBadgeIds= [];
      } else {
        this.setState({
          activeBadge: newArr,
         
        });
        activeBadgeIds= newArr?.map(e => e.id);
      }
    } else if (badge.name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
       
      });
      activeBadgeIds= [];
    } else {
      let index = newArr.findIndex((x) => x.name === "All");
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.push(badge);
      this.setState({
        activeBadge: newArr,
      });
      activeBadgeIds= newArr?.map((e) => e.id);
    }

    // console.log("active badge id", activeBadgeIds);
    let allList = this.state?.cardList; //all data
    let sortedList = [];
    let uniqueitems = [];

    allList && allList?.map((item) => {
      item?.wallet_address_details?.map((address) => {
        address?.chains?.map((chain) => {
          if (activeBadgeIds.includes(chain.id) && !uniqueitems.includes(item.id)) {
            sortedList.push(item);
            uniqueitems.push(item.id);
          }
        })
      })
    });

    this.setState({
      sortedList: activeBadgeIds.length === 0 ? allList : sortedList,
    });

  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // console.log("api respinse", value);
  };

  handleSkip = () => {
    // console.log("handle skip")
    this.setState({
      skip:true,
    }, () => {
       this.handleCohort();
    });
  }

  // sortByAmount = ()

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
            apiResponse={(e) => this.CheckApiResponse(e)}
          />
        ) : this.state.RegisterModal ? (
          <ExitOverlay
            show={this.state.RegisterModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.handleCohort}
            history={this.props.history}
              modalType={"create_account"}
              isSkip={()=> this.handleSkip()}
            // headerTitle={"Create a Wallet cohort"}
            // changeWalletList={this.handleChangeList}
            // apiResponse={(e) => this.CheckApiResponse(e)}
          />
        ) : (
          ""
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
            addedon={moment(this.state?.createOn).format("DD/MM/YY")}
            cohortId={this.state.editcohortId}
            chainImages={this.state?.chainImages}
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
            {this.state?.sortedList?.length !== 0  ? (
              this.state?.sortedList?.map((item, i) => {
                let sortedAddress = (item?.wallet_address_details).sort(
                  (a, b) => b.net_worth - a.net_worth
                );
                // let sortedChains = sortedAddress[0]?.chains
                //   ?.sort((a, b) => (a.name > b.name ? 1 : -1))
                //   ?.map((e) => e?.symbol);
                
                
                let sortedChains = [];
                sortedAddress && sortedAddress?.map((e => {
                  e.chains?.map((chain) => {
                    if (!sortedChains.includes(chain?.symbol)) {
                      sortedChains.push(chain?.symbol);
                    }
                  })
                }));
                // console.log("images", sortedChains);

                
                
                return (
                  <Col
                    md={4}
                    style={{ padding: "10px", marginBottom: "1rem" }}
                    key={item.id}
                  >
                    <div
                      className="cards"
                      style={{
                        background: "#FFFFFF",
                        boxShadow:
                          "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                        borderRadius: "16px",
                        // marginBottom: "3rem",
                        // height: "100%",
                        height: "38.5rem",
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
                          justifyContent: "flex-start",
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            background: "#FFFFFF",
                            boxShadow:
                              "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                            borderRadius: "12px",
                            padding: `${
                              sortedChains?.length === 0 ? "0px" : "6px"
                            }`,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            width: `${
                              sortedChains?.length === 0 ? "5rem" : "6rem"
                            }`,
                            marginRight: "1.2rem",
                          }}
                        >
                          {sortedChains?.length === 0 ? (
                            <Image
                              src={unrecognizedIcon}
                              style={{
                                width: "5rem",
                                borderRadius: "12px",
                              }}
                            />
                          ) : (
                            <>
                              <Image
                                src={sortedChains[0]}
                                style={{
                                  margin: "0px 4px 4px 0px",
                                  width: "2.2rem",
                                  borderRadius: "0.6rem",
                                }}
                              />
                              <Image
                                src={sortedChains[1]}
                                style={{
                                  margin: "0px 0px 4px 0px",
                                  width: "2.2rem",
                                  borderRadius: "0.6rem",
                                }}
                              />
                              <Image
                                src={sortedChains[2]}
                                style={{
                                  margin: "0px 4px 0px 0px",
                                  width: "2.2rem",
                                  borderRadius: "0.6rem",
                                }}
                              />
                              {sortedChains?.length < 5 ? (
                                <Image
                                  src={sortedChains[3]}
                                  style={{
                                    margin: "0px 0px 0px 0px",
                                    width: "2.2rem",
                                    borderRadius: "0.6rem",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    margin: "0px 0px 0px 0px",
                                    height: "2.2rem",
                                    width: "2.2rem",
                                    borderRadius: "0.6rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(229, 229, 230, 0.5)",
                                  }}
                                  className="inter-display-semi-bold f-s-10"
                                >
                                  {sortedChains?.length - 3}+
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {/* title*/}
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            this.props.history.push({
                              pathname: `/cohort/${item.slug}`,
                              state: {
                                id: item.id,
                                cohortWalletList: item?.wallet_address_details,
                                chainImages: sortedChains,
                              },
                            })
                          }
                        >
                          <h4 className="inter-display-medium f-s-16 l-h-19 black-000">
                            {item.name}
                          </h4>
                          <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                            {/* {CurrencyType(false)} */}
                            {numToCurrency(
                              item.total_net_worth * this.state.currency?.rate
                            )}{" "}
                            <span className="f-s-10 grey-CAC">
                              {CurrencyType(true)}
                            </span>
                          </h4>
                        </div>
                        {/* edit icon */}
                        {item.name != "Loch Template Whales" && (
                          <Image
                            src={EditIcon}
                            className="cp editIcon"
                            onClick={() => this.handleEdit(i, sortedChains)}
                            style={{ marginLeft: "auto" }}
                          />
                        )}
                      </div>
                      {/* Top Section END */}
                      {/* Bottom Section Address list */}
                      <div>
                        {/* List Item */}
                        {sortedAddress?.slice(0, 5)?.map((e, i) => {
                          let fulladdress =
                            e?.display_address && e?.display_address != ""
                              ? e?.display_address
                              : e?.wallet_address;
                          let address = fulladdress;
                          if (fulladdress.length > 13) {
                            address =
                              fulladdress.substr(0, 5) +
                              "..." +
                              fulladdress.substr(
                                fulladdress.length - 4,
                                fulladdress.length
                              );
                          }
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "1.5rem",
                                borderBottom: `${
                                  i === 4
                                    ? "none"
                                    : "1px solid rgba(229, 229, 230, 0.5)"
                                }`,
                              }}
                              key={i}
                            >
                              <h4 className="inter-display-regular f-s-16 l-h-19 black-191">
                                {address}
                              </h4>

                              {/* chip */}
                              {/* <CoinChip
                                  colorCode={"#E84042"}
                                  coin_img_src={Coin}
                                  coin_percent={"Avalanche"}
                                  type={"cohort"}
                                /> */}
                              <CustomChip
                                coins={e.chains}
                                key={i}
                                isLoaded={true}
                                isCohort={true}
                              ></CustomChip>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col md={12}>
                <div className="animation-wrapper">
                  <Loading />
                </div>
              </Col>
            )}
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
