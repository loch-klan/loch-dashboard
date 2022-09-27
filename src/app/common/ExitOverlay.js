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
import EditBtnImage from "../../assets/images/icons/EditBtnImage.svg";
import Dropdown from '../common/DropDown.js';
import CopyLink from '../../assets/images/icons/CopyLink.svg';
import ShareLink from '../../assets/images/icons/ShareLink.svg'
import {fixWallet} from './Api.js'
class ExitOverlay extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            link:props.link,
            isactive:false,
            Email:"",
            dropdowntitle : "View and edit",
            activeli:"View and edit",
            onHide : props.onHide
        }
    }

    copyLink = ()=>{
        navigator.clipboard.writeText(this.state.link);
    }
    handleSave = ()=>{
        console.log("Save")
        let email_arr = []
        let data =JSON.parse(localStorage.getItem("addWallet"))
        if(data){
            data.map((info)=>{
                email_arr.push(info.address)
            })
            const url = new URLSearchParams()
            url.append('user_name',this.state.Email);
            url.append('wallet_addresses',JSON.stringify(email_arr));
            this.props.fixWallet(this,url)
        }
    }
    handleSelect = (e)=>{
        console.log(e)
        this.setState({
            dropdowntitle : e,
            activeli:e,

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
                <Modal.Header>
                    <Image src={ExitOverlayIcon}
                        className="exitOverlayIcon" />

                    <div className="closebtn" onClick={this.state.onHide}>
                        <Image src={CloseIcon} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='exit-overlay-body'>
                        <h6 className='inter-display-medium f-s-20 lh-24 '>Don’t lose your data</h6>
                        <p className='inter-display-medium f-s-16 lh-19 grey-7C7'>
                            Access your data again through the unique reusable link,
                        </p>
                        <p className='inter-display-medium f-s-16 lh-19 grey-7C7 m-b-10'>
                            or link your email
                        </p>
                        <div className="email-section">
                            <Form>
                                <FormElement
                                    valueLink={this.linkState(this, "Email")}
                                    // label="Email Info"
                                    required
                                    validations={[
                                        {
                                            validate: FormValidator.isRequired,
                                            message: "Field cannot be empty"
                                        },
                                        {
                                            validate: FormValidator.isEmail,
                                            message: "Please enter a valid email"
                                        }
                                    ]}
                                    control={
                                        {
                                            type: CustomTextControl,
                                            settings: {
                                                placeholder: "Enter Email"
                                            }
                                        }
                                    }
                                />
                                <div className='save-btn-section'>
                                    <Button className={`inter-semi-bold f-s-16 lh-19 white save-btn ${this.state.Email ? "active" : ""}`}
                                    onClick={this.state.Email &&this.handleSave }>Save</Button>
                                </div>
                            </Form>
                        </div>
                        <p className="inter-display-medium f-s-16 lh-19 grey-ADA m-b-28">or</p>
                        <div className='m-b-24 links'>
                            <div className="inter-display-medium f-s-16 lh-19 black-191 m-r-16 linkInfo">{this.state.link}</div>
                            <div className='edit-options'>
                                <Image src={EditBtnImage} className="m-r-8"/>
                                <Dropdown
                                    id="edit-option-dropdown"
                                    title={this.state.dropdowntitle}
                                    list={["View and edit" , "View only"]}
                                    onSelect={this.handleSelect}
                                    activetab = {this.state.activeli}
                                />
                            </div>
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
                            <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">Don't worry. All your information remains private and anonymous.</p>
                            <Image src={InfoIcon} />
                        </div>
                    </div>

                </Modal.Body>
            </Modal >
        )
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
    fixWallet
}
ExitOverlay.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitOverlay);