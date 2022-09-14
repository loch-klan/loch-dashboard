const deleteToken = () => {
  localStorage.removeItem('lochToken');
};

const getToken = () => {
  const lochToken = localStorage.getItem('lochToken');
  return lochToken;
};

export { getToken, deleteToken };