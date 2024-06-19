import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
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
import {
  numToCurrency,
  switchToDarkMode,
  switchToLightMode,
} from "../../utils/ReusableFunctions.js";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import {
  SwitchDarkMode,
  updateUserWalletApi,
  updateWalletListFlag,
} from "../common/Api";
import BarGraphSection from "../common/BarGraphSection.js";
import Loading from "../common/Loading";
import { setHeaderReducer } from "../header/HeaderAction.js";

import TransactionTable from "../intelligence/TransactionTable.js";
import { getNFT } from "../nft/NftApi.js";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api.js";
import { addUserCredits } from "../profile/Api.js";

import {
  getAllInsightsApi,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";
import InflowOutflowPortfolioHome from "../intelligence/InflowOutflowPortfolioHome.js";
import {
  getAssetGraphDataApi,
  getCoinRate,
  getDetailsByLinkApi,
  getExchangeBalances,
  getExternalEventsApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
} from "./Api.js";
import PieChart2 from "./PieChart2";
import PortfolioHomeInsightsBlock from "./PortfolioHomeInsightsBlock.js";
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
          ? "dark"
          : document.querySelector("body").getAttribute("data-theme") ===
            "dark2"
          ? "dark2"
          : "light",
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
      currency: JSON.parse(window.localStorage.getItem("currency")),
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
    window.localStorage.setItem("mobileHomePagePopupModalHidden", true);
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

    const tempIsModalPopuRemoved = window.localStorage.getItem(
      "mobileHomePagePopupModalHidden"
    );
    if (tempIsModalPopuRemoved) {
      this.setState({
        showPopupModal: false,
      });
    }

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkMobileHomeTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("mobileHomePageExpiryTime", tempExpiryTime);
  };

  endPageView = () => {
    clearInterval(window.checkMobileHomeTimer);
    window.localStorage.removeItem("mobileHomePageExpiryTime");
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
    const tempExpiryTime = window.localStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
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
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
  handleDarkMode = (status = "light") => {
    const darkOrLight = document
      .querySelector("body")
      .getAttribute("data-theme");
    if (darkOrLight === "dark") {
      this.setState({
        isDarkMode: false,
      });
      switchToLightMode();
      this.props.SwitchDarkMode(false);
    } else {
      switchToDarkMode();
      this.setState({
        isDarkMode: true,
      });
      this.props.SwitchDarkMode(true);
    }
    // if (darkOrLight === "dark") {
    //   setIsDarkMode('light');
    //   switchToLightMode();
    //   props.SwitchDarkMode(false);
    // } else {
    //   switchToDarkMode();
    //   setIsDarkMode(true);
    //   props.SwitchDarkMode(true);
    // }
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
      addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
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
    window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
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

    let addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
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
      <div>
        {this.props.loader ? (
          <div className="mpLoadingContainer">
            <Loading />
          </div>
        ) : (
          <>
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
                Object.keys(this.props.portfolioState.chainPortfolio).length > 0
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
              openDefiPage={this.props.openDefiPage}
              isMobile={true}
            />

            <div className="mobile-portfolio-blocks">
              <div className="section-table-toggle-mobile">
                <div
                  className={`inter-display-medium section-table-toggle-element mr-1 ${
                    this.props.blockOneSelectedItem === 1
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockOneItem(1);
                  }}
                >
                  Tokens
                </div>
                <div
                  className={`inter-display-medium section-table-toggle-element ${
                    this.props.blockOneSelectedItem === 4
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockOneItem(4);
                    this.props.changeBlockThreeItem(2);
                  }}
                >
                  Yield opportunities
                </div>
                <div
                  className={`inter-display-medium section-table-toggle-element ${
                    this.props.blockOneSelectedItem === 5
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockOneItem(5);
                    this.props.changeBlockThreeItem(1);
                  }}
                >
                  Counterparties
                </div>
              </div>
              <div className="mobile-portfolio-blocks-content">
                {this.props.blockOneSelectedItem === 1 ? (
                  <div>
                    <div
                      className={`freezeTheFirstColumn newHomeTableContainer newHomeTableContainerMobile hide-scrollbar ${
                        this.props.AvgCostLoading ||
                        this.props.tableDataCostBasis?.length < 1
                          ? ""
                          : "tableWatermarkOverlay"
                      } ${
                        this.props.intelligenceState.Average_cost_basis
                          .length <= 10
                          ? ""
                          : ""
                      }`}
                    >
                      <TransactionTable
                        noSubtitleBottomPadding
                        disableOnLoading
                        isMiniversion
                        message="No tokens found"
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
                        xAxisScrollableColumnWidth={3.4}
                      />
                    </div>
                    {!this.props.AvgCostLoading ? (
                      <div className="inter-display-medium bottomExtraInfo">
                        <div
                          onClick={this.props.goToAssetsPage}
                          className="bottomExtraInfoText"
                        >
                          {this.props.intelligenceState?.Average_cost_basis &&
                          this.props.intelligenceState.Average_cost_basis
                            .length > 10
                            ? `See ${numToCurrency(
                                this.props.intelligenceState.Average_cost_basis
                                  .length - 10,
                                true
                              ).toLocaleString("en-US")}+ asset${
                                this.props.intelligenceState.Average_cost_basis
                                  .length -
                                  10 >
                                1
                                  ? "s"
                                  : ""
                              }`
                            : "See more"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : this.props.blockOneSelectedItem === 4 ? (
                  <div>
                    <div
                      className={`freezeTheFirstColumn newHomeTableContainer newHomeTableContainerMobile hide-scrollbar ${
                        this.props.yieldOpportunitiesTableLoading ||
                        this.props.yieldOpportunitiesListTemp?.length < 1
                          ? ""
                          : "tableWatermarkOverlay"
                      } ${
                        this.props.yieldOpportunitiesTotalCount?.length <= 10
                          ? ""
                          : ""
                      }`}
                    >
                      <TransactionTable
                        message={"No yield opportunities found"}
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
                        xAxisScrollable
                        yAxisScrollable
                        xAxisScrollableColumnWidth={3.4}
                      />
                    </div>
                    {!this.props.yieldOpportunitiesTableLoading ? (
                      <div className="inter-display-medium bottomExtraInfo">
                        <div
                          onClick={this.props.goToYieldOppPage}
                          className="bottomExtraInfoText"
                        >
                          {this.props.yieldOpportunitiesTotalCount &&
                          this.props.yieldOpportunitiesTotalCount > 10
                            ? `See ${numToCurrency(
                                this.props.yieldOpportunitiesTotalCount - 10,
                                true
                              ).toLocaleString("en-US")}+ yield ${
                                this.props.yieldOpportunitiesTotalCount - 10 > 1
                                  ? "opportunities"
                                  : "opportunity"
                              }`
                            : "See more"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : this.props.blockOneSelectedItem === 5 ? (
                  <div className="mobile-portfolio-blocks-content mobile-portfolio-blocks-content-with-padding portfolio-page-section portfolio-page-section-mobile">
                    <div
                      className="section-table section-table-mobile"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "none",
                      }}
                    >
                      <div className="profit-chart profit-chart-mobile">
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
                          openChartPage={this.props.goToCounterPartyVolumePage}
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
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mobile-portfolio-blocks">
              <div className="section-table-toggle-mobile">
                <div
                  className={`inter-display-medium section-table-toggle-element ${
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
                  className={`inter-display-medium section-table-toggle-element ${
                    this.props.blockTwoSelectedItem === 3
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockTwoItem(3);
                  }}
                >
                  NFTs
                </div>
              </div>
              <div className="mobile-portfolio-blocks-content mobile-portfolio-blocks-content-with-padding portfolio-page-section portfolio-page-section-mobile">
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
                        isPremiumUser={this.props.isPremiumUser}
                        goToPayModal={this.props.showBlurredFlows}
                        openChartPage={this.props.goToRealizedGainsPage}
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
                          isPremiumUser={this.props.isPremiumUser}
                          goToPayModal={this.props.showBlurredGasFees}
                          isBlurred={!this.props.isPremiumUser}
                          digit={this.props.GraphDigit}
                          isFromHome
                          // openChartPage={() => {}}
                          openChartPage={this.props.goToGasFeesSpentPage}
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
                      <div>
                        <div
                          className={`newHomeTableContainer newHomeTableContainerMobile hide-scrollbar ${
                            this.props.NFTData?.length < 1
                              ? ""
                              : "tableWatermarkOverlay"
                          } ${
                            this.props.NFTData?.length?.length <= 10 ? "" : ""
                          }`}
                        >
                          <TransactionTable
                            message={"No NFT's found"}
                            noSubtitleBottomPadding
                            disableOnLoading
                            isMiniversion
                            tableData={this.props.NFTData}
                            showDataAtBottom
                            columnList={this.props.NFTColumnData}
                            headerHeight={60}
                            isArrow={true}
                            isLoading={this.props.nftTableLoading}
                            fakeWatermark
                            xAxisScrollable
                            yAxisScrollable
                            xAxisScrollableColumnWidth={3}
                          />
                        </div>
                        {!this.props.nftTableLoading ? (
                          <div className="inter-display-medium bottomExtraInfo">
                            <div
                              onClick={this.props.goToNftPage}
                              className="bottomExtraInfoText"
                            >
                              {this.props.NFTData &&
                              this.props.NFTData?.length > 10
                                ? `See ${numToCurrency(
                                    this.props.NFTData?.length - 10,
                                    true
                                  ).toLocaleString("en-US")}+ NFT ${
                                    this.props.NFTData?.length - 10 > 1
                                      ? "s"
                                      : ""
                                  }`
                                : this.props.NFTData?.length === 0
                                ? ""
                                : "See more"}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions, gas fees and insights */}
            <div className="mobile-portfolio-blocks">
              <div className="section-table-toggle-mobile">
                <div
                  className={`inter-display-medium section-table-toggle-element ${
                    this.props.blockFourSelectedItem === 1
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockFourItem(1);
                  }}
                >
                  Price gauge
                </div>
                <div
                  className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                    this.props.blockFourSelectedItem === 4
                      ? "section-table-toggle-element-selected"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.changeBlockFourItem(4);
                  }}
                >
                  Transactions
                </div>
                <div
                  className={`inter-display-medium section-table-toggle-element ${
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
                  <div
                    style={{
                      padding: "0rem 1.4rem",
                    }}
                    className="mobile-portfolio-blocks-content-price-gauge mobile-portfolio-blocks-content-with-padding"
                  >
                    <InflowOutflowPortfolioHome
                      openChartPage={this.props.goToPriceGaugePage}
                      hideExplainer
                      showEth
                      userWalletList={this.props.userWalletList}
                      lochToken={this.props.lochToken}
                      callChildPriceGaugeApi={this.props.callChildPriceGaugeApi}
                      isMobileGraph
                    />
                  </div>
                ) : this.props.blockFourSelectedItem === 4 ? (
                  <div>
                    <div
                      className={`freezeTheFirstColumn newHomeTableContainer newHomeTableContainer-transaction-history newHomeTableContainerMobile hide-scrollbar ${
                        this.props.tableLoading ||
                        this.props.tableData?.length < 1
                          ? ""
                          : "tableWatermarkOverlay"
                      } ${this.props.totalCount <= 10 ? "" : ""}`}
                    >
                      <TransactionTable
                        xAxisScrollable
                        yAxisScrollable
                        xAxisScrollableColumnWidth={3.15}
                        noSubtitleBottomPadding
                        disableOnLoading
                        isMiniversion
                        tableData={this.props.tableData}
                        columnList={this.props.columnList}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.props.tableLoading}
                        fakeWatermark
                      />
                    </div>
                    {!this.props.tableLoading ? (
                      <div className="inter-display-medium bottomExtraInfo">
                        <div
                          onClick={this.props.goToTransactionHistoryPage}
                          className="bottomExtraInfoText"
                        >
                          {this.props.totalCount && this.props.totalCount > 10
                            ? `See ${numToCurrency(
                                this.props.totalCount - 10,
                                true
                              ).toLocaleString("en-US")}+ transaction${
                                this.props.totalCount - 10 > 1 ? "s" : ""
                              }`
                            : "See more"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : this.props.blockFourSelectedItem === 3 ? (
                  <div className="mobile-portfolio-blocks-content-with-padding">
                    <PortfolioHomeInsightsBlock
                      history={this.props.history}
                      updatedInsightList={this.props.updatedInsightList}
                      insightsBlockLoading={this.props.insightsBlockLoading}
                      isMobile
                      showBlurredInsights={this.props.showBlurredInsights}
                      isPremiumUser={this.props.isPremiumUser}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {/* <div className="mobileFooterContainer">
              <div>
                <Footer isMobile />
              </div>
            </div> */}
          </>
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
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
  getAllCoins,
  SwitchDarkMode,
  getAllParentChains,
  searchTransactionApi,
  getAssetGraphDataApi,
  getDetailsByLinkApi,
  getProfitAndLossApi,
  // getExchangeBalance,
  getExchangeBalances,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  updateWalletListFlag,
  setHeaderReducer,
  addUserCredits,
  updateUserWalletApi,
  getNFT,
};
PortfolioMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMobile);
