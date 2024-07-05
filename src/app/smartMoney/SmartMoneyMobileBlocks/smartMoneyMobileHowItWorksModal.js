import React from "react";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";
import { BaseReactComponent } from "../../../utils/form/index.js";
import backIcon from "../../../assets/images/icons/Icon-back.svg";
import { SmartMoneyAboutMobileImage } from "../../../assets/images/index.js";
import { CrossSmartMoneyIcon } from "../../../assets/images/icons/index.js";

class SmartMoneyMobileHowItWorksModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      backIconLoaded: false,
      CrossSmartMoneyIconLoaded: false,
      SmartMoneyAboutMobileImageLoaded: false,
    };
  }
  render() {
    return (
      <div className="msmpModalBody">
        <div className="msmpModalClosebtnContainer">
          <div
            className="back-icon"
            onClick={this.state.isSignUpPage ? this.showSignInPage : () => null}
            style={{
              opacity: this.state.isSignUpPage ? 1 : 0,
            }}
          >
            <Image
              className="cp"
              src={backIcon}
              onLoad={() => {
                this.setState({
                  backIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.backIconLoaded ? 1 : 0,
              }}
            />
          </div>
          <div className="msmpModalClosebtn" onClick={this.props.onHide}>
            <Image
              src={CrossSmartMoneyIcon}
              onLoad={() => {
                this.setState({
                  CrossSmartMoneyIconLoaded: true,
                });
              }}
              style={{
                opacity: this.state.CrossSmartMoneyIconLoaded ? 1 : 0,
              }}
            />
          </div>
        </div>
        <Image className="msmpModalHowItWorks" />
        <div
          style={{
            marginTop: "22rem",
          }}
          className="msmpModalTexts msmpModalAboutHeading"
        >
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-4">
            About Loch Leaderboard
          </h6>
          <p className="inter-display-medium f-s-14 lh-19 m-b-24 text-center  grey-7C7">
            The intelligent way to manage a portfolio
          </p>
        </div>
        <div className="msmpModalAboutContentContainer">
          <div className="msmpModalAboutContentBlock">
            <div className="msmpModalAboutContentBlockChild">
              <div
                style={{
                  marginTop: "0rem",
                }}
                className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15"
              >
                You see a token 2x in price.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                You see another token plummet by 4x overnight.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                You think to yourself, how is this possible?
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                Most adjacent tokens are flat.
              </div>

              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                <span>The answer is always simple -- </span>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Follow the leaderboard.
                </span>
              </div>

              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                Loch’s team of sleuth’s and researchers have assiduously put
                together this list of the smartest money on-chain.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                This is the lazy analyst’s ultimate guide to alpha.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                The list is updated daily. We know it’s not enough to just look
                at net worth. That’s why Loch gives you the realized and
                unrealized PnL for each address.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                You can click, analyze, and follow any or all of these
                addresses.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                The best part of using this leaderboard is that you’ll get the
                confidence backed by your own increasingly successful results.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                You’ll become more proficient in the most valuable skill in
                crypto, which is finding and analyzing leaderboard.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                Loch’s team has benefited immensely from this leaderboard.
              </div>
              <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
                It’s your turn now.
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

SmartMoneyMobileHowItWorksModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyMobileHowItWorksModal);
