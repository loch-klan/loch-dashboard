import React from 'react'
import {Row,Col} from 'react-bootstrap'
export const BarGraphFooter = (props) => {

   
  const timeSeries = props.footerLabels ? props.footerLabels : ["All time","5 Years","1 Year","6 Months","1 Month","1 Week"]

  const timeBadge = timeSeries.map((badge, index) => {
    console.log(props.active, index);
      const className =
        index == props.active || badge == props.active
          ? "inter-display-medium f-s-13 lh-16 timeBadge  active"
          : "inter-display-medium f-s-13 lh-16 timeBadge";
    return (
      // <Col md={4} sm={6} lg={2} key={index}>
      //   <div  id={index} className={className} onClick={props.handleFooterClick}>{badge}</div>
      // </Col>

      <div
        key={index}
        id={index}
        className={className}
        onClick={props.handleFooterClick}
      >
        {badge}
      </div>
    );
  })
  return (
    <div className="bar-graph-footer">
      {/* <Row>
        {timeBadge}
      </Row> */}
      <div className='timeBadgeWrapper'>{timeBadge}</div>
    </div>
  );
}
