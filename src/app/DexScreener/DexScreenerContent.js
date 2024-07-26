import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  DexScreenerDoubleArrowIcon,
  DexScreenerHeaderPlusIcon,
  DexScreenerHeaderSearchIcon,
  DexScreenerTelegramIcon,
  DexScreenerTwitterIcon,
  DexScreenerWebsiteIcon,
} from "../../assets/images/icons";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import MobileLayout from "../layout/MobileLayout";
import DexScreenerChart from "./DexScreenerChart";
import DexScreenerFourTables from "./DexScreenerFourTables";
import "./_dexScreener.scss";

class DexScreenerContent extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobileDevice: mobileCheck(),
    };
  }

  render() {
    return (
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
              transactionsTableData={this.props.transactionsTableData}
              topTradersTableData={this.props.topTradersTableData}
              holdersTableData={this.props.holdersTableData}
              liquidityProvidersTableData={
                this.props.liquidityProvidersTableData
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
                    <div className="dex-screener-dp-bel-subtext">TXNS</div>
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
                    <div className="dex-screener-dp-bel-subtext">VOLUME</div>
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
                    <div className="dex-screener-dp-bel-subtext">MAKERS</div>
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
                <div className="dex-screener-right-data-rows-title">Pair</div>
                <div className="dex-screener-right-data-rows-dta-container">
                  <div className="dex-screener-right-data-rows-btn">
                    UMVxG...xAUe
                  </div>
                  <div className="dex-screener-right-data-rows-title">EXP</div>
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
                  <div className="dex-screener-right-data-rows-title">EXP</div>
                </div>
              </div>
              <div className="dex-screener-right-data-rows">
                <div className="dex-screener-right-data-rows-title">SOL</div>
                <div className="dex-screener-right-data-rows-dta-container">
                  <div className="dex-screener-right-data-rows-btn">
                    So111...1112
                  </div>
                  <div className="dex-screener-right-data-rows-title">EXP</div>
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
                <div className="dex-screener-right-convertor-right">Scooby</div>
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
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

DexScreenerContent.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(DexScreenerContent);
