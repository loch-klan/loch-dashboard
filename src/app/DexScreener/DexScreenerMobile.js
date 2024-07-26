import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import DexScreenerContent from "./DexScreenerContent";

class DexScreenerMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  onChangeMethod = () => {};

  render() {
    return (
      <div className="dex-screener-page dex-screener-page-mobile">
        <div className="mobile-header-container">
          <h4>Scooby Doo</h4>
        </div>
        <DexScreenerContent
          transactionsTableData={this.props.transactionsTableData}
          topTradersTableData={this.props.topTradersTableData}
          holdersTableData={this.props.holdersTableData}
          liquidityProvidersTableData={this.props.liquidityProvidersTableData}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

DexScreenerMobile.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(DexScreenerMobile);
