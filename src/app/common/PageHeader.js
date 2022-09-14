import React from 'react'
import { Button } from 'react-bootstrap'
export default function PageHeader(props) {
  return (
    <div className='m-b-36 page-header'>
    <div className='header'>
        <h4 className='inter-display-medium f-s-31 lh-37 m-b-12'>{props.title}</h4>
        <p className="inter-display-medium f-s-16 lh-19">{props.subTitle}</p>
    </div>
    {props.btnText && <Button className='primary-btn'>{props.btnText}</Button>}
</div>
  )
}
