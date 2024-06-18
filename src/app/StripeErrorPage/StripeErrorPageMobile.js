import { Component } from "react";

import { connect } from "react-redux";

class StripeErrorPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="insightsPageContainer">
        <div className="portfolio-page-section "></div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StripeErrorPageMobile);
