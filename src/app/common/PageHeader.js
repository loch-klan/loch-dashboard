import React from 'react'
import { Button, Breadcrumb, Image } from 'react-bootstrap'
import InActiveHomeSmallIcon from '../../assets/images/icons/InactiveHomeSmallIcon.svg'
export default function PageHeader(props) {

  const nav_list = window.location.pathname.split("/");

  const breads = nav_list.map((e, index) => {
    return e && <Breadcrumb.Item href="#" className="inter-display-medium f-s-13 lh-16" key={index}>{e}</Breadcrumb.Item>
  })
  const breadCrumb =
    <Breadcrumb >
      <Breadcrumb.Item href="#"><Image src={InActiveHomeSmallIcon} /></Breadcrumb.Item>
      {breads}
    </Breadcrumb >
    
  return (
    <div className='m-b-36 page-header'>
      {props.showpath ? breadCrumb : ""}
      <div className='header'>
        <h4 className='inter-display-medium f-s-31 lh-37 m-b-12'>{props.title}</h4>
        <p className="inter-display-medium f-s-16 lh-19">{props.subTitle}</p>
      </div>
      {props.btnText && <Button className='primary-btn'>{props.btnText}</Button>}
    </div>
  )
}
