import React from "react";
export const BarGraphFooter = (props) => {
  const timeSeries = props.footerLabels
    ? props.footerLabels
    : ["All time", "5 Years", "1 Year", "6 Months", "1 Month", "1 Week"];

  const timeBadge = timeSeries?.map((badge, index) => {
    // console.log(props.active, index);
    const className =
      index == props.active || badge == props.active
        ? `inter-display-medium f-s-13 lh-16 timeBadge ${
            props.divideInTwo ? "timeBadeMobile" : ""
          } ${props.lineChart ? "lineChartTimeBadge" : ""} active`
        : `inter-display-medium f-s-13 lh-16 timeBadge ${
            props.divideInTwo ? "timeBadeMobile" : ""
          } ${props.lineChart ? "lineChartTimeBadge" : ""}`;
    return (
      // <Col md={4} sm={6} lg={2} key={index}>
      //   <div  id={index} className={className} onClick={props.handleFooterClick}>{badge}</div>
      // </Col>

      <div
        key={index}
        id={index}
        className={className}
        onClick={props.handleFooterClick}
      >
        {badge}
      </div>
    );
  });

  return (
    <div
      className={`bar-graph-footer ${props.lineChart ? "linechartFooter" : ""}`}
      style={props.cohort ? { marginBottom: "0px" } : {}}
    >
      {/* <Row>
        {timeBadge}
      </Row> */}
      {props.divideInTwo ? (
        <>
          <div
            className={`timeBadgeWrapper ${props.lineChart ? "lineChart" : ""}`}
            style={{
              columnGap: "0.5rem",
            }}
          >
            {timeBadge.slice(0, timeBadge.length / 2)}
          </div>
          <div
            style={{
              columnGap: "0.5rem",
            }}
            className={`timeBadgeWrapper ${props.lineChart ? "lineChart" : ""}`}
          >
            {timeBadge.slice(timeBadge.length / 2, timeBadge.length)}
          </div>
        </>
      ) : (
        <div
          className={`timeBadgeWrapper ${props.lineChart ? "lineChart" : ""}`}
        >
          {timeBadge}
        </div>
      )}
    </div>
  );
};
