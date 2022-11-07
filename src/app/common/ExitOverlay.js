import React from 'react'
import BaseReactComponent from './../../utils/form/BaseReactComponent';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import ExitOverlayIcon from '../../assets/images/icons/ExitOverlayWalletIcon.png'
import Form from '../../utils/form/Form'
import FormElement from '../../utils/form/FormElement'
import FormValidator from './../../utils/form/FormValidator';
import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CustomTextControl from './../../utils/form/CustomTextControl';
import InfoIcon from "../../assets/images/icons/info-icon.svg";
// import EditBtnImage from "../../assets/images/icons/EditBtnImage.svg";
// import Dropdown from '../common/DropDown.js';
import CopyLink from '../../assets/images/icons/CopyLink.svg';
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ShareLink from '../../assets/images/icons/ShareLink.svg'
import {fixWalletApi} from './Api.js'
import { BASE_URL_S3 } from '../../utils/Constant';
import { toast } from 'react-toastify';
import ApiModalIcon from '../../assets/images/icons/ApiModalIcon.svg';
import ApiModalFrame from '../../assets/images/api_Modal_Frame.jpg';

class ExitOverlay extends BaseReactComponent {

    constructor(props) {
        super(props);
        const dummyUser= localStorage.getItem("lochDummyUser");
        this.state = {
          dummyUser,
          show: props.show,
          link: `${BASE_URL_S3}portfolio/${dummyUser}`,
          isactive:false,
          email: "",
          dropdowntitle : "View and edit",
          activeli:"View and edit",
          onHide : props.onHide,
          showRedirection: false,
        }
    }

    copyLink = () => {
        navigator.clipboard.writeText(this.state.link);
    }
    handleSave = () => {
        let email_arr = []
        let data = JSON.parse(localStorage.getItem("addWallet"))
        if (data) {
            data.map((info) => {
                email_arr.push(info.address)
            })
            const url = new URLSearchParams()
            url.append('user_name', this.state.email);
            url.append('wallet_addresses', JSON.stringify(email_arr));
            fixWalletApi(this, url)
        }
    }
    handleRedirection = () => {
      console.log('this',this.props);
      this.setState({show: false, showRedirection: true})
      this.props.handleRedirection();
    }
    handleSelect = (e) => {
        console.log(e)
        this.setState({
            dropdowntitle: e,
            activeli: e,

        })
    }


    render() {

        return (
            <Modal
                show={this.state.show}
                className="exit-overlay-form"
                backdrop="static"
                size="lg"
                dialogClassName={"exit-overlay-modal"}
                centered
                aria-labelledby="contained-modal-title-vcenter"
                backdropClassName="exitoverlaymodal"
            >
              {
                this.state.showRedirection &&
                toast.success(
                  <div className="custom-toast-msg">
                    <div>Successful</div>
                    <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                    Please check your mailbox for the verification link
                    </div>
                  </div>
                  )
              }
                <Modal.Header>
                    {
                    this.props.modalType === "apiModal"
                    ?
                    <div className="api-modal-header">
                        <Image src={ApiModalIcon}/>
                    </div>
                    :
                    <Image src={ExitOverlayIcon}
                        className="exitOverlayIcon" />
                    }
                    <div className="closebtn" onClick={this.state.onHide}>
                        <Image src={CloseIcon} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {this.props.modalType === "apiModal" 
                    ? 
                    <div className='api-modal-body'>
                        <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">{this.props.headerTitle}</h6>
                        <p className='inter-display-regular f-s-13 lh-16 grey-B0B'>Personalized digital asset intelligence via API</p>
                        <div className="api-modal-frame">
                        <Image src={ApiModalFrame} />
                        <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon</p>
                        </div>
                    </div>
                    
                    
                    :
                    
                    <div className='exit-overlay-body'>
                        <h6 className='inter-display-medium f-s-20 lh-24 '>Don’t lose your data</h6>
                        <p className='inter-display-medium f-s-16 lh-19 grey-7C7'>
                            Access your data again through the unique reusable link,
                        </p>
                        <p className='inter-display-medium f-s-16 lh-19 grey-7C7 m-b-10'>
                            or link your email
                        </p>
                        <div className="email-section">
                            <Form onValidSubmit={this.handleSave}>
                                <FormElement
                                    valueLink={this.linkState(this, "email")}
                                    // label="Email Info"
                                    required
                                    validations={[
                                      {
                                        validate: FormValidator.isRequired,
                                        message: ""
                                      },
                                      {
                                        validate: FormValidator.isEmail,
                                        message: "Please enter valid email id"
                                      }
                                    ]}
                                    control={
                                        {
                                            type: CustomTextControl,
                                            settings: {
                                                placeholder: "Email"
                                            }
                                        }
                                    }
                                />
                                <div className='save-btn-section'>
                                    <Button className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${this.state.email ? "active" : ""}`}
                                        type="submit">Save</Button>
                                </div>
                            </Form>
                        </div>
                        <p className="inter-display-medium f-s-16 lh-19 grey-ADA m-b-28">or</p>
                        <div className='m-b-24 links'>
                            <div className="inter-display-medium f-s-16 lh-19 black-191 linkInfo">{this.state.link}</div>
                            {/* <div className='edit-options'>
                                <Image src={EditBtnImage} className="m-r-8"/>
                                <Dropdown
                                    id="edit-option-dropdown"
                                    title={this.state.dropdowntitle}
                                    list={["View and edit" , "View only"]}
                                    onSelect={this.handleSelect}
                                    activetab = {this.state.activeli}
                                />
                            </div> */}
                        </div>
                        <div className='copy-link-section'>
                            <div className='m-r-42 link' onClick={this.copyLink}>
                                <Image src={CopyLink} className="m-r-8"/>
                                <h3 className='inter-display-medium f-s-16 lh-19 black-191'>Copy link</h3>
                            </div>
                            <div className='link'>
                                <Image src={ShareLink} className="m-r-8"/>
                                <h3 className='inter-display-medium f-s-16 lh-19 black-191'>Share</h3>
                            </div>
                        </div>

                        <div className='m-b-36 footer'>
                            <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">At Loch, we care intensely about your privacy and anonymity.</p>
                            <CustomOverlay
                                text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                                position="top"
                                isIcon={true}
                                IconImage={LockIcon}
                                isInfo={true}
                            ><Image src={InfoIcon} className="info-icon" /></CustomOverlay>
                        </div>
                    </div>
                    }
                </Modal.Body>
            </Modal >
        )
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
  fixWalletApi
}
ExitOverlay.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitOverlay);