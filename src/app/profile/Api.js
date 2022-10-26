import { toast } from "react-toastify";
import postLoginInstance from './../../utils/PostLoginAxios';
export const updateUser = (data,ctx) =>{
    postLoginInstance.post("organisation/user/update-user",data)
    .then((res)=>{
      if(!res.data.error){
        console.log(data)
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
        toast.success(
          <div className="custom-toast-msg">
            <div>
            Profile updated
            </div>
            <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
            You’ve sucessfully updated your profile
            </div>
          </div>
          );
      } else{
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err)=>{
      console.log("fixwallet",err)
    })
  }
