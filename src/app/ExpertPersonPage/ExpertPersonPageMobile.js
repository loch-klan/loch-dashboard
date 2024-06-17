import { Component } from "react";

import { connect } from "react-redux";
import ExpertPersonContent from "./ExpertPersonContent";

class ExpertsPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="expert-person-page-mobile">
        <ExpertPersonContent
          socialMediaLinks={this.props.socialMediaLinks}
          expertsList={this.props.expertsList}
          goToScheduleACall={this.props.goToScheduleACall}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsPageMobile);
