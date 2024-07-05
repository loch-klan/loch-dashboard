import React, { Component } from "react";
import { connect } from "react-redux";
import PieChart2 from "../Portfolio/PieChart2.js";

class AddAddressWalletViewerMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <PieChart2
          setLoader={this.props.setLoader}
          chainLoader={this.props.chainLoader}
          totalChainDetechted={this.state.totalChainDetechted}
          userWalletData={[]}
          chainPortfolio={[]}
          allCoinList={[]}
          assetTotal={0}
          assetPrice={[]}
          isLoading={this.props.isLoading}
          isUpdate={this.props.isUpdate}
          walletTotal={0}
          undetectedWallet={(e) => null}
          getProtocolTotal={0}
          updateTimer={this.props.updateTimer}
          openDefiPage={this.props.openDefiPage}
          isMobile={true}
        />
        <div className="mobile-portfolio-blocks">
          <div className="section-table-toggle-mobile">
            <div
              className={`inter-display-medium section-table-toggle-element mr-1 ${
                this.props.blockOneSelectedItem === 1
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockOneItem(1);
              }}
            >
              Tokens
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockOneSelectedItem === 4
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockOneItem(4);
                this.props.changeBlockThreeItem(2);
              }}
            >
              Yield opportunities
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockOneSelectedItem === 5
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockOneItem(5);
                this.props.changeBlockThreeItem(1);
              }}
            >
              Counterparties
            </div>
          </div>
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--tableCostCommonColor)",
              fontSize: "13px",
              padding: "0rem 7rem",
              textAlign: "center",
            }}
            className="inter-display-medium"
          >
            Understand the unrealized profit and loss per token
          </div>
        </div>
        <div className="mobile-portfolio-blocks">
          <div className="section-table-toggle-mobile">
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockTwoSelectedItem === 1
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockTwoItem(1);
              }}
            >
              Flows
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                this.props.blockTwoSelectedItem === 2
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockTwoItem(2);
              }}
            >
              Gas fees
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockTwoSelectedItem === 3
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockTwoItem(3);
              }}
            >
              NFTs
            </div>
          </div>
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--tableCostCommonColor)",
              fontSize: "13px",
              padding: "0rem 7rem",
              textAlign: "center",
            }}
            className="inter-display-medium"
          >
            Understand this portfolio's net flows
          </div>
        </div>

        <div
          style={{
            marginBottom: "3rem",
          }}
          className="mobile-portfolio-blocks"
        >
          <div className="section-table-toggle-mobile">
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockFourSelectedItem === 1
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockFourItem(1);
              }}
            >
              Price gauge
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                this.props.blockFourSelectedItem === 4
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockFourItem(4);
              }}
            >
              Transactions
            </div>
            <div
              className={`inter-display-medium section-table-toggle-element ${
                this.props.blockFourSelectedItem === 3
                  ? "section-table-toggle-element-selected"
                  : ""
              }`}
              onClick={() => {
                this.props.changeBlockFourItem(3);
              }}
            >
              Insights
            </div>
          </div>
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--tableCostCommonColor)",
              fontSize: "13px",
              padding: "0rem 7rem",
              textAlign: "center",
            }}
            className="inter-display-medium"
          >
            Understand when these tokens were bought and sold
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressWalletViewerMobile);
