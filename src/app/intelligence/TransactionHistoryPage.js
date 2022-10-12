import React from 'react'
import { Button, Form, Image } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import DropDown from './../common/DropDown';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import TableData from './DummyTableData.js'
import CommonTable from '../common/CommonTable';
import { CommonPagination } from '../common/CommonPagination';
import CustomTable from './../../utils/commonComponent/CustomTable';


export const TransactionHistoryPage = () => {

  const fillters = ["This year", "All assets", "All methods"]
  const fillter_tabs = fillters.map((e) => {
    return <DropDown
      id="dropdown-transaction-fillter-tab"
      title={e}
      list={[1, 2, 3]}
    />

  })
  return (
    <div className="history-table-section ">
      <PageHeader
        title={"Transaction history"}
        subTitle={"Valuable insights based on your assets"}
        showpath={true}
      />

      <div className='fillter_tabs_section'>
        {fillter_tabs}
          <Form className="searchBar">
          <Image src={searchIcon} />
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </Form>
      </div>
      <CustomTable
        tableData={TableData.table_data}
        columnList={TableData.columnList}
      />
      <CommonPagination
        numOfPages={3}
      // setValue={setPage}
      />



    </div>
  )
}
