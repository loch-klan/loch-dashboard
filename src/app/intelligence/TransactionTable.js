import React from 'react'

import CustomTable from './../../utils/commonComponent/CustomTable';
import { GraphHeader } from '../common/GraphHeader'
import ArrowRight from '../../assets/images/icons/ArrowRight.svg'
import ActivePrevBtn from '../../assets/images/icons/ActivePrevBtn.svg'
import ActiveNextBtn from '../../assets/images/icons/ActiveNextBtn.svg'
import InactivePrevBtn from '../../assets/images/icons/InactivePrevBtn.svg'
function TransactionTable(props) {
    return (
        <div className="transaction-table-section">

            {props.title ? <GraphHeader
                title={props.title}
                subtitle={props.subTitle}
                isArrow={true}
                handleClick={props.handleClick}
            />
                :
                ""
            }

            <CustomTable
                className="transaction-table"
                tableData={props.tableData}
                columnList={props.columnList}
                headerHeight={props.headerHeight}
                totalPage={props.totalPage}
                history={props.history}
                location={props.location}
                currentPage={props.page}
                pagePrev={props.page === 0 ? InactivePrevBtn : ActivePrevBtn}
                pageNext={ActiveNextBtn}
                message={"No transactions found"}
            />

        </div>
    )
}

export default TransactionTable
