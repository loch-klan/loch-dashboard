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
  PodType,
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
import { getPodStatus, searchCohort } from "./Api";
import moment from "moment";
import CustomChip from "../../utils/commonComponent/CustomChip";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

import InfoIcon from "../../assets/images/icons/info-icon.svg";

class PodCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      isIndexed: false,
      podId: this.props.item?.id,
      upgradeModal: false,
      isStatic: false,
      triggerId: 3,
    };
  }
  timeoutId;

  componentDidMount() {
    if (!this.props.item.indexed) {
      this.getPodStatusFunction();
    } else {
      this.setState({
        isIndexed: true,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  componentDidUpdate(prevProps, prevState) {}

  getPodStatusFunction = () => {
    const data = new URLSearchParams();
    data.append("cohort_id", this.state.podId);
    getPodStatus(data, this);
    this.timeoutId = setTimeout(() => {
      if (!this.state.isIndexed) {
        this.getPodStatusFunction();
      }
    }, 2000);
  };

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  render() {
    const { item, total_addresses, index } = this.props;
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

    // console.log(item)

    // let cardType = item.user_id
    //   ? "MANUALLY CREATED"
    //   : item.is_recommended
    //   ? "RECOMMENDED"
    //   : "INFLUENCER";
    // let popupmsg = "";

    // if (item.user_id) {
    //   cardType = "MANUALLY CREATED";
    //   popupmsg = "These addresses were added by you.";
    // } else if (item.is_recommended) {
    //   cardType = "RECOMMENDED";
    //   popupmsg =
    //     "These addresses were dynamically generated by Loch based on your activity and portfolio.";
    // } else {
    //   cardType = "INFLUENCER";
    //   popupmsg = "Most widely followed wallet addresses on the internet.";
    // }
    return (
      <>
        <div
          className="cohort-card"
          style={{
            background: "#FFFFFF",
            boxShadow:
              "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
            borderRadius: "16px",
            // marginBottom: "3rem",
            // height: "100%",
            height: "42.5rem",
            zIndex: 1,
            overflow: "hidden",
          }}
          onMouseEnter={() => {
            WhaleHoverPod({
              email_address: getCurrentUser().email,
              session_id: getCurrentUser().id,
              pod_name: item?.name,
            });
          }}
          onClick={() => {
            if (this.state.isIndexed) {
              if (PodType.INFLUENCER === item?.cohort_type) {
                let isAccess = JSON.parse(localStorage.getItem("whalepodview"));

                if (
                  isAccess?.access ||
                  isAccess?.id == item?.id ||
                  this.state.userPlan?.influencer_pod_limit == -1
                ) {
                  // if true
                  localStorage.setItem(
                    "whalepodview",
                    JSON.stringify({ access: false, id: item.id })
                  );
                  WhaleExpandedPod({
                    email_address: getCurrentUser().email,
                    session_id: getCurrentUser().id,
                    pod_name: item?.name,
                  });
                  this.props.history.push({
                    pathname: `/whale-watch/${item?.slug}`,
                    state: {
                      id: item?.id,
                      cohortWalletList: item?.wallet_address_details,
                      chainImages: sortedChains,
                      total_addresses: total_addresses,
                    },
                  });
                } else {
                  //  upgrade modal
                  this.upgradeModal();
                }
              } else {
                WhaleExpandedPod({
                  email_address: getCurrentUser().email,
                  session_id: getCurrentUser().id,
                  pod_name: item?.name,
                });
                this.props.history.push({
                  pathname: `/whale-watch/${item?.slug}`,
                  state: {
                    id: item?.id,
                    cohortWalletList: item?.wallet_address_details,
                    chainImages: sortedChains,
                    total_addresses: total_addresses,
                  },
                });
              }
            }
          }}
        >
          {/* Top Label */}
          <div
            style={{
              background: "rgba(229, 229, 230, 0.5)",
              borderWidth: "1px 0px",
              borderStyle: "solid",
              borderColor: "rgba(229, 229, 230, 0.5)",
              height: "2.5rem",
              margin: "1.2rem 0rem -1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 className="inter-display-semi-bold f-s-10 l-h-12 black-191">
              {PodType.getText(item?.cohort_type)?.name}
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={PodType.getText(item?.cohort_type)?.description}
                className={"pod-width"}
              >
                <Image
                  src={InfoIcon}
                  className="info-icon"
                  style={{
                    width: "1.2rem",
                    marginTop: "-2.5px",
                    marginLeft: "0.4rem",
                  }}
                  // onMouseEnter={this.privacymessage}
                />
              </CustomOverlay>
            </h4>
          </div>
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
                padding: `${sortedChains?.length === 0 ? "0px" : "6px"}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: `${sortedChains?.length === 0 ? "5rem" : "6.2rem"}`,
                height: `${sortedChains?.length === 0 ? "5rem" : "6.2rem"}`,
                marginRight: "1.2rem",
                flexShrink: 0,
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
                      margin: `${
                        sortedChains?.length === 1 ? "0px" : "0px 4px 4px 0px"
                      }`,
                      width: `${
                        sortedChains?.length === 1 ? "4rem" : "2.2rem"
                      }`,
                      borderRadius: "0.6rem",
                    }}
                  />
                  {sortedChains?.length !== 1 && (
                    <Image
                      src={sortedChains?.length === 2 ? "" : sortedChains[1]}
                      style={{
                        margin: "0px 0px 4px 0px",
                        width: "2.2rem",
                        borderRadius: "0.6rem",
                      }}
                    />
                  )}
                  {sortedChains?.length !== 1 && (
                    <Image
                      src={sortedChains[2]}
                      style={{
                        margin: "0px 4px 0px 0px",
                        width: "2.2rem",
                        borderRadius: "0.6rem",
                      }}
                    />
                  )}
                  {sortedChains?.length <= 4 && sortedChains?.length !== 1 && (
                    <Image
                      src={
                        sortedChains?.length === 2
                          ? sortedChains[1]
                          : sortedChains[3]
                      }
                      style={{
                        margin: "0px 0px 0px 0px",
                        width: "2.2rem",
                        borderRadius: "0.6rem",
                      }}
                    />
                  )}
                  {sortedChains?.length > 4 && sortedChains?.length !== 1 && (
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
                minWidth: !this.state.isIndexed ? "calc(100% - 7rem)" : "10rem",
              }}
            >
              <h4 className="inter-display-medium f-s-16 l-h-19 black-000">
                {item.name}
              </h4>
              {this.state.isIndexed && (
                <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                  {/* {CurrencyType(false)} */}
                  {numToCurrency(
                    item?.total_net_worth * this.state.currency?.rate
                  )}{" "}
                  <span className="f-s-10 grey-CAC">{CurrencyType(true)}</span>
                </h4>
              )}
              {!this.state.isIndexed && (
                <>
                  <h4 className="inter-display-medium f-s-16 l-h-19 grey-7C7">
                    Indexing...
                  </h4>
                  <div
                    className="upload-loader"
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  ></div>
                </>
              )}
            </div>
            {/* edit icon */}
            {item?.user_id && this.state.isIndexed && (
              <Image
                src={EditIcon}
                className="cp editIcon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (this.state.isIndexed) {
                    this.props.handleEdit(index, sortedChains);
                  }
                }}
                style={{ marginLeft: "auto", zIndex: 99 }}
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
                      i === 4 ? "none" : "1px solid rgba(229, 229, 230, 0.5)"
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
                  {e.chains.length != 0 && (
                    <CustomChip
                      coins={e.chains}
                      key={i}
                      isLoaded={true}
                      isCohort={true}
                    ></CustomChip>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
            pname="pod-card"
          />
        )}
      </>
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
PodCard.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(PodCard);
