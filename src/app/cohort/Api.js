import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";

export const createCohort = (data,ctx) => {
//   let data = new URLSearchParams();
  
  postLoginInstance
    .post("wallet/user-cohort/add-update-user-cohort", data)
    .then((res) => {
        if (!res.data.error) {
        //   console.log("res cohort", res.data.data)
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};


export const searchCohort = (data,ctx) => {
    // let data = new URLSearchParams();

  postLoginInstance
    .post("wallet/user-cohort/search-user-cohort", data)
    .then((res) => {
      if (!res.data.error) {
          console.log("search cohort", res.data.data)
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};
