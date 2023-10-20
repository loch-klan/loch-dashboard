import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";

import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import LinkIconBtn from "../../assets/images/link.svg";
import TopBarDropDown from "./TopBarDropDown";
import {
  AddConnectExchangeModalOpen,
  AddWalletAddressModalOpen,
  ConnectWalletButtonClicked,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { setHeaderReducer, setIsWalletConnectedReducer } from "./HeaderAction";
import { TruncateText } from "../../utils/ReusableFunctions";
import {
  MetamaskIcon,
  WalletIcon,
  XCircleIcon,
} from "../../assets/images/icons";
import { ethers } from "ethers";
import { updateUserWalletApi } from "../common/Api";
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalWallets: "",
      firstWallet: "",
      walletList: [],
      exchangeList: [],
      exchangeListImages: [],
      firstExchange: "",
      showWalletConnected: false,
    };
  }
  checkIsMetaMaskConnected = async () => {
    if (window.ethereum) {
      try {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((metaRes) => {
            console.log("metaRes ", metaRes);
            if (metaRes && metaRes.length > 0) {
              this.props.setIsWalletConnectedReducer(true);
            } else {
              this.props.setIsWalletConnectedReducer(false);
            }
          })
          .catch((metaErr) => {
            console.log("metaError ", metaErr);
          });
      } catch (passedError) {
        console.log("Api issue ", passedError);
      }
    }
  };
  dissconnectFromMetaMask = async () => {};
  componentDidMount() {
    this.applyLocalStorageWalletList();
    if (
      this.props.IsWalletConnectedState === true ||
      this.props.IsWalletConnectedState === false
    ) {
      this.setState({
        showWalletConnected: this.props.IsWalletConnectedState,
      });
    }
    this.checkIsMetaMaskConnected();
    if (this.props.walletState?.walletList) {
      this.applyWalletList();
    } else {
      this.applyTempWalletList();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.IsWalletConnectedState !== this.props.IsWalletConnectedState
    ) {
      this.setState({
        showWalletConnected: this.props.IsWalletConnectedState,
      });
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
    if (tempWalletAdd) {
      tempWalletAdd = JSON.parse(tempWalletAdd);
    }
    if (tempWalletAdd && tempWalletAdd.length > 0) {
      this.setState({
        firstWallet: tempWalletAdd.length > 0 ? tempWalletAdd[0] : "",
        totalWallets: tempWalletAdd.length,
        walletList: tempWalletAdd,
      });
    }
  };
  applyWalletList = () => {
    if (this.props.walletState?.walletList?.length > 0) {
      const walletList = this.props.walletState.walletList;
      const tempWalletList = [];
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
            if (data?.nickname) {
              tempWalletList.push(data.nickname);
            } else if (data?.tag) {
              tempWalletList.push(data.tag);
            } else if (data?.display_address) {
              tempWalletList.push(data.display_address);
            } else if (data?.address) {
              tempWalletList.push(TruncateText(data.address));
            }

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
        tempWalletList.sort().reverse();
        const tempWalletListLoaclPass = JSON.stringify(tempWalletList);
        window.sessionStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        this.setState({
          firstWallet: tempWalletList.length > 0 ? tempWalletList[0] : "",
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
      const regex = /\.eth$/;
      if (walletList) {
        walletList.forEach((data) => {
          let tempAddress = "";
          if (data?.nickname) {
            tempAddress = data.nickname;
          } else if (data?.nameTag) {
            tempAddress = data.nameTag;
          } else if (data?.displayAddress) {
            tempAddress = data.displayAddress;
            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
            }
          } else if (data?.address) {
            tempAddress = data.address;
            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
            }
          } else if (data?.apiAddress) {
            tempAddress = data.apiAddress;
            if (!regex.test(tempAddress)) {
              tempAddress = TruncateText(tempAddress);
            }
          }

          tempWalletList.push(tempAddress);
        });
        tempWalletList.sort().reverse();
        const tempWalletListLoaclPass = JSON.stringify(tempWalletList);
        window.sessionStorage.setItem(
          "topBarLocalStorageWalletAddresses",
          tempWalletListLoaclPass
        );
        this.setState({
          firstWallet: tempWalletList.length > 0 ? tempWalletList[0] : "",
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
    console.log("window.ethereum ", window.ethereum);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();

      try {
        const tempRes = await provider.send("eth_requestAccounts", []);

        if (tempRes && tempRes.length > 0) {
          this.addToList(tempRes);
        }
        // Leaver console log: full signer too"
        console.log("signer is ", signer);
        console.log("signer get address is ", await signer.getAddress());
      } catch (error) {
        console.log("ethers error ", error);
      }
    }
  };
  addToList = (addThese) => {
    let walletAddress = JSON.parse(localStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
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
    addThese.forEach((curr) => {
      if (!arr.includes(curr?.trim()) && curr) {
        walletList.push({
          address: curr,
          coinFound: true,
          coins: [],
          displayAddress: curr,
          nameTag: "",
          nickname: "",
          showAddress: true,
          showNameTag: false,
          showNickname: false,
          wallet_metadata: null,
        });
        arr.push(curr?.trim());
        nicknameArr[curr?.trim()] = curr.nickname;
        arr.push(curr?.trim());
        arr.push(curr?.trim());
        addressList.push(curr?.trim());
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
    localStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));

    this.props.updateUserWalletApi(data, this, yieldData);
    this.checkIsMetaMaskConnected();
  };
  render() {
    return (
      <div className="topBarContainer">
        {this.state.walletList.length > 0 ? (
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
            />
          </div>
        ) : (
          <div
            ref={this.props.buttonRef}
            className="topbar-btn maxWidth50"
            id="address-button"
            onClick={this.passAddWalletClick}
          >
            <Image className="topBarWalletAdd" src={AddWalletAddress} />
            <span className="dotDotText">Add wallet address</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          {this.state.showWalletConnected ? (
            <div
              onClick={this.dissconnectFromMetaMask}
              className="topbar-btn topbar-btn-transparent ml-2 maxWidth50"
            >
              <Image
                className="topBarWalletAdd noHoverEffect metaMaskImg"
                src={MetamaskIcon}
              />
              <span className="dotDotText">Metamask</span>
              <Image
                className="topBarWalletAdd"
                style={{
                  margin: "0",
                  marginLeft: "0.8rem",
                }}
                src={XCircleIcon}
              />
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
          <div
            onClick={this.passConnectExchangeClick}
            className="topbar-btn ml-2 maxWidth50"
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  walletState: state.WalletState,
  HeaderState: state.HeaderState,
  OnboardingState: state.OnboardingState,
  IsWalletConnectedState: state.IsWalletConnectedState,
});

const mapDispatchToProps = {
  setHeaderReducer,
  updateUserWalletApi,
  setIsWalletConnectedReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
