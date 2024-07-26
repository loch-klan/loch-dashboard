import React from "react";
import { connect } from "react-redux";
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
import DexScreenerContent from "./DexScreenerContent";
import DexScreenerHeaderBtns from "./DexScreenerHeaderBtns";
import DexScreenerMobile from "./DexScreenerMobile";
import DexScreenerPriceAlertModal from "./DexScreenerPriceAlertModal/DexScreenerPriceAlertModal";
import "./_dexScreener.scss";

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
          currentPage={"nft"}
          hideFooter
          history={this.props.history}
          hideAddresses
          hideShare
        >
          <DexScreenerMobile
            transactionsTableData={this.state.transactionsTableData}
            topTradersTableData={this.state.topTradersTableData}
            holdersTableData={this.state.holdersTableData}
            liquidityProvidersTableData={this.state.liquidityProvidersTableData}
          />
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
            <DexScreenerContent
              transactionsTableData={this.state.transactionsTableData}
              topTradersTableData={this.state.topTradersTableData}
              holdersTableData={this.state.holdersTableData}
              liquidityProvidersTableData={
                this.state.liquidityProvidersTableData
              }
            />
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
