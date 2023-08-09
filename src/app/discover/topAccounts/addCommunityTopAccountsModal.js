import React from "react";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../../onboarding/Api";

import {
  CloseIcon,
  TrophyIcon,
  TrophyCelebrationIcon,
  WarningCircleIcon,
} from "../../../assets/images/icons";
import BaseReactComponent from "./../../../utils/form/BaseReactComponent";
import { CustomCoin } from "../../../utils/commonComponent";
import { CustomButton } from "../../../utils/form";
import AddCommunityTopAccountsModalMessagesBox from "./addCommunityTopAccountsModalMessagesBox";

class AddCommunityTopAccountsModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: this.props.onHide,
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
    console.log("parentCoinList is ", parentCoinList);
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
      addressAdded: true,
      addressAlreadyPresent: false,
      addressNotOneMil: false,
    });
  };
  showAccountAdreadyAdded = () => {
    this.setState({
      addressAdded: false,
      addressAlreadyPresent: true,
      addressNotOneMil: false,
    });
  };
  showDefaultView = () => {
    this.setState({
      addressAdded: false,
      addressAlreadyPresent: false,
      addressNotOneMil: false,
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
        {this.state.addressAdded ? (
          <AddCommunityTopAccountsModalMessagesBox
            btnClick={this.hideModal}
            heading="Thanks for your contribution!"
            descriptionOne="Thanks for adding your address, you may now view the full"
            descriptionTwo="Loch leaderboard"
            btnText="View"
            imageIcon={TrophyCelebrationIcon}
            bodyImageClass="addCommunityTopAccountsAddedBodyLargerIcon"
            hideModal={this.hideModal}
          />
        ) : null}
        {this.state.addressAlreadyPresent ? (
          <AddCommunityTopAccountsModalMessagesBox
            btnClick={this.showDefaultView}
            heading="Sorry this address has already been added."
            descriptionOne="Please try to add another address!"
            btnText="Add another"
            imageIcon={WarningCircleIcon}
            hideModal={this.hideModal}
          />
        ) : null}
        {this.state.addressNotOneMil ? (
          <AddCommunityTopAccountsModalMessagesBox
            btnClick={this.showDefaultView}
            heading="Sorry this address is not worth at least $1m."
            descriptionOne="Please try to add another address!"
            btnText="Add another"
            imageIcon={WarningCircleIcon}
            hideModal={this.hideModal}
          />
        ) : null}
        <Modal.Header>
          <div className="api-modal-header">
            <Image src={TrophyIcon} />
          </div>
          <div className="closebtn" onClick={this.hideModal}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="addCommunityTopAccountsWrapperParent">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium f-s-25">
                Contribute to the community
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Add an address to the community board
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
                                onKeyDown={this.handleTabPress}
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
                                placeholder="Enter nickname"
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
                onClick={this.showAccountAdreadyAdded}
              >
                Cancel
              </Button>
              <CustomButton
                className="primary-btn go-btn"
                type="submit"
                isLoading={
                  this.state.addButtonVisible ? this.isDisabled(true) : false
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
};

AddCommunityTopAccountsModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCommunityTopAccountsModal);
