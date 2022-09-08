import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";

export const loginApi = (ctx, data) => {
  preLoginInstance.post('common/test/temp-login', data)
    .then(res => {
      console.log('res',res);
      if (!res.data.error) {
        console.log('res', res.data.data);
        console.log('ctx',ctx);
        localStorage.setItem('lochToken', res.data.data.token);
        ctx.props.history.push('/home');
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
// export const resetPasswordApi = (ctx, data) => {
//   preLoginInstance
//     .post("organisation/user/set-reset-password", data)
//     .then((res) => {
//       toast.success(res.data.message || "Password set successfully");
//       ctx.props.history.push("/login");
//     })
//     .catch((err) => {
//       console.log("Catch", err);
//     });
// };

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
