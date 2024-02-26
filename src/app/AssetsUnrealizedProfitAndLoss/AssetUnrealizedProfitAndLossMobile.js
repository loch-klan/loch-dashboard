import { Component } from "react";
import { connect } from "react-redux";
import TransactionTable from "../intelligence/TransactionTable";
import "./_assetUnrealizedProfitAndLoss.scss";
import { Form } from "react-bootstrap";

class AssetUnrealizedProfitAndLossMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="assets-expanded-mobile">
        <div
          style={{
            marginBottom: "0rem",
          }}
          className="mobile-header-container"
        >
          <h4>Assets</h4>
          <p>Understand your unrealized profit and loss per token</p>
        </div>
        <div
          onClick={this.props.showHideDustFun}
          className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn"
          style={{
            marginBottom: "2.8rem",
          }}
        >
          <Form.Check
            type="switch"
            checked={this.props.showHideDustVal}
            // onChange={(e) => {
            //   this.setState({
            //     switchselected: e.target.checked,
            //   });
            //   if (this.props.setSwitch) {
            //     this.props.setSwitch();
            //   }
            // }}
            label={
              this.props.showHideDustVal
                ? "Reveal dust (less than $1)"
                : "Hide dust (less than $1)"
            }
          />
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1.2rem",
            padding: "0rem",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              overflowX: "scroll",
              paddingTop: "0.5rem",
            }}
            className={`newHomeTableContainer  ${
              this.props.AvgCostLoading || this.props.tableData < 1
                ? ""
                : "tableWatermarkOverlay"
            }`}
          >
            <TransactionTable
              rowHeight={70}
              showHowHamyRowsAtOnce={10}
              freezeColumns={1}
              freezeRows={2}
              noSubtitleBottomPadding
              disableOnLoading
              isMiniversion
              message="No assets found"
              tableData={this.props.tableData}
              columnList={this.props.columnData}
              headerHeight={60}
              isArrow={true}
              isLoading={this.props.AvgCostLoading}
              isAnalytics="average cost basis"
              fakeWatermark
              xAxisScrollable
              yAxisScrollable
              xAxisScrollableColumnWidth={3}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetUnrealizedProfitAndLossMobile);
