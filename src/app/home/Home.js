import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Button, Image } from "react-bootstrap";
import Banner from "../../assets/images/bg-img-welcome.png";
import {
  deleteToken,
  getToken,
  setLocalStoraage,
  getCurrentUser,
} from "../../utils/ManageToken";
import {
  getAllCurrencyRatesApi,
  GetDefaultPlan,
  setPageFlagDefault,
  updateUserWalletApi,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import LochIcon from "../../assets/images/icons/loch-icon-white.svg";
import Form from "../../utils/form/Form";
import {
  DiscountEmailPage,
  DiscountEmailSkip,
  EmailAddedDiscount,
  TimeSpentDiscountEmail,
  TimeSpentOnboarding,
  LPConnectExchange,
  LPDiscover,
  ConnectWalletButtonClickedWelcome,
} from "../../utils/AnalyticsFunctions";
import {
  CompassWhiteIcon,
  LinkVectorWhiteIcon,
  ProfileVectorWhiteIcon,
  WalletWhiteIcon,
} from "../../assets/images/icons";
import LinkIconBtn from "../../assets/images/link.svg";
import {
  AppFeaturesCreateUser,
  createAnonymousUserApi,
  detectCoin,
} from "../onboarding/Api";
import {
  setHeaderReducer,
  setMetamaskConnectedReducer,
} from "../header/HeaderAction";
import { ethers } from "ethers";

class Home extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: true,
      upgradeModal: false,
      isStatic: true,
      triggerId: 0,
      selectedId: 0,
      currentMetamaskWallet: {},
      showPrevModal: true,

      showEmailPopup: false,
      emailAdded: false,
      startTime: "",

      // Onboarding
      onboardingShowModal: true,
      onboardingSignInReq: false,
      onboardingIsVerificationRequired: false,
      onboardingIsVerified: false,
      onboardingCurrentActiveModal: "signIn",
      onboardingUpgradeModal: false,
      onboardingIsStatic: false,
      onboardingTriggerId: 1,
      onboardingShowPrevModal: true,
      onboardingConnectExchangeModal: false,
      onboardingWalletAddress: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
      onboardingExchanges: null,
      onboardingShowEmailPopup: true,
    };
  }

  // Onboarding
  onboardingHandleUpgradeModal = () => {
    this.setState(
      {
        onboardingUpgradeModal: !this.state.onboardingUpgradeModal,
      },
      () => {
        let onboardingUpgradeModalValue = this.state.onboardingUpgradeModal
          ? false
          : true;
        this.setState({
          onboardingShowPrevModal: onboardingUpgradeModalValue,
        });
        const userDetails = JSON.parse(localStorage.getItem("lochUser"));
        if (userDetails) {
          this.props.history.push("/home");
        }
      }
    );
  };
  copyWalletAddress = (copyWallet) => {
    this.setState({ onboardingWalletAddress: copyWallet });
  };
  handleRedirection = () => {
    this.props.history.push(`/top-accounts`);
  };
  connectWalletEthers = async () => {
    ConnectWalletButtonClickedWelcome({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        const tempRes = await provider.send("eth_requestAccounts", []);

        if (tempRes && tempRes.length > 0) {
          this.addToList(tempRes);
        }
      } catch (error) {
        console.log("ethers error ", error);
      }
    }
  };
  addToList = (addThese) => {
    const curItem = addThese[0];

    if (curItem) {
      this.setState(
        {
          currentMetamaskWallet: {
            address: curItem,
            coinFound: true,
            coins: [],
            displayAddress: curItem,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: null,
          },
        },
        () => {
          this.getCoinBasedOnWalletAddress("randomName", curItem);
        }
      );
    }
  };
  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          0,
          true
        );
      }
    }
  };
  handleSetCoin = (data) => {
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );

    let newAddress = this.state.currentMetamaskWallet;

    data.address === newAddress.address &&
      newAddress.coins.push(...newCoinList);
    // new code added
    // if (data.id === newAddress.id) {
    //   newAddress.address = data.address;
    // }

    newAddress.coinFound =
      newAddress.coins &&
      newAddress.coins.some((e) => e.chain_detected === true);
    newAddress.apiAddress = data?.apiaddress;

    this.setState(
      {
        currentMetamaskWallet: newAddress,
      },
      () => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.callUpdateApi(this.state.currentMetamaskWallet);
        }, 500);
      }
    );
  };
  callUpdateApi = (passedItem) => {
    let walletAddress = JSON.parse(localStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
    if (walletAddress) {
      walletAddress.forEach((curr) => {
        if (!arr.includes(curr.address?.trim()) && curr.address) {
          walletList.push(curr);
          arr.push(curr.address?.trim());
          nicknameArr[curr.address?.trim()] = curr.nickname;
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.address?.trim());
          addressList.push(curr.address?.trim());
        }
      });
    }
    if (passedItem) {
      if (passedItem.address) {
        // TopBarMetamaskWalletConnected({
        //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
        //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
        //   address: passedItem.address,
        // });

        this.props.setMetamaskConnectedReducer(passedItem.address);
        window.sessionStorage.setItem(
          "setMetamaskConnectedSessionStorage",
          passedItem.address
        );
      }
      if (!arr.includes(passedItem.address?.trim()) && passedItem.address) {
        walletList.push(passedItem);
        arr.push(passedItem.address?.trim());
        nicknameArr[passedItem.address?.trim()] = passedItem.nickname;
        arr.push(passedItem.displayAddress?.trim());
        arr.push(passedItem.address?.trim());
        addressList.push(passedItem.address?.trim());
      }
    }
    let addWallet = walletList.map((w, i) => {
      return {
        ...w,
        id: `wallet${i + 1}`,
      };
    });
    console.log("addressList ", addressList);
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));

    this.props.createAnonymousUserApi(data, this, addWallet, null);
    // this.props.updateUserWalletApi(data, this, yieldData);
  };
  onboardingShowConnectModal = (
    address = this.state.onboardingWalletAddress
  ) => {
    this.setState(
      {
        onboardingConnectExchangeModal: true,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange();
        }
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingHideConnectModal = () => {
    this.setState(
      {
        onboardingConnectExchangeModal: false,
        onboardingSignInReq: false,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        }
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingHandleBackConnect = (
    exchanges = this.state.onboardingExchanges
  ) => {
    this.setState(
      {
        onboardingSignInReq: false,
        onboardingConnectExchangeModal:
          !this.state.onboardingConnectExchangeModal,
        onboardingWalletAddress: this.state.onboardingWalletAddress,
        onboardingExchanges: exchanges,
      },
      () => {
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingHandleUpdateConnect = (
    exchanges = this.state.onboardingExchanges
  ) => {
    this.setState({
      onboardingExchanges: exchanges,
    });
  };
  onboardingOnClose = () => {
    this.setState({ onboardingShowModal: false });
  };
  onboardingHandleStateChange = (value) => {
    if (value === "verifyCode") {
      this.setState({
        onboardingCurrentActiveModal: value,
      });
    } else {
      this.setState({
        onboardingCurrentActiveModal: "signIn",
      });
    }
  };

  onboardingShowSignIn = () => {
    this.onboardingHideConnectModal();
    if (this.state.onboardingCurrentActiveModal === "verifyCode") {
      this.setState({
        onboardingSignInReq: true,
        onboardingCurrentActiveModal: "signIn",
      });
    } else {
      this.setState({
        onboardingSignInReq: true,
      });
    }
  };
  onboardingSwitchSignIn = () => {
    if (this.state.onboardingCurrentActiveModal === "verifyCode") {
      this.setState({
        onboardingSignInReq: true,
        onboardingCurrentActiveModal: "signIn",
      });
    } else {
      this.setState({
        onboardingSignInReq: !this.state.onboardingSignInReq,
      });
    }
  };
  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
      },
      () => {
        let value = this.state.upgradeModal ? false : true;
        this.setState({
          showPrevModal: value,
        });
      }
    );
  };

  componentDidMount() {
    this.props.setHeaderReducer([]);
    this.setState({ startTime: new Date() * 1 });
    // DiscountEmailPage();
    let isEmailadded = JSON.parse(localStorage.getItem("discountEmail"));
    if (isEmailadded) {
      this.setState({
        emailAdded: true,
        showEmailPopup: false,
      });
    }
    const searchParams = new URLSearchParams(this.props.location.search);
    const planId = searchParams.get("plan_id");
    let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
    if (!currencyRates) {
      getAllCurrencyRatesApi();
    }

    if (planId) {
      this.setState(
        {
          selectedId: planId,
        },
        () => {
          this.upgradeModal();
        }
      );
    } else {
      if (getToken()) {
        let isStopRedirect =
          localStorage.getItem("stop_redirect") &&
          JSON.parse(localStorage.getItem("stop_redirect"));
        if (isStopRedirect) {
          this.props.setPageFlagDefault();
          deleteToken();
        } else {
          // check if user is signed in or not if yes reidrect them to home page if not delete tokens and redirect them to welcome page
          let user = localStorage.getItem("lochUser")
            ? JSON.parse(localStorage.getItem("lochUser"))
            : false;
          if (user) {
            this.props.history.push("/home");
          } else {
            this.props.setPageFlagDefault();
            deleteToken();
            //  localStorage.setItem("defi_access", true);
            //  localStorage.setItem("isPopup", true);
            //  // localStorage.setItem("whalepodview", true);
            //  localStorage.setItem(
            //    "whalepodview",
            //    JSON.stringify({ access: true, id: "" })
            //  );
            // localStorage.setItem(
            //   "isSubmenu",
            //   JSON.stringify({
            //     me: false,
            //     discover: false,
            //     intelligence: false,
            //   })
            // );
            setLocalStoraage();
            let isRefresh = JSON.parse(localStorage.getItem("refresh"));
            if (!isRefresh) {
              localStorage.setItem("refresh", true);
              window.location.reload(true);
            }
          }
        }
      } else {
        this.props.setPageFlagDefault();
        deleteToken();
        // localStorage.setItem("defi_access", true);
        // localStorage.setItem("isPopup", true);
        // // localStorage.setItem("whalepodview", true);
        // localStorage.setItem(
        //   "whalepodview",
        //   JSON.stringify({ access: true, id: "" })
        // );
        // // localStorage.setItem("isSubmenu", false);
        //  localStorage.setItem(
        //    "isSubmenu",
        //    JSON.stringify({
        //      me: false,
        //      discover: false,
        //      intelligence: false,
        //    })
        //  );
        setLocalStoraage();
        let isRefresh = JSON.parse(localStorage.getItem("refresh"));
        if (!isRefresh) {
          localStorage.setItem("refresh", true);
          window.location.reload(true);
        }
      }
    }

    GetDefaultPlan();
  }

  componentWillUnmount() {
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentDiscountEmail({ time_spent: TimeSpent });
    }
  }

  hideModal = (value) => {};
  handleSave = () => {
    this.setState({
      emailAdded: true,
    });

    EmailAddedDiscount({ email_address: this.state.email });

    setTimeout(() => {
      this.setState({
        showEmailPopup: false,
      });
      localStorage.setItem("discountEmail", true);
    }, 2000);
  };
  handleSkip = () => {
    DiscountEmailSkip();
    this.setState({
      showEmailPopup: false,
    });
  };

  render() {
    return (
      <>
        {this.state.showEmailPopup && (
          <div className="discount-email-wrapper">
            <div className="discount-row">
              <div className="img-section">
                <Image src={LochIcon} />
              </div>
              <div className="content-section">
                {!this.state.emailAdded ? (
                  <>
                    <h1 className="inter-display-medium f-s-39 lh-46 grey-B0B m-b-26">
                      Get exclusive discounts to Loch
                    </h1>
                    <Form onValidSubmit={this.handleSave}>
                      <FormElement
                        valueLink={this.linkState(this, "email")}
                        // label="Email Info"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "",
                          },
                          {
                            validate: FormValidator.isEmail,
                            message: "Enter valid email",
                          },
                          // {
                          //     validate: () => {
                          //        return !this.state.isOptInValid;
                          //   },
                          //     message:"invalid verification code"
                          // }
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Your email address",
                          },
                        }}
                        // className={"is-valid"}
                      />
                      <Button
                        className={`primary-btn inter-display-semi-bold f-s-16 lh-19`}
                        type="submit"
                      >
                        Get discount
                      </Button>
                    </Form>

                    <h3
                      className="inter-display-medium f-s-16 lh-19 m-t-40"
                      onClick={this.handleSkip}
                    >
                      No thanks, just let me enter
                    </h3>
                  </>
                ) : (
                  <>
                    <h1 className="inter-display-medium f-s-26 lh-30 m-b-26">
                      Great! <br />
                      You’ll hear from us very soon!
                    </h1>
                    <div className="upload-loader"></div>
                    <h2 className="inter-display-semi-bold f-s-14 lh-16 m-t-20 grey-B0B">
                      Directing you to Loch
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {this.state.showPrevModal && (
          <div>
            {!this.state.showEmailPopup && (
              <div className="overlayContainer">
                <div className="overlay-bg"></div>
                <Image src={Banner} className="overlay-banner" />
                <div className="overLayHeader">
                  <div
                    onClick={this.connectWalletEthers}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderFadedOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons p-1"
                      src={WalletWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Connect wallet</div>
                  </div>
                  <div
                    onClick={this.onboardingShowConnectModal}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderFadedOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons p-1"
                      src={LinkVectorWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Connect exchange</div>
                  </div>
                  <div
                    onClick={this.onboardingShowSignIn}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderWhiteOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons p-1"
                      src={ProfileVectorWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Sign in</div>
                  </div>
                </div>
                <OnBoarding
                  {...this.props}
                  hideModal={this.hideModal}
                  showModal={this.state.onboardingShowModal}
                  signInReq={this.state.onboardingSignInReq}
                  isVerificationRequired={
                    this.state.onboardingIsVerificationRequired
                  }
                  isVerified={this.state.onboardingIsVerified}
                  currentActiveModal={this.state.onboardingCurrentActiveModal}
                  upgradeModal={this.state.onboardingUpgradeModal}
                  isStatic={this.state.onboardingIsStatic}
                  triggerId={this.state.onboardingTriggerId}
                  showPrevModal={this.state.onboardingShowPrevModal}
                  connectExchangeModal={
                    this.state.onboardingConnectExchangeModal
                  }
                  onboardingWalletAddress={this.state.onboardingWalletAddress}
                  exchanges={this.state.onboardingExchanges}
                  showEmailPopup={this.state.onboardingShowEmailPopup}
                  onboardingHandleUpgradeModal={
                    this.onboardingHandleUpgradeModal
                  }
                  onboardingShowConnectModal={this.onboardingShowConnectModal}
                  onboardingHideConnectModal={this.onboardingHideConnectModal}
                  onboardingHandleBackConnect={this.onboardingHandleBackConnect}
                  onboardingHandleUpdateConnect={
                    this.onboardingHandleUpdateConnect
                  }
                  onboardingHandleStateChange={this.onboardingHandleStateChange}
                  onboardingSwitchSignIn={this.onboardingSwitchSignIn}
                  onboardingOnClose={this.onboardingOnClose}
                  copyWalletAddress={this.copyWalletAddress}
                  modalAnimation={false}
                />
              </div>
            )}
          </div>
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            selectedId={this.state.selectedId}
            signinBack={true}
            form="home"
            pname="home"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  homeState: state.HomeState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
  setHeaderReducer,
  detectCoin,
  setMetamaskConnectedReducer,
  updateUserWalletApi,
  createAnonymousUserApi,
};
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
