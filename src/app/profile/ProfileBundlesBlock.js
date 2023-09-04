import React, { Component } from "react";
import { connect } from "react-redux";

import { setPageFlagDefault } from "../common/Api";
import { TruncateText } from "../../utils/ReusableFunctions";
import CustomChip from "../../utils/commonComponent/CustomChip";
import { Image } from "react-bootstrap";
import { TempIconIcon } from "../../assets/images/icons";

class ProfileBundlesBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      bundleData: {},
    };
  }

  componentDidMount() {
    this.setState({
      index: this.props.index,
      bundleData: this.props.bundleData,
    });
  }

  onBundleClickPass = () => {
    this.props.onBundleClick(this.state.index);
  };

  render() {
    return (
      <>
        {this.state.bundleData?.walletaddress
          ? this.state.bundleData.walletaddress.slice(0, 3).map((resWallet) => {
              return (
                <div
                  className="bundleWalletRow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="interDisplayMediumText f-s-12 lh-12 ">
                    {TruncateText(resWallet.wallet_address)}
                  </div>
                  <Image style={{ height: "2rem" }} src={TempIconIcon} />
                </div>
              );
            })
          : null}
        {this.state.bundleData?.walletaddress &&
        this.state.bundleData.walletaddress.length > 3 ? (
          <div className="interDisplayMediumText f-s-14 lh-14 grey-B0B bundleWalletRowEnd">
            and {this.state.bundleData.walletaddress.length - 3} more
          </div>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  profileState: state.ProfileState,
});
const mapDispatchToProps = {
  setPageFlagDefault,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileBundlesBlock);
