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
import NftMobileHeader from "./NftMobileHeader";
import Loading from "../common/Loading";
import { BlackManIcon, GreyManIcon, InfoCircleSmartMoneyIcon, PlusCircleSmartMoneyIcon, QuestionmarkCircleSmartMoneyIcon, ShareProfileIcon } from "../../assets/images/icons";
import SmartMoneyMobileBlock from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileBlock";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination";
import NftMobileBlock from "./NftMobileBlock";

class NFTMobile extends BaseReactComponent {
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
      localLochUser: JSON.parse(window.sessionStorage.getItem("lochUser")),
      BlackManIconLoaded: false,
      ShareProfileIconLoaded: false,
    };
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
      <div className="nft-page-mobile">
        <NftMobileHeader/>
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              paddingTop: "9rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            <div className="mobileSmartMoneyBtnsContainer">
              {this.state.localLochUser &&
              (this.state.localLochUser.email ||
                this.state.localLochUser.first_name ||
                this.state.localLochUser.last_name) ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      onClick={this.showSignOutModal}
                      style={{
                        flex: 1,
                      }}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={BlackManIcon}
                          onLoad={() => {
                            this.setState({
                              BlackManIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.BlackManIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        {this.state.localLochUser.first_name ||
                        this.state.localLochUser.last_name
                          ? `${this.state.localLochUser.first_name} ${
                              this.state.localLochUser.last_name
                                ? this.state.localLochUser.last_name.slice(
                                    0,
                                    1
                                  ) + "."
                                : ""
                            }`
                          : "Signed in"}
                      </div>
                    </div>
                    {/* <div
                      onClick={this.handleShare}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnShareContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={ShareProfileIcon}
                          onLoad={() => {
                            this.setState({
                              ShareProfileIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.ShareProfileIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Share
                      </div>
                    </div> */}
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                      onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        margin: "0rem 1rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                    <div
                      onClick={this.showAddAddressModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={PlusCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              PlusCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.PlusCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Add address
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                      }}
                    //   onClick={this.showSignInModal}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={GreyManIcon}
                          onLoad={() => {
                            this.setState({
                              GreyManIconIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.GreyManIconIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        Sign in
                      </div>
                    </div>
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                    //   onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginRight: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <div className="mobileSmartMoneyListContainer">
                {this.props.tableData.map((mapData) => {
                  return (
                    <NftMobileBlock
                      data={mapData}
                    />
                  );
                })}
              </div>
            ) : null}
            {/* {this.props.tableData && this.props.tableData.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                pageLimit={this.props.pageLimit}
                changePageLimit={this.props.changePageLimit}
                onPageChange={this.props.onPageChange}
                openSignInOnclickModal={this.openSignInOnclickModal}
                smartMoneyBlur={this.props.blurTable}
                isMobile
              />
            ) : null} */}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

NFTMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFTMobile);
