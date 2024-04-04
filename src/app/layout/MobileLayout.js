import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  MobileNavFollow,
  MobileNavFollowActive,
  MobileNavHome,
  MobileNavHomeActive,
  MobileNavLeaderboard,
  MobileNavLeaderboardActive,
  MobileNavNFT,
  MobileNavProfile,
  SharePortfolioIconWhite,
} from "../../assets/images/icons";
import { default as SearchIcon } from "../../assets/images/icons/search-icon.svg";
import NFTIcon from "../../assets/images/icons/sidebar-nft.svg";
import {
  Mobile_Home_Share,
  QuickAddWalletAddress,
  SearchBarAddressAdded,
  resetUser,
} from "../../utils/AnalyticsFunctions";
import { BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { BaseReactComponent } from "../../utils/form";
import { isNewAddress } from "../Portfolio/Api.js";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  setPageFlagDefault,
  updateUserWalletApi,
  updateWalletListFlag,
} from "../common/Api";
import Footer from "../common/footer";
import { setHeaderReducer } from "../header/HeaderAction";
import NewHomeInputBlock from "../home/NewHomeInputBlock";
import { detectCoin } from "../onboarding/Api";
import { addUserCredits } from "../profile/Api";
import SmartMoneyMobileSignOutModal from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileSignOutModal.js";
import { getAllWalletListApi } from "../wallet/Api";
import "./_mobileLayout.scss";
import MobileDarkModeWrapper from "../Portfolio/MobileDarkModeWrapper.js";
import Breadcrums from "../common/Breadcrums.js";

class MobileLayout extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      lochUserLocal: JSON.parse(window.sessionStorage.getItem("lochUser")),
      confirmLeave: false,

      walletInput: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: false,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
      showSearchIcon: false,
      showShareIcon: false,
      disableAddBtn: false,
      navItems: [
        {
          activeIcon: MobileNavHomeActive,
          inactiveIcon: MobileNavHome,
          text: "Home",
          path: "/home",
        },
        {
          activeIcon: MobileNavFollowActive,
          inactiveIcon: MobileNavFollow,
          text: "Following",
          path: "/watchlist",
        },
        {
          activeIcon: MobileNavLeaderboardActive,
          inactiveIcon: MobileNavLeaderboard,
          text: "Leaderboard",
          path: "/home-leaderboard",
        },
        {
          activeIcon: MobileNavProfile,
          inactiveIcon: MobileNavProfile,
          text: "Sign Out",
          path: "/",
        },
      ],
      userWalletList: [],
      isUpdate: 0,
      isLoadingInsight: true,
      isLoading: true,
      isLoadingNet: true,
      chainLoader: true,
    };
  }

  shareIconLoaded = () => {
    this.setState({ showShareIcon: true });
  };

  searchIconLoaded = () => {
    this.setState({ showSearchIcon: true });
  };

  componentDidUpdate() {
    if (!this.props.commonState?.mobileLayout) {
      this.props.updateWalletListFlag("mobileLayout", true);
      this.setState({
        lochUserLocal: JSON.parse(window.sessionStorage.getItem("lochUser")),
      });
    }
  }
  componentDidMount() {
    // for chain detect
  }
  handleShare = () => {
    Mobile_Home_Share({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=home";
    // navigator.clipboard.writeText(shareLink);
    this.copyTextToClipboard(shareLink);

    // HomeShare({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  };

  handleAddWallet = (replaceAddresses) => {
    sessionStorage.setItem("replacedOrAddedAddress", true);
    if (this.state.goBtnDisabled) {
      return null;
    }
    if (this.state.walletInput[0]) {
      SearchBarAddressAdded({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: this.state.walletInput[0].address,
        isMobile: true,
      });
    }
    this.setState({
      disableAddBtn: true,
    });
    let addWalletList = [];

    if (!replaceAddresses) {
      addWalletList = JSON.parse(window.sessionStorage.getItem("addWallet"));
      if (addWalletList && addWalletList?.length > 0) {
        addWalletList = addWalletList?.map((e) => {
          return {
            ...e,
            showAddress: e.nickname === "" ? true : false,
            showNickname: e.nickname === "" ? false : true,
            showNameTag: e.nameTag === "" ? false : true,
            apiAddress: e.address,
          };
        });
      }
      if (addWalletList && addWalletList.length > 0) {
        for (let i = 0; i < addWalletList.length; i++) {
          if (addWalletList[i].id === "wallet1") {
            addWalletList[i].id = "wallet" + (addWalletList.length + 1);
          }
        }
      }
    }
    let tempWalletInput = this.state.walletInput[0];
    addWalletList = [...addWalletList, tempWalletInput];

    let arr = [];
    let addressList = [];
    let nicknameArr = {};
    let isChainDetected = [];
    let total_address = 0;
    let walletList = [];
    for (let i = 0; i < addWalletList.length; i++) {
      let curr = addWalletList[i];

      let isIncluded = false;
      const whatIndex = arr.findIndex(
        (resRes) =>
          resRes?.trim()?.toLowerCase() ===
            curr?.address?.trim()?.toLowerCase() ||
          resRes?.trim()?.toLowerCase() ===
            curr?.displayAddress?.trim()?.toLowerCase() ||
          resRes?.trim()?.toLowerCase() ===
            curr?.apiAddress?.trim()?.toLowerCase()
      );
      if (whatIndex !== -1) {
        isIncluded = true;
      }
      if (!isIncluded && curr.address) {
        walletList.push(curr);
        if (curr.address) {
          arr.push(curr.address?.trim());
        }
        nicknameArr[curr.address?.trim()] = curr.nickname;
        if (curr.displayAddress) {
          arr.push(curr.displayAddress?.trim());
        }
        if (curr.apiAddress) {
          arr.push(curr.apiAddress?.trim());
        }
        addressList.push(curr.address?.trim());
        isChainDetected.push(curr?.coinFound);
        total_address = total_address + 1;
      }
    }

    let addWallet = walletList;

    addWallet?.forEach((w, i) => {
      if (w.id) {
      } else {
        w.id = `wallet${i + 1}`;
      }
    });

    if (addWallet) {
      this.props.setHeaderReducer(addWallet);
    }
    window.sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    // data.append("wallet_addresses", JSON.stringify(arr));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));
    // data.append("chain_detected", chain_detechted);

    // if its upload then we pass user id
    if (this.state.isChangeFile) {
      data.append("user_id", getCurrentUser().id);
      this.setState({
        isChangeFile: false,
      });
    }
    let creditIsAddress = false;
    let creditIsEns = false;
    for (let i = 0; i < addressList.length; i++) {
      const tempItem = addressList[i];
      const endsWithEth = /\.eth$/i.test(tempItem);

      if (endsWithEth) {
        creditIsAddress = true;
        creditIsEns = true;
      } else {
        creditIsAddress = true;
      }
    }

    if (creditIsAddress) {
      // Single address
      const addressCreditScore = new URLSearchParams();
      addressCreditScore.append("credits", "address_added");
      this.props.addUserCredits(addressCreditScore, this.resetCreditPoints);

      // Multiple address
      const multipleAddressCreditScore = new URLSearchParams();
      multipleAddressCreditScore.append("credits", "multiple_address_added");
      this.props.addUserCredits(
        multipleAddressCreditScore,
        this.resetCreditPoints
      );
    }
    if (creditIsEns) {
      const ensCreditScore = new URLSearchParams();
      ensCreditScore.append("credits", "ens_added");
      this.props.addUserCredits(ensCreditScore, this.resetCreditPoints);
    }
    this.props.updateUserWalletApi(data, this, yieldData, true);

    const address = addWalletList?.map((e) => e.address);

    const addressDeleted = this.state.deletedAddress;
    const unrecog_address = addWalletList
      ?.filter((e) => !e.coinFound)
      ?.map((e) => e.address);
    const recog_address = addWalletList
      ?.filter((e) => e.coinFound)
      ?.map((e) => e.address);

    const blockchainDetected = [];
    const nicknames = [];
    addWalletList
      ?.filter((e) => e.coinFound)
      ?.map((obj) => {
        let coinName = obj.coins
          ?.filter((e) => e.chain_detected)
          ?.map((name) => name.coinName);
        let address = obj.address;
        let nickname = obj.nickname;
        blockchainDetected.push({ address: address, names: coinName });
        nicknames.push({ address: address, nickname: nickname });
      });

    QuickAddWalletAddress({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      addresses_added: address,
      ENS_added: address,
      addresses_deleted: addressDeleted,
      ENS_deleted: addressDeleted,
      unrecognized_addresses: unrecog_address,
      recognized_addresses: recog_address,
      blockchains_detected: blockchainDetected,
      nicknames: nicknames,
      isMobile: true,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

  CheckApiResponseMobileLayout = (value) => {
    if (this.props.CheckApiResponse) {
      this.props.CheckApiResponse(value);
    } else {
      this.props.setPageFlagDefault();
    }
  };

  hideTheTopBarHistoryItems = () => {
    this.setState({
      walletInput: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: false,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
    });
  };

  handleOnChange = (e) => {
    let { name, value } = e.target;

    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      let prevValue = walletCopy[foundIndex].address;

      walletCopy[foundIndex].address = value;
      if (value === "" || prevValue !== value) {
        walletCopy[foundIndex].coins = [];
      }
      if (value === "") {
        walletCopy[foundIndex].coinFound = false;
        walletCopy[foundIndex].nickname = "";
      }
      // walletCopy[foundIndex].trucatedAddress = value
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState(
      {
        addButtonVisible: this.state.walletInput.some((wallet) =>
          wallet.address ? true : false
        ),
        walletInput: walletCopy,
      },
      () => {
        this.timeout = setTimeout(() => {
          this.getCoinBasedOnWalletAddress(name, value);
        }, 1000);
      }
    );
    // timeout;
  };

  onKeyPressInput = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!this.state.disableAddBtn) {
        this.handleAddWallet(true);
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
          coinName: item?.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );
    let i = this.state.walletInput.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.walletInput];

    //new code
    data.address !== newAddress[i].address
      ? (newAddress[i].coins = [])
      : newAddress[i].coins.push(...newCoinList);

    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound = newAddress[i].coins.some(
      (e) => e.chain_detected === true
    );

    newAddress[i].apiAddress = data?.apiaddress;

    this.setState({
      walletInput: newAddress,
    });
  };

  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      window.sessionStorage.removeItem("shouldRecallApis");
      const tempWalletAddress = [value];
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(tempWalletAddress));
      this.props.isNewAddress(data);
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
          false,
          false
        );
      }
    }
  };

  cancelAddingWallet = () => {};
  resetCreditPoints = () => {};

  // when press go this function run
  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
      isLoadingInsight: true,

      isLoading: true,
      isLoadingNet: true,

      chainLoader: true,
    });
  };

  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };

  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  closeConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: false,
    });
  };
  openConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: true,
    });
  };
  signOutFun = () => {
    window.sessionStorage.setItem("refresh", false);
    resetUser();
    this.props.setPageFlagDefault();
    this.closeConfirmLeaveModal();
    this.props.history.push("/welcome");
  };
  render() {
    const getTotalAssetValue = () => {
      if (this.props.portfolioState) {
        const tempWallet = this.props.portfolioState.walletTotal
          ? this.props.portfolioState.walletTotal
          : 0;
        const tempCredit = this.props.defiState.totalYield
          ? this.props.defiState.totalYield
          : 0;
        const tempDebt = this.props.defiState.totalDebt
          ? this.props.defiState.totalDebt
          : 0;

        return tempWallet + tempCredit - tempDebt;
      }
      return 0;
    };
    return (
      <div className="portfolio-mobile-layout mobileSmartMoneyPage">
        {this.state.confirmLeave ? (
          <SmartMoneyMobileSignOutModal
            onSignOut={this.signOutFun}
            onHide={this.closeConfirmLeaveModal}
          />
        ) : null}
        <div className="portfolio-mobile-layout-wrapper">
          {/* Search Bar */}
          <div className="mpcMobileSearch input-noshadow-dark">
            <div className="mpcMobileSearchInput">
              <Image
                style={{
                  opacity: this.state.showSearchIcon ? 1 : 0,
                }}
                onLoad={this.searchIconLoaded}
                className="mpcMobileSearchImage"
                src={SearchIcon}
              />

              {this.state.walletInput?.map((c, index) => (
                <div className="topSearchBarMobileContainer">
                  <NewHomeInputBlock
                    noAutofocus
                    onGoBtnClick={this.handleAddWallet}
                    hideMore
                    isMobile
                    c={c}
                    index={index}
                    walletInput={this.state.walletInput}
                    handleOnChange={this.handleOnChange}
                    onKeyDown={this.onKeyPressInput}
                    goBtnDisabled={this.state.disableAddBtn}
                    removeFocusOnEnter
                  />
                </div>
              ))}
            </div>
            {!(this.state.walletInput && this.state.walletInput[0].address) ? (
              <div className="mpcMobileShare" onClick={this.handleShare}>
                <Image
                  style={{
                    opacity: this.state.showShareIcon ? 1 : 0,
                  }}
                  onLoad={this.shareIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SharePortfolioIconWhite}
                />
              </div>
            ) : null}
          </div>

          {/* Children Holder */}
          <div
            id="portfolio-mobile-layout-children-id"
            className="portfolio-mobile-layout-children"
          >
            <div style={{ paddingBottom: "64px" }}>
              <div className="mobilePortfolioContainer">
                <div className="mpcHomeContainer">
                  <div id="mobileLayoutScrollContainer" className="mpcHomePage">
                    <Breadcrums
                      showpath={this.props.showpath}
                      currentPage={this.props.currentPage}
                      isMobile
                    />
                    <MobileDarkModeWrapper>
                      {this.props.hideAddresses ? (
                        <></>
                      ) : (
                        <WelcomeCard
                          openConnectWallet={this.props.openConnectWallet}
                          connectedWalletAddress={
                            this.props.connectedWalletAddress
                          }
                          disconnectWallet={this.props.disconnectWallet}
                          handleShare={this.handleShare} //Done
                          isSidebarClosed={this.props.isSidebarClosed} // done
                          changeWalletList={this.props.handleChangeList} // done
                          apiResponse={(e) =>
                            this.CheckApiResponseMobileLayout(e)
                          } // done
                          showNetworth={true}
                          // yesterday balance
                          yesterdayBalance={
                            this.props?.portfolioState?.yesterdayBalance // done
                          }
                          assetTotal={getTotalAssetValue()} // done
                          history={this.props.history} // done
                          handleAddModal={this.props.handleAddModal} // done
                          isLoading={false}
                          handleManage={() => {}}
                          isMobileRender
                        />
                      )}
                    </MobileDarkModeWrapper>
                    {/* <TopWalletAddressList
                      apiResponse={(e) => this.CheckApiResponseMobileLayout(e)}
                      handleShare={this.handleShare}
                      // passedFollowSigninModal={this.state.followSigninModal}
                      showUpdatesJustNowBtn
                      // getCurrentTimeUpdater={this.state.getCurrentTimeUpdater}
                      isMobile
                    /> */}

                    {/* Children */}
                    {this.props.children}

                    {this.props.hideFooter ? null : (
                      <div className="mobileFooterContainer">
                        <div>
                          <Footer isMobile />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Panel */}
          <div className="portfolio-mobile-layout-nav-footer">
            <div className="portfolio-mobile-layout-nav-footer-inner">
              {this.state.navItems.map((item, index) => {
                if (item.text === "Sign Out" && !this.state.lochUserLocal) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.text === "Sign Out") {
                        this.openConfirmLeaveModal();
                      } else {
                        this.props.history.push(item.path);
                      }
                    }}
                    className={`portfolio-mobile-layout-nav-footer-inner-item ${
                      item.path === this.props.history.location.pathname
                        ? "portfolio-mobile-layout-nav-footer-inner-item-active"
                        : ""
                    }`}
                  >
                    <Image
                      className={`portfolio-mobile-layout-nav-footer-inner-item-image ${
                        item.path === this.props.history.location.pathname
                          ? "portfolio-mobile-layout-nav-footer-inner-item-image-active"
                          : ""
                      }`}
                      src={
                        item.path === this.props.history.location.pathname
                          ? item.activeIcon
                          : item.inactiveIcon
                      }
                    />
                    <span className="portfolio-mobile-layout-nav-footer-inner-item-text">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.portfolioState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  detectCoin,
  setHeaderReducer,
  addUserCredits,
  updateUserWalletApi,
  setPageFlagDefault,
  getAllWalletListApi,
  updateWalletListFlag,
  isNewAddress,
};

MobileLayout.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(MobileLayout);
