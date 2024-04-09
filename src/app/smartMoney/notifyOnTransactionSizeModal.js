import React, { useState } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BackArrowSmartMoneyIcon,
  CrossSmartMoneyIcon,
  RingingBellIcon,
} from "../../assets/images/icons";
import {
  TruncateText,
  goToAddress,
  isSameDateAs,
} from "../../utils/ReusableFunctions";
import { BaseReactComponent, CustomButton } from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdownPrice";
import moment from "moment";
import { getTransactionAsset } from "../intelligence/Api";
import EmulationsPaywall from "../Emulations/EmulationsPaywall.js";
import EmulationsPaywallOptions from "../Emulations/EmulationsPaywallOptions.js";

class NotifyOnTransactionSizeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: props.onHide,
      minSliderVal: null,
      maxSliderVal: null,
      curMinSliderVal: "0.01",
      curMaxSliderVal: "1000000000",
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
    };
  }
  componentDidMount() {
    this.assetList();
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
    this.setState({
      userDetailsState: userDetails,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.curMinSliderVal !== this.state.curMinSliderVal ||
      prevState.curMaxSliderVal !== this.state.curMaxSliderVal
    ) {
      if (
        Number(this.state.curMinSliderVal) > Number(this.state.curMaxSliderVal)
      ) {
        this.setState({
          isDisabled: true,
        });
      } else {
        this.setState({
          isDisabled: false,
        });
      }
    }
  }
  minAmountChange = (e) => {
    let curVal = e.target.value;
    curVal = curVal.replace("$", "");
    if (!isNaN(curVal)) {
      this.setState({
        curMinSliderVal: curVal,
      });
    }
  };
  maxAmountChange = (e) => {
    let curVal = e.target.value;
    curVal = curVal.replace("$", "");
    if (!isNaN(curVal)) {
      this.setState({
        curMaxSliderVal: curVal,
      });
    }
  };
  changeMaxMinSlider = (value) => {
    const newMinVal = value[0];
    const newMaxVal = value[1];

    if (newMinVal <= newMaxVal) {
      this.setState({
        curMinSliderVal: `${value[0] === 0 ? 0.01 : value[0]}`,
      });
    }
    if (newMaxVal >= newMinVal) {
      this.setState({
        curMaxSliderVal: `${value[1]}`,
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
  openPayOptionsModal = () => {
    // CopyTradePayWallOptionsOpen({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
    this.setState(
      {
        isPayModalOpen: false,
      },
      () => {
        this.setState({
          isPayModalOptionsOpen: true,
        });
      }
    );
  };
  openPayModal = (emailHolder, walletHolder, amountHolder) => {
    // CopyTradePayWallOpen({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
    this.setState(
      {
        passedCTNotificationEmailAddress: emailHolder,
        passedCTAddress: walletHolder,
        passedCTCopyTradeAmount: amountHolder,
      },
      () => {
        this.setState({
          isPayModalOpen: true,
        });
      }
    );
  };
  goBackToPayWall = () => {
    this.setState({
      isPayModalOptionsOpen: false,
      isPayModalOpen: true,
    });
  };
  goBackToAddCopyTradeModal = () => {
    this.setState({
      isPayModalOpen: false,
    });
  };
  closePayModal = () => {
    this.hideAddCopyTradeAddress();
    this.setState({
      isPayModalOpen: false,
      isPayModalOptionsOpen: false,
    });
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
      >
        {this.state.isPayModalOpen ? (
          <EmulationsPaywall
            userDetailsState={this.state.userDetailsState}
            show={this.state.isPayModalOpen}
            onHide={this.closePayModal}
            passedCTNotificationEmailAddress={
              this.state.passedCTNotificationEmailAddress
            }
            passedCTAddress={this.state.passedCTAddress}
            passedCTCopyTradeAmount={this.state.passedCTCopyTradeAmount}
            goBackToAddCopyTradeModal={this.goBackToAddCopyTradeModal}
            goToPayWallOptions={this.openPayOptionsModal}
          />
        ) : null}
        {this.state.isPayModalOptionsOpen ? (
          <EmulationsPaywallOptions
            userDetailsState={this.state.userDetailsState}
            show={this.state.isPayModalOptionsOpen}
            onHide={this.closePayModal}
            passedCTNotificationEmailAddress={
              this.state.passedCTNotificationEmailAddress
            }
            passedCTAddress={this.state.passedCTAddress}
            passedCTCopyTradeAmount={this.state.passedCTCopyTradeAmount}
            goBackToPayWall={this.goBackToPayWall}
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
              <h6 className="inter-display-medium text-center f-s-25">
                Notify on transaction size
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Notify me when{" "}
                <span
                  className="sliderModalBodyAddressBtn"
                  onClick={this.goToWalletAddress}
                >
                  {TruncateText(this.props.selectedAddress)}
                </span>{" "}
                makes a<br />
                transaction worth more than
              </p>
            </div>
            <div className="smbSliderContainer">
              <div className="smbsAssetDropdownContainer">
                <CustomDropdown
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
                <input
                  placeholder="min"
                  className="inter-display-medium smbsInput"
                  value={
                    this.state.curMinSliderVal &&
                    this.state.curMinSliderVal.length > 0
                      ? `$${this.state.curMinSliderVal}`
                      : ""
                  }
                  onChange={this.minAmountChange}
                />
                <input
                  placeholder="max"
                  className="inter-display-medium smbsInput"
                  value={
                    this.state.curMaxSliderVal &&
                    this.state.curMaxSliderVal.length > 0
                      ? `$${this.state.curMaxSliderVal}`
                      : ""
                  }
                  onChange={this.maxAmountChange}
                  style={{
                    textAlign: "right",
                  }}
                />
              </div>
              <Slider
                range
                min={0}
                max={10000000000}
                step={10000}
                value={[this.state.curMinSliderVal, this.state.curMaxSliderVal]}
                onChange={this.changeMaxMinSlider}
              />

              <div className="smbSlidervalueContainer inter-display-medium">
                <div className="smbSlidervalues">$0.01</div>
                <div className="smbSlidervalues">$10b</div>
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
const mapDispatchToProps = {};

NotifyOnTransactionSizeModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyOnTransactionSizeModal);
