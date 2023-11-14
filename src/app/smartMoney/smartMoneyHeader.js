import React, { useEffect } from "react";
import { Button, Dropdown, DropdownButton, Image } from "react-bootstrap";
import logo from "../../image/Loch.svg";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "../common/Api";
import { BlackManIcon, GreyManIcon } from "../../assets/images/icons";
import LeaveIcon from "../../assets/images/icons/LeaveIcon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import LeaveBlackIcon from "../../assets/images/icons/LeaveBlackIcon.svg";

export default function SmartMoneyHeader(props) {
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
    <div className="smartMoneyHeaderContainer">
      <div className="smartMoneyHeader">
        <div className="leftSmartMoneyContainer">
          <div className="leftSmartMoneyLogos">
            <Image src={logo} />
            <span className="leftSmartMoneyLogoText">Loch</span>
          </div>
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

        {localLochUser &&
        (localLochUser.email ||
          localLochUser.first_name ||
          localLochUser.last_name) ? (
          <>
            <div
              onClick={props.openAddAddressModal}
              className="smarMoneyHeaderSignInContainer inter-display-medium f-s-13 lh-19 navbar-button"
            >
              <div
                style={{
                  minHeight: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Add address
              </div>
            </div>
            <CustomOverlay
              position="bottom"
              isIcon={false}
              isInfo={true}
              isText={true}
              text="Sign out"
              className="tool-tip-container-bottom-arrow"
            >
              <div
                onClick={props.signOutFun}
                className="smarMoneyHeaderSignInContainer smarMoneyHeaderSignedInContainer inter-display-medium f-s-13 lh-19"
              >
                <div className="smarMoneyHeaderSignInData">
                  <div className="smarMoneyHeaderSignInIconContainer smarMoneyHeaderSignedInIconContainer">
                    <Image
                      className="smarMoneyHeaderSignInIcon"
                      src={BlackManIcon}
                    />
                  </div>
                  <div>
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
            </CustomOverlay>
          </>
        ) : (
          <div
            onClick={props.onSignInClick}
            className="smarMoneyHeaderSignInContainer inter-display-medium f-s-13 lh-19 navbar-button"
          >
            <div className="smarMoneyHeaderSignInIconContainer">
              <Image className="smarMoneyHeaderSignInIcon" src={GreyManIcon} />
            </div>
            <div>Sign in now</div>
          </div>
        )}
      </div>
    </div>
  );
}
