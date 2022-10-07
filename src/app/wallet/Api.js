import { postLoginInstance} from "../../utils";
import { toast } from "react-toastify";

export const getwallets = (ctx,data)=>{
    return  async function (dispatch, getState) {

       postLoginInstance.post("wallet/user-wallet/search-wallet",data)
       .then((res)=>{
        console.log(res)
            if(!res.data.error){
                let walletList = []
                let walletdata = res.data.data.wallets
                // walletList.push(res.data.data.wallets)
                // console.log(walletdata)
                Object.entries(walletdata).map(item => {
                    let obj = {}
                    obj['address'] = item[0]
                    obj['chain'] = item[1].chains.map((ch)=>{
                        // console.log(item[1].total_value)
                        return({
                            code:ch.chain.code,
                            color:ch.chain.color,
                            symbol:ch.chain.symbol,
                            name:ch.chain.name,
                            value : (ch.value*100 / item[1].total_value),
                        })
                    })
                    obj['total_value'] = item[1].total_value
                    obj['wallet_metadata'] = item[1].wallet_metadata
                    walletList.push(obj)
                })

                ctx.setState({
                    walletData :walletList
                })

            }
            else{
                toast.error(res.data.message || "Something Went Wrong")
            }
       })
       .catch((err)=>{
        console.log("getwallets-Api",err)
       })
    };
}

export const getallwallets = (ctx,data)=>{
    return  async function (dispatch, getState) {

       postLoginInstance.post("wallet/user-wallet/get-all-wallets",data)
       .then((res)=>{
        console.log(res)
            if(!res.data.error){
                console.log("getallwallets",res.data.data)
                let dropdownlistmodal = []
                let allwalletdata = res.data.data.wallets
                allwalletdata.map((item)=>{
                    let obj = {...item,value:item.name}

                    // console.log("item",item)
                    // console.log("obj",obj)
                    dropdownlistmodal.push(obj)
                })

                ctx.setState({
                   dropDownListModal :dropdownlistmodal
                })
            }
            else{
                toast.error(res.data.message || "Something Went Wrong")
            }
       })
       .catch((err)=>{
        console.log("getallwallets-Api",err)
       })
    };
}

export const updatewallet = (ctx,data)=>{
    return  async function (dispatch, getState) {

       postLoginInstance.post("wallet/user-wallet/update-wallet",data)
       .then((res)=>{
        console.log(res)
            if(!res.data.error){
                console.log(res.data.message)
            }
            else{
                toast.error(res.data.message || "Something Went Wrong")
            }
       })
       .catch((err)=>{
        console.log("updateWallet-Api start",err)
       })
    };
}
