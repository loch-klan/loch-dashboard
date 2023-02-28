import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
// import Sidebar from '../common/Sidebar';
import ProfileForm from "./ProfileForm";
import PageHeader from "./../common/PageHeader";
import FeedbackForm from "../common/FeedbackForm";
import { ProfilePage } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from "../common/FixAddModal";
import { GetAllPlan, getUser } from "../common/Api";
import { Button, Col, Image, Row } from "react-bootstrap";

// Upgrade
import DefiIcon from "../../assets/images/icons/upgrade-defi.svg";
import ExportIcon from "../../assets/images/icons/upgrade-export.svg";
import NotificationLimitIcon from "../../assets/images/icons/upgrade-notification-limit.svg";
import NotificationIcon from "../../assets/images/icons/upgrade-notifications.svg";
import UploadIcon from "../../assets/images/icons/upgrade-upload.svg";
import WalletIcon from "../../assets/images/icons/upgrade-wallet.svg";
// import WhalePodAddressIcon from "../../assets/images/icons/upgrade-whale-pod-add.svg";
import WhalePodIcon from "../../assets/images/icons/upgrade-whale-pod.svg";
import { ManageLink } from "./Api";
import UpgradeModal from "../common/upgradeModal";
import insight from "../../assets/images/icons/InactiveIntelligenceIcon.svg";

class Profile extends Component {
  constructor(props) {
    super(props);
    const Plans = JSON.parse(localStorage.getItem("Plans"));
    let selectedPlan = {};
    let userPlan = JSON.parse(localStorage.getItem("currentPlan")) || "Free";
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
            // {
            //   name: "Whale pod addresses",
            //   limit: plan.whale_pod_address_limit,
            //   img: WhalePodAddressIcon,
            //   id: 3,
            // },
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
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      selectedPlan: selectedPlan ? selectedPlan : {},
      manageUrl: "",
      upgradeModal: false,
    };
  }

  componentDidMount() {
    ProfilePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    GetAllPlan();
    getUser();
    ManageLink(this);
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
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
    });
  };

  render() {
    return (
      <div className="profile-page-section">
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
            />
          )}
          <PageHeader
            title="Profile"
            subTitle="Manage your profile here"
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
          />
          <div className="profile-form-section">
            <Row>
              <Col md={7}>
                <ProfileForm />
              </Col>
              <Col md={5} style={{ paddingLeft: "4rem" }}>
                <div className="plan-card-wrapper">
                  <div className={"plan-card active"}>
                    <div
                      className={`pricing-section
                              ${
                                this.state.selectedPlan?.name ===
                                "Baron"
                                  ? "baron-bg"
                                  : this.state.selectedPlan?.name ===
                                    "Soverign"
                                  ? "soverign-bg"
                                  : ""
                              }
                              `}
                    >
                      <h4>Your current plan</h4>
                      <h3>{this.state.selectedPlan?.name}</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        rowGap: "1.2rem",
                        margin: "1.7rem 1rem 1rem",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#E5E5E680",
                          width: "30%",
                          height: "1.5px",
                          marginRight: "1.2rem",
                        }}
                      ></div>
                      <h4
                        className="inter-display-semi-bold f-s-12 lh-12 grey-CAC"
                        style={{
                          whiteSpace: "nowrap",
                          textTransform: "uppercase",
                        }}
                      >
                        Your privileges
                      </h4>
                      <div
                        style={{
                          backgroundColor: "#E5E5E680",
                          width: "30%",
                          height: "1.5px",
                          marginLeft: "1.2rem",
                        }}
                      ></div>
                    </div>
                    <div className="feature-list-wrapper">
                      {this.state.selectedPlan?.features?.map((list) => {
                        return (
                          <div className={`feature-list`}>
                            <div className="label">
                              <Image
                                src={list?.img}
                                // style={list?.id == 9 ? { opacity: "0.6" } : {}}
                              />
                              <h3>{list.name}</h3>
                            </div>
                            <h4>
                              {
                              list.name !== "Insights"
                              ? list.limit === false
                                ? "No"
                                : list.limit === true
                                ? "Yes"
                                : list.limit === -1
                                ? "Unlimited"
                                : list.limit
                              : list.limit === false
                                ? "Limited"
                                : "Unlimited"
                              }
                            </h4>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className={`primary-btn ${
                      this.state.selectedPlan?.name !== "Free"
                        ? "grey-bg"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        this.state.manageUrl === "" ||
                        this.state.manageUrl === undefined ||
                        this.state.selectedPlan?.name ===
                          "Free"
                      ) {
                        this.upgradeModal();
                      } else {
                        window.open(this.state.manageUrl);
                      }
                    }}
                  >
                    {this.state.selectedPlan?.name !== "Free"
                      ? "Manage subscription"
                      : "Upgrade"}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          {this.state.upgradeModal && (
            <UpgradeModal
              show={this.state.upgradeModal}
              onHide={this.upgradeModal}
              history={this.props.history}
              isShare={localStorage.getItem("share_id")}
              isStatic={this.state.isStatic}
              triggerId={0}
            />
          )}
          {/* <FeedbackForm page={"Profile Page"} /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profileState: state.ProfileState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
};
Profile.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
