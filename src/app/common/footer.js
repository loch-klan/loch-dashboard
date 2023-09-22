import React, { Component } from "react";
import mediumIcon from "../../assets/images/icons/medium.png";
import TwitterIcon from "../../assets/images/icons/twitter.png";
import TelegramIcon from "../../assets/images/icons/telegram.png";
import moment from "moment";
import { Image } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <>
        <hr />
        <div
          className="m-t-30 m-b-28"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: "50%" }}>
            <p className="inter-display-medium f-s-15 lh-19 grey-ADA">
              Loch, Inc. © {moment().format("YYYY")}
            </p>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image
              src={mediumIcon}
              style={{
                width: "2.2rem",
                marginRight: "1rem",
              }}
              className="social-media-icon"
              onClick={() => {
                window.open(
                  "https://medium.com/loch-research",
                  "_blank",
                  "noreferrer"
                );
              }}
            />
            <Image
              src={TelegramIcon}
              style={{
                width: "2rem",
                marginRight: "1rem",
              }}
              className="social-media-icon"
              onClick={() => {
                window.open(
                  "https://t.me/+mUpoYrdYulplMzIx",
                  "_blank",
                  "noreferrer"
                );
              }}
            />
            <Image
              src={TwitterIcon}
              style={{
                width: "2rem",
              }}
              onClick={() => {
                window.open(
                  "https://twitter.com/loch_chain",
                  "_blank",
                  "noreferrer"
                );
              }}
              className="social-media-icon"
            />
          </div>
        </div>
        <p className="inter-display-medium f-s-13 lh-16 m-b-40 grey-ADA">
          The content made available on this web page and our mobile
          applications ("Platform") is for informational purposes only. You
          should not construe any such information or other material as
          financial advice in any way. All information provided on the Platform
          is provided on an as is and available basis, based on the data
          provided by the end user on the Platform. Nothing contained on our
          Platform constitutes a solicitation, recommendation, endorsement, or
          offer by us or any third-party service provider to buy or sell any
          securities or other financial instruments in this or in any other
          jurisdiction in which such solicitation or offer would be unlawful
          under the securities laws of such jurisdiction. All content on this
          Platform is information of a general nature and does not address the
          circumstances of any particular individual or entity. Nothing in the
          Platform constitutes financial advice, nor does any information on the
          Platform constitute a comprehensive or complete statement of the
          matters discussed or the law relating thereto. You alone assume the
          sole responsibility of evaluating the merits and risks associated with
          the use of any information or other content on the platform before
          making any decisions based on such information. In exchange for using
          the Platform, you agree not to hold us, our affiliates, or any
          third-party service provider liable for any possible claim for damages
          arising from any decision you make based on information or other
          content made available to you through the Platform.
        </p>
      </>
    );
  }
}

export default Footer;
