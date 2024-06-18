import React, { useEffect } from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import {
  BlackManIcon,
  GreyManIcon,
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
  ShareProfileIcon,
} from "../../assets/images/icons";
import logo from "../../image/Loch.svg";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "../common/Api";

import { toast } from "react-toastify";
import { SmartMoneyShare } from "../../utils/AnalyticsFunctions";
import { BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";

export default function SmartMoneyHeader(props) {
  const [selectedCurrency, setCurrency] = React.useState(
    JSON.parse(window.localStorage.getItem("currency"))
  );
  const [currencyList, setAllCurrencyList] = React.useState([]);
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

      setCurrency(JSON.parse(window.localStorage.getItem("currency")));
    }

    setTimeout(() => {
      //  console.log("curr", currency);
      let currencyRates = JSON.parse(
        window.localStorage.getItem("currencyRates")
      );
      // console.log("currency", currencyRates);
      getAllCurrencyApi(setAllCurrencyList);
      !currencyRates && getAllCurrencyRatesApi();
    }, 1000);
  }, []); // <-- Have to pass in [] here!
  const handleFunction = (currency) => {
    let currencyRates = JSON.parse(
      window.localStorage.getItem("currencyRates")
    );
    for (const [key, value] of Object.entries(currencyRates.rates)) {
      // console.log(`${key}: ${value}`);
      if (key === currency.code) {
        currency = {
          ...currency,
          rate: value,
        };
      }
    }
    // MenuCurrencyDropdownSelected({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   prev_currency: selectedCurrency.symbol + " " + selectedCurrency.code,
    //   currency: currency.symbol + " " + currency.code,
    // });
    setTimeout(() => {
      setCurrency(currency);
      window.localStorage.setItem("currency", JSON.stringify(currency));
      window.location.reload();
    }, 200);
  };
  const goBackToSmartMoney = () => {
    if (props.history && props.isFaq) {
      props.history.replace("/leaderboard");
    }
  };
  const handleShare = () => {
    SmartMoneyShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: true,
    });
    let shareLink = BASE_URL_S3 + "leaderboard";
    copyTextToClipboard(shareLink);
  };
  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  return (
    <div className="smartMoneyHeaderContainer">
      <div className="smartMoneyHeader">
        <div className="leftSmartMoneyContainer">
          <div
            className={`leftSmartMoneyLogos ${
              props.isFaq ? "leftSmartMoneyFAQLogos" : ""
            }`}
            onClick={goBackToSmartMoney}
          >
            <Image src={logo} />
            <span className="leftSmartMoneyLogoText">Loch</span>
          </div>
          {!props.isFaq ? (
            <div className="currency-wrapper">
              <DropdownButton
                id="currency-dropdown"
                title={
                  selectedCurrency &&
                  selectedCurrency.symbol + " " + selectedCurrency.code
                }
                onClick={() => {
                  // MenuCurrencyDropdown({
                  //   session_id: getCurrentUser().id,
                  //   email_address: getCurrentUser().email,
                  //   currency:
                  //     selectedCurrency.symbol + " " + selectedCurrency.code,
                  // });
                }}
              >
                {currencyList?.map((currency, key) => {
                  return (
                    <Dropdown.Item
                      key={key}
                      onClick={() => handleFunction(currency)}
                    >
                      {" "}
                      <span>{currency.symbol}</span>{" "}
                      <span>{currency.code}</span>
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
            </div>
          ) : null}
        </div>
        <div className="rightSmartMoneyContainer">
          <div className={`rightSmartMoneyContainerHeadingParent`}>
            <div
              onClick={goBackToSmartMoney}
              className={`rightSmartMoneyContainerHeading inter-display-medium  ${
                props.isFaq ? "rightSmartMoneyContainerHeadingSmartMoney" : ""
              }`}
            >
              Loch’s Leaderboard
            </div>
          </div>
          <p
            style={{
              marginTop: "0.3rem",
            }}
            className="rightSmartMoneyContainerSubHeading inter-display-medium"
          >
            Sorted by net worth, pnl, and flows
          </p>
        </div>

        {!props.isFaq ? (
          <>
            {localLochUser &&
            (localLochUser.email ||
              localLochUser.first_name ||
              localLochUser.last_name) ? (
              <>
                <div
                  onClick={handleShare}
                  className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                >
                  <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                    <Image
                      className="smarMoneyHeaderSignInIcon"
                      src={ShareProfileIcon}
                    />
                  </div>
                  <div className="smarMoneyHeaderSignInJustText">Share</div>
                </div>
                <div
                  onClick={props.openAddAddressModal}
                  className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                >
                  <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                    <Image
                      className="smarMoneyHeaderSignInIcon"
                      src={PlusCircleSmartMoneyIcon}
                    />
                  </div>
                  <div className="smarMoneyHeaderSignInJustText">
                    Add address
                  </div>
                </div>
                {!props.isFaq ? (
                  <>
                    {" "}
                    <div
                      onClick={props.showFaqModal}
                      className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                        <Image
                          className="smarMoneyHeaderSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="smarMoneyHeaderSignInJustText">FAQ</div>
                    </div>
                    <div
                      onClick={props.showHowItWorksModal}
                      className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                        <Image
                          className="smarMoneyHeaderSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="smarMoneyHeaderSignInJustText">
                        How it works
                      </div>
                    </div>
                  </>
                ) : null}
                {/* <CustomOverlay
                  position="bottom"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text="Sign out"
                  className="tool-tip-container-bottom-arrow"
                > */}
                <div
                  onClick={props.signOutFun}
                  className="smarMoneyHeaderSignInContainer  smarMoneyHeaderSignedInContainer inter-display-medium f-s-14 lh-19"
                >
                  <div className="smarMoneyHeaderSignInData">
                    <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignedInIconContainer">
                      <Image
                        className="smarMoneyHeaderSignInIcon"
                        src={BlackManIcon}
                      />
                    </div>
                    <div className="smarMoneyHeaderSignInDataName">
                      {localLochUser.first_name || localLochUser.last_name
                        ? `${localLochUser.first_name} ${
                            localLochUser.last_name
                              ? localLochUser.last_name.slice(0, 1) + "."
                              : ""
                          }`
                        : "Signed in"}
                    </div>
                  </div>
                </div>
                {/* </CustomOverlay> */}
              </>
            ) : (
              <>
                {!props.isFaq ? (
                  <>
                    <div
                      onClick={handleShare}
                      className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                        <Image
                          className="smarMoneyHeaderSignInIcon"
                          src={ShareProfileIcon}
                        />
                      </div>
                      <div className="smarMoneyHeaderSignInJustText">Share</div>
                    </div>
                    <div
                      onClick={props.showFaqModal}
                      className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                        <Image
                          className="smarMoneyHeaderSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="smarMoneyHeaderSignInJustText">FAQ</div>
                    </div>
                    <div
                      onClick={props.showHowItWorksModal}
                      className="smarMoneyHeaderSignInContainer smarMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignInIconNoColor">
                        <Image
                          className="smarMoneyHeaderSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                        />
                      </div>
                      <div className="smarMoneyHeaderSignInJustText">
                        How it works
                      </div>
                    </div>
                  </>
                ) : null}
                <div
                  onClick={props.onSignInClick}
                  className="smarMoneyHeaderSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                >
                  <div className="smarMoneyHeaderSignInIconContainer">
                    <Image
                      className="smarMoneyHeaderSignInIcon"
                      src={GreyManIcon}
                    />
                  </div>
                  <div className="smarMoneyHeaderSignInDataName">
                    Sign in / up now
                  </div>
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
