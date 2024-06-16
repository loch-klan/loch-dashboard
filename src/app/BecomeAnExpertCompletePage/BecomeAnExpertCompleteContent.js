import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { BecomeAnExpertCompleteHourGlassIcon } from "../../assets/images/icons";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import "./_becomeAnExpertCompletePage.scss";

class BecomeAnExpertCompleteContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  render() {
    return (
      <div className="becomne-an-expert-complete-page inter-display-medium">
        <div className="becomne-an-expert-page-block-top-gradient" />
        <div className="becomne-an-expert-page-block">
          <Image
            src={BecomeAnExpertCompleteHourGlassIcon}
            className="bae-pb-image"
          />
          <div className="bae-pb-title">Application in review..</div>
          <div className="bae-pb-desc">
            While we review, you can start browse
            <br />
            Loch and check out other experts
          </div>
          <button
            onClick={this.props.goToExpertsPage}
            className="bae-pb-btn inter-display-medium"
          >
            Browse other experts
          </button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BecomeAnExpertCompleteContent);
