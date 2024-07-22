import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  DexScreenerSearchTrendingIcon,
  DexScreenrRecentlyUpdatenTokenIcon,
} from "../../../assets/images/icons";
import DexScreenerSearchSuggestionBlock from "./DexScreenerSearchSuggestionBlock";
class DexScreenerSearchSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSearchType: 1,
      selectedSearchTokens: [
        [
          {
            name: "HOUSE OF TRUMP",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF BIDEN",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF OBAMA",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF TRUMP",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF BIDEN",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF OBAMA",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF TRUMP",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF BIDEN",
            percentage: "83%",
            imageIcon: "",
          },
        ],
        [
          {
            name: "HOUSE OF HOMELANDER",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF ATRAIN",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF DEEP",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF HOMELANDER",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF ATRAIN",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF DEEP",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF HOMELANDER",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF ATRAIN",
            percentage: "83%",
            imageIcon: "",
          },
        ],
        [
          {
            name: "HOUSE OF GOKU",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF VEGETA",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF PICCOLO",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF GOKU",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF VEGETA",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF PICCOLO",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF GOKU",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF VEGETA",
            percentage: "83%",
            imageIcon: "",
          },
        ],
        [
          {
            name: "HOUSE OF clark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF bruce",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF barry",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF clark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF bruce",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF barry",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF clark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF bruce",
            percentage: "83%",
            imageIcon: "",
          },
        ],
        [
          {
            name: "HOUSE OF stark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF lannister",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF Targaryen",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF stark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF lannister",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF Targaryen",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF stark",
            percentage: "83%",
            imageIcon: "",
          },
          {
            name: "HOUSE OF lannister",
            percentage: "83%",
            imageIcon: "",
          },
        ],
      ],

      recentlyUpdatedTokens: [
        {
          name: "Trumpio",
          platform: "SOLANA",
          platformIcon: "https://cryptologos.cc/logos/solana-sol-logo.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "PengWu",
          platform: "ethereum",
          platformIcon:
            "https://cdn.iconscout.com/icon/free/png-256/free-ethereum-1824287-1545899.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "https://t.me/loch_chain",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "Totally Rdic",
          platform: "polygon",
          platformIcon: "",
          twitterLink: "",
          telegramLink: "https://t.me/loch_chain",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "Trumpio",
          platform: "SOLANA",
          platformIcon: "https://cryptologos.cc/logos/solana-sol-logo.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "PengWu",
          platform: "ethereum",
          platformIcon:
            "https://cdn.iconscout.com/icon/free/png-256/free-ethereum-1824287-1545899.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "https://t.me/loch_chain",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "Totally Rdic",
          platform: "polygon",
          platformIcon: "",
          twitterLink: "",
          telegramLink: "https://t.me/loch_chain",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "Trumpio",
          platform: "SOLANA",
          platformIcon: "https://cryptologos.cc/logos/solana-sol-logo.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
        {
          name: "PengWu",
          platform: "ethereum",
          platformIcon:
            "https://cdn.iconscout.com/icon/free/png-256/free-ethereum-1824287-1545899.png",
          twitterLink: "https://x.com/loch_chain",
          telegramLink: "https://t.me/loch_chain",
          websiteLink: "https://www.loch.one/",
          imageIcon: "",
        },
      ],
    };
  }
  selectSearchOne = () => {
    this.setState({ selectedSearchType: 1 });
  };
  selectSearchTwo = () => {
    this.setState({ selectedSearchType: 2 });
  };
  selectSearchThree = () => {
    this.setState({ selectedSearchType: 3 });
  };
  selectSearchFour = () => {
    this.setState({ selectedSearchType: 4 });
  };
  selectSearchFive = () => {
    this.setState({ selectedSearchType: 5 });
  };
  render() {
    return (
      <div
        onClick={this.props.showDexScreenerSearchSuggestions}
        className="topBarHistory"
      >
        <div className="dexScreenerSearchPopup">
          <div className="ds-sp-toggle-container">
            <div
              onClick={this.selectSearchOne}
              className={`ds-sp-toggle ${
                this.state.selectedSearchType === 1
                  ? "ds-sp-toggle-selected"
                  : ""
              } ds-sp-toggle-no-left-border`}
            >
              <div className="ds-sp-toggle-item">
                <Image
                  className="ds-sp-toggle-icon"
                  src={DexScreenerSearchTrendingIcon}
                />
                <div className="ds-sp-toggle-text">Trending</div>
              </div>
            </div>
            <div
              onClick={this.selectSearchTwo}
              className={`ds-sp-toggle  ${
                this.state.selectedSearchType === 2
                  ? "ds-sp-toggle-selected"
                  : ""
              }`}
            >
              <div className="ds-sp-toggle-item">
                <div className="ds-sp-toggle-text">Top</div>
              </div>
            </div>
            <div
              onClick={this.selectSearchThree}
              className={`ds-sp-toggle  ${
                this.state.selectedSearchType === 3
                  ? "ds-sp-toggle-selected"
                  : ""
              }`}
            >
              <div className="ds-sp-toggle-item">
                <div className="ds-sp-toggle-text">Rising</div>
              </div>
            </div>
            <div
              onClick={this.selectSearchFour}
              className={`ds-sp-toggle  ${
                this.state.selectedSearchType === 4
                  ? "ds-sp-toggle-selected"
                  : ""
              }`}
            >
              <div className="ds-sp-toggle-item">
                <div className="ds-sp-toggle-text">New</div>
              </div>
            </div>
            <div
              onClick={this.selectSearchFive}
              className={`ds-sp-toggle  ${
                this.state.selectedSearchType === 5
                  ? "ds-sp-toggle-selected"
                  : ""
              } ds-sp-toggle-no-right-border`}
            >
              <div className="ds-sp-toggle-item">
                <div className="ds-sp-toggle-text">Finalized</div>
              </div>
            </div>
          </div>
          <div className="ds-sp-blocks-container">
            {this.state.selectedSearchTokens[
              this.state.selectedSearchType - 1
            ].map((curItem) => {
              return (
                <DexScreenerSearchSuggestionBlock
                  name={curItem.name}
                  percentage={curItem.percentage}
                  imageIcon={curItem.imageIcon}
                />
              );
            })}
          </div>
          <div className="ds-sp-blocks-title">
            <Image
              src={DexScreenrRecentlyUpdatenTokenIcon}
              className="ds-sp-blocks-title-image"
            />
            <div className="ds-sp-blocks-title-text">
              Recently Updated Token Info
            </div>
          </div>
          <div
            style={{
              marginTop: "2rem",
            }}
            className="ds-sp-blocks-container"
          >
            {this.state.recentlyUpdatedTokens.map((curItem) => {
              return (
                <DexScreenerSearchSuggestionBlock
                  recentlyUpdatedTokens
                  name={curItem.name}
                  platform={curItem.platform}
                  platformIcon={curItem.platformIcon}
                  twitterLink={curItem.twitterLink}
                  telegramLink={curItem.telegramLink}
                  websiteLink={curItem.websiteLink}
                />
              );
            })}
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
)(DexScreenerSearchSuggestion);
