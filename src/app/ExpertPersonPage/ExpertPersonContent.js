import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  AboutExpertCoinsIcon,
  AboutExpertLochIcon,
  AboutExpertPhoneIcon,
  AboutExpertStockArrowIcon,
  AboutExpertThumbIcon,
} from "../../assets/images/icons";
import {
  CurrencyType,
  TruncateText,
  mobileCheck,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import "./_expertPersonPage.scss";
import TopWalletAddressList from "../header/TopWalletAddressList";

class ExpertPersonContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="expert-person-page inter-display-medium">
        <div className="expert-person-page-block-top-gradient" />
        <div
          className={`go-back-btn-container-page ${
            this.state.isMobile ? "go-back-btn-container-page-mobile" : ""
          }`}
        >
          <TopWalletAddressList
            history={this.props.history}
            showBackBtn
            apiResponse={(e) => () => {}}
            showpath
            currentPage={"schedule-a-call"}
            hideShare
            noHomeInPath
          />
        </div>
        <div className="ep-expert-info">
          <div className="ep-ei-data">
            <Image
              className="ep-ei-data-image"
              src={this.props.expertsList[0].user_image}
            />
            <div className="ep-ei-data-details">
              <div className="ep-ei-dd-nametag">
                {this.props.expertsList[0].name_tag}
              </div>
              <div className="ep-ei-dd-acccount-amount">
                <div className="ep-ei-dd-amount">
                  {CurrencyType(false) +
                    numToCurrency(this.props.expertsList[0].net_worth)}
                </div>
                <div className="ep-ei-dd-acccount">
                  {TruncateText(this.props.expertsList[0].address)}
                </div>
              </div>
              <div className="ep-ei-dd-desc">
                #1 CoinM PnL & Story Teller on @binance leaderboard. 9 figs
                challenge with receipts
              </div>
              <div className="ep-expert-social">
                <div className="ep-expert-social-links">
                  {this.props.socialMediaLinks.map((socialMediaItem) => {
                    return (
                      <Image
                        src={socialMediaItem.icon}
                        className="ep-expert-social-links-item"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button onClick={this.props.goToScheduleACall} className="ep-ei-btn">
            Consult now
          </button>
        </div>

        <div className="ep-about-expert">
          <div className="ep-about-expert-heading">
            <div className="ep-aeh-title">About the expert</div>
            <div className="ep-aeh-time">Active 3 hours ago</div>
          </div>
          <div className="ep-about-expert-data">
            <div className="ep-about-expert-data-block">
              <Image
                className="ep-exdb-image"
                src={AboutExpertStockArrowIcon}
              />
              <div className="ep-exdb-title">Unrealized pnl</div>
              <div className="ep-exdb-desc">
                {CurrencyType(false) + numToCurrency(9350000)}
              </div>
            </div>
            <div className="ep-about-expert-data-block">
              <Image className="ep-exdb-image" src={AboutExpertCoinsIcon} />
              <div className="ep-exdb-title">Realized pnl</div>
              <div className="ep-exdb-desc">
                {CurrencyType(false) + numToCurrency(36570000)}
              </div>
            </div>
            <div className="ep-about-expert-data-block">
              <Image className="ep-exdb-image" src={AboutExpertPhoneIcon} />
              <div className="ep-exdb-title">Calls completed</div>
              <div className="ep-exdb-desc">34</div>
            </div>
            <div className="ep-about-expert-data-block">
              <Image className="ep-exdb-image" src={AboutExpertThumbIcon} />
              <div className="ep-exdb-title">Ratings</div>
              <div className="ep-exdb-desc">4.70</div>
            </div>
            <div className="ep-about-expert-data-block ep-about-expert-data-long-block">
              <Image className="ep-exdb-image" src={AboutExpertLochIcon} />
              <div className="ep-exdb-title">Earned through Loch</div>
              <div className="ep-exdb-desc">
                {CurrencyType(false) + numToCurrency(126000)}
              </div>
            </div>
          </div>
        </div>
        <div className="ep-top-experts">
          <div className="ep-top-experts-heading">
            <div className="ep-te-text">Experts like them</div>
          </div>
          <div className="ep-te-scroll">
            {this.props.expertsList.map((expert, index) => {
              return (
                <div className="ep-te-expert-block hide-scrollbar">
                  <div className="ep-te-expert-block-data">
                    <Image className="ep-te-b-image" src={expert.user_image} />
                    <div className="ep-te-b-address">
                      {TruncateText(expert.address)}
                    </div>
                    <div className="ep-te-b-networth">
                      {CurrencyType(false) + numToCurrency(expert.net_worth)}
                    </div>
                    <div className="ep-te-b-nametag">{expert.name_tag}</div>
                  </div>
                  <button className="ep-te-b-consultbtn">Consult now</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertPersonContent);
