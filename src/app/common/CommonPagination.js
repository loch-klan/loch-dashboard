import React from "react";
import { Image, Pagination } from "react-bootstrap";
import ActiveNextBtn from "../../assets/images/icons/ActiveNextBtn.svg";
import ActivePrevBtn from "../../assets/images/icons/ActivePrevBtn.svg";
import InactivePrevBtn from "../../assets/images/icons/InactivePrevBtn.svg";

export const CommonPagination = (props) => {
  let items = [];
  const [page, setPage] = React.useState(1);
  // const [active, setactive] = React.useState(1)
  let totalPage = props.numOfPages;
  const setCurrentPage = (p) => {
    props.setValue(p);
  };
  for (let number = 1; number <= totalPage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        className="inter-display-medium f-s-16 lh-19"
      >
        {number}
      </Pagination.Item>
    );
  }
  const nextPage = () => {
    if (page !== totalPage) {
      // console.log(page)
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    // console.log(page)
    if (page !== 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="pagination-section">
      <Image
        src={page === 1 ? InactivePrevBtn : ActivePrevBtn}
        onClick={prevPage}
        className="m-r-12"
      />
      <Pagination>{items}</Pagination>
      <Image src={ActiveNextBtn} onClick={nextPage} className="m-l-12" />
    </div>
  );
};
