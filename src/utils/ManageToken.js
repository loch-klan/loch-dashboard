const deleteToken = () => {
  localStorage.removeItem('oemToken');
  localStorage.removeItem('userDetails');
};

const getToken = () => {
  const userDetails = localStorage.getItem('userDetails');
  return userDetails ? JSON.parse(userDetails).token : null;
};

const getScope = () => {
  return JSON.parse(localStorage.getItem('userDetails')).account_permissions[0].account_id;
};

const getUserAccountType = () => {
  const userDetails = localStorage.getItem('userDetails');
  return userDetails ? JSON.parse(userDetails).user_account_type : null;
};

export { getToken, deleteToken, getScope, getUserAccountType };