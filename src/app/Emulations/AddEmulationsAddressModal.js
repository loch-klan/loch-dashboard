import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";

import {
  CloseIcon,
  EmultionSidebarIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons";
import { CustomCoin } from "../../utils/commonComponent";
import { CustomButton } from "../../utils/form";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { detectNameTag } from "../common/Api";
// import { addAddressToWatchList } from "./redux/WatchListApi";
import { toast } from "react-toastify";
import validator from "validator";
import { addEmulations } from "./EmulationsApi";

class AddEmulationsAddressModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      mobileStep: props.isMobile ? 1 : 0,
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
        {
          id: `wallet2`,
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
    if (this.props.isMobile) {
      if (this.state.mobileStep === 1) {
        let isDisableFlag = true;
        this.state.walletInput.slice(1, 2)?.forEach((e) => {
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
          (this.state.metamaskWalletConnected || this.props.isMobile)
        ) {
          return true;
        }
      } else if (this.state.mobileStep === 2) {
        let isDisableFlag = true;
        this.state.walletInput.slice(0, 1)?.forEach((e) => {
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
        if (!validator.isEmail(this.state.notificationEmailAddress)) {
          return true;
        }
      }

      return false;
    } else {
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
    }

    if (
      (this.state.copyTradeAmount.length === 0 ||
        isNaN(this.state.copyTradeAmount) ||
        Number(this.state.copyTradeAmount) < 1) &&
      (this.state.metamaskWalletConnected || this.props.isMobile)
    ) {
      return true;
    }
    if (!validator.isEmail(this.state.notificationEmailAddress)) {
      return true;
    }
    return false;
  };

  btnClickFunctionPass = () => {
    if (this.state.metamaskWalletConnected || this.props.isMobile) {
      if (
        this.state.mobileStep === 2 ||
        (this.state.metamaskWalletConnected && !this.props.isMobile)
      ) {
        let data = new URLSearchParams();
        let tempAdd = "";
        if (this.state.walletInput[1].address) {
          tempAdd = this.state.walletInput[1].address;
        } else if (this.state.walletInput[1].apiAddress) {
          tempAdd = this.state.walletInput[1].apiAddress;
        }
        data.append("deposit", this.state.copyTradeAmount);
        data.append(
          "email",
          this.state.notificationEmailAddress
            ? this.state.notificationEmailAddress.toLowerCase()
            : ""
        );
        data.append("copy_address", tempAdd);
        if (this.props.isMobile) {
          if (this.state.walletInput[0].address) {
            data.append("user_address", this.state.walletInput[0].address);
          } else if (this.state.walletInput[0].apiAddress) {
            data.append("user_address", this.state.walletInput[0].apiAddress);
          }
        } else {
          data.append("user_address", this.state.metamaskWalletConnected);
        }
        this.setState({
          loadAddBtn: true,
        });
        this.props.addEmulations(data, this.hideModal, this.resetBtn);
      } else if (this.state.mobileStep === 1) {
        this.setState({
          mobileStep: 2,
        });
      }
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

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.props.isMobile ? "mobile-add-copy-trade-modal" : ""
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <Modal.Header>
          {this.props.isMobile ? (
            <div className="mobile-copy-trader-popup-header">
              <div className="mobile-copy-trader-popup-header-title-container">
                <Image
                  className="mobile-copy-trader-popup-header-title-icon"
                  src={EmultionSidebarIcon}
                />
                <h6 className="inter-display-medium f-s-20">Copy Trade</h6>
              </div>
              <div
                onClick={this.hideModal}
                className="mobile-copy-trader-popup-header-close-icon"
              >
                <Image src={CloseIcon} />
              </div>
            </div>
          ) : (
            <>
              <div className="api-modal-header popup-main-icon-with-border">
                <Image src={EmultionSidebarIcon} className="imageDarker" />
              </div>
              <div className="closebtn" onClick={this.hideModal}>
                <Image src={CloseIcon} />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="addWatchListWrapperParent addCopyTradeWrapperParent">
            <div
              style={{
                marginBottom: this.props.isMobile ? "2.3rem" : "3.3rem",
              }}
              className="exit-overlay-body"
            >
              {this.props.isMobile ? null : (
                <>
                  <h6 className="inter-display-medium f-s-25">Copy Trade</h6>
                  <p className="inter-display-medium f-s-16 grey-969 text-center">
                    Follow the smart-money. Copy trade anyone on-chain.
                  </p>
                </>
              )}
            </div>
            <div className="addWatchListWrapperContainer">
              <div className="addCopyTraderWrapperContainer">
                {this.state.mobileStep === 2 ? (
                  <>
                    <div
                      className={`inter-display-medium grey-313 m-b-12 ${
                        this.props.isMobile ? "f-s-15" : "f-s-13"
                      }`}
                    >
                      Add your wallet address
                    </div>
                    {this.state.walletInput?.slice(0, 1).map((elem, index) => {
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
                                    name={`wallet1`}
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
                                    this.state.walletInput[0].address &&
                                    e.id === `wallet1`
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
                                      this.state.walletInput[0].address &&
                                      e.id === `wallet1`
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
                  </>
                ) : null}
                {!this.props.isMobile || this.state.mobileStep === 1 ? (
                  <>
                    <div
                      className={`inter-display-medium grey-313 m-b-12 ${
                        this.props.isMobile ? "f-s-15" : "f-s-13"
                      }`}
                    >
                      Who do you want to copy?
                    </div>
                    {this.state.walletInput?.slice(1, 2).map((elem, index) => {
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
                                    name={`wallet2`}
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
                                    this.state.walletInput[1].address &&
                                    e.id === `wallet2`
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
                                      this.state.walletInput[1].address &&
                                      e.id === `wallet2`
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
                  </>
                ) : null}

                {!this.props.isMobile || this.state.mobileStep === 2 ? (
                  <>
                    <div
                      className={`inter-display-medium grey-313 m-b-12 m-t-20 ${
                        this.props.isMobile ? "f-s-15" : "f-s-13"
                      }`}
                    >
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
                  </>
                ) : null}
                {(this.state.mobileStep === 0 &&
                  this.state.metamaskWalletConnected) ||
                this.state.mobileStep === 1 ? (
                  <>
                    <div
                      className={`inter-display-medium grey-313 m-b-12 m-t-20 ${
                        this.props.isMobile ? "f-s-15" : "f-s-13"
                      }`}
                    >
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
                              placeholder="$0"
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
            {this.props.isMobile ? (
              <div className="watchListAddressBtnContainer copeTraderBtnContainer">
                <CustomButton
                  className={`primary-btn go-btn main-button-invert ${
                    !this.isDisabled()
                      ? "transparent-copy-trade-btn-active"
                      : ""
                  }`}
                  type="submit"
                  isDisabled={this.isDisabled()}
                  buttonText={this.state.mobileStep === 1 ? "Next" : "Add"}
                  handleClick={this.btnClickFunctionPass}
                  isLoading={this.state.loadAddBtn}
                />
              </div>
            ) : (
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
                    this.state.metamaskWalletConnected
                      ? "Add"
                      : "Connect wallet"
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
            )}
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
