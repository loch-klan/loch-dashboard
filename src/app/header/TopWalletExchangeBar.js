import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import arrowUp from "../../assets/images/arrow-up.svg";
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import LinkIconBtn from "../../assets/images/link.svg";
import { ArcxAnalyticsSdk } from "@arcxmoney/analytics";
import TopBarDropDown from "./TopBarDropDown";
import {
  AddConnectExchangeModalOpen,
  AddWalletAddressModalOpen,
  ConnectWalletButtonClicked,
  DisconnectWalletButtonClicked,
  HomeFollow,
  HomeUnFollow,
  TopBarMetamaskWalletConnected,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  setHeaderReducer,
  setIsWalletConnectedReducer,
  setMetamaskConnectedReducer,
} from "./HeaderAction";
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import {
  EyeIcon,
  FollowTopBarIcon,
  MetamaskIcon,
  PlusCircleIcon,
  ShareTopBarIcon,
  WalletIcon,
  XCircleIcon,
  XCircleRedIcon,
} from "../../assets/images/icons";
import { ethers } from "ethers";
import { updateUserWalletApi } from "../common/Api";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";
import { ARCX_API_KEY } from "../../utils/Constant";
import { isFollowedByUser } from "../Portfolio/Api";
import {
  addAddressToWatchList,
  removeAddressFromWatchList,
} from "../watchlist/redux/WatchListApi";
class TopWalletExchangeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }
  showFollowOrNot = () => {
    const listJson = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
    const listJson = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
    this.setState({ isFollowingAddress: true });
    window.sessionStorage.setItem("isFollowingAddress", true);
    if (this.props.afterAddressFollowed && openModal) {
      this.props.afterAddressFollowed(passedAddress);
    }
  };
  addressDeleted = () => {
    this.setState({ isFollowingAddress: false });
    window.sessionStorage.setItem("isFollowingAddress", false);
  };
  toggleMobileWalletList = () => {
    this.setState({
      isMobileWalletListExpanded: !this.state.isMobileWalletListExpanded,
    });
  };
  addAddressToWatchListFun = () => {
    const listJson = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
    const whatIsIt = window.sessionStorage.getItem("isFollowingAddress");

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
    const ssItem = window.sessionStorage.getItem(
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
      prevProps.isAddressFollowedCount !== this.props.isAddressFollowedCount
    ) {
      const whatIsIt = window.sessionStorage.getItem("isFollowingAddress");

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
        const ssItem = window.sessionStorage.getItem(
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
    let tempWalletAdd = window.sessionStorage.getItem(
      "topBarLocalStorageWalletAddresses"
    );
    let tempFullWalletAdd = window.sessionStorage.getItem(
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
        window.sessionStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        window.sessionStorage.setItem(
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
        window.sessionStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        window.sessionStorage.setItem(
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
    const ssItem = window.sessionStorage.getItem(
      "setMetamaskConnectedSessionStorage"
    );
    this.removeFromList(ssItem);
    this.props.setMetamaskConnectedReducer("");
    window.sessionStorage.setItem("setMetamaskConnectedSessionStorage", "");
  };
  removeFromList = (removeThis) => {
    const curItem = removeThis;

    let walletAddress = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
    window.sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
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
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        const tempRes = await provider.send("eth_requestAccounts", []);
        try {
          const sdk = await ArcxAnalyticsSdk.init(ARCX_API_KEY, {});
          if (tempRes && tempRes.length > 0 && sdk) {
            sdk.wallet({
              account: tempRes[0],
              chainId: window.ethereum.networkVersion,
            });
          }
        } catch (error) {
          console.log("ArcxAnalyticsSdk error ", error);
        }
        if (tempRes && tempRes.length > 0) {
          this.addToList(tempRes);
        }
        // Leaver console log: full signer too"
        // console.log("signer is ", signer);
        // console.log("signer get address is ", await signer.getAddress());
      } catch (error) {
        console.log("ethers error ", error);
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
    let walletAddress = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
        window.sessionStorage.setItem(
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
    window.sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));
    this.props.updateUserWalletApi(data, this, yieldData);
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
              <div className="inter-display-semi-bold f-s-16 lh-19">
                {this.props.assetTotal ? (
                  <span>${numToCurrency(this.props.assetTotal)}</span>
                ) : null}
              </div>
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
      <div
        className={`topBarContainer ${
          this.state.walletList.length > 0 ? "topBarContainerMultiple" : ""
        }`}
      >
        {this.state.walletList.length > 0 ? (
          <>
            <div className="topWalletDropdownContainer maxWidth50">
              <TopBarDropDown
                class="topWalletDropdown"
                list={this.state.walletList}
                showChecked={true}
                relative={true}
                handleAddWalletClick={this.passAddWalletClick}
                buttonRef={this.props.buttonRef}
                totalWallets={this.state.totalWallets}
                firstWallet={this.state.firstWallet}
                firstFullWallet={this.state.firstFullWallet}
                fullWalletList={this.state.fullWalletList}
              />
            </div>
            {this.state.showFollowingAddress ? (
              <div
                ref={this.props.buttonRef}
                className="topbar-btn topbar-btn-white-with-border maxWidth50 ml-2"
                id="address-button"
                onClick={this.addAddressToWatchListFun}
              >
                <Image className="topBarWalletAdd" src={FollowTopBarIcon} />
                <span className="dotDotText">
                  {this.state.isFollowingAddress ? "Following" : "Follow"}
                </span>
              </div>
            ) : null}
            <div
              ref={this.props.buttonRef}
              className="topbar-btn topbar-btn-white-with-border maxWidth50 ml-2"
              id="address-button"
              onClick={this.props.handleShare}
            >
              <Image className="topBarWalletAdd" src={ShareTopBarIcon} />
              <span className="dotDotText">Share</span>
            </div>
          </>
        ) : (
          <div
            ref={this.props.buttonRef}
            className="topbar-btn maxWidth50"
            id="address-button-one"
            onClick={this.passAddWalletClick}
          >
            <Image className="topBarWalletAdd" src={PlusCircleIcon} />
            <span className="dotDotText">Add address</span>
          </div>
        )}
        <div
          className={`topBarContainerRightBlock ${
            this.state.walletList.length > 0
              ? "topBarContainerRightBlockMultiple"
              : ""
          }`}
        >
          {this.state.walletList.length > 0 ? (
            <div
              ref={this.props.buttonRef}
              className="topbar-btn maxWidth50 ml-2"
              id="address-button-two"
              onClick={this.passAddWalletClick}
            >
              <Image className="topBarWalletAdd" src={PlusCircleIcon} />
              <span className="dotDotText">Add address</span>
            </div>
          ) : null}
          <div
            onClick={this.passConnectExchangeClick}
            className={`topbar-btn ml-2 ${
              this.state.walletList.length > 0 ? "maxWidth50" : ""
            }`}
          >
            {this.state.exchangeList.length > 0 ? (
              <>
                <span className="mr-2">
                  {this.state.exchangeListImages.slice(0, 3).map((imgUrl) => (
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
                marginRight: "0rem",
                paddingRight: "0rem",
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
            >
              <Image className="topBarWalletAdd " src={WalletIcon} />
              <span className="dotDotText">Connect wallet</span>
            </div>
          )}
        </div>
      </div>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopWalletExchangeBar);
