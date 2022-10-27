import React from 'react'
import { Button, Breadcrumb, Image } from 'react-bootstrap'
import InActiveHomeSmallIcon from '../../assets/images/icons/InactiveHomeSmallIcon.svg'
export default function PageHeader(props) {

  const nav_list = window.location.pathname.split("/");

  const breads = nav_list.map((e, index) => {
    // console.log(e , props.currentPage)
    return e &&
      <>
        <Breadcrumb.Item href="#" className="inter-display-medium f-s-13 lh-16" active={e === props.currentPage} key={index}>{e}</Breadcrumb.Item>
        {/* <Breadcrumb.Item className="inter-display-medium f-s-13 lh-16 active" key={index}>Transaction History</Breadcrumb.Item> */}
        {/* <Breadcrumb.Item className='inter-display-medium f-s-13 lh-16' active>{props.currentPage}</Breadcrumb.Item> */}
      </>
  })
  const breadCrumb =
    <Breadcrumb >
      <Breadcrumb.Item href="#"><Image src={InActiveHomeSmallIcon} /></Breadcrumb.Item>
      {breads}
    </Breadcrumb >

  return (
    <div className={`m-b-40 page-header ${props.showpath ? "history-header" : ""}`}>
      {props.showpath ? breadCrumb : ""}

      <div className='header'>
        {props.showImg ?
          <div className='m-r-16 show-img'>
            <Image src={props.showImg} />
          </div>
          :
          ""
        }
        <div>
        <h4 className={`inter-display-medium f-s-25 lh-30 ${props.showImg ? "" : "m-b-8"}`}>{props.title}</h4>
        {props.subTitle ? <p className="inter-display-medium f-s-16 lh-19">{props.subTitle}</p> : ""}
        </div>
      </div>
      {props.btnText && <Button className='primary-btn' onClick={props.handleBtn}>{props.btnText}</Button>}
      {props.viewMore && <Button className='primary-btn' >View More</Button>}
    </div>
  )
}
