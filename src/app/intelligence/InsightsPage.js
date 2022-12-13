import React, { Component } from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
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
          {
            this.state.updatedInsightList && this.state.updatedInsightList.length > 0 &&
          <div className="insights-filter">
            {
              this.state.insightFilter.map((filter, key)=>{
                return (
                  <div id={key} className={`filter ${filter.value === this.state.selectedFilter ? "active" : ""}`} onClick={()=>this.handleSelect(filter.value)}>{filter.name}</div>
                )
              })
            }
          </div>
          }
          <div className="insights-wrapper">
            {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
            {
              this.state.updatedInsightList && this.state.updatedInsightList.length > 0 ?
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
              :
              <h5 className="inter-display-medium f-s-25 lh-30 m-b-8 text-center">No Insights Found</h5>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default InsightsPage;
