import { GET_NFT_DATA } from "./NftActionTypes";
const INITIAL_STATE = {
  total_count: 0,
  nfts: [],
};

export const NFTReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_NFT_DATA:
      return action.payload;
    default:
      return state;
  }
};
