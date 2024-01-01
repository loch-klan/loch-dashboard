import React from "react";
import { Col, Row } from "react-bootstrap";
export default function CommonTable(props) {
  const theader = props.data.theader.map((e, index) => {
    return (
      <Col key={index}>
        <div className="inter-display-medium f-s-13 lh-16 grey-4F4">{e}</div>
      </Col>
    );
  });
  // console.log(props.data[0].table_data)
  // console.log(props.data.tdata)
  const body = props.data.tdata.map((e, index) => {
    return (
      <Row key={index} className="cell-grp">
        {e.map((elem, ind) => {
          return (
            <Col key={ind}>
              <div className="inter-display-medium f-s-13 lh-16 grey-313">
                {elem}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  });
  return (
    <div className="table-section">
      <div className="header">
        <Row>{theader}</Row>
      </div>
      <div className="table-body">{body}</div>
    </div>
  );
}
