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
import Banner from "../../image/Frame.png"
import EthereumCoin from '../../assets/images/icons/ether-coin.svg'
import CustomChip from "../../utils/commonComponent/CustomChip";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CloseBtn from "../../assets/images/icons/CloseBtn.svg"
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CloseIcon from '../../assets/images/icons/CloseIcon.svg'
class CommonModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            onHide: props.onHide,
            show: props.show,
            modalIcon: props.modalIcon,
            title: props.title,
            subtitle: props.subtitle,
            fixWalletAddress: props.fixWalletAddress,
            btnText: props.btnText,
            btnStatus: props.btnStatus,
            modalType: props.modalType,
            addwalletlist: [],
            showelement: false,
            walletTitle: "Metamask",
            chainTitle: "Ethereum"
        }
    }

    onValidSubmit = (done, event) => {
        console.log("Value Submitted")
    }

    handleOnchange = (e) => {
        // console.log(e.target)
        let { name, value ,id} = e.target
        console.log(name, value)
        let addresslist = [...this.state.addwalletlist]
        console.log(addresslist)
        let obj = {
            name: `wallet${id}`,
            address: value
        }
        addresslist[id] = obj
        if (addresslist[0].address !== "") {
            this.setState({
                showelement: true,
                addwalletlist: addresslist,
            })
        }
        else {
            this.setState({
                showelement: false,
                // addwalletlist : addresslist,
            })
        }
    }
    componentDidMount() {
        if (this.state.modalType === "addwallet") {
            let localdata = JSON.parse(localStorage.getItem("addWallet"))
            if (localdata) {
                this.setState({
                    addwalletlist: localdata
                })
            }
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

    handleSelectWallet = (e) => {
        console.log(e)
        this.setState({
            walletTitle: e,
        })
    }
    handleSelectChain = (e) => {
        this.setState({
            chainTitle: e,
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
                                onSelect={this.handleSelectWallet}
                                activetab={this.state.walletTitle}

                            />
                            <Dropdown
                                id="fix-chain-dropdown"
                                title="Chain"
                                list={["Ethereum", "Bitcoin", "Helium", "Avalanche", "Unicoin", "Maker", "Matic", "Matic", "Flow", "Cosmos", "Others"]}
                                onSelect={this.handleSelectChain}
                                activetab={this.state.chainTitle}
                            />
                        </div>
                    </div>)
            }) : ""


        const wallets =
            this.state.addwalletlist.map((elem, index) => {

                return (<div className='m-b-12 add-wallet-input-section' key={index} >
                    {index >= 1 ? <Image src={DeleteIcon} className="delete-icon" onClick={() => this.deleteAddress(elem.id)} /> : ""}

                    <input
                        autoFocus
                        name={`wallet${index + 1}`}
                        value={elem.address || ""}
                        placeholder="Paste any wallet address here"
                        className='inter-display-regular f-s-16 lh-20'
                        onChange={(e) => this.handleOnchange(e)}
                        id={elem.id}
                    />

                    {elem.coinFound ?
                        <CustomChip coins={elem.coins.filter((c) => c.chain_detected)} isLoaded={true}></CustomChip>
                        :
                        elem.address !== "" ?
                            <CustomChip coins={null} isLoaded={true}></CustomChip>
                            : ""
                    }


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
                    <Modal.Header
                        style={{ padding: `${this.state.modalType === "fixwallet" ? '2.8rem ' : ''}` }}
                        className={this.state.modalType==="addwallet"?
                        "add-wallet":""}
                        >
                        {this.state.modalType === "addwallet" &&
                            <div>
                                <Image src={Banner} className="banner-img" />
                                <div className='wallet-header'>
                                    <Image src={this.state.modalIcon} className="m-b-20" />
                                    <h4 className="inter-display-medium f-s-31 lh-37 white m-b-4">{this.state.title}</h4>
                                    <p className={"inter-display-medium f-s-13 lh-16 white op-8 "}>{this.state.subtitle}</p>
                                </div>
                            </div>
                        }
                        <div className="closebtn" onClick={this.state.onHide}>
                            <Image src={this.state.modalType ==="fixwallet" ? CloseIcon : CloseBtn} />
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={`fix-add-modal-body ${this.state.modalType === "addwallet" ? 'm-t-30' : ""}`}>
                            {this.state.modalType === "fixwallet" &&
                                <div>
                                    <h6 className="inter-display-medium f-s-20 lh-24 ">{this.state.title}</h6>
                                    <p className={`inter-display-medium f-s-16 lh-19 grey-7C7 ${this.modalIcon ? "m-b-52" : "m-b-77"}`}>{this.state.subtitle}</p>
                                </div>
                            }

                            {this.state.modalType === "fixwallet" && <div className="fix-modal-input">
                                {inputs}
                            </div>}
                            {this.state.modalType === "addwallet" && <div className="add-modal-inputs">
                                {wallets}
                            </div>}

                            {this.state.addwalletlist.length >= 1 &&
                                <div className="m-b-32 add-wallet-btn">
                                    <Button className="grey-btn" onClick={this.addAddress} >
                                        <img src={PlusIcon} /> Add another
                                    </Button>
                                </div>}
                            {/* input field for add wallet */}
                            <div className='btn-section'>
                                <Button className={`primary-btn ${this.state.btnStatus === "active" || this.state.showelement || this.state.modalType === "addwallet"? "activebtn" : ""} ${this.state.modalType === "fixwallet" ? "fix-btn" : this.state.modalType === "addwallet" ? "add-btn" : ""}`}>{this.state.btnText}</Button>
                            </div>
                            <div className='m-b-26 footer'>
                                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">Don't worry. All your information remains private and anonymous.
                                    <CustomOverlay
                                        text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                                        position="top"
                                        isIcon={true}
                                        IconImage={LockIcon}
                                        isInfo={true}
                                    ><Image src={InfoIcon} className="info-icon cp" /></CustomOverlay>
                                </p>
                                
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
