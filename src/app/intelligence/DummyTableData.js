import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
export default {
    table_title:"",
    table_subtitle:"",
    table_data : [
        {
            Time:"4/22",
            From : Metamask,
            To:Metamask,
            Asset : Ethereum,
            Amount : 0,
            USDValueThen : 0,
            USDValueToday : 0,
            USDTransactionFee:1.75,
            Method :"Burn"
        },
        {
            Time:"4/22",
            From : Metamask,
            To:Metamask,
            Asset : Ethereum,
            Amount : 0,
            USDValueThen : 0,
            USDValueToday : 0,
            USDTransactionFee:2.56,
            Method :"Burn"
        }
    ],
    columnList:[{labelName:"Time",dataKey:"Time",coumnWidth:90,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "Time") {
        return rowData.Time
      }
    }},{labelName:"From",dataKey:"From",coumnWidth:90,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "From") {
        return rowData.From
      }
    }},{labelName:"To",dataKey:"To",coumnWidth:90,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "To") {
        return rowData.To
      }
    }},{labelName:"Asset",dataKey:"Asset",coumnWidth:130,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "Asset") {
        return rowData.Asset
      }
    }},{labelName:"Amount",dataKey:"Amount",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "Amount") {
        return rowData.Amount
      }
    }},{labelName:"USD Value Then",dataKey:"USDValueThen",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "USDValueThen") {
        return rowData.USDValueThen
      }
    }},{labelName:"USD Value Today",dataKey:"USDValueToday",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "USDValueToday") {
        return rowData.USDValueToday
      }
    }},{labelName:"USD Transaction Fee",dataKey:"USDTransactionFee",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "USDTransactionFee") {
        return rowData.USDTransactionFee
      }
    }},{labelName:"Method",dataKey:"Method",coumnWidth:100,isCell: true,
    cell: (rowData, dataKey) => {
      if (dataKey === "Method") {
        return rowData.Method
      }
    }}]
}