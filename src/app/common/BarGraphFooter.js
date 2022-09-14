import React from 'react'

export const BarGraphFooter = (props) => {

   
  const timeSeries = ["All time","5 Years","1 Year","6 Months","1 Month","1 Week"]

  const timeBadge = timeSeries.map((badge,index)=>{
      const className = index==props.active ? "inter-display-medium f-s-13 lh-16 timeBadge  active" : "inter-display-medium f-s-13 lh-16 timeBadge"
    return(
        <div key={index} id={index} className={className} onClick={props.handleFooterClick}>{badge}</div>
    )
  })
  return (
    <div className='bar-graph-footer'>{timeBadge}</div>
  )
}
