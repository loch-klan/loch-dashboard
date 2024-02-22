const deleteAddWallet = () => {
  window.sessionStorage.removeItem("addWallet");
};
const deleteToken = (notCurrencyRates) => {
  window.sessionStorage.removeItem("setMetamaskConnectedSessionStorage");
  window.sessionStorage.removeItem("lochToken");
  window.sessionStorage.removeItem("addWallet");
  window.sessionStorage.removeItem("lochUser");
  window.sessionStorage.removeItem("lochDummyUser");
  if (!notCurrencyRates) {
    window.sessionStorage.removeItem("currencyRates");
    window.sessionStorage.removeItem("currency");
  }
  window.sessionStorage.removeItem("currentPlan");
  window.sessionStorage.removeItem("share_id");
  window.sessionStorage.removeItem("Plans");
  window.sessionStorage.removeItem("stopClick");
  window.sessionStorage.removeItem("defi_access");
  window.sessionStorage.removeItem("isPopup");
  window.sessionStorage.removeItem("stop_redirect");
  window.sessionStorage.removeItem("connectWalletAddress");
  window.sessionStorage.removeItem("gotShareProtfolio");
};

const getToken = () => {
  const lochToken = window.sessionStorage.getItem("lochToken");
  return lochToken;
};

const getCurrentUser = () => {
  // const lochUser = window.sessionStorage.getItem("lochUser");
  const lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
  const lochDummyUser = window.sessionStorage.getItem("lochDummyUser");

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
  window.sessionStorage.setItem("defi_access", true);

  window.sessionStorage.setItem("isPopup", true);
  window.sessionStorage.setItem(
    "whalepodview",
    JSON.stringify({ access: true, id: "" })
  );

  // submenu for sidebar
  window.sessionStorage.setItem(
    "isSubmenu",
    JSON.stringify({
      me: true,
      discover: false,
      intelligence: false,
      topAccount: false,
      topAccountintelligence: false,
    })
  );

  window.sessionStorage.setItem(
    "assetValueLoader",
    JSON.stringify({ me: false, topaccount: false })
  );

  resetPreviewAddress();
};

const resetPreviewAddress = () => {
  window.sessionStorage.setItem(
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
