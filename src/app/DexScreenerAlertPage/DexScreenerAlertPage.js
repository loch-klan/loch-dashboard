import React from "react";
import { connect } from "react-redux";
import { mobileCheck, scrollToTop } from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import PageHeader from "../common/PageHeader";
import MobileLayout from "../layout/MobileLayout";
import DexScreenerPriceAlertModal from "../DexScreener/DexScreenerPriceAlertModal/DexScreenerPriceAlertModal";
import DexScreenerAlertPageContent from "./DexScreenerAlertPageContent";
import "./_dexScreenerAlertPage.scss";
import DexScreenerAlertMobilePage from "./DexScreenerAlertMobilePage";

class DexScreenerAlertPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      curAlerts: [
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon:
        //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHLfKAkLm63UvPPgLt1-9FUrZYxL4nGbhhLw&s",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes under",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: null,
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "is equal to",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: null,
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "is equal to",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "is equal to",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: null,
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "is equal to",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "is equal to",
        //   amount: "$0.00592",
        //   isActive: true,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
        // {
        //   alertType: "goes over",
        //   amount: "$0.00592",
        //   isActive: false,
        //   dateTimeCreated: new Date(),
        //   dateTimeTriggred: new Date(),
        //   tokenName: "$LANDLORD",
        //   tokenIcon: "",
        //   tokenSymbol: "SOL",
        // },
      ],
    };
  }

  componentDidMount() {
    scrollToTop();
  }
  showPriceAlertModal = () => {
    this.setState({ isPriceAlertModal: true });
  };
  hidePriceAlertModal = () => {
    this.setState({ isPriceAlertModal: false });
  };
  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          currentPage={"dex-screener"}
          hideFooter
          history={this.props.history}
          hideAddresses
          hideShare
        >
          <DexScreenerAlertMobilePage
            showPriceAlertModal={this.showPriceAlertModal}
            curAlerts={this.state.curAlerts}
          />
        </MobileLayout>
      );
    }
    return (
      <div className="dex-screener-alert-page history-table-section">
        {this.state.isPriceAlertModal ? (
          <DexScreenerPriceAlertModal
            hideOnblur
            show
            onHide={this.hidePriceAlertModal}
            history={this.props.history}
            modalType={"price_alert"}
            hideSkip={true}
            hideExistingAlerts
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
                      title={"My Alerts"}
                      subTitleInTitle="View all the alerts you have set up here"
                      subTitle=""
                      currentPage={"dex-screener-alert"}
                      history={this.props.history}
                      ShareBtn={false}
                      updateTimer={this.updateTimer}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DexScreenerAlertPageContent
              showPriceAlertModal={this.showPriceAlertModal}
              curAlerts={this.state.curAlerts}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

DexScreenerAlertPage.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerAlertPage);
