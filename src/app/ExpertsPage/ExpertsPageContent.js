import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  ExpertsGlobeImage,
  ExpertsPageHeadphoneImage,
} from "../../assets/images";
import {
  BackArrowSmartMoneyIcon,
  ExpertsHeadphonesBlockIcon,
  GlobeShareBlockIcon,
} from "../../assets/images/icons";
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import "./_expertsPage.scss";

class ExpertsPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="experts-page inter-display-medium">
        <div className="ep-heading">
          <div className="ep-heading-text">
            <div className="ep-heading-title">
              {this.props.isMobile ? (
                <span>Decentralized Onchain Expert Network</span>
              ) : (
                <span>
                  Decentralized
                  <br />
                  Onchain Expert Network
                </span>
              )}
            </div>
            <div className="ep-heading-subtitle">
              Connect, talk, and grow together
            </div>
          </div>
          <Image src={ExpertsGlobeImage} className="ep-heading-image" />
        </div>

        <div className="ep-top-experts">
          <div className="ep-top-experts-heading">
            <Image src={GlobeShareBlockIcon} className="ep-te-image" />
            <div className="ep-te-text">Top Experts</div>
          </div>
          <div className={this.props.isMobile ? "" : "ep-te-scroll-container"}>
            <div
              id="topExpertsScrollBody"
              className="ep-te-scroll hide-scrollbar"
              onScroll={this.props.handleTopExpertsScroll}
            >
              {this.props.isMobile ? null : (
                <>
                  {this.props.disableLeftArrow ? null : (
                    <div
                      onClick={this.props.scrollLeft}
                      className="ep-te-scroll-btn ep-te-scroll-btn-left"
                    >
                      <Image
                        className="ep-te-scroll-btn-image"
                        src={BackArrowSmartMoneyIcon}
                      />
                    </div>
                  )}
                  {this.props.disableRightArrow ? null : (
                    <div
                      onClick={this.props.scrollRight}
                      className="ep-te-scroll-btn"
                    >
                      <Image
                        className="ep-te-scroll-btn-image"
                        src={BackArrowSmartMoneyIcon}
                      />
                    </div>
                  )}
                </>
              )}
              {this.props.expertsList.map((expert, index) => {
                return (
                  <div className="ep-te-expert-block">
                    <div className="ep-te-expert-block-data">
                      <Image
                        className="ep-te-b-image"
                        src={expert.user_image}
                      />
                      <div className="ep-te-b-address">
                        {TruncateText(expert.address)}
                      </div>
                      <div className="ep-te-b-networth">
                        {CurrencyType(false) + numToCurrency(expert.net_worth)}
                      </div>
                      <div className="ep-te-b-nametag">{expert.name_tag}</div>
                    </div>
                    <button
                      onClick={() => {
                        this.props.history.push(`/expert/${index + 1}`);
                      }}
                      className="ep-te-b-consultbtn"
                    >
                      Consult now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="ep-te-be-expert">
          <div className="ep-te-be-expert-images">
            <Image
              className="ep-te-be-expert-image1"
              src={ExpertsHeadphonesBlockIcon}
            />
            <Image
              className="ep-te-be-expert-image2"
              src={ExpertsPageHeadphoneImage}
            />
            <Image
              className="ep-te-be-expert-image1 ep-te-be-expert-image3"
              src={ExpertsHeadphonesBlockIcon}
            />
          </div>
          <div className="ep-te-be-expert-items">
            <div className="ep-te-be-expert-header">
              Be an expert,
              <br />
              earn with Loch
            </div>
            <div className="ep-te-be-expert-desc">Start earning with Loch</div>
            <div
              onClick={this.props.becomeAnExpert}
              className="ep-te-be-expert-button"
            >
              Become an Expert
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsPageContent);
