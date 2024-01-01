import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import walletIconsWhite from "./../../assets/images/icons/wallet_icon_white.svg";
import ConnectIcons from "../../assets/images/icons/connect-icon-white.svg";
import personRounded from "../../assets/images/icons/person-rounded.svg";
import questionRoundedIcons from "../../assets/images/icons/question-rounded.svg";
import logo from "../../assets/images/logo-white.svg";
import TransactionTable from "../intelligence/TransactionTable";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  mobileCheck,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { getCurrentUser } from "../../utils/ManageToken";
import { API_LIMIT, BASE_URL_S3, SORT_BY_AMOUNT, START_INDEX } from "../../utils/Constant";
import {
  ActiveSmartMoneySidebarIcon,
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  TrendingWalletIcon,
} from "../../assets/images/icons";
import CaretUpGreen from "./../../assets/images/icons/caret-top-green.svg";
import CaretDownRed from "./../../assets/images/icons/carret-bottom-red.svg";
import { TrendingFireIcon } from "../../assets/images/icons";
import { Image } from "react-bootstrap";
import CheckboxCustomTable from "../common/customCheckboxTable";
import AuthSmartMoneyModal from "../smartMoney/AuthSmartMoneyModal";
import { connect } from "react-redux";

import {
  updateAddToWatchList,
} from "../watchlist/redux/WatchListApi";
import { getAllCurrencyRatesApi, updateWalletListFlag } from "../common/Api";
import {getSmartMoney} from './../smartMoney/Api'
class NewHome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
      showTrending: false,
      signInModalAnimation: true,
      signInModal: false,
      showClickSignInText: false,
      condition: [],
      sort: [{ key: SORT_BY_AMOUNT, value: false }],
      pageLimit:1,
      accountList: [],
      totalPage: 0,
      tableLoading: false,
      goToBottom: false,
    };
  }

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

  toggleShowTrendingAddress = () => {
    this.setState({ showTrending: !this.state.showTrending });
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

  openSignInOnclickModal = () => {
    this.setState(
      {
        showClickSignInText: true,
      },
      () => {
        this.showSignInModal();
      }
    );
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

  createEmptyUser = () => {
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    // this.props.createAnonymousUserSmartMoneyApi(data);
  };

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    setTimeout(() => {
      let data = new URLSearchParams();
      data.append("start", page * this.state.pageLimit);
      data.append("conditions", JSON.stringify(this.state.condition));
      data.append("limit", this.state.pageLimit);
      data.append("sorts", JSON.stringify(this.state.sort));
      this.props.getSmartMoney(data, this, this.state.pageLimit);
    }, 300);
  };

  componentDidMount() {
    getAllCurrencyRatesApi();
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
      this.createEmptyUser();
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
      search: `?p=${this.state.currentPage|| START_INDEX}`,
    });
    this.callApi(this.state.currentPage || START_INDEX);


    // this.startPageView();
    this.updateTimer(true);
  }

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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.signInModal !== this.state.signInModal
    ) {
      if (!this.state.signInModal) {
        this.setState({
          showClickSignInText: false,
        });
      }
    }
    if (prevState.blurTable !== this.state.blurTable) {
      this.callApi(this.state.currentPage || START_INDEX);
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
      prevState.tableLoading !== this.state.tableLoading &&
      this.state.goToBottom &&
      !this.state.tableLoading
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
    const trendingAddresses = [
      {
        address: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
        worth: 28891163.13,
        trimmedAddress: "0x51C...a7F",
        fullData: [
          {
            address: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
            apiAddress: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
            coinFound: [
              {
                chain_detected: true,
                coinCode: "ETH",
                coinName: "Ethereum",
                coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                coinColor: "#7B44DA",
              },
              {
                chain_detected: true,
                coinCode: "ARB",
                coinName: "Arbitrum",
                coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                coinColor: "#2C374B",
              },
              {
                chain_detected: true,
                coinCode: "AVAX",
                coinName: "Avalanche",
                coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                coinColor: "#E84042",
              },
              {
                chain_detected: true,
                coinCode: "BSC",
                coinName: "BSC",
                coinSymbol: "https://media.loch.one/loch-binance.svg",
                coinColor: "#F0B90B",
              },
              {
                chain_detected: true,
                coinCode: "CELO",
                coinName: "Celo",
                coinSymbol: "https://media.loch.one/loch-celo.svg",
                coinColor: "#F4CE6F",
              },
              {
                chain_detected: true,
                coinCode: "FTM",
                coinName: "Fantom",
                coinSymbol: "https://media.loch.one/loch-fantom.svg",
                coinColor: "#13B5EC",
              },
              {
                chain_detected: true,
                coinCode: "OP",
                coinName: "Optimism",
                coinSymbol: "https://media.loch.one/loch-optimism.svg",
                coinColor: "#FF0420",
              },
              {
                chain_detected: true,
                coinCode: "POLYGON",
                coinName: "Polygon",
                coinSymbol: "https://media.loch.one/loch-polygon.svg",
                coinColor: "#8247E5",
              },
              {
                chain_detected: false,
                coinCode: "LTC",
                coinName: "Litecoin",
                coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                coinColor: "#345D9D",
              },
              {
                chain_detected: false,
                coinCode: "SOL",
                coinName: "Solana",
                coinSymbol: "https://media.loch.one/loch-solana.svg",
                coinColor: "#5ADDA6",
              },
              {
                chain_detected: false,
                coinCode: "BTC",
                coinName: "Bitcoin",
                coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                coinColor: "#F19938",
              },
              {
                chain_detected: false,
                coinCode: "XLM",
                coinName: "Stellar",
                coinSymbol: "https://media.loch.one/loch-stellar.svg",
                coinColor: "#19191A",
              },
              {
                chain_detected: false,
                coinCode: "ALGO",
                coinName: "Algorand",
                coinSymbol: "https://media.loch.one/loch-algorand.svg",
                coinColor: "#19191A",
              },
              {
                chain_detected: false,
                coinCode: "TRX",
                coinName: "Tron",
                coinSymbol: "https://media.loch.one/loch-tron.svg",
                coinColor: "#FF060A",
              },
              {
                chain_detected: false,
                coinCode: "ADA",
                coinName: "Cardano",
                coinSymbol: "https://media.loch.one/loch-cardano.svg",
                coinColor: "#0033AD",
              },
            ],
            displayAddress: "",
            id: "wallet1",
            loadingNameTag: false,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: {},
          },
        ],
      },
      {
        address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
        worth: 38993631.363,
        trimmedAddress: "0xeB2...a4c",
        fullData: [
          {
            address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
            apiAddress: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
            coinFound: [
              {
                chain_detected: true,
                coinCode: "ETH",
                coinName: "Ethereum",
                coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                coinColor: "#7B44DA",
              },
              {
                chain_detected: true,
                coinCode: "ARB",
                coinName: "Arbitrum",
                coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                coinColor: "#2C374B",
              },
              {
                chain_detected: true,
                coinCode: "AVAX",
                coinName: "Avalanche",
                coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                coinColor: "#E84042",
              },
              {
                chain_detected: true,
                coinCode: "BSC",
                coinName: "BSC",
                coinSymbol: "https://media.loch.one/loch-binance.svg",
                coinColor: "#F0B90B",
              },
              {
                chain_detected: true,
                coinCode: "CELO",
                coinName: "Celo",
                coinSymbol: "https://media.loch.one/loch-celo.svg",
                coinColor: "#F4CE6F",
              },
              {
                chain_detected: true,
                coinCode: "FTM",
                coinName: "Fantom",
                coinSymbol: "https://media.loch.one/loch-fantom.svg",
                coinColor: "#13B5EC",
              },
              {
                chain_detected: true,
                coinCode: "OP",
                coinName: "Optimism",
                coinSymbol: "https://media.loch.one/loch-optimism.svg",
                coinColor: "#FF0420",
              },
              {
                chain_detected: true,
                coinCode: "POLYGON",
                coinName: "Polygon",
                coinSymbol: "https://media.loch.one/loch-polygon.svg",
                coinColor: "#8247E5",
              },
              {
                chain_detected: false,
                coinCode: "BTC",
                coinName: "Bitcoin",
                coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                coinColor: "#F19938",
              },
              {
                chain_detected: false,
                coinCode: "SOL",
                coinName: "Solana",
                coinSymbol: "https://media.loch.one/loch-solana.svg",
                coinColor: "#5ADDA6",
              },
              {
                chain_detected: false,
                coinCode: "LTC",
                coinName: "Litecoin",
                coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                coinColor: "#345D9D",
              },
              {
                chain_detected: false,
                coinCode: "ALGO",
                coinName: "Algorand",
                coinSymbol: "https://media.loch.one/loch-algorand.svg",
                coinColor: "#19191A",
              },
              {
                chain_detected: false,
                coinCode: "ADA",
                coinName: "Cardano",
                coinSymbol: "https://media.loch.one/loch-cardano.svg",
                coinColor: "#0033AD",
              },
              {
                chain_detected: false,
                coinCode: "TRX",
                coinName: "Tron",
                coinSymbol: "https://media.loch.one/loch-tron.svg",
                coinColor: "#FF060A",
              },
              {
                chain_detected: false,
                coinCode: "XLM",
                coinName: "Stellar",
                coinSymbol: "https://media.loch.one/loch-stellar.svg",
                coinColor: "#19191A",
              },
            ],
            displayAddress: "",
            id: "wallet1",
            loadingNameTag: false,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: {},
          },
        ],
      },
      {
        address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
        worth: 111935898.211,
        trimmedAddress: "0x36c...fc6",
        fullData: [
          {
            address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
            apiAddress: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
            coinFound: [
              {
                chain_detected: false,
                coinCode: "SOL",
                coinName: "Solana",
                coinSymbol: "https://media.loch.one/loch-solana.svg",
                coinColor: "#5ADDA6",
              },
              {
                chain_detected: false,
                coinCode: "LTC",
                coinName: "Litecoin",
                coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                coinColor: "#345D9D",
              },
              {
                chain_detected: false,
                coinCode: "BTC",
                coinName: "Bitcoin",
                coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                coinColor: "#F19938",
              },
              {
                chain_detected: false,
                coinCode: "ALGO",
                coinName: "Algorand",
                coinSymbol: "https://media.loch.one/loch-algorand.svg",
                coinColor: "#19191A",
              },
              {
                chain_detected: true,
                coinCode: "ETH",
                coinName: "Ethereum",
                coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                coinColor: "#7B44DA",
              },
              {
                chain_detected: true,
                coinCode: "ARB",
                coinName: "Arbitrum",
                coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                coinColor: "#2C374B",
              },
              {
                chain_detected: true,
                coinCode: "AVAX",
                coinName: "Avalanche",
                coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                coinColor: "#E84042",
              },
              {
                chain_detected: true,
                coinCode: "BSC",
                coinName: "BSC",
                coinSymbol: "https://media.loch.one/loch-binance.svg",
                coinColor: "#F0B90B",
              },
              {
                chain_detected: true,
                coinCode: "CELO",
                coinName: "Celo",
                coinSymbol: "https://media.loch.one/loch-celo.svg",
                coinColor: "#F4CE6F",
              },
              {
                chain_detected: true,
                coinCode: "FTM",
                coinName: "Fantom",
                coinSymbol: "https://media.loch.one/loch-fantom.svg",
                coinColor: "#13B5EC",
              },
              {
                chain_detected: true,
                coinCode: "OP",
                coinName: "Optimism",
                coinSymbol: "https://media.loch.one/loch-optimism.svg",
                coinColor: "#FF0420",
              },
              {
                chain_detected: true,
                coinCode: "POLYGON",
                coinName: "Polygon",
                coinSymbol: "https://media.loch.one/loch-polygon.svg",
                coinColor: "#8247E5",
              },
              {
                chain_detected: false,
                coinCode: "ADA",
                coinName: "Cardano",
                coinSymbol: "https://media.loch.one/loch-cardano.svg",
                coinColor: "#0033AD",
              },
              {
                chain_detected: false,
                coinCode: "TRX",
                coinName: "Tron",
                coinSymbol: "https://media.loch.one/loch-tron.svg",
                coinColor: "#FF060A",
              },
              {
                chain_detected: false,
                coinCode: "XLM",
                coinName: "Stellar",
                coinSymbol: "https://media.loch.one/loch-stellar.svg",
                coinColor: "#19191A",
              },
            ],
            displayAddress: "",
            id: "wallet1",
            loadingNameTag: false,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: {},
          },
        ],
      },
      {
        address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
        worth: 111935898.211,
        trimmedAddress: "0x36c...fc6",
        fullData: [
          {
            address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
            apiAddress: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
            coinFound: [
              {
                chain_detected: false,
                coinCode: "SOL",
                coinName: "Solana",
                coinSymbol: "https://media.loch.one/loch-solana.svg",
                coinColor: "#5ADDA6",
              },
              {
                chain_detected: false,
                coinCode: "LTC",
                coinName: "Litecoin",
                coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                coinColor: "#345D9D",
              },
              {
                chain_detected: false,
                coinCode: "BTC",
                coinName: "Bitcoin",
                coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                coinColor: "#F19938",
              },
              {
                chain_detected: false,
                coinCode: "ALGO",
                coinName: "Algorand",
                coinSymbol: "https://media.loch.one/loch-algorand.svg",
                coinColor: "#19191A",
              },
              {
                chain_detected: true,
                coinCode: "ETH",
                coinName: "Ethereum",
                coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                coinColor: "#7B44DA",
              },
              {
                chain_detected: true,
                coinCode: "ARB",
                coinName: "Arbitrum",
                coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                coinColor: "#2C374B",
              },
              {
                chain_detected: true,
                coinCode: "AVAX",
                coinName: "Avalanche",
                coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                coinColor: "#E84042",
              },
              {
                chain_detected: true,
                coinCode: "BSC",
                coinName: "BSC",
                coinSymbol: "https://media.loch.one/loch-binance.svg",
                coinColor: "#F0B90B",
              },
              {
                chain_detected: true,
                coinCode: "CELO",
                coinName: "Celo",
                coinSymbol: "https://media.loch.one/loch-celo.svg",
                coinColor: "#F4CE6F",
              },
              {
                chain_detected: true,
                coinCode: "FTM",
                coinName: "Fantom",
                coinSymbol: "https://media.loch.one/loch-fantom.svg",
                coinColor: "#13B5EC",
              },
              {
                chain_detected: true,
                coinCode: "OP",
                coinName: "Optimism",
                coinSymbol: "https://media.loch.one/loch-optimism.svg",
                coinColor: "#FF0420",
              },
              {
                chain_detected: true,
                coinCode: "POLYGON",
                coinName: "Polygon",
                coinSymbol: "https://media.loch.one/loch-polygon.svg",
                coinColor: "#8247E5",
              },
              {
                chain_detected: false,
                coinCode: "ADA",
                coinName: "Cardano",
                coinSymbol: "https://media.loch.one/loch-cardano.svg",
                coinColor: "#0033AD",
              },
              {
                chain_detected: false,
                coinCode: "TRX",
                coinName: "Tron",
                coinSymbol: "https://media.loch.one/loch-tron.svg",
                coinColor: "#FF060A",
              },
              {
                chain_detected: false,
                coinCode: "XLM",
                coinName: "Stellar",
                coinSymbol: "https://media.loch.one/loch-stellar.svg",
                coinColor: "#19191A",
              },
            ],
            displayAddress: "",
            id: "wallet1",
            loadingNameTag: false,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: {},
          },
        ],
      },
    ];
    const columnList = [
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Rank
            </span>
            {/* <Image
          src={sortByIcon}
          className={
            this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
          }
        /> */}
          </div>
        ),
        dataKey: "Numbering",
        coumnWidth: 0.09,
        isCell: true,
        cell: (rowData, dataKey, index) => {
          if (dataKey === "Numbering" && index > -1) {
            let rank = index + 1;
            if (rowData.rank) {
              rank = rowData.rank;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(rank)).toLocaleString("en-US")}
              >
                <span className="inter-display-medium f-s-13">
                  {Number(noExponents(rank)).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Wallet
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "account",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return (
              <span
                onClick={() => {
                  if (!this.state.blurTable) {
                    let lochUser = getCurrentUser().id;

                    let slink = rowData.account;
                    let shareLink =
                      BASE_URL_S3 + "home/" + slink + "?redirect=home";
                    if (lochUser) {
                      const alreadyPassed =
                        window.sessionStorage.getItem("PassedRefrenceId");
                      if (alreadyPassed) {
                        shareLink = shareLink + "&refrenceId=" + alreadyPassed;
                      } else {
                        shareLink = shareLink + "&refrenceId=" + lochUser;
                      }
                    }
                    // SmartMoneyWalletClicked({
                    //   session_id: getCurrentUser().id,
                    //   email_address: getCurrentUser().email,
                    //   wallet: slink,
                    //   isMobile: false,
                    // });
                    window.open(shareLink, "_blank", "noreferrer");
                  } else {
                    this.openSignInOnclickModal();
                  }
                }}
                className="top-account-address"
              >
                {TruncateText(rowData.account)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="tagName"
            // onClick={() => this.handleSort(this.state.tableSortOpt[5].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Nametag
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "tagName",

        coumnWidth: 0.222,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tagName") {
            return rowData.tagName ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.tagName}
              >
                <span
                  // onMouseEnter={() => {
                  //   SmartMoneyNameTagHover({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //     hover: rowData.tagName,
                  //   });
                  //   this.updateTimer();
                  // }}
                >
                  {rowData.tagName}
                </span>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="networth"
            // onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net worth
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "networth",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "networth") {
            let tempNetWorth = rowData.networth ? rowData.networth : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  amountFormat(tempNetWorth * tempCurrencyRate, "en-US", "USD")
                }
              >
                <div
                  // onMouseEnter={() => {
                  //   SmartMoneyNetWorthHover({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //     hover:
                  //       CurrencyType(false) +
                  //       numToCurrency(tempNetWorth * tempCurrencyRate),
                  //   });
                  //   this.updateTimer();
                  // }}
                  className="cost-common-container"
                >
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {CurrencyType(false) +
                      numToCurrency(tempNetWorth * tempCurrencyRate)}
                  </span>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className=" history-table-header-col no-hover" id="netflows">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Realized PnL (1yr)
            </span>
          </div>
        ),
        dataKey: "netflows",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "netflows") {
            let tempNetflows = rowData.netflows ? rowData.netflows : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempNetflows * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempNetflows * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    // onMouseEnter={() => {
                    //   SmartMoneyRealizedPNLHover({
                    //     session_id: getCurrentUser().id,
                    //     email_address: getCurrentUser().email,
                    //     hover:
                    //       tempNetflows * tempCurrencyRate
                    //         ? CurrencyType(false) +
                    //           amountFormat(
                    //             Math.abs(tempNetflows * tempCurrencyRate),
                    //             "en-US",
                    //             "USD"
                    //           )
                    //         : CurrencyType(false) + "0.00",
                    //   });
                    //   this.updateTimer();
                    // }}
                  >
                    {tempNetflows !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempNetflows < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false) +
                        numToCurrency(tempNetflows * tempCurrencyRate)}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="netflows"
            // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Unrealized PnL
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "profits",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "profits") {
            let tempProfits = rowData.profits ? rowData.profits : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempProfits * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempProfits * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    // onMouseEnter={() => {
                    //   SmartMoneyUnrealizedPNLHover({
                    //     session_id: getCurrentUser().id,
                    //     email_address: getCurrentUser().email,
                    //     hover:
                    //       tempProfits * tempCurrencyRate
                    //         ? CurrencyType(false) +
                    //           amountFormat(
                    //             Math.abs(tempProfits * tempCurrencyRate),
                    //             "en-US",
                    //             "USD"
                    //           )
                    //         : CurrencyType(false) + "0.00",
                    //   });
                    //   this.updateTimer();
                    // }}
                  >
                    {tempProfits !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempProfits < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false) +
                        numToCurrency(tempProfits * tempCurrencyRate)}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="netflows"
            // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Follow
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "following",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "following") {
            const handleOnClick = (addItem) => {
              if (!this.state.blurTable) {
                this.handleFollowUnfollow(
                  rowData.account,
                  addItem,
                  rowData.tagName
                );
              } else {
                this.openSignInOnclickModal();
              }
            };
            return (
              <CheckboxCustomTable
                handleOnClick={handleOnClick}
                isChecked={rowData.following}
                dontSelectIt={this.state.blurTable}
              />
            );
          }
        },
      },
      // {
      //   labelName: (
      //     <div
      //       className=" history-table-header-col no-hover"
      //       id="netflows"
      //       // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Unrealized
      //       </span>
      //       {/* <Image
      //         src={sortByIcon}
      //         className={
      //           this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
      //         }
      //       /> */}
      //     </div>
      //   ),
      //   dataKey: "returns",

      //   coumnWidth: 0.15,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "returns") {
      //       let tempReturns = rowData.returns ? rowData.returns : 0;
      //       let tempCurrencyRate = this.state.currency?.rate
      //         ? this.state.currency.rate
      //         : 0;
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={
      //             tempReturns * tempCurrencyRate
      //               ? amountFormat(
      //                   Math.abs(tempReturns * tempCurrencyRate),
      //                   "en-US",
      //                   "USD"
      //                 ) + "%"
      //               : "0.00%"
      //           }
      //         >
      //           <div className="gainLossContainer">
      //             <div
      //               className={`gainLoss `}
      //               onMouseEnter={() => {
      //                 SmartMoneyReturnHover({
      //                   session_id: getCurrentUser().id,
      //                   email_address: getCurrentUser().email,
      //                   hover:
      //                     tempReturns * tempCurrencyRate
      //                       ? amountFormat(
      //                           Math.abs(tempReturns * tempCurrencyRate),
      //                           "en-US",
      //                           "USD"
      //                         ) + "%"
      //                       : "0.00%",
      //                 });
      //                 this.updateTimer();
      //               }}
      //             >
      //               {tempReturns !== 0 ? (
      //                 <Image
      //                   style={{
      //                     height: "1.5rem",
      //                     width: "1.5rem",
      //                   }}
      //                   src={
      //                     tempReturns < 0
      //                       ? ArrowDownLeftSmallIcon
      //                       : ArrowUpRightSmallIcon
      //                   }
      //                   className="mr-2"
      //                 />
      //               ) : null}
      //               <span className="inter-display-medium f-s-13 lh-16 grey-313">
      //                 {numToCurrency(tempReturns * tempCurrencyRate) + "%"}
      //               </span>
      //             </div>
      //           </div>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
    ];

    return (
      <div className="new-homepage">
        <div className="new-homepage__header">
          <div className="new-homepage__header-container">
            <div className="d-flex justify-content-between">
              <div className="d-flex" style={{ gap: "12px" }}>
                <button className="new-homepage-btn new-homepage-btn--blur">
                  <img src={walletIconsWhite} alt="" />
                  Connect Wallet
                </button>
                <button className="new-homepage-btn new-homepage-btn--blur">
                  <img src={ConnectIcons} alt="" />
                  Connect Exchange
                </button>
              </div>
              <button
                className="new-homepage-btn new-homepage-btn--white"
                style={{ padding: "8px 12px" }}
              >
                <div
                  style={{
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    border: "1px solid #E5E5E6",
                  }}
                >
                  <img src={personRounded} alt="" />
                </div>
                Sign in
              </button>
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
                <p>
                  Don't worry. All your information remains private and
                  anonymous.
                </p>
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
              </div>
            </div>
          </div>
        </div>
        <div className="new-homepage__body">
          <div className="new-homepage__body-container">
            <div
              className="new-homepage__body-search"
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={this.toggleShowTrendingAddress}
            >
              Click me
            </div>
            {this.state.showTrending ? (
              <div className="new-homepage__body-trending-address">
                <div
                  className="d-flex"
                  style={{ alignItems: "center", gap: "8px" }}
                >
                  <img src={TrendingFireIcon} alt="" />
                  <div
                    style={{
                      color: "19191A",
                      fontSize: "16px",
                    }}
                  >
                    Trending addresses
                  </div>
                  <div
                    style={{
                      color: "#B0B1B3",
                      fontSize: "13px",
                    }}
                  >
                    Most-visited addresses in the last 24 hours
                  </div>
                </div>
                <div className="new-homepage__body-trending-address__address-wrapper">
                  {trendingAddresses.map((item, index) => (
                    <div className="trendingAddressesBlockItemContainer">
                      <div
                        onClick={() => {
                          // this.props.addTrendingAddress(index, false);
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
                          <div className="inter-display-medium f-s-13">
                            {item.trimmedAddress}
                          </div>
                          <div className="inter-display-medium f-s-11 lh-15 trendingAddressesBlockItemDataContainerAmount">
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

            <div className="new-homepage__body-content">
              <div className="new-homepage__body-content-table-header">
                <img src={ActiveSmartMoneySidebarIcon} alt="" />
                Loch’s Leaderboard
              </div>
              <div className="smartMoneyTable" style={{
                marginBottom:this.state.totalPage>1?"5rem":"0px"
              }}>
                <TransactionTable
                  openSignInOnclickModal={this.openSignInOnclickModal}
                  smartMoneyBlur={this.state.blurTable}
                  // blurButtonClick={this.showAddSmartMoneyAddresses}
                  isSmartMoney
                  noSubtitleBottomPadding
                  tableData={tableData}
                  columnList={columnList}
                  message={"No accounts found"}
                  totalPage={this.state.totalPage}
                  history={this.props.history}
                  location={this.props.location}
                  page={this.state.currentPage}
                  tableLoading={this.state.tableLoading}
                  onPageChange={this.onPageChange}
                  pageLimit={this.state.pageLimit}
                  changePageLimit={this.changePageLimit}
                  addWatermark
                  className={this.state.blurTable ? "noScroll" : ""}
                  onBlurSignInClick={this.showSignInModal}
                />

                {this.state.signInModal ? (
                  <AuthSmartMoneyModal
                    hideOnblur
                    showHiddenError
                    modalAnimation={this.state.signInModalAnimation}
                    show={this.state.signInModal}
                    onHide={this.hideSignInSignUpModal}
                    history={this.props.history}
                    modalType={"create_account"}
                    iconImage={SignInIcon}
                    hideSkip={true}
                    title="Sign in"
                    description={
                      this.state.showClickSignInText
                        ? "Sign in to access the smartest money on-chain"
                        : "Get right back into your account"
                    }
                    stopUpdate={true}
                    tracking="Sign in button"
                    goToSignUp={this.openSignUpModal}
                    showClickSignInText
                  />
                ) : null}
                {/* <div className="ShowDust">
                  <p
                    onClick={this.showDust}
                    className="inter-display-medium f-s-16 lh-19 cp grey-ADA"
                  >
                    {this.state.showDust
                      ? "Reveal dust (less than $1)"
                      : "Hide dust (less than $1)"}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => ({
  commonState: state.CommonState,
})

const mapDispatchToProps = {
  updateAddToWatchList,
  getSmartMoney,
  updateWalletListFlag
}

export default connect(mapStateToProps, mapDispatchToProps)(NewHome);