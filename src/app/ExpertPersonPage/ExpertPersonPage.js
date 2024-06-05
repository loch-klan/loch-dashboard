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
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import ExpertPersonPageMobile from "./ExpertPersonPageMobile";
import "./_expertPersonPage.scss";

class ExpertPersonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      expertsList: [
        {
          address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
          name_tag: "@smartestmoney_",
          user_image: "https://picsum.photos/200",
          net_worth: 36567693.050387464,
        },
        {
          address: "0xE806f01f1aB602C26Cc28e75164893359C04b38A",
          name_tag: "IMX pre-pump buyer",
          user_image: "https://picsum.photos/200",
          net_worth: 35587976.2084,
        },
        {
          address: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
          name_tag: "",
          user_image: "https://picsum.photos/200",
          net_worth: 32134545.409,
        },
        {
          address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
          name_tag: "@Titanium_32",
          user_image: "https://picsum.photos/200",
          net_worth: 30361002.434807304,
        },
        {
          address: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8",
          name_tag: "@winharper",
          user_image: "https://picsum.photos/200",
          net_worth: 19306221.746918082,
        },
        {
          address: "0x4EE79E19c9c398e364d135F01B25DcCC0473047c",
          name_tag: "@0xvladilena",
          user_image: "https://picsum.photos/200",
          net_worth: 18728616.905514523,
        },
        {
          address: "0x3e8734Ec146C981E3eD1f6b582D447DDE701d90c",
          name_tag: "DefiWhaleX",
          user_image: "https://picsum.photos/200",
          net_worth: 18628625.645256102,
        },
        {
          address: "0xB7FA2214c79cAbC24CB270F57D52B83A2a7fEdd8",
          name_tag: "@PseudonCrypto",
          user_image: "https://picsum.photos/200",
          net_worth: 8781693.634935401,
        },
        {
          address: "0x5DD596C901987A2b28C38A9C1DfBf86fFFc15d77",
          name_tag: "@0xsifu",
          user_image: "https://picsum.photos/200",
          net_worth: 6890642.785220452,
        },
        {
          address: "0x5c9E30def85334e587Cf36EB07bdd6A72Bf1452d",
          name_tag: "tardfiwhale",
          user_image: "https://picsum.photos/200",
          net_worth: 4506369.606655381,
        },
      ],
    };
  }

  onHide = () => {
    this.props.getUser();
    this.props.history.push("/home");
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  goToScheduleACall = () => {
    this.props.history.push("/expert-schedule-call/1");
  };

  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          handleShare={() => null}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          currentPage={"stripe-success-page"}
          hideFooter
          hideAddresses
        >
          <ExpertPersonPageMobile onHide={this.onHide} />
        </MobileLayout>
      );
    }
    return (
      <div className="insightsPageContainer">
        {/* topbar */}
        <div className="portfolio-page-section ">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                history={this.props.history}
              />
            </div>
          </div>
          <div className="expert-person-page inter-display-medium">
            <div className="expert-person-page-block-top-gradient" />
            <div className="ep-expert-info">
              <div className="ep-ei-data">
                <Image
                  className="ep-ei-data-image"
                  src={this.state.expertsList[0].user_image}
                />
                <div className="ep-ei-data-details">
                  <div className="ep-ei-dd-nametag">
                    {this.state.expertsList[0].name_tag}
                  </div>
                  <div className="ep-ei-dd-acccount-amount">
                    <div className="ep-ei-dd-amount">
                      {CurrencyType(false) +
                        numToCurrency(this.state.expertsList[0].net_worth)}
                    </div>
                    <div className="ep-ei-dd-acccount">
                      {TruncateText(this.state.expertsList[0].address)}
                    </div>
                  </div>
                  <div className="ep-ei-dd-desc">
                    #1 CoinM PnL & Story Teller on @binance leaderboard. 9 figs
                    challenge with receipts
                  </div>
                </div>
              </div>
              <button onClick={this.goToScheduleACall} className="ep-ei-btn">
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
                {this.state.expertsList.map((expert, index) => {
                  return (
                    <div className="ep-te-expert-block hide-scrollbar">
                      <div className="ep-te-expert-block-data">
                        <Image
                          className="ep-te-b-image"
                          src={expert.user_image}
                        />
                        <div className="ep-te-b-address">
                          {TruncateText(expert.address)}
                        </div>
                        <div className="ep-te-b-networth">
                          {CurrencyType(false) +
                            numToCurrency(expert.net_worth)}
                        </div>
                        <div className="ep-te-b-nametag">{expert.name_tag}</div>
                      </div>
                      <button className="ep-te-b-consultbtn">
                        Consult now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertPersonPage);
