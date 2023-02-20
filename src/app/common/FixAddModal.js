import React from 'react'
import { BaseReactComponent } from '../../utils/form';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import DeleteIcon from "../../assets/images/icons/trashIcon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import Banner from "../../image/Frame.png"
import CustomChip from "../../utils/commonComponent/CustomChip";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CloseBtn from "../../assets/images/icons/CloseBtn.svg"
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CloseIcon from '../../assets/images/icons/CloseIcon.svg'
import { getAllCoins, detectCoin, getAllParentChains } from "../onboarding//Api";
import { getDetectedChainsApi, updateUserWalletApi } from './Api';
import { getAllWalletApi, updateWalletApi } from './../wallet/Api';
import { loadingAnimation ,getPadding} from '../../utils/ReusableFunctions';
import { AddWalletAddress, AddWalletAddressNickname, AddWalletAddressPodName, AnonymityWalletConnection, DoneFixingConnection } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
import { Plans } from '../../utils/Constant';
import UpgradeModal from './upgradeModal';
import { searchCohort } from '../cohort/Api';
class FixAddModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    let addWalletList = JSON.parse(localStorage.getItem("addWallet"));
    addWalletList =
      addWalletList && addWalletList?.length > 0
        ? addWalletList?.map((e) => {
            return {
              ...e,
              showAddress: e.nickname === "" ? true : false,
              showNickname: e.nickname === "" ? false : true,
            };
          })
        : [
            {
              id: `wallet${addWalletList?.length + 1}`,
              address: "",
              coins: [],
              displayAddress: "",
              wallet_metadata: {},
              nickname: "",
              showAddress: true,
              showNickname: true,
            },
          ];
    // console.log("addWalletList", addWalletList);
    this.state = {
      onHide: props.onHide,
      show: props.show,
      modalIcon: props.modalIcon,
      title: props.title,
      subtitle: props.subtitle,
      fixWalletAddress: [],
      btnText: props.btnText,
      btnStatus: props.btnStatus,
      modalType: props.modalType,
      addWalletList,
      currentCoinList: [],
      showelement: false,
      walletTitleList: [],
      chainTitleList: [],
      changeList: props.changeWalletList,
      pathName: props.pathName,
      walletNameList: [],
      deletedAddress: [],
      recievedResponse: false,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      start: 0,
      sorts: [],
      total_addresses: 0,
      prevWalletAddress: addWalletList,
    };
    this.timeout = 0;
  }
// for get cohort details
  makeApiCall = (cond) => {
    let data = new URLSearchParams();
    data.append("start", this.state.start);
    data.append("conditions", JSON.stringify(cond ? cond : []));
    data.append("limit", 50);
    // data.append("limit", API_LIMIT)
    data.append("sorts", JSON.stringify(this.state.sorts));
    searchCohort(data, this);
    // console.log(data);
  };

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
    });
  };

  handleOnchangeNickname = (e) => {
    let { name, value } = e.target;
    // console.log("e", value.trim());
    let prevWallets = [...this.state.addWalletList];
    let currentIndex = prevWallets.findIndex((elem) => elem.id === name);
    if (currentIndex > -1) {
      prevWallets[currentIndex].nickname = value;
    }
    this.setState({
      addWalletList: prevWallets,
    });
  };

  FocusInInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.addWalletList];
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
      addWalletList: walletCopy,
    });
  };

  handleOnchange = (e) => {
    let { name, value } = e.target;
    // console.log("e", value.trim());
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
    //   console.log("data", data);
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
    //new code added
    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound =
      newAddress[i].coins &&
      newAddress[i].coins.some((e) => e.chain_detected === true);
    // console.log(
    //   "newAddress",
    //   newAddress,
    //   data.id,
    //   newAddress[i].id,
    //   data.address === newAddress[i].address,
    //   data.address,
    //   newAddress[i].address
    // );
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
  componentDidMount() {
    this.props.getAllCoins();
    this.props.getAllParentChains();
    //  this.makeApiCall();
    getAllWalletApi(this);
    getDetectedChainsApi(this);
    const fixWallet = [];
    JSON.parse(localStorage.getItem("addWallet"))?.map((e) => {
      // console.log("e fix wallet", e);
      if (e.coinFound !== true) {
        fixWallet.push({ ...e, id: `wallet${fixWallet.length + 1}` });
      }
    });

   

    // console.log('fixWallet',fixWallet);
    this.setState({
      fixWalletAddress: fixWallet,
    });
  }
  addAddress = () => {
    console.log(this.state.addWalletList.length, this.state.total_addresses);
    let total =
      this.state.addWalletList.length +
      this.state.total_addresses +
      1 -
      this.state.prevWalletAddress?.length;
    if (
      total <= this.state.userPlan.wallet_address_limit ||
      this.state.userPlan.wallet_address_limit === -1
    ) {
      this.state.addWalletList.push({
        id: `wallet${this.state.addWalletList.length + 1}`,
        address: "",
        coins: [],
        displayAddress: "",
        nickname: "",
        showAddress: true,
        showNickname: true,
        wallet_metadata: {},
      });
      this.setState({
        addWalletList: this.state.addWalletList,
      });
    } else {
      this.setState(
        {
          triggerId: 1,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
  };

  deleteAddress = (index) => {
    const address = this.state.addWalletList.at(index).address;
    if (address !== "") {
      this.state.deletedAddress.push(address);
      this.setState({
        deletedAddress: this.state.deletedAddress,
      });
    }
    this.state.addWalletList.splice(index, 1);
    this.state.addWalletList?.map((w, i) => {
      w.id = `wallet${i + 1}`;
    });

    this.setState({
      addWalletList: this.state.addWalletList,
    });
    // console.log("Delete", this.state.addWalletList);
    // console.log("Prev 1", this.state.deletedAddress);
  };
  deleteFixWalletAddress = (e) => {
    let { id } = e;
    let fixWalletNewArr = [];
    this.state.fixWalletAddress?.map((wallet, index) => {
      if (wallet.id !== id) {
        fixWalletNewArr.push(wallet);
      }
    });
    this.setState({
      fixWalletAddress: fixWalletNewArr,
    });
  };

  handleAddWallet = () => {
    // console.log("add wallet list", this.state.addWalletList,this);
     if (
       this.state.total_addresses > this.state.userPlan.wallet_address_limit &&
       this.state.userPlan.wallet_address_limit !== -1
     ) {
       this.setState(
         {
           triggerId: 1,
         },
         () => {
           this.upgradeModal();
         }
       );
     } else {
       if (this.state.addWalletList) {
         if (this.timeout) {
           clearTimeout(this.timeout);
         }
         this.timeout = setTimeout(() => {
           let arr = [];
           let addressList = [];
           let displayAddress = [];
           let nicknameArr = {};
           let walletList = [];
           for (let i = 0; i < this.state.addWalletList.length; i++) {
             let curr = this.state.addWalletList[i];
             // console.log(
             //   "current address",
             //   curr.address.trim(),
             //   "display",
             //   curr.displayAddress,
             //   "arr",
             //   arr,

             // );
             if (!arr.includes(curr.address.trim()) && curr.address) {
               walletList.push(curr);
               arr.push(curr.address.trim());
               nicknameArr[curr.address.trim()] = curr.nickname;
               arr.push(curr.displayAddress?.trim());
               addressList.push(curr.address.trim());
             }
           }

           let addWallet = walletList;

           addWallet?.map((w, i) => {
             w.id = `wallet${i + 1}`;
           });
           localStorage.setItem("addWallet", JSON.stringify(addWallet));

           this.state.onHide();
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
           const address = this.state.addWalletList?.map((e) => e.address);
           // console.log("address", address);
           const addressDeleted = this.state.deletedAddress;
           // console.log("Deteted address", addressDeleted);
           const unrecog_address = this.state.addWalletList
             ?.filter((e) => !e.coinFound)
             ?.map((e) => e.address);
           // console.log("Unreq address", unrecog_address);
           const recog_address = this.state.addWalletList
             ?.filter((e) => e.coinFound)
             ?.map((e) => e.address);
           // console.log("req address", recog_address);

           const blockchainDetected = [];
           const nicknames = [];
           this.state.addWalletList
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
       }
     }
    
  };

  handleFixWalletChange = (e) => {
    let { name, value } = e.target;
    let prevWallets = [...this.state.fixWalletAddress];
    let currentIndex = prevWallets.findIndex((elem) => elem.id === name);
    // console.log('prevWallets',prevWallets);
    // console.log('currentIndex',currentIndex);
    let prevValue = prevWallets[currentIndex].address;
    prevWallets[currentIndex].address = value;
    // prevWallets[currentIndex].coins = []
    if (value === "" || prevValue !== value) {
      prevWallets[currentIndex].coins = [];
    }
    // prevWallets[currentIndex].address = value
    this.setState({
      fixWalletAddress: prevWallets,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 500);
  };

  handleFixWalletChangeNickname = (e) => {
    let { name, value } = e.target;
    let prevWallets = [...this.state.fixWalletAddress];
    let currentIndex = prevWallets.findIndex((elem) => elem.id === name);
    // console.log('prevWallets',prevWallets);
    // p'currentIndex',currentIndex);

    prevWallets[currentIndex].nickname = value;
    // prevWallets[currentIndex].coins = []

    // prevWallets[currentIndex].address = value
    this.setState({
      fixWalletAddress: prevWallets,
    });
  };

  FocusInInputFixWallet = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.fixWalletAddress];
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
      fixWalletAddress: walletCopy,
    });
  };

  handleFixWallet = () => {
    // console.log(this.state.fixWalletAddress);`
    this.state.fixWalletAddress &&
      this.state.fixWalletAddress.map((obj) => {
        // console.log(obj)
        let coinName = obj.coins
          .filter((e) => e.chain_detected)
          .map((name) => name.coinName);
        DoneFixingConnection({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          wallet_address: obj.address,
          blockchainDetected: coinName,
        });
      });

    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      let wallets = JSON.parse(localStorage.getItem("addWallet"));
      // console.log('wallet',wallets);
      let localArr = [];
      for (let i = 0; i < wallets.length; i++) {
        let curr = wallets[i];
        if (!curr.coinFound) {
          this.state.fixWalletAddress?.map((wallet) => {
            localArr.push(wallet);
          });
        } else {
          localArr.push(wallets[i]);
        }
      }
      // console.log('localArr',localArr);
      // remove repeat address if same address added for unrecognized wallet
      let newArr = [];
      let walletList = [];
      let nicknameArr = {};
      for (let i = 0; i < localArr.length; i++) {
        let curr = localArr[i];
        if (!newArr.includes(curr.address.trim())) {
          walletList.push(curr);
          newArr.push(curr.address.trim());
          nicknameArr[curr.address.trim()] = curr.nickname;
        }
      }
      walletList?.map((w, index) => (w.id = `wallet${index + 1}`));
      // console.log('walletList',walletList);
      if (walletList.length === 0) {
        walletList.push({
          id: "wallet1",
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
        });
      }
      localStorage.setItem("addWallet", JSON.stringify(walletList));
      this.state.onHide();
      // console.log("new array", newArr);
      this.state.changeList && this.state.changeList(walletList);
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(newArr));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      updateUserWalletApi(data, this);
      // if (this.props.handleUpdateWallet) {
      //     this.props.handleUpdateWallet()
      // }
    }, 300);
  };

  isDisabled = () => {
    let isDisableFlag = true;
    this.state.addWalletList?.map((e) => {
      if (e.address) {
        if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
          e.coins.map((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = false;
            }
          });
        } else {
          isDisableFlag = false;
        }
      } else {
        isDisableFlag = false;
      }
    });
    return isDisableFlag;
  };

  isFixDisabled = () => {
    let isDisableFlag = true;
    this.state.fixWalletAddress.length > 0
      ? this.state.fixWalletAddress?.map((e) => {
          if (e.address) {
            if (
              e.coins.length !== this.props.OnboardingState.coinsList.length
            ) {
              // isDisableFlag = true;
              e.coins.map((a) => {
                if (a.chain_detected === true) {
                  isDisableFlag = false;
                }
              });
            } else {
              isDisableFlag = false;
            }
          } else {
            isDisableFlag = false;
          }
        })
      : (isDisableFlag = false);

    return isDisableFlag;
  };

  handleTabPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      // your function code here
      this.addAddress();
    }
  };

  render() {
    let walletDropDownList = [];
    this.state.walletNameList?.map((wallet) => {
      walletDropDownList.push({ name: wallet.name, id: wallet.id });
    });
    const inputs =
      this.state.modalType == "fixwallet"
        ? this.state.fixWalletAddress?.map((elem, index) => {
            return (
              <div
                className="fix-wallet-input"
                key={index}
                id={`fix-input-${index}`}
                style={
                  index == this.state.fixWalletAddress.length - 1
                    ? { marginBottom: 0 }
                    : {}
                }
              >
                <div
                  className="delete-icon"
                  onClick={() => this.deleteFixWalletAddress(elem)}
                >
                  <Image src={DeleteIcon} />
                </div>
                {elem.showAddress && (
                  <input
                    value={elem.address || ""}
                    className="inter-display-regular f-s-16  lh-19 black-191"
                    type="text"
                    id={elem.id}
                    placeholder="Paste valid wallet address or ENS here"
                    name={`wallet${index + 1}`}
                    autoFocus
                    onChange={(e) => this.handleFixWalletChange(e)}
                    style={getPadding(
                      `fix-input-${index}`,
                      elem,
                      this.props.OnboardingState
                    )}
                    onFocus={(e) => {
                      // console.log(e);
                      this.FocusInInputFixWallet(e);
                    }}
                  />
                )}

                {elem.showNickname && elem.coinFound && (
                  <input
                    value={elem.nickname || ""}
                    className="inter-display-regular f-s-16  lh-19 black-191"
                    type="text"
                    placeholder="Enter Nickname"
                    id={elem.id}
                    name={`wallet${index + 1}`}
                    onChange={(e) => this.handleFixWalletChangeNickname(e)}
                    style={getPadding(
                      `fix-input-${index}`,
                      elem,
                      this.props.OnboardingState
                    )}
                    onFocus={(e) => {
                      // console.log(e);
                      this.FocusInInputFixWallet(e);
                    }}
                  />
                )}
                {elem.address ? (
                  elem.coinFound && elem.coins.length > 0 ? (
                    <CustomChip
                      coins={elem.coins.filter((c) => c.chain_detected)}
                      key={index}
                      isLoaded={true}
                    ></CustomChip>
                  ) : // elem.coins.length === 0
                  //     ?
                  //     <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                  // :
                  elem.coins.length ===
                    this.props.OnboardingState.coinsList.length ? (
                    <CustomChip
                      coins={null}
                      key={index}
                      isLoaded={true}
                    ></CustomChip>
                  ) : (
                    <CustomChip
                      coins={null}
                      key={index}
                      isLoaded={false}
                    ></CustomChip>
                  )
                ) : (
                  ""
                )}
              </div>
            );
          })
        : "";

    const wallets = this.state.addWalletList?.map((elem, index) => {
      return (
        <div
          className="add-wallet-input-section"
          key={index}
          id={`add-wallet-${index}`}
          style={
            index == this.state.addWalletList.length - 1
              ? { marginBottom: 0 }
              : {}
          }
        >
          {this.state.addWalletList.length > 1 ? (
            <div
              className="delete-icon"
              onClick={() => this.deleteAddress(index)}
            >
              <Image src={DeleteIcon} />
            </div>
          ) : (
            ""
          )}
          {elem.showAddress && (
            <input
              autoFocus
              name={`wallet${index + 1}`}
              value={elem.displayAddress || elem.address || ""}
              placeholder="Paste any wallet address or ENS here"
              // className='inter-display-regular f-s-16 lh-20'
              className={`inter-display-regular f-s-16 lh-20 ${
                elem.address ? "is-valid" : null
              }`}
              onChange={(e) => this.handleOnchange(e)}
              id={elem.id}
              style={getPadding(
                `add-wallet-${index}`,
                elem,
                this.props.OnboardingState
              )}
              onKeyDown={this.handleTabPress}
              onFocus={(e) => {
                // console.log(e);
                this.FocusInInput(e);
              }}
            />
          )}

          {elem.coinFound && elem.showNickname && (
            <input
              // autoFocus
              name={`wallet${index + 1}`}
              value={elem.nickname || ""}
              placeholder="Enter Nickname"
              // className='inter-display-regular f-s-16 lh-20'
              className={`inter-display-regular f-s-16 lh-20 ${
                elem.address ? "is-valid" : null
              }`}
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
                AddWalletAddressNickname({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  nickname: e.target?.value,
                  address: elem.address,
                });
              }}
              // onKeyDown={this.handleTabPress}
            />
          )}
          {elem.address ? (
            elem.coinFound && elem.coins.length > 0 ? (
              // COIN FOUND STATE
              <CustomChip
                coins={elem.coins.filter((c) => c.chain_detected)}
                key={index}
                isLoaded={true}
              ></CustomChip>
            ) : elem.coins.length ===
              this.props.OnboardingState.coinsList.length ? (
              // elem.coins.length === 1
              // UNRECOGNIZED WALLET
              <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
            ) : (
              // LOADING STATE
              <CustomChip
                coins={null}
                key={index}
                isLoaded={false}
              ></CustomChip>
            )
          ) : (
            ""
          )}
        </div>
      );
    });

    return (
      <>
        <Modal
          show={this.state.show}
          className="fix-add-modal"
          onHide={this.state.onHide}
          size="lg"
          dialogClassName={"fix-add-modal"}
          centered
          aria-labelledby="contained-modal-title-vcenter"
          backdropClassName="fixaddmodal"
        >
          <Modal.Header
            style={{
              padding: `${
                this.state.modalType === "fixwallet" ? "2.8rem " : ""
              }`,
            }}
            className={this.state.modalType === "addwallet" ? "add-wallet" : ""}
          >
            {this.state.modalType === "addwallet" && (
              <div>
                <Image src={Banner} className="banner-img" />
                <div className="wallet-header">
                  <Image src={this.state.modalIcon} className="m-b-20" />
                  <h4 className="inter-display-medium f-s-25 lh-31 white m-b-4">
                    {this.state.title}
                  </h4>
                  <p
                    className={"inter-display-medium f-s-13 lh-16 white op-8 "}
                  >
                    {this.state.subtitle}
                  </p>
                </div>
              </div>
            )}
            <div className="closebtn" onClick={this.state.onHide}>
              <Image
                src={
                  this.state.modalType === "fixwallet" ? CloseIcon : CloseBtn
                }
              />
            </div>
          </Modal.Header>
          <Modal.Body>
            <div
              className={`fix-add-modal-body ${
                this.state.modalType === "addwallet" ? "m-t-30" : "fix-wallet"
              }`}
            >
              {this.state.modalType === "fixwallet" && (
                <div className="fix-wallet-title">
                  <h6 className="inter-display-medium f-s-20 lh-24 ">
                    {this.state.title}
                  </h6>
                  <p
                    className={`inter-display-medium f-s-16 lh-19 grey-7C7 ${
                      this.modalIcon ? "m-b-52" : "m-b-77"
                    }`}
                  >
                    {this.state.subtitle}
                  </p>
                </div>
              )}

              {this.state.modalType === "fixwallet" && (
                <div className="fix-modal-input">{inputs}</div>
              )}
              {this.state.modalType === "addwallet" && (
                <div className="add-modal-inputs">{wallets}</div>
              )}

              {this.state.addWalletList.length >= 0 &&
                this.state.modalType === "addwallet" && (
                  <div className="m-b-32 add-wallet-btn">
                    <Button className="grey-btn" onClick={this.addAddress}>
                      <Image src={PlusIcon} /> Add another
                    </Button>
                  </div>
                )}

              {/* input field for add wallet */}
              <div className="btn-section">
                <Button
                  className={`primary-btn ${
                    this.state.btnStatus ? "activebtn" : ""
                  } ${
                    this.state.modalType === "fixwallet"
                      ? "fix-btn"
                      : this.state.modalType === "addwallet" &&
                        !this.isDisabled()
                      ? "add-btn activebtn"
                      : "add-btn"
                  }`}
                  disabled={
                    this.state.modalType === "addwallet"
                      ? this.isDisabled()
                      : this.isFixDisabled()
                  }
                  onClick={
                    this.state.modalType === "addwallet"
                      ? this.handleAddWallet
                      : this.handleFixWallet
                  }
                >
                  {/* {this.state.btnText} */}
                  {this.state.modalType === "addwallet"
                    ? this.isDisabled()
                      ? loadingAnimation()
                      : this.state.btnText
                    : this.isFixDisabled()
                    ? loadingAnimation()
                    : this.state.btnText}
                </Button>
              </div>
              <div className="m-b-26 footer">
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                  At Loch, we care intensely about your privacy and
                  pseudonymity.
                  <CustomOverlay
                    text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                    position="top"
                    isIcon={true}
                    IconImage={LockIcon}
                    isInfo={true}
                    className={"fix-width"}
                  >
                    <Image
                      src={InfoIcon}
                      className="info-icon"
                      onMouseEnter={() => {
                        AnonymityWalletConnection({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                      }}
                    />
                  </CustomOverlay>
                </p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  getAllCoins,
  detectCoin,
  updateWalletApi,
  getAllWalletApi,
  getAllParentChains,
};
FixAddModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FixAddModal);
