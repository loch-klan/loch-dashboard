import React, { useEffect } from "react";
import { Image } from "react-bootstrap";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "../common/Api";
import {
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
} from "../../assets/images/icons";

export default function HomeSmartMoneyHeader(props) {
  const [localLochUser, setLocalLochUser] = React.useState(
    JSON.parse(window.sessionStorage.getItem("lochUser"))
  );

  useEffect(() => {
    if (!props.blurTable) {
      setLocalLochUser(JSON.parse(window.sessionStorage.getItem("lochUser")));
    } else {
      setLocalLochUser(undefined);
    }
  }, [props.blurTable]);

  React.useEffect(() => {
    let currency = JSON.parse(window.sessionStorage.getItem("currency"));

    if (!currency) {
      window.sessionStorage.setItem(
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
        window.sessionStorage.getItem("currencyRates")
      );
      !currencyRates && getAllCurrencyRatesApi();
    }, 1000);
  }, []); // <-- Have to pass in [] here!

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
                <div
                  // onClick={props.openAddAddressModal}
                  className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
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
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
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
                      // onClick={props.showHowItWorksModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
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
                    <div
                      onClick={props.showFaqModal}
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
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
                      className="homeSmartMoneyHeaderSignInContainer homeSmartMoneyHeaderFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
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
