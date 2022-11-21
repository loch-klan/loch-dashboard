import React from "react";
import { Image } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import InsightsPageImage from "../../assets/images/InsightsPageImage.png";

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
        <div className="insights-image">
          <Image src={InsightsPageImage} />
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;
