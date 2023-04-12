import moment from "moment";
import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import { ConnectExEmailVerified, GeneralPopupEmailVerified, Home_CE_OAuthCompleted, LP_CE_OAuthCompleted, SigninMenuEmailVerified, SigninModalTrack, signInUser, signUpProperties, UpgradeSignInPopupEmailAdded, Wallet_CE_OAuthCompleted, WhaleCreateAccountEmailVerified, WhalePopupEmailVerified } from "../../utils/AnalyticsFunctions";
import { FeedbackType } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import postLoginInstance from './../../utils/PostLoginAxios';
import { PAGE_POPUP, SET_DEFAULT_VALUE, WALLET_LIST_UPDATED } from "./ActionTypes";

export const loginApi = (ctx, data) => {
  preLoginInstance.post('common/test/temp-login', data)
    .then(res => {
      // console.log('res',res);
      if (!res.data.error) {
        // console.log('res', res.data.data.token);
        console.log('ctx');
        localStorage.setItem('currency',JSON.stringify({
          active: true,
          code: "USD",
          id: "6399a2d35a10114b677299fe",
          name: "United States Dollar",
          symbol: "$",
          rate: 1,
      }))
        localStorage.setItem('lochToken', res.data.data.token);
        if(ctx.state.link && ctx.state.id){
          ctx.props.getAllCoins(ctx.handleShareLinkUser)
        } else{
          ctx.props.history.push('/welcome');
        }

      } else {
        toast.error(res.data.message || "Something went wrong");
        ctx.setState({
          errorMessage: res.data.message || "Invalid Credentials"
        });
      }
    })
    .catch(err => {
      ctx.setState({
        errorMessage: "Something went wrong"
      });
    });
}

export const fixWalletApi = (ctx,info) =>{
      postLoginInstance.post("organisation/user/update-user",info)
      .then((res)=>{
        if(!res.data.error){
          ctx.handleRedirection();
          // ctx.props.history.push('/welcome');
        }
        else{
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err)=>{
        console.log("fixwallet",err)
      })
}

export const updateUserWalletApi = (data,ctx) =>{
  postLoginInstance.post("organisation/user/update-user-wallet",data)
  .then((res)=>{
    if(!res.data.error){

      // const allChains = getState().OnboardingState.coinsList;
      const allChains = ctx.props.OnboardingState.coinsList
      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log("res", apiResponse)
      for (let i = 0; i < apiResponse.user.user_wallets.length; i++){
        let obj = {}; // <----- new Object
        obj['address'] = apiResponse.user.user_wallets[i].address;
        obj['displayAddress'] = apiResponse.user.user_wallets[i]?.display_address;
        
        // const chainsDetected = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains;

          const chainsDetected =
            apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
              ?.chains ||
            apiResponse.wallets[
              apiResponse.user?.user_wallets[i]?.address.toLowerCase()
            ]?.chains;
        
              obj['coins'] = allChains.map((chain)=>{
                let coinDetected = false;
                chainsDetected.map((item)=>{
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
              obj['wallet_metadata']= apiResponse.user.user_wallets[i].wallet;
              obj['id'] = `wallet${i+1}`;
        // obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;
        let chainLength =
          apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
            ?.chains?.length ||
          apiResponse.wallets[
            apiResponse.user?.user_wallets[i]?.address.toLowerCase()
          ]?.chains?.length;
        obj["coinFound"] = chainLength > 0 ? true : false;
        
        obj["nickname"] = apiResponse.user.user_wallets[i]?.nickname;
         obj["showAddress"] =
           apiResponse.user.user_wallets[i]?.nickname === "" ? true : false;
         obj["showNickname"] =
           apiResponse.user.user_wallets[i]?.nickname !== "" ? true : false;
              newAddWallet.push(obj);
      }
      // console.log('newAddWallet',newAddWallet);
      localStorage.setItem("addWallet", JSON.stringify(newAddWallet))
      ctx.state.changeList && ctx.state.changeList(newAddWallet);
      if (ctx.props.apiResponse) {
        // ctx.setState({
        //    recievedResponse: true
        // })
        ctx.props.apiResponse(true);
        
      }
     
      if (ctx.props.handleUpdateWallet) {
        ctx.props.handleUpdateWallet()
        
      }
      if (ctx.state.pageName == "Landing Page") {
        ctx.props.history.push("/home")
      } else {
         ctx.props.history.push({
           pathname: ctx.props.pathName,
           state: { addWallet: JSON.parse(localStorage.getItem("addWallet")) },
         });
      }
     

      

     
    } else{
      toast.error(res.data.message || "Something went wrong");
    }
  })
  .catch((err)=>{
    console.log("fixwallet",err)
  })
}

export const verifyEmailApi = (ctx, data) =>{
  preLoginInstance
  .post("organisation/user/verify-email", data)
  .then((res)=>{
    if(!res.data.error){
      ctx.setState({error: false});
    } else{
      ctx.setState({error: true});
    }
  })
  .catch((err)=>{
    console.log("fixwallet",err)
  })
}

export const getDetectedChainsApi = (ctx) =>{
  postLoginInstance.post("wallet/user-wallet/get-detected-chains")
  .then((res)=>{
    if(!res.data.error){
      // console.log('res',res);
      // CHAIN LIST
      //
      ctx.setState({
        total_addresses: res.data.data.total_wallet_addresses,
      });
      
      
      let chainList = [];
      ctx.props.OnboardingState.coinsList.map((item)=>{
          return(chainList.push({
            coinCode: item.code,
            coinSymbol: item.symbol,
            coinName: item.name,
            chain_detected: false,
            coinColor: item.color
          }))
        })
      // console.log('chainList',chainList);
      let addWallet = JSON.parse(localStorage.getItem("addWallet"));
  let totalChainDetechted = 0;
      addWallet = addWallet?.map(e => ({...e, apiAddress: e.address}))
      // console.log('addWallet',addWallet);
      let xyz = Object.keys(res.data.data.chains).map((chain)=>({
        address: chain,
        display_address: res.data.data.chains[chain].display_address,
        chains: res.data.data.chains[chain].chains
      }))
      // console.log("addwallet", xyz, res.data.data.chains);
      addWallet?.map((wallet)=>{
        let userWallet = null;
        let coinFound = false;
        xyz.map((item)=>{
          if (
            item.address === wallet.address ||
            item.address === wallet.address.toLowerCase() ||
            item.display_address === wallet.address
          ) {
            userWallet = item;
          }
        })

        // console.log("chain", userWallet);
      
        let chainsDetected = chainList.map((chain)=>{
          let dummyChain = {...chain}
          let isDetected = false;
          userWallet?.chains?.map((userChain)=>{
            if(userChain.code === dummyChain.coinCode){
              isDetected = true;
              coinFound = true;
              totalChainDetechted = totalChainDetechted + 1;
            }
          })
          dummyChain.chain_detected = isDetected;
          return dummyChain
        });
        wallet.coinFound = coinFound
      wallet.coins = chainsDetected
      })
    
      ctx.setState({
        addWalletList:
          addWallet.length > 0
            ? addWallet
            : [
                {
                  id: `wallet${addWallet.length + 1}`,
                  address: "",
                  coins: [],
                  displayAddress: "",
                  wallet_metadata: {},
                  showAddress: true,
                  showNickname: true,
                  nickname: "",
                  apiAddress: "",
                },
              ],
        chainLoader: false,
        totalChainDetechted: totalChainDetechted,
      });
      addWallet && addWallet.length > 0 && localStorage.setItem('addWallet', JSON.stringify(addWallet))
    } else{
      toast.error(res.data.message || "Something went wrong");
    }
  })
   .catch((err)=>{
    console.log("fixwallet",err)
  })
}

export const exportDataApi = (data,ctx) =>{
  postLoginInstance.post(ctx.state.selectedExportItem.apiurl,data)
  .then((res)=>{
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    // link.setAttribute('download', 'file.txt');
    link.setAttribute('download', `${ctx.state.selectedExportItem.fileName}-${moment(ctx.state.fromDate).format("ll")}-${moment(ctx.state.toDate).format("ll")}.csv`);
    document.body.appendChild(link);
    link.click();
    ctx.setState({
      loadingExportFile:false,
    })
  })
  .catch((err)=>{
    ctx.setState({
      loadingExportFile:false,
    })
    console.log("Catch", err);
  })
}

export const sendFeedbackApi = (data, ctx) => {
  postLoginInstance
    .post("common/master/send-feedback", data)
    .then((res) => {
      ctx.props.onHide();
      toast.success("Thank you very much for your feedback");
      // ctx.setState({
      //   ...(type === FeedbackType.POSITIVE ? {favorite: "Thank you very much for your feedback"} : {worst: "Thank you very much for your feedback"}),
      // });
      // setTimeout(function(){
      //   ctx.setState({
      //     ...(type === FeedbackType.POSITIVE ? {favorite: ""} : {worst: ""}),
      //     ...(type === FeedbackType.POSITIVE ? {disabledFav: false} : {disabled: false}),
      //   });
      // }, 4000)
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllCurrencyApi = (setAllCurrencyList) =>{
  postLoginInstance.post("common/master/get-all-currencies")
  .then((res)=>{
    if(!res.data.error){
      // console.log('set');
      setAllCurrencyList(res.data.data.currencies)
    } else{
      toast.error(res.data.message || "Something went wrong");
    }
  })
  .catch((err)=>{
    console.log('err',err);
  })
}
export const getAllCurrencyRatesApi = () =>{
  postLoginInstance.post("common/master/get-currency-rates")
  .then((res)=>{
    if(!res.data.error){
      let currency = JSON.parse(localStorage.getItem("currency")) || {
        active: true,
        code: "USD",
        id: "6399a2d35a10114b677299fe",
        name: "United States Dollar",
        symbol: "$",
        rate: 1,
      };

      for (const [key, value] of Object.entries(res.data.data.rates.rates)) {
        // console.log(`${key}: ${value}`);
        if(key === currency?.code){
          currency = {
            ...currency,
            rate: value
          }
        }
      }
      localStorage.setItem('currency',JSON.stringify(currency))
      localStorage.setItem('currencyRates',JSON.stringify(res.data.data.rates))
    } else{
      toast.error(res.data.message || "Something went wrong");
    }
  })
  .catch((err)=>{
    console.log('err',err);
  })
}

// Send Email OTP from whale pod

export const SendOtp = (data,ctx) => {
  postLoginInstance
    .post("organisation/user/send-email-otp", data)
    .then((res) => {
      if (!res.data.error) {
        // console.log("res", res.data);
        let otp = res.data.data.opt_token;
        ctx.setState({
          isShowOtp: true,
          isEmailNotExist: res.data.data.is_new_user,
          modalTitle: "Verify email",
          modalDescription: ctx?.props?.stopUpdate
            ? "Enter the verification code sent to your email to sign in your account"
            : res.data.data.is_new_user
            ? "Enter the verification code sent to your email to save the wallets and pods to your account"
            : "Enter the verification code sent to your email to update the existing wallets and pods for your account",
        });
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// Verify email

export const VerifyEmail = (data,ctx) => {
  postLoginInstance
    .post("organisation/user/verify-otp-code", data)
    .then((res) => {
      if (!res.data.error) {
        let isOptValid = res.data.data.otp_verified;
        let token = res.data.data.token;
      
        //  localStorage.setItem(
        //    "currentPlan",
        //    JSON.stringify(res.data.data?.current_plan)
        //  );
        localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...res.data.data?.current_plan,
            influencer_pod_limit:
              res.data.data?.current_plan.name === "Free" ? 1 : -1,
          })
        );
        localStorage.setItem("lochToken", token);
        const userId = localStorage.getItem("lochDummyUser");

        // reset redux
          ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
        // if (res.data.data.is_new_user) {
        //   signUpProperties({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });
          
        // } else {
          
        //   signInUser({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });
        // }
       

        // signin popup general
        // SigninModalTrack({
        //   session_id: getCurrentUser().id,
        //   email_address: res.data.data.user?.email,
        //   from: ctx.props.tracking,
        // });

        // Analytics
         let track = ctx.props.tracking;
        if (ctx.props.tracking === "Sign in button") {
          SigninMenuEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
           
        } else if (ctx.props.tracking === "Whale watching") {
          WhalePopupEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
          
        } else if (ctx.props.tracking === "Wallet connect exchange") {
          ConnectExEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
           
        } else if (ctx.props.tracking === "Home connect exchange") {
          ConnectExEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
          
        } else if ((ctx.props.tracking = "Upgrade sign in popup")) {
          UpgradeSignInPopupEmailAdded({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
        }
          if (ctx.props?.popupType === "general_popup") {
            //
            GeneralPopupEmailVerified({
              session_id: getCurrentUser().id,
              email_added: res.data.data.user?.email,
              from: ctx.props?.tracking,
            });
            track = "generic pop up";
          }
        
        if (ctx?.state?.tracking === "Create or sign in from Upgrade pop up") {
          track = ctx?.state?.tracking;
        }
          signInUser({
            email_address: res.data.data.user?.email,
            userId: res.data.data.user?.link,
            first_name: res.data.data.user?.first_name,
            last_name: res.data.data.user?.last_name,
            track: track,
          });
          ctx.setState(
            {
              isOptInValid: false,
            },
            () => {
              if (ctx.props.stopUpdate) {
                localStorage.removeItem("lochDummyUser");
                let obj = JSON.parse(localStorage.getItem("lochUser"));
                obj = {
                  ...obj,
                  first_name: res.data.data.user?.first_name,
                  last_name: res.data.data.user?.last_name,
                  email: res.data.data.user?.email,
                  mobile: res.data.data.user?.mobile,
                  link: res.data.data.user?.link,
                };

                localStorage.setItem("lochUser", JSON.stringify(obj));

                const allChains = ctx.props.OnboardingState.coinsList;
                let addWallet = [];
                const apiResponse = res.data.data;
                for (
                  let i = 0;
                  i < apiResponse?.user?.user_wallets?.length;
                  i++
                ) {
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
                    apiResponse.wallets[
                      apiResponse?.user?.user_wallets[i]?.address
                    ]?.chains ||
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
                  obj["wallet_metadata"] =
                    apiResponse?.user?.user_wallets[i]?.wallet;
                  obj["id"] = `wallet${i + 1}`;

                  let chainLength =
                    apiResponse.wallets[
                      apiResponse?.user?.user_wallets[i]?.address
                    ]?.chains?.length ||
                    apiResponse.wallets[
                      apiResponse?.user?.user_wallets[i]?.address.toLowerCase()
                    ]?.chains?.length;

                  obj["coinFound"] = chainLength > 0 ? true : false;

                  obj["nickname"] =
                    apiResponse?.user?.user_wallets[i]?.nickname;
                  obj["showAddress"] =
                    apiResponse?.user?.user_wallets[i]?.nickname === ""
                      ? true
                      : false;
                  obj["showNickname"] =
                    apiResponse?.user?.user_wallets[i]?.nickname !== ""
                      ? true
                      : false;
                  obj["apiAddress"] =
                    apiResponse?.user?.user_wallets[i]?.address;

                  addWallet.push(obj);
                }
                localStorage.setItem("addWallet", JSON.stringify(addWallet));

                setTimeout(() => {
                  ctx.state.onHide();
                  // console.log("reload")
                  window.location.reload();
                }, 1000);
              } else {
                if (userId) {
                  // for whale watach it will overwirte data
                  let userdata = new URLSearchParams();
                  userdata.append("old_user_id", userId);
                  UpdateUserDetails(userdata, ctx);
                } else {
                  let obj = JSON.parse(localStorage.getItem("lochUser"));
                  obj = {
                    ...obj,
                    first_name: "",
                    last_name: "",
                    email: res.data.data.user?.email,
                    mobile: "",
                    link: res.data.data.user?.link,
                  };
                  localStorage.setItem("lochUser", JSON.stringify(obj));

                  // update wallet
                  const apiResponse = res.data.data;
                  if (apiResponse?.user) {
                    let newAddWallet = [];
                    const allChains = ctx.props.OnboardingState.coinsList;
                    // console.log("res ", apiResponse)
                    for (
                      let i = 0;
                      i < apiResponse.user?.user_wallets?.length;
                      i++
                    ) {
                      let obj = {}; // <----- new Object
                      obj["address"] =
                        apiResponse.user?.user_wallets[i].address;
                      obj["displayAddress"] =
                        apiResponse.user?.user_wallets[i]?.display_address;
                      obj["wallet_metadata"] =
                        apiResponse.user?.user_wallets[i].wallet;
                      obj["id"] = `wallet${i + 1}`;

                      // const chainsDetected =
                      //   apiResponse.wallets[
                      //     apiResponse.user?.user_wallets[i].address
                      //   ].chains;
                      const chainsDetected =
                        apiResponse.wallets[
                          apiResponse?.user?.user_wallets[i]?.address
                        ]?.chains ||
                        apiResponse.wallets[
                          apiResponse.user?.user_wallets[
                            i
                          ]?.address.toLowerCase()
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

                      // obj["coinFound"] =
                      //   apiResponse.wallets[
                      //     apiResponse.user?.user_wallets[i].address
                      //   ].chains.length > 0
                      //     ? true
                      //     : false;
                      let chainLength =
                        apiResponse.wallets[
                          apiResponse.user?.user_wallets[i]?.address
                        ]?.chains?.length ||
                        apiResponse.wallets[
                          apiResponse.user?.user_wallets[
                            i
                          ]?.address.toLowerCase()
                        ]?.chains?.length;
                      obj["coinFound"] = chainLength > 0 ? true : false;

                      obj["nickname"] =
                        apiResponse.user?.user_wallets[i]?.nickname;
                      obj["showAddress"] =
                        apiResponse.user?.user_wallets[i]?.nickname === ""
                          ? true
                          : false;
                      obj["showNickname"] =
                        apiResponse.user?.user_wallets[i]?.nickname !== ""
                          ? true
                          : false;
                      obj["apiAddress"] =
                        apiResponse.user?.user_wallets[i]?.address;

                      newAddWallet.push(obj);
                    }

                    localStorage.setItem(
                      "addWallet",
                      JSON.stringify(newAddWallet)
                    );
                  }

                  if (ctx.AddEmailModal) {
                    // for upgrade
                    ctx.AddEmailModal();
                  } else {
                    ctx.state.onHide();
                  }
                }
              }
            }
          );

        // console.log("user id ", userId)
      } else if (res.data.error === true) {
        // invalid otp
        ctx.setState({
          isOptInValid: true,
        });
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};



// Update user details

export const UpdateUserDetails = (data,ctx) => {
  postLoginInstance
    .post("organisation/user/update-user-details", data)
    .then((res) => {
      if (!res.data.error) {
        // Analytics
        WhaleCreateAccountEmailVerified({
          session_id: res.data.data.user.link,
          email_address: res.data.data.user.email
            ? res.data.data.user.email
            : ctx.state.email,
        });
        // localStorage.setItem("lochDummyUser", null);g
        localStorage.removeItem("lochDummyUser");
        let obj = JSON.parse(localStorage.getItem("lochUser"));
        obj = {
          ...obj,
          first_name: ctx.state.firstName,
          last_name: ctx.state.lastName,
          email: res.data.data.user.email
            ? res.data.data.user.email
            : ctx.state.email,
          mobile: ctx.state.mobileNumber,
          link: res.data.data.user.link,
        };
        localStorage.setItem("lochUser", JSON.stringify(obj));
        // toast.success(" Your wallets and pods has been saved");
        if (ctx.AddEmailModal) {
// for upgrade
          ctx.AddEmailModal()
        } else {
        
           ctx.state.onHide();
        };
       
      } 
    })
    .catch((err) => {
      console.log("err", err);
    });
};


// get-all-plans
export const GetAllPlan = () => {
  postLoginInstance
    .post("commerce/plan/get-all-plans")
    .then((res) => {
      if (!res.data.error) {
        // Analytics
       
        localStorage.setItem("Plans", JSON.stringify(res.data.data.plans));
        // toast.success(" Your wallets and pods has been saved");

      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

export const GetDefaultPlan = () => {
  postLoginInstance
    .post("commerce/plan/get-default-plan")
    .then((res) => {
      if (!res.data.error) {
        // Analytics

        localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...res.data.data.plan,
            influencer_pod_limit: res.data.data.plan.name === "Free" ? 1 : -1,
          })
        );
       
        // toast.success(" Your wallets and pods has been saved");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};


// get-all-plans
export const CreatePyment = (data,ctx) => {
  postLoginInstance
    .post("commerce/payment/create-payment", data)
    .then((res) => {
      if (!res.data.error) {
        // Analytics
        ctx.setState({
          payment_link: res.data.data.payment.payment_url,
        });
        
        // toast.success(" Your wallets and pods has been saved");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};



export const getUser = (ctx = null, showToast = false) => {
  
  postLoginInstance.post("organisation/user/get-user").then((res) => {
    if (!res.data.error) {
      // localStorage.setItem(
      //   "currentPlan",
      //   JSON.stringify(res.data.data.current_plan)
      // );
      localStorage.setItem(
        "currentPlan",
        JSON.stringify({
          ...res.data.data.current_plan,
          influencer_pod_limit:
            res.data.data.current_plan.name === "Free" ? 1 : -1,
        })
      );
        // console.log(ctx,showToast)
      if (ctx?.props?.location?.search === "?status=success" || showToast === true) {
        
        toast.success(
          <div
            style={{
              width: "38rem",
            }}
          >
            {res.data.data.current_plan.name === "Trial"
              ? `Congratulations you’re a sovereign for a day!`
              : `Congratulations! You’re
            officially a ${res.data.data.current_plan.name}.`}
          </div>
        );
        if (showToast) {
          
        }else
        {
           ctx.props.history.replace("/home");
       }
      }
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};



export const GetAuthUrl = (data,ctx) => {
  postLoginInstance.post("organisation/user/get-authorize-url",data).then((res) => {
    if (!res.data.error) {

      ctx.setState({
        AuthUrl: res?.data?.data?.url
      })
     
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};


export const updateAccessToken = (data, ctx, name) => {
  // console.log("this",name)
  postLoginInstance
    .post("organisation/user/update-access-token", data)
    .then((res) => {
      if (!res.data.error) {
        // ctx.setState({
        //   AuthUrl: res?.data?.data?.url,
        // });
           if (ctx.props.tracking === "home page") {
             Home_CE_OAuthCompleted({
               session_id: getCurrentUser().id,
               email_address: getCurrentUser().email,
               exchange_name: name,
             });
           } else if (ctx.props.tracking === "landing page") {
             LP_CE_OAuthCompleted({
               session_id: getCurrentUser().id,
               email_address: getCurrentUser().email,
               exchange_name: name,
             });
           } else if (ctx.props.tracking === "wallet page") {
             Wallet_CE_OAuthCompleted({
               session_id: getCurrentUser().id,
               email_address: getCurrentUser().email,
               exchange_name: name,
             });
           }
          ctx.setState({
            isLoadingbtn: false,
          });
        if (ctx.props.ishome) {
            toast.success(`${name} connected to loch`);
           ctx.handleUpdateList();
           setTimeout(() => {
            //  ctx.props.handleBackConnect(ctx.state.connectExchangesList);
             ctx.handleBack();
            //  toast.success(`${name} connected to loch`);
           }, 200);
         } else {
          toast.success(`${name} connected to loch`);
           ctx.state.onHide();
           // window.location.reload();
           setTimeout(() => {
             ctx.props.setPageFlagDefault();
             ctx.props?.handleUpdate && ctx.props.handleUpdate();
             ctx.props.openPopup();
           }, 1000);
         }

      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


// api page flage

export const updateWalletListFlag = (page, status) => {
  let payload = {}
  payload[page] = status;
  return function (dispatch, getState) {
    dispatch({
      type: WALLET_LIST_UPDATED,
      payload: {...payload},
    });
  }
};


// set app flags to false

export const setPageFlagDefault = () => {
  return function (dispatch, getState) {
    dispatch({
      type: SET_DEFAULT_VALUE,
    });
  }
};

// export const PopupState = () => {
//   return function (dispatch, getState) {
//     console.log("ds")
//     dispatch({
//       type: PAGE_POPUP,
//       payload:false
//     });
//   }
// }


// Update crypto payment
export const UpdateCryptoPayment = (data, ctx, userFunction = null) => {

  postLoginInstance
    .post("commerce/payment/update-user-crypto-payment", data)
    .then((res) => {
      if (!res.data.error) {
       
        userFunction();
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


// Signin Wallet
export const SigninWallet = (data, ctx, userFunction = null) => {

  postLoginInstance
    .post("organisation/user/signin-with-wallet", data)
    .then((res) => {
      if (!res.data.error) {
  let token = res.data.data.token;
        //  localStorage.setItem(
        //    "currentPlan",
        //    JSON.stringify(res.data.data?.current_plan)
        //  );
        localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...res.data.data?.current_plan,
            influencer_pod_limit:
              res.data.data?.current_plan.name === "Free" ? 1 : -1,
          })
        );
         localStorage.setItem("lochToken", token);
         const userId = localStorage.getItem("lochDummyUser");

         // reset redux
         ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
         // if (res.data.data.is_new_user) {
         //   signUpProperties({
         //     email_address: res.data.data.user?.email,
         //     userId: res.data.data.user?.link,
         //     first_name: res.data.data.user?.first_name,
         //     last_name: res.data.data.user?.last_name,
         //   });

         // } else {

         //   signInUser({
         //     email_address: res.data.data.user?.email,
         //     userId: res.data.data.user?.link,
         //     first_name: res.data.data.user?.first_name,
         //     last_name: res.data.data.user?.last_name,
         //   });
         // }
         signInUser({
           email_address: res.data.data.user?.email,
           userId: res.data.data.user?.link,
           first_name: res.data.data.user?.first_name,
           last_name: res.data.data.user?.last_name,
          //  track:"metamask wallet"
         });
         // signin popup
        //  SigninModalTrack({
        //    session_id: getCurrentUser().id,
        //    email_address: res.data.data.user?.email,
        //    from: ctx.props.tracking,
        //  });
         if (ctx.props.stopUpdate) {
           localStorage.removeItem("lochDummyUser");
           let obj = JSON.parse(localStorage.getItem("lochUser"));
           obj = {
             ...obj,
             first_name: res.data.data.user?.first_name,
             last_name: res.data.data.user?.last_name,
             email: res.data.data.user?.email,
             mobile: res.data.data.user?.mobile,
             link: res.data.data.user?.link,
           };

           localStorage.setItem("lochUser", JSON.stringify(obj));

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
             obj["wallet_metadata"] =
               apiResponse?.user?.user_wallets[i]?.wallet;
             obj["id"] = `wallet${i + 1}`;

             let chainLength =
               apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                 ?.chains?.length ||
               apiResponse.wallets[
                 apiResponse?.user?.user_wallets[i]?.address.toLowerCase()
               ]?.chains?.length;

             obj["coinFound"] = chainLength > 0 ? true : false;

             obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
             obj["showAddress"] =
               apiResponse?.user?.user_wallets[i]?.nickname === ""
                 ? true
                 : false;
             obj["showNickname"] =
               apiResponse?.user?.user_wallets[i]?.nickname !== ""
                 ? true
                 : false;
             obj["apiAddress"] = apiResponse?.user?.user_wallets[i]?.address;

             addWallet.push(obj);
           }
           localStorage.setItem("addWallet", JSON.stringify(addWallet));

           setTimeout(() => {
             ctx.state.onHide();
             // console.log("reload")
             window.location.reload();
           }, 1000);
         } else {
           if (userId) {
             let userdata = new URLSearchParams();
             userdata.append("old_user_id", userId);
             UpdateUserDetails(userdata, ctx);
           } else {
             let obj = JSON.parse(localStorage.getItem("lochUser"));
             obj = {
               ...obj,
               first_name: "",
               last_name: "",
               email: res.data.data.user?.email,
               mobile: "",
               link: res.data.data.user?.link,
             };
             localStorage.setItem("lochUser", JSON.stringify(obj));

             // update wallet
             const apiResponse = res.data.data;
             if (apiResponse?.user) {
               let newAddWallet = [];
               const allChains = ctx.props.OnboardingState.coinsList;
               // console.log("res ", apiResponse)
               for (
                 let i = 0;
                 i < apiResponse.user?.user_wallets?.length;
                 i++
               ) {
                 let obj = {}; // <----- new Object
                 obj["address"] = apiResponse.user?.user_wallets[i].address;
                 obj["displayAddress"] =
                   apiResponse.user?.user_wallets[i]?.display_address;
                 obj["wallet_metadata"] =
                   apiResponse.user?.user_wallets[i].wallet;
                 obj["id"] = `wallet${i + 1}`;

                 // const chainsDetected =
                 //   apiResponse.wallets[
                 //     apiResponse.user?.user_wallets[i].address
                 //   ].chains;
                 const chainsDetected =
                   apiResponse.wallets[
                     apiResponse?.user?.user_wallets[i]?.address
                   ]?.chains ||
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

                 // obj["coinFound"] =
                 //   apiResponse.wallets[
                 //     apiResponse.user?.user_wallets[i].address
                 //   ].chains.length > 0
                 //     ? true
                 //     : false;
                 let chainLength =
                   apiResponse.wallets[
                     apiResponse.user?.user_wallets[i]?.address
                   ]?.chains?.length ||
                   apiResponse.wallets[
                     apiResponse.user?.user_wallets[i]?.address.toLowerCase()
                   ]?.chains?.length;
                 obj["coinFound"] = chainLength > 0 ? true : false;

                 obj["nickname"] = apiResponse.user?.user_wallets[i]?.nickname;
                 obj["showAddress"] =
                   apiResponse.user?.user_wallets[i]?.nickname === ""
                     ? true
                     : false;
                 obj["showNickname"] =
                   apiResponse.user?.user_wallets[i]?.nickname !== ""
                     ? true
                     : false;
                 obj["apiAddress"] = apiResponse.user?.user_wallets[i]?.address;

                 newAddWallet.push(obj);
               }

               localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
             }

             if (userFunction) {
               userFunction();
             } else {
              //  console.log("whale");
               ctx.state.onHide();
             }
           }
         }
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


// Update crypto payment
export const CreateUserLandingPage = (data, ctx) => {

  postLoginInstance.post("organisation/user/signup", data).then((res) => {
    if (!res.data.error) {
      // userFunction();
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};