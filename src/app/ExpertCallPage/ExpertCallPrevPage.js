import { Component } from "react";

import { connect } from "react-redux";
import { getUser } from "../common/Api";
import ExpertCallPage from "./ExpertCallPage";
import "./_expertCallPage.scss";

class ExpertCallPrevPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <ExpertCallPage history={this.props.history} isPreviousCall />;
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertCallPrevPage);
