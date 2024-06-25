// import { ethers } from "ethers";
import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  CopyTradeSwapIcon,
  CopyTradeTopBarIcon,
  EmultionSidebarIcon,
  FollowTopBarIcon,
  GlobeShareBlockIcon,
  ShareCopyBlockIcon,
  ShareTopBarIcon,
  UserCreditTelegramIcon,
  XFormallyTwitterLogoIcon,
} from "../../assets/images/icons";
import {
  AddConnectExchangeModalOpen,
  ConnectWalletButtonClicked,
  DisconnectWalletButtonClicked,
  HomeFollow,
  HomeRefreshButton,
  HomeUnFollow,
  TopBarMetamaskWalletConnected,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser, getToken } from "../../utils/ManageToken";
import {
  TruncateText,
  getCopyTradeWalletShareLink,
  getShareLink,
} from "../../utils/ReusableFunctions";
import {
  getExchangeBalances,
  getUserWallet,
  isFollowedByUser,
} from "../Portfolio/Api";
import { setPageFlagDefault, updateUserWalletApi } from "../common/Api";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";
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
import TopBarDropDown from "./TopBarDropDown";
import "./_topWalletAddressList.scss";

import refreshIcon from "../../assets/images/icons/refresh-ccw.svg";
import FollowExitOverlay from "../Portfolio/FollowModals/FollowExitOverlay";
import Breadcrums from "../common/Breadcrums";
import { toast } from "react-toastify";
import OutsideClickHandler from "react-outside-click-handler";

class TopWalletAddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareUrl: getShareLink(),
      copyTradeShareUrl: getCopyTradeWalletShareLink(),
      shareModal: false,
      timeNumber: null,
      timeUnit: "",
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
      followedAddress: "",
      isAddressFollowedCount: 0,
      totalWallets: "",
      firstWallet: "",
      firstFullWallet: "",
      fullWalletList: "",
      hideDeleteButton: false,
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
  handleSharePassFun = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    if (this.props.handleShare) {
      this.props.handleShare();
    }
  };
  addAddressToWatchListFun = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
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
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        shareUrl: getShareLink(),
        copyTradeShareUrl: getCopyTradeWalletShareLink(
          this.state.fullWalletList
        ),
      });
    }, 1000);
    this.getCurrentTime();
    this.checkIsFollowed();
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
  checkIsFollowed = () => {
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
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.shareModal !== this.state.shareModal) {
      this.setState({
        shareUrl: getShareLink(),
        copyTradeShareUrl: getCopyTradeWalletShareLink(
          this.state.fullWalletList
        ),
      });
    }
    if (prevProps.getCurrentTimeUpdater !== this.props.getCurrentTimeUpdater) {
      this.getCurrentTime();
    }
    if (
      prevProps.passedFollowSigninModal !== this.props.passedFollowSigninModal
    ) {
      if (this.props.passedFollowSigninModal) {
        this.setState({
          followSigninModal: true,
          isFollowingAddress: true,
        });
      }
    }
    if (
      prevState.isAddressFollowedCount !== this.state.isAddressFollowedCount
    ) {
      this.checkIsFollowed();
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
        let tempHideDel = true;
        walletList.map((data) => {
          if (!data.apiAddress) {
            tempHideDel = false;
          }
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
            let tempNameTag = "";
            if (data?.nickname) {
              tempNameTag = data.nickname;
            } else if (data?.tag) {
              tempNameTag = data.tag;
            } else if (data?.display_address) {
              tempSortAdd = data.display_address;
            } else if (data?.address) {
              tempSortAdd = TruncateText(data.address);
            }
            tempFullWalletList.push([tempFullAdd, tempSortAdd, tempNameTag]);

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
        tempFullWalletList
          .sort((a, b) => {
            // {props.fullWalletList[0][2]
            //   ? props.fullWalletList[0][2]
            //   : /\.eth$/.test(props.fullWalletList[0][1])
            //   ? props.fullWalletList[0][1]
            //   : null}
            let toRenderA = a[2] ? a[2] : /\.eth$/.test(a[1]) ? a[1] : "";
            let toRenderB = b[2] ? b[2] : /\.eth$/.test(b[1]) ? b[1] : "";

            let len1 = toRenderA ? toRenderA.length : 0;
            let len2 = toRenderB ? toRenderB.length : 0;
            if (len2 >= len1) {
              return -1;
            } else {
              return 1;
            }
          })
          .reverse();
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
          hideDeleteButton: tempHideDel,
        });
        const passDataHeader = [...tempWalletListToPush];
        this.props.setHeaderReducer(passDataHeader);
      }
    }
  };
  applyTempWalletList = () => {
    if (this.props.HeaderState?.wallet) {
      const walletList = this.props.HeaderState?.wallet;
      const tempWalletList = [];
      const tempFullWalletList = [];
      const regex = /\.eth$/;
      if (walletList) {
        let tempHideDel = true;
        walletList.forEach((data) => {
          if (!data.apiAddress) {
            tempHideDel = false;
          }
          let tempAddress = "";

          let tempFullAdd = data.address;
          let tempSortAdd = "";
          let tempNameTag = "";
          if (data?.nickname) {
            tempNameTag = data.nickname;
          } else if (data?.nameTag) {
            tempNameTag = data.nameTag;
          }
          if (data?.displayAddress) {
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
          tempFullWalletList.push([tempFullAdd, tempSortAdd, tempNameTag]);
        });

        tempWalletList.sort((a, b) => a - b).reverse();
        tempFullWalletList
          .sort((a, b) => {
            // if (a[2] || b[2]) {
            //   return a[2] - b[2];
            // }
            // return a[1] - b[1];
            let toRenderA = a[2] ? a[2] : /\.eth$/.test(a[1]) ? a[1] : "";
            let toRenderB = b[2] ? b[2] : /\.eth$/.test(b[1]) ? b[1] : "";

            let len1 = toRenderA ? toRenderA.length : 0;
            let len2 = toRenderB ? toRenderB.length : 0;
            if (len2 >= len1) {
              return -1;
            } else {
              return 1;
            }
          })
          .reverse();
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
          hideDeleteButton: tempHideDel,
        });
      }
    }
  };

  passConnectExchangeClick = () => {
    const pathName = window.location.pathname;
    AddConnectExchangeModalOpen({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: pathName,
    });
    this.props.handleConnectModal();
  };
  dissconnectFromMetaMask = async () => {
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
    ConnectWalletButtonClicked({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });

    if (window.ethereum) {
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
      // } catch (error) {
      //   console.log("ethers error ", error);
      // }
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
  deleteTheAddress = (passedAdd) => {
    let addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
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
      addWalletList = addWalletList.filter((resOne, resOneIndex) => {
        if (resOne.apiAddress) {
          return resOne.apiAddress.toLowerCase() !== passedAdd[0].toLowerCase();
        }
        return false;
      });
    }

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
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));

    this.props.updateUserWalletApi(data, this, yieldData, true);
  };
  getCurrentTime = () => {
    let currentTime = new Date().getTime();

    let prevTime = JSON.parse(window.localStorage.getItem("refreshApiTime"));
    // calculate the time difference since the last click
    let timeDiff = prevTime ? currentTime - prevTime : currentTime;
    // console.log(
    //   "time deff",
    //   timeDiff,
    //   "prev time",
    //   prevTime,
    //   "current time",
    //   currentTime
    // );
    // format the time difference as a string
    let timeDiffString;

    // calculate the time difference in seconds, minutes, and hours
    let diffInSeconds = timeDiff / 1000;
    let diffInMinutes = diffInSeconds / 60;
    let diffInHours = diffInMinutes / 60;

    let unit = "";

    // format the time difference as a string
    if (diffInSeconds < 60) {
      // timeDiffString = Math.floor(diffInSeconds);
      timeDiffString = 0;

      unit = " just now";
    } else if (diffInMinutes < 60) {
      timeDiffString = Math.floor(diffInMinutes);
      unit = diffInMinutes < 2 ? "m ago" : "m ago";
    } else {
      timeDiffString = Math.floor(diffInHours);
      unit = diffInHours < 2 ? "h ago" : "h ago";
    }

    // console.log("timediff str", timeDiffString);
    this.setState(
      {
        timeNumber: prevTime ? timeDiffString : "3",
        timeUnit: unit,
      },
      () => {
        setTimeout(() => {
          this.getCurrentTime();
        }, 300000);
      }
    );
  };

  RefreshButton = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    window.localStorage.setItem("callTheUpdateAPI", true);
    HomeRefreshButton({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }

    this.props.portfolioState.walletTotal = 0;
    this.props.portfolioState.chainPortfolio = {};
    this.props.portfolioState.assetPrice = {};
    this.props.portfolioState.chainWallet = [];
    this.props.portfolioState.yesterdayBalance = 0;

    this.props.setPageFlagDefault();
  };
  copyPublicUrl = () => {
    navigator.clipboard.writeText(this.state.shareUrl);
    toast.success("Link copied");
  };
  copyCopyTradeUrl = () => {
    navigator.clipboard.writeText(this.state.copyTradeShareUrl);
    toast.success("Link copied");
  };
  toggleShareModal = () => {
    this.setState({
      shareModal: !this.state.shareModal,
    });
  };
  hideShareModal = () => {
    if (this.state.shareModal) {
      this.setState({
        shareModal: false,
      });
    }
  };
  shareOnTwitter = () => {
    var embeddedShareText = encodeURIComponent(
      "You can now copy trade this wallet permissionlessly onchain using loch.one. Click this link to get started!\n\n\n\n" +
        this.state.copyTradeShareUrl
    );
    const twitterLink =
      "https://twitter.com/intent/tweet?text=" + embeddedShareText;
    window.open(twitterLink, "_blank");
  };
  shareOnTelegram = () => {
    var embeddedShareText = encodeURIComponent(
      "You can now copy trade this wallet permissionlessly onchain using loch.one. Click this link to get started!\n\n\n\n" +
        this.state.copyTradeShareUrl
    );
    const telegramLink =
      "https://telegram.me/share/url?url=" + embeddedShareText;
    window.open(telegramLink, "_blank");
  };
  goToCopyTrade = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
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
        if (tempWalletAddress) {
          window.localStorage.setItem(
            "openCopyTradeModalFromLink",
            tempWalletAddress
          );
          setTimeout(() => {
            this.props.history.push("copy-trade");
          }, 100);
        }
      }
    }
  };
  render() {
    if (this.props.isMobile) {
      return (
        <div
          style={{
            marginTop: !this.props.hideAddresses ? "-1rem" : "",
          }}
          className="topWalletAddressListMobile inter-display-medium"
        >
          {this.props.showUpdatesJustNowBtn ? (
            <h2
              className="inter-display-regular f-s-13 lh-15 grey-B0B cp refresh-btn"
              onClick={this.RefreshButton}
              style={{
                whiteSpace: "nowrap",
              }}
            >
              <Image src={refreshIcon} />
              Updated{" "}
              <span
                style={{ marginLeft: "3px" }}
                className="inter-display-bold f-s-13 lh-15 grey-B0B"
              >
                {this.state.timeNumber === null
                  ? "3"
                  : this.state.timeNumber === 0
                  ? " just now"
                  : this.state.timeNumber}
              </span>
              <span>
                {this.state.timeUnit !== "" && this.state.timeNumber !== 0
                  ? this.state.timeUnit
                  : this.state.timeNumber === 0
                  ? ""
                  : "h ago"}
              </span>
            </h2>
          ) : null}
          {/* Share and Follow */}
          <div className="twalFollowAndShareMobile">
            {this.state.showFollowingAddress && !this.props.hideShare ? (
              <div
                ref={this.props.buttonRef}
                className="topWalletAddressListFollowShareBtn"
                id="address-button"
                onClick={this.addAddressToWatchListFun}
                style={{
                  width: "calc(50% - 0.5rem)",
                }}
              >
                <Image
                  className="topWalletAddressListFollowShareBtnIcon"
                  src={FollowTopBarIcon}
                />
                <span className="dotDotText">
                  {this.state.isFollowingAddress ? "Following" : "Follow"}
                </span>
              </div>
            ) : null}
            {!this.props.hideShare ? (
              <div
                style={{
                  width:
                    this.state.showFollowingAddress && !this.props.hideShare
                      ? "calc(50% - 0.5rem)"
                      : "100%",
                }}
                className="topWalletAddressListFollowShareBtnContainer"
              >
                <OutsideClickHandler onOutsideClick={this.hideShareModal}>
                  {this.state.shareModal ? (
                    <div className="topWalletAddressListFollowShareBtnPopUpContainer">
                      <div className="topWalletAddressListFollowShareBtnPopUp">
                        <div className="topWalletAddressListFollowShareBtnPopUpArrow" />
                        <div className="TWALSFBPopUpCopyBlock TWALSFBPopUpCopyTradeBlock">
                          <div className="TWALSFBPopUpHeading">
                            <Image
                              className="TWALSFBPopUpHeadingIcon"
                              src={CopyTradeSwapIcon}
                            />
                            <div className="inter-display-medium">
                              Link to copy trade this wallet
                            </div>
                          </div>
                          <div className="TWALSFBPopUpCopy">
                            <div className="TWALSFBPopUpCopyLink inter-display-medium">
                              {this.state.copyTradeShareUrl}
                            </div>
                            <div
                              onClick={this.copyCopyTradeUrl}
                              className="TWALSFBPopUpCopyBtn inter-display-medium"
                            >
                              Copy
                            </div>
                          </div>
                        </div>
                        <div className="TWALSFBPopUpCopyBlock">
                          <div className="TWALSFBPopUpHeading">
                            <Image
                              className="TWALSFBPopUpHeadingIcon"
                              src={GlobeShareBlockIcon}
                            />
                            <div className="inter-display-medium">
                              Public link to this wallet
                            </div>
                          </div>
                          <div className="TWALSFBPopUpCopy">
                            <div className="TWALSFBPopUpCopyLink inter-display-medium">
                              {this.state.shareUrl}
                            </div>
                            <div
                              onClick={this.copyPublicUrl}
                              className="TWALSFBPopUpCopyBtn inter-display-medium"
                            >
                              Copy
                            </div>
                          </div>
                        </div>
                        <div className="TWALSFBPopUpShareBlock">
                          <div className="TWALSFBPopUpShareDirect">
                            <Image
                              className="TWALSFBPopUpShareDirectIcon"
                              src={ShareCopyBlockIcon}
                            />
                            <div>Or share directly</div>
                          </div>
                          <div className="TWALSFBPopUpShareBlockFlex">
                            <div className="TWALSFBPopUpCopy">
                              <div
                                onClick={this.shareOnTwitter}
                                className="TWALSFBPopUpCopyBtn inter-display-medium"
                              >
                                <div>Share on</div>

                                <Image
                                  className="TWALSFBPopUpCopyBtnIcon"
                                  src={XFormallyTwitterLogoIcon}
                                />
                              </div>
                            </div>
                            <div className="TWALSFBPopUpCopy">
                              <div
                                onClick={this.shareOnTelegram}
                                className="TWALSFBPopUpCopyBtn inter-display-medium"
                              >
                                <div>Share on Telegram</div>

                                <Image
                                  className="TWALSFBPopUpCopyBtnIcon"
                                  src={UserCreditTelegramIcon}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div
                    ref={this.props.buttonRef}
                    className={`topWalletAddressListFollowShareBtn ${
                      this.state.showFollowingAddress && !this.props.hideShare
                        ? "ml-2"
                        : ""
                    }`}
                    id="address-button"
                    // onClick={this.toggleShareModal}
                    onClick={this.handleSharePassFun}
                  >
                    <Image
                      className="topWalletAddressListFollowShareBtnIcon"
                      src={ShareTopBarIcon}
                    />
                    <span className="dotDotText">Share</span>
                  </div>
                </OutsideClickHandler>
              </div>
            ) : null}
          </div>
          {this.props.showUpdatesJustNowBtn ? (
            <div
              style={{
                marginTop: "1rem",
              }}
              className="twalFollowAndShareMobile"
            >
              <div
                className="topWalletAddressListFollowShareBtn"
                id="home-copy-trade-button"
                onClick={this.goToCopyTrade}
                style={{
                  width: "100%",
                }}
              >
                <Image
                  className="topWalletAddressListFollowShareBtnIcon"
                  src={CopyTradeTopBarIcon}
                />
                <span className="dotDotText">Copy Trade</span>
              </div>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <>
        <Breadcrums
          showpath={this.props.showpath}
          currentPage={this.props.currentPage}
          noHomeInPath={this.props.noHomeInPath}
        />
        {/* {this.props.showpath ? breadCrumb : ""} */}
        <div className={`topWalletAddressList ${this.props.isWideScreen?"topWalletAddressListWide":""}`}>
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
          {this.state.walletList.length > 0 ? (
            <div className="topWalletAddressListDropdownContainer maxWidth50">
              <TopBarDropDown
                deleteTheAddress={this.deleteTheAddress}
                class="topWalletAddressListDropdown"
                list={this.state.walletList}
                showChecked={true}
                relative={true}
                buttonRef={this.props.buttonRef}
                totalWallets={this.state.totalWallets}
                firstWallet={this.state.firstWallet}
                firstFullWallet={this.state.firstFullWallet}
                fullWalletList={this.state.fullWalletList}
                hideDeleteButton={this.state.hideDeleteButton}
              />
            </div>
          ) : (
            <div />
          )}

          <div
            className={`topWalletAddressListFollowShareContainer inter-display-medium`}
          >
            {this.props.showUpdatesJustNowBtn ? (
              <h2
                className="inter-display-regular f-s-13 lh-15 grey-B0B cp refresh-btn"
                onClick={this.RefreshButton}
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                <Image src={refreshIcon} />
                Updated{" "}
                <span
                  style={{ marginLeft: "3px" }}
                  className="inter-display-bold f-s-13 lh-15 grey-B0B"
                >
                  {this.state.timeNumber === null
                    ? "3"
                    : this.state.timeNumber === 0
                    ? " just now"
                    : this.state.timeNumber}
                </span>
                <span>
                  {this.state.timeUnit !== "" && this.state.timeNumber !== 0
                    ? this.state.timeUnit
                    : this.state.timeNumber === 0
                    ? ""
                    : "h ago"}
                </span>
              </h2>
            ) : null}
            {this.state.showFollowingAddress && !this.props.hideShare ? (
              <div
                ref={this.props.buttonRef}
                className="ml-3 topWalletAddressListFollowShareBtn"
                id="address-button"
                onClick={this.addAddressToWatchListFun}
              >
                <Image
                  className="topWalletAddressListFollowShareBtnIcon"
                  src={FollowTopBarIcon}
                />
                <span className="dotDotText">
                  {this.state.isFollowingAddress ? "Following" : "Follow"}
                </span>
              </div>
            ) : null}
            {!this.props.hideShare ? (
              <div className="topWalletAddressListFollowShareBtnContainer">
                <OutsideClickHandler onOutsideClick={this.hideShareModal}>
                  {this.state.shareModal ? (
                    <div className="topWalletAddressListFollowShareBtnPopUpContainer">
                      <div className="topWalletAddressListFollowShareBtnPopUp">
                        <div className="topWalletAddressListFollowShareBtnPopUpArrow" />
                        <div className="TWALSFBPopUpCopyBlock TWALSFBPopUpCopyTradeBlock">
                          <div className="TWALSFBPopUpHeading">
                            <Image
                              className="TWALSFBPopUpHeadingIcon"
                              src={CopyTradeSwapIcon}
                            />
                            <div className="inter-display-medium">
                              Link to copy trade this wallet
                            </div>
                          </div>
                          <div className="TWALSFBPopUpCopy">
                            <div className="TWALSFBPopUpCopyLink inter-display-medium">
                              {this.state.copyTradeShareUrl}
                            </div>
                            <div
                              onClick={this.copyCopyTradeUrl}
                              className="TWALSFBPopUpCopyBtn inter-display-medium"
                            >
                              Copy
                            </div>
                          </div>
                        </div>
                        <div className="TWALSFBPopUpCopyBlock">
                          <div className="TWALSFBPopUpHeading">
                            <Image
                              className="TWALSFBPopUpHeadingIcon"
                              src={GlobeShareBlockIcon}
                            />
                            <div className="inter-display-medium">
                              Public link to this wallet
                            </div>
                          </div>
                          <div className="TWALSFBPopUpCopy">
                            <div className="TWALSFBPopUpCopyLink inter-display-medium">
                              {this.state.shareUrl}
                            </div>
                            <div
                              onClick={this.copyPublicUrl}
                              className="TWALSFBPopUpCopyBtn inter-display-medium"
                            >
                              Copy
                            </div>
                          </div>
                        </div>
                        <div className="TWALSFBPopUpShareBlock">
                          <div className="TWALSFBPopUpShareDirect">
                            <Image
                              className="TWALSFBPopUpShareDirectIcon"
                              src={ShareCopyBlockIcon}
                            />
                            <div>Or share directly</div>
                          </div>
                          <div className="TWALSFBPopUpShareBlockFlex">
                            <div className="TWALSFBPopUpCopy">
                              <div
                                onClick={this.shareOnTwitter}
                                className="TWALSFBPopUpCopyBtn inter-display-medium"
                              >
                                <div>Share on</div>

                                <Image
                                  className="TWALSFBPopUpCopyBtnIcon"
                                  src={XFormallyTwitterLogoIcon}
                                />
                              </div>
                            </div>
                            <div className="TWALSFBPopUpCopy">
                              <div
                                onClick={this.shareOnTelegram}
                                className="TWALSFBPopUpCopyBtn inter-display-medium"
                              >
                                <div>Share on Telegram</div>

                                <Image
                                  className="TWALSFBPopUpCopyBtnIcon"
                                  src={UserCreditTelegramIcon}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div
                    ref={this.props.buttonRef}
                    className="topWalletAddressListFollowShareBtn ml-2"
                    id="address-button"
                    // onClick={this.toggleShareModal}
                    onClick={this.handleSharePassFun}
                  >
                    <Image
                      className="topWalletAddressListFollowShareBtnIcon"
                      src={ShareTopBarIcon}
                    />
                    <span className="dotDotText">Share</span>
                  </div>
                </OutsideClickHandler>
              </div>
            ) : null}
            {this.props.showUpdatesJustNowBtn ? (
              <div
                className="ml-2 topWalletAddressListFollowShareBtn topWalletAddressListFollowShareBtnBig"
                id="home-copy-trade-button"
                onClick={this.goToCopyTrade}
              >
                <Image
                  className="topWalletAddressListFollowShareBtnIcon"
                  src={CopyTradeTopBarIcon}
                />
                <span className="dotDotText">Copy Trade</span>
              </div>
            ) : null}
          </div>
        </div>
      </>
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
  getUserWallet,
  getExchangeBalances,
  setPageFlagDefault,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopWalletAddressList);
