import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  DexScreenerAlertModalPlusIcon,
  DexScreenerTelegramIcon,
  DexScreenerTwitterIcon,
  DexScreenerWebsiteIcon,
} from "../../../assets/images/icons";
class DexScreenerSearchSuggestionBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradientColor: this.newGradient(),
    };
  }
  newGradient() {
    var c1 = {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    };
    var c2 = {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    };
    c1.rgb = "rgb(" + c1.r + "," + c1.g + "," + c1.b + ")";
    c2.rgb = "rgb(" + c2.r + "," + c2.g + "," + c2.b + ")";
    return "radial-gradient(at top left, " + c1.rgb + ", " + c2.rgb + ")";
  }
  render() {
    if (this.props.alertBlock) {
      return (
        <div onClick={this.props.onClick} className="ds-sp-block">
          {this.props.imageIcon ? (
            <Image
              className={`ds-sp-block-image ${
                this.props.recentlyUpdatedTokens
                  ? "ds-sp-block-image-bigger"
                  : ""
              }`}
              src={this.props.imageIcon}
            />
          ) : (
            <div
              style={{
                background: this.state.gradientColor,
              }}
              className={`ds-sp-block-image ${
                this.props.recentlyUpdatedTokens
                  ? "ds-sp-block-image-bigger"
                  : ""
              } ds-sp-block-gradient`}
            />
          )}
          <div className="ds-sp-block-info">
            <div className="ds-sp-block-info-name">{this.props.name}</div>
            <div className="ds-sp-block-info-platform-fat">
              {this.props.platform}
            </div>
          </div>
          <div className="ds-sp-alert-add">
            <Image src={DexScreenerAlertModalPlusIcon} />
            <div>Add</div>
          </div>
        </div>
      );
    }
    return (
      <div onClick={this.props.onClick} className="ds-sp-block">
        {this.props.imageIcon ? (
          <Image
            className={`ds-sp-block-image ${
              this.props.recentlyUpdatedTokens ? "ds-sp-block-image-bigger" : ""
            }`}
            src={this.props.imageIcon}
          />
        ) : (
          <div
            style={{
              background: this.state.gradientColor,
            }}
            className={`ds-sp-block-image ${
              this.props.recentlyUpdatedTokens ? "ds-sp-block-image-bigger" : ""
            } ds-sp-block-gradient`}
          />
        )}
        <div className="ds-sp-block-info">
          <div className="ds-sp-block-info-name">{this.props.name}</div>
          {this.props.recentlyUpdatedTokens ? (
            <>
              <div className="ds-sp-block-info-platform">
                {this.props.platformIcon ? (
                  <Image
                    className="ds-sp-block-info-platform-icon"
                    src={this.props.platformIcon}
                  />
                ) : (
                  <div className="ds-sp-block-info-platform-icon-container"></div>
                )}
                <div className="ds-sp-block-info-platform-text">
                  {this.props.platform}
                </div>
              </div>
              <div className="ds-sp-block-info-socials">
                {this.props.twitterLink ? (
                  <a href={this.props.twitterLink}>
                    <Image
                      className="ds-sp-block-info-social-icon"
                      src={DexScreenerTwitterIcon}
                    />
                  </a>
                ) : null}
                {this.props.telegramLink ? (
                  <a href={this.props.telegramLink}>
                    <Image
                      className="ds-sp-block-info-social-icon"
                      src={DexScreenerTelegramIcon}
                    />
                  </a>
                ) : null}
                {this.props.websiteLink ? (
                  <a href={this.props.websiteLink}>
                    <Image
                      className="ds-sp-block-info-social-icon"
                      src={DexScreenerWebsiteIcon}
                    />
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <div className="ds-sp-block-info-percentage">
              {this.props.percentage}
            </div>
          )}
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
)(DexScreenerSearchSuggestionBlock);
