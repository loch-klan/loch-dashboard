import React, { Component } from "react";
import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import arrowUp from "../../assets/images/arrow-up.svg";
import {
  EyeIcon,
  LoaderIcon,
  SearchHistoryClockIcon,
  SearchHistoryDeleteIcon,
  TopBarSearchIcon,
  WalletIcon,
  XCircleIcon,
  XCircleRedIcon,
} from "../../assets/images/icons";
import LinkIconBtn from "../../assets/images/link.svg";
import {
  AddConnectExchangeModalOpen,
  AddWalletAddressModalOpen,
  ConnectWalletButtonClicked,
  ConnectedWalletTopBar,
  DisconnectWalletButtonClicked,
  HomeFollow,
  HomeUnFollow,
  QuickAddWalletAddress,
  SearchBarAddressAdded,
  TopBarMetamaskWalletConnected,
} from "../../utils/AnalyticsFunctions";
import { ARCX_API_KEY, BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser, getToken } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  dontOpenLoginPopup,
  isPremiumUser,
  loadingAnimation,
  numToCurrency,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
} from "../../utils/ReusableFunctions";
import { CustomCoin } from "../../utils/commonComponent";
import { isFollowedByUser, isNewAddress } from "../Portfolio/Api";
import FollowExitOverlay from "../Portfolio/FollowModals/FollowExitOverlay";
import {
  detectNameTag,
  setPageFlagDefault,
  updateUserWalletApi,
} from "../common/Api";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api";
import { addUserCredits } from "../profile/Api";
import {
  addAddressToWatchList,
  removeAddressFromWatchList,
} from "../watchlist/redux/WatchListApi";
import {
  setHeaderReducer,
  setIsWalletConnectedReducer,
  setMetamaskConnectedReducer,
} from "./HeaderAction";
import { PaywallModal } from "../common";
class TopWalletExchangeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      welcomeAddBtnLoading: false,
      isLochPaymentModal: false,
      canCallConnectWalletFun: false,
      showAmountsAtTop: false,
      topBarHistoryItems: [],
      showTopBarHistoryItems: false,
      walletInput: [
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
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
      followedAddress: "",
      isAddressFollowedCount: 0,
      totalWallets: "",
      firstWallet: "",
      firstFullWallet: "",
      fullWalletList: "",
      walletList: [],
      exchangeList: [],
      exchangeListImages: [],
      firstExchange: "",
      metamaskWalletConnected: "",
      currentMetamaskWallet: {},
      changeList: props.changeWalletList,
      isMobileWalletListExpanded: false,
      isFollowingAddress: false,
      showFollowingAddress: true,
      disableAddBtn: false,
    };
  }
  showFollowOrNot = () => {
    const listJson = JSON.parse(window.localStorage.getItem("addWallet"));
    if (listJson && listJson.length > 0) {
      if (listJson.length === 1) {
        this.isFollowedByUserFun();
        this.setState({
          showFollowingAddress: true,
        });
      } else {
        this.setState({
          showFollowingAddress: false,
        });
      }
    } else {
      this.addressDeleted();
    }
  };
  isFollowedByUserFun = () => {
    const listJson = JSON.parse(window.localStorage.getItem("addWallet"));
    if (listJson) {
      const tempListOfAdd = listJson.map((resData) => {
        return {
          address: resData.displayAddress
            ? resData.displayAddress
            : resData.address,
          nameTag: resData.nameTag,
        };
      });

      if (tempListOfAdd && tempListOfAdd.length === 1) {
        const tempWalletAddress = tempListOfAdd[0].address
          ? tempListOfAdd[0].address
          : "";
        const data = new URLSearchParams();
        data.append("wallet_address", tempWalletAddress);
        this.props.isFollowedByUser(data, this);
      }
    }
  };
  showAddressesAdded = (passedAddress, passedNameTag, openModal) => {
    if (this.props.updateOnFollow) {
      this.props.updateOnFollow();
    }
    this.setState({ isFollowingAddress: true });
    window.localStorage.setItem("isFollowingAddress", true);
    if (openModal) {
      this.afterAddressFollowed(passedAddress);
    }
  };
  afterAddressFollowed = (passedAddress) => {
    if (!getCurrentUser().email) {
      this.setState(
        {
          followedAddress: passedAddress,
          isAddressFollowedCount: this.state.isAddressFollowedCount + 1,
        },
        () => {
          this.openSigninModal();
        }
      );
    }
  };
  addressDeleted = () => {
    if (this.props.updateOnFollow) {
      this.props.updateOnFollow();
    }
    this.setState({ isFollowingAddress: false });
    window.localStorage.setItem("isFollowingAddress", false);
  };
  toggleMobileWalletList = () => {
    this.setState({
      isMobileWalletListExpanded: !this.state.isMobileWalletListExpanded,
    });
  };
  addAddressToWatchListFun = () => {
    const listJson = JSON.parse(window.localStorage.getItem("addWallet"));
    if (listJson) {
      const tempListOfAdd = listJson.map((resData) => {
        return {
          address: resData.displayAddress
            ? resData.displayAddress
            : resData.address,
          nameTag: resData.nameTag,
        };
      });
      if (tempListOfAdd && tempListOfAdd.length > 0) {
        const tempWalletAddress = tempListOfAdd[0].address
          ? tempListOfAdd[0].address
          : "";
        const tempNameTag = tempListOfAdd[0].nameTag
          ? tempListOfAdd[0].nameTag
          : "";
        if (this.state.isFollowingAddress) {
          const firstData = new URLSearchParams();
          firstData.append("address", tempWalletAddress);

          this.props.removeAddressFromWatchList(
            firstData,
            this,
            tempWalletAddress,
            tempNameTag
          );
          HomeUnFollow({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            address: tempWalletAddress,
            nameTag: tempNameTag,
          });
          return null;
        }

        const data = new URLSearchParams();
        HomeFollow({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          address: tempWalletAddress,
          nameTag: tempNameTag,
        });
        data.append("wallet_address", tempWalletAddress);
        data.append("type", "self");
        data.append("name_tag", tempNameTag);
        this.props.addAddressToWatchList(
          data,
          this,
          tempWalletAddress,
          tempNameTag
        );
      }
    }
  };
  handleTopBarInputKeyDown = (curKey) => {
    if (
      curKey &&
      curKey.code &&
      curKey.code === "Enter" &&
      this.state.walletInput[0].coinFound &&
      this.state.walletInput[0].coins.length > 0 &&
      !this.state.disableAddBtn
    ) {
      if (this.props.isAddNewAddress) {
        this.handleAddWelcomeWallet();
      } else {
        this.handleAddWallet(true);
      }
    }
  };
  seeTheTopBarHistoryItems = () => {
    this.setState({
      showTopBarHistoryItems: true,
    });
  };
  hideTheTopBarHistoryItems = () => {
    this.setState({
      showTopBarHistoryItems: false,
    });
  };
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length && index > -1) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        nameTag: nameTag,
        loadingNameTag: false,
        showNameTag: true,
        id: "wallet1",
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };
  componentDidMount() {
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      const shouldOpenNoficationModal = window.localStorage.getItem(
        "openSearchbarPaymentModal"
      );
      if (shouldOpenNoficationModal) {
        setTimeout(() => {
          removeOpenModalAfterLogin();
          this.setState({
            isLochPaymentModal: true,
          });
        }, 1000);
      }
    }
    setTimeout(() => {
      this.setState({
        canCallConnectWalletFun: true,
      });
    }, 1500);
    if (window.location.pathname === "/home") {
      this.setState({
        showAmountsAtTop: true,
      });
    } else {
      this.setState({
        showAmountsAtTop: false,
      });
    }
    const tempTopBarHistoryItems = window.localStorage.getItem(
      "topBarHistoryLocalItems"
    );
    if (tempTopBarHistoryItems && tempTopBarHistoryItems !== null) {
      let tempConvertedArr = JSON.parse(tempTopBarHistoryItems);
      if (tempConvertedArr.length > 0) {
        this.setState({
          topBarHistoryItems: tempConvertedArr,
        });
      }
    }

    const whatIsIt = window.localStorage.getItem("isFollowingAddress");

    if (whatIsIt === "true") {
      this.setState({
        isFollowingAddress: true,
      });
    } else {
      this.setState({
        isFollowingAddress: false,
      });
    }
    const userWalletData =
      this.props.portfolioState &&
      this.props.portfolioState.chainWallet &&
      Object.keys(this.props.portfolioState.chainWallet).length > 0
        ? Object.values(this.props.portfolioState.chainWallet)
        : null;

    if (userWalletData && userWalletData.length > 0) {
      this.isFollowedByUserFun();
      this.showFollowOrNot();
    }
    this.applyLocalStorageWalletList();

    this.props.getAllCoins();
    this.props.getAllParentChains();
    const ssItem = window.localStorage.getItem(
      "setMetamaskConnectedSessionStorage"
    );
    if (ssItem && ssItem !== null) {
      this.setState({
        metamaskWalletConnected: ssItem,
      });
      this.props.setMetamaskConnectedReducer(ssItem);
    }

    if (this.props.walletState?.walletList) {
      this.applyWalletList();
    } else {
      this.applyTempWalletList();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.showTopBarHistoryItems !== this.state.showTopBarHistoryItems
    ) {
      const rootItem = document.getElementById("root");
      if (rootItem) {
        if (this.state.showTopBarHistoryItems) {
          rootItem.classList.add("blurOnInputFocus");
        } else {
          rootItem.classList.remove("blurOnInputFocus");
        }
      }
    }
    if (
      prevProps.connectedWalletAddress !== this.props.connectedWalletAddress &&
      this.state.canCallConnectWalletFun
    ) {
      if (this.props.connectedWalletAddress) {
        let connectedWalletEvent = "";
        if (this.props.connectedWalletevents) {
          if (this.props.connectedWalletevents.data) {
            if (this.props.connectedWalletevents.data.properties) {
              if (this.props.connectedWalletevents.data.properties.name) {
                connectedWalletEvent =
                  this.props.connectedWalletevents.data.properties.name;
              }
            }
          }
        }
        const walletCreditScore = new URLSearchParams();
        walletCreditScore.append("credits", "wallet_connected");
        this.props.addUserCredits(walletCreditScore);
        ConnectedWalletTopBar({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          wallet_address: this.props.connectedWalletAddress,
          wallet_name: connectedWalletEvent,
        });
        this.addToList([this.props.connectedWalletAddress]);
      }
    }
    if (
      prevState.isAddressFollowedCount !== this.state.isAddressFollowedCount
    ) {
      const whatIsIt = window.localStorage.getItem("isFollowingAddress");

      if (whatIsIt === "true") {
        this.setState({
          isFollowingAddress: true,
        });
      } else {
        this.setState({
          isFollowingAddress: false,
        });
      }
    }
    if (prevProps?.HeaderState !== this.props.HeaderState) {
      this.showFollowOrNot();
    }
    if (
      prevProps.MetamaskConnectedState !== this.props.MetamaskConnectedState
    ) {
      setTimeout(() => {
        const ssItem = window.localStorage.getItem(
          "setMetamaskConnectedSessionStorage"
        );
        if (ssItem !== undefined && ssItem !== null) {
          this.setState({
            metamaskWalletConnected: ssItem,
          });
        }
      }, 100);
    }
    if (
      prevProps?.walletState?.walletList !== this.props.walletState?.walletList
    ) {
      this.applyWalletList();
    }
    if (prevProps?.HeaderState !== this.props.HeaderState) {
      this.applyTempWalletList();
    }
  }
  handleOnLocalChange = (e) => {
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
    }
    this.setState({
      walletInput: walletCopy,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // timeout;
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnLocalWalletAddress(name, value);
    }, 1000);
  };
  getCoinBasedOnLocalWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;

    if (parentCoinList && value) {
      const regex = /\.eth$/;
      if (!regex.test(value)) {
        this.props.detectNameTag(
          {
            id: name,
            address: value,
          },
          this,
          false
        );
      }
      window.localStorage.removeItem("shouldRecallApis");
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
          true
        );
      }
    }
  };
  handleSetCoinByLocalWallet = (data) => {
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
  applyLocalStorageWalletList = () => {
    let tempWalletAdd = window.localStorage.getItem(
      "topBarLocalStorageWalletAddresses"
    );
    let tempFullWalletAdd = window.localStorage.getItem(
      "topBarLocalStorageFullWalletAddresses"
    );
    if (tempWalletAdd) {
      tempWalletAdd = JSON.parse(tempWalletAdd);
    }
    if (tempFullWalletAdd) {
      tempFullWalletAdd = JSON.parse(tempFullWalletAdd);
    }

    if (tempWalletAdd && tempWalletAdd.length > 0) {
      this.setState({
        firstWallet: tempWalletAdd.length > 0 ? tempWalletAdd[0] : "",
        firstFullWallet:
          tempFullWalletAdd &&
          tempFullWalletAdd.length &&
          tempFullWalletAdd[0].length > 0
            ? tempFullWalletAdd[0][0]
            : "",
        fullWalletList:
          tempFullWalletAdd && tempFullWalletAdd.length
            ? tempFullWalletAdd
            : [[]],
        totalWallets: tempWalletAdd.length,
        walletList: tempWalletAdd,
      });
    }
  };
  applyWalletList = () => {
    if (this.props.walletState?.walletList?.length > 0) {
      const walletList = this.props.walletState.walletList;
      const tempWalletList = [];
      const tempFullWalletList = [];
      const tempExchangeList = [];
      const tempExchangeListImages = [];
      const tempWalletListToPush = [];
      if (walletList) {
        walletList.map((data) => {
          if (data?.chains.length === 0) {
            if (data.protocol) {
              if (data.protocol.code) {
                tempExchangeList.push(data.protocol.code);
              }
              if (data.protocol.symbol) {
                tempExchangeListImages.push(data.protocol.symbol);
              }
            }
          } else {
            let tempFullAdd = data.address;
            let tempSortAdd = "";
            if (data?.nickname) {
              tempWalletList.push(data.nickname);
              tempSortAdd = data.nickname;
            } else if (data?.tag) {
              tempWalletList.push(data.tag);
              tempSortAdd = data.tag;
            } else if (data?.display_address) {
              tempWalletList.push(data.display_address);
              tempSortAdd = data.display_address;
            } else if (data?.address) {
              tempWalletList.push(TruncateText(data.address));
              tempSortAdd = TruncateText(data.address);
            }
            tempFullWalletList.push([tempFullAdd, tempSortAdd]);

            const sendThis = {
              nickname: data.nickname,
              displayAddress: data.display_address,
              address: data.address,
              nameTag: data.tag,
            };
            tempWalletListToPush.push(sendThis);
          }
          return null;
        });

        tempWalletList.sort((a, b) => a - b).reverse();
        tempFullWalletList.sort((a, b) => a[1] - b[1]).reverse();
        const tempWalletListLoaclPass = JSON.stringify(tempWalletList);
        const tempWalletFullListLoaclPass = JSON.stringify(tempFullWalletList);
        window.localStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        window.localStorage.setItem(
          "topBarLocalStorageFullWalletAddresses",
          tempWalletFullListLoaclPass
        );

        this.setState({
          firstWallet: tempWalletList.length > 0 ? tempWalletList[0] : "",
          firstFullWallet:
            tempFullWalletList.length > 0 && tempFullWalletList[0].length > 0
              ? tempFullWalletList[0][0]
              : "",
          fullWalletList:
            tempFullWalletList.length > 0 ? tempFullWalletList : [[]],
          totalWallets: tempWalletList.length,
          walletList: tempWalletList,
          exchangeList: tempExchangeList,
          firstExchange: tempExchangeList.length > 0 ? tempExchangeList[0] : "",
          exchangeListImages: tempExchangeListImages,
        });
        const passDataHeader = [...tempWalletListToPush];
        this.props.setHeaderReducer(passDataHeader);
      }
    } else {
      this.setState({
        firstWallet: "",
        firstFullWallet: "",
        fullWalletList: "",
        walletList: [],
        exchangeList: [],
        exchangeListImages: [],
        firstExchange: "",
        metamaskWalletConnected: "",
        currentMetamaskWallet: {},
      });
    }
  };
  applyTempWalletList = () => {
    if (this.props.HeaderState?.wallet) {
      const walletList = this.props.HeaderState?.wallet;
      const tempWalletList = [];
      const tempFullWalletList = [];
      const regex = /\.eth$/;
      if (walletList) {
        walletList.forEach((data) => {
          let tempAddress = "";

          let tempFullAdd = data.address;
          let tempSortAdd = "";
          if (data?.nickname) {
            tempAddress = data.nickname;
            tempSortAdd = data.nickname;
          } else if (data?.nameTag) {
            tempAddress = data.nameTag;
            tempSortAdd = data.nameTag;
          } else if (data?.displayAddress) {
            tempAddress = data.displayAddress;
            tempSortAdd = data.displayAddress;

            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
              tempSortAdd = TruncateText(tempAddress);
            }
          } else if (data?.address) {
            tempAddress = data.address;
            tempSortAdd = data.address;

            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
              tempSortAdd = TruncateText(tempAddress);
            }
          } else if (data?.apiAddress) {
            tempAddress = data.apiAddress;
            tempSortAdd = data.apiAddress;

            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
              tempSortAdd = TruncateText(tempAddress);
            }
          }

          tempWalletList.push(tempAddress);
          tempFullWalletList.push([tempFullAdd, tempSortAdd]);
        });

        tempWalletList.sort((a, b) => a - b).reverse();
        tempFullWalletList.sort((a, b) => a[1] - b[1]).reverse();
        const tempWalletListLoaclPass = JSON.stringify(tempWalletList);
        const tempWalletFullListLoaclPass = JSON.stringify(tempFullWalletList);
        window.localStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        window.localStorage.setItem(
          "topBarLocalStorageFullWalletAddresses",
          tempWalletFullListLoaclPass
        );

        this.setState({
          firstWallet: tempWalletList.length > 0 ? tempWalletList[0] : "",
          firstFullWallet:
            tempFullWalletList.length > 0 && tempFullWalletList[0].length > 0
              ? tempFullWalletList[0][0]
              : "",
          fullWalletList:
            tempFullWalletList.length > 0 ? tempFullWalletList : [[]],

          totalWallets: tempWalletList.length,
          walletList: tempWalletList,
        });
      }
    }
  };
  passAddWalletClick = () => {
    const pathName = window.location.pathname;
    AddWalletAddressModalOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: pathName,
    });
    this.props.handleAddWalletClick();
  };
  goToPayModal = () => {
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredAddMultipleAddressSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openSearchbarPaymentModal", true);
      }, 1000);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        dontOpenLoginPopup();
      }
    }
  };
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
  };
  handleAddWelcomeWallet = () => {
    this.setState({
      welcomeAddBtnLoading: true,
    });
    window.localStorage.setItem("shouldRecallApis", true);

    let walletAddress = [];
    let addWallet = this.state.walletInput;
    let addWalletTemp = this.state.walletInput;
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
      window.localStorage.setItem("addAddressCreditOnce", true);
      if (addWallet.length > 1) {
        window.localStorage.setItem("addMultipleAddressCreditOnce", true);
      }
    }
    if (creditIsEns) {
      window.localStorage.setItem("addEnsCreditOnce", true);
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    if (this.state.lochUser && this.state.lochUser.email) {
      const yieldData = new URLSearchParams();
      yieldData.append("wallet_addresses", JSON.stringify(addressList));

      this.props.updateUserWalletApi(data, this, yieldData, false);
    } else {
      this.props.createAnonymousUserApi(
        data,
        this,
        finalArr,
        null,
        this.props.goToPageAfterLogin,
        this.props.funAfterUserCreate,
        addressList
      );
    }

    // const address = finalArr?.map((e) => e.address);

    // const unrecog_address = finalArr
    //   .filter((e) => !e.coinFound)
    //   .map((e) => e.address);

    // const blockchainDetected = [];
    // const nicknames = [];
    // finalArr
    //   .filter((e) => e.coinFound)
    //   .map((obj) => {
    //     let coinName = obj.coins
    //       .filter((e) => e.chain_detected)
    //       .map((name) => name.coinName);
    //     let address = obj.address;
    //     let nickname = obj.nickname;
    //     blockchainDetected.push({ address: address, names: coinName });
    //     nicknames.push({ address: address, nickname: nickname });
    //   });

    // LPC_Go({
    //   addresses: address,
    //   ENS: address,
    //   chains_detected_against_them: blockchainDetected,
    //   unrecognized_addresses: unrecog_address,
    //   unrecognized_ENS: unrecog_address,
    //   nicknames: nicknames,
    // });
  };
  handleAddWallet = (replaceAddresses) => {
    if (!replaceAddresses && !isPremiumUser()) {
      this.goToPayModal();
      return;
    }
    this.hideTheTopBarHistoryItems();
    if (this.props.isBlurred && this.props.hideFocusedInput) {
      this.props.hideFocusedInput();
    }
    if (this.state.walletInput[0]) {
      SearchBarAddressAdded({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: this.state.walletInput[0].address,
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
    localStorage.setItem("replacedOrAddedAddress", true);
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
      this.props.addUserCredits(addressCreditScore);

      // Multiple address
      const multipleAddressCreditScore = new URLSearchParams();
      multipleAddressCreditScore.append("credits", "multiple_address_added");
      this.props.addUserCredits(multipleAddressCreditScore);
    }
    if (creditIsEns) {
      const ensCreditScore = new URLSearchParams();
      ensCreditScore.append("credits", "ens_added");
      this.props.addUserCredits(ensCreditScore);
    }
    this.props.updateUserWalletApi(data, this, yieldData, true);

    // message for user
    this.setState({
      total_unique_address: total_address,
    });

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
      isMobile: false,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };
  goToHomeAfterReplace = () => {
    if (this.props.shouldGoToHomeAfterReplace) {
      this.props.history.push("/home");
    }
  };
  addAddingWalletFromHistory = (resAdd) => {
    let result = "";

    if (resAdd[1] && resAdd[1].endsWith(".eth")) {
      result = resAdd[1];
    } else {
      result = resAdd[0];
    }
    const tempTarget = {
      target: {
        name: this.state.walletInput[0].id,
        value: result,
      },
    };
    this.handleOnLocalChange(tempTarget);
  };
  clearWalletFromHistory = () => {
    this.setState(
      {
        topBarHistoryItems: [],
      },
      () => {
        window.localStorage.removeItem("topBarHistoryLocalItems");
      }
    );
  };
  removeWalletFromHistory = (resRemoveIndex) => {
    const tempHolder = this.state.topBarHistoryItems.filter(
      (res, index) => index !== resRemoveIndex
    );
    this.setState(
      {
        topBarHistoryItems: tempHolder,
      },
      () => {
        window.localStorage.setItem(
          "topBarHistoryLocalItems",
          JSON.stringify(tempHolder)
        );
      }
    );
  };
  addWalletToHistory = () => {
    let tempRevData = [...this.state.topBarHistoryItems];
    for (let i = 0; i < this.state.topBarHistoryItems.length; i++) {
      if (
        (this.state.topBarHistoryItems[i][0] !== "" &&
          this.state.topBarHistoryItems[i][0] ===
            this.state.walletInput[0].apiAddress) ||
        (this.state.topBarHistoryItems[i][0] !== "" &&
          this.state.topBarHistoryItems[i][0] ===
            this.state.walletInput[0].address) ||
        (this.state.topBarHistoryItems[i][1] !== "" &&
          this.state.topBarHistoryItems[i][1] ===
            this.state.walletInput[0].nameTag) ||
        (this.state.topBarHistoryItems[i][1] !== "" &&
          this.state.topBarHistoryItems[i][1] ===
            this.state.walletInput[0].address)
      ) {
        // this.cancelAddingWallet();
        tempRevData = tempRevData.filter((res, index) => index !== i);
        // return;
      }
    }
    let tempItem = ["", ""];
    if (this.state.walletInput[0].apiAddress) {
      tempItem[0] = this.state.walletInput[0].apiAddress;
      if (this.state.walletInput[0].nameTag) {
        tempItem[1] = this.state.walletInput[0].nameTag;
      } else if (this.state.walletInput[0].address) {
        tempItem[1] = this.state.walletInput[0].address;
      }
    }
    const tempHolder = [tempItem, ...tempRevData];
    this.setState(
      {
        topBarHistoryItems: tempHolder,
      },
      () => {
        window.localStorage.setItem(
          "topBarHistoryLocalItems",
          JSON.stringify(tempHolder)
        );
        this.cancelAddingWallet();
      }
    );
  };
  cancelAddingWallet = () => {
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
          showNickname: true,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
    });
  };
  passConnectExchangeClick = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    const pathName = window.location.pathname;
    AddConnectExchangeModalOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: pathName,
    });
    this.props.handleConnectModal();
  };
  dissconnectFromMetaMask = async () => {
    if (this.props.disconnectWallet) {
      this.props.disconnectWallet();
    }
    DisconnectWalletButtonClicked({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    const ssItem = window.localStorage.getItem(
      "setMetamaskConnectedSessionStorage"
    );
    this.removeFromList(ssItem);
    this.props.setMetamaskConnectedReducer("");
    window.localStorage.setItem("setMetamaskConnectedSessionStorage", "");
  };
  removeFromList = (removeThis) => {
    const curItem = removeThis;

    let walletAddress = JSON.parse(window.localStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
    walletAddress.forEach((curr) => {
      let isIncluded = false;
      if (
        removeThis.trim()?.toLowerCase() ===
          curr?.address?.trim()?.toLowerCase() ||
        removeThis.trim()?.toLowerCase() ===
          curr?.displayAddress?.trim()?.toLowerCase()
      ) {
        isIncluded = true;
      }
      if (!isIncluded && curr.address && curr.address !== curItem) {
        walletList.push(curr);
        arr.push(curr.address?.trim());
        nicknameArr[curr.address?.trim()] = curr.nickname;
        arr.push(curr.displayAddress?.trim());
        arr.push(curr.address?.trim());
        addressList.push(curr.address?.trim());
      }
    });
    let addWallet = walletList.map((w, i) => {
      return {
        ...w,
        id: `wallet${i + 1}`,
      };
    });
    if (addWallet) {
      this.props.setHeaderReducer(addWallet);
    }
    window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));

    this.props.updateUserWalletApi(data, this, yieldData);
  };
  connectWalletEthers = async () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    ConnectWalletButtonClicked({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    // const MAINNET_RPC_URL =
    //   "https://mainnet.infura.io/v3/2b8b0f4aa2a94d68946ffcf018d216c6";
    // const injected = injectedModule({
    //   displayUnavailable: [
    //     ProviderLabel.MetaMask,
    //     ProviderLabel.Coinbase,
    //     ProviderLabel.Phantom,
    //   ],
    // });
    // const onboard = Onboard({
    //   wallets: [injected],
    //   chains: [
    //     {
    //       id: "0x1",
    //       token: "ETH",
    //       label: "Ethereum Mainnet",
    //       rpcUrl: MAINNET_RPC_URL,
    //     },
    //     {
    //       id: "0x2105",
    //       token: "ETH",
    //       label: "Base",
    //       rpcUrl: "https://mainnet.base.org",
    //     },
    //   ],
    //   appMetadata: {
    //     name: "Loch",
    //     icon: LochLogoNameIcon,
    //     description: "A loch app",
    //   },
    // });
    // if (onboard && onboard.connectWallet) {
    //   const wallets = onboard.connectWallet();
    //   // console.log("wallets ", wallets);
    // }

    //NEW
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();

    // async function connectMetamask() {
    //     await provider.send("eth_requestAccounts", []);
    //     signer = await provider.getSigner();
    // }
    //NEW

    if (this.props.openConnectWallet) {
      this.props.openConnectWallet();
    }
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // try {
    //   const tempRes = await provider.send("eth_requestAccounts", []);
    //   try {
    //     const sdk = await ArcxAnalyticsSdk.init(ARCX_API_KEY, {});
    //     if (tempRes && tempRes.length > 0 && sdk) {
    //       sdk.wallet({
    //         account: tempRes[0],
    //         chainId: window.ethereum.networkVersion,
    //       });
    //     }
    //   } catch (error) {
    //     console.log("ArcxAnalyticsSdk error ", error);
    //   }
    //   if (tempRes && tempRes.length > 0) {
    //     setTimeout(() => {
    //       this.props.handleUpdate();
    //     }, 1000);
    //     const walletCreditScore = new URLSearchParams();
    //     walletCreditScore.append("credits", "wallet_connected");
    //     this.props.addUserCredits(walletCreditScore);
    //     this.addToList(tempRes);
    //   }
    //   // Leaver console log: full signer too"
    //   // console.log("signer is ", signer);
    //   // console.log("signer get address is ", await signer.getAddress());
    // } catch (error) {
    //   console.log("ethers error ", error);
    // }
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
        }, 2000);
      }
    );
  };
  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      window.localStorage.removeItem("shouldRecallApis");
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
          true
        );
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
  callUpdateApi = (passedItem) => {
    let walletAddress = JSON.parse(window.localStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
    if (walletAddress) {
      walletAddress.forEach((curr) => {
        let isIncluded = false;
        const whatIndex = arr.findIndex(
          (resRes) =>
            resRes.address?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase() ||
            resRes.address?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase()
        );
        if (whatIndex !== -1) {
          isIncluded = true;
        }
        if (!isIncluded && curr.address) {
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
        TopBarMetamaskWalletConnected({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          address: passedItem.address,
        });
        this.props.setMetamaskConnectedReducer(passedItem.address);
        window.localStorage.setItem(
          "setMetamaskConnectedSessionStorage",
          passedItem.address
        );
      }
      let isIncluded = false;
      arr.forEach((resRes) => {
        if (
          resRes.trim()?.toLowerCase() ===
            passedItem?.address?.trim()?.toLowerCase() ||
          resRes.trim()?.toLowerCase() ===
            passedItem?.displayAddress?.trim()?.toLowerCase()
        ) {
          isIncluded = true;
          return;
        }
      });
      if (!isIncluded) {
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
    if (addWallet) {
      this.props.setHeaderReducer(addWallet);
    }
    window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));
    this.props.updateUserWalletApi(data, this, yieldData);
  };
  onCloseModal = () => {
    this.setState({
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
    });
  };
  openSignUpModal = () => {
    this.setState({
      followSignInModalAnimation: false,
      followSigninModal: false,
      followSignupModal: true,
    });
  };
  openSigninModal = () => {
    this.setState({
      followSigninModal: true,
      followSignupModal: false,
    });
  };
  getTotalAssetValue = () => {
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

      let tempAns = tempWallet + tempCredit - tempDebt;
      if (tempAns) {
        tempAns = tempAns.toFixed(2);
      } else {
        tempAns = 0;
      }
      return tempAns;
    }
    return 0;
  };
  render() {
    if (this.props.isMobileRender) {
      if (this.state.walletList && this.state.walletList.length > 0) {
        return (
          <div className="accountsAmountContainer">
            <div className="accountsAmount">
              <div className="eyeAndAccount">
                {this.state.walletList && this.state.walletList[0] ? (
                  <>
                    <Image className="eyeAndAccountImage" src={EyeIcon} />
                    <div className="inter-display-semi-bold f-s-13 lh-19">
                      {this.state.walletList[0]}
                      {this.state.walletList.length > 1 ? (
                        <span>
                          <Image
                            onClick={this.toggleMobileWalletList}
                            onLoad={this.arrowIconLoaded}
                            className="eyeAndAccountArrow"
                            src={arrowUp}
                            style={
                              this.state.isMobileWalletListExpanded
                                ? {}
                                : {
                                    transform: "rotate(180deg)",
                                  }
                            }
                          />
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
              {this.state.showAmountsAtTop ? (
                <div className="inter-display-semi-bold f-s-16 lh-19">
                  <span className="dotDotText">
                    {CurrencyType(false)}
                    {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                    {window.localStorage.getItem("shouldRecallApis") === "true"
                      ? "0.00"
                      : numToCurrency(this.getTotalAssetValue())}
                  </span>
                </div>
              ) : null}
            </div>
            {this.state.walletList && this.state.isMobileWalletListExpanded ? (
              <div>
                {this.state.walletList.map((resRes, resIndex) => {
                  if (resIndex === 0) {
                    return null;
                  }
                  return (
                    <div className="accountsAmount accountsAmountRemaining">
                      <div className="eyeAndAccount">
                        <Image
                          style={{
                            opacity: 0,
                          }}
                          className="eyeAndAccountImage"
                          src={EyeIcon}
                        />
                        <div className="inter-display-semi-bold f-s-13 lh-19">
                          {resRes}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      }
      return null;
    }
    return (
      <OutsideClickHandler
        style={{
          width: "100%",
        }}
        display="contents"
        className="topBarContainerInputBlockContainer"
        onOutsideClick={this.hideTheTopBarHistoryItems}
      >
        <div
          onClick={(e) => {
            if (this.props.isBlurred) {
              e.stopPropagation();
            }
          }}
          className={`topBarContainer ${
            this.state.walletList.length > 0 ? "topBarContainerMultiple" : ""
          } ${this.props.showTopSearchBar ? "topBarContainerVisible" : ""}`}
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/"}
              title="Aggregate Wallets with Loch"
              description="Aggregate unlimited wallets"
              hideBackBtn
            />
          ) : null}
          {this.state.topBarHistoryItems &&
          this.state.topBarHistoryItems.length > 0 &&
          this.state.showTopBarHistoryItems ? (
            <div
              onClick={this.seeTheTopBarHistoryItems}
              className="topBarHistory"
            >
              <div className="topBarHistoryTitleContainer">
                <div className="topBarHistoryTitleLeftContainer">
                  <Image
                    className="topBarHistoryTitleIcon"
                    src={SearchHistoryClockIcon}
                  />
                  <div className="inter-display-medium topBarHistoryTitle">
                    Search History
                  </div>
                </div>
                <div
                  onClick={this.clearWalletFromHistory}
                  className="topBarHistoryClearAll"
                >
                  Clear all
                </div>
              </div>
              <div>
                <div className="topBarHistoryItemContainer">
                  {this.state.topBarHistoryItems.map((res, index) => {
                    let tempHistoryElementText = "";
                    if (res[1]) {
                      if (res[1].length > 7) {
                        tempHistoryElementText =
                          res[1].slice(0, 4) +
                          "..." +
                          res[1].slice(res[1].length - 3, res[1].length);
                      } else {
                        tempHistoryElementText = res[1];
                      }
                    } else if (res[0]) {
                      if (res[0].length > 7) {
                        tempHistoryElementText =
                          res[0].slice(0, 4) +
                          "..." +
                          res[0].slice(res[0].length - 3, res[0].length);
                      } else {
                        tempHistoryElementText = res[0];
                      }
                    }
                    return (
                      <div
                        className={`inter-display-medium topBarHistoryItemBlock`}
                        onClick={() => {
                          this.addAddingWalletFromHistory(res);
                        }}
                      >
                        <div className="topBarHistoryItemBlockText">
                          {tempHistoryElementText}
                        </div>
                        <Image
                          onClick={(e) => {
                            e.stopPropagation();
                            this.removeWalletFromHistory(index);
                          }}
                          className="topBarHistoryItemBlockIcon"
                          src={SearchHistoryDeleteIcon}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {this.state.followSignupModal ? (
            <FollowExitOverlay
              followedAddress={this.state.followedAddress}
              hideOnblur
              showHiddenError
              modalAnimation={false}
              show={this.state.followSignupModal}
              onHide={this.onCloseModal}
              history={this.props.history}
              modalType={"exitOverlay"}
              handleRedirection={() => {
                // resetUser();
                // setTimeout(function () {
                //   if (this.props.history) {
                //     this.props.history.push("/welcome");
                //   }
                // }, 3000);
              }}
              signup={true}
              goToSignIn={this.openSigninModal}
            />
          ) : null}

          <div
            style={
              {
                // maxWidth: this.state.walletInput[0].address ? "" : "40%",
              }
            }
            className="topBarContainerInputBlockContainer"
          >
            <div className="topBarContainerInputBlockContainerLeftOfInput">
              {this.state.walletInput[0].address ? (
                this.state.walletInput[0].coinFound &&
                this.state.walletInput[0].coins.length > 0 ? (
                  <div
                    style={{
                      marginRight: "1rem",
                    }}
                  >
                    <CustomCoin
                      // noNameJustIcon
                      isStatic
                      coins={this.state.walletInput[0].coins.filter(
                        (c) => c.chain_detected
                      )}
                      key="RandomKey"
                      isLoaded={true}
                      overlayOnBottom
                    />
                  </div>
                ) : this.state.walletInput[0].coins.length ===
                  this.props.OnboardingState.coinsList.length ? (
                  <Image
                    src={TopBarSearchIcon}
                    className="topBarContainerInputBlockIcon"
                  />
                ) : (
                  <div>
                    <CustomCoin
                      // noNameJustIcon
                      isStatic
                      coins={null}
                      key="RandomThirdKey"
                      isLoaded={false}
                    />
                  </div>
                )
              ) : (
                <Image
                  src={TopBarSearchIcon}
                  className="topBarContainerInputBlockIcon"
                />
              )}
            </div>
            <input
              autoComplete="off"
              name={`wallet${1}`}
              placeholder="Paste any wallet address or ENS here"
              className="topBarContainerInputBlockInput"
              id="topBarContainerInputBlockInputId"
              value={this.state.walletInput[0].address || ""}
              title={this.state.walletInput[0].address || ""}
              onChange={(e) => this.handleOnLocalChange(e)}
              onFocus={this.seeTheTopBarHistoryItems}
              onKeyDown={this.handleTopBarInputKeyDown}
            />
          </div>

          {this.state.walletInput[0].address ? (
            <div
              className={`topBarContainerRightBlock ${
                this.state.walletList.length > 0
                  ? "topBarContainerRightBlockMultiple"
                  : ""
              }`}
            >
              {this.props.isAddNewAddress ? (
                <div
                  ref={this.props.buttonRef}
                  className={`topbar-btn  ml-2 topbar-btn-dark ${
                    !(
                      this.state.walletInput[0].coinFound &&
                      this.state.walletInput[0].coins.length > 0
                    ) || this.state.disableAddBtn
                      ? "topbar-btn-dark-disabled"
                      : ""
                  }`}
                  id="address-button-two"
                  onClick={
                    !(
                      this.state.walletInput[0].coinFound &&
                      this.state.walletInput[0].coins.length > 0
                    ) || this.state.disableAddBtn
                      ? null
                      : this.props.isAddNewAddressLoggedIn
                      ? this.handleAddWelcomeWallet
                      : () => {
                          this.handleAddWallet(true);
                        }
                  }
                  style={{
                    pointerEvents: this.state.welcomeAddBtnLoading
                      ? "none"
                      : "",
                  }}
                >
                  {this.state.welcomeAddBtnLoading ? (
                    loadingAnimation()
                  ) : (
                    <span className="dotDotText">Add</span>
                  )}
                </div>
              ) : (
                <>
                  <div
                    ref={this.props.buttonRef}
                    className={`topbar-btn  ml-2 ${
                      !(
                        this.state.walletInput[0].coinFound &&
                        this.state.walletInput[0].coins.length > 0
                      ) || this.state.disableAddBtn
                        ? "topbar-btn-light-disabled"
                        : ""
                    }`}
                    id="address-button-two"
                    onClick={
                      !(
                        this.state.walletInput[0].coinFound &&
                        this.state.walletInput[0].coins.length > 0
                      ) || this.state.disableAddBtn
                        ? null
                        : () => {
                            this.handleAddWallet(false);
                          }
                    }
                  >
                    <span className="dotDotText">Add</span>
                  </div>
                  <div
                    ref={this.props.buttonRef}
                    className={`topbar-btn  ml-2 topbar-btn-dark ${
                      !(
                        this.state.walletInput[0].coinFound &&
                        this.state.walletInput[0].coins.length > 0
                      ) || this.state.disableAddBtn
                        ? "topbar-btn-dark-disabled"
                        : ""
                    }`}
                    id="address-button-two"
                    onClick={
                      !(
                        this.state.walletInput[0].coinFound &&
                        this.state.walletInput[0].coins.length > 0
                      ) || this.state.disableAddBtn
                        ? null
                        : () => {
                            this.handleAddWallet(true);
                          }
                    }
                  >
                    <span className="dotDotText">Replace</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              className={`topBarContainerRightBlock ${
                this.state.walletList.length > 0
                  ? "topBarContainerRightBlockMultiple"
                  : ""
              }`}
              style={{
                opacity: this.props.isBlurred ? 0 : 1,
                pointerEvents: this.props.isBlurred ? "none" : "all",
              }}
            >
              {/* <div
                ref={this.props.buttonRef}
                className="topbar-btn maxWidth50 ml-2"
                id="address-button-two"
                onClick={this.passAddWalletClick}
              >
                <Image className="topBarWalletAdd" src={PlusCircleIcon} />
                <span className="dotDotText">Add address</span>
              </div> */}
              <div
                onClick={this.passConnectExchangeClick}
                className={`topbar-btn ml-2 ${
                  this.state.walletList.length > 0 ? "maxWidth50" : ""
                }`}
                id="topbar-connect-exchange-btn"
              >
                {this.state.exchangeList.length > 0 ? (
                  <>
                    <span className="mr-2">
                      {this.state.exchangeListImages
                        .slice(0, 3)
                        .map((imgUrl) => (
                          <Image className="topBarExchangeIcons" src={imgUrl} />
                        ))}
                    </span>
                    <span className="dotDotText">
                      <span className="captilasideText">
                        {this.state.firstExchange?.toLowerCase()}{" "}
                      </span>
                      {this.state.exchangeList.length > 1 ? "and others " : ""}
                      {"connected"}
                    </span>
                  </>
                ) : (
                  <>
                    <Image className="topBarWalletAdd " src={LinkIconBtn} />
                    <span className="dotDotText">Connect exchange</span>
                  </>
                )}
              </div>
              {this.state.metamaskWalletConnected ? (
                <div
                  style={{
                    paddingRight: "1.2rem",
                  }}
                  className="topbar-btn topbar-btn-transparent ml-2 maxWidth50"
                >
                  <Image className="topBarWalletAdd" src={WalletIcon} />
                  <span className="dotDotText">
                    {TruncateText(this.state.metamaskWalletConnected)}
                  </span>
                  <span
                    onMouseOver={(e) =>
                      (e.currentTarget.children[0].src = XCircleRedIcon)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.children[0].src = XCircleIcon)
                    }
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={this.dissconnectFromMetaMask}
                    className="topBarXCircleIcon"
                  >
                    <Image
                      className="topBarWalletAdd"
                      style={{
                        margin: "0",
                        marginLeft: "0.8rem",
                      }}
                      src={XCircleIcon}
                    />
                  </span>
                </div>
              ) : (
                <div
                  onClick={this.connectWalletEthers}
                  className="topbar-btn ml-2 maxWidth50"
                  id="topbar-connect-wallet-btn"
                >
                  <Image className="topBarWalletAdd " src={WalletIcon} />
                  <span className="dotDotText">Connect wallet</span>
                </div>
              )}
            </div>
          )}
        </div>
      </OutsideClickHandler>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  walletState: state.WalletState,
  HeaderState: state.HeaderState,
  OnboardingState: state.OnboardingState,
  IsWalletConnectedState: state.IsWalletConnectedState,
  MetamaskConnectedState: state.MetamaskConnectedState,
  defiState: state.DefiState,
});

const mapDispatchToProps = {
  setHeaderReducer,
  updateUserWalletApi,
  setIsWalletConnectedReducer,
  setMetamaskConnectedReducer,
  detectCoin,
  getAllParentChains,
  getAllCoins,
  isFollowedByUser,
  removeAddressFromWatchList,
  addAddressToWatchList,
  addUserCredits,
  detectNameTag,
  isNewAddress,
  createAnonymousUserApi,
  setPageFlagDefault,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopWalletExchangeBar);
