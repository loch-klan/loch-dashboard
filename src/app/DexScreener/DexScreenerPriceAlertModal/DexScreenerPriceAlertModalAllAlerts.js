import React from "react";
import { connect } from "react-redux";
import BaseReactComponent from "../../../utils/form/BaseReactComponent.js";
import { Image } from "react-bootstrap";
import {
  DexScreenerAlertCrossIcon,
  DexScreenerAlertPencilIcon,
  DexScreenerAlertRoundArrowIcon,
  DexScreenerManagePriceAlertBoxIcon,
} from "../../../assets/images/icons/index.js";
import { CustomDropdownPrice } from "../../../utils/form/index.js";

class DexScreenerPriceAlertModalAllAlerts extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      curToggle: 1,
      alertTypeToggle: 2,
      optionsList: [
        {
          asset: {
            name: "Price in USD",
          },
        },
        {
          asset: {
            name: "Price in INR",
          },
        },
        {
          asset: {
            name: "Price in EUR",
          },
        },
        {
          asset: {
            name: "Price in GBP",
          },
        },
        {
          asset: {
            name: "Price in USD",
          },
        },
      ],
    };
  }

  goToStepOne = () => {
    this.setState({ curToggle: 1 });
  };
  goToStepTwo = () => {
    this.setState({ curToggle: 2 });
  };

  goToToggleOne = () => {
    this.setState({ alertTypeToggle: 1 });
  };
  goToToggleTwo = () => {
    this.setState({ alertTypeToggle: 2 });
  };
  goToToggleThree = () => {
    this.setState({ alertTypeToggle: 3 });
  };

  render() {
    return (
      <div>
        <div className="price-alerts-new-old-toggle">
          <div
            onClick={this.goToStepOne}
            className={`ps-not-block ${
              this.state.curToggle === 1 ? "ps-not-block-selected" : ""
            }`}
          >
            Set new alert
          </div>
          <div
            onClick={this.goToStepTwo}
            className={`ps-not-block ${
              this.state.curToggle === 2 ? "ps-not-block-selected" : ""
            }`}
          >
            Existing Alerts
          </div>
        </div>
        {this.state.curToggle === 1 ? (
          <div className="ps-not-new-alert-container">
            <div className="ps-not-new-alert">
              <div className="ps-not-new-alert-block ps-not-new-alert-left">
                <div className="ps-not-nab-title">Alert me when</div>
                <div className="ps-not-nab-dropdown">
                  <CustomDropdownPrice
                    filtername="All chains selected"
                    options={this.state.optionsList}
                    action={null}
                    isChain={true}
                    selectedTokenName={"Price in USD"}
                    selectedTokens={[]}
                    singleSelect
                  />
                </div>

                <div className="ps-not-nab-toggles">
                  <div
                    className={`ps-not-nab-toggle-block ${
                      this.state.alertTypeToggle === 1
                        ? "ps-not-nab-toggle-block-selected"
                        : ""
                    } `}
                    onClick={this.goToToggleOne}
                  >
                    Goes under
                  </div>
                  <div
                    className={`ps-not-nab-toggle-block ${
                      this.state.alertTypeToggle === 2
                        ? "ps-not-nab-toggle-block-selected"
                        : ""
                    } `}
                    onClick={this.goToToggleTwo}
                  >
                    Goes over
                  </div>
                  <div
                    className={`ps-not-nab-toggle-block ${
                      this.state.alertTypeToggle === 3
                        ? "ps-not-nab-toggle-block-selected"
                        : ""
                    } `}
                    onClick={this.goToToggleThree}
                  >
                    Is equal to
                  </div>
                </div>
                <div className="ps-not-nab-input-container">
                  <input placeholder="$0.002592" className="ps-not-nab-input" />
                </div>
              </div>
              <div className="ps-not-new-alert-block ps-not-new-alert-right">
                <div className="ps-not-nab-title">Additional notes</div>
                <div className="ps-not-nab-input-container ps-not-nab-text-area-container">
                  <textarea
                    placeholder="Enter any additional notes here"
                    className="ps-not-nab-input"
                  />
                </div>
              </div>
            </div>
            <div className="ps-not-new-alert-btn-container">
              <div className="ps-not-new-alert-btn ps-not-new-alert-btn-cancel">
                Cancel
              </div>
              <div className="ps-not-new-alert-btn ps-not-new-alert-btn-create-alert">
                Create alert
              </div>
            </div>
          </div>
        ) : this.state.curToggle === 2 ? (
          <div className="ps-not-existing-tab">
            {this.props.curAlerts && this.props.curAlerts.length > 0 ? (
              <div className="ps-not-et-block-conatainer">
                {this.props.curAlerts.map((alertItem, index) => (
                  <div key={index} className="ps-not-et-block">
                    <div className="ps-not-et-block-data">
                      <div className="ps-not-et-bd-price">
                        <div className="ps-not-et-bd-price-detail">
                          When the price{" "}
                          <span className="ps-not-et-bd-price-detail-type">
                            {alertItem.alertType}
                          </span>
                        </div>
                        <div className="ps-not-et-bd-price-amount">
                          {alertItem.amount}
                        </div>
                      </div>
                      <div className="ps-not-et-bd-active-disable">
                        <div
                          className={`ps-not-et-bd-block ps-not-et-bd-block-left ${
                            alertItem.isActive
                              ? "ps-not-et-bd-block-active"
                              : ""
                          }`}
                        >
                          {alertItem.isActive ? (
                            <div className="ps-not-et-bd-circle ps-not-et-bd-circle-green" />
                          ) : null}
                          <div className="ps-not-et-bd-text">Active</div>
                        </div>
                        <div
                          className={`ps-not-et-bd-block ps-not-et-bd-block-right ${
                            !alertItem.isActive
                              ? "ps-not-et-bd-block-disabled"
                              : ""
                          }`}
                        >
                          {!alertItem.isActive ? (
                            <div className="ps-not-et-bd-circle ps-not-et-bd-circle-red" />
                          ) : null}
                          <div className="ps-not-et-bd-text">Disable</div>
                        </div>
                      </div>
                    </div>
                    <div className="ps-not-et-block-footer">
                      <Image
                        className="ps-not-et-block-footer-icon"
                        src={DexScreenerAlertRoundArrowIcon}
                      />
                      <Image
                        className="ps-not-et-block-footer-icon"
                        src={DexScreenerAlertPencilIcon}
                      />
                      <Image
                        className="ps-not-et-block-footer-icon"
                        src={DexScreenerAlertCrossIcon}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ps-not-et-blank">
                <Image
                  className="ps-not-et-blank-image"
                  src={DexScreenerManagePriceAlertBoxIcon}
                />
                <div className="ps-not-et-blank-text">
                  <div>You don’t have any alerts set up yet, create one</div>
                  <div>
                    easily by clicking{" "}
                    <span
                      onClick={this.goToStepOne}
                      className="ps-not-et-blank-text-here"
                    >
                      here
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

DexScreenerPriceAlertModalAllAlerts.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerPriceAlertModalAllAlerts);
