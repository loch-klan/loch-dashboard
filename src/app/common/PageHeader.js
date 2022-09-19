import React from 'react'
import { Button, Breadcrumb ,Image} from 'react-bootstrap'
import InActiveHomeSmallIcon from '../../assets/images/icons/InactiveHomeSmallIcon.svg'
export default function PageHeader(props) {

  const breadCrumb = <Breadcrumb>
    <Breadcrumb.Item href="#"><Image src={InActiveHomeSmallIcon}/></Breadcrumb.Item>
    <Breadcrumb.Item href="#">Intelligence</Breadcrumb.Item>
    <Breadcrumb.Item active>Transaction History</Breadcrumb.Item>
  </Breadcrumb>
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
