import React from 'react'
import { Modal, Image, Row, Col, Button } from 'react-bootstrap'
import CloseIcon from '../../assets/images/icons/close-icon.svg'
import Form from '../../utils/form/Form'
import { connect } from 'react-redux';
import FormElement from '../../utils/form/FormElement'
import EthereumCoinIcon from '../../assets/images/Ethereum_Coin_Tag.svg'
import CustomTextControl from '../../utils/form/CustomTextControl'
import CustomChip from '../../utils/commonComponent/CustomChip'
import FormValidator from './../../utils/form/FormValidator';
import Wallet from './Wallet';
import BaseReactComponent from './../../utils/form/BaseReactComponent';
import EtherIcon from '../../assets/images/icons/ether-coin.svg'
import DropDown from './../common/DropDown';
import {updatewallet , getwallets} from './Api.js'
class EditWalletModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            handleClose: props.handleClose,
            walletIcon: props.walletIcon,
            onHide: props.onHide,
            walletAddress: props.walletAddress,
            walletTag: "",
            dropDownList:props.dropDownList,
            dropDownActive:{},
            coinchips:props.coinchips
        }
    }


    handleDroDownSelect = (title)=>{
        console.log(title.split(' '))
        let id = title.split(' ')[3]
        let index = this.state.dropDownList.findIndex(e => e.id === id)
        let coin  = this.state.dropDownList[index]
        // console.log("Active",coin)
        this.setState({
            dropDownActive: coin
        })
    }

    onValidSubmit = (done, event) => {
        console.log("Value submitted");
        console.log("Form Submitted");
        let data = new URLSearchParams()
        data.append("wallet_address",this.state.walletAddress)
        data.append("wallet_id",this.state.dropDownActive.id ? this.state.dropDownActive.id : "")
        data.append("tag",this.state.walletTag)

        this.props.updatewallet(this,data)
       
    };


    render() {
        const chips = this.state.coinchips.map((e, index) => {
            return (
                <div className='chipcontainer' key={index}>
                    <Image src={e.symbol} />
                    <div className='inter-display-medium f-s-13 lh-16' >{e.name}</div>
                </div>
            )
        })
        return (
            <Modal
                show={this.state.show}
                onClick={this.state.handleClose}
                className="edit-wallet-form"
                onHide={this.state.onHide}
                size="lg"
                dialogClassName={"edit-wallet-modal"}
                centered
                aria-labelledby="contained-modal-title-vcenter"
                backdropClassName="editmodal"
            >
                <Modal.Header>
                    <Image src={this.state.walletIcon} className="walletIcon" />
                    <div className="closebtn" onClick={this.state.onHide}>
                        <Image src={CloseIcon} />
                    </div>

                    <div className='triangle-up'></div>

                </Modal.Header>
                <Modal.Body>

                    <div className='edit-wallet-body'>
                        {/* <h6 className='inter-display-medium f-s-20 lh-24 m-b-4 title'>Metamask</h6> */}
                        <DropDown
                            id="dropdown-basic-editwallet-button"
                            title={this.state.dropDownActive.name ? this.state.dropDownActive.name : "" }
                            list={this.state.dropDownList}
                            class={this.state.dropDownActive.name ? "":"arrowdown" }
                            onSelect={this.handleDroDownSelect}
                        />
                        <p className='inter-display-regular f-s-13 lh-16 m-b-16 subtitle'>added 3 days ago</p>

                        <div className='m-b-32 coinchips'>
                            {/* <CustomChip coins={chipJson}></CustomChip> */}
                            {chips}
                        </div>

                        <div className='edit-form'>
                            <Form onValidSubmit={this.onValidSubmit}>
                                <FormElement
                                    valueLink={this.linkState(
                                        this, "walletAddress"
                                    )}
                                    label="Wallet Address"
                                    // required
                                    disabled
                                    validations={[
                                        {
                                            validate: FormValidator.isRequired,
                                            message: "Field cannot be empty"
                                        }
                                    ]}
                                    control={{
                                        type: CustomTextControl,
                                    }}
                                />

                                <FormElement
                                    valueLink={this.linkState(
                                        this, "walletTag"
                                    )}
                                    label="Wallet tag"
                                    required
                                    validations={[
                                        {
                                            validate: FormValidator.isRequired,
                                            message: "Field cannot be empty"
                                        }
                                    ]}

                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "My main wallet",
                                        }
                                    }}
                                />
                                <div className='edit-btns'>
                                    <Button className="inter-display-semi-bold f-s-16 lh-19 m-r-24 delete-btn">
                                        Delete wallet
                                    </Button>
                                    <Button className='primary-btn' type="submit">Save changes</Button>
                                </div>
                            </Form>
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
    updatewallet,
    getwallets,
}
EditWalletModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletModal);