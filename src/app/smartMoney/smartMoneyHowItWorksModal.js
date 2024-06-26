import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { SmartMoneyAboutImage } from "../../assets/images";
import {
  BackArrowSmartMoneyIcon,
  CrossSmartMoneyIcon,
} from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";

class SmartMoneyHowItWorksModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: props.onHide,
    };
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          {this.state.selectedQuestion > -1 &&
          this.state.selectedQuestion < this.state.questionAnswers.length ? (
            <div onClick={this.goToQuestions} className="backiconmodal">
              <Image src={BackArrowSmartMoneyIcon} />
            </div>
          ) : null}

          <div
            style={{
              zIndex: 1,
            }}
            className="closebtn"
            onClick={this.state.onHide}
          >
            <Image src={CrossSmartMoneyIcon} />
          </div>
          <Image className="howItWorksModalImageOverlay" />
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              marginTop: "13rem",
              padding: "0rem 4rem",
              paddingBottom: "4rem",
            }}
            className="addCommunitySmartMoneyWrapperParent"
          >
            <div className="exit-overlay-body" style={{ padding: "0rem" }}>
              <h6 className="inter-display-medium f-s-25 w-100 text-left">
                About Loch Leaderboard
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 w-100 text-left">
                The intelligent way to manage a portfolio
              </p>
            </div>
            <div className="smartMoneyHowItWorksModalBodyScrollContainer">
              <div className="smartMoneyHowItWorksModalBodyContainer">
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
                  The answer is always simple --{" "}
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
                  The list is updated daily. We know it’s not enough to just
                  look at net worth. That’s why Loch gives you the realized and
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
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

SmartMoneyHowItWorksModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyHowItWorksModal);
