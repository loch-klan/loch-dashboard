import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent, CustomButton } from "../../../utils/form/index.js";

class smartMoneyMobileSignOutModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}
  onSignOutPass = () => {
    this.props.onHide();
    this.props.onSignOut();
  };
  render() {
    return (
      <div className="msmpModalBlockContainer">
        <div className="msmpModalSignOutContainer">
          <div className="msmpModalSignOutBlock">
            <h6 className="inter-display-medium f-s-20 lh-24 m-b-10 text-center">
              Are you sure you want to{" "}
              {this.props.notSignedIn ? "Leave" : "Sign out"}?
            </h6>
            <div className="msmpModalBody">
              <div className="msmModalBtnContainer m-t-40">
                <CustomButton
                  className="inter-display-regular f-s-15 lh-20 msmModalBtn"
                  buttonText="Yes"
                  handleClick={this.onSignOutPass}
                />
              </div>
              <div className="msmModalBtnContainer m-t-20">
                <CustomButton
                  className="inter-display-regular f-s-15 lh-20 msmModalBtn msmTransparentModalBtn"
                  buttonText="No"
                  handleClick={this.props.onHide}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

smartMoneyMobileSignOutModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(smartMoneyMobileSignOutModal);
