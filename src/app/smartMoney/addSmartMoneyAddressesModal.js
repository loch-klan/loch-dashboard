import React from "react";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import { getAllCoins, detectCoin, getAllParentChains } from "../onboarding/Api";

import {
  CloseIcon,
  TrophyCelebrationIcon,
  TrophyIcon,
  WarningCircleIcon,
} from "../../assets/images/icons";
import { CustomCoin } from "../../utils/commonComponent";
import { BaseReactComponent, CustomButton } from "../../utils/form";
import AddSmartMoneyAddressesModalMessagesBox from "./addSmartMoneyAddressesModalMessagesBox";
import AddSmartMoneyAddressesModalInputBox from "./addSmartMoneyAddressesModalInputBox";
import {
  addSmartMoney,
  smartMoneySignUpApi,
  smartMoneySignInApi,
  VerifySmartMoneyEmailOtp,
} from "./Api";
import { setPageFlagDefault } from "../common/Api";
import { toast } from "react-toastify";
import validator from "validator";
import { mobileCheck } from "../../utils/ReusableFunctions";

class AddSmartMoneyAddressesModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      verificationOtp: "",
      showVerifyEmail: false,
      loadingVerificationOtpBtn: false,
      showSignUpPage: false,
      showSignInPage: this.props.signInVar,
      showSignInErrorMessage: false,
      showSignUpErrorMessage: false,
      disableSignUpBtn: true,
      disableSignInBtn: true,
      signInEmailId: "",
      signUpEmailId: "",
      loadingSignInBtn: false,
      loadingSignUpBtn: false,
      show: props.show,
      onHide: this.props.onHide,
      blurTable: this.props.blurTable,
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
          loadAddBtn: false,
        },
      ],
      addressAdded: false,
      addressAlreadyPresent: false,
      addressNotOneMil: false,
    };
  }
  componentDidMount() {
    this.props.getAllCoins();
    this.props.getAllParentChains();
    //  this.makeApiCall();
    // getAllWalletApi(this);
    // getDetectedChainsApi(this);
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
  handleOnChange = (e) => {
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
      this.getCoinBasedOnWalletAddress(name, value);
    }, 1000);
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
  nicknameOnChain = (e) => {
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
  hideModal = () => {
    this.state.onHide();
  };
  isDisabled = (isLoading) => {
    let isDisableFlag = true;

    this.state.walletInput?.forEach((e) => {
      if (e.address) {
        if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
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
  showAddressAdded = () => {
    this.setState({
      addButtonVisible: false,
      loadAddBtn: true,
    });
    let data = new URLSearchParams();
    const tempItem = this.state.walletInput[0];
    data.append("address", tempItem.address);
    data.append("name_tag", tempItem.nickname);

    this.props.addSmartMoney(data, this, tempItem.address, tempItem.nickname);
    // this.setState({
    //   addressAdded: true,
    //   addressAlreadyPresent: false,
    //   addressNotOneMil: false,
    // });
  };
  showAccountAdreadyAdded = () => {
    this.setState({
      addressAlreadyPresent: true,
      showSignUpPage: false,
      showVerifyEmail: false,
      showSignInPage: false,
      addressAdded: false,
      addressNotOneMil: false,
    });
  };
  showDefaultView = () => {
    this.setState({
      showSignUpPage: false,
      showVerifyEmail: false,
      showSignInPage: false,
      addressAdded: false,
      addressAlreadyPresent: false,
      addressNotOneMil: false,
    });
  };
  onSignUp = () => {
    this.setState({
      disableSignUpBtn: true,
      loadingSignUpBtn: true,
    });
    const url = new URLSearchParams();
    url.append("email", this.state.signUpEmailId);
    url.append("signed_up_from", "leaving");
    if (!this.props.fromInsideHome) {
      url.append("type", "smart-money");
    }
    this.props.smartMoneySignUpApi(this, url, this.state.signUpEmailId);
  };
  onVerifyOtp = () => {
    this.setState({
      loadingVerificationOtpBtn: true,
    });
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.signInEmailId ? this.state.signInEmailId.toLowerCase() : ""
    );
    data.append("otp_token", this.state.verificationOtp);
    data.append("signed_up_from", "smart money");
    this.props.VerifySmartMoneyEmailOtp(
      data,
      this,
      this.state.signInEmailId,
      false
    );
  };
  emailIsVerified = () => {
    this.hideModal();
    toast.success(`Email verified`);
  };
  onSignIn = () => {
    this.setState({
      disableSignInBtn: true,
      loadingSignInBtn: true,
    });

    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.signInEmailId ? this.state.signInEmailId.toLowerCase() : ""
    );
    this.props.smartMoneySignInApi(data, this);
  };
  handleSuccesfulSignIn = () => {
    this.setState({
      showVerifyEmail: true,
      showSignUpPage: false,
      showSignInPage: false,
      addressAdded: false,
      addressAlreadyPresent: false,
      addressNotOneMil: false,
    });
  };
  handleSignInError = () => {
    this.setState({
      disableSignInBtn: false,
      loadingSignInBtn: false,
    });
  };
  handleSuccesfulSignUp = () => {
    this.hideModal();
    toast.success(
      <div className="custom-toast-msg">
        <div>Successful</div>
        <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
          Please check your mailbox for the verification link
        </div>
      </div>
    );
  };
  handleSignUpError = () => {
    this.setState({
      disableSignUpBtn: false,
      loadingSignUpBtn: false,
    });
  };
  handleOnVerifyOtpChange = (e) => {
    let { value } = e.target;
    this.setState({
      verificationOtp: value,
    });
  };
  handleOnSignUpChange = (e) => {
    let { value } = e.target;
    this.setState(
      {
        signUpEmailId: value,
        showSignUpErrorMessage: false,
      },
      () => {
        if (
          this.state.signUpEmailId &&
          validator.isEmail(this.state.signUpEmailId)
        ) {
          this.setState({
            disableSignUpBtn: false,
          });
        } else {
          this.setState({
            disableSignUpBtn: true,
          });
        }
      }
    );
  };
  handleOnSignInChange = (e) => {
    let { value } = e.target;
    this.setState(
      {
        signInEmailId: value,
        showSignInErrorMessage: false,
      },
      () => {
        if (
          this.state.signInEmailId &&
          validator.isEmail(this.state.signInEmailId)
        ) {
          this.setState({
            disableSignInBtn: false,
          });
        } else {
          this.setState({
            disableSignInBtn: true,
          });
        }
      }
    );
  };
  handleOnSignUpEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        this.state.signUpEmailId &&
        validator.isEmail(this.state.signUpEmailId)
      ) {
        this.onSignUp();
      } else {
        this.setState({
          showSignUpErrorMessage: true,
        });
      }
    }
  };
  handleOnVerificationEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.onVerifyOtp();
    }
  };
  handleOnSignInEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        this.state.signInEmailId &&
        validator.isEmail(this.state.signInEmailId)
      ) {
        this.onSignIn();
      } else {
        this.setState({
          showSignInErrorMessage: true,
        });
      }
    }
  };
  showSignUpModal = () => {
    if (this.state.blurTable) {
      this.setState({
        showSignUpPage: true,
        showVerifyEmail: false,
        showSignInPage: false,
        addressAdded: false,
        addressAlreadyPresent: false,
        addressNotOneMil: false,
      });
    } else {
      this.hideModal();
    }
  };
  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        {this.state.showVerifyEmail ? (
          <AddSmartMoneyAddressesModalInputBox
            inputPlaceholder="Enter Verification Code"
            btnClick={this.onVerifyOtp}
            heading="Verify email"
            descriptionOne="Enter the verification code sent to your email to sign in your account"
            btnText="Verify"
            hideModal={this.hideModal}
            handleEnterPress={this.handleOnVerificationEnterPress}
            handleOnChange={this.handleOnVerifyOtpChange}
            // showErrorMessage={this.state.showSignUpErrorMessage}
            disableBtn={!this.state.verificationOtp}
            inputVal={this.state.verificationOtp}
            loadingBtn={this.state.loadingVerificationOtpBtn}
          />
        ) : null}
        {this.state.showSignInPage ? (
          <AddSmartMoneyAddressesModalInputBox
            inputPlaceholder="john@loch.one"
            btnClick={this.onSignIn}
            heading="Sign in"
            descriptionOne="Get right back into your account"
            btnText="Send verification"
            hideModal={this.hideModal}
            handleEnterPress={this.handleOnSignInEnterPress}
            handleOnChange={this.handleOnSignInChange}
            showErrorMessage={this.state.showSignInErrorMessage}
            disableBtn={this.state.disableSignInBtn}
            inputVal={this.state.signInEmailId}
            loadingBtn={this.state.loadingSignInBtn}
          />
        ) : null}
        {this.state.showSignUpPage ? (
          <AddSmartMoneyAddressesModalInputBox
            inputPlaceholder="john@loch.one"
            btnClick={this.onSignUp}
            heading="Verify your email"
            descriptionOne="Verify your email so you can view the leaderboard anytime you want."
            btnText="Confirm"
            hideModal={this.hideModal}
            handleEnterPress={this.handleOnSignUpEnterPress}
            handleOnChange={this.handleOnSignUpChange}
            showErrorMessage={this.state.showSignUpErrorMessage}
            disableBtn={this.state.disableSignUpBtn}
            inputVal={this.state.signUpEmailId}
            loadingBtn={this.state.loadingSignUpBtn}
            hideCrossBtn
          />
        ) : null}
        {this.state.addressAdded ? (
          <AddSmartMoneyAddressesModalMessagesBox
            btnClick={this.showSignUpModal}
            heading="Congratulations"
            descriptionOne="This unique address is worth more than $10K"
            btnText="Done"
            imageIcon={TrophyCelebrationIcon}
            bodyImageClass="addCommunityTopAccountsAddedBodyLargerIcon"
            hideModal={this.hideModal}
          />
        ) : null}
        {this.state.addressAlreadyPresent ? (
          <AddSmartMoneyAddressesModalMessagesBox
            btnClick={this.showDefaultView}
            heading="Sorry this address has already been added"
            descriptionOne="Please try to add another address."
            btnText="Add another"
            imageIcon={WarningCircleIcon}
            hideModal={this.hideModal}
          />
        ) : null}
        {this.state.addressNotOneMil ? (
          <AddSmartMoneyAddressesModalMessagesBox
            btnClick={this.showDefaultView}
            heading="Sorry this address is not worth at least $10K"
            descriptionOne="Please try to add another address."
            btnText="Add another"
            imageIcon={WarningCircleIcon}
            hideModal={this.hideModal}
          />
        ) : null}
        <Modal.Header>
          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={TrophyIcon} />
          </div>
          <div className="closebtn" onClick={this.hideModal}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="addCommunitySmartMoneyWrapperParent">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium text-center f-s-25">
                Contribute to the community
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Add a unique address worth at least $10k
              </p>
            </div>

            <div className="addCommunityTopAccountsWrapperContainer">
              {this.state.walletInput?.map((c, index) => {
                return (
                  <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                    <div
                      className={`awInputWrapper ${
                        this.state.walletInput[index].address
                          ? "isAwInputWrapperValid"
                          : null
                      }`}
                    >
                      <>
                        {c.showAddress && (
                          <div className="awTopInputWrapper">
                            <div className="awInputContainer">
                              <input
                                autoFocus
                                name={`wallet${index + 1}`}
                                value={c.address || ""}
                                className={`inter-display-regular f-s-15 lh-20 awInput`}
                                placeholder="Paste wallet address or ENS here"
                                title={c.address || ""}
                                onChange={(e) => this.handleOnChange(e)}
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
                        {c.coinFound && c.showNickname && (
                          <div
                            className={`awBottomInputWrapper ${
                              c.showAddress ? "mt-2" : ""
                            }`}
                          >
                            <div className="awInputContainer">
                              {/* <div className="awLable">Nickname</div> */}
                              <input
                                name={`wallet${index + 1}`}
                                value={c.nickname || ""}
                                className={`inter-display-regular f-s-15 lh-20 awInput`}
                                placeholder="Enter nametag"
                                title={c.nickname || ""}
                                onChange={(e) => {
                                  this.nicknameOnChain(e);
                                }}
                                onBlur={(e) => {
                                  // LandingPageNickname({
                                  //   session_id: getCurrentUser().id,
                                  //   email_address: getCurrentUser().email,
                                  //   nickname: e.target?.value,
                                  //   address: c.address,
                                  // });
                                }}
                                onFocus={(e) => {
                                  this.FocusInInput(e);
                                }}
                              />
                            </div>
                            {!c.showAddress &&
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
                            {/* {c.showNameTag && c.nameTag ? (
                                <div className="awBlockContainer">
                                  <div className="awLable">Name tag</div>
                                  <div className="awNameTag">{c.nameTag}</div>
                                </div>
                              ) : null} */}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="watchListAddressBtnContainer">
              <Button
                className="secondary-btn white-bg"
                onClick={this.hideModal}
              >
                Cancel
              </Button>
              <CustomButton
                className="primary-btn go-btn"
                type="submit"
                isLoading={
                  this.state.loadAddBtn ||
                  (this.state.addButtonVisible ? this.isDisabled(true) : false)
                }
                isDisabled={
                  this.state.addButtonVisible ? this.isDisabled() : true
                }
                buttonText="Add"
                handleClick={this.showAddressAdded}
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
  addSmartMoney,
  smartMoneySignUpApi,
  smartMoneySignInApi,
  setPageFlagDefault,
  VerifySmartMoneyEmailOtp,
};

AddSmartMoneyAddressesModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSmartMoneyAddressesModal);
