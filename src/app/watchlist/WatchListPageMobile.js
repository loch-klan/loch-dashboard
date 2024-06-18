import { connect } from "react-redux";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form";
import {
  TruncateText,
  openAddressInSameTab,
} from "../../utils/ReusableFunctions";
import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";
import {
  WatchlistClickedAccount,
  WatchlistNameHover,
} from "../../utils/AnalyticsFunctions";
import { BASE_URL_S3 } from "../../utils/Constant";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { Image } from "react-bootstrap";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import DeleteIcon from "../../assets/images/icons/trashIcon.svg";
import TransactionTable from "../intelligence/TransactionTable";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import Loading from "../common/Loading";

class WatchListPageMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  onChangeMethod = () => {};

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
        coumnWidth: 0.35,
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
                  resetPreviewAddress();
                  let lochUser = getCurrentUser().id;
                  WatchlistClickedAccount({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    account: rowData.address ? rowData.address : "",
                    name_tag: rowData.nameTag ? rowData.nameTag : "",
                  });

                  let slink = rowData.address;
                  let shareLink =
                    BASE_URL_S3 + "home/" + slink + "?redirect=home";
                  if (lochUser) {
                    const alreadyPassed =
                      window.localStorage.getItem("PassedRefrenceId");
                    if (alreadyPassed) {
                      shareLink = shareLink + "&refrenceId=" + alreadyPassed;
                    } else {
                      shareLink = shareLink + "&refrenceId=" + lochUser;
                    }
                  }
                  // window.open(shareLink, "_blank", "noreferrer");
                  openAddressInSameTab(slink, this.props.setPageFlagDefault);

                  // this.updateWatchListAnalyzed(
                  //   rowData.nameTag,
                  //   rowData.address,
                  //   true,
                  //   false
                  // );
                  // setTimeout(() => {
                  //   resetPreviewAddress();
                  //   WatchlistClickedAccount({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //     account: rowData.address ? rowData.address : "",
                  //     name_tag: rowData.nameTag ? rowData.nameTag : "",
                  //   });
                  //   this.updateTimer();
                  //   let obj = JSON.parse(
                  //     window.localStorage.getItem("previewAddress")
                  //   );
                  //   window.localStorage.setItem(
                  //     "previewAddress",
                  //     JSON.stringify({
                  //       ...obj,
                  //       address: rowData.address,
                  //       nameTag: rowData.nameTag ? rowData.nameTag : "",
                  //     })
                  //   );
                  //   window.localStorage.setItem(
                  //     "previewAddressGoToWhaleWatch",
                  //     JSON.stringify({
                  //       goToWhaleWatch: false,
                  //     })
                  //   );
                  //   this.props?.TopsetPageFlagDefault();
                  //   this.props.history.push("/top-accounts/home");
                  // }, 200);
                }}
                className="top-account-address dotDotText table-data-font"
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
            className={`cp history-table-header-col goToCenter table-header-font ${
              this.props.tableData.length === 0 ? "no-hover" : ""
            }`}
            id="Accounts"
            onClick={() => {
              if (this.props.tableData.length > 0) {
                this.props.handleSort(this.props.tableSortOpt[0].title);
              }
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16">Nametag</span>
            <Image
              src={sortByIcon}
              className={
                this.props.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "nametag",
        coumnWidth: 0.35,
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
                  }}
                  className="dotDotText text-center table-data-font"
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
            className="cp history-table-header-col goToCenter no-hover"
            id="Accounts"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4"></span>
          </div>
        ),
        dataKey: "deleteCol",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "deleteCol") {
            const deleteThisAddress = (isChecked) => {
              const data = new URLSearchParams();
              data.append("address", rowData.address);

              this.props.removeAddressFromWatchList(
                data,
                this.props.parentCtx,
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
      <div className=" watchlist-mobile">
        <div className="mobile-header-container">
          <h4>Following</h4>
          <p>Addresses you follow</p>
        </div>
        <div
          className="combine-search-prefix-icon"
          style={{ marginTop: "1.2rem" }}
        >
          <Form
            onValidSubmit={() => this.props.onValidSubmit(this.state.search)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-betwee",
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
                <div className="searchBar top-account-search input-noshadow-dark">
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
        {this.props.tableLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70rem",
              background: "var(--cardBackgroud)",
              borderRadius: "1.2rem",
              margin: "2rem 0rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div
            style={{
              backgroundColor:
                this.props?.tableData.length > 0 ? "" : "var(--cardBackgroud)",
              marginBottom: this.props?.tableData.length > 0 ? "" : "2rem",
              marginTop: "2rem",
              borderRadius: "1.2rem",
            }}
            className="transaction-table-section"
          >
            <TransactionTable
              columnList={columnList}
              tableData={this.props.tableData}
              tableSortOpt={this.props.tableSortOpt}
              handleSort={this.props.handleSort}
              isMiniVersion
              message="Follow wallet addresses or ENS names effortlessly."
              headerHeight={60}
              paginationNew
              totalPage={this.props.totalPage}
              history={this.props.history}
              location={this.props.location}
              page={this.props.currentPage}
              onPageChange={this.props.onPageChange}
              minimalPagination
              hidePaginationRecords
              currentPage={this.props.page}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

WatchListPageMobile.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WatchListPageMobile);
