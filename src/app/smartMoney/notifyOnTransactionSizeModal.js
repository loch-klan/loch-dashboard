import React, { useState } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BackArrowSmartMoneyIcon,
  CrossSmartMoneyIcon,
  CrossTransactionNotificationWalletIcon,
  CustomTransactionMailIcon,
  CustomTransactionTelegramIcon,
  RingingBellIcon,
} from "../../assets/images/icons";
import {
  TruncateText,
  amountFormat,
  goToAddress,
  isSameDateAs,
  sliderBillionToMillion,
} from "../../utils/ReusableFunctions";
import { BaseReactComponent, CustomButton } from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdownPrice";
import moment from "moment";
import { getTransactionAsset } from "../intelligence/Api";
import { PaywallModal } from "../common";
import { BASE_URL_S3 } from "../../utils/Constant";
import CheckboxCustomTable from "../common/customCheckboxTable";
import validator from "validator";
import { isNewAddress } from "../Portfolio/Api";
import { detectCoin } from "../onboarding/Api";

class NotifyOnTransactionSizeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadAddBtn: false,
      disableAddBtn: false,
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
      addedWallets: [],
      sliderConvertor: [
        100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
        10000000000,
      ],
      show: props.show,
      onHide: props.onHide,
      minSliderVal: null,
      maxSliderVal: null,
      curMinSliderVal: "100",
      curMaxSliderVal: "5000000000",
      curMinSliderValConverted: "",
      curMaxSliderValConverted: "",
      isDisabled: false,
      AssetList: [],
      selectedActiveBadge: [],
      isAssetSearchUsed: false,
      userDetailsState: undefined,
      isPayModalOpen: false,
      isPayModalOptionsOpen: false,
      passedCTNotificationEmailAddress: "",
      passedCTAddress: "",
      passedCTCopyTradeAmount: "",
      userEmail: "",
      userTelegram: "",
      isUserEmailSelected: false,
      isUserTelegramSelected: false,
    };
  }

  setTooltipPos = () => {
    let xAndYMax = "";
    if (document.getElementsByClassName("rc-slider-handle-1")[0]) {
      xAndYMax = document
        .getElementsByClassName("rc-slider-handle-1")[0]
        .getBoundingClientRect();
    }

    const sliderMin = document.getElementById("smbSliderMinBox");
    if (sliderMin) {
      sliderMin.style.left = xAndYMax.x + "px";
      sliderMin.style.top = xAndYMax.y - 50 + "px";
    }
    let xAndYMin = "";
    if (document.getElementsByClassName("rc-slider-handle-2")[0]) {
      xAndYMin = document
        .getElementsByClassName("rc-slider-handle-2")[0]
        .getBoundingClientRect();
    }

    const sliderMax = document.getElementById("smbSliderMaxBox");
    if (sliderMax) {
      sliderMax.style.left = xAndYMin.x + "px";
      sliderMax.style.top = xAndYMin.y - 50 + "px";
    }
  };
  componentDidMount() {
    this.setTooltipPos();
    this.setMaxInput();
    this.setMinInput();
    this.assetList();
    this.convertMinMaxToSlider();
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    this.setState({
      userDetailsState: userDetails,
    });
    const allEle = document.getElementsByClassName("exit-overlay-form");
    const myEle = allEle[0];
    if (myEle) {
      myEle.addEventListener("scroll", () => {
        this.setTooltipPos();
      });
    }
  }
  convertMinMaxToSlider = () => {
    this.setState(
      {
        curMinSliderValConverted: sliderBillionToMillion(
          this.state.curMinSliderVal
        ),
        curMaxSliderValConverted: sliderBillionToMillion(
          this.state.curMaxSliderVal
        ),
      },
      () => {
        this.setTooltipPos();
      }
    );
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.addedWallets !== this.state.addedWallets) {
      this.setTooltipPos();
    }
    if (
      prevState.curMinSliderVal !== this.state.curMinSliderVal ||
      prevState.curMaxSliderVal !== this.state.curMaxSliderVal
    ) {
      this.convertMinMaxToSlider();
    }
    if (
      prevState.curMinSliderVal !== this.state.curMinSliderVal ||
      prevState.curMaxSliderVal !== this.state.curMaxSliderVal ||
      prevState.userEmail !== this.state.userEmail ||
      prevState.isUserEmailSelected !== this.state.isUserEmailSelected
    ) {
      let isDis = false;
      if (
        Number(this.state.curMaxSliderVal) >
          Number(this.state.curMinSliderVal) &&
        Number(this.state.curMinSliderVal) >= 100 &&
        Number(this.state.curMaxSliderVal) <= 10000000000
      ) {
        isDis = false;
      } else {
        isDis = true;
      }

      if (isDis) {
        this.setState({
          isDisabled: true,
        });
      } else {
        if (this.state.isUserEmailSelected) {
          if (
            this.state.userEmail.length > 0 &&
            validator.isEmail(this.state.userEmail)
          ) {
            this.setState({
              isDisabled: false,
            });
          } else {
            this.setState({
              isDisabled: true,
            });
          }
        } else {
          this.setState({
            isDisabled: false,
          });
        }
      }
    }
    if (
      prevState.curMinSliderVal !== this.state.curMinSliderVal ||
      prevState.curMaxSliderVal !== this.state.curMaxSliderVal
    ) {
      this.setMaxInput();
      this.setMinInput();
    }
  }
  userEmailChange = (e) => {
    let curVal = e.target.value;
    this.setState({
      userEmail: curVal,
    });
  };
  userTelegramChange = (e) => {
    let curVal = e.target.value;
    this.setState({
      userTelegram: curVal,
    });
  };
  toggleEmailSelection = () => {
    this.setState({
      isUserEmailSelected: !this.state.isUserEmailSelected,
    });
  };
  toggleTelegramSelection = () => {
    this.setState({
      isUserTelegramSelected: !this.state.isUserTelegramSelected,
    });
  };

  changeMaxMinSlider = (value) => {
    const newMinVal = this.state.sliderConvertor[value[0]];
    const newMaxVal = this.state.sliderConvertor[value[1]];

    if (newMinVal <= newMaxVal) {
      this.setState({
        curMinSliderVal: `${newMinVal}`,
      });
    }
    if (newMaxVal >= newMinVal) {
      this.setState({
        curMaxSliderVal: `${newMaxVal}`,
      });
    }
  };
  goToWalletAddress = () => {
    goToAddress(this.props.selectedAddress);
  };
  assetList = () => {
    let data = new URLSearchParams();

    getTransactionAsset(data, this, true);
  };
  handleAssetSelected = (arr) => {
    this.setState(
      {
        selectedAssets: arr[0].name === "All" ? [] : arr.map((e) => e?.id),
      },
      () => {
        const tempIsSearchUsed = this.state.isAssetSearchUsed;
        // netflowAssetFilter({
        //   session_id: getCurrentUser().id,
        //   email_address: getCurrentUser().email,
        //   selected: arr[0] === "All" ? "All assets" : arr.map((e) => e?.name),
        //   isSearchUsed: tempIsSearchUsed,
        // });
        this.setState({ isAssetSearchUsed: false });
        this.handleBadge(this.state.selectedActiveBadge, this.state.title);
      }
    );
  };
  handleBadge = (activeBadgeList, activeFooter = this.state.title) => {
    this.setState({
      selectedActiveBadge: activeBadgeList,
      netFlowLoading: true,
      isGraphLoading: true,
    });

    let startDate = moment.utc(this.state.fromDate).add(1, "days").unix();
    let endDate = moment.utc(this.state.toDate).add(1, "days").unix();

    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

    let isDefault = true;
    if (
      (startDate.constructor === Date &&
        this.state.fromDateInitial === Date &&
        !isSameDateAs(startDate, this.state.fromDateInitial)) ||
      (endDate.constructor === Date &&
        this.state.toDateInitial === Date &&
        !isSameDateAs(endDate, this.state.toDateInitial)) ||
      this.state.selectedAssets.length > 0 ||
      selectedChains.length > 0
    ) {
      isDefault = false;
    }

    // this.props.getAssetProfitLoss(
    //   this,
    //   startDate,
    //   endDate,
    //   selectedChains,
    //   this.state.selectedAssets,
    //   isDefault
    // );

    const tempIsSearchUsed = this.state.isChainSearchUsed;
    // netflowChainFilter({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   selected: selectedChains,
    //   isSearchUsed: tempIsSearchUsed,
    // });

    this.setState({ isChainSearchUsed: false });
  };
  openPayModal = () => {
    this.setState({
      isPayModalOpen: true,
    });
  };

  onGoBackPayModal = () => {
    this.setState({
      isPayModalOpen: false,
    });
  };
  setMaxInput = () => {
    const maxInp = document.getElementById("smbSliderMaxBoxInput");
    if (maxInp && maxInp.value.length > 0) {
      maxInp.setAttribute("size", maxInp.value.length);
    }
  };
  setMinInput = () => {
    const minInp = document.getElementById("smbSliderMinBoxInput");
    if (minInp && minInp.value.length > 0) {
      minInp.setAttribute("size", minInp.value.length);
    }
  };
  maxAmountChange = (e) => {
    let curVal = e.target.value;
    curVal = curVal.replace("$", "");
    curVal = curVal.replaceAll(",", "");
    if (!isNaN(curVal) && Number(curVal) <= 10000000000) {
      this.setState(
        {
          curMaxSliderVal: curVal,
        },
        () => {
          this.setTooltipPos();
        }
      );
    }
  };
  minAmountChange = (e) => {
    e.target.setAttribute("size", e.target.value.length);
    let curVal = e.target.value;
    curVal = curVal.replace("$", "");
    curVal = curVal.replaceAll(",", "");

    if (!isNaN(curVal) && Number(curVal) <= 10000000000) {
      this.setState(
        {
          curMinSliderVal: curVal,
        },
        () => {
          this.setTooltipPos();
        }
      );
    }
  };
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
      this.getCoinBasedOnLocalWalletAddress(name, value);
    }, 1000);
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
      this.addToAddedWallets();
    }
  };
  getCoinBasedOnLocalWalletAddress = (name, value) => {
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
  isDisabledFun = (isLoading) => {
    let isDisableFlag = true;

    this.state.walletInput?.forEach((e) => {
      if (e.address) {
        if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
          e.coins.forEach((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = false;
            }
          });
        } else if (e.coins.length > 0 && !isLoading) {
          e.coins.forEach((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = false;
            }
          });
        } else {
          isDisableFlag = false;
        }
      }
    });
    if (isLoading && isDisableFlag) {
      if (this.state.walletInput.length > 1) {
        return false;
      }
    }
    return isDisableFlag;
  };
  addToAddedWallets = () => {
    let shouldAdd = true;

    this.state.addedWallets.forEach((res) => {
      if (
        (res.address &&
          this.state.walletInput[0].address &&
          res.address === this.state.walletInput[0].address) ||
        (res.apiAddress &&
          this.state.walletInput[0].apiAddress &&
          res.apiAddress === this.state.walletInput[0].apiAddress) ||
        (res.apiAddress &&
          this.state.walletInput[0].address &&
          res.apiAddress === this.state.walletInput[0].address) ||
        (res.address &&
          this.state.walletInput[0].apiAddress &&
          res.address === this.state.walletInput[0].apiAddress)
      ) {
        shouldAdd = false;
      }
    });
    if (shouldAdd) {
      this.setState(
        {
          addedWallets: [...this.state.addedWallets, this.state.walletInput[0]],
        },
        () => {
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
        }
      );
    } else {
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
    }
  };
  removeWallet = (removeThisIndex) => {
    const afterRemoved = this.state.addedWallets.filter(
      (res, resIndex) => resIndex !== removeThisIndex
    );
    this.setState({
      addedWallets: [...afterRemoved],
    });
  };
  scrollTester = () => {
    console.log("scroller");
  };
  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.props.isMobile ? "transaction-notification-mobile" : ""
        }`}
        // onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        style={{
          opacity: this.state.isPayModalOpen ? 0 : 1,
        }}
        animation={false}
      >
        {this.state.isPayModalOpen ? (
          <PaywallModal
            show={this.state.isPayModalOpen}
            onHide={this.state.onHide}
            redirectLink={BASE_URL_S3 + "/home-leaderboard"}
            title="Get transaction alerts with Loch"
            description="Unlimited transaction alerts"
            onGoBackPayModal={this.onGoBackPayModal}
          />
        ) : null}
        <Modal.Header>
          {this.state.selectedQuestion > -1 &&
          this.state.selectedQuestion < this.state.questionAnswers.length ? (
            <div onClick={this.goToQuestions} className="backiconmodal">
              <Image src={BackArrowSmartMoneyIcon} />
            </div>
          ) : null}
          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={RingingBellIcon} />
          </div>
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CrossSmartMoneyIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="sliderModalBody">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium text-center f-s-20">
                Custom Transaction Notifications
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 text-center">
                Set a custom transaction notification for
              </p>
              <div
                className="sliderModalBodyAddressBtn"
                onClick={this.goToWalletAddress}
              >
                {TruncateText(this.props.selectedAddress)}
              </div>
            </div>
            <div className="smbWalletsContainer">
              <div
                style={{
                  marginBottom: "1.5rem",
                }}
                className="inter-display-medium smbTitle"
              >
                Wallets
              </div>
              <div className="smbwInputContainer">
                <input
                  style={{
                    textAlign:
                      this.state.walletInput[0] &&
                      this.state.walletInput[0].address
                        ? "left"
                        : "",
                  }}
                  placeholder="Add an address here"
                  className={`inter-display-medium smbwInput`}
                  value={
                    (this.state.walletInput &&
                      this.state.walletInput[0] &&
                      this.state.walletInput[0].address) ||
                    ""
                  }
                  title={
                    (this.state.walletInput &&
                      this.state.walletInput[0] &&
                      this.state.walletInput[0].address) ||
                    ""
                  }
                  onChange={(e) => this.handleOnLocalChange(e)}
                  onKeyDown={this.handleTopBarInputKeyDown}
                  name={`wallet${1}`}
                  autoComplete="off"
                />
                {/* <div className="inter-display-medium smbwInputBtn">Add</div> */}
                {this.state.walletInput &&
                this.state.walletInput[0] &&
                this.state.walletInput[0].address ? (
                  <CustomButton
                    className="primary-btn go-btn main-button-invert smbwInputBtn"
                    type="submit"
                    buttonText="Add"
                    handleClick={this.addToAddedWallets}
                    isLoading={
                      (this.state.addButtonVisible
                        ? this.isDisabledFun(true)
                        : false) || this.state.loadAddBtn
                    }
                    isDisabled={
                      (this.state.addButtonVisible
                        ? this.isDisabledFun()
                        : true) || this.state.loadAddBtn
                    }
                  />
                ) : null}
              </div>
              {this.state.addedWallets && this.state.addedWallets.length > 0 ? (
                <div className="smbwAddedWalletBlock">
                  <div
                    style={{
                      marginTop: "2rem",
                    }}
                    className="inter-display-medium smbTitle"
                  >
                    Added wallets
                  </div>
                  <div className="smbwAddedWalletContainer">
                    {this.state.addedWallets.map((wallet, index) => {
                      return (
                        <div
                          onClick={() => {
                            this.removeWallet(index);
                          }}
                          className="inter-display-medium smbwAddedWalletItem"
                        >
                          {wallet.address}
                          <Image
                            className="smbwAddedWalletCross"
                            src={CrossTransactionNotificationWalletIcon}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="smbSliderContainer">
              <div className="smbSlider">
                <div
                  style={{
                    marginBottom: "6rem",
                  }}
                  className="inter-display-medium smbTitle"
                >
                  Range
                </div>
                <div
                  style={{
                    position: "fixed",
                  }}
                  id="smbSliderMinBox"
                  className="inter-display-medium smbSliderMinMaxBox"
                >
                  <span>
                    {this.state.curMinSliderVal &&
                    this.state.curMinSliderVal.length > 0
                      ? `$${amountFormat(
                          this.state.curMinSliderVal,
                          "en-US",
                          "USD",
                          0,
                          0
                        )}`
                      : ""}
                  </span>
                  <div className="smbSliderMinMaxBoxArrow" />
                  {/* 
                  <input
                    id="smbSliderMinBoxInput"
                    className="smbSliderMinMaxBoxInput"
                    value={
                      this.state.curMinSliderVal &&
                      this.state.curMinSliderVal.length > 0
                        ? `$${amountFormat(
                            this.state.curMinSliderVal,
                            "en-US",
                            "USD",
                            0,
                            0
                          )}`
                        : ""
                    }
                    onChange={this.minAmountChange}
                  /> */}
                </div>
                <div
                  style={{
                    position: "fixed",
                  }}
                  id="smbSliderMaxBox"
                  className="inter-display-medium smbSliderMinMaxBox"
                >
                  <span>
                    {this.state.curMaxSliderVal &&
                    this.state.curMaxSliderVal.length > 0
                      ? `$${amountFormat(
                          this.state.curMaxSliderVal,
                          "en-US",
                          "USD",
                          0,
                          0
                        )}`
                      : ""}
                  </span>
                  <div className="smbSliderMinMaxBoxArrow" />
                  {/* <input
                    id="smbSliderMaxBoxInput"
                    className="smbSliderMinMaxBoxInput"
                    value={
                      this.state.curMaxSliderVal &&
                      this.state.curMaxSliderVal.length > 0
                        ? `$${amountFormat(
                            this.state.curMaxSliderVal,
                            "en-US",
                            "USD",
                            0,
                            0
                          )}`
                        : ""
                    }
                    onChange={this.maxAmountChange}
                  /> */}
                </div>
                <Slider
                  role="tooltip"
                  range
                  min={0}
                  max={8}
                  step={1}
                  value={[
                    this.state.curMinSliderValConverted,
                    this.state.curMaxSliderValConverted,
                  ]}
                  tooltipVisible={true}
                  onChange={this.changeMaxMinSlider}
                />
                <div className="smbSlidervalueContainer inter-display-medium">
                  <div className="smbSlidervalues">$100</div>
                  <div className="smbSlidervalues">$10B</div>
                </div>
              </div>
              <div className="smbsAssetDropdownContainer">
                <div className="inter-display-medium smbTitle">Asset type</div>
                <CustomDropdown
                  keepInCenter
                  filtername="All assets"
                  options={this.state.AssetList}
                  selectedTokens={this.props.selectedAssets}
                  action={null}
                  handleClick={this.handleAssetSelected}
                  // isChain={true}
                  LightTheme={true}
                  placeholderName={"asset"}
                  getObj
                  searchIsUsed={this.props.assetSearchIsUsed}

                  // selectedTokens={this.state.activeBadge}
                />
              </div>
              <div className="smbsInputContainer">
                <div
                  style={{
                    marginBottom: "0rem",
                  }}
                  className="inter-display-medium smbTitle"
                >
                  Notification type
                </div>
                <div className="smbsInputBlock">
                  <div className="smbsInputBlockInfo">
                    <CheckboxCustomTable
                      dontSelectIt
                      handleOnClick={this.toggleEmailSelection}
                      isChecked={this.state.isUserEmailSelected}
                    />
                    <Image
                      src={CustomTransactionMailIcon}
                      className="smbsInputBlockInfoImage"
                    />
                    <div className="inter-display-medium smbsInputBlockInfoTitle">
                      Email
                    </div>
                  </div>
                  <input
                    disabled={!this.state.isUserEmailSelected}
                    placeholder="Enter your email address here"
                    className={`inter-display-medium smbsInput ${
                      this.state.isUserEmailSelected ? "" : "smbsInputDisabled"
                    }`}
                    value={this.state.userEmail}
                    onChange={this.userEmailChange}
                  />
                </div>
                <div className="smbsInputBlock">
                  <div className="smbsInputBlockInfo">
                    <CheckboxCustomTable
                      dontSelectIt
                      handleOnClick={this.toggleTelegramSelection}
                      isChecked={this.state.isUserTelegramSelected}
                    />
                    <Image
                      src={CustomTransactionTelegramIcon}
                      className="smbsInputBlockInfoImage"
                    />
                    <div className="inter-display-medium smbsInputBlockInfoTitle">
                      Telegram
                    </div>
                  </div>
                  <input
                    disabled={!this.state.isUserTelegramSelected}
                    placeholder="Enter your telegram handle here"
                    className={`inter-display-medium smbsInput ${
                      this.state.isUserTelegramSelected
                        ? ""
                        : "smbsInputDisabled"
                    }`}
                    value={this.state.userTelegram}
                    onChange={this.userTelegramChange}
                  />
                </div>
              </div>
            </div>
            <div className="smbButtonContainer">
              <Button
                className="secondary-btn white-bg btn-bg-white-outline-black hover-bg-black"
                onClick={this.state.onHide}
              >
                Cancel
              </Button>
              <CustomButton
                className="primary-btn go-btn main-button-invert"
                type="submit"
                buttonText="Confirm"
                handleClick={this.openPayModal}
                isDisabled={this.state.isDisabled}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  InflowOutflowAssetListState: state.InflowOutflowAssetListState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  isNewAddress,
  detectCoin,
};

NotifyOnTransactionSizeModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyOnTransactionSizeModal);
