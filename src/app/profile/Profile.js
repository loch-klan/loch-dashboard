import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
// import Sidebar from '../common/Sidebar';
import { ProfilePage, TimeSpentProfile } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import PageHeader from "./../common/PageHeader";
import ProfileForm from "./ProfileForm";

// add wallet
import { Col, Row } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import FixAddModal from "../common/FixAddModal";

// Upgrade
import insight from "../../assets/images/icons/InactiveIntelligenceIcon.svg";
import DefiIcon from "../../assets/images/icons/upgrade-defi.svg";
import ExportIcon from "../../assets/images/icons/upgrade-export.svg";
import NotificationLimitIcon from "../../assets/images/icons/upgrade-notification-limit.svg";
import NotificationIcon from "../../assets/images/icons/upgrade-notifications.svg";
import UploadIcon from "../../assets/images/icons/upgrade-upload.svg";
import WalletIcon from "../../assets/images/icons/upgrade-wallet.svg";
import WhalePodAddressIcon from "../../assets/images/icons/upgrade-whale-pod-add.svg";
import WhalePodIcon from "../../assets/images/icons/upgrade-whale-pod.svg";
import WelcomeCard from "../Portfolio/WelcomeCard";
import UpgradeModal from "../common/upgradeModal";
import Wallet from "../wallet/Wallet";
import { ManageLink } from "./Api";
import ProfileLochCreditPoints from "./ProfileLochCreditPoints";
import { mobileCheck } from "../../utils/ReusableFunctions";
import TopWalletAddressList from "../header/TopWalletAddressList";

class Profile extends Component {
  constructor(props) {
    super(props);
    const Plans = JSON.parse(window.sessionStorage.getItem("Plans"));
    let selectedPlan = {};
    let userPlan =
      JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free";
    Plans?.map((plan) => {
      if (plan.name === userPlan.name) {
        let price = plan.prices ? plan.prices[0]?.unit_amount / 100 : 0;
        selectedPlan = {
          // Upgrade plan
          price: price,
          price_id: plan.prices ? plan.prices[0]?.id : "",
          name: plan.name,
          id: plan.id,
          plan_reference_id: plan.plan_reference_id,
          plan_valid: userPlan?.subscription?.valid_till,
          features: [
            {
              name: "Wallet addresses",
              limit: plan.wallet_address_limit,
              img: WalletIcon,
              id: 1,
            },
            {
              name: plan.whale_pod_limit > 1 ? "Whale pods" : "Whale pod",
              limit: plan.whale_pod_limit,
              img: WhalePodIcon,
              id: 2,
            },
            {
              name:
                plan.name === "Free"
                  ? "Influencer whale pod"
                  : "Influencer whale pods",
              limit: plan.name === "Free" ? 1 : -1,
              img: WhalePodAddressIcon,
              id: 3,
            },
            {
              name: "Notifications",
              limit: plan.notifications_provided,
              img: NotificationIcon,
              id: 4,
            },
            {
              name: "Notifications limit",
              limit: plan.notifications_limit,
              img: NotificationLimitIcon,
              id: 5,
            },
            {
              name: "DeFi details",
              limit: plan.defi_enabled,
              img: DefiIcon,
              id: 6,
            },
            {
              name: "Insights",
              limit: plan?.insight ? true : price > 0 ? true : false,
              img: insight,
              id: 9,
            },
            {
              name: "Export addresses",
              limit: plan.export_address_limit,
              img: ExportIcon,
              id: 7,
            },
            {
              name: "Upload address csv/txt",
              limit: plan.upload_csv,
              img: UploadIcon,
              id: 8,
            },
          ],
        };
      }
    });

    this.state = {
      // add new wallet
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      selectedPlan: selectedPlan ? selectedPlan : {},
      manageUrl: "",
      upgradeModal: false,

      startTime: "",
      followFlag: false,
      lochUser: undefined,
    };
  }

  onFollowUpdate = () => {
    this.setState({
      followFlag: !this.state.followFlag,
    });
  };
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    ProfilePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkProfileTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }
    const isLochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (isLochUser) {
      this.setState({
        lochUser: isLochUser,
      });
    }
    this.props.GetAllPlan();
    this.props.getUser();
    ManageLink(this);

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkProfileTimer);
    };
  }
  CheckApiResponse = () => {
    this.props.setPageFlagDefault();
  };
  componentDidUpdate() {
    if (!this.props.commonState.profilePage) {
      this.props.updateWalletListFlag("profilePage", true);
      this.props.GetAllPlan();
      this.props.getUser();
      const isLochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (isLochUser) {
        this.setState({
          lochUser: isLochUser,
        });
      }
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "profilePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("profilePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkProfileTimer);
    window.sessionStorage.removeItem("profilePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentProfile({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "profilePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "profilePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleUpdateWallet = () => {
    // window.location.reload()
    this.setState({
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
    });

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
                updateOnFollow={this.onFollowUpdate}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                handleUpdate={this.handleUpdateWallet}
                hideShare
              />
            </div>
          </div>
        </div>
        <div className="profile-page-section m-t-80">
          <div className="profile-section page">
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
                from="profile"
              />
            )}
            <TopWalletAddressList
              apiResponse={(e) => this.CheckApiResponse(e)}
              hideShare
              hideFollow
            />
            <PageHeader
              title="Profile"
              subTitle="Manage your profile here"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              // // connect exchange btn
              // SecondaryBtn={true}
              // handleUpdate={this.handleUpdateWallet}
            />
            <div style={{ marginBottom: "3rem" }}>
              <Row>
                <Col md={12}>
                  <ProfileLochCreditPoints
                    followFlag={this.state.followFlag}
                    isUpdate={this.state.isUpdate}
                    history={this.props.history}
                    lochUser={this.state.lochUser}
                  />
                </Col>
              </Row>
            </div>
            {/* wallet page component */}
            <Wallet
              hidePageHeader={true}
              isUpdate={this.state.isUpdate}
              updateTimer={this.updateTimer}
            />

            <PageHeader
              title="Your details"
              subTitle=""
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              // // connect exchange btn
              // SecondaryBtn={true}
              // handleUpdate={this.handleUpdateWallet}
            />

            <div
              className="profile-form-section"
              style={{ marginBottom: "4rem" }}
            >
              <Row>
                <Col md={12}>
                  <ProfileForm />
                </Col>
              </Row>
            </div>

            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={window.sessionStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={0}
                pname="profile"
                updateTimer={this.updateTimer}
              />
            )}
            {/* <FeedbackForm page={"Profile Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  profileState: state.ProfileState,
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
  GetAllPlan,
  getUser,
  updateWalletListFlag,
};
Profile.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
