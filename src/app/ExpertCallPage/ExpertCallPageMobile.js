import { Component } from "react";

import { connect } from "react-redux";
import ExpertCallContent from "./ExpertCallContent";

class ExpertCallPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="exper-call-running-page-mobile">
        <ExpertCallContent
          isMobile
          goToExpertsPage={this.props.goToExpertsPage}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertCallPageMobile);
