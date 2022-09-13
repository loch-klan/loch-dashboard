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

class EditWalletModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            handleClose: props.handleClose,
            walletIcon: props.walletIcon,
            onHide: props.onHide,
            walletAddress: props.walletAddress,
            walletTag: ""
        }
        this.chipJson = [
            {
                coinSymbol: EtherIcon,
                coinName: "Ethereum"
            },
            {
                coinSymbol: EtherIcon,
                coinName: "Ethereum"
            },
            {
                coinSymbol: EtherIcon,
                coinName: "Ethereum"
            }
        ]
    }



    onValidSubmit = (done, event) => {
        console.log("Value submitted");
        console.log("Form Submitted");
    };



    render() {
        const chips = this.chipJson.map((e, index) => {
            return (
                <div className='chipcontainer'>
                    <Image src={e.coinSymbol} />
                    <div className='inter-display-medium f-s-13 lh-16'>{e.coinName}</div>
                
                </div>
            )
        })
        return (
            <Modal
                show={this.state.show}
                onClick={this.state.handleClose}
                className="edit-wallet-form"
                backdrop="static"
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
                        <h6 className='inter-display-medium f-s-20 lh-24 m-b-4 title'>Metamask</h6>
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
                                    required
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
}
EditWalletModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletModal);