import React,{ Component }  from 'react'
import  BarGraphSection  from '../common/BarGraphSection'
import PageHeader from '../common/PageHeader'
import Sidebar from '../common/Sidebar'
import { info , years5 ,ethereum } from './dummyData.js'
import { connect } from "react-redux";
import { getAllCoins } from '../onboarding/Api.js'
import CostTable from './CostTable'
import TableData from './DummyTableData.js'

class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationgraphdata :{
        data: info[0],
        options: info[1],
      },
    }
  }

  componentDidMount() {
      this.props.getAllCoins()
  }


  render() {
    return (
      <div className="cost-page-section">
        {/* <Sidebar ownerName="" /> */}
        <div className='m-t-80 cost-section page'>

          <PageHeader
            title="Costs"
            subTitle="Bring light to your hidden costs"
          />

          <BarGraphSection
            headerTitle="Blockchain Fees over Time"
            headerSubTitle="Understand your gas costs"
            data={this.state.durationgraphdata.data}
            options={this.state.durationgraphdata.options}
            coinsList = {this.props.OnboardingState.coinsList}
            marginBottom = 'm-b-32'
            showFooter = {true}
            showBadges = {true}
            height={420}
            width={824}
          />

          {/* <BarGraphSection
            headerTitle="Counterparty Fees Over Time"
            headerSubTitle="Understand how much your counterparty charges you"
            data={this.state.durationgraphdata.data}
            options={this.state.durationgraphdata.options}
            coinsList = {this.props.OnboardingState.coinsList}
            marginBottom = 'm-b-32'
            showFooter = {true}
            showBadges = {true}
            height={"400px"}
            width={"824px"}

          />

          <CostTable
            tableData={TableData.table_data}
            columnList={TableData.columnList}
            title="Average Cost Basis"
            subTitle="Understand your average entry price"
          /> */}
        </div>
      </div>

    )
  }
}
  const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
  });
  const mapDispatchToProps = {
    getAllCoins
  }

export default connect(mapStateToProps, mapDispatchToProps)(Cost);

