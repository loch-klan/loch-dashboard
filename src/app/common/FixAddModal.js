import Papa from "papaparse";
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import CloseBtn from "../../assets/images/icons/CloseBtn.svg";
import CloseIcon from "../../assets/images/icons/CloseIcon.svg";
import CheckIcon from "../../assets/images/icons/check-upgrade.svg";
import ClockIcon from "../../assets/images/icons/clock-icon.svg";
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import FileIcon from "../../assets/images/icons/file-text.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import WalletIcon from "../../assets/images/icons/wallet-icon.png";
import Banner from "../../image/Frame.png";
import {
  AddTextboxHome,
  AddWalletAddress,
  AddWalletAddressNickname,
  AnonymityWalletConnection,
  AssetValueAddWallet,
  CostAddWallet,
  DoneFixingConnection,
  TransactionHistoryAddWallet,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { getPadding, loadingAnimation } from "../../utils/ReusableFunctions";
import { CustomCoin } from "../../utils/commonComponent";
import CustomChip from "../../utils/commonComponent/CustomChip";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
} from "../../utils/form";
import { setHeaderReducer } from "../header/HeaderAction";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";
import { addUserCredits } from "../profile/Api";
import { getAllWalletApi, updateWalletApi } from "./../wallet/Api";
import {
  detectNameTag,
  getDetectedChainsApi,
  updateUserWalletApi,
  updateWalletListFlag,
} from "./Api";
import UpgradeModal from "./upgradeModal";
class FixAddModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    let addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    addWalletList =
      addWalletList && addWalletList?.length > 0
        ? addWalletList?.map((e) => {
            return {
              ...e,
              showAddress: e.nickname === "" ? true : false,
              showNickname: e.nickname === "" ? false : true,
              showNameTag: e.nameTag === "" ? false : true,
              apiAddress: e.address,
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
              showNameTag: true,
              apiAddress: "",
            },
          ];
    // console.log("addWalletList", addWalletList);
    this.state = {
      disableGoBtn: false,
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
      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      start: 0,
      sorts: [],
      total_addresses: 0,
      prevWalletAddress: addWalletList,
      hidePrevModal: false,

      // upload csv/txt
      showWarningMsg: false,
      uploadStatus: "Uploading",
      // set pod id when we get response after creating new pod and,
      // call getStatus api until isLoaded true
      podId: null,
      // if this true then show email message and done btn and stop call getStatus api
      emailAdded: false,

      // set false if email added or get Status
      isIndexed: false,
      email_notification: getCurrentUser().email,
      fileName: null,
      isChangeFile: false,
      total_unique_address: 0,
      metamaskWalletConnected: "",
    };
    this.timeout = 0;
  }

  // upload csv
  fileInputRef = React.createRef();
  pasteInput = React.createRef();

  EmailNotification = () => {
    // send notification for that user
    this.setState(
      {
        // isIndexed: true,
        emailAdded: true,
      },
      () => {
        // const data = new URLSearchParams();
        // data.append("cohort_id", this.state.podId);
        // notificationSend(data, this);
      }
    );
  };

  getPodStatusFunction = () => {};

  handleUpload = () => {
    // console.log("test", this.state.userPlan?.upload_csv);
    if (this.state.userPlan?.upload_csv) {
      this.fileInputRef.current.click();
    } else {
      // console.log("test2")
      this.setState(
        {
          triggerId: 8,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
    // console.log("upload click");
  };

  handleFileSelect = (event) => {
    // console.log("con")
    const file = event.target.files[0];
    const name = event.target.files[0]?.name;

    // console.log(name)

    if (this.state.showWarningMsg) {
      this.setState({
        addWalletList: [
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
        uploadStatus: "Uploading",
        emailAdded: false,
        isIndexed: false,
        isChangeFile: true,
        fileName: name,
      });
    } else {
      this.setState({
        fileName: name,
      });
    }

    if (file.type === "text/csv" || file.type === "text/plain") {
      Papa.parse(file, {
        complete: (results) => {
          this.setState({
            showWarningMsg: true,
          });
          let addressList = [];
          let prevAddressList = [];
          this.state?.addWalletList &&
            this.state?.addWalletList.map((e) => {
              if (e.address !== "" || e.displayAddress != "") {
                prevAddressList.push(e);
              }
            });
          let uploadedAddress = [];
          results?.data?.map((e, i) => {
            uploadedAddress.push(e[0]);
            addressList.push({
              id: `wallet${prevAddressList?.length + (i + 1)}`,
              address: e[0],
              coins: [],
              displayAddress: e[0],
              wallet_metadata: {},
              nickname: "",
              showAddress: true,
              showNickname: true,
              showNameTag: true,
              apiAddress: e[0],
            });
          });

          let total_address =
            prevAddressList?.length +
            addressList?.length +
            this.state.total_addresses -
            this.state.prevWalletAddress?.lenght;

          if (
            total_address <= this.state.userPlan?.whale_pod_address_limit ||
            this.state.userPlan?.whale_pod_address_limit === -1
          ) {
            // WhalePodUploadFile({
            //   session_id: getCurrentUser().id,
            //   email_address: getCurrentUser().email,
            //   addresses: uploadedAddress,
            // });

            this.setState(
              {
                addWalletList: [...prevAddressList, ...addressList],
              },
              () => {
                // call api to store pod
                // this.state.addWalletList?.map((e) =>
                //   this.getCoinBasedOnWalletAddress(e.id, e.address)
                // );
                this.handleAddWallet();
              }
            );
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

          // console.log(results.data, addressList, prevAddressList);
        },
      });
    } else {
      // console.log("Invalid file type. Only CSV and text files are allowed.");
    }
    event.target.value = "";
  };

  handleDone = () => {
    // this.props.apiResponse(true);
    this.state.onHide();
    // this.state.changeList && this.state.changeList();
  };

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      hidePrevModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      // reset all
      isIndexed: false,
      fileName: null,
      isChangeFile: false,
      total_unique_address: 0,
      showWarningMsg: false,
      uploadStatus: "Uploading",
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
    if (!prevWallets[currentIndex].loadingNameTag) {
      this.handleSetNameTagLoadingTrue({
        id: name,
        address: value,
      });
    }
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 500);
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
      }
    }
  };
  handleSetNameTagLoadingFalse = (data) => {
    let newAddress = [...this.state.addWalletList];
    let index = this.state.addWalletList.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.addWalletList[index],
        loadingNameTag: false,
      };
    }
    this.setState({
      addWalletList: newAddress,
    });
  };
  handleSetNameTagLoadingTrue = (data) => {
    let newAddress = [...this.state.addWalletList];
    let index = this.state.addWalletList.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.addWalletList[index],
        loadingNameTag: true,
      };
    }
    this.setState({
      addWalletList: newAddress,
    });
  };
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.addWalletList];
    let index = this.state.addWalletList.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.addWalletList[index],
        nameTag: nameTag,
        loadingNameTag: false,
        showNameTag: true,
      };
    }
    this.setState({
      addWalletList: newAddress,
    });
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
    // new code added
    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound =
      newAddress[i].coins &&
      newAddress[i].coins.some((e) => e.chain_detected === true);
    newAddress[i].apiAddress = data?.apiaddress;

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
  componentDidUpdate(prevProps, prevState) {
    if (this.state.addWalletList !== prevState.addWalletList) {
      let chainNotDetected = false;

      this.state.addWalletList.forEach((indiWallet) => {
        let anyCoinPresent = false;
        if (
          indiWallet.coins &&
          indiWallet.coinFound &&
          indiWallet.coins.length > 0
        ) {
          indiWallet.coins.forEach((indiCoin) => {
            if (indiCoin?.chain_detected) {
              anyCoinPresent = true;
            }
          });
        }
        if (!anyCoinPresent) {
          chainNotDetected = true;
        }
      });

      if (chainNotDetected) {
        this.setState({
          disableGoBtn: true,
        });
      } else {
        this.setState({
          disableGoBtn: false,
        });
      }
    }
  }

  componentDidMount() {
    const ssItem = window.localStorage.getItem(
      "setMetamaskConnectedSessionStorage"
    );
    if (ssItem && ssItem !== null) {
      this.setState({
        metamaskWalletConnected: ssItem,
      });
    }

    // set popup active
    window.localStorage.setItem("isPopupActive", true);

    this.props.getAllCoins();
    this.props.getAllParentChains();
    //  this.makeApiCall();
    getAllWalletApi(this);
    this.props.getDetectedChainsApi(this);
    const fixWallet = [];
    JSON.parse(window.localStorage.getItem("addWallet"))?.map((e) => {
      // console.log("e fix wallet", e);
      if (e.coinFound !== true) {
        fixWallet.push({
          ...e,
          id: `wallet${fixWallet.length + 1}`,
          apiAddress: e?.address,
        });
      }
    });

    console.log("fixWallet", fixWallet);
    this.setState({
      fixWalletAddress: fixWallet,
    });
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
    this.props.getAllCoins();
    this.props.getAllParentChains();
    // //  this.makeApiCall();
    // getAllWalletApi(this);
    this.props.getDetectedChainsApi(this);
  }

  addAddress = () => {
    AddTextboxHome({
      session_id: getCurrentUser().id,
    });
    // console.log(this.state.addWalletList.length, this.state.total_addresses);
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
        apiAddress: "",
        showNameTag: true,
        nameTag: "",
        loadingNameTag: false,
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
      w.apiAddress = w.address;
    });

    this.setState(
      {
        addWalletList: this.state.addWalletList,
      },
      () => {
        let chainNotDetected = false;

        this.state.addWalletList.forEach((indiWallet) => {
          let anyCoinPresent = false;
          if (
            indiWallet.coins &&
            indiWallet.coinFound &&
            indiWallet.coins.length > 0
          ) {
            indiWallet.coins.forEach((indiCoin) => {
              if (indiCoin?.chain_detected) {
                anyCoinPresent = true;
              }
            });
          }
          if (!anyCoinPresent) {
            chainNotDetected = true;
          }
        });

        if (chainNotDetected) {
          this.setState({
            disableGoBtn: true,
          });
        } else {
          this.setState({
            disableGoBtn: false,
          });
        }
      }
    );
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
    // console.log(
    //   "add wallet list",
    //   this.state.total_addresses + this.state.addWalletList?.length >
    //     this.state.userPlan.wallet_address_limit,
    //   this.state.total_addresses , this.state.addWalletList?.length ,
    //     this.state.userPlan.wallet_address_limit
    // );
    if (
      this.state.total_addresses +
        this.state.addWalletList?.length -
        this.state.prevWalletAddress >
        this.state.userPlan.wallet_address_limit &&
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
          // if change not detected then we will detect on backend
          let isChainDetected = [];
          let total_address = 0;
          let walletList = [];
          for (let i = 0; i < this.state.addWalletList.length; i++) {
            let curr = this.state.addWalletList[i];
            // console.log(
            //   "current address",
            //   curr,
            //   "arr",
            //   arr,

            // );
            let isIncluded = false;
            const whatIndex = arr.findIndex(
              (resRes) =>
                resRes?.trim()?.toLowerCase() ===
                  curr?.address?.trim()?.toLowerCase() ||
                resRes?.trim()?.toLowerCase() ===
                  curr?.displayAddress?.trim()?.toLowerCase() ||
                resRes?.trim()?.toLowerCase() ===
                  curr?.apiAddress?.trim()?.toLowerCase()
            );
            if (whatIndex !== -1) {
              isIncluded = true;
            }
            if (!isIncluded && curr.address) {
              walletList.push(curr);
              arr.push(curr.address?.trim());
              nicknameArr[curr.address?.trim()] = curr.nickname;
              arr.push(curr.displayAddress?.trim());
              arr.push(curr.apiAddress?.trim());
              addressList.push(curr.address?.trim());
              //  console.log("curr add", curr.address, "dis", curr.displayAddress,"cur api", curr.apiAddress)
              isChainDetected.push(curr?.coinFound);
              total_address = total_address + 1;
            }
          }

          let chain_detechted =
            isChainDetected.includes(undefined) ||
            isChainDetected.includes(false)
              ? false
              : true;

          let addWallet = walletList;

          addWallet?.map((w, i) => {
            w.id = `wallet${i + 1}`;
          });
          if (addWallet) {
            this.props.setHeaderReducer(addWallet);
          }
          window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
          const data = new URLSearchParams();
          const yieldData = new URLSearchParams();
          // data.append("wallet_addresses", JSON.stringify(arr));
          data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
          data.append("wallet_addresses", JSON.stringify(addressList));
          yieldData.append("wallet_addresses", JSON.stringify(addressList));
          // data.append("chain_detected", chain_detechted);

          // if its upload then we pass user id
          if (this.state.isChangeFile) {
            data.append("user_id", getCurrentUser().id);
            this.setState({
              isChangeFile: false,
            });
          }
          let creditIsAddress = false;
          let creditIsEns = false;
          for (let i = 0; i < addressList.length; i++) {
            const tempItem = addressList[i];
            const endsWithEth = /\.eth$/i.test(tempItem);

            if (endsWithEth) {
              creditIsAddress = true;
              creditIsEns = true;
            } else {
              creditIsAddress = true;
            }
          }

          if (creditIsAddress) {
            // Single address
            const addressCreditScore = new URLSearchParams();
            addressCreditScore.append("credits", "address_added");
            this.props.addUserCredits(addressCreditScore);

            // Multiple address
            const multipleAddressCreditScore = new URLSearchParams();
            multipleAddressCreditScore.append(
              "credits",
              "multiple_address_added"
            );
            this.props.addUserCredits(multipleAddressCreditScore);
          }
          if (creditIsEns) {
            const ensCreditScore = new URLSearchParams();
            ensCreditScore.append("credits", "ens_added");
            this.props.addUserCredits(ensCreditScore);
          }
          this.props.updateUserWalletApi(data, this, yieldData);

          // message for user
          this.setState({
            total_unique_address: total_address,
          });

          if (!this.state.showWarningMsg) {
            this.state.onHide();
            // this.state.changeList && this.state.changeList(walletList);
          }
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
          if (this.props.from === "home") {
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
            if (this.props.updateTimer) {
              this.props.updateTimer();
            }
          } else if (this.props.from === "transaction history") {
            TransactionHistoryAddWallet({
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
            if (this.props.updateTimer) {
              this.props.updateTimer();
            }
          } else if (this.props.from === "cost") {
            CostAddWallet({
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
            if (this.props.updateTimer) {
              this.props.updateTimer();
            }
          } else if (this.props.from === "defi") {
            // TransactionHistoryAddWallet({
            //   session_id: getCurrentUser().id,
            //   email_address: getCurrentUser().email,
            //   addresses_added: address,
            //   ENS_added: address,
            //   addresses_deleted: addressDeleted,
            //   ENS_deleted: addressDeleted,
            //   unrecognized_addresses: unrecog_address,
            //   recognized_addresses: recog_address,
            //   blockchains_detected: blockchainDetected,
            //   nicknames: nicknames,
            // });
          } else if (this.props.from === "asset value") {
            AssetValueAddWallet({
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
            if (this.props.updateTimer) {
              this.props.updateTimer();
            }
          }
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
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      });

    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      let wallets = JSON.parse(window.localStorage.getItem("addWallet"));
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
        if (!newArr.includes(curr.address?.trim())) {
          walletList.push(curr);
          newArr.push(curr.address?.trim());
          nicknameArr[curr.address?.trim()] = curr.nickname;
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
          showNameTag: true,
          nameTag: "",
          loadingNameTag: false,
        });
      }
      if (walletList) {
        this.props.setHeaderReducer(walletList);
      }
      window.localStorage.setItem("addWallet", JSON.stringify(walletList));
      this.state.onHide();
      // console.log("new array", newArr);
      this.state.changeList && this.state.changeList(walletList);
      const data = new URLSearchParams();
      const yieldData = new URLSearchParams();
      yieldData.append("wallet_addresses", JSON.stringify(newArr));
      data.append("wallet_addresses", JSON.stringify(newArr));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      this.props.updateUserWalletApi(data, this, yieldData);
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
                    placeholder="Enter Private Nametag"
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
        <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
          {this.state.metamaskWalletConnected &&
          ((elem.displayAddress &&
            elem.displayAddress?.toLowerCase() ===
              this.state.metamaskWalletConnected?.toLowerCase()) ||
            (elem.address &&
              elem.address?.toLowerCase() ===
                this.state.metamaskWalletConnected?.toLowerCase())) ? (
            <Image
              key={index}
              className={`awOldDelBtn awOldWalletBtn`}
              src={WalletIcon}
            />
          ) : this.state.addWalletList.length > 1 ? (
            <Image
              key={index}
              className={`awOldDelBtn`}
              src={DeleteIcon}
              onClick={() => this.deleteAddress(index)}
            />
          ) : (
            <Image
              key={index}
              className={`awOldDelBtn fakeBtn`}
              src={DeleteIcon}
            />
          )}
          <div
            className={`awInputWrapper ${
              elem.address ? "isAwInputWrapperValid" : null
            }`}
          >
            {elem.showAddress && (
              <div className="awTopInputWrapper">
                <div className="awInputContainer">
                  <input
                    disabled={
                      (elem.displayAddress &&
                        elem.displayAddress ===
                          this.state.metamaskWalletConnected) ||
                      (elem.address &&
                        elem.address === this.state.metamaskWalletConnected)
                    }
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
                    onKeyDown={this.handleTabPress}
                    onFocus={(e) => {
                      // console.log(e);
                      this.FocusInInput(e);
                    }}
                  />
                </div>
                {this.state.addWalletList?.map((e, i) => {
                  if (
                    this.state.addWalletList[index].address &&
                    e.id === `wallet${index + 1}`
                  ) {
                    // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                    if (e.coinFound && e.coins.length > 0) {
                      return (
                        <CustomCoin
                          isStatic
                          coins={e.coins.filter((c) => c.chain_detected)}
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

            {(elem.displayAddress || elem.address) &&
              elem.coinFound &&
              elem.showNickname && (
                <div
                  className={`awBottomInputWrapper ${
                    elem.showAddress ? "mt-2" : ""
                  }`}
                >
                  {elem.showAddress && elem.loadingNameTag ? (
                    <div className="awBlockContainer">
                      <div className="awLable">Public Nametag</div>
                      <CustomCoin isStatic coins={null} isLoaded={false} />
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

                  <div className="awInputContainer">
                    {(elem.showAddress &&
                      elem.showNameTag &&
                      elem.nameTag &&
                      !elem.loadingNameTag) ||
                    (elem.showAddress && elem.loadingNameTag) ||
                    (elem.nickname && elem.nickname !== "") ? (
                      <div className="awLable">Private Nametag</div>
                    ) : null}
                    <input
                      // autoFocus
                      name={`wallet${index + 1}`}
                      value={elem.nickname || ""}
                      placeholder="Enter Private Nametag"
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
                        AddWalletAddressNickname({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          nickname: e.target?.value,
                          address: elem.address,
                        });
                        if (this.props.updateTimer) {
                          this.props.updateTimer();
                        }
                      }}
                    />
                  </div>
                  {!elem.showAddress &&
                    this.state.addWalletList?.map((e, i) => {
                      if (
                        this.state.addWalletList[index].address &&
                        e.id === `wallet${index + 1}`
                      ) {
                        // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                        if (e.coinFound && e.coins.length > 0) {
                          return (
                            <CustomCoin
                              isStatic
                              coins={e.coins.filter((c) => c.chain_detected)}
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
          </div>
        </div>
      );
    });

    return (
      <>
        {!this.state.hidePrevModal && (
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
              className={
                this.state.modalType === "addwallet" ? "add-wallet" : ""
              }
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
                      className={
                        "inter-display-medium f-s-13 lh-16 white op-8 "
                      }
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
                {!this.state.showWarningMsg ? (
                  <>
                    {this.state.modalType === "fixwallet" && (
                      <div className="fix-modal-input">{inputs}</div>
                    )}
                    {this.state.modalType === "addwallet" && (
                      <div className="addWalletWrapperContainerParent">
                        <div className="addWalletWrapperContainer">
                          {wallets}
                        </div>
                      </div>
                    )}

                    {this.state.addWalletList.length >= 0 &&
                      this.state.addWalletList?.length < 10 &&
                      this.state.modalType === "addwallet" && (
                        <div className="addAnotherBtnContainer">
                          <Button
                            className="grey-btn w-100"
                            onClick={this.addAddress}
                          >
                            <Image src={PlusIcon} /> Add another
                          </Button>

                          {/* {this.state.modalType === "addwallet" && (
                            <div style={{}} className="m-b-32">
                              <div
                                className="inter-display-semi-bold f-s-13 lh-16 black-191 upload-scv-btn"
                                onClick={this.handleUpload}
                              >
                                <input
                                  type="file"
                                  ref={this.fileInputRef}
                                  onChange={this.handleFileSelect}
                                  style={{ display: "none" }}
                                />
                                <Image
                                  src={UploadIcon}
                                  style={{
                                    width: "1.2rem",
                                    marginRight: "4px",
                                    marginBottom: "1px",
                                    filter: "brightness(0)",
                                  }}
                                />
                                Upload CSV / Text file
                              </div>
                            </div>
                          )} */}
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
                            ? this.isDisabled() || this.state.disableGoBtn
                            : this.isFixDisabled() || this.state.disableGoBtn
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
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#E5E5E680",
                          marginRight: "2rem",
                          borderRadius: "1.2rem",
                          padding: "1.1rem 1.6rem",
                        }}
                      >
                        <Image src={FileIcon} style={{ marginRight: "1rem" }} />
                        <h4 className="inter-display-medium f-s-13 lh-15 grey-7C7">
                          {this.state.fileName}
                        </h4>
                      </div>
                      <input
                        type="file"
                        ref={this.fileInputRef}
                        onChange={this.handleFileSelect}
                        style={{ display: "none" }}
                      />
                      <Button
                        className={`secondary-btn`}
                        type="button"
                        style={{
                          paddingLeft: "1.8rem",
                          paddingRight: "1.8rem",
                        }}
                        onClick={() => {
                          this.handleUpload();
                        }}
                      >
                        Change file
                      </Button>
                    </div>
                    {/* Loader */}
                    {!this.state.isIndexed && (
                      <>
                        <div className="upload-loader"></div>
                        <h4 className="inter-display-medium f-s-16 lh-19 grey-B0B m-t-20">
                          {this.state.uploadStatus}{" "}
                          {this.state.total_unique_address}{" "}
                          {this.state.total_unique_address > 0
                            ? "unique addresses"
                            : "unique address"}
                        </h4>
                      </>
                    )}
                    {/* Form */}
                    <>
                      <div
                        className="form-wrapper m-t-20"
                        style={{ margin: "2rem 10rem" }}
                      >
                        {/* <Image src={FileIcon} /> */}
                        {!this.state.emailAdded && !this.state.isIndexed && (
                          <h4 className="inter-display-medium f-s-16 lh-19 grey-969 m-b-20">
                            Don’t wait around if you don’t want to! We can
                            notify you when the indexing is complete.
                          </h4>
                        )}
                        {!this.state.emailAdded && !this.state.isIndexed && (
                          <div className="email-section">
                            <Form onValidSubmit={this.EmailNotification}>
                              <FormElement
                                valueLink={this.linkState(
                                  this,
                                  "email_notification"
                                )}
                                // label="Email Info"
                                required
                                validations={[
                                  {
                                    validate: FormValidator.isRequired,
                                    message: "",
                                  },
                                  {
                                    validate: FormValidator.isEmail,
                                    message: "Please enter valid email id",
                                  },
                                ]}
                                control={{
                                  type: CustomTextControl,
                                  settings: {
                                    placeholder: "Enter your email address",
                                  },
                                }}
                              />
                              <div className="save-btn-section">
                                <Button
                                  className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                                    this.state.email_notification
                                      ? "active"
                                      : ""
                                  }`}
                                  type="submit"
                                >
                                  Confirm
                                </Button>
                              </div>
                            </Form>
                          </div>
                        )}
                        {/* After email messgae */}
                        {(this.state.emailAdded || this.state.isIndexed) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              textAlign: "start",
                            }}
                          >
                            <Image
                              src={this.state.isIndexed ? CheckIcon : ClockIcon}
                              style={{
                                marginRight: "1rem",
                                position: "static",
                                width: "3rem",
                              }}
                            />
                            <h4 className="inter-display-medium f-s-16 lh-19 grey-969">
                              {this.state.isIndexed
                                ? "Great! Indexing is completed and your addresses has been added."
                                : "It takes some time to index the addresses, we will let you know when it’s done."}
                            </h4>
                          </div>
                        )}
                      </div>
                      {(this.state.emailAdded || this.state.isIndexed) && (
                        <Button
                          className="btn primary-btn m-t-12 m-b-20"
                          onClick={this.handleDone}
                        >
                          Done
                        </Button>
                      )}
                    </>
                  </div>
                )}
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
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => {
                          AnonymityWalletConnection({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                          });
                          if (this.props.updateTimer) {
                            this.props.updateTimer();
                          }
                        }}
                      />
                    </CustomOverlay>
                  </p>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={window.localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
            pname="fixAddModal"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
  MetamaskConnectedState: state.MetamaskConnectedState,
});
const mapDispatchToProps = {
  getAllCoins,
  detectCoin,
  updateWalletApi,
  getAllWalletApi,
  getAllParentChains,
  updateWalletListFlag,
  setHeaderReducer,
  updateUserWalletApi,
  getDetectedChainsApi,
  detectNameTag,
  addUserCredits,
};
FixAddModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(FixAddModal);
