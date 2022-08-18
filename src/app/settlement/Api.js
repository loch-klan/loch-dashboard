import moment from "moment";
import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { API_LIMIT, START_PAGE } from "../../utils/Constant";
import { calculateTotalPageCount } from "../../utils/ReusableFunctions";

export const getSettlementReportApi = (
  ctx,
  selectedTab,
  fromDate,
  toDate,
  franchiseId,
  page = START_PAGE
) => {
  let data = new URLSearchParams();
  data.append("start", page * API_LIMIT || START_PAGE);
  data.append("limit", API_LIMIT);
  data.append("conditions", JSON.stringify([]));
  data.append("sorts", JSON.stringify([]));
  data.append("send_settled_data", selectedTab == 30 ? false : true);
  data.append("start_date", fromDate);
  data.append("end_date", toDate);
  data.append("franchise_id", franchiseId);

  return postLoginInstance
    .post("commerce/reporting/get-settlement-report", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          settlementReport: res.data.data.results,
          settlementData: res.data.data.settlement_aggregate,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong");
    });
};

export const settleFranchaiseApi = (data, handleClose) => {
  return postLoginInstance
    .post("commerce/reporting/settle-with-franchise", data)
    .then((res) => {
      if (!res.data.error) {
        handleClose();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong");
    });
};

export const getReportsFranchiseWiseApi = (data, ctx) => {
  return postLoginInstance
    .post("commerce/reporting/get-revenue-report-franchise-wise", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("res", res);
        ctx.setState({
          reportData: res.data.data.revenue_data,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong");
    });
};

export const getOrderRevenueReportApi = (data, ctx) => {
  return postLoginInstance
    .post("commerce/reporting/get-order-and-revenue-report", data)
    .then((res) => {
      if (!res.data.error) {
        console.log("res", res);
        ctx.setState({
          orderRevenueReport: res.data.data,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      toast.error(error.message || "Something went wrong");
    });
};
