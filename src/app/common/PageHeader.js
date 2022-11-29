import React from 'react'
import { Button, Breadcrumb, Image } from 'react-bootstrap'
import InActiveHomeSmallIcon from '../../assets/images/icons/InactiveHomeSmallIcon.svg'
import {Link} from 'react-router-dom'
export default function PageHeader(props) {

  const nav_list = window.location.pathname.split("/");

  const breads = nav_list.map((e, index) => {
    // console.log(e , props.currentPage)
    return e &&
      <>
        <Breadcrumb.Item linkAs= {Link} linkProps= {{to: `/${e}`}}className="inter-display-medium f-s-13 lh-16" active={e === props.currentPage} key={index} >
          {e.replace(/-/g, " ")}
        </Breadcrumb.Item>

      </>
  })
  const breadCrumb =
    <Breadcrumb >
      <Breadcrumb.Item linkAs= {Link} linkProps= {{to: `/portfolio`}}><Image src={InActiveHomeSmallIcon} /></Breadcrumb.Item>
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
      {props.viewMore && <a href={props.viewMoreRedirect} className='view-more' >View More</a>}
    </div>
  )
}
