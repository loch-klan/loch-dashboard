import { postLoginInstance } from "../../utils";
import { GET_NFT_DATA } from "./NftActionTypes";

export const getNFT = (data, ctx, isDefault) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-nfts", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            let tempNftHolder = [];
            let tempVar = res?.data?.data?.data;

            tempVar.forEach((resRes) => {
              tempNftHolder.push({
                holding: resRes.amount ? resRes.amount : "",
                collection: resRes.name ? resRes.name : "",
                imgs: resRes.logo ? resRes.logo : "",
                total_spent: resRes.total_spent ? resRes.total_spent : "",
                max_price: resRes.max_price ? resRes.max_price : "",
                avg_price: resRes.avg_price ? resRes.avg_price : "",
                volume: resRes.volume ? resRes.volume : "",
              });
            });
            const allNftData = {
              total_count: res.data.total,
              nfts: tempNftHolder,
            };
            if (isDefault) {
              dispatch({
                type: GET_NFT_DATA,
                payload: allNftData,
              });
            }
            if (ctx.setLocalNftData) {
              ctx.setLocalNftData(allNftData);
            }
          }
        }
      })
      .catch((err) => {});
  };
};
