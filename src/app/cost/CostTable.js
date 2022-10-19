import React from 'react'
import PageHeader from '../common/PageHeader';
import TableData from './DummyTableData.js'
import CustomTable from './../../utils/commonComponent/CustomTable';
import { GraphHeader } from '../common/GraphHeader'

function CostTable(props){

  return (
    <div className="cost-table-section ">
      <GraphHeader
        title={props.title}
        subtitle={props.subTitle}
        />

      <CustomTable
        tableData={props.tableData}
        columnList={props.columnList}
      />
      
    </div>
  )
}

export default CostTable
