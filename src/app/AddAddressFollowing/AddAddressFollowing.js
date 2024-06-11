import React from "react";
import { Form, Image } from "react-bootstrap";
import { connect } from "react-redux";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  dontOpenLoginPopup,
  mobileCheck,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";
import CustomTextControl from "../../utils/form/CustomTextControl.js";
import FormElement from "../../utils/form/FormElement.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import PageHeader from "../common/PageHeader.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import MobileLayout from "../layout/MobileLayout.js";
import AddAddressFollowingMobile from "./AddAddressFollowingMobile.js";
import "./_addAddressFollowing.scss";
import { addAddressToWatchList } from "../watchlist/redux/WatchListApi.js";
import { setPageFlagDefault } from "../common/Api.js";
import { toast } from "react-toastify";
import { getCurrentUser, getToken } from "../../utils/ManageToken.js";
import { CopyTradeWelcomeAddressAdded } from "../../utils/AnalyticsFunctions.js";

class AddAddressFollowing extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      search: "",
    };
  }
  componentDidMount() {
    scrollToTop();
    dontOpenLoginPopup();
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.props.history.push("/watchlist");
    }
  }
  goBackToWelcome = () => {
    this.props.history.push("/copy-trade-welcome");
  };
  onChangeMethod = () => {};
  funAfterUserCreate = (passedAddress) => {
    const followAddressData = new URLSearchParams();
    followAddressData.append("wallet_address", passedAddress);
    followAddressData.append("type", "self");
    followAddressData.append("name_tag", "");
    CopyTradeWelcomeAddressAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: "Following page",
    });
    this.props.addAddressToWatchList(
      followAddressData,
      this,
      passedAddress,
      ""
    );
  };
  addressAddedFun = () => {
    toast.success("You are now following this address");
    this.props.setPageFlagDefault();
  };

  render() {
    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter table-header-font no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16">Account</span>
          </div>
        ),
        dataKey: "account",
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return <div />;
          }
        },
      },
      {
        labelName: (
          <div
            className={`cp history-table-header-col goToCenter table-header-font ${
              this.state.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16">Nametag</span>
            <Image src={sortByIcon} className={"rotateUp"} />
          </div>
        ),
        dataKey: "nametag",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "nametag") {
            return rowData.nameTag ? <div /> : "-";
          }
        },
      },

      {
        labelName: (
          <div
            className={`cp history-table-header-col goToCenter table-header-font ${
              this.state.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="remark"
          >
            <span className="inter-display-medium f-s-13 lh-16">Remarks</span>
            <Image className={"rotateUp"} src={sortByIcon} />
          </div>
        ),
        dataKey: "remark",
        coumnWidth: 0.35,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "remark") {
            return <div />;
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col goToCenter table-header-font no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16">Delete</span>
          </div>
        ),
        dataKey: "deleteCol",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "deleteCol") {
            return <div />;
          }
        },
      },
    ];
    if (mobileCheck()) {
      return (
        <MobileLayout
          isAddNewAddressLoggedIn
          history={this.props.history}
          isSidebarClosed={this.props.isSidebarClosed}
          currentPage={"watchlist"}
          hideAddresses
          hideFooter
          goBackToWelcomePage={this.goBackToWelcome}
          blurredElement
          goToPageAfterLogin="/watchlist"
          isAddNewAddress
          hideShare
          funAfterUserCreate={this.funAfterUserCreate}
        >
          <AddAddressFollowingMobile
            tableData={this.state.tableData}
            columnList={this.state.columnList}
          />
        </MobileLayout>
      );
    } else
      return (
        <div className="add-address-following-page-container">
          {/* topbar */}
          <div className="portfolio-page-section ">
            <div
              className="portfolio-container page"
              style={{ overflow: "visible" }}
            >
              <div className="portfolio-section">
                {/* welcome card */}
                <WelcomeCard
                  isAddNewAddressLoggedIn
                  openConnectWallet={this.props.openConnectWallet}
                  connectedWalletAddress={this.props.connectedWalletAddress}
                  connectedWalletevents={this.props.connectedWalletevents}
                  disconnectWallet={this.props.disconnectWallet}
                  isSidebarClosed={this.props.isSidebarClosed}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  // history
                  history={this.props.history}
                  // add wallet address modal
                  handleAddModal={this.handleAddModal}
                  updateTimer={this.updateTimer}
                  goToPageAfterLogin="/watchlist"
                  funAfterUserCreate={this.funAfterUserCreate}
                />
              </div>
            </div>
          </div>

          <div onClick={this.goBackToWelcome} className="blurredElement">
            <div className="portfolio-page-section">
              <div
                className="portfolio-container page"
                style={{ overflow: "visible" }}
              >
                <div className="portfolio-section">
                  <WelcomeCard
                    isAddNewAddressLoggedIn
                    isBlurred
                    focusOriginalInputBar={this.focusOriginalInputBar}
                    hideFocusedInput={this.hideFocusedInput}
                    openConnectWallet={this.props.openConnectWallet}
                    connectedWalletAddress={this.props.connectedWalletAddress}
                    connectedWalletevents={this.props.connectedWalletevents}
                    disconnectWallet={this.props.disconnectWallet}
                    updateOnFollow={this.onFollowUpdate}
                    isSidebarClosed={this.props.isSidebarClosed}
                    apiResponse={(e) => this.CheckApiResponse(e)}
                    history={this.props.history}
                    // add wallet address modal
                    handleAddModal={this.handleAddModal}
                    handleUpdate={this.handleUpdateWallet}
                    isAddNewAddress
                    goToPageAfterLogin="/watchlist"
                    funAfterUserCreate={this.funAfterUserCreate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="history-table-section m-t-80">
            <div className="history-table page">
              <PageHeader
                title={"Following"}
                subTitle={"Addresses you follow"}
                history={this.props.history}
                topaccount={true}
                ShareBtn={false}
                handleShare={this.handleShare}
                btnText="Add address"
                handleBtn={this.handleAddWatchlistAddress}
                mainThemeBtn={true}
              />

              <div className="fillter_tabs_section">
                <Form onValidSubmit={() => null}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
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
                <>
                  <TransactionTable
                    noSubtitleBottomPadding
                    showHeaderOnEmpty
                    tableData={this.state.tableData}
                    columnList={columnList}
                    message="Follow wallet addresses or ENS names effortlessly. Add notes and review them when you wish."
                    totalPage={1}
                    history={this.props.history}
                    location={this.props.location}
                    page={0}
                    tableLoading={false}
                    onPageChange={() => null}
                    minimalPagination
                    hidePaginationRecords
                  />
                </>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  addAddressToWatchList,
  setPageFlagDefault,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressFollowing);
