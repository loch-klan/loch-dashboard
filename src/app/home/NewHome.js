import PropTypes from "prop-types";
import React, { Component } from "react";
import { BaseReactComponent } from "../../utils/form";
import walletIconsWhite from "./../../assets/images/icons/wallet_icon_white.svg";
import ConnectIcons from "../../assets/images/icons/connect-icon-white.svg";
import personRounded from "../../assets/images/icons/person-rounded.svg";
import questionRoundedIcons from "../../assets/images/icons/question-rounded.svg";
import logo from "../../assets/images/logo-white.svg";
import TransactionTable from "../intelligence/TransactionTable";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { getCurrentUser } from "../../utils/ManageToken";
import { BASE_URL_S3 } from "../../utils/Constant";
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
export default class NewHome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
      showTrending: false,
    };
  }

  toggleShowTrendingAddress = () => {
    this.setState({ showTrending: !this.state.showTrending });
  }

  render() {
    const tableData = [
      {
        address: "0xE806f01f1aB602C26Cc28e75164893359C04b38A",
        following: false,
        name_tag: "IMX pre-pump buyer",
        net_flow: -24240567,
        net_worth: 44342237.5,
        profits: 20100939,
        rank: 1,
        returns: 82.9,
      },
      {
        address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
        following: false,
        name_tag: "@smartestmoney_",
        net_flow: 15124978.820000052,
        net_worth: 37977620.58846074,
        profits: 5733036.8,
        rank: 2,
        returns: 1.34,
      },
      {
        address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
        following: false,
        name_tag: "@Titanium_32",
        net_flow: 25259696.169999957,
        net_worth: 36555007.19177624,
        profits: -35319087.7,
        rank: 3,
        returns: -2.44,
      },
      {
        address: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
        following: false,
        name_tag: "",
        net_flow: -1673050000,
        net_worth: 32134545.409,
        profits: 3207340,
        rank: 4,
        returns: 11.06,
      },
      {
        address: "0x4EE79E19c9c398e364d135F01B25DcCC0473047c",
        following: false,
        name_tag: "@0xvladilena",
        net_flow: 5854883.2700000405,
        net_worth: 18728616.905514523,
        profits: 4372480.7,
        rank: 5,
        returns: 0.81,
      },
    ];
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
    ]
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
        coumnWidth: 0.08,
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
        dataKey: "address",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "address") {
            return (
              <span
                onClick={() => {
                  // if (!this.state.blurTable) {
                  //   let lochUser = getCurrentUser().id;
                  //   let slink = rowData.account;
                  //   let shareLink =
                  //     BASE_URL_S3 + "home/" + slink + "?redirect=home";
                  //   if (lochUser) {
                  //     const alreadyPassed =
                  //       window.sessionStorage.getItem("PassedRefrenceId");
                  //     if (alreadyPassed) {
                  //       shareLink = shareLink + "&refrenceId=" + alreadyPassed;
                  //     } else {
                  //       shareLink = shareLink + "&refrenceId=" + lochUser;
                  //     }
                  //   }
                  //   // SmartMoneyWalletClicked({
                  //   //   session_id: getCurrentUser().id,
                  //   //   email_address: getCurrentUser().email,
                  //   //   wallet: slink,
                  //   //   isMobile: false,
                  //   // });
                  //   // window.open(shareLink, "_blank", "noreferrer");
                  // }
                  // else {
                  //   this.openSignInOnclickModal();
                  // }
                }}
                className="top-account-address"
              >
                {TruncateText(rowData.address)}
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
        dataKey: "name_tag",

        coumnWidth: 0.222,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "name_tag") {
            return rowData.name_tag ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.name_tag}
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
                  {rowData.name_tag}
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
        dataKey: "net_worth",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "net_worth") {
            let tempNetWorth = rowData.net_worth ? rowData.net_worth : 0;
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
                  <span className="new-hompeage__body__badge new-hompeage__body__badge--gray">
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
              Net Flows
            </span>
          </div>
        ),
        dataKey: "net_flow",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "net_flow") {
            let tempNetflows = rowData.net_flow ? rowData.net_flow : 0;
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
                    <span
                      className={`new-hompeage__body__badge ${
                        tempNetflows == 0
                          ? "new-hompeage__body__badge--gray"
                          : tempNetflows > 0
                          ? "new-hompeage__body__badge--success"
                          : "new-hompeage__body__badge--danger"
                      }`}
                    >
                      {tempNetflows !== 0 ? (
                        <img
                          style={{
                            width:'7px'
                          }}
                          src={tempNetflows < 0 ? CaretDownRed : CaretUpGreen}
                          className="mr-2"
                        />
                      ) : null}
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
          <div className=" history-table-header-col no-hover" id="netflows">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Profit
            </span>
          </div>
        ),
        dataKey: "profits",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "profits") {
            let tempNetflows = rowData.profits ? rowData.profits : 0;
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
                    <span
                      className={`new-hompeage__body__badge ${
                        tempNetflows == 0
                          ? "new-hompeage__body__badge--gray"
                          : tempNetflows > 0
                          ? "new-hompeage__body__badge--success"
                          : "new-hompeage__body__badge--danger"
                      }`}
                    >
                      {tempNetflows !== 0 ? (
                        <img
                          style={{
                            width:'7px'
                          }}
                          src={tempNetflows < 0 ? CaretDownRed : CaretUpGreen}
                          className="mr-2"
                        />
                      ) : null}
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
              Returns
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "returns",

        coumnWidth: 0.172,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "returns") {
            let tempProfits = rowData.returns ? rowData.returns : 0;
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
                    <span
                      className={`new-hompeage__body__badge ${
                        tempProfits == 0
                          ? "new-hompeage__body__badge--gray"
                          : tempProfits > 0
                          ? "new-hompeage__body__badge--success"
                          : "new-hompeage__body__badge--danger"
                      }`}
                    >
                      <span
                      style={{
                        color: tempProfits == 0
                        ? ""
                        : tempProfits > 0
                        ? "#5ADDA6"
                        : "#FF060A"
                      }}
                      >
                        {tempProfits == 0 ?null:tempProfits < 0 ? '-' : '+'}
                      </span>
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
      // {
      //   labelName: (
      //     <div
      //       className=" history-table-header-col no-hover"
      //       id="netflows"
      //       // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Follow
      //       </span>
      //       {/* <Image
      //         src={sortByIcon}
      //         className={
      //           this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
      //         }
      //       /> */}
      //     </div>
      //   ),
      //   dataKey: "following",

      //   coumnWidth: 0.125,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "following") {
      //       const handleOnClick = (addItem) => {
      //         if (!this.state.blurTable) {
      //           this.handleFollowUnfollow(
      //             rowData.account,
      //             addItem,
      //             rowData.tagName
      //           );
      //         } else {
      //           this.openSignInOnclickModal();
      //         }
      //       };
      //       return (
      //         <CheckboxCustomTable
      //           handleOnClick={handleOnClick}
      //           isChecked={rowData.following}
      //           dontSelectIt={this.state.blurTable}
      //         />
      //       );
      //     }
      //   },
      // },
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
              <button className="new-homepage-btn">
                <div
                  style={{
                    padding: "3px",
                    borderRadius: "6px",
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
                <img src={questionRoundedIcons} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="new-homepage__body">
          <div className="new-homepage__body-container">
            <div className="new-homepage__body-search" style={{fontSize:'20px', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer'}} onClick={this.toggleShowTrendingAddress}>
              Click me
            </div>
            {
              this.state.showTrending
              ?
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
                {
                  trendingAddresses.map((item, index) => (
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
                            {numToCurrency(item.worth.toFixed(2)).toLocaleString(
                              "en-US"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            :
            null
            }
            
            <div className="new-homepage__body-content">
              <div className="new-homepage__body-content-table-header">
                <img src={ActiveSmartMoneySidebarIcon} alt="" />
                Loch’s Leaderboard
              </div>
              <div className="smartMoneyTable">
                <TransactionTable
                  isSmartMoney
                  noSubtitleBottomPadding
                  tableData={tableData}
                  columnList={columnList}
                  message={"No accounts found"}
                  totalPage={0}
                  history={this.props.history}
                  location={this.props.location}
                  page={1}
                  addWatermark
                  // className={this.state.blurTable ? "noScroll" : ""}
                  // onBlurSignInClick={this.showSignInModal}
                />
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
