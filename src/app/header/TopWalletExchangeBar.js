import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";

import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import LinkIconBtn from "../../assets/images/link.svg";
import TopBarDropDown from "./TopBarDropDown";
import {
  AddConnectExchangeModalOpen,
  AddWalletAddressModalOpen,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { setHeaderReducer } from "./HeaderAction";

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
    };
  }

  componentDidMount() {
    this.applyLocalStorageWalletList();
    if (this.props.walletState?.walletList) {
      this.applyWalletList();
    } else {
      this.applyTempWalletList();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps?.walletState?.walletList !== this.props.walletState?.walletList
    ) {
      this.applyWalletList();
    }
    if (prevProps?.HeaderState !== this.props.HeaderState) {
      this.applyTempWalletList();
    }
  }
  TruncateText = (string) => {
    return (
      string.substring(0, 3) +
      "..." +
      string.substring(string.length - 3, string.length)
    );
  };
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
      const passDataHeader = walletList.map((walRes) => {
        return {
          nickname: walRes.nickname,
          displayAddress: walRes.display_address,
          address: walRes.address,
        };
      });
      this.props.setHeaderReducer(passDataHeader);
      const tempWalletList = [];
      const tempExchangeList = [];
      const tempExchangeListImages = [];
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
              tempWalletList.push(this.TruncateText(data.address));
            }
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
      }
    }
  };
  applyTempWalletList = () => {
    if (this.props.HeaderState?.wallet?.length > 0) {
      const walletList = this.props.HeaderState?.wallet;
      const tempWalletList = [];
      const tempExchangeList = [];
      const tempExchangeListImages = [];
      const regex = /\.eth$/;
      if (walletList) {
        walletList.forEach((data) => {
          if (data.isExchange) {
            if (data.exchangeCode) {
              tempExchangeList.push(data.exchangeCode);
            }
            if (data.exchangeSymbol) {
              tempExchangeListImages.push(data.exchangeSymbol);
            }
          } else {
            let tempAddress = "";
            if (data?.nickname && data?.nickname !== "") {
              tempAddress = data.nickname;
            } else if (data?.displayAddress) {
              tempAddress = data.displayAddress;
              if (!regex.test(tempAddress)) {
                tempAddress = this.TruncateText(tempAddress);
              }
            } else if (data?.address) {
              tempAddress = data.address;
              if (!regex.test(tempAddress)) {
                tempAddress = this.TruncateText(tempAddress);
              }
            } else if (data?.apiAddress) {
              tempAddress = data.apiAddress;
              if (!regex.test(tempAddress)) {
                tempAddress = this.TruncateText(tempAddress);
              }
            }

            tempWalletList.push(tempAddress);
          }
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

  render() {
    return (
      <div className="topBarContainer">
        {this.state.walletList.length > 0 ? (
          <div className="topWalletDropdownContainer ml-2 maxWidth50">
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
    );
  }
}

const mapStateToProps = (state) => ({
  walletState: state.WalletState,
  HeaderState: state.HeaderState,
});

const mapDispatchToProps = {
  setHeaderReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
