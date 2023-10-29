import React from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Image } from "react-bootstrap";

import LockIcon from "../../assets/images/icons/lock-icon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";

import { setPageFlagDefault, updateUserWalletApi } from "../common/Api";

import { TimeSpentDiscountEmail } from "../../utils/AnalyticsFunctions";
import {
  CloseIcon,
  LochLogoWhiteIcon,
  MobileSearchGreyIcon,
} from "../../assets/images/icons";
import { createAnonymousUserApi, detectCoin } from "../onboarding/Api";
import {
  setHeaderReducer,
  setMetamaskConnectedReducer,
} from "../header/HeaderAction";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { CustomCoin } from "../../utils/commonComponent";
import { CustomButton } from "../../utils/form";

class Home extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
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
  componentDidMount() {
    const search = this.props?.location?.search;
    const params = new URLSearchParams(search);
    const IsFromMobileHome = params.get("FromMobileHome");
    if (IsFromMobileHome) {
      this.setState({
        showCloseBtn: true,
      });
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
  };
  hideBorder = () => {
    this.setState({
      showBorder: false,
    });
  };
  componentWillUnmount() {
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentDiscountEmail({ time_spent: TimeSpent });
    }
  }

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
  onValidSubmit = () => {
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
    const islochUser = window.sessionStorage.getItem("lochDummyUser");
    if (islochUser) {
      window.sessionStorage.removeItem("lochToken");
      window.sessionStorage.removeItem("addWallet");
      window.sessionStorage.removeItem("lochUser");
      window.sessionStorage.removeItem("lochDummyUser");
      window.sessionStorage.removeItem("currencyRates");
      window.sessionStorage.removeItem("currency");
      window.sessionStorage.removeItem("currentPlan");
      window.sessionStorage.removeItem("share_id");
      window.sessionStorage.removeItem("Plans");
      window.sessionStorage.removeItem("stopClick");
      window.sessionStorage.removeItem("defi_access");
      window.sessionStorage.removeItem("isPopup");
      window.sessionStorage.removeItem("stop_redirect");
      window.sessionStorage.removeItem("connectWalletAddress");
      window.sessionStorage.removeItem("gotShareProtfolio");
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

      // LPC_Go({
      //   addresses: address,
      //   ENS: address,
      //   chains_detected_against_them: blockchainDetected,
      //   unrecognized_addresses: unrecog_address,
      //   unrecognized_ENS: unrecog_address,
      //   nicknames: nicknames,
      // });
    }
  };
  goToHome = () => {
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
                <input
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
                  autocomplete="off"
                  onSubmit={this.onValidSubmit}
                />
              </div>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className="mobileWelcomeContainer">
        <div className="mobileWelcomeBlockHeader">Blank Space</div>
        <div className="mobileWelcomeBlock">
          <div className="mbwBannerContainer">
            {/* <Image className="mbwBanner" src={MobileFrame} /> */}
            <div className="mbwBanner">
              <Image className="mbwBannerLochLogo " src={LochLogoWhiteIcon} />
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
          </div>

          <div
            style={{
              marginBottom: "5rem",
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
                className={"fix-width"}
              >
                <Image
                  src={InfoIcon}
                  className="info-icon"
                  onMouseEnter={this.privacymessage}
                  style={{ cursor: "pointer" }}
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
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
