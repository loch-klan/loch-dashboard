import React from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";

import { connect } from "react-redux";
import {
  Method,
  START_INDEX,
  SEARCH_BY_TEXT,
  BASE_URL_S3,
  API_LIMIT,
  SORT_BY_ADDRESS,
  SORT_BY_ANALYSED,
  SORT_BY_REMARKS,
  SORT_BY_NAME_TAG,
} from "../../utils/Constant";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import "./_watchlist.scss";
import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";

import Loading from "../common/Loading";

import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
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
import {
  TimeSpentWatchlist,
  WatchlistAnalyzedCheckbox,
  WatchlistClickedAccount,
  WatchlistDeleteAddress,
  WatchlistNameHover,
  WatchlistPage,
  WatchlistRemarkAdded,
  WatchlistSearch,
  WatchlistShare,
  WatchlistSortByAnalyzed,
  WatchlistSortByNameTag,
  WatchlistSortByRemarks,
} from "../../utils/AnalyticsFunctions";
import AddWatchListAddressModal from "./addWatchListAddressModal";
import {
  getWatchList,
  updateAddToWatchList,
  getWatchListLoading,
  removeAddressFromWatchList,
} from "./redux/WatchListApi";
import { TruncateText } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import DeleteIcon from "../../assets/images/icons/trashIcon.svg";

class WatchListPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");

    this.state = {
      goToBottom: false,
      initialList: false,
      showAddWatchListAddress: false,
      currency: JSON.parse(localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_NAME_TAG, value: true }],
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: [],
      tableLoading: false,
      tableSortOpt: [
        {
          title: "nameTag",
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
      totalPage: 0,
      timeFIlter: "Time",
      tableData: [],
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
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    WatchlistPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkWatchlistTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    resetPreviewAddress();
    this.props?.TopsetPageFlagDefault();
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.callApi(this.state.currentPage || START_INDEX);
    this.props.GetAllPlan();
    this.props.getUser();
    this.startPageView();
    this.updateTimer(true);
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "watchlistPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("watchlistPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkWatchlistTimer);
    localStorage.removeItem("watchlistPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentWatchlist({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("watchlistPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("watchlistPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  callApi = (page = START_INDEX) => {
    this.props.getWatchListLoading();
    this.setState({
      tableLoading: true,
    });
    let tempWatchListData = new URLSearchParams();
    tempWatchListData.append("start", page * API_LIMIT);
    tempWatchListData.append(
      "conditions",
      JSON.stringify(this.state.condition)
    );
    tempWatchListData.append("limit", API_LIMIT);
    tempWatchListData.append("sorts", JSON.stringify(this.state.sort));
    this.props.getWatchList(tempWatchListData);
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
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
    if (this.props.WatchListLoadingState !== prevProps.WatchListLoadingState) {
      this.setState({
        tableLoading: this.props.WatchListLoadingState,
      });
    }
    if (this.props.WatchListState !== prevProps.WatchListState) {
      if (this.props.WatchListState && this.props.WatchListState.watchlist) {
        const tempWatchListArr = [];
        let totalItems = 0;
        if (this.props.WatchListState.total_count) {
          totalItems = Math.ceil(
            this.props.WatchListState.total_count / API_LIMIT
          );
        }

        this.props.WatchListState.watchlist.forEach((watchListWalletAdd) => {
          const tempSingleWatchList = {
            account: watchListWalletAdd.name_tag
              ? watchListWalletAdd.name_tag
              : TruncateText(watchListWalletAdd.address),
            isAnalyzed: watchListWalletAdd.analysed,
            remark: watchListWalletAdd.remarks,
            address: watchListWalletAdd.address,
            nameTag: watchListWalletAdd.name_tag,
          };
          tempWatchListArr.push(tempSingleWatchList);
        });
        if (tempWatchListArr.length > 0 && this.state.initialList === false) {
          this.setState({
            initialList: true,
          });
        }
        this.setState({
          tableData: tempWatchListArr,
          totalPage: totalItems ? totalItems : 0,
        });
      }
    }
  }

  onValidSubmit = () => {
    if (
      (this.state.tableData && this.state.tableData.length > 0) ||
      this.state.search === ""
    ) {
      // Search Here
      WatchlistSearch({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        search: this.state.search,
      });
      this.updateTimer();
      this.setState({
        condition: [
          { key: "SEARCH_BY_WALLET_ADDRESS", value: this.state.search },
        ],
      });
    }
  };

  addCondition = (key, value) => {
    let index = this.state.condition.findIndex((e) => e.key === key);
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
      arr[index].value = value;
    } else if (
      value === "allchain" ||
      value === "AllNetworth" ||
      value === "Allasset"
    ) {
      if (index !== -1) {
        arr.splice(index, 1);
      }
    } else {
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
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort?.map((el) => {
      if (el.title === val) {
        if (val === "nameTag") {
          WatchlistSortByNameTag({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
          obj = [
            {
              key: SORT_BY_NAME_TAG,
              value: !el.up,
            },
          ];
        } else if (val === "isAnalyzed") {
          WatchlistSortByAnalyzed({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
          obj = [
            {
              key: SORT_BY_ANALYSED,
              value: !el.up,
            },
          ];
        } else if (val === "remark") {
          WatchlistSortByRemarks({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
          obj = [
            {
              key: SORT_BY_REMARKS,
              value: !el.up,
            },
          ];
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });
    if (obj && obj.length > 0) {
      obj = [{ key: obj[0].key, value: !obj[0].value }];
    }
    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };

  handleTime = (e) => {
    let title = e.split(" ")[1];
    if (e.split(" ")[2] !== undefined) {
      title = title + " " + e.split(" ")[2];
    }
    if (e.split(" ")[3] !== "undefined") {
      title = title + " " + e.split(" ")[3];
    }
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
  };
  refetchList = () => {
    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);
    this.callApi(page);
  };
  updateWatchListAnalyzed = (
    passedNameTag,
    passedAddress,
    passedAnalysed,
    callMixpanel
  ) => {
    if (callMixpanel) {
      WatchlistAnalyzedCheckbox({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: passedNameTag ? passedNameTag : passedAddress,
        analyzed: passedAnalysed,
      });
    }
    this.updateTimer();
    let tempUpdateWatchListata = new URLSearchParams();
    tempUpdateWatchListata.append(
      "wallet_address",
      passedAddress ? passedAddress : ""
    );
    tempUpdateWatchListata.append(
      "analysed",
      passedAnalysed ? passedAnalysed : false
    );

    this.props.updateAddToWatchList(tempUpdateWatchListata);
  };
  updateWatchListRemark = (passedNameTag, passedAddress, passedRemark) => {
    WatchlistRemarkAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      address: passedNameTag ? passedNameTag : passedAddress,
      remark: passedRemark,
    });
    this.updateTimer();
    let tempUpdateWatchListata = new URLSearchParams();
    tempUpdateWatchListata.append(
      "wallet_address",
      passedAddress ? passedAddress : ""
    );
    tempUpdateWatchListata.append("remarks", passedRemark ? passedRemark : "");
    this.props.updateAddToWatchList(tempUpdateWatchListata);
  };
  addressDeleted = (passedAddress, passedNameTag) => {
    WatchlistDeleteAddress({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      address: passedAddress,
      name_tag: passedNameTag,
    });
  };
  render() {
    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Account
            </span>
          </div>
        ),
        dataKey: "account",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            const addressOrEns = () => {
              const regex = /\.eth$/;
              let tempAddress = rowData.address;
              if (!regex.test(rowData.address)) {
                tempAddress = TruncateText(rowData.address);
              }
              return tempAddress;
            };
            return (
              <div
                onClick={() => {
                  this.updateWatchListAnalyzed(
                    rowData.nameTag,
                    rowData.address,
                    true,
                    false
                  );
                  setTimeout(() => {
                    resetPreviewAddress();
                    WatchlistClickedAccount({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      account: rowData.address ? rowData.address : "",
                      name_tag: rowData.nameTag ? rowData.nameTag : "",
                    });
                    this.updateTimer();
                    let obj = JSON.parse(
                      localStorage.getItem("previewAddress")
                    );
                    localStorage.setItem(
                      "previewAddress",
                      JSON.stringify({
                        ...obj,
                        address: rowData.address,
                        nameTag: rowData.nameTag ? rowData.nameTag : "",
                      })
                    );
                    localStorage.setItem(
                      "previewAddressGoToWhaleWatch",
                      JSON.stringify({
                        goToWhaleWatch: false,
                      })
                    );
                    this.props?.TopsetPageFlagDefault();
                    this.props.history.push("/top-accounts/home");
                  }, 200);
                }}
                className="top-account-address dotDotText"
              >
                {addressOrEns()}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className={`cp history-table-header-col goToCenter ${
              this.state.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="Accounts"
            onClick={() => {
              if (this.state.tableData.length > 0) {
                this.handleSort(this.state.tableSortOpt[0].title);
              }
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Nametag
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "nametag",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "nametag") {
            return rowData.nameTag ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.nameTag}
              >
                <span
                  onMouseEnter={() => {
                    WatchlistNameHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hover: rowData.nameTag,
                    });
                    this.updateTimer();
                  }}
                  className="dotDotText text-center"
                >
                  {rowData.nameTag}
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
            className={`cp history-table-header-col goToCenter ${
              this.state.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="isAnalyzed"
            onClick={() => {
              if (this.state.tableData.length > 0) {
                this.handleSort(this.state.tableSortOpt[1].title);
              }
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Analyzed
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "isAnalyzed",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "isAnalyzed") {
            const passToggleAnalyzed = (isChecked) => {
              this.updateWatchListAnalyzed(
                rowData.nameTag,
                rowData.address,
                isChecked,
                true
              );
            };
            return (
              <CheckboxCustomTable
                handleOnClick={passToggleAnalyzed}
                isChecked={rowData?.isAnalyzed}
              />
            );
          }
        },
      },
      {
        labelName: (
          <div
            className={`cp history-table-header-col goToCenter ${
              this.state.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="remark"
            onClick={() => {
              if (this.state.tableData.length > 0) {
                this.handleSort(this.state.tableSortOpt[2].title);
              }
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Remarks
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "remark",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "remark") {
            const passRemarkChanged = (newRemark) => {
              this.updateWatchListRemark(
                rowData.nameTag,
                rowData.address,
                newRemark
              );
            };
            return (
              <RemarkInput
                onSubmit={passRemarkChanged}
                remark={rowData.remark ? rowData.remark : ""}
              />
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Delete
            </span>
          </div>
        ),
        dataKey: "deleteCol",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "deleteCol") {
            const deleteThisAddress = (isChecked) => {
              const data = new URLSearchParams();
              data.append("address", rowData.address);

              this.props.removeAddressFromWatchList(
                data,
                this,
                rowData.address,
                rowData.nameTag
              );
            };
            return (
              <div
                className="watchListDeleteContainer"
                onClick={deleteThisAddress}
              >
                <Image
                  style={{ height: "2rem", width: "2rem" }}
                  src={DeleteIcon}
                  className="watchListDelete"
                />
              </div>
            );
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
                apiResponse={(e) => this.CheckApiResponse(e)}
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
                callApi={this.callApi}
                location={this.props.location}
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
              title={"Following"}
              subTitle={"Addresses you follow"}
              // showpath={true}
              // currentPage={"transaction-history"}
              history={this.props.history}
              topaccount={true}
              ShareBtn={false}
              handleShare={this.handleShare}
              btnText="Add address"
              handleBtn={this.handleAddWatchlistAddress}
            />
            <div style={{ paddingBottom: "2rem" }}>
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
                        <div className="form-groupContainer">
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
                              inputField: "search-input watchListSearchInput",
                              prefix: "search-prefix",
                              suffix: "search-suffix",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>

              <div className="transaction-history-table watchListTableContainer">
                {this.state.tableLoading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "69rem",
                    }}
                  >
                    <Loading />
                  </div>
                ) : (
                  <>
                    <TransactionTable
                      noSubtitleBottomPadding
                      showHeaderOnEmpty
                      tableData={this.state.tableData}
                      columnList={columnList}
                      message="Follow wallet addresses or ENS names effortlessly. Add notes and review them when you wish."
                      totalPage={this.state.totalPage}
                      history={this.props.history}
                      location={this.props.location}
                      page={this.state.currentPage}
                      tableLoading={this.state.tableLoading}
                      onPageChange={this.onPageChange}
                      addWatermark
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  WatchListState: state.WatchListState,
  WatchListLoadingState: state.WatchListLoadingState,
});
const mapDispatchToProps = {
  setPageFlagDefault,
  TopsetPageFlagDefault,
  getWatchList,
  updateAddToWatchList,
  getWatchListLoading,
  GetAllPlan,
  getUser,
  removeAddressFromWatchList,
};

WatchListPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(WatchListPage);
