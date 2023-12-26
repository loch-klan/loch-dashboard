import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../../utils/form/index.js";
import backIcon from "../../../assets/images/icons/Icon-back.svg";
import { Image } from "react-bootstrap";
import {
  CrossSmartMoneyIcon,
  SmartMoneyFaqModalIcon,
} from "../../../assets/images/icons/index.js";

class smartMoneyMobileFAQModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      backIconLoaded: false,
      CrossSmartMoneyIconLoaded: false,
      SmartMoneyFaqModalIconLoaded: false,
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
      selectedQuestion: 0,
    };
  }
  goToAns = (index) => {
    this.setState({
      selectedQuestion: index,
    });
  };

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
        <div className="msmpModalMainIconWhiteContainer">
          <Image
            src={SmartMoneyFaqModalIcon}
            onLoad={() => {
              this.setState({
                SmartMoneyFaqModalIconLoaded: true,
              });
            }}
            style={{
              opacity: this.state.SmartMoneyFaqModalIconLoaded ? 1 : 0,
            }}
          />
        </div>
        <div className="msmpModalTexts">
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-4">FAQ</h6>
          <p className="inter-display-medium f-s-14 lh-19 m-b-24 text-center grey-7C7 p-r-30 p-l-30">
            Frequently asked questions about the leaderboard
          </p>
        </div>
        <div className="msmpFaqListContainer">
          {this.state.questionAnswers.map((quesAns, quesAnsIndex) => {
            if (quesAnsIndex === this.state.selectedQuestion) {
              return (
                <div
                  style={quesAnsIndex === 0 ? { marginTop: "0rem" } : {}}
                  className="inter-display-medium f-s-17 lh-24 m-b-4 msmpFaqSelectedListItem"
                >
                  <div>{quesAns.ques}</div>
                  <div className="inter-display-medium f-s-14 lh-19 grey-7C7 m-t-5">
                    {quesAns.ans}
                  </div>
                </div>
              );
            }
            return (
              <div
                style={quesAnsIndex === 0 ? { marginTop: "0rem" } : {}}
                className="inter-display-medium f-s-17 lh-24 m-b-4 msmpFaqListItem"
                onClick={() => {
                  this.goToAns(quesAnsIndex);
                }}
              >
                {quesAns.ques}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

smartMoneyMobileFAQModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(smartMoneyMobileFAQModal);
