import moment from "moment";
import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import { FeedbackType } from "../../utils/Constant";
import postLoginInstance from './../../utils/PostLoginAxios';
export const loginApi = (ctx, data) => {
  preLoginInstance.post('common/test/temp-login', data)
    .then(res => {
      // console.log('res',res);
      if (!res.data.error) {
        // console.log('res', res.data.data.token);
        // console.log('ctx',ctx.props.history);
        localStorage.setItem('lochToken', res.data.data.token);
        if(ctx.state.link){
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
      ctx.props.history.push({
        pathname: ctx.props.pathName,
        state: {addWallet: JSON.parse(localStorage.getItem("addWallet"))}
      });
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
      // console.log('addWallet',addWallet);
      let xyz = Object.keys(res.data.data.chains).map((chain)=>({
        address: chain,
        display_address: res.data.data.chains[chain].display_address,
        chains: res.data.data.chains[chain].chains
      }))
      // console.log('xyz',xyz);
      addWallet.map((wallet)=>{
        let userWallet = null;
        xyz.map((item)=>{
          if(item.address === wallet.address || item.display_address === wallet.address){
            userWallet = item
          }
        })
        let chainsDetected = chainList.map((chain)=>{
          let dummyChain = {...chain}
          let isDetected = false;
          userWallet.chains.map((userChain)=>{
            if(userChain.code === dummyChain.coinCode){
              isDetected = true
            }
          })
          dummyChain.chain_detected = isDetected;
          return dummyChain
        });
      wallet.coins = chainsDetected
      })
      // console.log('addWallet',addWallet);
      ctx.setState({addWalletList: addWallet})
      addWallet && localStorage.setItem('addWallet',JSON.stringify(addWallet))
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

export const sendFeedbackApi = (data, ctx, type) => {
  postLoginInstance
    .post("common/master/send-feedback", data)
    .then((res) => {
      ctx.setState({
        ...(type === FeedbackType.POSITIVE ? {favorite: "Thank you very much for your feedback"} : {worst: "Thank you very much for your feedback"}),
      });
      setTimeout(function(){
        ctx.setState({
          ...(type === FeedbackType.POSITIVE ? {favorite: ""} : {worst: ""}),
          ...(type === FeedbackType.POSITIVE ? {disabledFav: false} : {disabled: false}),
        });
      }, 4000)
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

// export const changePasswordApi = (ctx, data) => {
//   postLoginInstance
//     .post("organisation/user/change-password", data)
//     .then((res) => {
//       if (!res.data.error) {
//         // console.log('ctx.props', ctx.props.handleClose);
//         toast.success("Password changed successfully");
//         // ctx.props.history.push('/login');
//         ctx.props.handleClose();
//       } else {
//         toast.error(res.data.message || "Something went wrong");
//       }
//     })
//     .catch((err) => {
//       console.log("Catch", err);
//     });
// };

// export const forgotPasswordApi = (data, handleClose) => {
//   preLoginInstance
//     .post("organisation/user/forgot-password", data)
//     .then((res) => {
//       if (!res.data.error) {
//         toast.success(res.data.message || "Please check your email");
//         handleClose();
//       } else {
//         toast.error(res.data.message || "Something went wrong");
//       }
//     })
//     .catch((err) => {
//       console.log("Catch", err);
//     });
// };
