import { toast } from "react-toastify";
import postLoginInstance from './../../utils/PostLoginAxios';
export const updateUser = (data,ctx) =>{
    postLoginInstance.post("organisation/user/update-user",data)
    .then((res)=>{
      if(!res.data.error){
        console.log(data)
        let obj =  JSON.parse(localStorage.getItem("userDetail"))
        obj = {
            ...obj,
            first_name  : ctx.state.firstName,
            last_name : ctx.state.lastName,
            email : ctx.state.email,
            mobile:ctx.state.mobileNumber
        }
        localStorage.setItem("lochUser",JSON.stringify(obj))
        toast.success("Profile Successfully Updated");
      } else{
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err)=>{
      console.log("fixwallet",err)
    })
  }
