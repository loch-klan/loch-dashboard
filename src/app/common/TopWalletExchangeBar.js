import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";

import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import TopBarDropDown from "./TopBarDropDown";

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
    this.applyWalletList();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps?.walletState?.walletList !== this.props.walletState?.walletList
    ) {
      this.applyWalletList();
    }
  }

  applyWalletList = () => {
    if (this.props.walletState?.walletList?.length > 0) {
      const walletList = this.props.walletState.walletList;
      const tempWalletList = [];
      const tempExchangeList = [];
      const tempExchangeListImages = [];
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
            tempWalletList.push(data.address);
          }
        }
      });
      this.setState({
        firstWallet: tempWalletList.length > 0 ? tempWalletList[0] : "",
        totalWallets: walletList.length,
        walletList: tempWalletList,
        exchangeList: tempExchangeList,
        firstExchange: tempExchangeList.length > 0 ? tempExchangeList[0] : "",
        exchangeListImages: tempExchangeListImages,
      });
    }
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
              handleAddWalletClick={this.props.handleAddWalletClick}
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
            onClick={this.props.handleAddWalletClick}
          >
            <Image className="topBarWalletAdd" src={AddWalletAddress} />
            <span className="dotDotText">Add wallet address</span>
          </div>
        )}

        <div
          onClick={this.props.handleConnectModal}
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
                {this.state.firstExchange}{" "}
                {this.state.exchangeList.length > 1 ? "and others " : ""}
                {"connected"}
              </span>
            </>
          ) : (
            <>
              <Image className="topBarWalletAdd " src={AddWalletAddress} />
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
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
