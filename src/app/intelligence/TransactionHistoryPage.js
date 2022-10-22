import React from 'react'
import { Button, Form, Image } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import DropDown from './../common/DropDown';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import { CommonPagination } from '../common/CommonPagination';
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
        time: "4/22",
        from: Metamask,
        to: Metamask,
        asset: Ethereum,
        amount: 0,
        usdValueThen: 0,
        usdValueToday: 0,
        usdTransactionFee: 1.75,
        method: "Burn"
    },
    {
        time: "4/22",
        from: Metamask,
        to: Metamask,
        asset: Ethereum,
        amount: 0,
        usdValueThen: 0,
        usdValueToday: 0,
        usdTransactionFee: 2.56,
        method: "Mint"
    },
    {
        time: "4/22",
        from: Metamask,
        to: Metamask,
        asset: Ethereum,
        amount: 0,
        usdValueThen: 0,
        usdValueToday: 0,
        usdTransactionFee: 2.56,
        method: "Transfer"
    },
    {
        time: "4/22",
        from: Metamask,
        to: Metamask,
        asset: Ethereum,
        amount: 0,
        usdValueThen: 0,
        usdValueToday: 0,
        usdTransactionFee: 2.56,
        method: "Commit"
    },

]

const columnList = [
    {
        labelName: "Time",
        dataKey: "time",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "time") {
                return rowData.time
            }
        }
    },
    {
        labelName: "From",
        dataKey: "from",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "from") {
                return (
                    <CustomOverlay
                        position="top"
                        isIcon={true}
                        isInfo={true}
                        isText={true}
                        text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                    >
                        <Image src={rowData.from} className="history-table-icon" />
                    </CustomOverlay>
                )
            }
        }
    },
    {
        labelName: "To",
        dataKey: "to",
        coumnWidth: 90,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "to") {
                return (
                    <CustomOverlay
                        position="top"
                        isIcon={true}
                        isInfo={true}
                        isText={true}
                        text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                    >
                        <Image src={rowData.to} className="history-table-icon" />
                    </CustomOverlay>
                )
            }
        }
    },
    {
        labelName: "Asset",
        dataKey: "asset",
        coumnWidth: 130,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "asset") {
                return (<div className='inter-display-medium f-s-13 lh-16 history-table-coin-icon'><Image src={rowData.asset} /> Ethereum</div>)
            }
        }
    },
    {
        labelName: "Amount",
        dataKey: "amount",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "amount") {
                return rowData.amount
            }
        }
    },
    {
        labelName: "USD Value Then",
        dataKey: "usdValueThen",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "usdValueThen") {
                return rowData.usdValueThen
            }
        }
    },
    {
        labelName: "USD Value today",
        dataKey: "usdValueToday",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "usdValueToday") {
                return rowData.usdValueToday
            }
        }
    },
    {
        labelName: "USD Transaction Fee",
        dataKey: "usdTransactionFee",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "usdTransactionFee") {
                return rowData.usdTransactionFee
            }
        }
    },
    {
        labelName: "Method",
        dataKey: "method",
        coumnWidth: 100,
        isCell: true,
        cell: (rowData, dataKey) => {
            if (dataKey === "method") {
                return (
                    <div
                        className={
                            `inter-display-medium f-s-13 lh-16 black-191 history-table-method 
                            ${rowData.method === "Burn" ? "burn"
                                :
                                rowData.method === "Transfer" ? "transfer"
                                :
                                rowData.method === "Mint" ? "mint"
                                :
                                rowData.method === "Commit" ? "commit"
                                :
                                ""
                            }`
                        }
                    >
                        {rowData.method}
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
