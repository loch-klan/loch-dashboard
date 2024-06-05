import { Component } from "react";

import { connect } from "react-redux";
import ExpertsPageContent from "./ExpertsPageContent";

class ExpertsPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="experts-page-mobile">
        <ExpertsPageContent
          isMobile
          history={this.props.history}
          expertsList={this.props.expertsList}
          becomeAnExpert={this.props.becomeAnExpert}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsPageMobile);
