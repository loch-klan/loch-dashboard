import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { NFTPage, TimeSpentNFT } from "../../utils/AnalyticsFunctions";
import { API_LIMIT, START_INDEX } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { mobileCheck } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { GetAllPlan, getUser, updateWalletListFlag } from "../common/Api";
import { getAvgCostBasis } from "../cost/Api";
import TransactionTable from "../intelligence/TransactionTable";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import NftDummy from "./../../assets/images/nft_dummy.png";
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
      apiResponse: false,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      tableData: [
        {
          holding: "3",
          collection: "Pudgy Penguins",
          imgs: [NftDummy, NftDummy],
          total_spent: 10,
          max_price: 12,
          avg_price: 10,
          volume: 100,
        },
        {
          holding: "3",
          collection: "Bored Apes",
          imgs: [
            NftDummy,
            NftDummy,
            NftDummy,
            NftDummy,
            NftDummy,
            NftDummy,
            NftDummy,
          ],
          total_spent: 10,
          max_price: 12,
          avg_price: 10,
          volume: 100,
        },
        {
          holding: "3",
          collection: "Pudgy Penguins",
          imgs: [NftDummy],
          total_spent: 10,
          max_price: 12,
          avg_price: 10,
          volume: 100,
        },
        {
          holding: "3",
          collection: "Pudgy Penguins",
          imgs: [NftDummy, NftDummy, NftDummy],
          total_spent: 10,
          max_price: 12,
          avg_price: 10,
          volume: 100,
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
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);

    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });

    this.getOtherData();
    this.callApi(this.state.currentPage || START_INDEX);
    this.startPageView();
    this.updateTimer(true);
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
      window.sessionStorage.getItem("nftPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("nftPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkWatchlistTimer);
    window.sessionStorage.removeItem("nftPageExpiryTime");
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
    const tempExpiryTime = window.sessionStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  callApi = (page = START_INDEX) => {
    this.props.updateWalletListFlag("nftPage", true);
    this.setState({
      isLoading: true,
    });
    let tempNFTData = new URLSearchParams();
    tempNFTData.append("start", page * API_LIMIT);
    tempNFTData.append("conditions", JSON.stringify(this.state.condition));
    tempNFTData.append("limit", API_LIMIT);
    tempNFTData.append("sorts", JSON.stringify(this.state.sort));
    let isDefault = false;
    if (this.state.sort.length === 0) {
      isDefault = true;
    }

    // this.props.getNFT(tempNFTData, this, isDefault);
  };
  setLocalNftData = (data) => {
    let tempNftHolder = [];
    data.forEach((resRes) => {
      tempNftHolder.push({
        holding: resRes.holding ? resRes.holding : "",
        collection: resRes.collection ? resRes.collection : "",
        imgs: resRes.imgs ? resRes.imgs : "",
        total_spent: resRes.total_spent ? resRes.total_spent : "",
        max_price: resRes.max_price ? resRes.max_price : "",
        avg_price: resRes.avg_price ? resRes.avg_price : "",
        volume: resRes.volume ? resRes.volume : "",
      });
    });

    this.setState({
      tableData: tempNftHolder,
      isLoading: false,
    });
  };
  componentDidUpdate(prevProps, prevState) {
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
  render() {
    const columnList = [
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Holdings"}
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Holdings
              </span>
            </CustomOverlay>
            <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[0].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "holding",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "holding") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.holding}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.holding}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Collection"}
            >
              <span
                onClick={() => {
                  this.handleTableSort(this.state.tableSortOpt[1].title);
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Collection
              </span>
            </CustomOverlay>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "collection",

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "collection") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.collection}
              >
                <div
                  className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div"
                  style={{
                    textDecoration: "underline",
                    lineHeight: "120%",
                  }}
                >
                  {rowData.collection}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Image"}
            >
              <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
                Image
              </span>
            </CustomOverlay>
          </div>
        ),
        dataKey: "imgs",

        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "imgs") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      justifyContent: "center",
                    }}
                  >
                    {rowData.imgs.slice(0, 10).map((item, index) => {
                      return (
                        <img
                          src={item}
                          alt=""
                          key={index}
                          style={{ width: "20px", height: "20px" }}
                        />
                      );
                    })}
                    {rowData.imgs.length > 10 ? (
                      <span
                        style={{
                          fontSize: "12px",
                          lineHeight: "120%",
                          color: "#96979A",
                          fontWeight: "500",
                        }}
                      >
                        {rowData.imgs.length - 4}+
                      </span>
                    ) : null}
                  </div>
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    justifyContent: "center",
                  }}
                >
                  {rowData.imgs.slice(0, 4).map((item, index) => {
                    return (
                      <img
                        src={item}
                        alt=""
                        key={index}
                        style={{ width: "20px", height: "20px" }}
                      />
                    );
                  })}
                  {rowData.imgs.length > 4 ? (
                    <span
                      style={{
                        fontSize: "12px",
                        lineHeight: "120%",
                        color: "#96979A",
                        fontWeight: "500",
                      }}
                    >
                      {rowData.imgs.length - 4}+
                    </span>
                  ) : null}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Total Spent (ETH)"}
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Total Spent <br /> (ETH)
              </span>
            </CustomOverlay>
            <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[2].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "total_spent",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "total_spent") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.total_spent}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.total_spent}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Max Price (ETH)"}
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Max Price <br /> (ETH)
              </span>
            </CustomOverlay>
            <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[3].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "max_price",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "max_price") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.max_price}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.max_price}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Avg Price (ETH)"}
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Avg Price <br /> (ETH)
              </span>
            </CustomOverlay>
            <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[4].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "avg_price",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "avg_price") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.avg_price}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.avg_price}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={"Volume (ETH)"}
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Volume <br /> (ETH)
              </span>
            </CustomOverlay>
            <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[5].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "volume",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "volume") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.volume}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.volume}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];
    if (this.state.isMobileDevice) {
      return (
        <NftMobile
          isLoading={this.state.isLoading}
          tableData={this.state.tableData}
        />
      );
    }
    return (
      <div className="nft-page">
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              <WelcomeCard
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            <div
              className="rightSmartMoneyContainer"
              style={{ marginBottom: "1.5rem" }}
            >
              <div className={`rightSmartMoneyContainerHeadingParent`}>
                <div
                  className={`rightSmartMoneyContainerHeading inter-display-medium f-s-24 lh-30 m-b-8`}
                >
                  NFT Collection
                </div>
              </div>
              <p
                style={{
                  // marginTop: "0.3rem",
                  fontSize: "16px",
                }}
                className="rightSmartMoneyContainerSubHeading inter-display-medium f-s-16 lh-19"
              >
                Browse the NFTs held by this wallet
              </p>
            </div>
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  // wrapperStyle={{ minHeight: "500px" }}
                  noSubtitleBottomPadding
                  tableData={this.state.tableData}
                  columnList={columnList}
                  message={"No NFTs found"}
                  totalPage={this.props.NFTState?.total_count}
                  history={this.props.history}
                  location={this.props.location}
                  page={this.state.currentPage}
                  tableLoading={this.state.isLoading}
                  pageLimit={10}
                  onPageChange={() => {}}
                  addWatermark
                  paginationNew
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
};

NFT.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFT);
