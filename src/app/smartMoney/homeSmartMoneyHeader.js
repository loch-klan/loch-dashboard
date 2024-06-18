import React, { useEffect } from "react";
import { Image } from "react-bootstrap";
import {
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
} from "../../assets/images/icons";
import { getAllCurrencyRatesApi } from "../common/Api";
import { SmartMoneyShare } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";

export default function HomeSmartMoneyHeader(props) {
  const [localLochUser, setLocalLochUser] = React.useState(
    JSON.parse(window.localStorage.getItem("lochUser"))
  );

  useEffect(() => {
    if (!props.blurTable) {
      setLocalLochUser(JSON.parse(window.localStorage.getItem("lochUser")));
    } else {
      setLocalLochUser(undefined);
    }
  }, [props.blurTable]);

  React.useEffect(() => {
    let currency = JSON.parse(window.localStorage.getItem("currency"));

    if (!currency) {
      window.localStorage.setItem(
        "currency",
        JSON.stringify({
          active: true,
          code: "USD",
          id: "6399a2d35a10114b677299fe",
          name: "United States Dollar",
          symbol: "$",
          rate: 1,
        })
      );
    }

    setTimeout(() => {
      let currencyRates = JSON.parse(
        window.localStorage.getItem("currencyRates")
      );
      !currencyRates && getAllCurrencyRatesApi();
    }, 1000);
  }, []); // <-- Have to pass in [] here!
  // const handleShare = () => {
  //   SmartMoneyShare({
  //     session_id: getCurrentUser().id,
  //     email_address: getCurrentUser().email,
  //     isMobile: true,
  //   });
  //   let shareLink = BASE_URL_S3 + "leaderboard";
  //   copyTextToClipboard(shareLink);
  // };
  // const copyTextToClipboard = async (text) => {
  //   if ("clipboard" in navigator) {
  //     toast.success("Link copied");
  //     return await navigator.clipboard.writeText(text);
  //   } else {
  //     return document.execCommand("copy", true, text);
  //   }
  // };
  return (
    <div className="homeSmartMoneyHeaderContainer">
      <div className="homeSmartMoneyHeader">
        {!props.isFaq ? (
          <>
            {localLochUser &&
            (localLochUser.email ||
              localLochUser.first_name ||
              localLochUser.last_name) ? (
              <>
                {/* <div
                  onClick={handleShare}
                  className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                >
                  <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                    <Image
                      className="homeSmartMoneyHeaderSignInIcon"
                      src={ShareProfileIcon}
                    />
                  </div>
                  <div className="homeSmartMoneyHeaderSignInJustText">
                    Share
                  </div>
                </div> */}
                <div
                  onClick={props.openAddAddressModal}
                  className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button main-button no-box-shadow w-transaparent-b-w BorderNew"
                >
                  <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                    <Image
                      className="homeSmartMoneyHeaderSignInIcon"
                      src={PlusCircleSmartMoneyIcon}
                    />
                  </div>
                  <div className="homeSmartMoneyHeaderSignInJustText">
                    Add address
                  </div>
                </div>
                {!props.isFaq ? (
                  <>
                    {" "}
                    <div
                      onClick={props.showFaqModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button main-button no-box-shadow w-transaparent-b-w BorderNew"
                    >
                      <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                        <Image
                          className="homeSmartMoneyHeaderSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="homeSmartMoneyHeaderSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={props.showHowItWorksModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button main-button no-box-shadow w-transaparent-b-w BorderNew"
                      style={{
                        marginRight: "0rem",
                      }}
                    >
                      <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                        <Image
                          className="homeSmartMoneyHeaderSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="homeSmartMoneyHeaderSignInJustText">
                        How it works
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <>
                {!props.isFaq ? (
                  <>
                    {/* <div
                      onClick={handleShare}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                        <Image
                          className="homeSmartMoneyHeaderSignInIcon"
                          src={ShareProfileIcon}
                        />
                      </div>
                      <div className="homeSmartMoneyHeaderSignInJustText">
                        Share
                      </div>
                    </div> */}
                    <div
                      onClick={props.showFaqModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button main-button no-box-shadow w-transaparent-b-w BorderNew"
                    >
                      <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                        <Image
                          className="homeSmartMoneyHeaderSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="homeSmartMoneyHeaderSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={props.showHowItWorksModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button main-button no-box-shadow w-transaparent-b-w BorderNew"
                      style={{
                        marginRight: "0rem",
                      }}
                    >
                      <div className="homeSmartMoneyHeaderSignInIconContainer homeSmartMoneyHeaderSignInIconNoColor">
                        <Image
                          className="homeSmartMoneyHeaderSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="homeSmartMoneyHeaderSignInJustText">
                        How it works
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
