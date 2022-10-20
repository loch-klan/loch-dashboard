import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import GainIcon from '../../assets/images/icons/GainIcon.svg'
import LossIcon from '../../assets/images/icons/LossIcon.svg'
export default {
    table_title:"",
    table_subtitle:"",
    table_data : [
        {
            Asset : Ethereum,
            AverageCostPrice : "$800.00",
            CurrentPrice : "$1,390.00",
            Amount : 0,
            CostBasis:1.75,
            CurrentValue :"$5,514.00",
            // GainLoss : {
            //   status : "gain",
            //   symbol : GainIcon,
            //    value : "42.45%",
            // }
        },
      {
          Asset : Ethereum,
          AverageCostPrice : "$25,000.00",
          CurrentPrice : "$21,080.00",
          Amount : 0,
          CostBasis:2.56,
          CurrentValue :"$22,280.50",
          // GainLoss : {
          //   status : "loss",
          //   symbol : LossIcon,
          //   value : "-18.45%"
          // }
        }
    ],
    columnList:[
    {labelName:"Asset",dataKey:"Asset",coumnWidth:130,isCell: true,
    cell: (rowData, dataKey ,) => {
      if (dataKey === "Asset") {
        return rowData.Asset
      }
    }},{labelName:"Average Cost Price",dataKey:"AverageCostPrice",coumnWidth:136,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "AverageCostPrice") {
        return rowData.AverageCostPrice
      }
    }},{labelName:"Current Price",dataKey:"CurrentPrice",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "CurrentPrice") {
        return rowData.CurrentPrice
      }
    }},{labelName:"Amount",dataKey:"Amount",coumnWidth:83,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "Amount") {
        return rowData.Amount
      }
    }},{labelName:"Cost Basis",dataKey:"CostBasis",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "CostBasis") {
        return rowData.CostBasis
      }
    }},{labelName:"CurrentValue",dataKey:"CurrentValue",coumnWidth:103,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "CurrentValue") {
        return rowData.CurrentValue
      }
    }},{labelName:"% Gain / Loss",dataKey:"GainLoss",coumnWidth:101,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "GainLoss") {
        return rowData.GainLoss
      }
    }}]
}