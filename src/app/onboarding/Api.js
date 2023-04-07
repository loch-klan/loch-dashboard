import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST, PARENT_COINS_LIST } from "./ActionTypes";
import {
  WalletAddressTextbox,
  EmailAddressVerified,
  UserSignedinCorrectly,
  UserWrongCode,
  EmailNotFound,
  WhaleWalletAddressTextbox,
  setUserProperties,
  signInUser,
  signUpProperties,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
export const getAllCoins = (handleShareLinkUser = null) => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        postLoginInstance
            .post("wallet/chain/get-chains", data)
            .then((res) => {
                let coinsList = res.data && res.data.data && res.data.data.chains.length > 0 ? res.data.data.chains : []
                dispatch({
                    type: COINS_LIST,
                    payload: coinsList
                }); 
              handleShareLinkUser && handleShareLinkUser()
            })
            .catch((err) => {
                // console.log("Catch", err);
            });
    };
};

export const getAllParentChains = () => {
  return async function (dispatch, getState) {
      let data = new URLSearchParams();
      postLoginInstance
          .post("wallet/chain/get-parent-chains", data)
          .then((res) => {
              let coinsList = res.data && res.data.data && res.data.data.chains.length > 0 ? res.data.data.chains : []
              dispatch({
                  type: PARENT_COINS_LIST,
                  payload: coinsList
              });
           
          })
          .catch((err) => {
              // console.log("Catch", err);
          });
  };
};

export const detectCoin = (wallet, ctx = null, isCohort= false) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("chain", wallet.coinCode);
    data.append("wallet_address", wallet.address);
    postLoginInstance
      .post("wallet/chain/detect-chain", data)
      .then((res) => {
        // && res.data.data.chain_detected
        if (!res.error && res.data) {
          if (res.data.data.chain_detected && !isCohort) {
            WalletAddressTextbox({
              session_id: "",
              address: wallet.address,
              chains_detected: wallet.coinName,
            });
          }

          if (isCohort) {
             WhaleWalletAddressTextbox({
               session_id: getCurrentUser().id,
               email_address: getCurrentUser().email,
               address: wallet.address,
               chains_detected: wallet.coinName,
             });
          }
          
         
          if (!isCohort) {
      // wallet.address = res.data.data.wallet_address;
            dispatch({
              type: WALLET_LIST,
              payload: {
                id: wallet.id,
                coinCode: wallet.coinCode,
                coinSymbol: wallet.coinSymbol,
                coinName: wallet.coinName,
                apiaddress: res.data.data.wallet_address,
                address: wallet.address,
                chain_detected: res.data.data.chain_detected,
                coinColor: wallet.coinColor,
                subChains: wallet.subChains,
              },
            });
          }
          if (ctx) {
            // console.log("walletr", res.data.data.wallet_address, wallet);
            ctx.handleSetCoin({
              ...wallet,
              chain_detected: res.data.data.chain_detected,
              apiaddress: res.data.data.wallet_address,
            });
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};

export const signIn = (ctx, data) => {

    preLoginInstance.post('organisation/user/send-otp',data)
    .then(res =>{
        if(res.data.error)
        {
          // toast.error(
          //   <div className="custom-toast-msg">
          //     <div>
          //     {res.data.message}
          //     </div>
          //     <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
          //     Please enter a valid email
          //     </div>
          //   </div>
          //   );
            // toast.error(res.data.message || "Something went Wrong")
          ctx.setState(
            { emailError: true }
          );
          EmailNotFound({email_address: ctx.state.email})
        }
        else if (res.data.error === false) {
            //email Valid
EmailAddressVerified({ email_address: ctx.state.email });
            ctx.setState({
                isVerificationRequired:true,
                text:"",
                emailError: false
            })
            ctx.props.handleStateChange("verifyCode")
        }
    })
    .catch(err =>{
        // console.log("error while signing",err)
    })
}

export const verifyUser = (ctx, info) => {

    preLoginInstance.post('organisation/user/verify-otp',info)
    .then(res=>{
        // console.log(res.data.data.user)
        if(!res.data.error){
          localStorage.setItem("lochUser", JSON.stringify(res.data.data.user));
          localStorage.setItem("lochToken", res.data.data.token);

          const allChains = ctx.props.OnboardingState.coinsList;
          let addWallet = [];
          const apiResponse = res.data.data;
          for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
            let obj = {}; // <----- new Object
            // obj['address'] = apiResponse.user.wallets[i].address;
            obj["address"] = apiResponse?.user?.user_wallets[i]?.address;
            // obj['displayAddress'] = apiResponse.user.wallets[i]?.display_address;
            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;
            // const chainsDetected =
            //   apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
            //     .chains;

            const chainsDetected =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains ||
              apiResponse.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains;
            obj["coins"] = allChains.map((chain) => {
              let coinDetected = false;
              chainsDetected.map((item) => {
                if (item.id === chain.id) {
                  coinDetected = true;
                }
              });
              return {
                coinCode: chain.code,
                coinSymbol: chain.symbol,
                coinName: chain.name,
                chain_detected: coinDetected,
                coinColor: chain.color,
              };
            });
            obj["wallet_metadata"] = apiResponse?.user?.user_wallets[i]?.wallet;
            obj["id"] = `wallet${i + 1}`;

            let chainLength =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address.toLowerCase()]
                ?.chains?.length;
            
            obj["coinFound"] = chainLength > 0 ? true : false;
          
            obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
            obj["showAddress"] = apiResponse?.user?.user_wallets[i]?.nickname === "" ? true
                        : false;
            obj["showNickname"] = apiResponse?.user?.user_wallets[i]?.nickname !== ""
                        ? true
                        : false;
            
            addWallet.push(obj);
          }
        
          // Mixpanel function
          signInUser({
            email_address: res.data.data.user?.email,
            userId: res.data.data.user?.link,
            first_name: res.data.data.user?.first_name,
            last_name: res.data.data.user?.last_name,
          });
          // console.log("addWallet", addWallet);
          localStorage.setItem("addWallet", JSON.stringify(addWallet));
          ctx.props.history.push({
            pathname: "/home",
            state: { addWallet },
          });
          UserSignedinCorrectly({
            email_address: res.data.data.user.email,
            session_id: res.data.data.user?.link,
          });
        }
        else {

           UserWrongCode({ email_address: ctx.state.email });
          toast.error(
            <div className="custom-toast-msg">
              <div>
              {res.data.message}
              </div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
              Please enter a valid otp
              </div>
            </div>
            );
            // toast.error(res.data.message || "Something Went Wrong")
        }
    })
    .catch(err =>{
        console.log("error while verifying",err)
    })
}

export const createAnonymousUserApi = (data, ctx, addWallet,userFunction = null) => {
  // localStorage.setItem('currency',JSON.stringify({
  //         active: true,
  //         code: "USD",
  //         id: "6399a2d35a10114b677299fe",
  //         name: "United States Dollar",
  //         symbol: "$",
  //         rate: 1,
  // }))

  localStorage.setItem("stopClick", false);
      
  localStorage.setItem("lochToken", "jsk");
 
  if(!ctx.props.ishome){
    if (!ctx.state?.podName) {
      !ctx.state?.id &&
        ctx.props?.history.push({
          pathname: ctx.state?.id ? ctx.state?.link : "/home",
          // state: {addWallet: ctx.state.id ? addWallet : newAddWallet}
          state: { noLoad: true },
        });
    }
  }

  postLoginInstance.post('organisation/user/create-user',data)
    .then(res => {
    // console.log("inside create user function")
    if(!res.data.error){
      localStorage.setItem("lochDummyUser", res.data.data.user.link)
      localStorage.setItem("lochToken", res.data.data.token)
      localStorage.setItem(
        "currentPlan",
        JSON.stringify(res.data.data.current_plan)
      );

      localStorage.setItem("stopClick", true);

       signUpProperties({ userId: res.data.data.user.link, email_address:"", first_name:"",last_name:"" });
     
      const allChains = ctx.props.OnboardingState.coinsList
      
      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log("res ", apiResponse)
      for (let i = 0; i < apiResponse.user.user_wallets.length; i++){
        let obj = {}; // <----- new Object
        obj['address'] = apiResponse.user.user_wallets[i].address;
              obj['displayAddress'] = apiResponse.user.user_wallets[i]?.display_address;
        const chainsDetected = apiResponse.wallets[
            apiResponse.user.user_wallets[i].address
          ]?.chains || apiResponse.wallets[
            apiResponse.user.user_wallets[i].address.toLowerCase()
          ]?.chains;

              obj['coins'] = allChains?.map((chain)=>{
                let coinDetected = false;
                chainsDetected?.map((item)=>{
                  if(item.id === chain.id){
                    coinDetected = true;
                  }
                })
                return ({coinCode: chain.code,
                    coinSymbol: chain.symbol,
                    coinName: chain.name,
                    chain_detected: coinDetected,
                  coinColor: chain.color})
              });
              obj['wallet_metadata']= apiResponse.user?.user_wallets[i]?.wallet;
        obj['id'] = `wallet${i + 1}`;
        let chainLength =
          apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
            ?.chains?.length ||
          apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address.toLowerCase()]
            ?.chains?.length; 
        obj["coinFound"] = chainLength > 0 ? true : false;
        obj['nickname'] = apiResponse.user.user_wallets[i]?.nickname;
        obj["showAddress"] = apiResponse.user.user_wallets[i]?.nickname === "" ? true : false;
        obj["showNickname"] =
          apiResponse.user.user_wallets[i]?.nickname !== "" ? true : false;
        newAddWallet.push(obj);
      }
      if (ctx.state.podName) {
        localStorage.setItem(
          "addWallet",
          JSON.stringify(newAddWallet)
        );
      }
        else{
          localStorage.setItem(
            "addWallet",
            JSON.stringify(ctx.state.id ? addWallet : newAddWallet)
          );
        }
      // console.log("wallet", addWallet);
      if (userFunction) {
        // console.log("user function found");
        ctx.getUrl();
         localStorage.setItem("stop_redirect", true);
        setTimeout(() => {
           userFunction();
        }, 100);
       
        
      } else {
        //  console.log("user function not found");
        if (ctx.state?.podName) {
           console.log("podname login redirect to link", ctx.state?.link);
          ctx.props?.history.push({
            pathname: ctx.state?.link,
          });
        } else {
          ctx.props.history.replace({
            pathname: ctx.state?.id ? ctx.state?.link : "/home",
            state: {
              addWallet: ctx.state?.id ? addWallet : newAddWallet,
              noLoad: false,
            },
          });
        }
          
      }
  }else{
      toast.error(res.data.message || "Something Went Wrong")
  }
  })
}



