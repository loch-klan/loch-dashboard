import React from 'react'

import CustomTable from './../../utils/commonComponent/CustomTable';
import { GraphHeader } from '../common/GraphHeader'
import ArrowRight from '../../assets/images/icons/ArrowRight.svg'

function TransactionTable(props) {

    return (
        <div className="transaction-table-section">

            {props.title ? <GraphHeader
                title={props.title}
                subtitle={props.subTitle}
                isArrow={true}
            />
                :
                ""
            }

            <CustomTable
                className="transaction-table"
                tableData={props.tableData}
                columnList={props.columnList}
            />

        </div>
    )
}

export default TransactionTable
