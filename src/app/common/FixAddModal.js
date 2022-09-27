import React from 'react'
import BaseReactComponent from '../../utils/form/BaseReactComponent';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import Form from '../../utils/form/Form'
import FormElement from '../../utils/form/FormElement'
import FormValidator from './../../utils/form/FormValidator';
import CustomTextControl from './../../utils/form/CustomTextControl';
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import Dropdown from '../common/DropDown.js';
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";

import EthereumCoin from '../../assets/images/icons/ether-coin.svg'

class CommonModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            onHide: props.onHide,
            show: props.show,
            closeIcon: props.closeIcon,
            modalIcon: props.modalIcon,
            title: props.title,
            subtitle: props.subtitle,
            fixWalletAddress: props.fixWalletAddress,
            btnText: props.btnText,
            btnStatus: props.btnStatus,
            modalType: props.modalType,
            addwalletlist: [{name:"wallet0",address:""}],
            showelement: false,
        }
    }

    onValidSubmit = (done, event) => {
        console.log("Value Submitted")
    }

    handleOnchange = (e) => {
        // console.log(e.target)
        let { name, value, id } = e.target
        console.log(name, value, id)
        let addresslist = [...this.state.addwalletlist]
        // console.log(address)
        let obj = {
            name:`wallet${id}`,
            address:value
        }
        addresslist[id] = obj
        if (addresslist[0].address !== "") {
            this.setState({
                showelement: true,
                addwalletlist : addresslist,
            })
        }
        else {
            this.setState({
                showelement: false,
                // addwalletlist : addresslist,
            })
        }
    }

    addAddress = ()=>{
        this.state.addwalletlist.push({
            name:`wallet${this.state.addwalletlist.length}`,
            address:""
        })
        this.setState({
            addwalletlist : this.state.addwalletlist
        })
    }

    deleteAddress = (index)=>{
        // console.log(.target)
        // let {id} = e.target
        // let name = `wallet${id}`
        let prevaddress = [...this.state.addwalletlist]
        // console.log(index)
        // console.log(prevaddress[index])
        // console.log(prevaddress)
        let temp = `wallet${index}`
        let new_arr = prevaddress.filter((e)=> e.name !== temp )

        this.setState({
            addwalletlist: new_arr
        })
    }



    render() {

        const inputs = this.state.modalType == "fixwallet" ?
            this.state.fixWalletAddress.map((address, index) => {
                return (
                    <div className="m-b-12 fix-wallet-input">
                        <input value={address} className="inter-display-regular f-s-16  lh-19 black-191" type="text" />
                        <div className="fix-dropdowns">
                            <Dropdown
                                id="fix-wallet-dropdown"
                                title="Wallet"
                                list={["Metamask", "Phantom", "Coinbase", "Gamestop", "Brave", "Rabby", "Portis", "Trust Wallet by Binance", "Others"]}

                            />
                            <Dropdown
                                id="fix-chain-dropdown"
                                title="Chain"
                                list={["Ethereum", "Bitcoin", "Helium", "Avalanche", "Unicoin", "Maker", "Matic", "Matic", "Flow", "Cosmos", "Others"]}
                            />
                        </div>
                    </div>)
            }) : ""


        const wallets =
            this.state.addwalletlist.map((elem, index) => {

                return (<div className='m-b-12 add-wallet-input-section' key={index} >
                    {this.state.showelement && index >= 1 ? <Image src={DeleteIcon} className="delete-icon" onClick={()=>this.deleteAddress(index)} /> :""}

                    <input
                        autoFocus
                        name={`wallet${index}`}
                        value={elem.address || ""}
                        placeholder="Paste any wallet address here"
                        className='`inter-display-regular f-s-16 lh-20'
                        onChange={(e) => this.handleOnchange(e)}
                        id={index}
                    />

                    {this.state.showelement && <div className='inter-display-medium f-s-13 lh-16 customchip'>
                        <Image src={EthereumCoin}/>
                        Ethereum
                    </div>}

                </div>)
            })



        return (

            <>
                {console.log(this.state)}
                <Modal
                    show={this.state.show}
                    className="fix-add-modal"
                    backdrop="static"
                    size="lg"
                    dialogClassName={"fix-add-modal"}
                    centered
                    aria-labelledby="contained-modal-title-vcenter"
                    backdropClassName="fixaddmodal"
                >
                    <Modal.Header>
                        {this.state.modalType === "addwallet" && <Image src={this.state.modalIcon} className="m-t-8" />}
                        <div className="closebtn" onClick={this.state.onHide}>
                            <Image src={this.state.closeIcon} />
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='fix-add-modal-body'>
                            <h6 className="inter-display-medium f-s-20 lh-24 ">{this.state.title}</h6>
                            <p className={`inter-display-medium f-s-16 lh-19 grey-7C7 ${this.modalIcon ? "m-b-52" : "m-b-77"}`}>{this.state.subtitle}</p>

                            {this.state.modalType === "fixwallet" && <div className="fix-modal-input">
                                {inputs}
                            </div>}
                            {this.state.modalType === "addwallet" && <div className={`add-modal-inputs ${this.state.showelement ? "" : "m-b-63"}`}>
                                {wallets}
                            </div>}

                            {this.state.showelement &&
                                <div className="m-b-32 add-wallet-btn">
                                    <Button className="grey-btn" onClick={this.addAddress} >
                                        <img src={PlusIcon} /> Add another
                                    </Button>
                                </div>}
                            {/* input field for add wallet */}
                            <div className='btn-section'>
                                <Button className={`primary-btn ${this.state.btnStatus === "active" || this.state.showelement  ? "activebtn" : ""} ${this.state.modalType === "fixwallet" ? "fix-btn" : this.state.modalType === "addwallet" ? "add-btn" : ""}`}>{this.state.btnText}</Button>
                            </div>
                            <div className='m-b-26 footer'>
                                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">Don't worry. All your information remains private and anonymous.</p>
                                <Image src={InfoIcon} />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal >
            </>
        )
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
CommonModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonModal);
