import React,{ Component }  from 'react'
import  BarGraphSection  from '../common/BarGraphSection'
import PageHeader from '../common/PageHeader'
import Sidebar from '../common/Sidebar'
import { info , years5 ,ethereum } from './dummyData.js'
import { connect } from "react-redux";
import { getAllCoins } from '../onboarding/Api.js'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import GainIcon from '../../assets/images/icons/GainIcon.svg'
import LossIcon from '../../assets/images/icons/LossIcon.svg'
import { Image } from 'react-bootstrap';
import CoinChip from '../wallet/CoinChip';
import TransactionTable from '../intelligence/TransactionTable'
class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationgraphdata: {
        data: info[0],
        options: info[1],
        options2: info[2],
      },
    };
  }

  componentDidMount() {
      this.props.getAllCoins()
  }


  render() {
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

    const columnData = [
      {
        labelName: "Asset",
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.2,
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
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "AverageCostPrice") {
          return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.AverageCostPrice}</div>
          }
        }
      }, {
        labelName: "Current Price",
        dataKey: "CurrentPrice",
        // coumnWidth: 128,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentPrice") {
          return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.CurrentPrice}</div>
          }
        }
      }, {
        labelName: "Amount",
        dataKey: "Amount",
        // coumnWidth: 108,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Amount") {
            return rowData.Amount
          }
        }
      }, {
        labelName: "Cost Basis",
        dataKey: "CostBasis",
        // coumnWidth: 100,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CostBasis") {
            return rowData.CostBasis
          }
        }
      }, {
        labelName: "CurrentValue",
        dataKey: "CurrentValue",
        // coumnWidth: 140,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentValue") {
            return rowData.CurrentValue
          }
        }
      }, {
        labelName: "% Gain / Loss",
        dataKey: "GainLoss",
        // coumnWidth: 128,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            return (
            <div className={`gainLoss ${rowData.GainLoss.status === "loss" ? "loss" : "gain"}`}>
              <Image src={rowData.GainLoss.symbol} />
              <div className="inter-display-medium f-s-13 lh-16 grey-313">{rowData.GainLoss.value}</div>
            </div>)
          }
        }
      }]
    return (
      <div className="cost-page-section">
        {/* <Sidebar ownerName="" /> */}
        <div className="m-t-5 cost-section page">
          <PageHeader
            title="Costs"
            subTitle="Bring light to your hidden costs"
          />

          <BarGraphSection
            headerTitle="Blockchain Fees over Time"
            headerSubTitle="Understand your gas costs"
            data={this.state.durationgraphdata.data}
            options={this.state.durationgraphdata.options}
            options2={this.state.durationgraphdata.options2}
            coinsList={this.props.OnboardingState.coinsList}
            marginBottom="m-b-32"
            showFooter={true}
            showBadges={true}
            isScrollVisible={false}
            // height={420}
            // width={824}
          />

          <BarGraphSection
            headerTitle="Counterparty Fees Over Time"
            headerSubTitle="Understand how much your counterparty charges you"
            data={this.state.durationgraphdata.data}
            options={this.state.durationgraphdata.options}
            options2={this.state.durationgraphdata.options2}
            coinsList={this.props.OnboardingState.coinsList}
            marginBottom="m-b-32"
            showFooter={true}
            showBadges={true}
            isScrollVisible={false}
            // height={"400px"}
            // width={"824px"}
          />

          <div className="m-b-40 cost-table-section">
            <TransactionTable
              title="Average Cost Basis"
              subTitle="Understand your average entry price"
              tableData={tableData}
              columnList={columnData}
              headerHeight={64}
            />
          </div>
        </div>
      </div>
    );
  }
}
  const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
  });
  const mapDispatchToProps = {
    getAllCoins
  }

export default connect(mapStateToProps, mapDispatchToProps)(Cost);

