import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { MacIcon, SharePortfolioIconWhite } from "../../assets/images/icons";
import { default as SearchIcon } from "../../assets/images/icons/search-icon.svg";
import {
  MobileHomePageView,
  Mobile_Home_Share,
  QuickAddWalletAddress,
  SearchBarAddressAdded,
  TimeSpentMobileHome,
} from "../../utils/AnalyticsFunctions";
import {
  API_LIMIT,
  BASE_URL_S3,
  SORT_BY_TIMESTAMP,
  START_INDEX,
} from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { updateUserWalletApi, updateWalletListFlag } from "../common/Api";
import BarGraphSection from "../common/BarGraphSection.js";
import Loading from "../common/Loading";
import Footer from "../common/footer";
import { setHeaderReducer } from "../header/HeaderAction.js";
import NewHomeInputBlock from "../home/NewHomeInputBlock.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getNFT } from "../nft/NftApi.js";
import { detectCoin } from "../onboarding/Api.js";
import { addUserCredits } from "../profile/Api.js";

import InflowOutflowPortfolioHome from "../intelligence/InflowOutflowPortfolioHome.js";
import PieChart2 from "./PieChart2";
import PortfolioHomeInsightsBlock from "./PortfolioHomeInsightsBlock.js";
import WelcomeCard from "./WelcomeCard";
import "./_mobilePortfolio.scss";

class PortfolioMobile extends BaseReactComponent {
  constructor(props) {
    super(props);

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      nftSort: [],
      disableAddBtn: false,
      addButtonVisible: false,
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
      startTime: "",
      showPopupModal: true,
      showSearchIcon: false,
      showShareIcon: false,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      showHideDustVal: true,
      isDarkMode:
        document.querySelector("body").getAttribute("data-theme") &&
        document.querySelector("body").getAttribute("data-theme") === "dark"
          ? true
          : false,
      showHideDustValTrans: true,
      isShowingAge: true,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      walletList: [],
      sortTransHistory: [{ key: SORT_BY_TIMESTAMP, value: false }],
      conditionTransHistory: [],
      minAmountTransHistory: "1",
      maxAmountTransHistory: "1000000000",
      tableSortOpt: [
        {
          title: "time",
          up: true,
        },
        {
          title: "from",
          up: false,
        },
        {
          title: "to",
          up: false,
        },
        {
          title: "asset",
          up: false,
        },
        {
          title: "amount",
          up: false,
        },
        {
          title: "usdThen",
          up: false,
        },
        {
          title: "usdToday",
          up: false,
        },
        {
          title: "usdTransaction",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
        {
          title: "hash",
          up: false,
        },
      ],
      nftTableData: [],
      isLoadingNft: false,
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
    };
  }

  searchIconLoaded = () => {
    this.setState({
      showSearchIcon: true,
    });
  };

  toggleAgeTimestamp = () => {
    this.setState({
      isShowingAge: !this.state.isShowingAge,
    });
  };

  shareIconLoaded = () => {
    this.setState({
      showShareIcon: true,
    });
  };
  hideThePopupModal = () => {
    window.sessionStorage.setItem("mobileHomePagePopupModalHidden", true);
    this.setState({
      showPopupModal: false,
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    MobileHomePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkMobileHomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.commonState?.nftPage) {
      // this.callNftApi();
    }
  }
  componentDidMount() {
    if (
      this.props.NFTState &&
      this.props.NFTState?.nfts &&
      this.props.NFTState?.nfts?.length > 0 &&
      this.props.commonState.nftPage
    ) {
      this.setState({
        nftTableData: this.props.NFTState?.nfts,
        isLoadingNft: false,
      });
    } else {
      // this.callNftApi();
    }

    const tempIsModalPopuRemoved = window.sessionStorage.getItem(
      "mobileHomePagePopupModalHidden"
    );
    if (tempIsModalPopuRemoved) {
      this.setState({
        showPopupModal: false,
      });
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkMobileHomeTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("mobileHomePageExpiryTime", tempExpiryTime);
  };

  endPageView = () => {
    clearInterval(window.checkMobileHomeTimer);
    window.sessionStorage.removeItem("mobileHomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentMobileHome({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };

  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
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
  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

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
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
      walletInput: walletCopy,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // timeout;
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 1000);
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
          false,
          false
        );
      }
    }
  };
  onKeyPressInput = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!this.state.disableAddBtn) {
        this.handleAddWallet(true);
      }
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
  handleAddWallet = (replaceAddresses) => {
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
  cancelAddingWallet = () => {};
  resetCreditPoints = () => {};
  callNftApi = (page = START_INDEX) => {
    this.props.updateWalletListFlag("nftPage", true);
    this.setState({
      isLoadingNft: true,
    });

    let addWalletList = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let arr = [];
    let addressList = [];
    if (addWalletList && addWalletList.length > 0) {
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
          arr.push(curr.address?.trim());
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.address?.trim());
          addressList.push(curr.address?.trim());
        }
      }
    }
    let tempNFTData = new URLSearchParams();

    tempNFTData.append("wallet_addresses", JSON.stringify(addressList));
    tempNFTData.append("start", page * API_LIMIT);
    tempNFTData.append("conditions", JSON.stringify([]));
    tempNFTData.append("limit", API_LIMIT);
    tempNFTData.append("sorts", JSON.stringify([]));
    let isDefault = false;
    if (this.state.nftSort.length === 0) {
      isDefault = true;
    }

    this.props.getNFT(tempNFTData, this, isDefault);
  };
  setLocalNftData = (data) => {
    this.setState({
      nftTableData: data.nfts,
      isLoadingNft: false,
    });
  };

  render() {
    return (
      <div className="mobilePortfolioContainer">
        {this.props.loader ? (
          <div className="mpLoadingContainer">
            <Loading />
          </div>
        ) : (
          <div className="mpcHomeContainer">
            {this.state.showPopupModal ? (
              <div className="mpcHomeFloatingContainer">
                <div className="mpcHomeFloatingElement">
                  <div className="mpcHFMacIconContainer">
                    <Image src={MacIcon} className="mpcHFMacIcon" />
                  </div>
                  <div className="mpcHFText inter-display-medium f-s-13">
                    Visit app.loch.one from your desktop for all the details
                  </div>
                  <div
                    onClick={this.hideThePopupModal}
                    className="mpcHFGoBtn inter-display-medium f-s-13 btn-bg-black"
                  >
                    Ok
                  </div>
                </div>
              </div>
            ) : null}
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
              {!(
                this.state.walletInput && this.state.walletInput[0].address
              ) ? (
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
            <div className="mpcHomePage">
              <WelcomeCard
                handleShare={this.handleShare}
                isSidebarClosed={this.props.isSidebarClosed}
                changeWalletList={this.props.handleChangeList}
                apiResponse={(e) => this.props.CheckApiResponse(e)}
                showNetworth={true}
                // yesterday balance
                yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                assetTotal={this.props.getTotalAssetValue()}
                history={this.props.history}
                handleAddModal={this.props.handleAddModal}
                isLoading={this.props.isLoadingNet}
                handleManage={() => {}}
                isMobileRender
              />
              <PieChart2
                setLoader={this.props.setLoader}
                chainLoader={this.props.chainLoader}
                totalChainDetechted={this.state.totalChainDetechted}
                userWalletData={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainWallet &&
                  Object.keys(this.props.portfolioState.chainWallet).length > 0
                    ? Object.values(this.props.portfolioState.chainWallet)
                    : null
                }
                chainPortfolio={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainPortfolio &&
                  Object.keys(this.props.portfolioState.chainPortfolio).length >
                    0
                    ? Object.values(this.props.portfolioState.chainPortfolio)
                    : null
                }
                allCoinList={
                  this.props.OnboardingState &&
                  this.props.OnboardingState.coinsList &&
                  Object.keys(this.props.OnboardingState.coinsList).length > 0
                    ? Object.values(this.props.OnboardingState.coinsList)
                    : null
                }
                assetTotal={this.props.getTotalAssetValue()}
                assetPrice={
                  this.props.portfolioState.assetPrice &&
                  Object.keys(this.props.portfolioState.assetPrice).length > 0
                    ? Object.values(this.props.portfolioState.assetPrice)
                    : null
                }
                isLoading={this.props.isLoading}
                isUpdate={this.props.isUpdate}
                walletTotal={this.props.portfolioState.walletTotal}
                undetectedWallet={(e) => this.props.undetectedWallet(e)}
                getProtocolTotal={this.props.getProtocolTotal}
                updateTimer={this.props.updateTimer}
              />

              <div className="mobile-portfolio-blocks">
                <div className="section-table-toggle-mobile">
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockOneSelectedItem === 1
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockOneItem(1);
                    }}
                  >
                    Assets
                  </div>
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockThreeSelectedItem === 1 &&
                      this.props.blockOneSelectedItem !== 1
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockOneItem(4);
                      this.props.changeBlockThreeItem(1);
                    }}
                  >
                    Yield opportunities
                  </div>
                </div>
                <div className="mobile-portfolio-blocks-content">
                  {this.props.blockOneSelectedItem === 1 ? (
                    <div>
                      <div
                        className={`newHomeTableContainer newHomeTableContainerMobile ${
                          this.props.AvgCostLoading ||
                          this.props.tableDataCostBasis?.length < 1
                            ? ""
                            : "tableWatermarkOverlay"
                        } ${
                          this.props.intelligenceState.Average_cost_basis
                            .length <= 10
                            ? "newHomeTableContainerNoShowMore"
                            : "newHomeTableContainerNoShowMore"
                        }`}
                      >
                        <TransactionTable
                          noSubtitleBottomPadding
                          disableOnLoading
                          isMiniversion
                          message="No assets found"
                          tableData={
                            this.props.tableDataCostBasis
                              ? this.props.tableDataCostBasis.slice(0, 10)
                              : []
                          }
                          columnList={this.props.CostBasisColumnData}
                          headerHeight={60}
                          isArrow={true}
                          isLoading={this.props.AvgCostLoading}
                          isAnalytics="average cost basis"
                          fakeWatermark
                          xAxisScrollable
                          yAxisScrollable
                          xAxisScrollableColumnWidth={3}
                        />
                      </div>
                    </div>
                  ) : this.props.blockThreeSelectedItem === 1 ? (
                    <div>
                      <div
                        className={`newHomeTableContainer newHomeTableContainerMobile ${
                          this.props.yieldOpportunitiesTableLoading ||
                          this.props.yieldOpportunitiesListTemp?.length < 1
                            ? ""
                            : "tableWatermarkOverlay"
                        } ${
                          this.props.yieldOpportunitiesTotalCount?.length <= 10
                            ? "newHomeTableContainerNoShowMore"
                            : "newHomeTableContainerNoShowMore"
                        }`}
                      >
                        <TransactionTable
                          message={"No yield opportunities found"}
                          xAxisScrollable
                          xAxisScrollableColumnWidth={3}
                          noSubtitleBottomPadding
                          disableOnLoading
                          isMiniversion
                          tableData={this.props.yieldOpportunitiesListTemp}
                          showDataAtBottom
                          columnList={this.props.YieldOppColumnData}
                          headerHeight={60}
                          isArrow={true}
                          isLoading={this.props.yieldOpportunitiesTableLoading}
                          fakeWatermark
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mobile-portfolio-blocks">
                <div className="section-table-toggle-mobile">
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockTwoSelectedItem === 1
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockTwoItem(1);
                    }}
                  >
                    Flows
                  </div>
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockTwoSelectedItem === 2
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockTwoItem(2);
                    }}
                  >
                    Gas fees
                  </div>
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockTwoSelectedItem === 3
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockTwoItem(3);
                    }}
                  >
                    Counterparties
                  </div>
                </div>
                <div className="mobile-portfolio-blocks-content portfolio-page-section portfolio-page-section-mobile">
                  <div
                    className="section-table section-table-mobile"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "none",
                    }}
                  >
                    <div className="profit-chart profit-chart-mobile">
                      {this.props.blockTwoSelectedItem === 1 ? (
                        <BarGraphSection
                          // openChartPage={() => {}}
                          newHomeSetup
                          disableOnLoading
                          noSubtitleBottomPadding
                          noSubtitleTopPadding
                          loaderHeight={15.5}
                          isScrollVisible={false}
                          data={
                            this.props.intelligenceState?.graphValue &&
                            this.props.intelligenceState?.graphValue[0]
                          }
                          options={
                            this.props.intelligenceState?.graphValue &&
                            this.props.intelligenceState?.graphValue[1]
                          }
                          coinsList={this.props.OnboardingState.coinsList}
                          showFooter={false}
                          showBadges={false}
                          showSwitch={false}
                          isLoading={this.props.netFlowLoading}
                          className={"portfolio-profit-and-loss"}
                          isMinichart={true}
                          ProfitLossAsset={
                            this.props.intelligenceState.ProfitLossAsset
                          }
                          isSwitch
                          isMobileGraph
                        />
                      ) : this.props.blockTwoSelectedItem === 2 ? (
                        <div
                          style={{
                            position: "relative",
                          }}
                          className="tableWatermarkOverlay"
                        >
                          <div
                            style={{
                              position: "absolute",
                              opacity: 0,
                            }}
                          >
                            Loch
                          </div>
                          <BarGraphSection
                            digit={this.props.GraphDigit}
                            isFromHome
                            // openChartPage={() => {}}
                            data={
                              this.props.homeGraphFeesData &&
                              this.props.homeGraphFeesData[0]
                            }
                            options={
                              this.props.homeGraphFeesData &&
                              this.props.homeGraphFeesData[1]
                            }
                            options2={
                              this.props.homeGraphFeesData &&
                              this.props.homeGraphFeesData[2]
                            }
                            isScrollVisible={false}
                            isScroll={true}
                            isLoading={this.props.gasFeesGraphLoading}
                            oldBar
                            noSubtitleBottomPadding
                            newHomeSetup
                            noSubtitleTopPadding
                            floatingWatermark
                            isMobileGraph
                          />
                        </div>
                      ) : this.props.blockTwoSelectedItem === 3 ? (
                        <>
                          <div
                            style={{
                              position: "absolute",
                              opacity: 0,
                            }}
                          >
                            Loch
                          </div>
                          <BarGraphSection
                            digit={this.props.counterGraphDigit}
                            isFromHome
                            // openChartPage={() => {}}
                            data={
                              this.props.homeCounterpartyVolumeData &&
                              this.props.homeCounterpartyVolumeData[0]
                            }
                            options={
                              this.props.homeCounterpartyVolumeData &&
                              this.props.homeCounterpartyVolumeData[1]
                            }
                            options2={
                              this.props.homeCounterpartyVolumeData &&
                              this.props.homeCounterpartyVolumeData[2]
                            }
                            isScrollVisible={false}
                            isScroll={true}
                            isLoading={this.props.counterGraphLoading}
                            oldBar
                            noSubtitleBottomPadding
                            newHomeSetup
                            noSubtitleTopPadding
                            floatingWatermark
                            isMobileGraph
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions, gas fees and insights */}
              <div className="mobile-portfolio-blocks">
                <div className="section-table-toggle-mobile">
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockFourSelectedItem === 1
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockFourItem(1);
                    }}
                  >
                    Price Guage
                  </div>
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockFourSelectedItem === 2
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockFourItem(2);
                    }}
                  >
                    Transactions
                  </div>
                  <div
                    className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                      this.props.blockFourSelectedItem === 3
                        ? "section-table-toggle-element-selected"
                        : ""
                    }`}
                    onClick={() => {
                      this.props.changeBlockFourItem(3);
                    }}
                  >
                    Insights
                  </div>
                </div>
                <div className="mobile-portfolio-blocks-content">
                  {this.props.blockFourSelectedItem === 1 ? (
                    <div className="mobile-portfolio-blocks-content-price-gauge">
                      <InflowOutflowPortfolioHome
                        hideExplainer
                        showEth
                        userWalletList={this.props.userWalletList}
                        lochToken={this.props.lochToken}
                        callChildPriceGaugeApi={
                          this.props.callChildPriceGaugeApi
                        }
                        isMobileGraph
                      />
                    </div>
                  ) : this.props.blockFourSelectedItem === 2 ? (
                    <div>
                      <div
                        className={`newHomeTableContainer newHomeTableContainerMobile ${
                          this.props.tableLoading ||
                          this.props.tableData?.length < 1
                            ? ""
                            : "tableWatermarkOverlay"
                        } ${
                          this.props.totalCount <= 10
                            ? "newHomeTableContainerNoShowMore"
                            : "newHomeTableContainerNoShowMore"
                        }`}
                      >
                        <TransactionTable
                          xAxisScrollable
                          xAxisScrollableColumnWidth={3}
                          noSubtitleBottomPadding
                          disableOnLoading
                          isMiniversion
                          tableData={this.props.tableData}
                          columnList={this.props.columnList}
                          headerHeight={60}
                          isArrow={true}
                          isLoading={this.props.tableLoading}
                          addWatermark
                        />
                      </div>
                    </div>
                  ) : this.props.blockFourSelectedItem === 3 ? (
                    <PortfolioHomeInsightsBlock
                      history={this.props.history}
                      updatedInsightList={this.props.updatedInsightList}
                      insightsBlockLoading={this.props.insightsBlockLoading}
                      isMobile
                    />
                  ) : null}
                </div>
              </div>
              {/* <div
                className="d-flex justify-content-between"
                style={{
                  marginTop: "4.8rem",
                  alignItems: "center",
                }}
              >
                <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                  NFTs
                </h2>
                <div
                  className="homepage-mobile-view-more"
                  onClick={() => {
                    this.props.history.push("/nft");
                  }}
                >
                  View more
                  <img src={chevronRight} alt="" />
                </div>
              </div>{" "}
              <div style={{ marginTop: "16px" }}>
                {this.state.isLoadingNft ? (
                  <div
                    style={{
                      height: "45vh",
                    }}
                  >
                    <div className="mpLoadingContainer">
                      <Loading />
                    </div>
                  </div>
                ) : (
                  <div className="nft-page-mobile">
                    <div
                      className="mobileSmartMoneyListContainer"
                      style={{ padding: "0px" }}
                    >
                      {this.state.nftTableData
                        .slice(0, 3)
                        .map((mapData, index) => {
                          return (
                            <NftMobileBlock
                              data={mapData}
                              style={{
                                marginBottom:
                                  index === this.state.nftTableData.length - 1
                                    ? "0px"
                                    : "1.5rem",
                              }}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}
              </div> */}
              <div className="mobileFooterContainer">
                <div>
                  <Footer isMobile />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  defiState: state.DefiState,
  NFTState: state.NFTState,
});
const mapDispatchToProps = {
  detectCoin,
  updateWalletListFlag,
  setHeaderReducer,
  addUserCredits,
  updateUserWalletApi,
  getNFT,
};
PortfolioMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMobile);
