import { Component } from "react";

import { connect } from "react-redux";
import Loading from "../common/Loading";

class ReplaceAddressPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="insightsPageContainer replace-address-page">
        <div className="portfolio-page-section ">
          <div className="replace-address-body">
            <Loading />
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
)(ReplaceAddressPageMobile);
