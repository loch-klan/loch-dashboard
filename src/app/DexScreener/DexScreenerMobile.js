import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import DexScreenerContent from "./DexScreenerContent";

class DexScreenerMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      selectedBlock: 1,
    };
  }

  goToFirstBlock = () => {
    if (this.state.selectedBlock !== 1) {
      this.setState({ selectedBlock: 1 });
    }
  };
  goToSecondBlock = () => {
    if (this.state.selectedBlock !== 2) {
      this.setState({ selectedBlock: 2 });
    }
  };
  onChangeMethod = () => {};

  render() {
    return (
      <div className="dex-screener-page dex-screener-page-mobile">
        <div className="mobile-header-container">
          <h4>Scooby Doo</h4>
        </div>
        <div className="dex-screener-page-mobile-toggle">
          <div
            className={`dex-screener-page-mobile-toggle-block ${
              this.state.selectedBlock === 1
                ? "dex-screener-page-mobile-toggle-block-selected"
                : ""
            }`}
            onClick={this.goToFirstBlock}
          >
            Info
          </div>
          <div
            className={`dex-screener-page-mobile-toggle-block ${
              this.state.selectedBlock === 2
                ? "dex-screener-page-mobile-toggle-block-selected"
                : ""
            }`}
            onClick={this.goToSecondBlock}
          >
            Chart+Txns
          </div>
        </div>
        <DexScreenerContent
          transactionsTableData={this.props.transactionsTableData}
          topTradersTableData={this.props.topTradersTableData}
          holdersTableData={this.props.holdersTableData}
          liquidityProvidersTableData={this.props.liquidityProvidersTableData}
          selectedBlock={this.state.selectedBlock}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

DexScreenerMobile.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(DexScreenerMobile);
