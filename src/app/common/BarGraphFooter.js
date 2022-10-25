import React from 'react'
import {Row,Col} from 'react-bootstrap'
export const BarGraphFooter = (props) => {

   
  const timeSeries = props.footerLabels ? props.footerLabels : ["All time","5 Years","1 Year","6 Months","1 Month","1 Week"]

  const timeBadge = timeSeries.map((badge,index)=>{
      const className = index==props.active ? "inter-display-medium f-s-13 lh-16 m-r-20 timeBadge  active" : "inter-display-medium f-s-13 lh-16 m-r-20 timeBadge"
    return(
      <Col md={2} key={index}>
        <div  id={index} className={className} onClick={props.handleFooterClick}>{badge}</div>
      </Col>
    )
  })
  return (
    <div className='bar-graph-footer'>
      <Row>
        {timeBadge}
      </Row>
    </div>
  )
}
