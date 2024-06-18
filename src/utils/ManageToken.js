const deleteAddWallet = () => {
  window.localStorage.removeItem("addWallet");
};
const deleteToken = (notCurrencyRates) => {
  window.localStorage.removeItem("setMetamaskConnectedSessionStorage");
  window.localStorage.removeItem("lochToken");
  window.localStorage.removeItem("addWallet");
  window.localStorage.removeItem("lochUser");
  window.localStorage.removeItem("lochDummyUser");
  if (!notCurrencyRates) {
    window.localStorage.removeItem("currencyRates");
    window.localStorage.removeItem("currency");
  }
  window.localStorage.removeItem("dontOpenLoginPopup");
  window.localStorage.removeItem("currentPlan");
  window.localStorage.removeItem("share_id");
  window.localStorage.removeItem("Plans");
  window.localStorage.removeItem("stopClick");
  window.localStorage.removeItem("defi_access");
  window.localStorage.removeItem("isPopup");
  window.localStorage.removeItem("stop_redirect");
  window.localStorage.removeItem("connectWalletAddress");
  window.localStorage.removeItem("gotShareProtfolio");
};

const getToken = () => {
  const lochToken = window.localStorage.getItem("lochToken");
  return lochToken;
};

const getCurrentUser = () => {
  // const lochUser = window.localStorage.getItem("lochUser");
  const lochUser = JSON.parse(window.localStorage.getItem("lochUser"));
  const lochDummyUser = window.localStorage.getItem("lochDummyUser");

  //   console.log("Loch User",lochUser.email, "Loch ID", lochUser.id, lochUser);
  //   console.log("Loch Dummy User", lochDummyUser);
  // // // //
  return lochUser != null
    ? { id: lochUser.link, email: lochUser.email }
    : { id: lochDummyUser, email: "" };
};

// set localstorage for general features which not depend on api but we set this initally when app load
// set all the localstorage value when
const setLocalStoraage = () => {
  // for defi access - check when plan is free
  window.localStorage.setItem("defi_access", true);

  window.localStorage.setItem("isPopup", true);
  window.localStorage.setItem(
    "whalepodview",
    JSON.stringify({ access: true, id: "" })
  );

  // submenu for sidebar
  window.localStorage.setItem(
    "isSubmenu",
    JSON.stringify({
      me: true,
      discover: false,
      intelligence: false,
      topAccount: false,
      topAccountintelligence: false,
    })
  );

  window.localStorage.setItem(
    "assetValueLoader",
    JSON.stringify({ me: false, topaccount: false })
  );

  resetPreviewAddress();
};

const resetPreviewAddress = () => {
  window.localStorage.setItem(
    "previewAddress",
    JSON.stringify({
      id: "wallet1",
      address: "",
      coins: [],
      nickname: "",
      showAddress: true,
      showNickname: true,
      showNameTag: true,
      apiAddress: "",
    })
  );
};

export {
  getToken,
  deleteToken,
  getCurrentUser,
  setLocalStoraage,
  resetPreviewAddress,
  deleteAddWallet,
};
