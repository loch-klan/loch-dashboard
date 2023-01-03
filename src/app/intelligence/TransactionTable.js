import React from 'react'

import CustomTable from './../../utils/commonComponent/CustomTable';
import { GraphHeader } from '../common/GraphHeader'
import ArrowRight from '../../assets/images/icons/ArrowRight.svg'
import ActivePrevBtn from '../../assets/images/icons/ActivePrevBtn.svg'
import ActiveNextBtn from '../../assets/images/icons/ActiveNextBtn.svg'
import InactivePrevBtn from '../../assets/images/icons/InactivePrevBtn.svg'
import transactionTableImage from "../../assets/images/transactionTableImage.png"
import Loading from '../common/Loading';
import { TransactionHistoryHover } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
function TransactionTable(props) {
    return (
      <div className="transaction-table-section">
        {props.title ? (
          <GraphHeader
            title={props.title}
            subtitle={props.subTitle}
            isArrow={true}
            handleClick={props.handleClick}
            isAnalytics="Transaction Table"
          />
        ) : (
          ""
        )}
        <CustomTable
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
          message={"No transactions found"}
          isLoading={props.isLoading}
        />
      </div>
    );
}

export default TransactionTable
