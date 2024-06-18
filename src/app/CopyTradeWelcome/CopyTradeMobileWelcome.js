import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  GreekOne,
  GreekThree,
  GreekTwo,
  LochBigLogoCopyTradeWelcome,
  WhaleTail,
} from "../../assets/images/index.js";
import { openLoginPopUp } from "../../utils/ReusableFunctions.js";
import "./_copyTradeWelcome.scss";

class CopyTradeMobileWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="copy-trade-welcome-page-container copy-trade-welcome-page-mobile-container">
        <div className="inter-display-medium copy-trade-welcome-page">
          <div className="ctwp-block ctwp-block-one">
            <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient1" />
            <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient2" />
            <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient3" />
            <div className="ctwpbo-left">
              <div className="ctwpbol-header">
                Enabling
                <br />
                Onchain Imitation
              </div>
              <div className="ctwpbol-desc">Welcome to Loch</div>
              <div
                onClick={this.props.openLoginPopUpPass}
                className="copy-trade-welcome-button"
              >
                Get started
              </div>
            </div>
            <div className="ctwpbo-right">
              <Image className="ctwpbor-greek-man" src={GreekOne} />
            </div>
          </div>
          <div className="ctwp-block ctwp-block-two">
            <div className="ctwpbtwo-left">
              <Image className="ctwpbtwor-greek-man" src={GreekTwo} />
              <div className="ctwpbtwor-greek-man-shadow-container">
                <div className="ctwpbtwor-greek-man-shadow-gradient" />
                <Image
                  className="ctwpbtwor-greek-man ctwpbtwor-greek-man-shadow"
                  src={GreekTwo}
                />
              </div>
            </div>
            <div className="ctwpbtwo-right">
              <div className="ctwpbtwor-desc">VERSATILITY</div>
              <div className="ctwpbtwor-title">
                Follow, copy-trade, or
                <br />
                consult anyone on the
                <br />
                blockchain in seconds
              </div>
            </div>
          </div>
          <div className="ctwp-block ctwp-block-one ctwp-block-three">
            <div className="ctwpbo-left">
              <div className="ctwpbothird-desc">ON THE GO</div>
              <div className="ctwpbothird-header">
                Accomplish whale-like
                <br />
                returns without monitoring
                <br />
                your screen all day
              </div>
            </div>
            <div className="ctwpbo-right">
              <Image className="ctwpbor-whale-man" src={WhaleTail} />
            </div>
          </div>
          <div className="ctwp-block ctwp-block-four">
            <div className="ctwpbf-loch-container">
              <Image
                className="ctwpbf-loch"
                src={LochBigLogoCopyTradeWelcome}
              />
            </div>

            <div className="ctwpbf-content">
              <div className="ctwpbofour-header">
                Don’t be someone else’s exit liquidity
              </div>
              <div className="ctwpbofour-desc">
                Use Loch’s copy trader to enter and exit safety
              </div>
              <div
                onClick={this.props.openLoginPopUpPass}
                className="copy-trade-welcome-button"
              >
                Get started
              </div>
            </div>
          </div>
          <div className="ctwp-block ctwp-block-five">
            <div className="ctwpbofive-image">
              <Image className="ctwpbfive-loch" src={GreekThree} />
            </div>
            <div className="ctwpbofive-content-container">
              <div className="ctwpbofive-content">
                <div className="ctwpbofive-header">
                  “Man differs from animals in his greater aptitude
                  <br />
                  for imitation and mimesis”
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CopyTradeMobileWelcome);
