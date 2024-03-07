import { Component } from "react";
import { connect } from "react-redux";
import TransactionTable from "../intelligence/TransactionTable";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal";

class AssetUnrealizedProfitAndLossMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="assets-expanded-mobile copyTradeExpandedMobile">
        <div className="mobile-header-container-parent">
          <div className="mobile-header-container">
            <h4>Copy Trade</h4>
            <p>All the wallet addresses you have copied</p>
          </div>
          <div
            onClick={() => {
              this.props.showAddCopyTradeAddress(true);
            }}
            className="mobile-add-copy-trade-button"
          >
            Add copy trade
          </div>
        </div>

        {this.props.isAddCopyTradeAddress ? (
          <AddEmulationsAddressModal
            show={this.props.isAddCopyTradeAddress}
            onHide={this.props.hideAddCopyTradeAddress}
            emulationsUpdated={this.props.emulationsUpdated}
            isMobile
          />
        ) : null}
        <div
          style={{
            backgroundColor: "var(--cardBackgroud",
            borderRadius: "1.2rem",
            padding: "0rem",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              overflowX: "scroll",
              padding: "0rem 0.5rem",
              paddingTop: "0.5rem",
            }}
            className={`freezeTheFirstColumn newHomeTableContainer  ${
              this.props.emulationsLoading || this.props.tableData < 1
                ? ""
                : "tableWatermarkOverlay"
            }`}
          >
            <TransactionTable
              noSubtitleBottomPadding
              disableOnLoading
              isMiniversion
              message="No copy trades found"
              tableData={this.props.tableData}
              columnList={this.props.columnData}
              headerHeight={60}
              isArrow={true}
              isLoading={this.props.emulationsLoading}
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
