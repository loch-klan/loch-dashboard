import { toast } from "react-toastify";
import postLoginInstance from './../../utils/PostLoginAxios';
import { signInUser } from "../../utils/AnalyticsFunctions";
export const updateUser = (data,ctx) =>{
    postLoginInstance.post("organisation/user/update-user",data)
    .then((res)=>{
      if(!res.data.error){
        // console.log(data)
        let obj =  JSON.parse(localStorage.getItem("lochUser"))
        obj = {
            ...obj,
            first_name  : ctx.state.firstName,
            last_name : ctx.state.lastName,
            email : ctx.state.email,
            mobile:ctx.state.mobileNumber,
            link: ctx.state.link,
        }
        localStorage.setItem("lochUser",JSON.stringify(obj))
        // toast.success("Profile Successfully Updated");
        // console.log("ctx",ctx)
        if (ctx.props.modalType === "create_account") {
          ctx.props.isSkip();
          // ctx.state.onHide();
        } else {
          if (ctx.state.modalType === "Email") {
            toast.success(
              <div className="custom-toast-msg">
                <div>Email updated</div>
                <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                  You’ve sucessfully updated your profile
                </div>
              </div>
            );
            signInUser({
              email_address: ctx.state.email,
              track:"Email added after metamask connect"
            });
            ctx.state.onHide(true);
            
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            signInUser({
              email_address: ctx.state.email,
              userId: ctx.state.link,
              first_name: ctx.state.firstName,
              last_name: ctx.state.lastName,
              mobile: ctx.state.mobileNumber,
              track: "Profile page",
            });
            toast.success(
              <div className="custom-toast-msg">
                <div>Profile updated</div>
                <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                  You’ve sucessfully updated your profile
                </div>
              </div>
            );
          }
          
        }
       
      } else{
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err)=>{
      console.log("fixwallet",err)
    })
  }


export const ManageLink = (ctx) => {
  postLoginInstance
    .post("commerce/payment/get-manage-billing-url")
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          manageUrl: res.data?.data?.url,
        })
      }
      // console.log(data)
    })
    .catch((err) => {
      console.log("fixwallet", err);
    });
};


