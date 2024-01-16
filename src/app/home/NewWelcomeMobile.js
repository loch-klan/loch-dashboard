import { ethers } from "ethers";
import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  ActiveSmartMoneySidebarIcon,
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  NewWelcomeAddAnotherPlusIcon,
  NewWelcomeCopyIcon,
  NewWelcomeTrashIcon,
  TrendingFireIcon,
  TrendingWalletIcon,
} from "../../assets/images/icons";
import ConnectIcons from "../../assets/images/icons/connect-icon-white.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import personRounded from "../../assets/images/icons/person-rounded.svg";
import questionRoundedIcons from "../../assets/images/icons/question-rounded.svg";
import logo from "../../assets/images/logo-white.svg";
import {
  API_LIMIT,
  BASE_URL_S3,
  SORT_BY_AMOUNT,
  START_INDEX,
} from "../../utils/Constant";
import {
  deleteToken,
  getCurrentUser,
  getToken,
  setLocalStoraage,
} from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  mobileCheck,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { BaseReactComponent } from "../../utils/form";
import CheckboxCustomTable from "../common/customCheckboxTable";
import TransactionTable from "../intelligence/TransactionTable";
import walletIconsWhite from "./../../assets/images/icons/wallet_icon_white.svg";

import {
  AddTextbox,
  ClickTrendingAddress,
  ConnectWalletButtonClickedWelcome,
  DeleteWalletAddress,
  EmailAddressAdded,
  LPC_Go,
  LPConnectExchange,
} from "../../utils/AnalyticsFunctions.js";
import {
  GetAllPlan,
  detectNameTag,
  getAllCurrencyRatesApi,
  setPageFlagDefault,
  updateUserWalletApi,
  updateWalletListFlag,
} from "../common/Api";
import ConnectModal from "../common/ConnectModal.js";
import {
  setHeaderReducer,
  setMetamaskConnectedReducer,
} from "../header/HeaderAction";
import { addExchangeTransaction } from "../home/Api";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllCoins,
  getAllParentChains,
  signIn,
  verifyUser,
} from "../onboarding/Api";
import { addUserCredits } from "../profile/Api.js";
import { updateAddToWatchList } from "../watchlist/redux/WatchListApi";
import {
  createAnonymousUserSmartMoneyApi,
  getSmartMoney,
} from "./../smartMoney/Api";
import Login from "./NewAuth/Login.js";
import Verify from "./NewAuth/Verify.js";
import NewHomeInputBlock from "./NewHomeInputBlock.js";
import MobileHome from "./MobileHome.js";
import Loading from "../common/Loading.js";
import SmartMoneyMobileBlock from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileBlock.js";
import LoginMobile from "./NewAuth/LoginMobile.js";
import SmartMoneyMobileModalContainer from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileModalContainer.js";
import VerifyMobile from "./NewAuth/VerifyMobile.js";
import OutsideClickHandler from "react-outside-click-handler";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination.js";

class NewWelcomeMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentMetamaskWallet: {},
      onboardingWalletAddress: [
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
      onboardingExchanges: null,
      onboardingConnectExchangeModal: false,
      addButtonVisible: false,
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
      isTrendingAddresses: false,
      signInModalAnimation: true,
      signInModal: false,
      showClickSignInText: false,
      condition: [],
      sort: [{ key: SORT_BY_AMOUNT, value: false }],
      pageLimit: 1,
      accountList: [],
      totalPage: 0,
      tableLoading: false,
      goToBottom: false,
      initialInput: false,
      isGoButtonsDisabled: false,
      isAddAnotherButtonsDisabled: false,
      authmodal: "",
      email: "",
      otp: "",
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
    };
  }

  toggleAuthModal = (val = "") => {
    this.setState({
      authmodal: val,
    });
  };

  showSignInModal = () => {
    this.setState({
      signInModal: true,
    });
  };
  hideSignInSignUpModal = () => {
    this.setState({
      signInModalAnimation: true,
      signInModal: false,
    });
  };
  openSignUpModal = () => {
    this.setState({
      signInModalAnimation: false,
      signInModal: false,
    });
  };
  handleOnChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      this.setState({
        isTrendingAddresses: false,
      });
    }
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
    }, 1000);
  };
  isDisabled = () => {
    let isDisableAddFlagCount = 0;
    let isDisableGoFlagCount = 0;

    this.state.walletInput?.forEach((e, eIndex) => {
      if (eIndex === this.state.walletInput.length - 1 && e.address === "") {
        isDisableGoFlagCount++;
      } else {
        let isDisableFlag = false;
        if (e.address) {
          e.coins.forEach((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = true;
              return;
            }
          });
        }
        if (isDisableFlag) {
          isDisableAddFlagCount++;
          isDisableGoFlagCount++;
        }
      }
    });
    if (
      this.state.walletInput.length > 0 &&
      isDisableGoFlagCount === this.state.walletInput.length
    ) {
      this.setState({
        isGoButtonsDisabled: false,
      });
    } else {
      this.setState({
        isGoButtonsDisabled: true,
      });
    }
    if (
      this.state.walletInput.length > 0 &&
      isDisableAddFlagCount === this.state.walletInput.length
    ) {
      this.setState({
        isAddAnotherButtonsDisabled: false,
      });
    } else {
      this.setState({
        isAddAnotherButtonsDisabled: true,
      });
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
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        nameTag: nameTag,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
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

  addTrendingAddress = (passedIndex, isMobile) => {
    const tempData = this.props.trendingAddresses[passedIndex].fullData;
    ClickTrendingAddress({
      session_id: getCurrentUser().id,
      address: this.props.trendingAddresses[passedIndex].address,
      isMobile: isMobile,
    });

    // New

    let walletAddress = [];
    let addWallet = tempData;
    let addWalletTemp = tempData;
    addWalletTemp?.forEach((w, i) => {
      w.id = `wallet${i + 1}`;
    });
    if (addWalletTemp && addWalletTemp.length > 0) {
      var mySet = new Set();

      const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
        if (filData?.address !== "") {
          if (mySet.has(filData.address.toLowerCase())) {
            return false;
          } else {
            mySet.add(filData.address.toLowerCase());
            return true;
          }
        }
        return false;
      });
      if (filteredAddWalletTemp) {
        setTimeout(() => {
          this.props.setHeaderReducer(filteredAddWalletTemp);
        }, 500);
      }
    }
    let finalArr = [];

    let addressList = [];

    let nicknameArr = {};

    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (
        !walletAddress.includes(curr.apiAddress?.trim()) &&
        curr.address?.trim()
      ) {
        finalArr.push(curr);
        walletAddress.push(curr.address?.trim());
        walletAddress.push(curr.displayAddress?.trim());
        walletAddress.push(curr.apiAddress?.trim());
        let address = curr.address?.trim();
        nicknameArr[address] = curr.nickname;
        addressList.push(curr.address?.trim());
      }
    }

    finalArr = finalArr?.map((item, index) => {
      return {
        ...item,
        id: `wallet${index + 1}`,
      };
    });
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
      window.sessionStorage.setItem("addAddressCreditOnce", true);
      if (addWallet.length > 1) {
        window.sessionStorage.setItem("addMultipleAddressCreditOnce", true);
      }
    }
    if (creditIsEns) {
      window.sessionStorage.setItem("addEnsCreditOnce", true);
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    this.props.createAnonymousUserApi(data, this, finalArr, null);
  };
  addAdressesGo = () => {
    let walletAddress = [];
    let addWallet = this.state.walletInput;
    let addWalletTemp = this.state.walletInput;
    addWalletTemp?.forEach((w, i) => {
      w.id = `wallet${i + 1}`;
    });
    if (addWalletTemp && addWalletTemp.length > 0) {
      var mySet = new Set();

      const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
        if (filData?.address !== "") {
          if (mySet.has(filData.address.toLowerCase())) {
            return false;
          } else {
            mySet.add(filData.address.toLowerCase());
            return true;
          }
        }
        return false;
      });
      if (filteredAddWalletTemp) {
        setTimeout(() => {
          this.props.setHeaderReducer(filteredAddWalletTemp);
        }, 500);
      }
    }
    let finalArr = [];

    let addressList = [];

    let nicknameArr = {};

    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (
        !walletAddress.includes(curr.apiAddress?.trim()) &&
        curr.address?.trim()
      ) {
        finalArr.push(curr);
        walletAddress.push(curr.address?.trim());
        walletAddress.push(curr.displayAddress?.trim());
        walletAddress.push(curr.apiAddress?.trim());
        let address = curr.address?.trim();
        nicknameArr[address] = curr.nickname;
        addressList.push(curr.address?.trim());
      }
    }

    finalArr = finalArr?.map((item, index) => {
      return {
        ...item,
        id: `wallet${index + 1}`,
      };
    });
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
      window.sessionStorage.setItem("addAddressCreditOnce", true);
      if (addWallet.length > 1) {
        window.sessionStorage.setItem("addMultipleAddressCreditOnce", true);
      }
    }
    if (creditIsEns) {
      window.sessionStorage.setItem("addEnsCreditOnce", true);
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    this.props.createAnonymousUserApi(data, this, finalArr, null);

    const address = finalArr?.map((e) => e.address);

    const unrecog_address = finalArr
      .filter((e) => !e.coinFound)
      .map((e) => e.address);

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

    LPC_Go({
      addresses: address,
      ENS: address,
      chains_detected_against_them: blockchainDetected,
      unrecognized_addresses: unrecog_address,
      unrecognized_ENS: unrecog_address,
      nicknames: nicknames,
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
          this,
          false,
          0,
          false,
          false
        );
      }
    }
  };
  nicknameOnChain = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;

      walletCopy[foundIndex].nickname = value;

      // walletCopy[foundIndex].trucatedAddress = value
    }

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

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };
  hideisTrendingAddressesAddress = () => {
    this.setState({ isTrendingAddresses: false });
  };
  showisTrendingAddressesAddress = () => {
    this.setState({ isTrendingAddresses: true });
  };
  showInitialInput = () => {
    this.setState({
      initialInput: true,
    });
  };
  hideInitialInput = () => {
    this.setState({
      initialInput: false,
    });
  };
  addInputField = () => {
    if (this.state.walletInput.length + 1 <= 10) {
      this.state.walletInput.push({
        id: `wallet${this.state.walletInput.length + 1}`,
        address: "",
        coins: [],
        nickname: "",
        showAddress: true,
        showNickname: true,
        showNameTag: true,
        nameTag: "",
      });
      this.setState(
        {
          walletInput: this.state.walletInput,
        },
        () => {
          document
            .getElementById(`newWelcomeWallet-${this.state.walletInput.length}`)
            .focus();
        }
      );
      AddTextbox({
        session_id: getCurrentUser().id,
      });
    }
  };
  deleteInputField = (index, wallet) => {
    this.state.walletInput?.splice(index, 1);
    this.state.walletInput?.map((w, i) => (w.id = `wallet${i + 1}`));
    DeleteWalletAddress({
      address: wallet.address,
    });
    this.setState(
      {
        walletInput: this.state.walletInput,
      },
      () => {
        if (this.state.walletInput.length === 1) {
          this.setState({
            addButtonVisible: this.state.walletInput.some((wallet) =>
              wallet.address ? true : false
            ),
          });
        }
        let chainNotDetected = false;

        this.state.walletInput.forEach((indiWallet) => {
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
  };
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      // this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("smartMoneyPageExpiryTime", tempExpiryTime);
  };

  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };

  handleFollowUnfollow = (walletAddress, addItem, tagName) => {
    let tempWatchListata = new URLSearchParams();
    if (addItem) {
      this.updateTimer();
      tempWatchListata.append("wallet_address", walletAddress);
      tempWatchListata.append("analysed", false);
      tempWatchListata.append("remarks", "");
      tempWatchListata.append("name_tag", tagName);
      this.props.updateAddToWatchList(tempWatchListata);
      const tempIsModalPopuRemoved = window.sessionStorage.getItem(
        "smartMoneyMobilePopupModal"
      );
      if (!tempIsModalPopuRemoved) {
        window.sessionStorage.setItem("smartMoneyMobilePopupModal", "true");
        this.setState({
          mobilePopupModal: true,
        });
      }
    } else {
      // this.updateTimer();
      tempWatchListata.append("address", walletAddress);
      // this.props.removeFromWatchList(tempWatchListata);
    }
  };

  callApi = (page = START_INDEX) => {
    // this.setState({ tableLoading: true });
    // setTimeout(() => {
    //   let data = new URLSearchParams();
    //   data.append("start", page * this.state.pageLimit);
    //   data.append("conditions", JSON.stringify(this.state.condition));
    //   data.append("limit", this.state.pageLimit);
    //   data.append("sorts", JSON.stringify(this.state.sort));
    //   this.props.getSmartMoney(data, this, this.state.pageLimit);
    // }, 300);
  };

  opneLoginModalForSmartMoney = () => {
    this.toggleAuthModal("login");
    this.setState({
      smartMoneyLogin: true,
    });
  };
  componentDidMount() {
    getAllCurrencyRatesApi();
    if (mobileCheck(true)) {
      this.setState({
        isMobileDevice: true,
      });
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    this.props.setHeaderReducer([]);
    this.setState({ startTime: new Date() * 1 });
    let currencyRates = JSON.parse(
      window.sessionStorage.getItem("currencyRates")
    );
    if (getToken()) {
      let isStopRedirect =
        window.sessionStorage.getItem("stop_redirect") &&
        JSON.parse(window.sessionStorage.getItem("stop_redirect"));
      if (isStopRedirect) {
        this.props.setPageFlagDefault();

        if (!mobileCheck()) {
          deleteToken();
        }
      } else {
        // check if user is signed in or not if yes reidrect them to home page if not delete tokens and redirect them to welcome page
        let user = window.sessionStorage.getItem("lochUser")
          ? JSON.parse(window.sessionStorage.getItem("lochUser"))
          : false;
        if (user) {
          if (!mobileCheck()) {
            deleteToken();
          } else {
            this.props.history.push("/home");
          }
        } else {
          this.props.setPageFlagDefault();
          if (!mobileCheck()) {
            deleteToken();
          }
          //  window.sessionStorage.setItem("defi_access", true);
          //  window.sessionStorage.setItem("isPopup", true);
          //  // window.sessionStorage.setItem("whalepodview", true);
          //  window.sessionStorage.setItem(
          //    "whalepodview",
          //    JSON.stringify({ access: true, id: "" })
          //  );
          // window.sessionStorage.setItem(
          //   "isSubmenu",
          //   JSON.stringify({
          //     me: false,
          //     discover: false,
          //     intelligence: false,
          //   })
          // );
          setLocalStoraage();
          let isRefresh = JSON.parse(window.sessionStorage.getItem("refresh"));
          if (!isRefresh) {
            window.sessionStorage.setItem("refresh", true);
            window.location.reload(true);
          }
        }
      }
    } else {
      this.props.setPageFlagDefault();
      if (!mobileCheck()) {
        deleteToken();
      }
      // window.sessionStorage.setItem("defi_access", true);
      // window.sessionStorage.setItem("isPopup", true);
      // // window.sessionStorage.setItem("whalepodview", true);
      // window.sessionStorage.setItem(
      //   "whalepodview",
      //   JSON.stringify({ access: true, id: "" })
      // );
      // // window.sessionStorage.setItem("isSubmenu", false);
      //  window.sessionStorage.setItem(
      //    "isSubmenu",
      //    JSON.stringify({
      //      me: false,
      //      discover: false,
      //      intelligence: false,
      //    })
      //  );
      setLocalStoraage();
      let isRefresh = JSON.parse(window.sessionStorage.getItem("refresh"));
      if (!isRefresh) {
        window.sessionStorage.setItem("refresh", true);
        window.location.reload(true);
      }
    }
    // For input
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
    });

    this.props.getAllCoins();
    this.props.getAllParentChains();
    this.setState({
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });

    this.props.GetAllPlan();

    // For smart money

    let token = window.sessionStorage.getItem("lochToken");
    let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));

    if (token && lochUser && lochUser.email) {
      this.setState({
        blurTable: false,
      });
    } else {
      this.setState({
        blurTable: true,
      });
    }

    if (API_LIMIT) {
      if (mobileCheck()) {
        this.setState({
          pageLimit: 5,
        });
      } else {
        this.setState({
          pageLimit: API_LIMIT,
        });
      }
    }
    // window.sessionStorage.setItem("previewAddress", "");
    this.props.history.replace({
      search: `?p=${this.state.currentPage || START_INDEX}`,
    });
    this.callApi(this.state.currentPage || START_INDEX);

    // this.startPageView();
    this.updateTimer(true);
  }

  checkUser = () => {
    let token = window.sessionStorage.getItem("lochToken");
    let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (token && lochUser && lochUser.email) {
      return true;
    } else {
      return false;
    }
  };

  handleSubmitEmail = (val = false) => {
    if (this.state.email) {
      const data = new URLSearchParams();
      data.append("email", this.state.email);
      EmailAddressAdded({ email_address: this.state.email, session_id: "" });
      signIn(this, data, true, val);
      // this.toggleAuthModal('verify');
    }
  };

  handleSubmitOTP = () => {
    if (this.state.otp && this.state.otp.length > 5) {
      const data = new URLSearchParams();
      data.append("email", this.state.email);
      data.append("otp_token", this.state.otp);
      this.props.verifyUser(this, data, true, this.state.smartMoneyLogin);
    }
  };

  changePageLimit = (dropdownResponse) => {
    const tempHolder = dropdownResponse.split(" ");
    if (tempHolder && tempHolder.length > 1) {
      const params = new URLSearchParams(this.props.location.search);
      params.set("p", 0);
      if (this.props.history) {
        this.props.history.push(
          `${this.props.history.location.pathname}?${params}`
        );
      }
      // SmartMoneyChangeLimit({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      //   wallet: tempHolder[1],
      // });
      this.setState({
        pageLimit: tempHolder[1],
      });
    }
  };
  connectWalletEthers = async () => {
    ConnectWalletButtonClickedWelcome({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        const tempRes = await provider.send("eth_requestAccounts", []);

        if (tempRes && tempRes.length > 0) {
          window.sessionStorage.setItem("connectWalletCreditOnce", true);
          this.addToList(tempRes);
        }
      } catch (error) {
        console.log("ethers error ", error);
      }
    }
  };
  addToList = (addThese) => {
    const curItem = addThese[0];

    if (curItem) {
      this.setState(
        {
          currentMetamaskWallet: {
            address: curItem,
            coinFound: true,
            coins: [],
            displayAddress: curItem,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: null,
          },
        },
        () => {
          this.getCoinBasedOnLocalWallet("randomName", curItem);
        }
      );
    }
  };
  getCoinBasedOnLocalWallet = (name, value) => {
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
          this,
          false,
          0,
          true,
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
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );

    let newAddress = this.state.currentMetamaskWallet;
    data.address === newAddress.address &&
      newAddress.coins.push(...newCoinList);
    // new code added
    // if (data.id === newAddress.id) {
    //   newAddress.address = data.address;
    // }

    newAddress.coinFound =
      newAddress.coins &&
      newAddress.coins.some((e) => e.chain_detected === true);
    newAddress.apiAddress = data?.apiaddress;

    this.setState(
      {
        currentMetamaskWallet: newAddress,
      },
      () => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.callUpdateApi(this.state.currentMetamaskWallet);
        }, 2000);
      }
    );
  };
  callUpdateApi = (passedItem) => {
    let walletAddress = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
    if (walletAddress) {
      walletAddress.forEach((curr) => {
        let isIncluded = false;
        const whatIndex = arr.findIndex(
          (resRes) =>
            resRes.address?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase() ||
            resRes.address?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase()
        );
        if (whatIndex !== -1) {
          isIncluded = true;
        }
        if (!isIncluded && curr.address) {
          walletList.push(curr);
          arr.push(curr.address?.trim());
          nicknameArr[curr.address?.trim()] = curr.nickname;
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.address?.trim());
          addressList.push(curr.address?.trim());
        }
      });
    }
    if (passedItem) {
      if (passedItem.address) {
        // TopBarMetamaskWalletConnected({
        //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
        //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
        //   address: passedItem.address,
        // });

        this.props.setMetamaskConnectedReducer(passedItem.address);
        window.sessionStorage.setItem(
          "setMetamaskConnectedSessionStorage",
          passedItem.address
        );
      }
      if (!arr.includes(passedItem.address?.trim()) && passedItem.address) {
        walletList.push(passedItem);
        arr.push(passedItem.address?.trim());
        nicknameArr[passedItem.address?.trim()] = passedItem.nickname;
        arr.push(passedItem.displayAddress?.trim());
        arr.push(passedItem.address?.trim());
        addressList.push(passedItem.address?.trim());
      }
    }
    let addWallet = walletList.map((w, i) => {
      return {
        ...w,
        id: `wallet${i + 1}`,
      };
    });
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));

    this.props.createAnonymousUserApi(data, this, addWallet, null);
    // this.props.updateUserWalletApi(data, this, yieldData);
  };
  onboardingShowConnectModal = (
    address = this.state.onboardingWalletAddress
  ) => {
    this.setState(
      {
        onboardingConnectExchangeModal: true,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange();
        }
      }
    );
  };
  hideOnboardingShowPrevModal = () => {
    this.setState({
      onboardingConnectExchangeModal: false,
    });
  };
  onboardingHandleUpdateConnect = (
    exchanges = this.state.onboardingExchanges
  ) => {
    this.setState({
      onboardingExchanges: exchanges,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.signInModal !== this.state.signInModal) {
      if (!this.state.signInModal) {
        this.setState({
          showClickSignInText: false,
        });
      }
    }
    if (prevState.blurTable !== this.state.blurTable) {
      this.callApi(this.state.currentPage || START_INDEX);
    }
    if (this.state.walletInput !== prevState.walletInput) {
      this.isDisabled();
    }
    if (!this.props.commonState.smart_money) {
      let token = window.sessionStorage.getItem("lochToken");
      this.props.updateWalletListFlag("smart_money", true);
      let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (token && lochUser && lochUser.email) {
        this.setState({
          blurTable: false,
        });
      } else {
        this.setState({
          blurTable: true,
        });
      }
    }
    if (
      prevProps.tableLoading !== this.props.tableLoading &&
      this.state.goToBottom &&
      !this.props.tableLoading
    ) {
      this.setState(
        {
          goToBottom: false,
        },
        () => {
          window.scroll(0, document.body.scrollHeight);
        }
      );
    }
    // chain detection
    // if (prevState?.walletInput !== this.state.walletInput) {
    // }
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);
    if (!this.state.currency && window.sessionStorage.getItem("currency")) {
      this.setState({
        currency: JSON.parse(window.sessionStorage.getItem("currency")),
      });
    }
    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort ||
      prevState.pageLimit !== this.state.pageLimit
    ) {
      this.callApi(page);
      this.setState({
        currentPage: page,
      });
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          // SmartMoneyPagePrev({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        } else if (prevPage + 1 === page) {
          // SmartMoneyPageNext({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        } else {
          // SmartMoneyPageSearch({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        }
      }
    }
  }

  render() {
    const tableData = this.state.accountList;


    return (
      <div className="new-homepage new-homepage-mobile">
        {
            this.state.authmodal=='login'
            ?
            // <SmartMoneyMobileModalContainer
            // onHide={this.toggleAuthModal}
            // >
                <LoginMobile
                toggleModal={this.toggleAuthModal}
                smartMoneyLogin={this.state.smartMoneyLogin}
                isMobile
                email={this.state.email}
                handleChangeEmail={(val) => {
                    this.setState({
                        email: val,
                    });
                }}
                handleSubmitEmail={this.handleSubmitEmail}
                show={this.state.authmodal == "login"}
                />
            // </SmartMoneyMobileModalContainer>
            :
            this.state.authmodal=='verify'
            ?
            <VerifyMobile
            isMobile
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "verify"}
            handleSubmitEmail={this.handleSubmitEmail}
            otp={this.state.otp}
            handleChangeOTP={(val) => {
              this.setState({
                otp: val,
              });
            }}
            handleSubmitOTP={this.handleSubmitOTP}
            />
            :
            null
        }
        <div className="new-homepage__header new-homepage__header-mobile">
          <div className="new-homepage__header-container new-homepage__header-container-mobile">
            <div className="d-flex justify-content-end">
              {this.checkUser() ? null : (
                <button
                  className="new-homepage-btn new-homepage-btn--white"
                  style={{ padding: "8px 12px" }}
                  onClick={() => {
                    this.toggleAuthModal("login");
                    this.setState({
                      smartMoneyLogin: false,
                    });
                  }}
                >
                  <div
                    className="new-homepage-btn new-homepage-btn-singin-icon"
                  >
                    <img src={personRounded} alt="" />
                  </div>
                  Sign in
                </button>
              )}
            </div>
            <div className="new-homepage__header-title-wrapper">
              <img src={logo} style={{ width: "140px" }} alt="" />
              <div
                className="d-flex"
                style={{
                  alignItems: "center",
                  opacity: "0.5",
                  fontSize: "13px",
                  gap: "6px",
                }}
              >
                <p style={{textAlign:'center'}}>
                  Don't worry. &nbsp;
                  <CustomOverlay
                  text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                  position="top"
                  isIcon={true}
                  IconImage={LockIcon}
                  isInfo={true}
                  className={"fix-width"}
                >
                  <img
                    src={questionRoundedIcons}
                    alt=""
                    style={{ cursor: "pointer" }}
                  />
                </CustomOverlay>
                <br />
                   All your information remains private and
                  anonymous.
                </p>
                
              </div>
            </div>
          </div>
        </div>
        <div className="new-homepage__body new-homepage__body-mobile">
          <div className="new-homepage__body-container new-homepage__body-container-mobile">
          <OutsideClickHandler onOutsideClick={()=>{
                this.setState({isTrendingAddresses:false})
                if(this.state?.walletInput && this.state.walletInput?.length && !this.state?.walletInput[this.state.walletInput?.length - 1]?.address){
                  this.setState({initialInput:false})
                }
              }}>
            {this.state.initialInput ? (
              <>
                {this.state.walletInput?.map((c, index) => {
                  if (index !== this.state.walletInput.length - 1) {
                    return null;
                  }
                  return (
                    <div className="new-homepage__body-search_input_body_main_container">
                      <NewHomeInputBlock
                      hideMore
                      isMobile
                        c={c}
                        index={index}
                        walletInput={this.state.walletInput}
                        nicknameOnChain={this.nicknameOnChain}
                        handleOnChange={this.handleOnChange}
                        showisTrendingAddressesAddress={
                          this.showisTrendingAddressesAddress
                        }
                        FocusInInput={this.FocusInInput}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="new-homepage__body-search new-homepage__body-search-mobile">
                <div
                  onClick={this.showInitialInput}
                  className="new-homepage__body-search_preview"
                >
                  <Image
                    src={NewWelcomeCopyIcon}
                    className="new-homepage__body-search-copy-icon"
                  />
                  <div className="new-homepage__body-search-paste-text">
                  Paste any wallet address or ENS
                  </div>
                </div>
              </div>
            )}
            {this.state.walletInput &&
            !this.state.walletInput[0].address &&
            this.state.walletInput.length === 1 &&
            this.state.isTrendingAddresses ? (
              <div className="new-homepage__body-trending-address new-homepage__body-trending-address-mobile" style={{top:'86px'}}>
                <div
                  className="d-flex"
                  style={{ alignItems: "start",flexDirection:'column', gap: "8px" }}
                >
                  <img src={TrendingFireIcon} alt="" />
                  <div
                    style={{
                      color: "#19191A",
                      fontSize: "16px",
                      fontWeight:'500'
                    }}
                  >
                    Trending addresses
                  </div>
                  <div
                    style={{
                      color: "#B0B1B3",
                      fontSize: "13px",
                      fontWeight:'500'
                    }}
                  >
                    Most-visited addresses in the last 24 hours
                  </div>
                </div>
                <div className="new-homepage__body-trending-address__address-wrapper new-homepage__body-trending-address__address-wrapper-mobile">
                  {this.props.trendingAddresses.map((item, index) => (
                    <div className="trendingAddressesBlockItemContainer trendingAddressesBlockItemContainer-mobile">
                      <div
                        onClick={() => {
                          this.addTrendingAddress(index, false);
                        }}
                        className="trendingAddressesBlockItem"
                      >
                        <div className="trendingAddressesBlockItemWalletContainer">
                          <Image
                            className="trendingAddressesBlockItemWallet"
                            src={TrendingWalletIcon}
                          />
                        </div>
                        <div className="trendingAddressesBlockItemDataContainer">
                          <div className="inter-display-medium f-s-16">
                            {item.trimmedAddress}
                          </div>
                          <div className="inter-display-medium f-s-13 lh-15 trendingAddressesBlockItemDataContainerAmount">
                            $
                            {numToCurrency(
                              item.worth.toFixed(2)
                            ).toLocaleString("en-US")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            </OutsideClickHandler>

            {this.state.walletInput &&
            !this.state.walletInput[0].address &&
            this.state.walletInput.length === 1 ? (
              <div className="new-homepage__body-content new-homepage__body-content-mobile">
                <div className="new-homepage__body-content-table-header new-homepage__body-content-table-header-mobile">
                  <img src={ActiveSmartMoneySidebarIcon} alt="" />
                  Loch’s Leaderboard
                </div>
                {/* <p className="new-homepage__body-content-table-header__subtitle-mobile">
                    The lazy analyst’s guide to alpha
                </p> */}
                {this.props.tableLoading ? (
                  <div
                    style={{
                      background: "white",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "100px 0",
                      marginTop:'1rem',
                      borderRadius:'10px'
                    }}
                  >
                    <Loading />
                  </div>
                ) : (
                  <>
                    {
                    this.props.accountList && this.props.accountList.length > 0 ? (
                        <div className="mobileSmartMoneyListContainer">
                          {this.props.accountList.map((mapData) => {
                            let tempCurrencyRate = this.props.currency?.rate
                              ? this.props.currency.rate
                              : 0;
          
                            let tempNetWorth = mapData.networth ? mapData.networth : 0;
                            let tempNetflows = mapData.netflows ? mapData.netflows : 0;
                            let tempProfits = mapData.profits ? mapData.profits : 0;
                            let tempReturns = mapData.returns ? mapData.returns : 0;
          
                            let netWorth = tempNetWorth * tempCurrencyRate;
                            let netFlows = tempNetflows * tempCurrencyRate;
                            let profits = tempProfits * tempCurrencyRate;
                            let returns = tempReturns * tempCurrencyRate;
                            return (
                              <SmartMoneyMobileBlock
                                netWorth={netWorth}
                                netFlows={netFlows}
                                profits={profits}
                                returns={returns}
                                mapData={mapData}
                                // handleFollowUnfollow={this.props.handleFollowUnfollow}
                                openSignInOnclickModal={this.opneLoginModalForSmartMoney}
                                smartMoneyBlur={this.props.blurTable}
                                welcomePage
                              />
                            );
                          })}
                        </div>
                      ) : null
                      }
                      {this.props.accountList && this.props.accountList.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                pageLimit={this.props.pageLimit}
                changePageLimit={this.props.changePageLimit}
                onPageChange={this.props.onPageChange}
                openSignInOnclickModal={this.opneLoginModalForSmartMoney}
                smartMoneyBlur={this.props.blurTable}
                isMobile
              />
            ) : null}
                      </>
                )}
              </div>
            ) : (
              <div
                // style={{
                //   marginTop:
                //     this.state.walletInput &&
                //     this.state.walletInput[this.state.walletInput.length - 1]
                //       .showNickname &&
                //     this.state.walletInput[this.state.walletInput.length - 1]
                //       .coinFound
                //       ? "-25px"
                //       : "-15px",
                // }}
                style={{
                  marginTop:'20px'
                }}
              >
                 <div className="newHomeAddAnotherGoContainer newHomeAddAnotherGoContainer-mobile inter-display-regular">
                  {this.state.walletInput.length < 10 ? (
                    <button
                      onClick={this.addInputField}
                      className="newHomeAddAnotherGoBtns newHomeAddAnotherBtn"
                      disabled={this.state.isAddAnotherButtonsDisabled}
                    >
                      <Image
                        className="newHomeAddAnotherGoBtnsPlusIcon"
                        src={NewWelcomeAddAnotherPlusIcon}
                      />
                      Add another
                    </button>
                  ) : null}
                  <button
                    onClick={this.addAdressesGo}
                    disabled={this.state.isGoButtonsDisabled}
                    className="newHomeAddAnotherGoBtns newHomeGoBtn"
                  >
                    Go
                  </button>
                </div>

                {this.state.walletInput && this.state.walletInput.length > 1 ? (
                  <div
                    style={{
                      marginBottom:
                        this.state.walletInput &&
                        this.state.walletInput[
                          this.state.walletInput.length - 1
                        ].showNickname &&
                        this.state.walletInput[
                          this.state.walletInput.length - 1
                        ].coinFound
                          ? "32px"
                          : "25px",
                          overflow:'visible'
                    }}
                    className="newWelcomeAddedAddresses newWelcomeAddedAddresses-mobile"
                  
                  >
                    {this.state.walletInput?.map((c, index) => {
                      if (index === this.state.walletInput.length - 1) {
                        return null;
                      }
                      return (
                        <div
                          style={{
                            marginTop: index > 0 ? "1rem" : "",
                            position:'relative',
                            overflow:'visible'
                          }}
                          className="newWelcomeAddedAddressesBlockContainer"
                        >
                          <div
                            onClick={() => this.deleteInputField(index, c)}
                            className="new-welcome-adrress-block-delete-btn-mobile"
                          >
                            <Image
                              className="newWelcomeAddedAddressesBlockDel"
                              style={{
                                height:'15px',
                                width:'15px'
                              }}
                              src={NewWelcomeTrashIcon}
                            />
                          </div>
                          <NewHomeInputBlock
                          hideMore
                            isMobile
                            isList
                            c={c}
                            index={index}
                            walletInput={this.state.walletInput}
                            nicknameOnChain={this.nicknameOnChain}
                            handleOnChange={this.handleOnChange}
                            FocusInInput={this.FocusInInput}
                            showisTrendingAddressesAddress={
                              this.showisTrendingAddressesAddress
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  commonState: state.CommonState,
  OnboardingState: state.OnboardingState,
});

const mapDispatchToProps = {
  getSmartMoney,
  updateAddToWatchList,
  updateWalletListFlag,
  getAllCoins,
  detectCoin,
  detectNameTag,
  createAnonymousUserApi,
  getAllParentChains,
  setHeaderReducer,
  updateUserWalletApi,
  GetAllPlan,
  addExchangeTransaction,
  addUserCredits,
  createAnonymousUserSmartMoneyApi,
  verifyUser,
  setMetamaskConnectedReducer,
  setPageFlagDefault,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewWelcomeMobile);
