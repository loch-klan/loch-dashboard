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

const getCurrentUser = () => {
  // const lochUser = localStorage.getItem("lochUser");
  const lochUser = JSON.parse(localStorage.getItem("lochUser"));
  const lochDummyUser = localStorage.getItem("lochDummyUser");

 
  // console.log("Loch User",lochUser.email, "Loch ID", lochUser.id, lochUser);
  // console.log("Loch Dummy User", lochDummyUser);
// // // 
  return lochUser != null ? {id:lochUser.id ,email:lochUser.email} : {id: lochDummyUser, email: "DummyUser@loch"}
}


export { getToken, deleteToken, getCurrentUser };