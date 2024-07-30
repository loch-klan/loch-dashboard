import React from "react";
import { connect } from "react-redux";
import { mobileCheck, scrollToTop } from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import DexScreenerAlertBlock from "../DexScreener/DexScreenerAlertBlock/DexScreenerAlertBlock";
import { Image } from "react-bootstrap";
import {
  DexScreenerHeaderBellIcon,
  DexScreenerManagePriceAlertBoxIcon,
  DexScreenerOrderByIcon,
} from "../../assets/images/icons";

class DexScreenerAlertPageContent extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      selectedOrderOption: 1,
    };
  }

  goToOrderOptionOne = () => {
    if (this.state.selectedOrderOption === 1) return;
    this.setState({ selectedOrderOption: 1 });
  };
  goToOrderOptionTwo = () => {
    if (this.state.selectedOrderOption === 2) return;
    this.setState({ selectedOrderOption: 2 });
  };
  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="dex-screener-alert-page-content">
        <div className="dex-screener-alert-page-content-order-container">
          <div className="dex-screener-alert-page-content-order-container-child">
            <Image
              src={DexScreenerOrderByIcon}
              className="dex-screener-alert-page-co-image"
            />
            <div className="dex-screener-alert-page-co-title">Order by</div>
          </div>
          <div className="dex-screener-alert-page-content-order-container-child">
            <div
              className={`dex-screener-alert-page-co-btn ${
                this.state.selectedOrderOption === 1
                  ? "dex-screener-alert-page-co-btn-selected"
                  : ""
              }`}
              onClick={this.goToOrderOptionOne}
            >
              Recently created
            </div>
            <div
              className={`dex-screener-alert-page-co-btn ${
                this.state.selectedOrderOption === 2
                  ? "dex-screener-alert-page-co-btn-selected"
                  : ""
              }`}
              onClick={this.goToOrderOptionTwo}
            >
              Recently triggered
            </div>
          </div>
        </div>
        {this.props.curAlerts && this.props.curAlerts.length > 0 ? (
          <div className="dex-screener-alert-page-content-block-container">
            {this.props.curAlerts.map((alertItem, index) => (
              <DexScreenerAlertBlock
                isFullPage
                key={index}
                alertItem={alertItem}
              />
            ))}
          </div>
        ) : (
          <div className="dex-screener-alert-page-content-empty">
            <Image
              className="ps-not-et-blank-image"
              src={DexScreenerManagePriceAlertBoxIcon}
            />
            <div className="ps-not-et-blank-text">
              <div>You don’t have any alerts set up yet.</div>
              <div>Create one on the token page or search for one here</div>
            </div>
            <div onClick={this.props.showPriceAlertModal} className="ds-ph-btn">
              <Image
                src={DexScreenerHeaderBellIcon}
                className="ds-ph-btn-image"
              />
              <div className="ds-ph-btn-text">Set alerts</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

DexScreenerAlertPageContent.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerAlertPageContent);
