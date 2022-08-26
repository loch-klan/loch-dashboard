import React from 'react';
import { Image, Modal, Button } from "react-bootstrap";
import closeIcon from '../../assets/images/icons/close-icon.svg';
import bgimg from "../../image/Frame.png";
import "../../assets/scss/onboarding/_onboarding.scss";
import walleticon from "../../image/Vector-wallet.svg";
import infoicon from "../../image/Vector-info.svg";
import { InfoBox } from '@react-google-maps/api';
import deleteicon from "../../image/Vector-delete.svg";
import plusicon from "../../image/Vector-plus.svg";
import profileIcon from "../../image/profile-icon.svg";
import backIcon from "../../image/back-icon.svg";
import {BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator} from '../../utils/form';


class OnboardingModal2 extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      signIn: true,
      isEmail: false,
    }
  }
  componentDidMount() { }

  onSubmit = () => {
    // const data = new URLSearchParams();
    // data.append('email', this.state.email);
    // forgotPasswordApi(data, this.props.handleClose);
  }

  handleBack = ()=>{
    this.setState({signIn: false})
  }
  handleSignIn = () =>{
    this.setState({signIn: true})
  }

render(){
return (
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          dialogClassName={"onboarding-modal"}
          keyboard={false}
          size='lg'
          backdrop="static"
          centered
          aria-labelledby="contained-modal-title-vcenter"
        >
                <Modal.Header>
                    <Modal.Title>
                      {
                        this.state.signIn
                        ?
                        <div className='signin-header' onClick={()=>this.handleBack()}>
                        <Image className='back-icon cp' src={backIcon}/>
                        <Image className='ob-modal-title-icon' src={profileIcon}/>
                        <h1 className='inter-display-medium f-s-31 lh-37 white'>Sign in</h1>
                        <p className='inter-display-medium f-s-13 lh-16 white op-.8'>Get right back into your account</p>
                        </div>
                        :
                        <>
                       <Image className='ob-modal-title-icon' src={walleticon}/>
                        <h1 className='inter-display-medium f-s-31 lh-37 white'>Welcome to Loch</h1>
                        <p className='inter-display-medium f-s-13 lh-16 white op-.8'>Add wallet address(es) to get started</p>
                        </>
                      }
                        </Modal.Title>
                </Modal.Header>
            <Modal.Body>
              {
                this.state.signIn
                ?
                <>
                <Form onValidSubmit={this.onSigninSubmit}>
                <FormElement
                  valueLink={this.linkState(this, "email")}
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty"
                    },
                    {
                      validate: FormValidator.isEmail,
                      message: "Please enter a valid email"
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Your email",
                    }
                  }}
                  classes={{
                    inputField: "custom-input",
                    label: "custom-label"
                  }}
                />
                </Form>
                </>
                :
                <>
                <Form onValidSubmit={this.onWalletSubmit}>
                <div className='ob-modal-body-1'>
                    <img className='ob-modal-body-del' src={deleteicon}/>
                    <input className='ob-modal-body-text inter-display-regular' placeholder='Paste your wallet address here'/>
                </div>
                <div className='ob-modal-body-2'>
                    <Button className="grey-btn">
                            {/* <img src={plusicon}/> Add another */}
                            + Add another
                    </Button>
                </div>

                <div className='ob-modal-body-btn'>
                    {/* <Button className="ob-modal-body-secondary-btn inter-display-semi-bold">
                        Preview demo instead
                    </Button>
                    <Button className="ob-modal-body-black-btn black-btn inter-display-semi-bold" >
                        Go
                    </Button> */}
                    <Button className="secondary-btn m-r-15">
                        Preview demo instead
                    </Button>
                    <Button className="primary-btn" >
                        Go
                    </Button>
                </div>
                <div className="ob-modal-body-info">
                    {
                      !this.state.signIn &&
                      <h4 className='inter-medium f-s-14 grey-636'>Already have an account? <span className='blue-268 cp' onClick={this.handleSignIn}>Sign in</span></h4>}
                    <p className='inter-display-medium f-s-13 grey-ADA'>Don't worry. All your information remains private and anonymous. <Image src={infoicon} title="We do not link wallet addresses back to you unless you explicitly give us your email or phone number. "/> </p>
                </div>
                </Form>
                </>
              }
            </Modal.Body>
        </Modal>
    );
};
}
export default OnboardingModal2;