import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent, CustomButton } from "../../../utils/form/index.js";
import { detectCoin } from "../../onboarding/Api.js";
import backIcon from "../../../assets/images/icons/Icon-back.svg";
import { setPageFlagDefault } from "../../common/Api.js";

import { Image } from "react-bootstrap";

import {
  CrossSmartMoneyIcon,
  TrophyCelebrationIcon,
  TrophyIcon,
  WarningCircleIcon,
} from "../../../assets/images/icons/index.js";
import { addSmartMoney } from "../Api.js";
import SmartMoneyAddressAddedBlock from "./smartMoneyAddressAddedBlock.js";
import { toast } from "react-toastify";

class SmartMoneyMobileAddAddressModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      // NEW
      backIconLoaded: false,
      CrossSmartMoneyIconLoaded: false,
      TrophyIconLoaded: false,
      coinsLoading: false,
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
          showNickname: false,
          showNameTag: true,
          apiAddress: "",
        },
      ],
      showAddAddressResponse: false,
      showAddressAdded: false,
      showAddressAlreadyPresent: false,
      showAddressNotTenK: false,
    };
  }

  componentDidMount() {}
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
  nicknameOnChain = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.addWalletList];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      walletCopy[foundIndex].nickname = value;
    }
    this.setState({
      addWalletList: walletCopy,
    });
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
    newAddress[i].showNickname = true;

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
  addAddressToSmartMoney = (e) => {
    if (this.state.loadAddBtn || !this.state.coinsFound) {
      return null;
    }
    let data = new URLSearchParams();
    const tempItem = this.state.addWalletList[0];
    data.append("address", tempItem.address);
    data.append("name_tag", tempItem.nickname);
    this.setState({
      loadAddBtn: true,
    });
    this.props.addSmartMoney(
      data,
      this,
      tempItem.address,
      tempItem.nickname,
      true
    );
  };
  handleAddSmartMoneyError = () => {
    this.setState({
      loadAddBtn: false,
    });
  };
  showDefaultView = () => {
    this.setState({
      showAddAddressResponse: false,
      showAddressAdded: false,
      showAddressAlreadyPresent: false,
      showAddressNotTenK: false,
      loadAddBtn: false,
      addWalletList: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: false,
          showNameTag: true,
          apiAddress: "",
        },
      ],
    });
  };
  addressSuccesfullyAdded = () => {
    this.setState({
      showAddAddressResponse: true,
      showAddressAdded: true,
      showAddressAlreadyPresent: false,
      showAddressNotTenK: false,
      loadAddBtn: false,
    });
  };
  addressLowBalance = () => {
    this.setState({
      showAddAddressResponse: true,
      showAddressAdded: false,
      showAddressAlreadyPresent: false,
      showAddressNotTenK: true,
      loadAddBtn: false,
    });
  };
  addressAlreadyPresent = () => {
    this.setState({
      showAddAddressResponse: true,
      showAddressAdded: false,
      showAddressAlreadyPresent: true,
      showAddressNotTenK: false,
      loadAddBtn: false,
    });
  };
  scrollToTop = () => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  };
  handleKeyPress = (event) => {
    if (
      event.key === "Enter" &&
      !(this.state.loadAddBtn || !this.state.coinsFound)
    ) {
      event.preventDefault();
      event.target.blur();

      this.addAddressToSmartMoney();
    }
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
                <input
                  type="text"
                  disabled={
                    (elem.displayAddress &&
                      elem.displayAddress ===
                        this.state.metamaskWalletConnected) ||
                    (elem.address &&
                      elem.address === this.state.metamaskWalletConnected)
                  }
                  name={`wallet${index + 1}`}
                  value={elem.displayAddress || elem.address || ""}
                  placeholder="Paste wallet address or ENS here"
                  className={`inter-display-regular f-s-16 lh-20 mwbAwInput`}
                  onChange={(e) => this.handleOnchange(e)}
                  id={elem.id}
                  onKeyDown={this.handleKeyPress}
                  onFocus={this.scrollToTop}
                  onBlur={this.hideBorder}
                  autocomplete="off"
                />
              </div>
            )}

            {elem.coinFound && elem.showNickname && elem.displayAddress ? (
              <div className="mbwAwTopInputWrapper">
                <input
                  type="text"
                  name={`wallet${index + 1}`}
                  value={elem.nickname || ""}
                  placeholder="Enter nametag"
                  className={`inter-display-regular f-s-16 lh-20 mwbAwInput m-t-20`}
                  onChange={(e) => this.nicknameOnChain(e)}
                  id={elem.id}
                  onKeyDown={this.handleKeyPress}
                  onFocus={this.scrollToTop}
                  onBlur={this.hideBorder}
                  autocomplete="off"
                />
              </div>
            ) : null}
          </div>
        </div>
      );
    });
    return (
      <div className="msmpModalBody">
        {this.state.showAddAddressResponse ? (
          <div className="msmpAddWalletReponsesConatinaer">
            {this.state.showAddressAdded ? (
              <SmartMoneyAddressAddedBlock
                btnClick={this.props.onHide}
                heading="Congratulations"
                descriptionOne="This unique address is worth more than $10K."
                btnText="Done"
                imageIcon={TrophyCelebrationIcon}
                bodyImageClass="addCommunityTopAccountsAddedBodyLargerIcon"
              />
            ) : null}
            {this.state.showAddressAlreadyPresent ? (
              <SmartMoneyAddressAddedBlock
                btnClick={this.showDefaultView}
                heading="Sorry this address has already been added"
                descriptionOne="Please try to add another address."
                btnText="Add another"
                imageIcon={WarningCircleIcon}
              />
            ) : null}
            {this.state.showAddressNotTenK ? (
              <SmartMoneyAddressAddedBlock
                btnClick={this.showDefaultView}
                heading="Sorry this address is not worth at least $10K"
                descriptionOne="Please try to add another address."
                btnText="Add another"
                imageIcon={WarningCircleIcon}
                hideModal={this.hideModal}
              />
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            opacity: this.state.showAddAddressResponse ? 0 : 1,
          }}
          className="msmpModalClosebtnContainer"
        >
          <div
            className="back-icon"
            onClick={this.state.isSignUpPage ? this.showSignInPage : () => null}
            style={{
              opacity: this.state.isSignUpPage ? 1 : 0,
            }}
          >
            <Image
              className="cp"
              src={backIcon}
              onLoad={() => {
                this.setState({
                  backIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.backIconLoaded ? 1 : 0,
              }}
            />
          </div>
          <div className="msmpModalClosebtn" onClick={this.props.onHide}>
            <Image
              src={CrossSmartMoneyIcon}
              onLoad={() => {
                this.setState({
                  CrossSmartMoneyIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.CrossSmartMoneyIconLoaded ? 1 : 0,
              }}
            />
          </div>
        </div>
        <div className="msmpModalMainIconWhiteContainer">
          <Image
            src={TrophyIcon}
            onLoad={() => {
              this.setState({
                TrophyIconLoaded: true,
              });
            }}
            style={{
              opacity: this.state.TrophyIconLoaded ? 1 : 0,
            }}
          />
        </div>
        <div className="msmpModalTexts">
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-10">
            Contribute to the community
          </h6>
          <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
            Add a unique address work at least $10k
          </p>
        </div>
        <div className="mwbAddWalletWrapperContainer m-b-48">{wallets}</div>
        <div className="msmModalBtnContainer">
          <CustomButton
            className="inter-display-regular f-s-15 lh-20 msmModalBtn"
            type="submit"
            isLoading={
              this.state.loadAddBtn ||
              (this.state.addWalletList &&
              this.state.addWalletList[0].displayAddress === ""
                ? false
                : this.state.coinsLoading)
            }
            buttonText="Go"
            isDisabled={this.state.loadAddBtn || !this.state.coinsFound}
            handleClick={this.addAddressToSmartMoney}
          />
        </div>
        <div className="msmModalBtnContainer m-t-24">
          <CustomButton
            className="inter-display-regular f-s-15 lh-20 msmModalBtn msmTransparentModalBtn"
            type="submit"
            handleClick={this.props.onHide}
            buttonText="Cancel"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
  detectCoin,
  addSmartMoney,
};

SmartMoneyMobileAddAddressModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyMobileAddAddressModal);
