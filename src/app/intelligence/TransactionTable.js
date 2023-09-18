import React from "react";

import CustomTable from "./../../utils/commonComponent/CustomTable";
import { GraphHeader } from "../common/GraphHeader";
import ArrowRight from "../../assets/images/icons/ArrowRight.svg";
import ActivePrevBtn from "../../assets/images/icons/ActivePrevBtn.svg";
import ActiveNextBtn from "../../assets/images/icons/ActiveNextBtn.svg";
import InactivePrevBtn from "../../assets/images/icons/InactivePrevBtn.svg";
import transactionTableImage from "../../assets/images/transactionTableImage.png";
import Loading from "../common/Loading";
import { TransactionHistoryHover } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
function TransactionTable(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className="transaction-table-section h-100"
    >
      {props.title ? (
        <GraphHeader
          title={props.title}
          subtitle={props.subTitle}
          isArrow={props.isArrow}
          handleClick={props.handleClick}
          isAnalytics={props?.isAnalytics ? props?.isAnalytics : ""}
          isGainLoss={props.isGainLoss}
          ishideDust={props.ishideDust}
          handleDust={props.handleDust}
          totalPercentage={props.totalPercentage}
          handleExchange={props.handleExchange}
        />
      ) : (
        ""
      )}
      <CustomTable
        showHeaderOnEmpty={props.showHeaderOnEmpty}
        className={`transaction-table ${props?.className} ${
          props.comingSoon && "blur-effect"
        }`}
        tableData={props.tableData}
        columnList={props.columnList}
        headerHeight={props.headerHeight}
        totalPage={props.totalPage}
        history={props.history}
        location={props.location}
        currentPage={props.page}
        pagePrev={props.page === 0 ? InactivePrevBtn : ActivePrevBtn}
        pageNext={
          props.page === props.totalPage - 1 ? ActiveNextBtn : ActiveNextBtn
        }
        message={
          props.title === "Average cost basis"
            ? "No average cost basis found"
            : props?.message
            ? props?.message
            : "No transactions found"
        }
        isLoading={props.isLoading}
        addWatermark={props.addWatermark}
        addWatermarkMoveUp={props.addWatermarkMoveUp}
        onPageChange={props.onPageChange}
        isMiniversion={props.isMiniversion}
        topAccountBlur={props.topAccountBlur}
        blurButtonClick={props.blurButtonClick}
        // isStickyHead={props?.isStickyHead}
      />
    </div>
  );
}

export default TransactionTable;
