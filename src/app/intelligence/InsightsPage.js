import React from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import ThisWeek from "../../assets/images/This-week.svg"
import Insights1 from "../../assets/images/Insights1.svg"
import Insights2 from "../../assets/images/Insights2.svg"
import Insights3 from "../../assets/images/Insights3.svg"
import Insights4 from "../../assets/images/Insights4.svg"
import Insights5 from "../../assets/images/Insights5.svg"
import InsightsFilter from "../../assets/images/Insights-filter.png"
import ExportIconWhite from '../../assets/images/apiModalFrame.svg'

function InsightsPage() {
  return (
    <div className="insights-section">
      <div className="insights-page page">
        <PageHeader
          title={"Insights"}
          subTitle={"Valuable insights based on your assets"}
          showpath={true}
          currentPage={"insights"}
          // history={this.props.history}
        />
        <div style={{position: "relative"}}>
                    <div className='coming-soon-div'>
                        <Image src={ExportIconWhite} className="coming-soon-img" />
                        <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                    </div>
        <span className="blur-effect">
        <div className="insights-image">
        <Image
            src={InsightsFilter} />
          <Image
          style={{width:"12.2rem",height:"3rem",marginTop:"2rem"
          }}
          src={ThisWeek} />
          <div className="insights-feed">
            <Image
            src={Insights5} />
            <Image
            src={Insights2} />
            <Image
            src={Insights4} />
            <Image
            src={Insights3} />

            <Image
            src={Insights1} />
          </div>
        </div>
        </span>
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;
