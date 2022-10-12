const deleteToken = () => {
  localStorage.removeItem('lochToken');
  localStorage.removeItem("addWallet")
  localStorage.removeItem("lochUser")
  localStorage.removeItem("lochDummyUser")
};

const getToken = () => {
  const lochToken = localStorage.getItem('lochToken');
  return lochToken;
};

export { getToken, deleteToken };