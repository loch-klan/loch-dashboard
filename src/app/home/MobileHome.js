import React from "react";
// import PropTypes from 'prop-types';
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import "../../assets/scss/onboarding/_onboarding.scss";
import BaseReactComponent from "../../utils/form/BaseReactComponent";

import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";

import { setPageFlagDefault, updateUserWalletApi } from "../common/Api";

import {
  CloseIcon,
  LochLogoWhiteIcon,
  MobileSearchGreyIcon,
  TrendingFireIcon,
} from "../../assets/images/icons";
import LochBlackLogo from "../../image/Loch.svg";
import {
  Mobile_Go_Back_Home,
  Mobile_LPC_Go,
  Mobile_Update_Address,
  OnboardingMobilePage,
  TimeSpentOnboardingMobile,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { numToCurrency, scrollToTop } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { CustomButton } from "../../utils/form";
import {
  setHeaderReducer,
  setMetamaskConnectedReducer,
} from "../header/HeaderAction";
import { createAnonymousUserApi, detectCoin } from "../onboarding/Api";
import "./_welcomeMobilePage.scss";
class MobileHome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTrendingAddresses: true,
      startTime: "",
      showWhiteLogo: false,
      showBlackLogo: false,
      showQuestionMarkLogo: false,
      modalType: "addwallet",
      addWalletList: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
          showNameTag: true,
          apiAddress: "",
        },
      ],
      showBorder: false,
      coinsLoading: false,
      coinsFound: false,
      showCloseBtn: false,
    };
  }
  whiteLogoIconLoaded = () => {
    this.setState({
      showWhiteLogo: true,
    });
  };
  blackLogoIconLoaded = () => {
    this.setState({
      showBlackLogo: true,
    });
  };
  questionMarkLogoIconLoaded = () => {
    this.setState({
      showQuestionMarkLogo: true,
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    OnboardingMobilePage({});
    window.checkMobileWelcomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    scrollToTop();
    const search = this.props?.location?.search;
    const params = new URLSearchParams(search);
    const IsFromMobileHome = params.get("FromMobileHome");
    if (IsFromMobileHome) {
      this.setState({
        showCloseBtn: true,
      });
    } else {
      this.startPageView();
      this.updateTimer(true);
      return () => {
        clearInterval(window.checkMobileWelcomeTimer);
      };
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("mobileWelcomePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkMobileWelcomeTimer);
    window.localStorage.removeItem("mobileWelcomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentOnboardingMobile({
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.addWalletList !== this.state.addWalletList) {
      let coinsFound = false;
      let coinsNotFound = false;
      this.state.addWalletList?.forEach((e, i) => {
        if (e.coinFound && e.coins.length > 0) {
          coinsFound = true;
        } else if (
          e.coins.length === this.props.OnboardingState.coinsList.length
        ) {
          coinsNotFound = true;
        }
      });

      if (coinsFound) {
        this.setState({
          coinsFound: true,
          coinsLoading: false,
        });
      } else if (coinsNotFound) {
        this.setState({
          coinsFound: false,
          coinsLoading: false,
        });
      } else {
        this.setState({
          coinsFound: false,
        });
      }
    }
  }
  showBorder = () => {
    this.setState({
      showBorder: true,
    });
    if (this.props.makeTrendingAddressesVisible) {
      this.props.makeTrendingAddressesVisible();
    }
  };
  hideBorder = () => {
    this.setState({
      showBorder: false,
    });
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
          this
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
    let i = this.state.addWalletList.findIndex((obj) => obj.id === data.id);
    let newAddress =
      this.state.modalType === "addwallet"
        ? [...this.state.addWalletList]
        : [...this.state.fixWalletAddress];

    data.address === newAddress[i].address &&
      newAddress[i].coins.push(...newCoinList);
    // new code added
    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound =
      newAddress[i].coins &&
      newAddress[i].coins.some((e) => e.chain_detected === true);
    newAddress[i].apiAddress = data?.apiaddress;

    if (this.state.modalType === "addwallet") {
      this.setState({
        addWalletList: newAddress,
      });
    } else if (this.state.modalType === "fixwallet") {
      this.setState({
        fixWalletAddress: newAddress,
      });
    }
  };
  handleOnchange = (e) => {
    this.setState({
      coinsLoading: true,
    });
    let { name, value } = e.target;

    let prevWallets = [...this.state.addWalletList];
    let currentIndex = prevWallets.findIndex((elem) => elem.id === name);
    if (currentIndex > -1) {
      let prevValue = prevWallets[currentIndex].address;
      prevWallets[currentIndex].address = value;
      prevWallets[currentIndex].displayAddress = value;
      if (value === "" || prevValue !== value) {
        prevWallets[currentIndex].coins = [];
      }
    }

    this.setState({
      addWalletList: prevWallets,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 500);
  };
  onValidSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!this.state.coinsFound) {
      return null;
    }
    this.setState({
      disableGoBtn: true,
    });
    const theExchangeData = [];
    if (this.props.exchanges) {
      this.props.exchanges.forEach((exchangeEle) => {
        if (exchangeEle.apiKey) {
          const newObj = {
            apiKey: exchangeEle.apiKey,
            apiSecretKey: exchangeEle.apiSecretKey,
            connectionName: exchangeEle.connectionName,
            exchangeCode: exchangeEle.code,
          };
          theExchangeData.push(newObj);
        }
      });
    }
    let passingData = new URLSearchParams();
    passingData.append("user_account", JSON.stringify(theExchangeData));
    const islochUser = window.localStorage.getItem("lochDummyUser");
    if (islochUser) {
      window.localStorage.removeItem("lochToken");
      window.localStorage.removeItem("addWallet");
      window.localStorage.removeItem("lochUser");
      window.localStorage.removeItem("lochDummyUser");
      window.localStorage.removeItem("currencyRates");
      window.localStorage.removeItem("currency");
      window.localStorage.removeItem("currentPlan");
      window.localStorage.removeItem("share_id");
      window.localStorage.removeItem("Plans");
      window.localStorage.removeItem("stopClick");
      window.localStorage.removeItem("defi_access");
      window.localStorage.removeItem("isPopup");
      window.localStorage.removeItem("stop_redirect");
      window.localStorage.removeItem("connectWalletAddress");
      window.localStorage.removeItem("gotShareProtfolio");
      setTimeout(() => {
        let walletAddress = [];
        let addWallet = this.state.addWalletList;
        let addWalletTemp = this.state.addWalletList;
        addWalletTemp?.forEach((w, i) => {
          w.id = `wallet${i + 1}`;
        });
        if (addWalletTemp && addWalletTemp.length > 0) {
          var mySet = new Set();

          const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
            if (filData?.address !== "") {
              if (mySet.has(filData.address.toLowerCase())) {
                return false;
              } else {
                mySet.add(filData.address.toLowerCase());
                return true;
              }
            }
            return false;
          });
          if (filteredAddWalletTemp) {
            setTimeout(() => {
              this.props.setHeaderReducer(filteredAddWalletTemp);
            }, 500);
          }
        }
        let finalArr = [];

        let addressList = [];

        let nicknameArr = {};

        for (let i = 0; i < addWallet.length; i++) {
          let curr = addWallet[i];
          if (
            !walletAddress.includes(curr.apiAddress?.trim()) &&
            curr.address?.trim()
          ) {
            finalArr.push(curr);
            walletAddress.push(curr.address?.trim());
            walletAddress.push(curr.displayAddress?.trim());
            walletAddress.push(curr.apiAddress?.trim());
            let address = curr.address?.trim();
            nicknameArr[address] = curr.nickname;
            addressList.push(curr.address?.trim());
          }
        }

        finalArr = finalArr?.map((item, index) => {
          return {
            ...item,
            id: `wallet${index + 1}`,
          };
        });

        const data = new URLSearchParams();
        data.append("wallet_addresses", JSON.stringify(addressList));
        data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
        // data.append("link", );
        this.props.createAnonymousUserApi(data, this, finalArr, null);

        const address = finalArr?.map((e) => e.address);

        const unrecog_address = finalArr
          .filter((e) => !e.coinFound)
          .map((e) => e.address);
        const blockchainDetected = [];
        const nicknames = [];
        finalArr
          .filter((e) => e.coinFound)
          .map((obj) => {
            let coinName = obj.coins
              .filter((e) => e.chain_detected)
              .map((name) => name.coinName);
            let address = obj.address;
            let nickname = obj.nickname;
            blockchainDetected.push({ address: address, names: coinName });
            nicknames.push({ address: address, nickname: nickname });
          });
        Mobile_Update_Address({
          addresses: address,
          ENS: address,
          chains_detected_against_them: blockchainDetected,
          unrecognized_addresses: unrecog_address,
          unrecognized_ENS: unrecog_address,
          nicknames: nicknames,
        });
      }, 500);
    } else {
      let walletAddress = [];
      let addWallet = this.state.addWalletList;
      let addWalletTemp = this.state.addWalletList;
      addWalletTemp?.forEach((w, i) => {
        w.id = `wallet${i + 1}`;
      });
      if (addWalletTemp && addWalletTemp.length > 0) {
        var mySet = new Set();

        const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
          if (filData?.address !== "") {
            if (mySet.has(filData.address.toLowerCase())) {
              return false;
            } else {
              mySet.add(filData.address.toLowerCase());
              return true;
            }
          }
          return false;
        });
        if (filteredAddWalletTemp) {
          setTimeout(() => {
            this.props.setHeaderReducer(filteredAddWalletTemp);
          }, 500);
        }
      }
      let finalArr = [];

      let addressList = [];

      let nicknameArr = {};

      for (let i = 0; i < addWallet.length; i++) {
        let curr = addWallet[i];
        if (
          !walletAddress.includes(curr.apiAddress?.trim()) &&
          curr.address?.trim()
        ) {
          finalArr.push(curr);
          walletAddress.push(curr.address?.trim());
          walletAddress.push(curr.displayAddress?.trim());
          walletAddress.push(curr.apiAddress?.trim());
          let address = curr.address?.trim();
          nicknameArr[address] = curr.nickname;
          addressList.push(curr.address?.trim());
        }
      }

      finalArr = finalArr?.map((item, index) => {
        return {
          ...item,
          id: `wallet${index + 1}`,
        };
      });

      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      // data.append("link", );
      this.props.createAnonymousUserApi(data, this, finalArr, null);
      const address = finalArr?.map((e) => e.address);

      const unrecog_address = finalArr
        .filter((e) => !e.coinFound)
        .map((e) => e.address);
      const blockchainDetected = [];
      const nicknames = [];
      finalArr
        .filter((e) => e.coinFound)
        .map((obj) => {
          let coinName = obj.coins
            .filter((e) => e.chain_detected)
            .map((name) => name.coinName);
          let address = obj.address;
          let nickname = obj.nickname;
          blockchainDetected.push({ address: address, names: coinName });
          nicknames.push({ address: address, nickname: nickname });
        });

      Mobile_LPC_Go({
        addresses: address,
        ENS: address,
        chains_detected_against_them: blockchainDetected,
        unrecognized_addresses: unrecog_address,
        unrecognized_ENS: unrecog_address,
        nicknames: nicknames,
      });
    }
  };
  goToHome = () => {
    if (getCurrentUser()) {
      Mobile_Go_Back_Home({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
    this.props.history.push("/home");
  };
  render() {
    const wallets = this.state.addWalletList?.map((elem, index) => {
      return (
        <div className="mwbAddWalletWrapper inter-display-regular f-s-15 lh-20">
          <div
            className={`mwbAwInputWrapper ${
              elem.displayAddress || this.state.showBorder
                ? "mwbAwInputWrapperSelected"
                : ""
            }`}
          >
            {elem.showAddress && (
              <div className="mbwAwTopInputWrapper">
                {!elem.displayAddress ? (
                  <img
                    src={MobileSearchGreyIcon}
                    className="mbwAwTopInputSearchIcon"
                    alt="searchIcon"
                  />
                ) : null}
                <form
                  style={{
                    flex: 1,
                    display: "flex",
                  }}
                  onSubmit={this.onValidSubmit}
                  action="#"
                >
                  <input
                    type="text"
                    disabled={
                      (elem.displayAddress &&
                        elem.displayAddress ===
                          this.state.metamaskWalletConnected) ||
                      (elem.address &&
                        elem.address === this.state.metamaskWalletConnected)
                    }
                    name={`wallet${index + 1}`}
                    value={elem.displayAddress || elem.address || ""}
                    placeholder="Search any address or ENS here"
                    className={`inter-display-regular f-s-16 lh-20 mwbAwInput`}
                    onChange={(e) => this.handleOnchange(e)}
                    id={elem.id}
                    onKeyDown={this.handleTabPress}
                    onFocus={this.showBorder}
                    onBlur={this.hideBorder}
                    autoComplete="off"
                    onSubmit={this.onValidSubmit}
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className="mobileWelcomeContainer">
        <div className="mobileWelcomeBlockHeader">
          <div className="mobileWelcomeBlockHeaderOverlay"></div>
          <div className="mobileWelcomeBlockHeaderData">
            <Image
              style={{
                opacity: this.state.showBlackLogo ? 1 : 0,
              }}
              onLoad={this.blackLogoIconLoaded}
              className="mobileWelcomeBlockHeaderImage"
              src={LochBlackLogo}
            />
            <div className="mobileWelcomeBlockHeaderTitle">Loch</div>
          </div>
        </div>
        <div className="mobileWelcomeBlock">
          <div className="mbwBannerContainer">
            {/* <Image className="mbwBanner" src={MobileFrame} /> */}
            <div className="mbwBanner">
              <Image
                style={{
                  opacity: this.state.showWhiteLogo ? 1 : 0,
                }}
                onLoad={this.whiteLogoIconLoaded}
                className="mbwBannerLochLogo"
                src={LochLogoWhiteIcon}
              />
              {this.state.showCloseBtn ? (
                <div
                  className="closebtn mbwBannerCrossLogoContainer"
                  onClick={this.goToHome}
                >
                  <Image src={CloseIcon} className="mbwBannerCrossLogo" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="mwbAddWalletWrapperContainer">
            {wallets}
            {this.state.addWalletList &&
            this.state.addWalletList[0].displayAddress ? (
              <div className="mwbAddWalletBtnContainer">
                <CustomButton
                  className="inter-display-regular f-s-15 lh-20 mwbAddWalletBtn"
                  type="submit"
                  handleClick={this.onValidSubmit}
                  isLoading={this.state.coinsLoading}
                  isDisabled={!this.state.coinsFound}
                  buttonText="Go"
                />
              </div>
            ) : null}
            {this.state.addWalletList &&
            !this.state.addWalletList[0].address &&
            this.state.addWalletList.length === 1 &&
            this.props.isTrendingAddresses ? (
              <div className="trendingAddressesMobileContainer">
                <div className="trendingAddressesMobileBlock">
                  <div className="trendingAddressesMobileBlockHeader">
                    <Image
                      src={TrendingFireIcon}
                      className="trendingAddressesMobileBlockFire"
                    />
                    <div className="inter-display-medium f-s-16 lh-15 ml-2 mr-2">
                      Trending addresses
                    </div>
                    <div className="inter-display-medium f-s-12 lh-15 trendingAddressesMobileBlockSubText">
                      Most-visited addresses in the last 24 hours
                    </div>
                  </div>
                  <div className="trendingAddressesMobileBlockList">
                    {this.props.trendingAddresses &&
                      this.props.trendingAddresses.map((data, index) => {
                        return (
                          <div className="trendingAddressesMobileBlockItemContainer">
                            <div
                              onClick={() => {
                                this.props.addTrendingAddress(index, true);
                              }}
                              className="trendingAddressesMobileBlockItem"
                            >
                              {/* <div className="trendingAddressesMobileBlockItemWalletContainer">
                                <Image
                                  className="trendingAddressesMobileBlockItemWallet"
                                  src={TrendingWalletIcon}
                                />
                              </div> */}
                              <div className="trendingAddressesMobileBlockItemDataContainer">
                                <div className="inter-display-medium f-s-13">
                                  {data.trimmedAddress}
                                </div>
                                <div className="inter-display-medium f-s-11 lh-15 trendingAddressesMobileBlockItemDataContainerAmount">
                                  $
                                  {numToCurrency(
                                    data.worth.toFixed(2)
                                  ).toLocaleString("en-US")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginBottom: "8rem",
            }}
            className="mbwBottomDisclaimer"
          >
            <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
              Don't worry.{" "}
              <CustomOverlay
                text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                position="top"
                isIcon={true}
                IconImage={LockIcon}
                isInfo={true}
                className={"mbwBottomDisclaimerHover"}
              >
                <Image
                  src={InfoIcon}
                  className="info-icon"
                  onMouseEnter={this.privacymessage}
                  onLoad={this.questionMarkLogoIconLoaded}
                  style={{
                    cursor: "pointer",
                    opacity: this.state.showQuestionMarkLogo ? 1 : 0,
                  }}
                />
              </CustomOverlay>
            </p>
            <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
              All your information remains private and anonymous.
            </p>
          </div>
        </div>
      </div>
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
MobileHome.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHome);
