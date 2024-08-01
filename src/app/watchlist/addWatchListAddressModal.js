import React from "react";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../onboarding//Api";

import { detectNameTag } from "../common/Api";
import { EyeIcon, CloseIcon, CheckIcon } from "../../assets/images/icons";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import { CustomCoin } from "../../utils/commonComponent";
import { CustomButton } from "../../utils/form";
import { getPadding, mobileCheck } from "../../utils/ReusableFunctions";
import { addAddressToWatchList } from "./redux/WatchListApi";
import { START_INDEX } from "../../utils/Constant";
import { WatchlistAddAddress } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

class AddWatchListAddressModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      show: props.show,
      onHide: this.props.onHide,
      loadAddBtn: false,
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
        },
      ],
      addressesAdded: false,
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
  addAddressToWatchListFun = () => {
    if (this.state.walletInput.length > 0) {
      const tempWalletAddress = this.state.walletInput[0].address
        ? this.state.walletInput[0].address
        : "";
      const tempNameTag = this.state.walletInput[0].nameTag
        ? this.state.walletInput[0].nameTag
        : "";
      this.setState({
        loadAddBtn: true,
      });
      const data = new URLSearchParams();
      data.append("wallet_address", tempWalletAddress);
      data.append("type", "self");
      data.append("name_tag", tempNameTag);
      this.props.addAddressToWatchList(
        data,
        this,
        tempWalletAddress,
        tempNameTag
      );
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
                    You are now following this address
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
            <Image src={EyeIcon} className="" />
          </div>
          <div className="closebtn" onClick={this.hideModal}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="addWatchListWrapperParent">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium f-s-25">
                Add an address to follow
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Keep an eye on an address
              </p>
            </div>

            <div className="addWatchListWrapperContainer">
              {this.state.walletInput?.map((elem, index) => {
                return (
                  <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                    <div
                      className={`awInputWrapper ${
                        elem.address ? "isAwInputWrapperValid" : null
                      }`}
                    >
                      {elem.showAddress && (
                        <div className="awTopInputWrapper input-noshadow-dark">
                          <div className="awInputContainer">
                            <input
                              autoFocus
                              name={`wallet${index + 1}`}
                              value={elem.displayAddress || elem.address || ""}
                              placeholder="Paste any wallet address or ENS here"
                              // className='inter-display-regular f-s-16 lh-20'
                              className={`inter-display-regular f-s-16 lh-20 awInput`}
                              onChange={(e) => this.handleOnchange(e)}
                              id={elem.id}
                              style={getPadding(
                                `add-wallet-${index}`,
                                elem,
                                this.props.OnboardingState
                              )}
                              autoComplete="off"
                              onKeyDown={this.handleTabPress}
                              onFocus={(e) => {
                                // console.log(e);
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
                          {/* <div className="awInputContainer">
                            <div className="awLable">Nickname</div>
                            <input
                              // autoFocus
                              name={`wallet${index + 1}`}
                              value={elem.nickname || ""}
                              placeholder="Enter Nickname"
                              // className='inter-display-regular f-s-16 lh-20'
                              className={`inter-display-regular f-s-16 lh-20 awInput`}
                              onChange={(e) => this.handleOnchangeNickname(e)}
                              id={elem.id}
                              style={getPadding(
                                `add-wallet-${index}`,
                                elem,
                                this.props.OnboardingState
                              )}
                              onFocus={(e) => {
                                // console.log(e);
                                this.FocusInInput(e);
                              }}
                              onBlur={(e) => {
                                // AddWalletAddressNickname({
                                //   session_id: getCurrentUser().id,
                                //   email_address: getCurrentUser().email,
                                //   nickname: e.target?.value,
                                //   address: elem.address,
                                // });
                                if (this.props.updateTimer) {
                                  this.props.updateTimer();
                                }
                              }}
                            />
                          </div> */}
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
                          {elem.showAddress && elem.loadingNameTag ? (
                            <div className="awBlockContainer">
                              <div className="awLable">Public Nametag</div>
                              <CustomCoin
                                isStatic
                                coins={null}
                                isLoaded={false}
                              />
                            </div>
                          ) : null}
                          {elem.showAddress &&
                          elem.showNameTag &&
                          elem.nameTag &&
                          !elem.loadingNameTag ? (
                            <div className="awBlockContainer">
                              <div className="awLable">Public Nametag</div>
                              <div className="awNameTag">{elem.nameTag}</div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="watchListAddressBtnContainer">
              <Button
                className="secondary-btn white-bg btn-bg-white-outline-black hover-bg-black"
                onClick={this.hideModal}
              >
                Cancel
              </Button>
              <CustomButton
                className="primary-btn go-btn main-button-invert"
                type="submit"
                isLoading={
                  (this.state.addButtonVisible
                    ? this.isDisabled(true)
                    : false) || this.state.loadAddBtn
                }
                isDisabled={
                  (this.state.addButtonVisible ? this.isDisabled() : true) ||
                  this.state.loadAddBtn
                }
                buttonText="Add"
                handleClick={this.addAddressToWatchListFun}
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
  addAddressToWatchList,
};

AddWatchListAddressModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddWatchListAddressModal);
