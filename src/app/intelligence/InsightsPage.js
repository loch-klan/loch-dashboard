import React, { Component } from "react";
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
import reduceCost from '../../assets/images/icons/reduce-cost.svg'
import reduceRisk from '../../assets/images/icons/reduce-risk.svg'
import increaseYield from '../../assets/images/icons/increase-yield.svg'
import { getAllInsightsApi } from "./Api";
import { InsightType } from "../../utils/Constant";

class InsightsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insightList: "",
      selected: "",
      insightFilter: [
        {
          name: "All Insights",
          value: 1,
        },
        {
          name: "Reduce Cost",
          value: 10,
        },
        {
          name: "Reduce Risk",
          value: 20,
        },
        {
          name: "Increase Yield",
          value: 30,
        },
      ],
      selectedFilter: 1,
    };
  }
  componentDidMount() {
    getAllInsightsApi(this);
  }
  handleSelect = (value) =>{
    let insightList = this.state.insightList;
    insightList = insightList.filter((item)=> value === 1 ? item : item.insight_type === value)
    this.setState({
      selectedFilter: value,
      updatedInsightList: insightList,
    })

  }

  render(){

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
          <div className="insights-filter">
            {
              this.state.insightFilter.map((filter, key)=>{
                return (
                  <div id={key} className={`filter ${filter.value === this.state.selectedFilter ? "active" : ""}`} onClick={()=>this.handleSelect(filter.value)}>{filter.name}</div>
                )
              })
            }
          </div>
          <div className="insights-wrapper">
            {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
            {
              this.state.updatedInsightList && this.state.updatedInsightList.length > 0 &&
              this.state.updatedInsightList.map((insight, key)=>{
                return(
                  <div className="insights-card" key={key}>
                    <Image src={insight.insight_type === InsightType.COST_REDUCTION ? reduceCost : insight.insight_type === InsightType.RISK_REDUCTION ? reduceRisk : increaseYield} className="insight-icon" />
                    <div className="insights-content">
                      <h5 className="inter-display-bold f-s-10 lh-12 title-chip">{InsightType.getText(insight.insight_type)}</h5>
                      <p className="inter-display-medium f-s-13 lh-16 grey-969" dangerouslySetInnerHTML={{__html: insight.sub_title}}></p>
                      <h4 className="inter-display-medium f-s-16 lh-19 grey-313" dangerouslySetInnerHTML={{__html: insight.title}}></h4>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default InsightsPage;
