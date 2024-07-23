import { Component } from "react";

import moment from "moment";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  AudioCallExpertsIcon,
  ChatExpertsIcon,
  ChatExpertsPurpleIcon,
  DownloadArrowBoxIcon,
  ExpertCallMuteMicIcon,
  ExpertCallPhoneIcon,
  SendChatMessageIcon,
  TransactionCardIcon,
  TransactionCardPurpleDarkModeIcon,
  TransactionCardPurpleIcon,
} from "../../assets/images/icons";
import { getUser } from "../common/Api";
import TopWalletAddressList from "../header/TopWalletAddressList";

class ExpertCallContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "transcript",
    };
  }
  goToChatTab = () => {
    this.setState({
      selectedTab: "chat",
    });
  };
  goToTranscriptTab = () => {
    this.setState({
      selectedTab: "transcript",
    });
  };

  render() {
    console.log("this.props.isPreviousCall ", this.props.isPreviousCall);
    return (
      <div className="exper-call-running-page">
        <div className="exper-call-finished-page-block-top-gradient" />
        <div
          style={{
            marginTop: "100px",
          }}
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
        {this.props.isPreviousCall ? (
          <div className="mobile-header-container">
            <h4>Call history</h4>
            <p>
              Browse all calls, including those made, scheduled, and cancelled
            </p>
          </div>
        ) : null}
        <div className="ecrp-expert-container">
          <div className="ecrp-bc-title">
            {this.props.isPreviousCall ? "You had call with" : "On call with"}
          </div>
          <div className="ecrp-bc-user">
            <Image
              src={this.props.allChats[0].image}
              className="ecrp-bc-u-dp"
            />
            <div className="ecrp-bc-u-name">@smartestmoney_</div>
          </div>
        </div>
        <div
          style={{
            height: this.props.isPreviousCall
              ? "calc(100vh - 9rem - 230px)"
              : "",
          }}
          className="ecrp-block-container"
        >
          <div className="ecrp-block ecrp-block-center ecrp-block-top-mobile">
            <div className="ecrp-bc-items">
              {this.props.isPreviousCall ? null : (
                <div className="ecrp-bc-audio-btns">
                  <div className="ecrp-bc-audio-mute-btn">
                    <Image
                      className="ecrp-bc-audio-mute-icon"
                      src={ExpertCallMuteMicIcon}
                    />
                  </div>
                  <div className="ecrp-bc-audio-call-cut-btn">
                    <Image
                      className="ecrp-bc-audio-phone-icon"
                      src={ExpertCallPhoneIcon}
                    />
                    <div className="ecrp-bc-audio-phone-text">Disconnect</div>
                  </div>
                </div>
              )}

              <div className="ecrp-bc-audio-call">
                <Image
                  src={AudioCallExpertsIcon}
                  className="ecrp-bc-audio-image"
                />
                <div className="ecrp-bc-audio-text">12:30</div>
              </div>
            </div>
          </div>
          <div className="ecrp-block-bottom-mobile-container">
            <div className="ecrp-block-bottom-mobile-header">
              <div
                onClick={this.goToTranscriptTab}
                className={`ecrp-bb-mh-toggle 
                ${
                  this.state.selectedTab === "transcript"
                    ? "ecrp-bb-mh-toggle-selected"
                    : ""
                }`}
              >
                <Image
                  src={
                    this.state.selectedTab === "transcript"
                      ? this.props.isDarkMode
                        ? TransactionCardPurpleDarkModeIcon
                        : TransactionCardPurpleIcon
                      : TransactionCardIcon
                  }
                  className="ecrp-b-lh-icon"
                />
                <div>Transcript</div>
              </div>
              <div
                onClick={this.goToChatTab}
                className={`ecrp-bb-mh-toggle 
                ${
                  this.state.selectedTab === "chat"
                    ? "ecrp-bb-mh-toggle-selected"
                    : ""
                }`}
              >
                <Image
                  src={
                    this.state.selectedTab === "chat"
                      ? ChatExpertsPurpleIcon
                      : ChatExpertsIcon
                  }
                  className="ecrp-b-rh-icon"
                />
                <div>Chat</div>
              </div>
            </div>
            <div className="ecrp-block-bottom-mobile">
              {this.state.selectedTab === "transcript" ? (
                <div className="ecrp-block ecrp-block-left">
                  <div className="ecrp-b-left-header">
                    <div className="ecrp-b-lh-icon-text ecrp-b-lh-icon-text-download">
                      <Image
                        src={DownloadArrowBoxIcon}
                        className="ecrp-b-lh-icon"
                      />
                      <div>Download Transcript</div>
                    </div>
                  </div>
                  <div className="ecrp-b-left-transcript">
                    {this.props.callTranscript.map((transcript, transIndex) => {
                      return (
                        <div
                          className={`ecrp-b-l-lt-block ${
                            transcript.user !== "You"
                              ? "ecrp-b-l-lt-block-purple"
                              : ""
                          }`}
                          style={{
                            marginTop: transIndex === 0 ? "0rem" : "",
                          }}
                        >
                          <div className="ecrp-b-l-lt-block-header">
                            <div className="ecrp-b-l-lt-bh-name">
                              {transcript.user}
                            </div>
                            <div className="ecrp-b-l-lt-bh-date">
                              {moment(transcript.time).format("hh:mm A")}
                            </div>
                          </div>
                          <div className="ecrp-b-l-lt-block-message">
                            {transcript.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="ecrp-block ecrp-block-right">
                  <div className="ecrp-b-right-transcript">
                    {this.props.allChats.map((transcript, transIndex) => {
                      return (
                        <div
                          className={`ecrp-b-r-rt-block ${
                            transcript.user !== "You"
                              ? "ecrp-b-r-rt-block-purple"
                              : ""
                          }`}
                          style={{
                            marginTop: transIndex === 0 ? "0rem" : "",
                          }}
                        >
                          <Image
                            src={transcript.image}
                            className="ecrp-b-r-rt-block-dp"
                          />
                          <div className="ecrp-b-r-rt-block-message">
                            {transcript.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {this.props.isPreviousCall ? null : (
                    <div className="ecrp-b-right-transcript-input-message">
                      <div className="ecrp-b-right-transcript-input">
                        <input
                          placeholder="Send a message here"
                          className="ecrp-b-right-transcript-input-box"
                        />
                        <Image
                          src={SendChatMessageIcon}
                          className="ecrp-b-right-transcript-input-icon"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertCallContent);
