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
} from "../../utils/Constant";
import { searchTransactionApi, getFilters, getTransactionAsset } from "../intelligence/Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
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

class TwitterInflucencePage extends BaseReactComponent {
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
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: [],
      tableLoading: false,
      tableSortOpt: [
        {
          title: "account",
          up: false,
        },
        {
          title: "followers",
          up: false,
        },
        {
          title: "tokensMentioned",
          up: false,
        },
        {
          title: "tokenPerformance",
          up: false,
        },
        {
          title: "watchlist",
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
      totalPage: 10,
      timeFIlter: "Time",
      AssetList: [],
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
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.props.getAllCoins();
    this.callApi(this.state.currentPage || START_INDEX);
    this.assetList();
    GetAllPlan();
    getUser();
  }

  assetList = () => {
    let data = new URLSearchParams();
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this);
  };

  callApi = (page = START_INDEX) => {
    // this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    // getTopAccounts(data, this);
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
     }
  }

  onValidSubmit = () => {
    // console.log("Sbmit")
  };

  addCondition = (key, value) => {
    console.log("test", key, value)
     let index = this.state.condition.findIndex((e) => e.key === key);
     // console.log("index", index);
     let arr = [...this.state.condition];
     let search_index = this.state.condition.findIndex(
       (e) => e.key === SEARCH_BY_TEXT
     );
     if (
       index !== -1 &&
       value !== "allchain" &&
       value !== "allfollowers" &&
       value !== "Allasset"
     ) {
       // console.log("first if", index);
       arr[index].value = value;
     } else if (
       value === "allchain" ||
       value === "allfollowers" ||
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
  onChangeMethod = () => {};
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
        } else if (val === "followers") {
          obj = [
            {
              key: SORT_BY_NETWORTH,
              value: !el.up,
            },
          ];
        } else if (val === "tokensMentioned") {
          obj = [
            {
              key: SORT_BY_NETFLOWS,
              value: !el.up,
            },
          ];
        } else if (val === "tokenPerformance") {
          obj = [
            {
              key: SORT_BY_LARGEST_BOUGHT,
              value: !el.up,
            },
          ];
        } else if (val === "watchlist") {
          obj = [
            {
              key: SORT_BY_LARGEST_SOLD,
              value: !el.up,
            },
          ];
        } 
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    this.setState({
      // sort: obj,
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

    // const tableData = this.state.accountList;
    const tableData = [
      {
        account: "@cryptocobie",
        followers: 2449,
        tokensMentioned: [
          {
            name: "ETH 1",
            symbol: Ethereum,
            colorCode: "#7B44DA",
          },
          {
            name: "ETH 2",
            symbol: Ethereum,
            colorCode: "#7B44DA",
          },
          {
            name: "ETH 3",
            symbol: Ethereum,
            colorCode: "#7B44DA",
          },
        ],
        tokenPerformance: 20,
      },
    ];

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Accounts"
            onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Account
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "account",
        // coumnWidth: 153,
        coumnWidth: 0.25,
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
              // this.TruncateText(rowData.account)
              rowData.account
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="followers"
            onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Followers
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "followers",
        // coumnWidth: 153,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "followers") {
            return rowData.followers ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(rowData.followers, "en-US", "USD")}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 cost-common">
                  {numToCurrency(rowData.followers)}
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
            className="cp history-table-header-col"
            id="tokensMentioned"
            onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Tokens Mentioned
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tokensMentioned",
        // coumnWidth: 153,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tokensMentioned") {
            let text = "";
            rowData?.tokensMentioned?.map((e, i) => {
              text =
                text +
                e.name +
                (rowData?.tokensMentioned?.length - 1 === i ? "" : ", ");
            });

            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={text}
              >
                {/* <div className="">imgs</div> */}
                <div className="overlap-img-topAccount">
                  {rowData?.tokensMentioned?.map((e, i) => {
                    return (
                      <Image
                        src={e?.symbol}
                        style={{
                          zIndex: rowData?.tokensMentioned?.length - i,
                          marginLeft: i === 0 ? "0" : "-1rem",
                          border: `1px solid ${lightenDarkenColor(
                            e.colorCode,
                            -0.15
                          )} `,
                        }}
                      />
                    );
                  })}
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
            id="tokenPerformance"
            onClick={() => this.handleSort(this.state.tableSortOpt[3].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Token Performance after tweet
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tokenPerformance",
        // coumnWidth: 128,
        coumnWidth: 0.4,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tokenPerformance") {
            return (
              <div
                className={`gainLoss ${
                  rowData.tokenPerformance < 0 ? "loss" : "gain"
                }`}
              >
                {/* <Image
                  src={rowData.tokenPerformance < 0 ? LossIcon : GainIcon}
                /> */}
                <div className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.tokenPerformance.toFixed(2) + "%"}
                </div>
              </div>
            );
          }
        },
      },
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="largestSold"
      //       onClick={() => this.handleSort(this.state.tableSortOpt[4].title)}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Largest Sold
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "largestSold",
      //   // coumnWidth: 153,
      //   coumnWidth: 0.2,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "largestSold") {
      //       let text = "";
      //       rowData?.largestSold?.map((e, i) => {
      //         text =
      //           text +
      //           e.name +
      //           (rowData?.largestSold?.length - 1 === i ? "" : ", ");
      //       });

      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={text}
      //         >
      //           {/* <div className="">imgs</div> */}
      //           <div className="overlap-img-topAccount">
      //             {rowData?.largestSold?.map((e, i) => {
      //               return (
      //                 <Image
      //                   src={e?.symbol}
      //                   style={{
      //                     zIndex: rowData?.largestSold?.length - i,
      //                     marginLeft: i === 0 ? "0" : "-1rem",
      //                     border: `1px solid ${lightenDarkenColor(
      //                       e.colorCode,
      //                       -0.15
      //                     )} `,
      //                   }}
      //                 />
      //               );
      //             })}
      //           </div>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },

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
      <div className="history-table-section">
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
            title={"Twitter Influencers"}
            subTitle={"Popular Twitter Influencers "}
            showpath={true}
            currentPage={"transaction-history"}
            history={this.props.history}
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
                <div style={{ width: "25%" }}>
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
                      "All time",
                      "1 week",
                      "1 month",
                      "6 months",
                      "1 year",
                      "5 years",
                    ]}
                    onSelect={this.handleTime}
                    title={this.state.timeFIlter}
                    activetab={
                      this.state.timeFIlter === "Time"
                        ? "All time"
                        : this.state.timeFIlter
                    }
                    showChecked={true}
                    customArrow={true}
                    relative={true}
                  />
                </div>

                <div style={{ width: "25%" }}>
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
                </div>
                <div style={{ width: "25%" }}>
                  <CustomDropdown
                    filtername="Followers"
                    options={[
                      ...[{ value: "allfollowers", label: "All" }],
                      ...chainList,
                    ]}
                    action={"SEARCH_BY_CHAIN_IN"}
                    handleClick={(key, value) => this.addCondition(key, value)}
                    isTopaccount={true}
                  />
                </div>
                {/* {fillter_tabs} */}
                <div style={{ width: "25%" }}>
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

TwitterInflucencePage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwitterInflucencePage);
