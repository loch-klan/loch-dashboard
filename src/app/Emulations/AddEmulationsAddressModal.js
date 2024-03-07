import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";

import {
  CheckIcon,
  CloseIcon,
  EmultionSidebarIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons";
import { CustomCoin } from "../../utils/commonComponent";
import { CustomButton } from "../../utils/form";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { detectNameTag } from "../common/Api";
// import { addAddressToWatchList } from "./redux/WatchListApi";
import validator from "validator";
import { WatchlistAddAddress } from "../../utils/AnalyticsFunctions";
import { START_INDEX } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { addEmulations } from "./EmulationsApi";
import { toast } from "react-toastify";

class AddEmulationsAddressModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: this.props.onHide,
      loadAddBtn: false,
      copyTradeAmount: "",
      notificationEmailAddress: "",
      canClickConnectWallet: true,
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
          loadingNameTag: false,
          metamaskWalletConnected: undefined,
        },
      ],
      addressesAdded: false,
    };
  }
  checkForBtnDisable = () => {
    if (this.state.walletInput.length > 1) {
      return this.isDisabled();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.emulationsUpdated !== this.props.emulationsUpdated) {
      const ssItem = window.sessionStorage.getItem(
        "setMetamaskConnectedSessionStorage"
      );

      if (ssItem) {
        toast.success("Wallet connected");
        this.setState({
          metamaskWalletConnected: ssItem,
        });
      }
    }
  }
  componentDidMount() {
    this.props.getAllCoins();
    this.props.getAllParentChains();
    // Set Metamask connected

    const ssItem = window.sessionStorage.getItem(
      "setMetamaskConnectedSessionStorage"
    );
    if (ssItem && ssItem !== null) {
      this.setState({
        metamaskWalletConnected: ssItem,
      });
    }
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      this.setState({
        notificationEmailAddress: userDetails.email,
      });
    }
  }
  FocusInInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];

    walletCopy?.forEach((address, i) => {
      if (address.id === name) {
        walletCopy[i].showAddress = true;
        walletCopy[i].showNickname = true;
      } else {
        walletCopy[i].showAddress =
          walletCopy[i].nickname === "" ? true : false;
        walletCopy[i].showNickname =
          walletCopy[i].nickname !== "" ? true : false;
      }
    });

    this.setState({
      walletInput: walletCopy,
    });
  };
  handleOnAmountChange = (e) => {
    let { value } = e.target;
    value = value.replace("$", "");
    if (!isNaN(value)) {
      this.setState({
        copyTradeAmount: value,
      });
    }
  };
  handleOnEmailChange = (e) => {
    let { value } = e.target;
    this.setState({
      notificationEmailAddress: value,
    });
  };

  handleOnchange = (e) => {
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
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
      walletInput: walletCopy,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (!walletCopy[foundIndex].loadingNameTag) {
      this.handleSetNameTagLoadingTrue({
        id: name,
        address: value,
      });
    }
    // timeout;
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 1000);
  };
  handleSetNameTagLoadingFalse = (data) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        loadingNameTag: false,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTagLoadingTrue = (data) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        loadingNameTag: true,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        nameTag: nameTag,
        loadingNameTag: false,
        showNameTag: true,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
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
      data.subChains?.forEach((item) =>
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
      } else {
        this.handleSetNameTagLoadingFalse({
          id: name,
          address: value,
        });
        this.handleSetNameTag(
          {
            id: name,
            address: value,
          },
          ""
        );
      }

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
        // this.props.detectNameTag(
        //   {
        //     id: name,
        //     coinCode: parentCoinList[i].code,
        //     coinSymbol: parentCoinList[i].symbol,
        //     coinName: parentCoinList[i].name,
        //     address: value,
        //     coinColor: parentCoinList[i].color,
        //     subChains: parentCoinList[i].sub_chains,
        //   },
        //   this,
        //   false,
        //   i
        // );
      }
    }
  };
  handleOnchangeNickname = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      walletCopy[foundIndex].nickname = value;
    }
    this.setState({
      walletInput: walletCopy,
    });
  };
  hideModal = (callApi) => {
    this.state.onHide(callApi);
  };
  isDisabled = () => {
    if (this.state.loadAddBtn) {
      return true;
    }

    if (
      !this.state.metamaskWalletConnected &&
      !this.state.canClickConnectWallet
    ) {
      return true;
    }
    let isDisableFlag = true;
    this.state.walletInput?.forEach((e) => {
      if (e.address) {
        e.coins.forEach((a) => {
          if (a.chain_detected === true) {
            isDisableFlag = false;
          }
        });
      }
    });
    if (isDisableFlag) {
      return true;
    }
    if (
      (this.state.copyTradeAmount.length === 0 ||
        isNaN(this.state.copyTradeAmount) ||
        Number(this.state.copyTradeAmount) < 1) &&
      this.state.metamaskWalletConnected
    ) {
      return true;
    }
    if (!validator.isEmail(this.state.notificationEmailAddress)) {
      return true;
    }
    return false;
  };

  btnClickFunctionPass = () => {
    if (this.state.metamaskWalletConnected) {
      let data = new URLSearchParams();
      let tempAdd = "";
      if (this.state.walletInput[0].address) {
        tempAdd = this.state.walletInput[0].address;
      } else if (this.state.walletInput[0].apiAddress) {
        tempAdd = this.state.walletInput[0].apiAddress;
      }
      data.append("deposit", this.state.copyTradeAmount);
      data.append(
        "email",
        this.state.notificationEmailAddress
          ? this.state.notificationEmailAddress.toLowerCase()
          : ""
      );
      data.append("copy_address", tempAdd);
      data.append("user_address", this.state.metamaskWalletConnected);
      this.setState({
        loadAddBtn: true,
      });
      this.props.addEmulations(data, this.hideModal, this.resetBtn);
    } else {
      if (document.getElementById("topbar-connect-wallet-btn")) {
        if (this.state.canClickConnectWallet) {
          this.setState({
            canClickConnectWallet: false,
          });
          document.getElementById("topbar-connect-wallet-btn").click();
        }
      }
    }
  };
  resetBtn = () => {
    this.setState({
      loadAddBtn: false,
    });
  };
  handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      if (!this.isDisabled()) {
        this.btnClickFunctionPass();
      }
    }
  };
  showAddressesAdded = (passedAddress, passedNameTag) => {
    WatchlistAddAddress({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      address: passedAddress,
      name_tag: passedNameTag,
    });
    this.setState({ addressesAdded: true });
    this.refetchList();
  };
  refetchList = () => {
    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);
    this.props.callApi(page);
  };
  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        {this.state.addressesAdded ? (
          <div className="addWatchListWrapperAdded">
            <Modal.Header className="addWatchListAddedHeader">
              <div className="closebtn" onClick={this.hideModal}>
                <Image src={CloseIcon} />
              </div>
            </Modal.Header>
            <Modal.Body className="addWatchListAddedBody">
              <div className="addWatchListAddedBodyContent">
                <Image className="addWatchListAddedBodyIcon" src={CheckIcon} />
                <div
                  className="exit-overlay-body"
                  style={{ padding: "0rem 10.5rem" }}
                >
                  <h6 className="inter-display-medium f-s-25">Following</h6>
                  <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                    Your are now following this address
                  </p>
                </div>
                <Button
                  className="primary-btn main-button-invert"
                  onClick={this.hideModal}
                >
                  Done
                </Button>
              </div>
            </Modal.Body>
          </div>
        ) : null}
        <Modal.Header>
          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={EmultionSidebarIcon} className="imageDarker" />
          </div>
          <div className="closebtn" onClick={this.hideModal}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="addWatchListWrapperParent addCopyTradeWrapperParent">
            <div
              style={{
                marginBottom: "3.3rem",
              }}
              className="exit-overlay-body"
            >
              <h6 className="inter-display-medium f-s-25">Copy Trade</h6>
              <p className="inter-display-medium f-s-16 grey-969 text-center">
                Follow the smart-money. Copy trade anyone on-chain.
              </p>
            </div>
            <div className="addWatchListWrapperContainer">
              <div className="addCopyTraderWrapperContainer">
                <div className="inter-display-medium f-s-13 grey-313 m-b-12">
                  Who do you want to copy?
                </div>
                {this.state.walletInput?.map((elem, index) => {
                  return (
                    <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                      <div
                        className={`awInputWrapper awInputWrapperCopyTrader ${
                          elem.address ? "isAwInputWrapperValid" : ""
                        }`}
                      >
                        {elem.showAddress && (
                          <div className="awTopInputWrapper input-noshadow-dark">
                            <div className="awInputContainer">
                              <input
                                autoFocus
                                name={`wallet${index + 1}`}
                                value={
                                  elem.displayAddress || elem.address || ""
                                }
                                placeholder="Paste any wallet address or ENS here"
                                // className='inter-display-regular f-s-16 lh-20'
                                className={`inter-display-regular f-s-16 lh-20 awInput`}
                                onChange={(e) => this.handleOnchange(e)}
                                id={elem.id}
                                style={{
                                  paddingRight: "0.5rem",
                                }}
                                autoComplete="off"
                                onKeyDown={this.handleKeyDown}
                                onFocus={(e) => {
                                  this.FocusInInput(e);
                                }}
                              />
                            </div>
                            {this.state.walletInput?.map((e, i) => {
                              if (
                                this.state.walletInput[index].address &&
                                e.id === `wallet${index + 1}`
                              ) {
                                // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                if (e.coinFound && e.coins.length > 0) {
                                  return (
                                    <CustomCoin
                                      isStatic
                                      coins={e.coins.filter(
                                        (c) => c.chain_detected
                                      )}
                                      key={i}
                                      isLoaded={true}
                                    />
                                  );
                                } else {
                                  if (
                                    e.coins.length ===
                                    this.props.OnboardingState.coinsList.length
                                  ) {
                                    return (
                                      <CustomCoin
                                        isStatic
                                        coins={null}
                                        key={i}
                                        isLoaded={true}
                                      />
                                    );
                                  } else {
                                    return (
                                      <CustomCoin
                                        isStatic
                                        coins={null}
                                        key={i}
                                        isLoaded={false}
                                      />
                                    );
                                  }
                                }
                              } else {
                                return "";
                              }
                            })}
                          </div>
                        )}

                        {elem.coinFound && elem.showNickname && (
                          <div
                            className={`awBottomInputWrapper ${
                              elem.showAddress &&
                              ((elem.showNameTag && elem.nameTag) ||
                                elem.loadingNameTag)
                                ? "mt-2"
                                : ""
                            }`}
                          >
                            {!elem.showAddress &&
                              this.state.walletInput?.map((e, i) => {
                                if (
                                  this.state.walletInput[index].address &&
                                  e.id === `wallet${index + 1}`
                                ) {
                                  // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                  if (e.coinFound && e.coins.length > 0) {
                                    return (
                                      <CustomCoin
                                        isStatic
                                        coins={e.coins.filter(
                                          (c) => c.chain_detected
                                        )}
                                        key={i}
                                        isLoaded={true}
                                      />
                                    );
                                  } else {
                                    if (
                                      e.coins.length ===
                                      this.props.OnboardingState.coinsList
                                        .length
                                    ) {
                                      return (
                                        <CustomCoin
                                          isStatic
                                          coins={null}
                                          key={i}
                                          isLoaded={true}
                                        />
                                      );
                                    } else {
                                      return (
                                        <CustomCoin
                                          isStatic
                                          coins={null}
                                          key={i}
                                          isLoaded={false}
                                        />
                                      );
                                    }
                                  }
                                } else {
                                  return "";
                                }
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="inter-display-medium f-s-13 grey-313 m-b-12 m-t-18">
                  Add your email address to get notifications
                </div>
                <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                  <div
                    className={`awInputWrapper awInputWrapperCopyTrader ${
                      this.state.notificationEmailAddress &&
                      this.state.notificationEmailAddress.length > 0
                        ? "isAwInputWrapperValid"
                        : ""
                    }`}
                  >
                    <div className="awTopInputWrapper input-noshadow-dark">
                      <div className="awInputContainer">
                        <input
                          value={this.state.notificationEmailAddress}
                          autoFocus
                          placeholder="Your email address"
                          className={`inter-display-regular f-s-16 lh-20 awInput`}
                          onChange={this.handleOnEmailChange}
                          autoComplete="off"
                          onKeyDown={this.handleKeyDown}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.metamaskWalletConnected ? (
                  <>
                    <div className="inter-display-medium f-s-13 grey-313 m-b-12 m-t-18">
                      How much do you want to copy trade?
                    </div>
                    <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                      <div
                        className={`awInputWrapper awInputWrapperCopyTrader ${
                          this.state.copyTradeAmount &&
                          this.state.copyTradeAmount.length > 0
                            ? "isAwInputWrapperValid"
                            : ""
                        }`}
                      >
                        <div className="awTopInputWrapper input-noshadow-dark">
                          <div className="awInputContainer">
                            <input
                              value={
                                this.state.copyTradeAmount &&
                                this.state.copyTradeAmount.length > 0
                                  ? `$${this.state.copyTradeAmount}`
                                  : ""
                              }
                              autoFocus
                              placeholder="$1000.00"
                              className={`inter-display-regular f-s-16 lh-20 awInput`}
                              onChange={this.handleOnAmountChange}
                              autoComplete="off"
                              onKeyDown={this.handleKeyDown}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="watchListAddressBtnContainer copeTraderBtnContainer">
              <CustomButton
                className={`primary-btn go-btn main-button-invert ${
                  this.state.metamaskWalletConnected ||
                  this.state.loadAddBtn ||
                  (!this.state.canClickConnectWallet &&
                    !this.state.metamaskWalletConnected)
                    ? ""
                    : "transparent-copy-trade-btn"
                } ${
                  !this.isDisabled() && !this.state.metamaskWalletConnected
                    ? "transparent-copy-trade-btn-active"
                    : ""
                }`}
                type="submit"
                isDisabled={this.isDisabled()}
                buttonText={
                  this.state.metamaskWalletConnected ? "Add" : "Connect wallet"
                }
                handleClick={this.btnClickFunctionPass}
                isLoading={
                  this.state.loadAddBtn ||
                  (!this.state.canClickConnectWallet &&
                    !this.state.metamaskWalletConnected)
                }
                buttonAttachedImage={
                  !this.state.metamaskWalletConnected
                    ? UserCreditScrollRightArrowIcon
                    : undefined
                }
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllParentChains,
  detectCoin,
  detectNameTag,
  addEmulations,
};

AddEmulationsAddressModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEmulationsAddressModal);
