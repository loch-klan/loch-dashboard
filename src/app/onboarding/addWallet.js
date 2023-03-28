import React from 'react';
import {BaseReactComponent, Form} from "../../utils/form";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import { getAllCoins, detectCoin, createAnonymousUserApi, getAllParentChains} from "./Api";
import CustomChip from "../../utils/commonComponent/CustomChip";
import { getPadding } from '../../utils/ReusableFunctions';
import {
  DeleteWalletAddress,
  PreviewDemo,
  AddTextbox,
  LPC_Go,
  LandingPagePodName,
  LandingPageNickname,
  AddWalletAddress,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from '../../utils/ManageToken';
import UpgradeModal from '../common/upgradeModal';
import { GetAllPlan, GetDefaultPlan, updateUserWalletApi } from '../common/Api';
import LinkIconBtn from "../../assets/images/link.svg";

class AddWallet extends BaseReactComponent {
  constructor(props) {
    super(props);
    console.log("walletAddress", props.walletAddress);
    this.state = {
      showModal: true,
      signIn: false,
      addButtonVisible: false,
      pageName: "Landing Page",
      walletInput: props.walletAddress
        ? props.walletAddress
        : [
            {
              id: "wallet1",
              address: "",
              coins: [],
              nickname: "",
              showAddress: true,
              showNickname: true,
            },
          ],
      loading: false,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      GoToHome: false,
      connectExchange: true,
      deletedAddress: [],
    };
    this.timeout = 0;
  }

  // upgradeModal = () => {

  //   this.setState({
  //     upgradeModal: !this.state.upgradeModal,
  //   }, () => {
  //     let value = this.state.upgradeModal ? false : true;
  //     this.props.hideModal(value);
  //     // console.log("eejbhf")
  //     const userDetails = JSON.parse(localStorage.getItem("lochUser"));
  //     if (userDetails) {
  //       this.props.history.push("/home")
  //     }

  //   });

  // };

  componentDidMount() {
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
    });
    if (this.props.exchanges) {
      let text = "";

      Promise.all(
        this.props.exchanges
          ?.filter((e) => e.isActive)
          .map(
            (e) => (text = text == "" ? text + e.name : text + ", " + e.name)
          )
      ).then(() => {
        this.setState({
          connectText: text == "" ? "Connect exchanges" : text + " connected",
        });
      });
    } else {
      this.setState({
        connectText: "Connect exchanges",
      });
    }
    this.props.getAllCoins();
    this.props.getAllParentChains();
    this.setState({
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });

    GetAllPlan();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userPlan === null) {
      this.state.userPlan = JSON.parse(localStorage.getItem("currentPlan"));
    }
  }

  nicknameOnChain = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;
      // console.log(prevValue)
      walletCopy[foundIndex].nickname = value;

      // walletCopy[foundIndex].trucatedAddress = value
    }
    // console.log(walletCopy)
    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  FocusOutInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;

      walletCopy[foundIndex].showAddress =
        walletCopy[foundIndex].nickname === "" ? true : false;
      walletCopy[foundIndex].showNickname =
        walletCopy[foundIndex].nickname === "" ? false : true;

      // walletCopy[foundIndex].trucatedAddress = value
    }
    // console.log(walletCopy)
    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  FocusInInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    // if (foundIndex > -1) {
    //   // let prevValue = walletCopy[foundIndex].nickname;
    //   // console.log(prevValue)
    //   walletCopy[foundIndex].showAddress = true;
    //   walletCopy[foundIndex].showNickname = true;

    //   // walletCopy[foundIndex].trucatedAddress = value
    // }
    walletCopy?.map((address, i) => {
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
    // console.log(walletCopy)
    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  handleOnChange = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      let prevValue = walletCopy[foundIndex].address;
      // console.log(prevValue)
      walletCopy[foundIndex].address = value;
      if (value === "" || prevValue !== value) {
        walletCopy[foundIndex].coins = [];
      }
      // walletCopy[foundIndex].trucatedAddress = value
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
    let i = this.state.walletInput.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.walletInput];
    // data.address === newAddress[i].address && console.log("heyyy", newAddress[i].address, data.address)
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

  addInputField = () => {
    if (
      this.state.walletInput.length + 1 <=
        this.state.userPlan?.wallet_address_limit ||
      this.state.userPlan?.wallet_address_limit === -1
    ) {
      this.state.walletInput.push({
        id: `wallet${this.state.walletInput.length + 1}`,
        address: "",
        coins: [],
        nickname: "",
        showAddress: true,
        showNickname: true,
      });
      this.setState({
        walletInput: this.state.walletInput,
      });
      AddTextbox({});
    } else {
      this.setState(
        {
          triggerId: 1,
        },
        () => {
          this.props.upgradeModal();
        }
      );
    }
  };

  deleteInputField = (index, wallet) => {
    if (!this.isDisabled() || wallet.address === "") {
      this.state.walletInput?.splice(index, 1);
      this.state.walletInput?.map((w, i) => (w.id = `wallet${i + 1}`));
      DeleteWalletAddress({
        address: wallet.address,
      });
      this.setState({
        walletInput: this.state.walletInput,
      });
    }
    // console.log("Delete", wallet.address);
  };

  isDisabled = () => {
    let isDisableFlag = true;
    // if (this.state.walletInput.length <= 0) {
    //     isDisableFlag = true;
    // }
    this.state.walletInput?.map((e) => {
      if (e.address) {
        if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
          // isDisableFlag = true;
          e.coins.map((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = false;
            }
          });
        } else {
          isDisableFlag = false;
        }
      }
    });
    return isDisableFlag;
  };

  onValidSubmit = () => {
    console.log("onvald")
    const islochUser = localStorage.getItem("lochDummyUser");
    if (islochUser) {
      this.updateWallet();
    } else {
      let walletAddress = [];
      let addWallet = this.state.walletInput;
      let finalArr = [];

      //  console.log("cjeb", addWallet);
      let addressList = [];

      let nicknameArr = {};

      for (let i = 0; i < addWallet.length; i++) {
        let curr = addWallet[i];
        if (
          !walletAddress.includes(curr.apiAddress.trim()) &&
          curr.address.trim()
        ) {
          finalArr.push(curr);
          walletAddress.push(curr.address.trim());
          walletAddress.push(curr.displayAddress?.trim());
          walletAddress.push(curr.apiAddress?.trim());
          let address = curr.address.trim();
          nicknameArr[address] = curr.nickname;
          addressList.push(curr.address.trim());
        }
      }

      finalArr = finalArr?.map((item, index) => {
        return {
          ...item,
          id: `wallet${index + 1}`,
        };
      });

      // console.log("final array", addressList);

      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      // data.append("link", );
      createAnonymousUserApi(data, this, finalArr, null);
      // console.log(finalArr);

      const address = finalArr?.map((e) => e.address);
      // console.log("address", address);

      const unrecog_address = finalArr
        .filter((e) => !e.coinFound)
        .map((e) => e.address);
      // console.log("Unreq address", unrecog_address);

      const blockchainDetected = [];
      const nicknames = [];
      finalArr
        .filter((e) => e.coinFound)
        .map((obj) => {
          let coinName = obj.coins
            .filter((e) => e.chain_detected)
            .map((name) => name.coinName);
          let address = obj.address;
          let nickname = obj.nickname;
          blockchainDetected.push({ address: address, names: coinName });
          nicknames.push({ address: address, nickname: nickname });
        });

      // console.log("blockchain detected", blockchainDetected);

      LPC_Go({
        addresses: address,
        ENS: address,
        chains_detected_against_them: blockchainDetected,
        unrecognized_addresses: unrecog_address,
        unrecognized_ENS: unrecog_address,
        nicknames: nicknames,
      });
    }
  };

  updateWallet = () => {
    // console.log(
    //   "add wallet list",
    //   this.state.total_addresses + this.state.addWalletList?.length >
    //     this.state.userPlan.wallet_address_limit,
    //   this.state.total_addresses , this.state.addWalletList?.length ,
    //     this.state.userPlan.wallet_address_limit
    // );
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      let arr = [];
      let addressList = [];
      let displayAddress = [];
      let nicknameArr = {};
      let walletList = [];
      for (let i = 0; i < this.state.walletInput.length; i++) {
        let curr = this.state.walletInput[i];
        // console.log(
        //   "current address",
        //   curr,
        //   "arr",
        //   arr,

        // );
        if (!arr.includes(curr.apiAddress?.trim()) && curr.address) {
          walletList.push(curr);
          arr.push(curr.address.trim());
          nicknameArr[curr.address.trim()] = curr.nickname;
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.apiAddress?.trim());
          addressList.push(curr.address?.trim());
          //  console.log("curr add", curr.address, "dis", curr.displayAddress,"cur api", curr.apiAddress)
        }
      }

      let addWallet = walletList;

      addWallet?.map((w, i) => {
        w.id = `wallet${i + 1}`;
      });
      localStorage.setItem("addWallet", JSON.stringify(addWallet));

      // this.state?.onHide();
      const data = new URLSearchParams();
      // data.append("wallet_addresses", JSON.stringify(arr));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      data.append("wallet_addresses", JSON.stringify(addressList));

      updateUserWalletApi(data, this);
      // this.state.changeList && this.state.changeList(walletList);
      // if (this.props.handleUpdateWallet) {
      //     this.props.handleUpdateWallet()
      // }
      // console.log("fix",this.state.addWalletList);
      const address = this.state.walletInput?.map((e) => e.address);
      // console.log("address", address);
      const addressDeleted = this.state.deletedAddress;
      // console.log("Deteted address", addressDeleted);
      const unrecog_address = this.state.walletInput
        ?.filter((e) => !e.coinFound)
        ?.map((e) => e.address);
      // console.log("Unreq address", unrecog_address);
      const recog_address = this.state.walletInput
        ?.filter((e) => e.coinFound)
        ?.map((e) => e.address);
      // console.log("req address", recog_address);

      const blockchainDetected = [];
      const nicknames = [];
      this.state.walletInput
        ?.filter((e) => e.coinFound)
        ?.map((obj) => {
          let coinName = obj.coins
            ?.filter((e) => e.chain_detected)
            ?.map((name) => name.coinName);
          let address = obj.address;
          let nickname = obj.nickname;
          blockchainDetected.push({ address: address, names: coinName });
          nicknames.push({ address: address, nickname: nickname });
        });

      // console.log("blockchain detected", blockchainDetected);
      AddWalletAddress({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        addresses_added: address,
        ENS_added: address,
        addresses_deleted: addressDeleted,
        ENS_deleted: addressDeleted,
        unrecognized_addresses: unrecog_address,
        recognized_addresses: recog_address,
        blockchains_detected: blockchainDetected,
        nicknames: nicknames,
      });
    }, 100);
  };
  handleSignText = () => {
    this.props.switchSignIn();
  };

  handleTabPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      // console.log("yab press");
      // your function code here
      this.addInputField();
    }
  };
  render() {
    return (
      <>
        <Form
          onValidSubmit={
            this.state.addButtonVisible
              ? this.onValidSubmit
              : this.handleSignText
          }
        >
          <div className="ob-modal-body-wrapper">
            <div className="ob-modal-body-1">
              {this.state.walletInput?.map((c, index) => {
                // console.log(c);
                return (
                  <div
                    className={`ob-wallet-input-wrapper ${
                      this.state.walletInput[index].address ? "is-valid" : null
                    }`}
                    style={
                      index == this.state.walletInput.length - 1
                        ? { marginBottom: 0 }
                        : {}
                    }
                    key={index}
                    id={`add-wallet-${index}`}
                    // onFocus={(e) => {
                    //   console.log(e);
                    //   this.FocusInInput(`wallet${index + 1}`);
                    // }}
                    // onBlur={(e) => {
                    //   console.log(e);
                    //   this.FocusOutInput(`wallet${index + 1}`);
                    // }}
                  >
                    <>
                      {this.state.walletInput.length > 1 ? (
                        <Image
                          key={index}
                          className={`ob-modal-body-del`}
                          // ${this.isDisabled()&& c.address  ? 'not-allowed' : ""}
                          src={DeleteIcon}
                          onClick={() => this.deleteInputField(index, c)}
                        />
                      ) : null}
                      {c.showAddress && (
                        <input
                          autoFocus
                          name={`wallet${index + 1}`}
                          value={c.address || ""}
                          className={`inter-display-regular f-s-15 lh-20 ob-modal-body-text`}
                          placeholder="Paste any wallet address or ENS here"
                          title={c.address || ""}
                          // style={{paddingRight: divWidth}}
                          style={getPadding(
                            `add-wallet-${index}`,
                            c,
                            this.props.OnboardingState
                          )}
                          // onKeyUp={(e) => this.setState({ loading: true })}
                          onChange={(e) => this.handleOnChange(e)}
                          // tabIndex={index}
                          onKeyDown={this.handleTabPress}
                          onFocus={(e) => {
                            // console.log(e);
                            this.FocusInInput(e);
                          }}
                          // onBlur={(e) => {
                          //   // console.log(e);
                          //   // this.FocusOutInput(e);
                          // }}
                        />
                      )}
                      {c.coinFound && c.showNickname && (
                        <input
                          name={`wallet${index + 1}`}
                          value={c.nickname || ""}
                          className={`inter-display-regular f-s-15 lh-20 ob-modal-body-text`}
                          placeholder="Enter nickname"
                          title={c.nickname || ""}
                          // style={{paddingRight: divWidth}}
                          style={getPadding(
                            `add-wallet-nickname-${index}`,
                            c,
                            this.props.OnboardingState
                          )}
                          // onKeyUp={(e) => this.setState({ loading: true })}
                          onChange={(e) => {
                            this.nicknameOnChain(e);
                            // console.log(e.target)
                          }}
                          onBlur={(e) => {
                            // console.log(e);
                            // this.FocusOutInput(e);
                            LandingPageNickname({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                              nickname: e.target?.value,
                              address: c.address,
                            });
                          }}
                          // autoFocus
                          onFocus={(e) => {
                            // console.log(e);
                            this.FocusInInput(e);
                          }}
                        />
                      )}
                      {this.state.walletInput?.map((e, i) => {
                        if (
                          this.state.walletInput[index].address &&
                          e.id === `wallet${index + 1}`
                        ) {
                          // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                          if (e.coinFound && e.coins.length > 0) {
                            return (
                              <CustomChip
                                coins={e.coins.filter((c) => c.chain_detected)}
                                key={i}
                                isLoaded={true}
                              ></CustomChip>
                            );
                          } else {
                            if (
                              e.coins.length ===
                              this.props.OnboardingState.coinsList.length
                            ) {
                              return (
                                <CustomChip
                                  coins={null}
                                  key={i}
                                  isLoaded={true}
                                ></CustomChip>
                              );
                            } else {
                              return (
                                <CustomChip
                                  coins={null}
                                  key={i}
                                  isLoaded={false}
                                ></CustomChip>
                              );
                            }
                          }
                        } else {
                          return "";
                        }
                      })}
                    </>
                  </div>
                );
              })}
            </div>
          </div>
          {this.state.addButtonVisible ? (
            <div className="ob-modal-body-2">
              <Button className="grey-btn" onClick={this.addInputField}>
                <Image src={PlusIcon} /> Add another
              </Button>
            </div>
          ) : null}

          {this.state.connectExchange && (
            <div className="ob-connect-exchange">
              <div
                className="inter-display-semi-bold f-s-13 lh-16 black-191 connect-exchange-btn"
                onClick={() => {
                  this.props.connectWallet(this.state.walletInput);
                }}
              >
                <Image
                  src={LinkIconBtn}
                  style={{
                    width: "1.2rem",
                    marginRight: "4px",
                    marginBottom: "1px",
                  }}
                />
                {this.state.connectText}
              </div>
            </div>
          )}

          <div className="ob-modal-body-btn">
            {/* <CustomButton
                  className="secondary-btn m-r-15 preview"
                  buttonText="Preview demo instead"
                  onClick={() => {
                    PreviewDemo({});
                    console.log("Preview");
                  }}
                /> */}
            <CustomButton
              className="primary-btn go-btn"
              type="submit"
              isLoading={
                this.state.addButtonVisible ? this.isDisabled() : false
              }
              isDisabled={
                this.state.addButtonVisible ? this.isDisabled() : false
              }
              buttonText={
                this.state.addButtonVisible ? "Go" : "Sign in instead"
              }
            />
          </div>

          {this.state.addButtonVisible ? (
            <div className="m-b-30 m-t-30 addWallet-signIn-div">
              <span className="inter-display-medium f-s-13 m-r-8 lh-16 grey-ADA">
                Already have an account?
              </span>
              <span
                className="inter-display-bold f-s-13 lh-16 black-191 cp"
                onClick={this.handleSignText}
              >
                Sign In
              </span>
            </div>
          ) : (
            ""
          )}
        </Form>
        {/* {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={localStorage.getItem("share_id")}
            // isStatic={this.state.isStatic}
          />
        )} */}
      </>
    );
  }
}

const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    getAllCoins,
    detectCoin,
    createAnonymousUserApi,
    getAllParentChains
}
AddWallet.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);