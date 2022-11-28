import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllWalletList } from "./WalletAction";


export const getAllWalletListApi = (data,ctx) => {
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
          ctx.setState({
            isLoading:false,
          })
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
        // SORTING IN ALPHABETICAL ORDER
        walletNameList.sort((a, b) => {
          if(a.name !== "Other" || b.name==="Other"){
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
      // console.log(res)
      if (!res.data.error) {
        let walletAddress = ctx.state.walletAddress;
        let displayAddress = ctx.state.displayAddress;
        let addWallet = JSON.parse(localStorage.getItem("addWallet"));
        addWallet = addWallet.map((wallet)=>{
          // console.log('wallet.address',wallet.address);
          // console.log('walletAddress',walletAddress);
          if(wallet.address === walletAddress || wallet.address === displayAddress){
            let metaData = null;
            res.data.data.user_wallets.map((item)=>{ if(item.address===walletAddress) metaData = item.wallet })
            // console.log('metaData',metaData);
            return({
              ...wallet,
              wallet_metadata: metaData
            })
          } else{
            return ({...wallet})
          }
        })
        localStorage.setItem('addWallet',JSON.stringify(addWallet));
        ctx.props.onHide()
        ctx.props.makeApiCall()
        toast.success(
        <div className="custom-toast-msg">
          <div>
          {res.data.message}
          </div>
          <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
          You’ve sucessfully updated your wallet
          </div>
        </div>
        );
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
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i].address !== walletAddress) {
        //     newArr.push(arr[i]);
        //   }
        // }
        arr.map((w)=>{
          if(w.address !== walletAddress)
          {
            newArr.push(w)
          }
        })
        newArr = newArr.map((item,index)=>{return({
          ...item,
          id: `wallet${index+1}`
        })})
        if(newArr.length === 0)
        {
          newArr.push(
            {
              id: `wallet1`,
              address: "",
              coins: [],
          }
          )
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
