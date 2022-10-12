import React from 'react'
import { Button } from 'react-bootstrap'
export default function PageHeader(props) {
  return (
    <div className='m-b-45 page-header'>
    <div className='header'>
        <h4 className='inter-display-medium f-s-25 lh-30 m-b-8'>{props.title}</h4>
        <p className="inter-display-medium f-s-16 lh-19">{props.subTitle}</p>
    </div>
    {props.btnText && <Button className='primary-btn' onClick={props.handleBtn}>{props.btnText}</Button>}
</div>
  )
}
