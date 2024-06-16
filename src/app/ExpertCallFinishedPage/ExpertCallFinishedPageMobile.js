import { Component } from "react";

import { connect } from "react-redux";
import ExpertCallFinishedContent from "./ExpertCallFinishedContent";

class ExpertCallFinishedPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="exper-call-finished-complete-page-mobile">
        <ExpertCallFinishedContent
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
)(ExpertCallFinishedPageMobile);
