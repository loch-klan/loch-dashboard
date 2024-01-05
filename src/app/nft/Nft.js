import React, { Component } from "react";
import { connect } from "react-redux";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { BaseReactComponent } from "../../utils/form";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { Image } from "react-bootstrap";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import TransactionTable from "../intelligence/TransactionTable";
import NftDummy from "./../../assets/images/nft_dummy.png";
import { mobileCheck } from "../../utils/ReusableFunctions";
import "./_nft.scss";

class NFT extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
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
          title: "Holdings",
          up: false,
        },
      ],
      isMobile: false,
    };
  }

  componentDidMount() {
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
  }

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
              onClick={() => this.handleTableSort("time")}
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
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 grey-4F4"
              >
                Collection
              </span>
            </CustomOverlay>
            <Image
              // onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
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
              // onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
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
              // onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
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
              // onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
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
              // onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
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
                // history
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            <div className="rightSmartMoneyContainer" style={{marginBottom:'1.5rem'}}>
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
                  wrapperStyle={{ minHeight: "500px" }}
                  noSubtitleBottomPadding
                  tableData={this.state.tableData}
                  columnList={columnList}
                  message={"No NFTs found"}
                  totalPage={122}
                  history={this.props.history}
                  location={this.props.location}
                  page={1}
                  tableLoading={false}
                  pageLimit={10}
                  onPageChange={() => {}}
                  addWatermark
                  paginationNew
                  mi
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

NFT.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFT);
