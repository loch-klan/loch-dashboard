import React from 'react';
import PropTypes from 'prop-types';
import { Image } from "react-bootstrap";
import pagePrev from '../../assets/images/page-prev.svg';
import pageNext from '../../assets/images/page-next.svg';

const onLeftClick = (props) => {
  if (props.noUrl) {
    props.loadData(props.page - 1);
  } else {
    if (props.page > 1) {
      const params = new URLSearchParams(props.location.search);
      params.set("p", props.page - 2);
      props.history.push(`${props.history.location.pathname}?${params}`);
      // props.loadData(props.page - 1);
    }
  }

}

const onNextClick = (props) => {
  if (props.noUrl) {
    props.loadData(props.page + 1);
  } else {
    if (props.page < props.pageCount) {
      const params = new URLSearchParams(props.location.search);
      params.set("p", props.page);
      props.history.push(`${props.history.location.pathname}?${params}`)
      // props.loadData(props.page + 1);
    }
  }
}

const Pagination = props => {
  return (
    <div className="pagination-wrapper">
      <Image src={props.pagePrev ? props.pagePrev : pagePrev} onClick={() => onLeftClick(props)} className="left-arrow" />
      <h5 className='inter-display-medium f-s-14'>{props.page} of {props.pageCount}</h5>
      <Image src={props.pageNext ? props.pageNext : pageNext} onClick={() => onNextClick(props)} className="right-arrow" />
    </div >
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  loadData: PropTypes.func,
};
export default Pagination;