import React from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import logo from "../../image/Loch.svg";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "../common/Api";

export default function SmartMoneyMobileHeader(props) {
  const [selectedCurrency, setCurrency] = React.useState(
    JSON.parse(window.sessionStorage.getItem("currency"))
  );
  const [currencyList, setAllCurrencyList] = React.useState([]);
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
    <div className="smartMoneyMobileHeaderContainer">
      <div className="smheader">
        <Image className="smheaderLogo" src={logo} />
        <div className="smheaderText">
          <div className="smheaderTextHeading inter-display-medium">
            Loch’s Smart Money Leaderboard
          </div>
          <div
            style={{
              marginTop: "0.1rem",
            }}
            className="smheaderTextSubHeading inter-display-medium"
          >
            The lazy analyst’s guide to alpha
          </div>
        </div>
      </div>

      {/* <div className="smartMoneyHeader">
        <div className="leftSmartMoneyContainer">
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
                    <span>{currency.symbol}</span> <span>{currency.code}</span>
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
        </div>
        <div className="rightSmartMoneyContainer">
          <div className="rightSmartMoneyContainerHeading inter-display-medium">
            Loch’s Smart Money Leaderboard
          </div>
          <p
            style={{
              marginTop: "0.3rem",
            }}
            className="rightSmartMoneyContainerSubHeading inter-display-medium"
          >
            The lazy analyst’s guide to alpha
          </p>
        </div>
      </div> */}
    </div>
  );
}
