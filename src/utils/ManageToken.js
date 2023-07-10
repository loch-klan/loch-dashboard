const deleteToken = () => {
  localStorage.removeItem("lochToken");
  localStorage.removeItem("addWallet");
  localStorage.removeItem("lochUser");
  localStorage.removeItem("lochDummyUser");
  localStorage.removeItem("currencyRates");
  localStorage.removeItem("currency");
  localStorage.removeItem("currentPlan");
  localStorage.removeItem("share_id");
  localStorage.removeItem("Plans");
  localStorage.removeItem("stopClick");
  localStorage.removeItem("defi_access");
  localStorage.removeItem("isPopup");
  localStorage.removeItem("stop_redirect");
  localStorage.removeItem("connectWalletAddress");
  localStorage.removeItem("gotShareProtfolio");
};

const getToken = () => {
  const lochToken = localStorage.getItem("lochToken");
  return lochToken;
};

const getCurrentUser = () => {
  // const lochUser = localStorage.getItem("lochUser");
  const lochUser = JSON.parse(localStorage.getItem("lochUser"));
  const lochDummyUser = localStorage.getItem("lochDummyUser");

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
  localStorage.setItem("defi_access", true);

  localStorage.setItem("isPopup", true);
  localStorage.setItem(
    "whalepodview",
    JSON.stringify({ access: true, id: "" })
  );

  // submenu for sidebar
  localStorage.setItem(
    "isSubmenu",
    JSON.stringify({
      me: true,
      discover: false,
      intelligence: false,
      topAccount: false,
      topAccountintelligence: false,
    })
  );

  resetPreviewAddress();
};

const resetPreviewAddress = () => {
  localStorage.setItem(
    "previewAddress",
    JSON.stringify({
      id: "wallet1",
      address: "",
      coins: [],
      nickname: "",
      showAddress: true,
      showNickname: true,
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
};
