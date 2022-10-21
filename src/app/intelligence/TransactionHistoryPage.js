import React from 'react'
import { Button, Form, Image } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import DropDown from './../common/DropDown';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import TableData from './DummyTableData.js'
import CommonTable from '../common/CommonTable';
import { CommonPagination } from '../common/CommonPagination';
import CustomTable from './../../utils/commonComponent/CustomTable';
import TransactionTable from './TransactionTable';
import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
export const TransactionHistoryPage = (props) => {

  const fillters = ["This year", "All assets", "All methods"]
  const fillter_tabs = fillters.map((e) => {
    return <DropDown
      id="dropdown-transaction-fillter-tab"
      title={e}
      list={[1, 2, 3]}
    />

  })

  const tableData = [
    {
        Time: "4/22",
        From: Metamask,
        To: Metamask,
        Asset: Ethereum,
        Amount: 0,
        USDValueThen: 0,
        USDValueToday: 0,
        USDTransactionFee: 1.75,
        Method: "Burn"
    },
    {
        Time: "4/22",
        From: Metamask,
        To: Metamask,
        Asset: Ethereum,
        Amount: 0,
        USDValueThen: 0,
        USDValueToday: 0,
        USDTransactionFee: 2.56,
        Method: "Mint"
    },
    {
        Time: "4/22",
        From: Metamask,
        To: Metamask,
        Asset: Ethereum,
        Amount: 0,
        USDValueThen: 0,
        USDValueToday: 0,
        USDTransactionFee: 2.56,
        Method: "Transfer"
    },
    {
        Time: "4/22",
        From: Metamask,
        To: Metamask,
        Asset: Ethereum,
        Amount: 0,
        USDValueThen: 0,
        USDValueToday: 0,
        USDTransactionFee: 2.56,
        Method: "Commit"
    },

]

const columnList = [
    {
        labelName: "Time",
        dataKey: "Time",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "Time") {
                return rowData.Time
            }
        }
    },
    {
        labelName: "From",
        dataKey: "From",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "From") {
                return (
                    <CustomOverlay
                        position="top"
                        isIcon={true}
                        isInfo={true}
                        isText={true}
                        text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                    >
                        <Image src={rowData.From} className="history-table-icon" />
                    </CustomOverlay>
                )
            }
        }
    },
    {
        labelName: "To",
        dataKey: "To",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "To") {
                return (
                    <CustomOverlay
                        position="top"
                        isIcon={true}
                        isInfo={true}
                        isText={true}
                        text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                    >
                        <Image src={rowData.To} className="history-table-icon" />
                    </CustomOverlay>
                )
            }
        }
    },
    {
        labelName: "Asset",
        dataKey: "Asset",
        coumnWidth: 130,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "Asset") {
                return (<div className='inter-display-medium f-s-13 lh-16 history-table-coin-icon'><Image src={rowData.Asset} /> Ethereum</div>)
            }
        }
    },
    {
        labelName: "Amount",
        dataKey: "Amount",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "Amount") {
                return rowData.Amount
            }
        }
    },
    {
        labelName: "USD Value Then",
        dataKey: "USDValueThen",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "USDValueThen") {
                return rowData.USDValueThen
            }
        }
    },
    {
        labelName: "USD Value Today",
        dataKey: "USDValueToday",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "USDValueToday") {
                return rowData.USDValueToday
            }
        }
    },
    {
        labelName: "USD Transaction Fee",
        dataKey: "USDTransactionFee",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "USDTransactionFee") {
                return rowData.USDTransactionFee
            }
        }
    },
    {
        labelName: "Method",
        dataKey: "Method",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "Method") {
                return (
                    <div
                        className={
                            `inter-display-medium f-s-13 lh-16 history-table-method 
                            ${rowData.Method === "Burn" ? "burn"
                                :
                                rowData.Method === "Transfer" ? "transfer"
                                :
                                rowData.Method === "Mint" ? "mint"
                                :
                                rowData.Method === "Commit" ? "commit"
                                :
                                ""
                            }`
                        }
                    >
                        {rowData.Method}
                    </div>
                )
            }
        }
    }
]
  

  return (
    <div className="history-table-section ">
      <PageHeader
        title={"Transaction history"}
        subTitle={"Valuable insights based on your assets"}
        showpath={true}
        currentPage={"Transaction History"}
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
      {/* <CustomTable
        tableData={props.table_data}
        columnList={props.columnList}
      /> */}
      <TransactionTable 
        tableData = {tableData}
        columnList = {columnList}
      />
      <CommonPagination
        numOfPages={3}
      // setValue={setPage}
      />



    </div>
  )
}
