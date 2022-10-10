import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllWalletList } from "./WalletAction";

export const getAllWalletListApi = (data) => {
  return function (dispatch, getState) {
    postLoginInstance.post("wallet/user-wallet/search-wallet", data)
      .then((res) => {
        if (!res.data.error) {
          let walletdata = res.data.data.user_wallets
          walletdata = walletdata.map((wallet) => {
            return ({
              ...wallet,
              chains: wallet.chains.map((chain) => {
                return ({
                  ...chain,
                  chain: {
                    ...chain.chain,
                    percentage: (chain.value * 100 / wallet.total_value),
                  }
                })
              })
            })
          })
          dispatch(getAllWalletList(walletdata))
        } else {
          toast.error(res.data.message || "Something Went Wrong")
        }
      })
      .catch((err) => {
        console.log("getAllWalletListApi-Api", err)
      })
  };
}

export const getAllWalletApi = (ctx) => {
  const data = new URLSearchParams();
  postLoginInstance.post("wallet/user-wallet/get-all-wallets", data)
    .then((res) => {
      if (!res.data.error) {
        let walletNameList = []
        let allwalletdata = res.data.data.wallets
        allwalletdata.map((item) => {
          let obj = {
            ...item,
            label: item.name,
            value: item.id
          }
          walletNameList.push(obj)
        })

        ctx.setState({
          walletNameList: walletNameList
        })
      } else {
        toast.error(res.data.message || "Something Went Wrong")
      }
    })
    .catch((err) => {
      console.log("getAllWalletApi-Api", err)
    })
}

export const updateWalletApi = (ctx, data) => {
  postLoginInstance.post("wallet/user-wallet/update-wallet", data)
    .then((res) => {
      console.log(res)
      if (!res.data.error) {
        console.log(res.data.message)
        ctx.props.onHide()
        ctx.props.makeApiCall()
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something Went Wrong")
      }
    })
    .catch((err) => {
      console.log("updateWallet-Api start", err)
    })
}
export const deleteWallet = (ctx, data) => {
  postLoginInstance.post("organisation/user/delete-user-wallet", data)
    .then((res) => {
      if (!res.data.error) {
        let walletAddress = ctx.state.walletAddress
        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let newArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].address !== walletAddress) {
            newArr.push(arr[i])
          }
        }
        localStorage.setItem("addWallet", JSON.stringify(newArr))
        ctx.props.onHide()
        ctx.props.makeApiCall()
      } else {
        toast.error(res.data.message || "Something Went Wrong")
      }
    })
    .catch((err) => {
      console.log("deketeWallet-Api ", err)
    })
}
