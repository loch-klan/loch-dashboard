import React from "react";
import { connect } from "react-redux";
import { Modal, Image } from "react-bootstrap";
import {
  BackArrowSmartMoneyIcon,
  CrossSmartMoneyIcon,
  SmartMoneyFaqModalIcon,
} from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";

class SmartMoneyFaqModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: props.onHide,
      questionAnswers: [
        {
          ques: "How are addresses found?",
          ans: "Addresses are discovered through a combination of Loch’s in-house sleuths and Loch community members. We vet and screen all addresses added to the leaderboard personally.",
        },
        {
          ques: "How often are addresses added?",
          ans: "Smart money addresses are added every day.",
        },
        {
          ques: "What’s net worth?",
          ans: "Net worth refers to the sum total of all assets held by a wallet address. This does not include credit positions and debt positions held in on-chain decentralized finance platforms.",
        },
        {
          ques: "What’s Realized PnL?",
          ans: "Realized PnL refers to the difference between all funds that left the wallet address and all funds that entered the wallet address in the last year.",
        },
        {
          ques: "What’s Unrealized PnL?",
          ans: "Unrealized PnL is the sum of the (current net worth minus average cost price for each asset) held in the portfolio.",
        },
        {
          ques: "How often are PnL calculations updated?",
          ans: "PnL calculations are updated every week.",
        },
        {
          ques: "Should I be worried about my privacy?",
          ans: "No you should not be worried at all. All your information remains confidential and private. Customer data added on app.loch.one is not used to populate smart money. We don’t sell any user data to third parties.",
        },
        {
          ques: "How are smart money addresses ranked?",
          ans: "The community generated smart money leaderboard is ranked in descending order by net worth. Soon, you’ll be able to sort it by any of the other columns.",
        },
        {
          ques: "How long will it take for an address I added to get listed?",
          ans: "It can take up to a day for an address added by a community member to get listed. We vet and screen all addresses added to the leaderboard personally.",
        },
      ],
      selectedQuestion: -1,
    };
  }
  goToAns = (index) => {
    this.setState({
      selectedQuestion: index,
    });
  };
  goToQuestions = () => {
    this.setState({
      selectedQuestion: -1,
    });
  };
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
          {/* <Image
            className="back-icon cp"
            src={backIcon}
            onClick={() => {
              // if (this.props.ishome && !selection) {
              //   this.props.handleBackConnect(this.state.connectExchangesList);
              // } else {
              //   this.handleBack();
              // }
            }}
          /> */}
          {this.state.selectedQuestion > -1 &&
          this.state.selectedQuestion < this.state.questionAnswers.length ? (
            <div onClick={this.goToQuestions} className="backiconmodal">
              <Image src={BackArrowSmartMoneyIcon} />
            </div>
          ) : null}
          <div className="api-modal-header">
            <Image src={SmartMoneyFaqModalIcon} />
          </div>
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CrossSmartMoneyIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="addCommunitySmartMoneyWrapperParent">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium text-center f-s-25">FAQ</h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Frequently asked questions about the smart-money leaderboard
              </p>
            </div>
            <div className="smartMoneyFAQModalBodyContainer">
              <div className="smartMoneyFAQModalBody">
                {this.state.selectedQuestion > -1 &&
                this.state.selectedQuestion <
                  this.state.questionAnswers.length ? (
                  <div className="smartMoneyFAQModalAnswerContainer">
                    <div className="smartMoneyFAQModalAnswerBlock">
                      <div className="smartMoneyFAQModalAnswerBlockQues inter-display-medium f-s-16">
                        {
                          this.state.questionAnswers[
                            this.state.selectedQuestion
                          ].ques
                        }
                      </div>
                      <div className="smartMoneyFAQModalAnswerBlockAns inter-display-medium f-s-15">
                        {
                          this.state.questionAnswers[
                            this.state.selectedQuestion
                          ].ans
                        }
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.state.questionAnswers.map((blockItem, blockIndex) => {
                  return (
                    <div
                      onClick={() => {
                        this.goToAns(blockIndex);
                      }}
                      className="smartMoneyFAQModalBlocks inter-display-medium f-s-14"
                    >
                      {blockItem.ques}
                    </div>
                  );
                })}
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

SmartMoneyFaqModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(SmartMoneyFaqModal);
