import React from 'react';
import PropTypes from 'prop-types';
import { Image } from "react-bootstrap";
// import leftArrow from '../../assets/images/left-arrow.png'
// import rightArrow from '../../assets/images/right-arrow.png'
import pagePrev from '../../assets/images/page-prev.svg';
import pageNext from '../../assets/images/page-next.svg';
// import CustomButton from '../form/CustomButton';

const onLeftClick = (props) => {
  // console.log('props', props);
  if (props.noUrl) {
    props.loadData(props.page - 1);
  } else {
    // console.log('Heyaa Prev');
    if (props.page > 1) {
      const params = new URLSearchParams(props.location.search);
      params.set("p", props.page - 1);
      props.history.push(`${props.history.location.pathname}?${params}`);
      // props.loadData(props.page - 1);
    }
  }

}

const onNextClick = (props) => {
  if (props.noUrl) {
    props.loadData(props.page + 1);
  } else {
    // console.log('Heyaa Next');
    if (props.page < props.pageCount) {
      const params = new URLSearchParams(props.location.search);
      params.set("p", props.page + 1);
      props.history.push(`${props.history.location.pathname}?${params}`)
      // props.loadData(props.page + 1);
    }
  }

}

const Pagination = props => {
  return (
    <div className="pagination-wrapper">
      {/* <CustomButton
        handleClick={() => onLeftClick(props)}
        buttonImage={leftArrow}
        className="left-arrow" /> */}
      {/* <Button className="primary-btn inverse" onClick={() => onLeftClick(props)} disabled={props.page === 1} > */}
      {/* <Glyphicon glyph="chevron-left" className="left-arrow" /> */}
      <Image src={pagePrev} onClick={() => onLeftClick(props)} className="left-arrow" />
      {/* </Button> */}
      <h5 className='red-hat-display-medium f-s-14'>{props.page} of {props.pageCount}</h5>
      {/* <CustomButton
        handleClick={() => onNextClick(props)}
        buttonImage={rightArrow}
        className="right-arrow" /> */}
      {/* <Button className="primary-btn inverse" onClick={() => onNextClick(props)} disabled={props.page === props.pageCount}> */}
      {/* <Glyphicon glyph="chevron-right" className="right-arrow" /> */}
      <Image src={pageNext} onClick={() => onNextClick(props)} className="right-arrow" />
      {/* </Button> */}
    </div >
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  loadData: PropTypes.func,
};
export default Pagination;