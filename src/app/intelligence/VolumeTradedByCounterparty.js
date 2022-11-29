import React,{ Component }  from "react";
import { connect } from "react-redux";

import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";

import { info} from '../cost/dummyData';
import { Image } from 'react-bootstrap';
import ExportIconWhite from '../../assets/images/apiModalFrame.svg'
import graphImage from '../../assets/images/volume-traded-graph.png'

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
          <div style={{position: "relative",height:"100%"}}>
                    <div className='coming-soon-div'>
                        <Image src={ExportIconWhite} className="coming-soon-img" />
                        <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                    </div>
            {/* <BarGraphSection
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
                comingSoon={true}
            /> */}
            <Image src={graphImage} style={{borderRadius: "1rem", width: "100%", filter: "blur(3px)"}} />
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}
}
const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
  });

export default connect(mapStateToProps)(VolumeTradedByCounterparty);
