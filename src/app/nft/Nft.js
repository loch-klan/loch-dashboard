import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { DefaultNftTableIconIcon } from "../../assets/images/icons";
import {
  NFTPage,
  NFTShare,
  NftPageBack,
  NftPageNext,
  TimeSpentNFT,
} from "../../utils/AnalyticsFunctions";
import {
  API_LIMIT,
  BASE_URL_S3,
  SEARCH_BY_WALLET_ADDRESS,
  START_INDEX,
} from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  mobileCheck,
  scrollToBottomAfterPageChange,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import HandleBrokenImages from "../common/HandleBrokenImages";
import PageHeader from "../common/PageHeader";
import { getAvgCostBasis } from "../cost/Api";
import TopWalletAddressList from "../header/TopWalletAddressList";
import TransactionTable from "../intelligence/TransactionTable";
import MobileLayout from "../layout/MobileLayout";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import { getNFT } from "./NftApi";
import NftMobile from "./NftMobile";
import "./_nft.scss";

class NFT extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      goToBottom: false,
      apiResponse: false,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      tableData: [
        // {
        //   holding: "3",
        //   collection: "Bored Apes",
        //   imgs: [
        //     NftDummy,
        //     NftDummy,
        //     NftDummy,
        //     NftDummy,
        //     NftDummy,
        //     NftDummy,
        //     NftDummy,
        //   ],
        //   total_spent: 10,
        //   max_price: 12,
        //   avg_price: 10,
        //   volume: 100,
        // },
      ],
      tableSortOpt: [
        {
          title: "holdings",
          up: false,
        },
        {
          title: "collection",
          up: false,
        },
        {
          title: "totalSpent",
          up: false,
        },
        {
          title: "maxPrice",
          up: false,
        },
        {
          title: "avgPrice",
          up: false,
        },
        {
          title: "volume",
          up: false,
        },
      ],

      sort: [],
      isMobile: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    scrollToTop();
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });

    this.getOtherData();

    this.startPageView();
    this.updateTimer(true);
    if (
      this.props.NFTState &&
      this.props.NFTState?.nfts &&
      this.props.NFTState?.nfts.length > 0 &&
      this.props.commonState.nftPage
    ) {
      this.setState({
        tableData: this.props.NFTState?.nfts,
        isLoading: false,
      });
    } else {
      this.callApi(this.state.currentPage || START_INDEX);
    }
  }
  getOtherData = () => {
    this.props.getAllCoins();

    let tempData = new URLSearchParams();
    tempData.append("start", 0);
    tempData.append("conditions", JSON.stringify([]));
    tempData.append("limit", 50);
    tempData.append("sorts", JSON.stringify([]));

    this.props.getAllWalletListApi(tempData, this);
  };
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    NFTPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: this.state.isMobileDevice,
    });
    // Inactivity Check
    window.checkWatchlistTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  updateTimer = (first) => {
    const tempExistingExpiryTime =
      window.localStorage.getItem("nftPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("nftPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkWatchlistTimer);
    window.localStorage.removeItem("nftPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentNFT({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        isMobile: this.state.isMobileDevice,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  callApi = (page = START_INDEX) => {
    this.props.updateWalletListFlag("nftPage", true);
    this.setState({
      isLoading: true,
    });

    let addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    let arr = [];
    let addressList = [];

    for (let i = 0; i < addWalletList.length; i++) {
      let curr = addWalletList[i];
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
        arr.push(curr.address?.trim());
        arr.push(curr.displayAddress?.trim());
        arr.push(curr.address?.trim());
        addressList.push(curr.address?.trim());
      }
    }
    let tempNFTData = new URLSearchParams();
    const tempCond = [
      {
        key: SEARCH_BY_WALLET_ADDRESS,
        value: addressList,
      },
    ];

    tempNFTData.append("start", page * API_LIMIT);
    tempNFTData.append("conditions", JSON.stringify(tempCond));
    tempNFTData.append("limit", API_LIMIT);
    tempNFTData.append("sorts", JSON.stringify([]));
    let isDefault = false;
    if (this.state.sort.length === 0) {
      isDefault = true;
    }

    this.props.getNFT(tempNFTData, this, isDefault);
  };
  setLocalNftData = (data) => {
    this.setState({
      tableData: data.nfts,
      isLoading: false,
    });
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isLoading !== this.state.isLoading &&
      this.state.goToBottom &&
      !this.state.isLoading
    ) {
      this.setState(
        {
          goToBottom: false,
        },
        () => {
          scrollToBottomAfterPageChange();
        }
      );
    }
    if (this.props.NFTState !== prevProps.NFTState) {
      this.setState({
        tableData: this.props.NFTState?.nfts,
        isLoading: false,
      });
    }

    if (!this.props.commonState.nftPage) {
      this.getOtherData();
      this.callApi(this.state.currentPage || START_INDEX);
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

      if (prevPage - 1 === page) {
        NftPageBack({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          page_no: page + 1,
        });
        this.updateTimer();
      } else if (prevPage + 1 === page) {
        NftPageNext({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          page_no: page + 1,
        });
        this.updateTimer();
      }
    }
  }
  handleTableSort = (val) => {
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort?.forEach((el) => {
      if (el.title === val) {
        if (val === "holdings") {
          // WatchlistSortByNameTag({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          // });
          // this.updateTimer();
          // obj = [
          //   {
          //     key: SORT_BY_NAME_TAG,
          //     value: !el.up,
          //   },
          // ];
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
  CheckApiResponse = (value) => {
    if (this.props.location.state?.noLoad === undefined) {
      this.setState({
        apiResponse: value,
      });
    }

    this.props.setPageFlagDefault();
  };
  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=nft";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    NFTShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  render() {
    const columnList = [
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Holdings</span>
            {/* <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[0].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "holding",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "holding") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.holding}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">
              Collection
            </span>

            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "collection",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "collection") {
            return (
              <div
                className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div nowrap-div"
                style={{
                  lineHeight: "120%",
                }}
              >
                {rowData.collection}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Image</span>
          </div>
        ),
        dataKey: "imgs",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "imgs") {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "center",
                }}
              >
                {rowData.imgs && rowData.imgs.length > 0
                  ? rowData.imgs?.slice(0, 4).map((item, index) => {
                      if (item) {
                        return (
                          <HandleBrokenImages
                            src={item}
                            key={index}
                            className="nftImageIcon"
                            imageOnError={DefaultNftTableIconIcon}
                          />
                        );
                      }
                      return null;
                    })
                  : null}
                {rowData.imgs && rowData.imgs.length > 4 ? (
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: "120%",
                      color: "#96979A",
                      fontWeight: "500",
                    }}
                    className="table-data-font"
                  >
                    {rowData.imgs.length - 4}+
                  </span>
                ) : null}
              </div>
            );
          }
        },
      },
    ];
    if (this.state.isMobileDevice) {
      return (
        <MobileLayout
          handleShare={this.handleShare}
          showpath
          currentPage={"nft"}
          hideFooter
          history={this.props.history}
          showTopSearchBar
        >
          <NftMobile
            isLoading={this.state.isLoading}
            tableData={this.state.tableData}
            currentPage={this.state.currentPage}
            pageCount={this.props.NFTState?.total_count}
            pageLimit={10}
            location={this.props.location}
            history={this.props.history}
          />
        </MobileLayout>
      );
    }
    return (
      <div>
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              <WelcomeCard
                showTopSearchBar
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section">
          <div className="history-table page-scroll">
            <div className="page-scroll-child">
              <TopWalletAddressList
                apiResponse={(e) => this.CheckApiResponse(e)}
                handleShare={this.handleShare}
                showpath
                currentPage={"nft"}
              />
              <PageHeader
                title={"NFT Collection"}
                subTitle={"Browse the NFTs held by this portfolio"}
                currentPage={"nft"}
                history={this.props.history}
                ShareBtn={false}
                updateTimer={this.updateTimer}
              />
              <div
                style={{
                  flex: 1,
                }}
                className="transaction-history-table"
              >
                <TransactionTable
                  noSubtitleBottomPadding
                  tableData={this.state.tableData}
                  columnList={columnList}
                  message={"No NFT found"}
                  totalPage={this.props.NFTState?.total_count}
                  history={this.props.history}
                  location={this.props.location}
                  page={this.state.currentPage}
                  isLoading={this.state.isLoading}
                  pageLimit={10}
                  onPageChange={this.onPageChange}
                  addWatermark
                  paginationNew
                  hidePaginationRecords
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  NFTState: state.NFTState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  getNFT,
  updateWalletListFlag,
  getAllCoins,
  getAvgCostBasis,
  GetAllPlan,
  getUser,
  getAllWalletListApi,
  setPageFlagDefault,
};

NFT.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFT);
