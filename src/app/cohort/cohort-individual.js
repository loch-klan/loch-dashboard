import React, { Component } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import { CreateUpdateNotification, getAllInsightsApi, getCohort, GetLargestAsset, GetLargestVolumeBought, GetLargestVolumeSold, GetNotification, GetPurchasedAsset, GetSoldAsset, UpdateCohortNickname } from "./Api";
import { AmountType, DormantType, InsightType } from "../../utils/Constant";
import Loading from "../common/Loading";
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import TransactionIcon from "../../image/TransactionHistoryIcon.svg";

import netWorthIcon from "../../assets/images/icons/total-net-dark.svg";
import BellIcon from "../../assets/images/icons/bell.svg";
import BellIconColor from "../../assets/images/icons/bell-color.svg";
import VerticalIcon from "../../assets/images/icons/veritcal-line.svg";
import TrendIcon from "../../assets/images/icons/trending-up.svg";

import ClockIcon from "../../assets/images/icons/clock.svg";
import PlusIcon from "../../assets/images/icons/plus-circle.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import { BarGraphFooter } from "../common/BarGraphFooter";
import { CurrencyType, loadingAnimation, numToCurrency } from "../../utils/ReusableFunctions";
import CoinChip from "../wallet/CoinChip";
import Coin from "../../assets/images/coin-ava.svg";
import GlobeIcon from "../../assets/images/icons/globe.svg";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import EditIcon from "../../assets/images/EditIcon.svg";
import ArrowRight from "../../assets/images/icons/ArrowRight.svg";
import CartIcon from "../../assets/images/icons/cart-dark.svg";
import TokenIcon from "../../assets/images/icons/token-dark.svg";
import MedalIcon from "../../assets/images/icons/medal-dark.svg";
import StarIcon from "../../assets/images/icons/star-dark.svg";
import ExitOverlay from "../common/ExitOverlay";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import { toast } from "react-toastify";
import DropDown from "../common/DropDown";
import EditWalletModal from "../wallet/EditWalletModal";
import checkIcon from "../../assets/images/icons/check-cohort.svg";
import moment from "moment";
import CohortIcon from "../../assets/images/icons/active-cohort.svg";
import AuthModal from "../common/AuthModal";
import { NotificationAmount, NotificationCheckbox1, NotificationCheckbox2, NotificationDays, NotificationDropdown1, NotificationDropdown2, NotificationSaved, PodNickname, WhaleCreateAccountModal, WhaleCreateAccountSkip, WhaleExpandedPodFilter } from "../../utils/AnalyticsFunctions";


class CohortPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    console.log(userDetails);
    this.state = {
      isLochUser: userDetails,
      activeFooter: 0,
      cohortModal: false,
      updateEmail: userDetails?.email ? true : false,
      email: userDetails?.email ? userDetails?.email : "",
      title: "$1,000.00",
      titleday: ">30 days",
      edit: false,
      walletNotification: false,
      dayNotification: false,
      showBtn: false,
      isEmailValid: false,
      cohortId: props?.location?.state.id,
      cohortName: "",
      cohortSlug: "",
      cohortWalletAddress: props?.location?.state?.cohortWalletList,
      chainImages: props?.location?.state?.chainImages,
      walletAddresses: [],
      totalNetWorth: 0,
      createOn: "",
      frequentlyPurchasedAsset: "",
      frequentlySoldAsset: "",
      largestHoldingChain: "",
      PurchasedAssetLoader: false,
      SoldAssetLoader: false,
      LargestChainLoader: false,
      apiResponse: false,
      LargestAsset: "",
      LargestAssetLoader: false,
      LargestValue: 0,
      SoldVolumeLoader: false,
      VolumeBoughtLoader: false,
      LargestSoldVolume: "",
      LargestBoughtVolume: "",
      notificationId: false,
      RegisterModal: false,
      skip: false,
    };
  }

  AddEmailModal = () => {
    // console.log("handle emailc close");
    const isDummy = localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(localStorage.getItem("lochUser"));
    if (islochUser || this.state.skip) {
      this.setState({
        RegisterModal: false,
        email: islochUser?.email || "",
        updateEmail: true,
        isLochUser: islochUser,
      });
    } else {
      this.setState({
        RegisterModal: !this.state.RegisterModal,
        // showBtn: false,
        // updateEmail: false,
      });
    }
    if (this.state.RegisterModal) {
      WhaleCreateAccountModal({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        pod_name: this.state.cohortName,
      });
    }
  };

  handleSkip = () => {
    // console.log("handle skip")
    WhaleCreateAccountSkip({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      pod_name: this.state.cohortName,
    });
    this.setState(
      {
        skip: true,
      },
      () => {
        if (this.state.skip) {
          this.AddEmailModal();
        }
      }
    );
  };

  handleCohort = () => {
    // console.log("cohort click");
    this.setState({
      cohortModal: !this.state.cohortModal,
    });
  };
  componentDidMount() {
    this.getCohortDetail();
    this.getAssetData(0);
    this.getNotificationApi();

    setTimeout(() => {
      this.AddEmailModal();
    }, 2000);
  }
  getNotificationApi = () => {
    let data = new URLSearchParams();
    data.append("cohort_id", this.state.cohortId);
    GetNotification(data, this);
  };
  componentDidUpdate() {
    if (this.state.apiResponse) {
      this.getCohortDetail();
      this.getAssetData(0);
      this.setState({
        apiResponse: false,
      });
    }
  }

  getAssetData = (activeFooter) => {
    this.setState({
      PurchasedAssetLoader: true,
      SoldAssetLoader: true,
      LargestAssetLoader: true,
      SoldVolumeLoader: true,
      VolumeBoughtLoader: true,
    });
    // console.log("option", activeFooter);
    let startDate = moment().unix();
    let endDate;
    let handleSelected = "";
    if (activeFooter == "0") {
      startDate = "";
      endDate = "";
      handleSelected = "All";
    } else if (activeFooter == "1") {
      endDate = moment().subtract(5, "years").unix();
      handleSelected = "5 Years";
    } else if (activeFooter == "2") {
      endDate = moment().subtract(4, "years").unix();
      handleSelected = "4 Years";
    } else if (activeFooter == "3") {
      endDate = moment().subtract(3, "years").unix();
      handleSelected = "3 Years";
    } else if (activeFooter == "4") {
      endDate = moment().subtract(2, "years").unix();
      handleSelected = "2 Years";
    } else if (activeFooter == "5") {
      endDate = moment().subtract(1, "years").unix();
      handleSelected = "1 Year";
    } else if (activeFooter == "6") {
      endDate = moment().subtract(6, "months").unix();
      handleSelected = "6 months";
    } else if (activeFooter == "7") {
      endDate = moment().subtract(1, "month").unix();
      handleSelected = "1 month";
    } else if (activeFooter == "8") {
      endDate = moment().subtract(1, "week").unix();
      handleSelected = "1 week";
    } else if (activeFooter == "9") {
      endDate = moment().subtract(1, "day").unix();
      handleSelected = "1 day";
    }

    let data = new URLSearchParams();
    data.append("cohort_id", this.state.cohortId);
    data.append("start_datetime", endDate);
    data.append("end_datetime", startDate);

    // Analyics
    WhaleExpandedPodFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_period_selected: handleSelected,
    });
    // api for Get Sold Asset
    GetSoldAsset(data, this);
    // api for get purchased asset
    GetPurchasedAsset(data, this);

    // api for largest holding
    GetLargestAsset(data, this);

    // api for larget volumn bought
    GetLargestVolumeBought(data, this);

    // api for larget volumn sold
    GetLargestVolumeSold(data, this);
  };

  getCohortDetail = () => {
    this.setState({
      LargestChainLoader: true,
    });
    let data = new URLSearchParams();
    data.append("cohort_id", this.state.cohortId);
    getCohort(data, this);
  };

  handleFooter = (e) => {
    // console.log("e",e.target.id)
    this.setState(
      {
        activeFooter: e.target.id,
      },
      () => {
        this.getAssetData(this.state.activeFooter);
      }
    );
  };

  handleUpdateEmail = () => {
    this.setState(
      {
        // updateEmail: true,
        showBtn: true,
      },
      () => {
        this.AddEmailModal();
      }
    );
  };

  handleSave = () => {
    // console.log("save", this.state.email, this.state.isEmailValid);
    if (this.state.email !== "") {
      NotificationSaved({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        pod_name: this.state.cohortName,
        checked1: this.state.walletNotification,
        checked2: this.state.dayNotification,
        dropdown_name1: this.state.title,
        dropdown_name2: this.state.titleday,
      });
      let data = new URLSearchParams();
      data.append("cohort_id", this.state.cohortId);
      data.append("email", this.state.email);

      if (this.state.walletNotification) {
        data.append("amount_type", AmountType.getNumber(this.state.title));
      }

      if (this.state.dayNotification) {
        data.append("dormant_type", DormantType.getNumber(this.state.titleday));
      }
      if (this.state.notificationId) {
        data.append("whale_notification_id", this.state.notificationId);
      }
      //   console.log("amout", AmountType.getNumber(this.state.title));
      // console.log("dormant", DormantType.getNumber(this.state.titleday));

      CreateUpdateNotification(data, this);

      setTimeout(() => {
        this.setState({ showBtn: false });
      }, 2000);
    } else {
      toast.success("Please update your email");
    }
  };

  handleFunction = (e) => {
    const title = e.split(" ")[1];
    // console.log(e, title);
    this.setState(
      {
        title: title,
        showBtn: true,
      },
      () => {
        NotificationAmount({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          pod_name: this.state.cohortName,
          is_checked: this.state.walletNotification,
          amount_selected: title,
        });
      }
    );
  };

  handleFunctionDay = (e) => {
    const title = e.split(" ")[1] + " " + e.split(" ")[2];
    // console.log(e, title);
    this.setState(
      {
        titleday: title,
        showBtn: true,
      },
      () => {
        NotificationDays({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          pod_name: this.state.cohortName,
          is_checked: this.state.dayNotification,
          day_selected: title,
        });
      }
    );
  };

  copyLink = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Wallet Address has been copied");
  };

  handleShow = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  handleClickWallet = () => {
    // console.log("click check");
    this.setState(
      {
        walletNotification: !this.state.walletNotification,
        showBtn: true,
      },
      () => {
        NotificationAmount({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          pod_name: this.state.cohortName,
          is_checked: this.state.walletNotification,
          amount_selected: this.state.title,
        });
      }
    );

    //  toast.success("You will be receiving notifications");
  };

  handleClickDay = () => {
    this.setState(
      {
        dayNotification: !this.state.dayNotification,
        showBtn: true,
      },
      () => {
        NotificationDays({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          pod_name: this.state.cohortName,
          is_checked: this.state.dayNotification,
          day_selected: this.state.titleday,
        });
      }
    );
    //  toast.success("You will be receiving notifications");
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // console.log("api respinse", value);
  };

  handleChangeList = (value) => {
    this.setState({
      PurchasedAssetLoader: false,
      SoldAssetLoader: false,
      LargestChainLoader: false,
      LargestAssetLoader: false,
      SoldVolumeLoader: false,
      VolumeBoughtLoader: false,
    });
    // this.makeApiCall();
  };

  onSubmit = () => {};

  onSubmitNickname = (address,i) => {
     let data = new URLSearchParams();
     data.append("cohort_id", this.state.cohortId);
    data.append("wallet_address", address);
    data.append("nickname", this.state[`nickname-${i+1}`]);
    UpdateCohortNickname(data, this);
    
    PodNickname({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      pod_name: this.state.cohortName,
      pod_id: this.state.cohortId,
      nickname: this.state[`nickname-${i + 1}`],
      address:address
    });
  };

  render() {
    const nav_list = window.location.pathname.split("/");
    let PageName = nav_list[2].replace(/-/g, " ");
    function toTitleCase(str) {
      return str
        .toLowerCase()
        .split(" ")
        .map(function (val) {
          return val.slice(0, 1).toUpperCase() + val.slice(1);
        })
        .join(" ");
    }
    PageName = toTitleCase(PageName);

    // console.log("nav list", nav_list, PageName);
    const chips = [
      {
        chain: {
          symbol: Coin,
          name: "Avalanche",
          color: "#E84042",
        },
      },
      {
        chain: {
          symbol: Coin,
          name: "Avalanche",
          color: "#E84042",
        },
      },
      {
        chain: {
          symbol: Coin,
          name: "Avalanche",
          color: "#E84042",
        },
      },
      {
        chain: {
          symbol: Coin,
          name: "Avalanche",
          color: "#E84042",
        },
      },
    ];

    return (
      <div className="insights-section m-b-80">
        {this.state.cohortModal ? (
          <ExitOverlay
            show={this.state.cohortModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.handleCohort}
            history={this.props.history}
            modalType={"cohort"}
            headerTitle={
              this.state.cohortName ? this.state.cohortName : PageName
            }
            isEdit={true}
            chainImages={this.state?.chainImages}
            cohortId={this.state.cohortId}
            walletaddress={this.state.walletAddresses}
            addedon={moment(this.state?.createOn).format("DD/MM/YY")}
            changeWalletList={this.handleChangeList}
            apiResponse={(e) => this.CheckApiResponse(e)}
          />
        ) : (
          ""
        )}
        {this.state.RegisterModal ? (
          <AuthModal
            show={this.state.RegisterModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.AddEmailModal}
            history={this.props.history}
            modalType={"create_account"}
            iconImage={CohortIcon}
            isSkip={() => this.handleSkip()}
            hideSkip={this.state.showBtn ? true : false}
            // headerTitle={"Create a Wallet cohort"}
            // changeWalletList={this.handleChangeList}
            // apiResponse={(e) => this.CheckApiResponse(e)}
          />
        ) : (
          ""
        )}

        <div className="insights-page page">
          <PageHeader
            title={this.state.cohortName ? this.state.cohortName : PageName}
            subTitle={`
              Added ${moment(this.state?.createOn).format("DD/MM/YY")}`}
            showpath={true}
            currentPage={nav_list[2]}
            btnText={PageName !== "Loch Whale Template" ? "Edit" : false}
            history={this.props.history}
            btnOutline={true}
            handleBtn={this.handleCohort}
            multipleImg={this.state?.chainImages.slice(0, 4)}
          />

          <Row className="m-t-40 m-b-40">
            <Col md={4} style={{ paddingRight: "0.8rem" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <Image src={netWorthIcon} className="net-worth-icon" />
                  <h3 className="inter-display-medium f-s-18 lh-22 m-l-12">
                    Total
                    <br />
                    net worth
                  </h3>
                </div>
                <h3
                  className="space-grotesk-medium f-s-24 lh-29"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {CurrencyType(false)}
                  {numToCurrency(this.state.totalNetWorth)}
                  <span className="inter-display-semi-bold f-s-12 grey-ADA m-l-4">
                    {/* {" "} */}
                    {CurrencyType(true)}
                  </span>
                </h3>
              </div>
            </Col>
            <Col
              md={4}
              style={{ paddingRight: "0.8rem", paddingLeft: "0.8rem" }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <Image src={StarIcon} className="net-worth-icon" />
                  <h3 className="inter-display-medium f-s-18 lh-22 m-l-12">
                    Average <br />
                    net worth
                  </h3>
                </div>

                <h3
                  className="space-grotesk-medium f-s-24 lh-29"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {CurrencyType(false)}
                  {numToCurrency(
                    this.state.totalNetWorth / this.state.walletAddresses.length
                  )}
                  <span className="inter-display-semi-bold f-s-12 grey-ADA m-l-4">
                    {CurrencyType(true)}
                  </span>
                </h3>
              </div>
            </Col>
            <Col md={4} style={{ paddingLeft: "0.8rem" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <Image src={MedalIcon} className="net-worth-icon" />
                  <h3 className="inter-display-medium f-s-18 lh-22 m-l-12">
                    Largest
                    <br />
                    holding
                  </h3>
                </div>

                <div style={{ height: "1.7rem", width: "max-content" }}>
                  {this.state?.largestHoldingChain &&
                  !this.state.LargestChainLoader ? (
                    // <CoinChip
                    //   colorCode={this.state?.largestHoldingChain?.color}
                    //   coin_img_src={this.state?.largestHoldingChain?.symbol}
                    //   coin_percent={this.state?.largestHoldingChain?.name}
                    //   type={"cohort"}
                    // />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Image
                        src={this.state?.largestHoldingChain?.symbol}
                        style={{ width: "1.7rem" }}
                      />
                      <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                        {this.state?.largestHoldingChain?.name}
                      </h3>
                    </div>
                  ) : this.state.LargestChainLoader ? (
                    loadingAnimation()
                  ) : (
                    <h3 className="inter-display-medium f-s-13 lh-15">
                      No movement
                    </h3>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Net worth end */}

          <h2
            className="inter-display-medium f-s-20 lh-20 black-191 m-b-24"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Image src={TrendIcon} style={{ marginRight: "1.2rem" }} /> Trends
          </h2>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "1.6rem",
            }}
          >
            <BarGraphFooter
              cohort={true}
              handleFooterClick={this.handleFooter}
              active={this.state.activeFooter}
              footerLabels={[
                "Max",
                "5Y",
                "4Y",
                "3Y",
                "2Y",
                "1Y",
                "6M",
                "1M",
                "1 Week",
                "1 Day",
              ]}
            />
          </div>

          <Row>
            <Col
              md={4}
              style={{ paddingRight: "0.8rem", marginBottom: "1.6rem" }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  // height: "100%",
                  height: "19rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                {!this.state.PurchasedAssetLoader ? (
                  <>
                    <div>
                      <Image src={CartIcon} className="net-worth-icon" />
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-12 m-b-20">
                        Most frequently <br />
                        purchased token
                      </h3>
                    </div>
                    <div style={{ height: "1.7rem", width: "max-content" }}>
                      {this.state.frequentlyPurchasedAsset &&
                      !this.state.PurchasedAssetLoader ? (
                        // <CoinChip
                        //   colorCode={this.state.frequentlyPurchasedAsset?.color}
                        //   coin_img_src={
                        //     this.state.frequentlyPurchasedAsset?.symbol
                        //   }
                        //   coin_percent={
                        //     this.state.frequentlyPurchasedAsset?.name
                        //   }
                        //   type={"cohort"}
                        // />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={this.state.frequentlyPurchasedAsset?.symbol}
                            style={{ width: "1.7rem" }}
                          />
                          <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                            {this.state.frequentlyPurchasedAsset?.name}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="inter-display-medium f-s-13 lh-15">
                          No movement
                        </h3>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                  // style={{
                  //   transform: "scale(0.65)",
                  //   marginTop: "-3.5rem",
                  //   marginLeft: "1rem",
                  // }}
                  >
                    <Loading showIcon={true} />
                  </div>
                )}
              </div>
            </Col>
            <Col
              md={4}
              style={{
                paddingRight: "0.8rem",
                paddingLeft: "0.8rem",
                marginBottom: "1.6rem",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  // height: "100%",
                  height: "19rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                {!this.state.SoldAssetLoader ? (
                  <>
                    <div>
                      <Image src={TokenIcon} className="net-worth-icon" />
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-12 m-b-20">
                        Most frequently <br />
                        sold token
                      </h3>
                    </div>

                    <div style={{ height: "1.7rem", width: "max-content" }}>
                      {this.state.frequentlySoldAsset &&
                      !this.state.SoldAssetLoader ? (
                        // <CoinChip
                        //   colorCode={this.state.frequentlySoldAsset?.color}
                        //   coin_img_src={this.state.frequentlySoldAsset?.symbol}
                        //   coin_percent={this.state.frequentlySoldAsset?.name}
                        //   type={"cohort"}
                        // />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={this.state.frequentlySoldAsset?.symbol}
                            style={{ width: "1.7rem" }}
                          />
                          <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                            {this.state.frequentlySoldAsset?.name}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="inter-display-medium f-s-13 lh-15">
                          No movement
                        </h3>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                  // style={{
                  //   transform: "scale(0.65)",
                  //   marginTop: "-3.5rem",
                  //   marginLeft: "1rem",
                  // }}
                  >
                    <Loading showIcon={true} />
                  </div>
                )}
              </div>
            </Col>
            <Col
              md={4}
              style={{ paddingLeft: "0.8rem", marginBottom: "1.6rem" }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  // height: "100%",
                  height: "19rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                {!this.state.LargestAssetLoader ? (
                  <>
                    <div>
                      <div
                        style={{
                          backgroundColor: "#19191A",
                          padding: "0.9rem",
                          width: "4rem",
                          height: "4rem",
                          borderRadius: "1.2rem",
                        }}
                      >
                        <Image
                          src={TransactionIcon}
                          className="net-worth-icon"
                          style={{
                            filter: "invert(1)",
                            width: "2.3rem",
                          }}
                        />
                      </div>
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-12 m-b-20">
                        Largest volume <br />
                        exchanged token
                      </h3>
                    </div>

                    <div style={{ height: "1.7rem", width: "max-content" }}>
                      {this.state?.LargestAsset &&
                      !this.state.LargestAssetLoader ? (
                        // <CoinChip
                        //   colorCode={this.state?.LargestAsset?.color}
                        //   coin_img_src={this.state?.LargestAsset?.symbol}
                        //   coin_percent={this.state?.LargestAsset?.name}
                        //   type={"cohort"}
                        // />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={this.state?.LargestAsset?.symbol}
                            style={{ width: "1.7rem" }}
                          />
                          <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                            {this.state?.LargestAsset?.name}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="inter-display-medium f-s-13 lh-15">
                          No movement
                        </h3>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                  // style={{
                  //   transform: "scale(0.65)",
                  //   marginTop: "-3.5rem",
                  //   marginLeft: "1rem",
                  // }}
                  >
                    <Loading showIcon={true} />
                  </div>
                )}
              </div>
            </Col>
            <Col md={4} style={{ paddingRight: "0.8rem" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  // height: "100%",
                  height: "19rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                {!this.state.VolumeBoughtLoader ? (
                  <>
                    <div>
                      <Image src={CartIcon} className="net-worth-icon" />
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-12 m-b-20">
                        Largest volume
                        <br />
                        bought token
                      </h3>
                    </div>
                    <div style={{ height: "1.7rem", width: "max-content" }}>
                      {this.state.LargestBoughtVolume &&
                      !this.state.VolumeBoughtLoader ? (
                        // <CoinChip
                        //   colorCode={this.state.frequentlyPurchasedAsset?.color}
                        //   coin_img_src={
                        //     this.state.frequentlyPurchasedAsset?.symbol
                        //   }
                        //   coin_percent={
                        //     this.state.frequentlyPurchasedAsset?.name
                        //   }
                        //   type={"cohort"}
                        // />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={this.state.LargestBoughtVolume?.symbol}
                            style={{ width: "1.7rem" }}
                          />
                          <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                            {this.state.LargestBoughtVolume?.name}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="inter-display-medium f-s-13 lh-15">
                          No movement
                        </h3>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                  // style={{
                  //   transform: "scale(0.65)",
                  //   marginTop: "-3.5rem",
                  //   marginLeft: "1rem",
                  // }}
                  >
                    <Loading showIcon={true} />
                  </div>
                )}
              </div>
            </Col>
            <Col
              md={4}
              style={{ paddingRight: "0.8rem", paddingLeft: "0.8rem" }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                  borderRadius: "12px",
                  padding: "2rem",
                  // height: "100%",
                  height: "19rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                {!this.state.SoldVolumeLoader ? (
                  <>
                    <div>
                      <Image src={TokenIcon} className="net-worth-icon" />
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-12 m-b-20">
                        Largest volume <br />
                        sold token
                      </h3>
                    </div>

                    <div style={{ height: "1.7rem", width: "max-content" }}>
                      {this.state.LargestSoldVolume &&
                      !this.state.SoldVolumeLoader ? (
                        // <CoinChip
                        //   colorCode={this.state.frequentlySoldAsset?.color}
                        //   coin_img_src={this.state.frequentlySoldAsset?.symbol}
                        //   coin_percent={this.state.frequentlySoldAsset?.name}
                        //   type={"cohort"}
                        // />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={this.state.LargestSoldVolume?.symbol}
                            style={{ width: "1.7rem" }}
                          />
                          <h3 className="inter-display-medium f-s-13 lh-15 m-l-4">
                            {this.state.LargestSoldVolume?.name}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="inter-display-medium f-s-13 lh-15">
                          No movement
                        </h3>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                  // style={{
                  //   transform: "scale(0.65)",
                  //   marginTop: "-3.5rem",
                  //   marginLeft: "1rem",
                  // }}
                  >
                    <Loading showIcon={true} />
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* 4 card end */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="m-t-40 m-b-24 Notification-header"
          >
            <h2
              className="inter-display-medium f-s-20 lh-45 black-191"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Image src={BellIcon} style={{ marginRight: "1.2rem" }} />{" "}
              Notifications
            </h2>

            {this.state.showBtn && (
              <button className="secondary-btn cp" onClick={this.handleSave}>
                Save
              </button>
            )}
          </div>

          {/* Notification start */}
          <div
            style={{
              background: "rgba(229, 229, 230, 0.5)",
              borderRadius: "16px",
              padding: "2rem",
            }}
          >
            <Row>
              <Col md={4} style={{ padding: "0 10px" }}>
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 27.5%, rgba(22, 93, 255, 0.162) 157.71%), #FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ paddingRight: "2rem" }}>
                    <Image src={BellIconColor} />
                    <h3 className="inter-display-medium f-s-20 lh-24 m-t-12">
                      {this.state.updateEmail
                        ? `We’ll be sending
notifications to you
here`
                        : `Get intelligent notifications for
                      your pod`}
                    </h3>
                  </div>

                  {/* button */}
                  {!this.state.updateEmail && (
                    <div
                      style={{
                        background: "#FFFFFF",
                        boxShadow:
                          "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                        borderRadius: "8px",
                        padding: "18px 28px",
                        width: "max-content",
                      }}
                      className="inter-display-medium f-s-16 lh-19 m-t-30 cp"
                      onClick={this.handleUpdateEmail}
                    >
                      Update email
                    </div>
                  )}
                  {this.state.updateEmail && (
                    <div className="m-t-30">
                      <Form onValidSubmit={this.onSubmit}>
                        <FormElement
                          valueLink={this.linkState(this, "email")}
                          // label="Email Info"
                          required
                          disabled={this.state.isLochUser ? true : false}
                          validations={[
                            {
                              validate: FormValidator.isRequired,
                              message: "",
                            },
                            {
                              validate: () => {
                                let isvalid = FormValidator.isEmail(
                                  this.state.email
                                );

                                this.setState({
                                  isEmailValid: isvalid,
                                });

                                return isvalid;
                              },
                              message: "Please enter valid email id",
                            },
                          ]}
                          control={{
                            type: CustomTextControl,

                            settings: {
                              placeholder: "Email",
                            },
                          }}
                        />
                      </Form>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={4} style={{ padding: "0 10px" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                    position: "relative",
                  }}
                >
                  <Image src={VerticalIcon} />
                  <div
                    style={{
                      // padding: "10px",
                      background: this.state.walletNotification
                        ? "#0071E3"
                        : "rgba(229, 229, 230, 0.5)",

                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: 20,
                      right: 20,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={this.handleClickWallet}
                  >
                    <Image
                      src={checkIcon}
                      style={{
                        opacity: this.state.walletNotification ? "1" : "0",
                      }}
                    />
                  </div>

                  {/* checkIcon */}
                  <div>
                    <h3 className="inter-display-medium f-s-16 lh-19 m-t-80">
                      Notify me when any wallets move more than
                    </h3>

                    <DropDown
                      class="cohort-dropdown"
                      list={[
                        "$1,000.00",
                        "$10k",
                        "$100k",
                        "$1m",
                        "$10m",
                        "$100m",
                      ]}
                      // list={[
                      //   `${CurrencyType(false)}1,000.00`,
                      //   `${CurrencyType(false)}10k`,
                      //   `${CurrencyType(false)}100k`,
                      //   `${CurrencyType(false)}1m`,
                      //   `${CurrencyType(false)}10m`,
                      //   `${CurrencyType(false)}100m`,
                      // ]}
                      onSelect={this.handleFunction}
                      title={this.state.title}
                      activetab={this.state.title}
                    />
                  </div>
                </div>
              </Col>
              <Col md={4} style={{ padding: "0 10px" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                    position: "relative",
                  }}
                >
                  <Image src={ClockIcon} />
                  <div
                    style={{
                      // padding: "10px",
                      background: this.state.dayNotification
                        ? "#0071E3"
                        : "rgba(229, 229, 230, 0.5)",

                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: 20,
                      right: 20,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={this.handleClickDay}
                  >
                    <Image
                      src={checkIcon}
                      style={{
                        opacity: this.state.dayNotification ? "1" : "0",
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="inter-display-medium f-s-16 lh-19 m-t-60">
                      Notify me when any wallet dormant for
                    </h3>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DropDown
                        class="cohort-dropdown"
                        list={[">30 days", "60 days", "90 days", "180 days"]}
                        onSelect={this.handleFunctionDay}
                        title={this.state.titleday}
                        activetab={this.state.titleday}
                      />
                      <h3 className="inter-display-medium f-s-16 lh-19 m-t-20 m-l-4">
                        becomes active
                      </h3>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* notification end */}

          {/* Address Start */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              className="m-t-40 m-b-20 inter-display-medium f-s-20 l-h-24 black-191"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Image src={GlobeIcon} style={{ marginRight: "1.2rem" }} />{" "}
              Addresses{" "}
              <span
                style={{ marginLeft: "0.8rem" }}
                className="inter-display-medium f-s-13 l-h-16 grey-7C7"
              >
                {this.state.walletAddresses?.length} addresses
              </span>
            </h2>

            {/* <h2
              className="m-t-40 m-b-20 inter-display-semi-bold f-s-13 lh-16 black-191 cp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              View all
              <Image
                src={ArrowRight}
                style={{ marginLeft: "1rem", width: "0.55rem" }}
              />
            </h2> */}
          </div>

          <div
            style={{
              background: "#FFFFFF",
              boxShadow:
                "0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04)",
              borderRadius: "16px",
              padding: "2.1rem 2.4rem",
              marginBottom: "1rem",
            }}
          >
            {/* Address */}
            <div
              className="cohort-address-wrapper"
              style={
                this.state.walletAddresses.length < 10
                  ? { overflowY: "visible" }
                  : {}
              }
            >
              {/* Address list */}
              {this.state.walletAddresses &&
                this.state.walletAddresses?.map((e, i) => {
                  let address =
                    e?.display_address && e?.display_address != ""
                      ? e?.display_address
                      : e?.wallet_address;
                  return (
                    <div
                      style={
                        i === this.state.walletAddresses.length - 1
                          ? {
                              marginBottom: "0rem",
                              paddingBottom: "0rem",
                              border: "none",
                              marginRight: `${
                                this.state.walletAddresses.length < 10
                                  ? "0rem"
                                  : "1rem"
                              }`,
                            }
                          : {
                              marginRight: `${
                                this.state.walletAddresses.length < 10
                                  ? "0rem"
                                  : "1rem"
                              }`,
                            }
                      }
                      className="address-list"
                    >
                      <div style={{}} className="address-left">
                        <h4 className="inter-display-medium f-s-13 l-h-16 grey-636">
                          {address}
                        </h4>
                        <Image
                          src={CopyClipboardIcon}
                          style={{ marginLeft: "0.8rem" }}
                          onClick={() => this.copyLink(e.wallet_address)}
                        />
                        {this.state.cohortId !== "63da35fe3c8af3c678ac936e" && (
                          <div className="nickname-input">
                            <Form
                              onValidSubmit={() => {
                                this.onSubmitNickname(address, i);
                              }}
                            >
                              <FormElement
                                valueLink={this.linkState(
                                  this,
                                  `nickname-${i + 1}`
                                )}
                                required
                                control={{
                                  type: CustomTextControl,
                                  settings: {
                                    placeholder: "Enter nickname",
                                  },
                                }}
                              />
                            </Form>
                          </div>
                        )}

                        {/* <Image
                        src={EditIcon}
                        style={{ marginLeft: "1.2rem" }}
                        onClick={this.handleShow}
                      /> */}
                      </div>
                      <h4 className="inter-display-medium f-s-16 lh-19">
                        {CurrencyType(false)}
                        {numToCurrency(e.net_worth)}{" "}
                        <span className="f-s-10 grey-ADA">
                          {" "}
                          {CurrencyType(true)}
                        </span>
                      </h4>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* Address End */}

          {/* Recommandation Start */}
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="m-t-40 m-b-20 inter-display-medium f-s-20 l-h-24 black-191">
              Recommended
            </h2>

            <h2
              className="m-t-40 m-b-20 inter-display-semi-bold f-s-13 lh-16 black-191 cp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              View all
              <Image
                src={ArrowRight}
                style={{ marginLeft: "1rem", width: "0.55rem" }}
              />
            </h2>
          </div> */}
          {/* <div className="cards"> */}
          {/* Recomandation Cards */}
          {/* {[...Array(3)].map((e) => {
              return (
                <div className="walletcard">
                  <>
                    <div className="m-b-20 wallet-details">
                      <div className="account-details">
                        <span className="inter-display-regular f-s-13 lh-16">
                          0x7d2d43e63666f45b40316b44212325625dbaeb40
                        </span>
                        <Image
                          src={CopyClipboardIcon}
                          onClick={() =>
                            this.copyLink(
                              "0x401f6c983ea34274ec46f84d70b31c151321188b"
                            )
                          }
                          className="m-l-10 m-r-12 cp"
                        />
                      </div>

                      <div className="amount-details">
                        <h6 className="inter-display-medium f-s-16 lh-19">
                          {numToCurrency(47474)}
                        </h6>
                        <span className="inter-display-semi-bold f-s-10 lh-12">
                          {CurrencyType(true)}
                        </span>
                      </div>
                    </div>
                    <div className="coins-chip">
                      <div className="chips-section">
                        <CoinChip
                          colorCode={"#E84042"}
                          coin_img_src={Coin}
                          coin_percent={"Avalanche"}
                        />
                        <CoinChip
                          colorCode={"#E84042"}
                          coin_img_src={Coin}
                          coin_percent={"Avalanche"}
                        />
                        <CoinChip
                          colorCode={"#E84042"}
                          coin_img_src={Coin}
                          coin_percent={"Avalanche"}
                        />
                        <CoinChip
                          colorCode={"#E84042"}
                          coin_img_src={Coin}
                          coin_percent={"Avalanche"}
                        />
                        <CoinChip
                          colorCode={"#E84042"}
                          coin_img_src={Coin}
                          coin_percent={"Avalanche"}
                        />
                      </div>
                      <h3 className="inter-display-semi-bold f-s-13 lh-15 cp">
                        <Image src={PlusIcon} /> Add to cohort
                      </h3>
                    </div>
                  </>
                </div>
              );
            })} */}
          {/* </div> */}

          {/* Recommandation */}
        </div>
      </div>
    );
  }
}

export default CohortPage;
