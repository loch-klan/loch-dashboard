import React, { Component } from 'react';
import { connect } from "react-redux";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import WalletIcon from "../../assets/images/icons/wallet-icon.svg";
import SignInIcon from "../../image/profile-icon.png";
import AddWallet from "./addWallet";
import SignIn from "./signIn";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { Image } from "react-bootstrap";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
// export { default as OnboardingReducer } from "./OnboardingReducer";

import { useHistory } from 'react-router-dom';
class OnBoarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signInReq: false,
            isVerificationRequired: false,
            isVerified: false,
        }
    }

    componentDidMount() { }

    onClose = () => {
        this.setState({ showModal: false })
    }

    switchSignIn = () => {
        this.setState({
          signInReq: !this.state.signInReq,
        })
    }

    render() {

        return (
            <>
                <OnboardingModal
                    show={this.state.showModal}
                    showImage={true}
                    onHide={this.onClose}
                    title={this.state.signInReq ? "Sign in" : "Welcome to Loch"}
                    subTitle={this.state.signInReq ? "Get right back into your account" : "Add any wallet address(es) to get started"}
                    icon={this.state.signInReq ? SignInIcon : WalletIcon}
                    isSignInActive={this.state.signInReq}
                    handleBack={this.switchSignIn}
                >
                    {
                      this.state.signInReq
                        ?
                        <SignIn
                          isVerificationRequired={this.state.isVerificationRequired}
                          history={this.props.history}
                        />
                        :
                        <AddWallet {...this.props}/>
                    }
                    <div className="ob-modal-body-info">
                        {this.state.signInReq ? null : <h4 className='inter-display-medium f-s-14 grey-636'>Already have an account? <span className='black-191 cp' onClick={this.switchSignIn}>Sign in</span></h4>}
                        <p className='inter-display-medium lh-16 grey-ADA'>Don't worry. All your information remains private and anonymous.
                            <CustomOverlay
                                text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                                position="top"
                                isIcon={true}
                                IconImage ={LockIcon}
                                isInfo = {true}
                            ><Image src={InfoIcon} className="info-icon cp" /></CustomOverlay> </p>
                    </div>
                </OnboardingModal>
            </>

        )
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
OnBoarding.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);