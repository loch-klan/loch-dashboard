import React, { Component } from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import CoinChip from "../wallet/CoinChip";
import Ethereum from "../../assets/images/icons/ether-coin.svg";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  SEARCH_BY_WALLET_ADDRESS_IN,
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_TEXT,
  SEARCH_BY_TIMESTAMP_IN,
  SEARCH_BY_METHOD_IN,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_AMOUNT,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_TRANSACTION_FEE,
  SORT_BY_METHOD,
  DEFAULT_PRICE,
  SEARCH_BY_NOT_DUST,
  BASE_URL_S3,
  SORT_BY_ACCOUNT,
  SORT_BY_NETWORTH,
  SORT_BY_NETFLOWS,
  SORT_BY_LARGEST_BOUGHT,
  SORT_BY_LARGEST_SOLD,
  SORT_BY_TAG_NAME,
  SORT_BY_NET_FLOW,
  SEARCH_BY_NETWORTH,
} from "../../utils/Constant";
import {
  searchTransactionApi,
  getFilters,
  getTransactionAsset,
} from "../intelligence/Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
import {
  amountFormat,
  CurrencyType,
  lightenDarkenColor,
  noExponents,
  numToCurrency,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

import Loading from "../common/Loading";

import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import { GetAllPlan, getUser, setPageFlagDefault } from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import TransactionTable from "../intelligence/TransactionTable";
import { getTopAccounts } from "./Api";
import DropDown from "../common/DropDown";
import { SORT_BY_NAME } from "../../utils/Constant";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { TimeFilterType } from "../../utils/Constant";
import { TopAccountClickedAccount, TopAccountInflowHover, TopAccountNameHover, TopAccountNetHover, TopAccountNetflowHover, TopAccountNetworthFilter, TopAccountOutflowHover, TopAccountPageNext, TopAccountPagePrev, TopAccountPageSearch, TopAccountPageView, TopAccountSearch, TopAccountSortByNetWorth, TopAccountSortByNetflows, TopAccountSortByTag, TopAccountTimeFilter, TopAccountTimeSpent } from "../../utils/AnalyticsFunctions";
class TopAccountPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");

    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_AMOUNT, value: false }],
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: [],
      tableLoading: true,
      tableSortOpt: [
        {
          title: "account",
          up: false,
        },
        {
          title: "networth",
          up: false,
        },
        {
          title: "netflows",
          up: false,
        },
        {
          title: "largestbought",
          up: false,
        },
        {
          title: "largestsold",
          up: false,
        },
        {
          title: "tagName",
          up: false,
        },
      ],
      showDust: false,
      // add new wallet
      // userWalletList: localStorage.getItem("addWallet")
      //   ? JSON.parse(localStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      accountList: [],
      totalPage: 0,
      timeFIlter: "Time",
      AssetList: [],
      startTime: "",
    };
    this.delayTimer = 0;
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  componentDidMount() {
    // localStorage.setItem("previewAddress", "");
    this.state.startTime = new Date() * 1;
    TopAccountPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.props.getAllCoins();
    this.callApi(this.state.currentPage || START_INDEX);
    this.assetList();
    GetAllPlan();
    getUser();
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime / 1000);
    // console.log("Time Spent", TimeSpent);
    TopAccountTimeSpent({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  assetList = () => {
    let data = new URLSearchParams();
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this);
  };

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    getTopAccounts(data, this);
  };

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      this.callApi(page);
      this.setState({
        currentPage: page,
      });
       if (prevPage !== page) {
         if (prevPage - 1 === page) {
           TopAccountPagePrev({
             session_id: getCurrentUser().id,
             email_address: getCurrentUser().email,
             page: page + 1,
           });
         } else if (prevPage + 1 === page) {
          TopAccountPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
          });
         } else {
          TopAccountPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page: page + 1,
          });
         }
       }
    }
  }

  onValidSubmit = () => {
    // console.log("Sbmit")
  };

  addCondition = (key, value) => {
    // console.log("test", key, value);
    let networthList = {
      // "AllNetworth": "All",
      "0-1": "less 1m",
      "1-10": "1m-10m",
      "10-100": "10m-100m",
      "100-1000": "100m- 1b",
      "1000-1000000":"more than 1b"
    }
    if (key === SEARCH_BY_NETWORTH) {

      let selectedValue =
        value === "AllNetworth" ? "All" : value?.map((e) => networthList[e]);
      // console.log("sele",selectedValue)

      TopAccountNetworthFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedValue,
      });
    }
    let index = this.state.condition.findIndex((e) => e.key === key);
    // console.log("index", index);
    let arr = [...this.state.condition];
    let search_index = this.state.condition.findIndex(
      (e) => e.key === SEARCH_BY_TEXT
    );
    if (
      index !== -1 &&
      value !== "allchain" &&
      value !== "AllNetworth" &&
      value !== "Allasset"
    ) {
      // console.log("first if", index);
      arr[index].value = value;
    } else if (
      value === "allchain" ||
      value === "AllNetworth" ||
      value === "Allasset"
    ) {
      // console.log("second if", index);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    } else {
      // console.log("else", index);
      let obj = {};
      obj = {
        key: key,
        value: value,
      };
      arr.push(obj);
    }
    if (search_index !== -1) {
      if (value === "" && key === SEARCH_BY_TEXT) {
        arr.splice(search_index, 1);
      }
    }
    // On Filter start from page 0
    this.props.history.replace({
      search: `?p=${START_INDEX}`,
    });
    this.setState({
      condition: arr,
    });
  };
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);

      TopAccountSearch({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        search: this.state.search,
      });
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  handleSort = (val) => {
    console.log(val);
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort?.map((el) => {
      if (el.title === val) {
        if (val === "account") {
          obj = [
            {
              key: SORT_BY_ACCOUNT,
              value: !el.up,
            },
          ];
        } else if (val === "networth") {
          obj = [
            {
              key: SORT_BY_AMOUNT,
              value: !el.up,
            },
          ];
 TopAccountSortByNetWorth({
   session_id: getCurrentUser().id,
   email_address: getCurrentUser().email,
 });
        } else if (val === "netflows") {
          obj = [
            {
              key: SORT_BY_NET_FLOW,
              value: !el.up,
            },
          ];
           TopAccountSortByNetflows({
             session_id: getCurrentUser().id,
             email_address: getCurrentUser().email,
           });
        } else if (val === "largestbought") {
          obj = [
            {
              key: SORT_BY_LARGEST_BOUGHT,
              value: !el.up,
            },
          ];
        } else if (val === "largestsold") {
          obj = [
            {
              key: SORT_BY_LARGEST_SOLD,
              value: !el.up,
            },
          ];
        } else if (val === "tagName") {
          obj = [
            {
              key: SORT_BY_NAME,
              value: !el.up,
            },
          ];

          TopAccountSortByTag({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };

  TruncateText = (string) => {
    return (
      string.substring(0, 3) +
      "..." +
      string.substring(string.length - 3, string.length)
    );
  };

  handleTime = (e) => {
    let title = e.split(" ")[1];
    if (e.split(" ")[2] !== undefined) {
      title = title + " " + e.split(" ")[2];
    }
    if (e.split(" ")[3] !== "undefined") {
      title = title + " " + e.split(" ")[3];
    }
    console.log("title", title);
    this.setState({
      timeFIlter: title,
    });

    TopAccountTimeFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      selected: title
    });
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
    // console.log("api respinse", value);
  };

  render() {
    // console.log("value", this.state.methodFilter);

    let chainList = this.props.OnboardingState?.coinsList
      ?.filter((e) => ["Ethereum", "Polygon", "Avalanche"].includes(e.name))
      ?.map((e) => ({
        value: e.id,
        label: e.name,
      }));

    let assetList = this.state?.AssetList?.filter((e) =>
      ["Ethereum", "Polygon", "Avalanche"].includes(e.label)
    );

    // console.log("text", assetList);

    const tableData = this.state.accountList;
    // const tableData = [
    //   {
    //     account: "vitalik.eth",
    //     networth: 2444440,
    //     netflows: 37344,
    //     largestBought: [
    //       {
    //         name: "ETH 1",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 2",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 3",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //     ],
    //     largestSold: [
    //       {
    //         name: "ETH 1",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 2",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //       {
    //         name: "ETH 3",
    //         symbol: Ethereum,
    //         colorCode: "#7B44DA",
    //       },
    //     ],
    //   },
    // ];

    const columnList = [
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Account
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "account",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={rowData.account}
              // >
              //   <div className="inter-display-medium f-s-13 lh-16 grey-313">

              //   </div>
              // </CustomOverlay>
              <span
                onClick={() => {
                  TopAccountClickedAccount({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    account: rowData.account,
                  });
                  localStorage.setItem("previewAddress", rowData.account);
                  this.props.history.push("/top-accounts/home");
                }}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {this.TruncateText(rowData.account)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="tagName"
            onClick={() => this.handleSort(this.state.tableSortOpt[5].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Name tag
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tagName",
        // coumnWidth: 153,
        coumnWidth: 0.2,
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
                <span onMouseEnter={() => {
                  TopAccountNameHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    hover: rowData.tagName,
                  });
                }}>{rowData.tagName}</span>
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
            className="cp history-table-header-col"
            id="networth"
            onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net worth{" (" + CurrencyType(false) + ")"}
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "networth",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "networth") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(
                  rowData.networth * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div
                  className="inter-display-medium f-s-13 lh-16 grey-313 cost-common"
                  onMouseEnter={() => {
                    TopAccountNetHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: amountFormat(
                        rowData.networth * this.state.currency?.rate,
                        "en-US",
                        "USD"
                      ),
                    });
                  }}
                >
                  {numToCurrency(rowData.networth * this.state.currency?.rate)}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="netflows"
            onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Net flows {"(" + CurrencyType(false) + ")"}
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "netflows",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "netflows") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "5 years"
                : this.state.timeFIlter
            );
            // console.log("type netflow", type);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(
                  rowData.netflows[type] * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div
                  className={`gainLoss ${
                    rowData.netflows[type] < 0
                      ? "loss"
                      : rowData.netflows[type] === 0
                      ? "cost-common"
                      : "gain"
                  }`}
                  onMouseEnter={() => {
                    TopAccountNetflowHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: amountFormat(
                        rowData.netflows[type] * this.state.currency?.rate,
                        "en-US",
                        "USD"
                      ),
                    });
                  }}
                >
                  <Image
                    src={rowData.netflows[type] < 0 ? LossIcon : GainIcon}
                  />
                  <div className="inter-display-medium f-s-13 lh-16 grey-313">
                    {(rowData.netflows[type] < 0 ? "-" : "") +
                      numToCurrency(
                        rowData.netflows[type] * this.state.currency?.rate
                      )}
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
            className="history-table-header-col no-hover"
            id="largestBought"
            // onClick={() => this.handleSort(this.state.tableSortOpt[3].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Largest inflows
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "largestBought",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "largestBought") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "5 years"
                : this.state.timeFIlter
            );
            // console.log("type bought", type);
            let text = "";
            rowData?.largestBought[type]?.map((e, i) => {
              text =
                text +
                e[0] +
                (rowData?.largestBought[type]?.length - 1 === i ? "" : ", ");
            });

            return rowData?.largestBought[type].length !== 0 ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={text}
              >
                {/* <div className="">imgs</div> */}
                <div
                  className="overlap-img-topAccount"
                  onMouseEnter={() => {
                    TopAccountInflowHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: text,
                    });
                  }}
                >
                  {rowData?.largestBought[type]?.map((e, i) => {
                    return (
                      <Image
                        src={e[1]}
                        style={{
                          zIndex: i,
                          marginLeft: i === 0 ? "0" : "-1rem",
                          // border: "1px solid #737373",
                          // backgroundColor: "#ffffff",
                          // padding: "0.3rem",
                          // border: `1px solid ${lightenDarkenColor(
                          //   e.colorCode,
                          //   -0.15
                          // )} `,
                        }}
                      />
                    );
                  })}
                </div>
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
            className="history-table-header-col no-hover"
            id="largestSold"
            // onClick={() => this.handleSort(this.state.tableSortOpt[4].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Largest outflows
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "largestSold",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "largestSold") {
            let type = TimeFilterType.getText(
              this.state.timeFIlter === "Time"
                ? "5 years"
                : this.state.timeFIlter
            );
            //  console.log("type sold", type);
            let text = "";
            rowData?.largestSold[type]?.map((e, i) => {
              text =
                text +
                e[0] +
                (rowData?.largestSold[type]?.length - 1 === i ? "" : ", ");
            });

            return rowData?.largestSold[type]?.length !== 0 ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={text}
              >
                {/* <div className="">imgs</div> */}
                <div
                  className="overlap-img-topAccount"
                  onMouseEnter={() => {
                    TopAccountOutflowHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: text,
                    });
                  }}
                >
                  {rowData?.largestSold[type]?.map((e, i) => {
                    return (
                      <Image
                        src={e[1]}
                        style={{
                          zIndex: i,
                          marginLeft: i === 0 ? "0" : "-1rem",
                          // border: `1px solid ${lightenDarkenColor(
                          //   e.colorCode,
                          //   -0.15
                          // )} `,
                        }}
                      />
                    );
                  })}
                </div>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },

      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="Gain loss"
      //       onClick={() => this.handleSort(this.state.sortBy[6])}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         % Gain / Loss
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           this.state.sortBy[6].down ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "GainLoss",
      //   // coumnWidth: 128,
      //   coumnWidth: 0.25,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "GainLoss") {
      //       return (
      //         <div
      //           className={`gainLoss ${
      //             rowData.GainLoss < 0 ? "loss" : "gain"
      //           }`}
      //         >
      //           <Image src={rowData.GainLoss < 0 ? LossIcon : GainIcon} />
      //           <div className="inter-display-medium f-s-13 lh-16 grey-313">
      //             {rowData.GainLoss.toFixed(2) + "%"}
      //           </div>
      //         </div>
      //       );
      //     }
      //   },
      // },
    ];

    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
                onHide={this.handleAddModal}
                modalIcon={AddWalletModalIcon}
                title="Add wallet address"
                subtitle="Add more wallet address here"
                modalType="addwallet"
                btnStatus={false}
                btnText="Go"
                history={this.props.history}
                changeWalletList={this.handleChangeList}
                apiResponse={(e) => this.CheckApiResponse(e)}
                from="transaction history"
              />
            )}
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={localStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
              />
            )}
            <PageHeader
              title={"Top accounts"}
              subTitle={"Analyze the top accounts here"}
              // showpath={true}
              // currentPage={"transaction-history"}
              history={this.props.history}
              topaccount={true}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              // ShareBtn={true}
              // handleShare={this.handleShare}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    {/* <CustomDropdown
                    filtername="Time"
                    options={[
                      { value: "alltime", label: "All time" },
                      { value: "1week", label: "1 week" },
                      { value: "1month", label: "1 month" },
                      { value: "6months", label: "6 months" },
                      { value: "1year", label: "1 year" },
                      { value: "5years", label: "5 years" },
                    ]}
                    action={SEARCH_BY_TIMESTAMP_IN}
                    handleClick={(key, value) => this.addCondition(key, value)}
                    isTopaccount={true}
                  /> */}
                    <DropDown
                      class="cohort-dropdown"
                      list={[
                        // "All time",
                        "1 week",
                        "1 month",
                        "6 months",
                        "1 year",
                        "3 years",
                        "5 years",
                      ]}
                      onSelect={this.handleTime}
                      title={this.state.timeFIlter}
                      activetab={
                        this.state.timeFIlter === "Time"
                          ? "5 years"
                          : this.state.timeFIlter
                      }
                      showChecked={true}
                      customArrow={true}
                      relative={true}
                    />
                  </div>
                  {/* <div style={{ width: "25%" }}>
                    <CustomDropdown
                      filtername="Chains"
                      options={[
                        ...[{ value: "allchain", label: "All chains" }],
                        ...chainList,
                      ]}
                      action={"SEARCH_BY_CHAIN_IN"}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      isTopaccount={true}
                    />
                  </div> */}
                  <div style={{ width: "30%" }}>
                    <CustomDropdown
                      filtername="Net worth"
                      options={[
                        { value: "AllNetworth", label: "All" },
                        { value: "0-1", label: "less 1m" },
                        { value: "1-10", label: "1m-10m" },
                        { value: "10-100", label: "10m-100m" },
                        { value: "100-1000", label: "100m-1b" },
                        { value: "1000-1000000", label: "more than 1b" },
                      ]}
                      action={SEARCH_BY_NETWORTH}
                      handleClick={(key, value) => {
                        this.addCondition(key, value);
                        // console.log(key, value);
                      }}
                      isTopaccount={true}
                    />
                  </div>
                  {/* <div style={{ width: "20%" }}>
                  <CustomDropdown
                    filtername="Assets"
                    options={[
                      ...[{ value: "Allasset", label: "All assets" }],
                      ...assetList,
                    ]}
                    action={"SEARCH_BY_ASSETS_IN"}
                    handleClick={(key, value) => this.addCondition(key, value)}
                    isTopaccount={true}
                  />
                </div> */}
                  {/* {fillter_tabs} */}
                  <div style={{ width: "50%" }}>
                    <div className="searchBar top-account-search">
                      <Image src={searchIcon} className="search-icon" />
                      <FormElement
                        valueLink={this.linkState(
                          this,
                          "search",
                          this.onChangeMethod
                        )}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Search",
                          },
                        }}
                        classes={{
                          inputField: "search-input",
                          prefix: "search-prefix",
                          suffix: "search-suffix",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <div className="transaction-history-table">
              {this.state.tableLoading ? (
                <Loading />
              ) : (
                <>
                  <TransactionTable
                    tableData={tableData}
                    columnList={columnList}
                    message={"No accounts found"}
                    totalPage={this.state.totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage}
                    tableLoading={this.state.tableLoading}
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
                </>
              )}
            </div>
            {/* <FeedbackForm page={"Transaction History Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // portfolioState: state.PortfolioState,
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  // getCoinRate,
  getAllCoins,
  getFilters,
  setPageFlagDefault,
};

TopAccountPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(TopAccountPage);
