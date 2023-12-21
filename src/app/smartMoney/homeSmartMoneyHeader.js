import React, { useEffect } from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import logo from "../../image/Loch.svg";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "../common/Api";
import {
  BlackManIcon,
  GreyManIcon,
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
} from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

import { toast } from "react-toastify";
import { getCurrentUser } from "../../utils/ManageToken";
import { BASE_URL_S3 } from "../../utils/Constant";

export default function HomeSmartMoneyHeader(props) {
  const [selectedCurrency, setCurrency] = React.useState(
    JSON.parse(window.sessionStorage.getItem("currency"))
  );
  const [currencyList, setAllCurrencyList] = React.useState([]);
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

      setCurrency(JSON.parse(window.sessionStorage.getItem("currency")));
    }

    setTimeout(() => {
      //  console.log("curr", currency);
      let currencyRates = JSON.parse(
        window.sessionStorage.getItem("currencyRates")
      );
      // console.log("currency", currencyRates);
      getAllCurrencyApi(setAllCurrencyList);
      !currencyRates && getAllCurrencyRatesApi();
    }, 1000);
  }, []); // <-- Have to pass in [] here!
  const handleFunction = (currency) => {
    let currencyRates = JSON.parse(
      window.sessionStorage.getItem("currencyRates")
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
      window.sessionStorage.setItem("currency", JSON.stringify(currency));
      window.location.reload();
    }, 200);
  };

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
