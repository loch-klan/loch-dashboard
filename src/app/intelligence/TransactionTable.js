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
          noSubtitleBottomPadding={props.noSubtitleBottomPadding}
          isLoading={props.isLoading}
          disableOnLoading={props.disableOnLoading}
          title={props.title}
          subtitle={props.subTitle}
          isArrow={props.isArrow}
          handleClick={props.handleClick}
          isAnalytics={props?.isAnalytics ? props?.isAnalytics : ""}
          isGainLoss={props.isGainLoss}
          ishideDust={props.ishideDust}
          showDust={props.showDust}
          handleDust={props.handleDust}
          totalPercentage={props.totalPercentage}
          handleExchange={props.handleExchange}
        />
      ) : (
        ""
      )}
      <CustomTable
        openSignInOnclickModal={props.openSignInOnclickModal}
        xAxisScrollable={props.xAxisScrollable}
        yAxisScrollable={props.yAxisScrollable}
        onBlurSignInClick={props.onBlurSignInClick}
        moreData={props.moreData}
        showDataAtBottom={props.showDataAtBottom}
        moreDataHandleClick={props.handleClick}
        bottomCombiedValues={props.bottomCombiedValues}
        combinedCostBasis={props.combinedCostBasis}
        combinedCurrentValue={props.combinedCurrentValue}
        combinedUnrealizedGains={props.combinedUnrealizedGains}
        combinedReturn={props.combinedReturn}
        pageLimit={props.pageLimit}
        changePageLimit={props.changePageLimit}
        isSmartMoney={props.isSmartMoney}
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
          props.title === "Unrealized profit and loss"
            ? "No unrealized profit and loss found"
            : props?.message
            ? props?.message
            : "No transactions found"
        }
        isLoading={props.isLoading}
        addWatermark={props.addWatermark}
        addWatermarkMoveUp={props.addWatermarkMoveUp}
        onPageChange={props.onPageChange}
        isMiniversion={props.isMiniversion}
        // isStickyHead={props?.isStickyHead}
        smartMoneyBlur={props.smartMoneyBlur}
        blurButtonClick={props.blurButtonClick}
      />
    </div>
  );
}

export default TransactionTable;
