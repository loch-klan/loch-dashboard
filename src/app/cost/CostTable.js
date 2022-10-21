import React from 'react'
import PageHeader from '../common/PageHeader';
import TableData from './DummyTableData.js'
import CustomTable from './../../utils/commonComponent/CustomTable';
import { GraphHeader } from '../common/GraphHeader'
import ArrowRight from '../../assets/images/icons/ArrowRight.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import GainIcon from '../../assets/images/icons/GainIcon.svg'
import LossIcon from '../../assets/images/icons/LossIcon.svg'
import { Image } from 'react-bootstrap';
import CoinChip from '../wallet/CoinChip';
function CostTable(props) {

  const tableData = [
    {
      Asset: Ethereum,
      AverageCostPrice: "$800.00",
      CurrentPrice: "$1,390.00",
      Amount: 3.97,
      CostBasis: 1.75,
      CurrentValue: "$5,514.00",
      GainLoss:{
          status: "gain",
          symbol: GainIcon,
        // "42.45%",
        value: "42.45%",
      }
    },
    {
      Asset: Ethereum,
      AverageCostPrice: "$25,000.00",
      CurrentPrice: "$21,080.00",
      Amount: 3.97,
      CostBasis: 2.56,
      CurrentValue: "$22,280.50",
      GainLoss:{
          status: "loss",
          symbol: LossIcon,
        // "-18.45%"
        value: "-18.45%"
      }
    }
  ]
  return (
    <div className="cost-table-section ">
      <GraphHeader
        title={props.title}
        subtitle={props.subTitle}
        isArrow={ true }
      />

      <CustomTable
        className="average-cost-basic-table"
        tableData={tableData}
        columnList={[
          {
            labelName: "Asset",
            dataKey: "Asset",
            coumnWidth: 118,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "Asset") {
              return (
                <CoinChip
                  coin_img_src={rowData.Asset}
                  coin_code="ETH"
                />
              )
              }
            }
          }, {
            labelName: "Average Cost Price",
            dataKey: "AverageCostPrice",
            coumnWidth: 140,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "AverageCostPrice") {
              return <div className='inter-display-medium f-s-13 lh-16 cost-common'>{rowData.AverageCostPrice}</div>
              }
            }
          }, {
            labelName: "Current Price",
            dataKey: "CurrentPrice",
            coumnWidth: 128,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "CurrentPrice") {
              return <div className='inter-display-medium f-s-13 lh-16 cost-common'>{rowData.CurrentPrice}</div>
              }
            }
          }, {
            labelName: "Amount",
            dataKey: "Amount",
            coumnWidth: 108,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "Amount") {
                return rowData.Amount
              }
            }
          }, {
            labelName: "Cost Basis",
            dataKey: "CostBasis",
            coumnWidth: 100,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "CostBasis") {
                return rowData.CostBasis
              }
            }
          }, {
            labelName: "CurrentValue",
            dataKey: "CurrentValue",
            coumnWidth: 140,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "CurrentValue") {
                return rowData.CurrentValue
              }
            }
          }, {
            labelName: "% Gain / Loss",
            dataKey: "GainLoss",
            coumnWidth: 128,
            isCell: true,
            cell: (rowData, dataKey) => {
              if (dataKey === "GainLoss") {
                return (
                <div className={`gainLoss ${rowData.GainLoss.status === "loss" ? "loss" : "gain"}`}>
                  <Image src={rowData.GainLoss.symbol} />
                  <div className="inter-display-medium f-s-13 lh-16">{rowData.GainLoss.value}</div>
                </div>)
              }
            }
          }]}
      />

    </div>
  )
}

export default CostTable
