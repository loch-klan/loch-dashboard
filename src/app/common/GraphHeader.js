import React from 'react'
import { Image } from 'react-bootstrap'
export const GraphHeader = (props) => {
  return (
    <div className='graph-header'>
        <div className='header'>
            <h4 className='inter-display-semi-bold f-s-16 lh-19 m-b-4'>{props.title} {props.isArrow ?  <Image src={props.isArrow} /> : ""}</h4>
            <p className='inter-display-medium f-s-13 lh-16 m-b-26 grey-ADA '>{props.subtitle}</p>
        </div>
    </div>
  )
}
