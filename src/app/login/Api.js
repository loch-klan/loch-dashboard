import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";

// LOGIN
export const loginApi = (ctx, data) => {
  preLoginInstance.post('/organisation/user/login', data)
    .then(res => {
      if (!res.data.error) {
        console.log('res', res);
        localStorage.setItem('userDetails', JSON.stringify(res.data.data.user_details));
        ctx.props.history.push('/profile');
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