import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { addLocalWalletList } from "../common/Api";
import { getAllWalletList, resetAllWalletList } from "./WalletAction";

export const reserWalletList = () => {
  return async function (dispatch) {
    dispatch(resetAllWalletList());
  };
};
export const getAllWalletListApi = (data, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/search-wallet", data)
      .then((res) => {
        if (!res.data.error) {
          // console.log("res wallet", res.data.data.user_wallets);
          let walletdata = res.data.data.user_wallets;
          let totalWalletAmt = 0;
          walletdata = walletdata.map((wallet) => {
            totalWalletAmt = totalWalletAmt + wallet.total_value;
            return {
              ...wallet,
              chains: wallet.chains.map((chain) => {
                return {
                  ...chain,
                  chain: {
                    ...chain.chain,
                    percentage: (chain.value * 100) / wallet.total_value,
                  },
                };
              }),
            };
          });
          let passAddress = walletdata?.map((wallet) => {
            return wallet.address;
          });
          if (window.localStorage.getItem("lochToken")) {
            const yieldData = new URLSearchParams();
            yieldData.append("wallet_addresses", JSON.stringify(passAddress));
          }
          dispatch(getAllWalletList({ walletdata, totalWalletAmt }));
          ctx.setState({
            isLoading: false,
            // totalWalletAmt,
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("getAllWalletListApi-Api", err);
      });
  };
};

export const getAllWalletApi = (ctx) => {
  // console.log("hjgdhj")
  const data = new URLSearchParams();
  postLoginInstance
    .post("wallet/user-wallet/get-all-wallets", data)
    .then((res) => {
      if (!res.data.error) {
        let walletNameList = [];
        let allwalletdata = res.data.data.wallets;
        allwalletdata.map((item) => {
          let obj = {
            ...item,
            label: item.name,
            value: item.id,
          };
          walletNameList.push(obj);
        });
        // SORTING IN ALPHABETICAL ORDER
        walletNameList.sort((a, b) => {
          if (a.name !== "Other" || b.name === "Other") {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
          }
          return 0;
        });
        ctx.setState({
          walletNameList: walletNameList,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("getAllWalletApi-Api", err);
    });
};

export const updateWalletApi = (ctx, data) => {
  postLoginInstance
    .post("wallet/user-wallet/update-wallet", data)
    .then((res) => {
      // console.log("update wallet",res)
      if (!res.data.error) {
        let walletAddress = ctx.state.walletAddress;
        let displayAddress = ctx.state.displayAddress;
        // let nickname = ctx.state.walletNickname;
        let addWallet = JSON.parse(window.localStorage.getItem("addWallet"));
        addWallet = addWallet.map((wallet) => {
          // console.log('walletAddress',walletAddress);
          if (
            wallet.address === walletAddress ||
            wallet.address === displayAddress
          ) {
            let metaData = null;
            let newAddress = null;
            let displayAddress = null;
            let nickname = null;

            res.data.data.user_wallets.map((item) => {
              if (item.address === walletAddress) {
                return (
                  (metaData = item.wallet),
                  (newAddress = item.address),
                  (displayAddress = item.display_address),
                  (nickname = item.nickname)
                );
              }
            });
            // console.log('metaData',metaData);
            return {
              ...wallet,
              address: newAddress,
              displayAddress: displayAddress,
              wallet_metadata: metaData,
              nickname: nickname,
              apiAddress: newAddress,
            };
          } else {
            return { ...wallet };
          }
        });
        window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
        addLocalWalletList(JSON.stringify(addWallet));
        ctx.props.onHide();
        ctx.props.makeApiCall();
        toast.success(
          <div className="custom-toast-msg">
            <div>{res.data.message}</div>
            <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
              You’ve successfully updated your wallet
            </div>
          </div>
        );
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("updateWallet-Api start", err);
    });
};
export const deleteWallet = (ctx, data) => {
  postLoginInstance
    .post("organisation/user/delete-user-wallet", data)
    .then((res) => {
      if (!res.data.error) {
        let walletAddress = ctx.state.walletAddress;
        let arr = JSON.parse(window.localStorage.getItem("addWallet"));
        let newArr = [];
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i].address !== walletAddress) {
        //     newArr.push(arr[i]);
        //   }
        // }
        arr.map((w) => {
          if (w.address !== walletAddress) {
            newArr.push(w);
          }
        });
        newArr = newArr.map((item, index) => {
          return {
            ...item,
            id: `wallet${index + 1}`,
          };
        });
        if (newArr.length === 0) {
          newArr.push({
            id: `wallet1`,
            address: "",
            nickname: "",
            showAddress: true,
            showNickname: true,
            showNameTag: true,
            coins: [],
          });
        }
        window.localStorage.setItem("addWallet", JSON.stringify(newArr));
        addLocalWalletList(JSON.stringify(newArr));
        ctx.props.onHide();
        ctx.props.makeApiCall();
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("deketeWallet-Api ", err);
    });
};

// update account name

export const updateAccountName = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/update-user-account-name", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.props.onHide();
        ctx.props.makeApiCall();
        // console.log("res wallet", res.data.data.user_wallets);
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("update account name", err);
    });
};

// delete user account
export const deleteAccount = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/delete-user-account", data)
    .then((res) => {
      // console.log(res)
      if (!res.data.error) {
        ctx.props.onHide();
        ctx.props.makeApiCall();

        // console.log("res wallet", res.data.data.user_wallets);
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("update account name", err);
    });
};
