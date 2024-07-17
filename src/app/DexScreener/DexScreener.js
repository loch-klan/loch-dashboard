import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  DexScreenerTelegramIcon,
  DexScreenerTwitterIcon,
  DexScreenerTxnIcon,
  DexScreenerWebsiteIcon,
} from "../../assets/images/icons";
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
import PageHeader from "../common/PageHeader";
import { getAvgCostBasis } from "../cost/Api";
import TransactionTable from "../intelligence/TransactionTable";
import MobileLayout from "../layout/MobileLayout";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import DexScreenerChart from "./DexScreenerChart";
import "./_dexScreener.scss";

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
        {
          date: "1m ago",
          type: "Buy",
          usd: "$0.66",
          scooby: "$1.43",
          sol: "0.004674",
          price: "$0.4634",
          maker: "mveKFw",
        },
        {
          date: "1m ago",
          type: "Buy",
          usd: "$0.66",
          scooby: "$1.43",
          sol: "0.004674",
          price: "$0.4634",
          maker: "mveKFw",
        },
        {
          date: "1m ago",
          type: "Buy",
          usd: "$0.66",
          scooby: "$1.43",
          sol: "0.004674",
          price: "$0.4634",
          maker: "mveKFw",
        },
        {
          date: "1m ago",
          type: "Buy",
          usd: "$0.66",
          scooby: "$1.43",
          sol: "0.004674",
          price: "$0.4634",
          maker: "mveKFw",
        },
        {
          date: "1m ago",
          type: "Buy",
          usd: "$0.66",
          scooby: "$1.43",
          sol: "0.004674",
          price: "$0.4634",
          maker: "mveKFw",
        },
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

    // this.props.getNFT(tempNFTData, this, isDefault);
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
            <span className="inter-display-medium f-s-13 lh-16 ">Date</span>
          </div>
        ),
        dataKey: "date",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "date") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.date}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Type</span>
          </div>
        ),
        dataKey: "type",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "type") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.type}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">USD</span>
          </div>
        ),
        dataKey: "USD",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "USD") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.usd}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">SCOOBY</span>
          </div>
        ),
        dataKey: "SCOOBY",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "SCOOBY") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.scooby}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">SOL</span>
          </div>
        ),
        dataKey: "SOL",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "SOL") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.sol}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Price</span>
          </div>
        ),
        dataKey: "Price",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Price") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.price}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Maker</span>
          </div>
        ),
        dataKey: "Maker",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Maker") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.maker}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">TXN</span>
          </div>
        ),
        dataKey: "TXN",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "TXN") {
            return (
              <Image
                src={DexScreenerTxnIcon}
                style={{
                  height: "15px",
                  filter: "var(--invertColor)",
                }}
              />
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
          {/* <NftMobile
            isLoading={this.state.isLoading}
            tableData={this.state.tableData}
            currentPage={this.state.currentPage}
            pageCount={this.props.NFTState?.total_count}
            pageLimit={10}
            location={this.props.location}
            history={this.props.history}
          /> */}
        </MobileLayout>
      );
    }
    return (
      <div className="dex-screener-page history-table-section  m-t-80">
        <div className="history-table  page-scroll">
          <div className="page-scroll-child">
            <div className="portfolio-page-section">
              <div
                className="portfolio-container page"
                style={{ overflow: "visible" }}
              >
                <div className="portfolio-section ">
                  <WelcomeCard
                    openConnectWallet={this.props.openConnectWallet}
                    connectedWalletAddress={this.props.connectedWalletAddress}
                    connectedWalletevents={this.props.connectedWalletevents}
                    disconnectWallet={this.props.disconnectWallet}
                    isSidebarClosed={this.props.isSidebarClosed}
                    apiResponse={(e) => this.CheckApiResponse(e)}
                    // history
                    history={this.props.history}
                  />

                  <PageHeader
                    title={"Scooby Doo"}
                    subTitle={""}
                    currentPage={"nft"}
                    history={this.props.history}
                    ShareBtn={false}
                    updateTimer={this.updateTimer}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
              }}
              className="history-table-section"
            >
              <div className="dex-screener-body">
                <div className="dex-screener-left">
                  <div className="dex-screener-chart-continaer">
                    <div className="dex-screener-chart">
                      <DexScreenerChart />
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "unset",
                    }}
                    className="transaction-history-table overflow-table-header-visible"
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
                <div className="dex-screener-right">
                  <div className="dex-screener-image-banner">
                    <Image
                      src="https://s3-alpha-sig.figma.com/img/61f4/6930/32d6e879c01582b21f998446b608b17a?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oaCCi~j6uKSN~Ph-VwI6GpQ03kJ1I-Tveuj-Wf9cqAK~XXsrEgWnRRz38UfU7r4J~eFU5zECA~2zESccW3xzQV08p87mdKLtySRZhydjgkcBPt4MWtdlT2GpptF9ApnWTYBEfsCrhvYelOlLoWgl7mW2-7f5cKLau1cECbmeiPzNIoZ2AlSkuZlvtMMTlOC2q23ebHQD8XNNWAV85eRMA2u9mYdldJbPuhecnt-H1BaSmG3hshiM6pXTJNv5q5DLsJEc9VjqS~~Zele4mnmuMXY16eHLjEthQzw35gN-NNdTqZu-yiKozQEK0nd0R7CalJpPTSnEfxYwyjvf0GbaGw__"
                      className="dex-screener-image"
                    />
                  </div>
                  <div className="dex-screener-banners ">Follow Scooby</div>
                  <div className="dex-screener-blocks-container">
                    <div
                      style={{
                        gap: "8px",
                      }}
                      className="dex-screener-banners dex-screener-social-blocks"
                    >
                      <Image
                        className="dex-screener-sb-icon"
                        src={DexScreenerTwitterIcon}
                      />
                      <div className="dex-screener-sb-text">Twitter</div>
                    </div>
                    <div className="dex-screener-banners dex-screener-social-blocks">
                      <Image
                        className="dex-screener-sb-icon"
                        src={DexScreenerTelegramIcon}
                      />
                      <div className="dex-screener-sb-text">Telegram</div>
                    </div>
                    <div className="dex-screener-banners dex-screener-social-blocks">
                      <Image
                        className="dex-screener-sb-icon"
                        src={DexScreenerWebsiteIcon}
                      />
                      <div className="dex-screener-sb-text">Website</div>
                    </div>
                  </div>
                  <div className="dex-screener-blocks-container">
                    <div className="dex-screener-banners dex-screener-data-banners">
                      <div className="dex-screener-db-subtext">Price USD</div>
                      <div className="dex-screener-db-text">$0.01723</div>
                    </div>
                    <div className="dex-screener-banners dex-screener-data-banners">
                      <div className="dex-screener-db-subtext">Price USD</div>
                      <div className="dex-screener-db-text">$0.0001206 SOL</div>
                    </div>
                  </div>
                  <div className="dex-screener-blocks-container">
                    <div className="dex-screener-banners dex-screener-data-banners">
                      <div className="dex-screener-db-subtext">Liquidity</div>
                      <div className="dex-screener-db-text">$983K</div>
                    </div>
                    <div className="dex-screener-banners dex-screener-data-banners">
                      <div className="dex-screener-db-subtext">FVD</div>
                      <div className="dex-screener-db-text">$14.2M</div>
                    </div>
                    <div className="dex-screener-banners dex-screener-data-banners">
                      <div className="dex-screener-db-subtext">MKT CAP</div>
                      <div className="dex-screener-db-text">$14.2M</div>
                    </div>
                  </div>
                  <div className="dex-screener-banners dex-screener-data-points">
                    <div className="dex-screener-dp-header">
                      <div className="dex-screener-dp-header-blocks">
                        <div className="dex-screener-dp-hb-subtext">5M</div>
                        <div className="dex-screener-dp-hb-text dex-screener-dp-hb-text-profit">
                          0.98%
                        </div>
                      </div>
                      <div className="dex-screener-dp-header-blocks">
                        <div className="dex-screener-dp-hb-subtext">1H</div>
                        <div className="dex-screener-dp-hb-text dex-screener-dp-hb-text-loss">
                          -6.27%
                        </div>
                      </div>
                      <div className="dex-screener-dp-header-blocks">
                        <div className="dex-screener-dp-hb-subtext">6H</div>
                        <div className="dex-screener-dp-hb-text dex-screener-dp-hb-text-profit">
                          12.06%
                        </div>
                      </div>
                      <div className="dex-screener-dp-header-blocks dex-screener-dp-header-blocks-selected">
                        <div className="dex-screener-dp-hb-subtext">24H</div>
                        <div className="dex-screener-dp-hb-text dex-screener-dp-hb-text-profit">
                          12.06%
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-dp-body">
                      <div className="dex-screener-dp-body-ele">
                        <div className="dex-screener-dp-body-ele-left">
                          <div className="dex-screener-dp-bel-subtext">
                            TXNS
                          </div>
                          <div className="dex-screener-dp-bel-text">49,658</div>
                        </div>
                        <div className="dex-screener-dp-body-ele-right">
                          <div className="dex-screener-dp-bel-profit-container">
                            <div className="dex-screener-dp-bel-profit-text">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                BUYS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                26,138
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-profit-line" />
                          </div>
                          <div className="dex-screener-dp-bel-loss-container">
                            <div className="dex-screener-dp-bel-profit-text dex-screener-dp-bel-profit-text-right">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                SELLS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                23,510
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-loss-line" />
                          </div>
                        </div>
                      </div>
                      <div className="dex-screener-dp-body-ele">
                        <div className="dex-screener-dp-body-ele-left">
                          <div className="dex-screener-dp-bel-subtext">
                            VOLUME
                          </div>
                          <div className="dex-screener-dp-bel-text">$13,7M</div>
                        </div>
                        <div className="dex-screener-dp-body-ele-right">
                          <div className="dex-screener-dp-bel-profit-container">
                            <div className="dex-screener-dp-bel-profit-text">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                BUYS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                12,831
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-profit-line" />
                          </div>
                          <div className="dex-screener-dp-bel-loss-container">
                            <div className="dex-screener-dp-bel-profit-text dex-screener-dp-bel-profit-text-right">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                SELLS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                1,198
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-loss-line" />
                          </div>
                        </div>
                      </div>
                      <div className="dex-screener-dp-body-ele">
                        <div className="dex-screener-dp-body-ele-left">
                          <div className="dex-screener-dp-bel-subtext">
                            MAKERS
                          </div>
                          <div className="dex-screener-dp-bel-text">14,173</div>
                        </div>
                        <div className="dex-screener-dp-body-ele-right">
                          <div className="dex-screener-dp-bel-profit-container">
                            <div className="dex-screener-dp-bel-profit-text">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                BUYS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                $6.9M
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-profit-line" />
                          </div>
                          <div className="dex-screener-dp-bel-loss-container">
                            <div className="dex-screener-dp-bel-profit-text dex-screener-dp-bel-profit-text-right">
                              <div className="dex-screener-dp-bel-profit-text-subtext">
                                SELLS
                              </div>
                              <div className="dex-screener-dp-bel-profit-text-text">
                                $6.7M
                              </div>
                            </div>
                            <div className="dex-screener-dp-bel-line dex-screener-dp-bel-loss-line" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
