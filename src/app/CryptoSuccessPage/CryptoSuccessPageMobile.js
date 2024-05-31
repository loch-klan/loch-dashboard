import { Component } from "react";

import { connect } from "react-redux";
import PaymentSuccessModal from "../common/PaymentSuccessModal";

class StripeSuccessPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="insightsPageContainer">
        <div className="portfolio-page-section ">
          <PaymentSuccessModal
            subText={this.props.subText}
            onHide={this.props.onHide}
            isMobile
          />
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
)(StripeSuccessPageMobile);
