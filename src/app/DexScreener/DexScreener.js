import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  DexScreenerDoubleArrowIcon,
  DexScreenerHeaderBellIcon,
  DexScreenerHeaderPlusIcon,
  DexScreenerHeaderSearchIcon,
  DexScreenerTelegramIcon,
  DexScreenerTwitterIcon,
  DexScreenerWebsiteIcon,
} from "../../assets/images/icons";
import { mobileCheck, scrollToTop } from "../../utils/ReusableFunctions";
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
import MobileLayout from "../layout/MobileLayout";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import DexScreenerChart from "./DexScreenerChart";
import DexScreenerFourTables from "./DexScreenerFourTables";
import DexScreenerPriceAlertModal from "./DexScreenerPriceAlertModal/DexScreenerPriceAlertModal";
import "./_dexScreener.scss";
import DexScreenerHeaderBtns from "./DexScreenerHeaderBtns";

class DexScreener extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      goToBottom: false,
      apiResponse: false,
      isPriceAlertModal: false,
      transactionsTableData: [
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
      topTradersTableData: [
        {
          date: "#1",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "-",
          balance: "-",
        },
        {
          date: "#2",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "$16.7K",
          balance: "153.4k of 18.0M",
        },
        {
          date: "#3",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "-",
          balance: "-",
        },
        {
          date: "#4",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "$16.7K",
          balance: "153.4k of 18.0M",
        },
        {
          date: "#5",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "-",
          balance: "-",
        },
        {
          date: "#6",
          maker: "j1oAbx...txTF",
          makerImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          boughtAmount: "$1,087",
          boughtDesc: "89.2K / 6 txns",
          soldAmount: "$1,087",
          soldDesc: "89.2K / 6 txns",
          pnl: "$16.7K",
          unrealized: "$16.7K",
          balance: "153.4k of 18.0M",
        },
      ],
      holdersTableData: [
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
        {
          address: "j1oAbx...txTF",
          addressImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux769qx1ll7odawqkz5laAWltA-6yQCZ7_w&s",
          percentage: "9.44%",
          amountAmount: "78.2M",
          amountDesc: "out of 829.0M",
          value: "$158.7K",
        },
      ],
      liquidityProvidersTableData: [
        {
          address: "Burned",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
        },
        {
          address: "5q544f...e4j1",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
        },
        {
          address: "Burned",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
        },
        {
          address: "Burned",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
        },
        {
          address: "Burned",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
        },
        {
          address: "Burned",
          percentage: "263.4K",
          amountAmount: "78.2M",
          amountDesc: "out of 263.4K",
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
  }
  showPriceAlertModal = () => {
    this.setState({
      isPriceAlertModal: true,
    });
  };
  hidePriceAlertModal = () => {
    this.setState({
      isPriceAlertModal: false,
    });
  };

  render() {
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
      <div className="dex-screener-page history-table-section">
        {this.state.isPriceAlertModal ? (
          <DexScreenerPriceAlertModal
            hideOnblur
            show
            onHide={this.hidePriceAlertModal}
            history={this.props.history}
            modalType={"price_alert"}
            hideSkip={true}
            curToken="curToken"
          />
        ) : null}
        <div className="portfolio-page-section">
          <div className="portfolio-section">
            <WelcomeCard
              showDexScreenerSearch
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
        <div className="history-table  page-scroll">
          <div className="page-scroll-child">
            <div className="portfolio-page-section">
              <div
                className="portfolio-container page"
                style={{ overflow: "visible" }}
              >
                <div className="portfolio-section ">
                  <div className="dex-screener-page-header">
                    <PageHeader
                      title={"Scooby Doo"}
                      subTitle={""}
                      currentPage={"dex-screener"}
                      history={this.props.history}
                      ShareBtn={false}
                      updateTimer={this.updateTimer}
                      RightElement={() => (
                        <DexScreenerHeaderBtns
                          showPriceAlertModal={this.showPriceAlertModal}
                        />
                      )}
                    />
                  </div>
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

                  <DexScreenerFourTables
                    transactionsTableData={this.state.transactionsTableData}
                    topTradersTableData={this.state.topTradersTableData}
                    holdersTableData={this.state.holdersTableData}
                    liquidityProvidersTableData={
                      this.state.liquidityProvidersTableData
                    }
                  />
                </div>
                <div className="dex-screener-right">
                  <div className="dex-screener-image-banner">
                    <div className="dex-screener-image-data">
                      <div className="dex-screener-image-follow-container">
                        <div className="dex-screener-image-follow">Follow</div>
                      </div>
                      <div className="dex-screener-blocks-container">
                        <div className="dex-screener-banners dex-screener-social-blocks">
                          <Image
                            className="dex-screener-sb-icon"
                            src={DexScreenerWebsiteIcon}
                          />
                          {/* <div className="dex-screener-sb-text">Website</div> */}
                        </div>
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
                          {/* <div className="dex-screener-sb-text">Twitter</div> */}
                        </div>
                        <div className="dex-screener-banners dex-screener-social-blocks">
                          <Image
                            className="dex-screener-sb-icon"
                            src={DexScreenerTelegramIcon}
                          />
                          {/* <div className="dex-screener-sb-text">Telegram</div> */}
                        </div>
                      </div>
                    </div>
                    <Image
                      src="https://i.pinimg.com/736x/60/0f/ba/600fba02995ea5fd7662216e5b54f736.jpg"
                      className="dex-screener-image"
                      alt=""
                    />
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
                  <div className="dex-screener-right-data-table">
                    <div
                      style={{
                        paddingTop: "0rem",
                      }}
                      className="dex-screener-right-data-rows"
                    >
                      <div className="dex-screener-right-data-rows-title">
                        Pair created
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-amount">
                          10d 10h ago
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-right-data-rows">
                      <div className="dex-screener-right-data-rows-title">
                        Pooled SCHOOBY
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-amount">
                          339,344,568
                        </div>
                        <div className="dex-screener-right-data-rows-amount">
                          $18K
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-right-data-rows">
                      <div className="dex-screener-right-data-rows-title">
                        Pooled SOL
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-amount">
                          118.39
                        </div>
                        <div className="dex-screener-right-data-rows-amount">
                          $19K
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-right-data-rows">
                      <div className="dex-screener-right-data-rows-title">
                        Pair
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-btn">
                          UMVxG...xAUe
                        </div>
                        <div className="dex-screener-right-data-rows-title">
                          EXP
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-right-data-rows">
                      <div className="dex-screener-right-data-rows-title">
                        SCHOOBY
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-btn">
                          scoob...wPHK
                        </div>
                        <div className="dex-screener-right-data-rows-title">
                          EXP
                        </div>
                      </div>
                    </div>
                    <div className="dex-screener-right-data-rows">
                      <div className="dex-screener-right-data-rows-title">
                        SOL
                      </div>
                      <div className="dex-screener-right-data-rows-dta-container">
                        <div className="dex-screener-right-data-rows-btn">
                          So111...1112
                        </div>
                        <div className="dex-screener-right-data-rows-title">
                          EXP
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      margin: "1rem 0rem",
                    }}
                    className="ds-ph-btns-container"
                  >
                    <div
                      style={{
                        width: "calc( 50% - 5px)",
                      }}
                      className="ds-ph-btn"
                    >
                      <Image
                        src={DexScreenerHeaderSearchIcon}
                        className="ds-ph-btn-image"
                      />
                      <div className="ds-ph-btn-text">Search on Twitter</div>
                    </div>
                    <div
                      style={{
                        width: "calc( 50% - 5px)",
                      }}
                      className="ds-ph-btn"
                    >
                      <Image
                        src={DexScreenerHeaderPlusIcon}
                        className="ds-ph-btn-image"
                      />
                      <div className="ds-ph-btn-text">Other pairs</div>
                    </div>
                  </div>
                  <div className="dex-screener-right-convertor-container">
                    <div className="dex-screener-right-convertor">
                      <div className="dex-screener-right-convertor-input">
                        <input className="dex-screener-right-convertor-input-box" />
                      </div>
                      <div className="dex-screener-right-convertor-right">
                        Scooby
                      </div>
                    </div>
                    <div className="dex-screener-right-arrow">
                      <Image
                        className="dex-screener-right-arrow-image"
                        src={DexScreenerDoubleArrowIcon}
                      />
                    </div>
                    <div className="dex-screener-right-convertor">
                      <div className="dex-screener-right-convertor-input">
                        <input className="dex-screener-right-convertor-input-box" />
                      </div>
                      <div className="dex-screener-right-convertor-right">
                        <div className="dex-screener-right-convertor-right-text dex-screener-right-convertor-right-text-selected">
                          USD
                        </div>
                        <div className="dex-screener-right-convertor-right-text">
                          SOL
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

DexScreener.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(DexScreener);
