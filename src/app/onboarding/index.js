import React, { Component } from 'react';
import { connect } from "react-redux";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";
import infoicon from "../../image/Vector-info.svg";
import walleticon from "../../assets/images/icons/wallet-icon.svg";
import SignInIcon from "../../assets/images/icons/signin-icon.svg";
import AddWallet from "./addWallet";
import { Button } from 'react-bootstrap';
import SignIn from "./signIn";

class OnBoarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signInReq: false,
            isVerificationRequired: false,
            isVerified: false
        }
        // this.onClose = this.onClose.bind(this);
        // this.switchSignIn = this.switchSignIn.bind(this);
    }

    componentDidMount() { }

    onClose = () => {
        this.setState({ showModal: false })
    }

    switchSignIn = () => {
        this.setState({ signInReq: !this.state.signInReq })
    }

    render() {

        return (
            <>
                <OnboardingModal
                    show={this.state.showModal}
                    showImage={true}
                    onHide={this.onClose}
                    title={this.state.signInReq ? "Sign In" : "Welcome to Loch"}
                    subTitle={this.state.signInReq ? "Get right back into your account" : "Add wallet address(es) to get started"}
                    icon={this.state.signInReq ? SignInIcon : walleticon}
                    isSignInActive={this.state.signInReq}
                    handleBack={this.switchSignIn}>

                    {this.state.signInReq ? <SignIn isVerificationRequired={this.state.isVerificationRequired} /> : <AddWallet />}
                    <div className="ob-modal-body-info">
                        {this.state.signInReq ? null : <h4 className='inter-medium f-s-14 grey-636'>Already have an account? <span className='blue-268 cp' onClick={this.switchSignIn}>Sign in</span></h4>}
                        <p className='inter-display-medium lh-16'>Don't worry. All your information remains private and anonymous. <img src={infoicon} title="We do not link wallet addresses back to you unless you explicitly give us your email or phone number. " /> </p>
                    </div>
                </OnboardingModal>
            </>

        )
    }
}

const mapStateToProps = state => ({
    // homeState: state.HomeState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
OnBoarding.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);