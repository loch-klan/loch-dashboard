const deleteToken = () => {
  localStorage.removeItem('lochToken');
};

const getToken = () => {
  localStorage.getItem('lochToken');
};

export { getToken, deleteToken };