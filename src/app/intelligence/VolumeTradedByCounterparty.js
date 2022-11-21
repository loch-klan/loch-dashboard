import React,{ Component }  from "react";
import { connect } from "react-redux";

import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";

import { info} from '../cost/dummyData'

class VolumeTradedByCounterparty extends Component {
        constructor(props) {
          super(props);
          this.state = {
            durationgraphdata: {
              data: info[0],
              options: info[1],
              options2: info[2],
            },
            startTime:"",
          };
        }
  
  render() {
    return(
    <div className="volume-traded-section">
      <div className="page volume-traded-page">
        <PageHeader
          title={"Volume Traded By Counterparty"}
          subTitle={"Valuable insights based on your assets"}
          showpath={true}
          currentPage={"volume-traded-by-counterparty"}
          history={this.props.history}
        />
        <div className="graph-container">
            <BarGraphSection
                // headerTitle="Blockchain Fees over Time"
                // headerSubTitle="Understand your gas costs"
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
                // comingSoon={true}
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

export default connect(mapStateToProps)(VolumeTradedByCounterparty);
