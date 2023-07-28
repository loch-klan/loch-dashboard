import React from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";

import { connect } from "react-redux";
import {
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_TEXT,
  SORT_BY_TIMESTAMP,
  BASE_URL_S3,
  SORT_BY_ACCOUNT,
  SORT_BY_NETWORTH,
  SORT_BY_NET_FLOW,
} from "../../utils/Constant";
import {
  searchTransactionApi,
  getFilters,
  getTransactionAsset,
} from "../intelligence/Api";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";

import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";

import Loading from "../common/Loading";

import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import {
  GetAllPlan,
  TopsetPageFlagDefault,
  getUser,
  setPageFlagDefault,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import TransactionTable from "../intelligence/TransactionTable";

import CheckboxCustomTable from "../common/customCheckboxTable";
import RemarkInput from "../discover/remarkInput";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { WatchlistShare } from "../../utils/AnalyticsFunctions";
import AddWatchListAddressModal from "./addWatchListAddressModal";

class WatchListPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");

    this.state = {
      showAddWatchListAddress: false,
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
          title: "isAnalyzed",
          up: false,
        },
        {
          title: "remark",
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
    resetPreviewAddress();
    this.props?.TopsetPageFlagDefault();
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
    console.log("test", key, value);
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
        } else if (val === "isAnalyzed") {
          obj = [
            {
              key: SORT_BY_NETWORTH,
              value: !el.up,
            },
          ];
        } else if (val === "remark") {
          obj = [
            {
              key: SORT_BY_NET_FLOW,
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

  handleAddWatchlistAddress = () => {
    this.setState({
      showAddWatchListAddress: !this.state.showAddWatchListAddress,
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

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "app-feature?redirect=watchlist";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    WatchlistShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // console.log("share pod", shareLink);
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
        isAnalyzed: true,
        remark: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        account: "@cryptocobie2",
        isAnalyzed: false,
        remark: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
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
              To Analyze
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
        coumnWidth: 0.3,
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
              <div className="watchListUnderlineText">{rowData.account}</div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="isAnalyzed"
            onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Analyzed
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "isAnalyzed",
        // coumnWidth: 153,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "isAnalyzed") {
            return <CheckboxCustomTable isChecked={rowData?.isAnalyzed} />;
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="remark"
            onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Remarks
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "remark",
        // coumnWidth: 153,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "remark") {
            return <RemarkInput />;
          }
        },
      },
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
                hideButton={true}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            {this.state.showAddWatchListAddress ? (
              <AddWatchListAddressModal
                show={this.state.showAddWatchListAddress}
                onHide={this.handleAddWatchlistAddress}
                history={this.props.history}
              />
            ) : null}
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
              title={"Watchlist"}
              subTitle={"Addresses to watch"}
              // showpath={true}
              // currentPage={"transaction-history"}
              history={this.props.history}
              topaccount={true}
              ShareBtn={false}
              handleShare={this.handleShare}
              btnText="Add address"
              handleBtn={this.handleAddWatchlistAddress}
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
                  {/* <div style={{ width: "60%" }}>
                    <CustomDropdown
                      filtername="Type"
                      options={[...[{ value: "Allasset", label: "All" }]]}
                      action={"SEARCH_BY_ASSETS_IN"}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      isTopaccount={true}
                    />
                  </div> */}

                  {/* {fillter_tabs} */}
                  <div style={{ width: "100%" }}>
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
  TopsetPageFlagDefault,
};

WatchListPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(WatchListPage);
