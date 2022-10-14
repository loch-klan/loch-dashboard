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
import { getAllCoins, detectCoin } from "../onboarding//Api";
import { updateUserWalletApi } from './Api';
import { updateWalletApi } from './../wallet/Api';
import { getAllWalletApi } from '../wallet/Api'
class FixAddModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        const addWalletList = JSON.parse(localStorage.getItem("addWallet")) || []
        this.state = {
            onHide: props.onHide,
            show: props.show,
            modalIcon: props.modalIcon,
            title: props.title,
            subtitle: props.subtitle,
            fixWalletAddress: props.fixWalletAddress,
            fixWalletAddress: [],
            btnText: props.btnText,
            btnStatus: props.btnStatus,
            modalType: props.modalType,
            addWalletList,
            currentCoinList: [],
            showelement: false,
            walletTitleList: [],
            chainTitleList: [],
            changeList: props.changeWalletList,
            pathName: props.pathName,
            walletNameList: []
        }
        this.timeout = 0

    }



    handleOnchange = (e) => {

        let { name, value } = e.target
        let prevWallets = [...this.state.addWalletList]
        let currentIndex = prevWallets.findIndex(elem => elem.id === name)
        if (currentIndex > -1) {
            prevWallets[currentIndex].address = value
            if (value === "") {
                prevWallets[currentIndex].coins = []
            }
        }
        this.setState({
            addWalletList: prevWallets
        })
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnAddress(name, value);
        }, 1000)
    }

    getCoinBasedOnAddress = (name, value) => {
        if (this.props.OnboardingState.coinsList && value) {
            for (let i = 0; i < this.props.OnboardingState.coinsList.length; i++) {
                this.props.detectCoin({
                    id: name,
                    coinCode: this.props.OnboardingState.coinsList[i].code,
                    coinSymbol: this.props.OnboardingState.coinsList[i].symbol,
                    coinName: this.props.OnboardingState.coinsList[i].name,
                    address: value,
                    // isLast: i === (this.props.OnboardingState.coinsList.length - 1)
                }, this)
            }
        }
    }
    handleSetCoin = (data) => {
        let coinList = {
            chain_detected: true,
            coinCode: data.coinCode,
            coinName: data.coinName,
            coinSymbol: data.coinSymbol
        }
        let i = this.state.addWalletList.findIndex(obj => obj.id === data.id)
        let newAddress = this.state.modalType === "addwallet" ? [...this.state.addWalletList] : [...this.state.fixWalletAddress]
        newAddress[i].coins.push(coinList)
        newAddress[i].coinFound = true
        if(this.state.modalType === "addwallet"){
        this.setState({
            addWalletList: newAddress
        })}
        else if(this.state.modalType==="fixwallet"){
            this.setState({
                fixWalletAddress : newAddress
            })
        }
    }
    componentDidMount() {
        this.props.getAllCoins()
        getAllWalletApi(this)

        const fixWallet = []
        JSON.parse(localStorage.getItem("addWallet")).map((e)=>{
            if(e.coinFound !== true){
                fixWallet.push({...e ,id:`wallet${fixWallet.length + 1}`})
            }
        })
        this.setState({
            fixWalletAddress : fixWallet
        })
    }
    addAddress = () => {
        this.state.addWalletList.push({
            id: `wallet${this.state.addWalletList.length + 1}`,
            address: "",
            coins: [],
        })
        this.setState({
            addWalletList: this.state.addWalletList
        })
    }

    deleteAddress = (index) => {

        this.state.addWalletList.splice(index, 1)
        this.state.addWalletList.map((w, i) => { w.id = `wallet${i + 1}` })

        this.setState({
            addWalletList: this.state.addWalletList
        })

    }
    deleteFixWalletAddress = (e) =>{
        let {id , address} = e
        console.log(id,address)

        // remove from fixwalletState
        let fixWalletNewArr = []
        this.state.fixWalletAddress.map((wallet,index)=>{
            if(wallet.id !== id)
            {
                fixWalletNewArr.push(wallet)
            }
        })

        // fixWalletNewArr.map((wallet,index)=>{
        //     wallet.id = `wallet${index+1}`
        // })
        // remove from localStorage
        // let arr = JSON.parse(localStorage.getItem("addWallet"))
        // let localArr = []
        // arr.map((wallet,index)=>{
        //     if(wallet.id !== actId){
        //         localArr.push(wallet)
        //     }
        // })
        // localArr.map((wallet,index)=>{
        //     wallet.id = `wallet${index+1}`
        // })
        // console.log("LocalStorage localArr" , localArr)
        // console.log("FixWallet Arr" , fixWalletNewArr)
        // localStorage.setItem("addWallet",JSON.stringify(localArr))
        this.setState({
            fixWalletAddress : fixWalletNewArr 
        })
    }
    handleSelectWallet = (e) => {
        let current = e.split(' ')
        console.log(current[3])
        // let newWalletList = [...this.state.walletTitleList]
        // newWalletList[current[0]] = current[1]
        this.setState({
            walletTitleList: current[3],
        })
    }
    handleSelectChain = (e) => {
        let current = e.split(' ')
        console.log(current[3])
        // let newChainList = [...this.state.chainTitleList]
        // newChainList[current[0]] = current[3]
        this.setState({
            chainTitleList: current[3],
        })
    }

    handleAddWallet = () => {
        if (this.state.addWalletList) {

            let arr = []
            let walletList = []
            for (let i = 0; i < this.state.addWalletList.length; i++) {
                let curr = this.state.addWalletList[i]
                if (!arr.includes(curr.address)) {
                    walletList.push(curr)
                    arr.push(curr.address)
                }
            }

            // console.log("Arr" , arr)
            // console.log("walletList" ,walletList)
            localStorage.setItem("addWallet", JSON.stringify(walletList))
            { this.state.changeList && this.state.changeList(walletList) }
            this.state.onHide()
            // this.state.addWalletList.map((list)=>walletList.push(list.address))
            const data = new URLSearchParams();
            data.append("wallet_addresses", JSON.stringify(arr))

            updateUserWalletApi(data, this);
            if (this.props.handleUpdateWallet) {
                this.props.handleUpdateWallet()
            }

            // this.props.history.push({
            //     pathname:"/portfolio",
            //     state:{
            //         addWallet:this.state.addWalletList
            //     }
            // })
        }
        
    }

    handleFixWalletChange = (e) => {
        let { name, value } = e.target
        let prevWallets = [...this.state.fixWalletAddress]
        let currentIndex = prevWallets.findIndex(elem => elem.id === name)
        prevWallets[currentIndex].address = value
        console.log(name,value,currentIndex)
        this.setState({
           fixWalletAddress : prevWallets
        })
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnAddress(name, value);
        }, 1000)
        // let { name, value } = e.target
        // // console.log(id, value)
        // let newArr = [...this.state.fixWalletAddress]
        // let currentIndex = newArr.findIndex(elem => elem.id === name)
        // newArr[currentIndex] = value
        // console.log("newArr",newArr)
        // this.setState({
        //     fixWalletAddress: newArr
        // })
        // if (this.timeout) {
        //     clearTimeout(this.timeout)
        // }
        // this.timeout = setTimeout(() => {
        //     // this.getCoinBasedOnAddress(name, value);
        // }, 1000)
    }

    handleFixWallet = () => {
        // console.log("HELLo Fixing Wallet")
         
        let wallets = JSON.parse(localStorage.getItem("addWallet"))
        
        let localArr = []
        for(let i  = 0 ;i < wallets.length ;i++)
        {
            let curr = wallets[i];
            if(!curr.coinFound)
            {
                this.state.fixWalletAddress.map((wallet)=>{
                    if(wallet.address === curr.address )
                    {
                        localArr.push(wallet)
                    }
                    else if(wallet.coinFound === true)
                    {
                        localArr.push(wallet)
                    }
                })
            }
            else{
                localArr.push(wallets[i])
            }
        }

        // localArr.map((w,index) =>w.id = `wallet${index+1}` )
        console.log("FixWallet - local Prev",localArr )
        // remove repeat address if same address added for unrecognised wallet
        let newArr = []
        let walletList = []
        for (let i = 0; i < localArr.length; i++) {
            let curr = localArr[i]
            if (!newArr.includes(curr.address)) {
                walletList.push(curr)
                newArr.push(curr.address)
            }
        }
        console.log("FixWallet - local",walletList )
        console.log("FixWallet - newArr",newArr )
        walletList.map((w,index) =>w.id = `wallet${index+1}` )
        localStorage.setItem("addWallet",JSON.stringify(walletList))
        this.state.onHide()
            // this.state.addWalletList.map((list)=>walletList.push(list.address))
        { this.state.changeList && this.state.changeList(walletList) }
        const data = new URLSearchParams();
        data.append("wallet_addresses", JSON.stringify(newArr))

        updateUserWalletApi(data, this);
        if(this.props.handleUpdateWallet)
        {
            this.props.handleUpdateWallet()
        }
        // let data = new URLSearchParams()
        // data.append("wallet_address", this.state.fixWalletAddress)
        // data.append("wallet_id", this.state.walletTitleList)
        // data.append("chain_id", this.state.chainTitleList)
        // updateWalletApi(this, data);
    }

    isDisabled = () => {
        let isDisableFlag = false;
        if (this.state.addWalletList.length <= 0) {
            isDisableFlag = true;
        }

        this.state.addWalletList.map((e) => {
            if (!e.address) {
                isDisableFlag = true;
            }
        })
        return isDisableFlag;
    }


    render() {
        let walletDropDownList = []
        this.state.walletNameList.map((wallet) => {
            walletDropDownList.push({ name: wallet.name, id: wallet.id })
        })
        const inputs = this.state.modalType == "fixwallet" ?
            this.state.fixWalletAddress.map((elem, index) => {
                return (
                    <div className="m-b-12 fix-wallet-input" key={index}>
                       <Image src={DeleteIcon} className="delete-icon" onClick={() => this.deleteFixWalletAddress(elem)} /> 
                        <input
                            value={elem.address || ""}
                            className="inter-display-regular f-s-16  lh-19 black-191"
                            type="text"
                            // id={index}
                            id={elem.id}
                            name={`wallet${index + 1}`}
                            autoFocus
                            onChange={(e) => this.handleFixWalletChange(e)}
                        />
                        {/* <div className="fix-dropdowns"> */}
                        {
                            elem.address
                                ?
                                elem.coinFound && elem.coins.length > 0
                                    ?
                                    <CustomChip coins={elem.coins.filter((c) => c.chain_detected)} key={index} isLoaded={true}></CustomChip>
                                    :
                                    elem.coins.length === this.props.OnboardingState.coinsList.length
                                        ?
                                        <CustomChip coins={null} key={index} isLoaded={false}></CustomChip>
                                        :
                                        <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                                :
                                ""
                        }
                        {/* </div> */}
                        {/* <div className="fix-dropdowns">

                            <Dropdown
                                id={index}
                                title="Wallet"
                                // list={["Metamask", "Phantom", "Coinbase", "Gamestop", "Brave", "Rabby", "Portis", "Trust Wallet by Binance", "Others"]}
                                list={walletDropDownList}
                                onSelect={this.handleSelectWallet}
                                activetab={this.state.walletTitleList[index]}

                            />
                            <Dropdown
                                id={index}
                                title="Chain"
                                list={this.props.OnboardingState.coinsList}
                                onSelect={this.handleSelectChain}
                                activetab={this.state.chainTitleList[index]}
                                showChain={true}
                            />
                        </div> */}

                    </div>)
            }) : ""


        const wallets =
            this.state.addWalletList.map((elem, index) => {
                // console.log('elem',elem);
                // console.log('this.props',this.props.OnboardingState.coinsList);
                return (<div className='m-b-12 add-wallet-input-section' key={index} >
                    {index >= 1 ? <Image src={DeleteIcon} className="delete-icon" onClick={() => this.deleteAddress(index)} /> : ""}

                    <input
                        autoFocus
                        name={`wallet${index + 1}`}
                        value={elem.address || ""}
                        placeholder="Paste any wallet address here"
                        // className='inter-display-regular f-s-16 lh-20'
                        className={`inter-display-regular f-s-16 lh-20 ${elem.address ? 'is-valid' : null}`}
                        onChange={(e) => this.handleOnchange(e)}
                        id={elem.id}
                    />
                    {
                        elem.address
                            ?
                            elem.coinFound && elem.coins.length > 0
                                ?
                                <CustomChip coins={elem.coins.filter((c) => c.chain_detected)} key={index} isLoaded={true}></CustomChip>
                                :
                                elem.coins.length === this.props.OnboardingState.coinsList.length
                                    ?
                                    <CustomChip coins={null} key={index} isLoaded={false}></CustomChip>
                                    :
                                    <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                            :
                            ""
                    }
                </div>)
            })



        return (

            <>
                {/* {console.log(this.state)} */}
                <Modal
                    show={this.state.show}
                    className="fix-add-modal"
                    // backdrop="static"
                    onHide={this.state.onHide}
                    size="lg"
                    dialogClassName={"fix-add-modal"}
                    centered
                    aria-labelledby="contained-modal-title-vcenter"
                    backdropClassName="fixaddmodal"
                >
                    <Modal.Header
                        style={{ padding: `${this.state.modalType === "fixwallet" ? '2.8rem ' : ''}` }}
                        className={this.state.modalType === "addwallet" ?
                            "add-wallet" : ""}
                    >
                        {this.state.modalType === "addwallet" &&
                            <div>
                                <Image src={Banner} className="banner-img" />
                                <div className='wallet-header'>
                                    <Image src={this.state.modalIcon} className="m-b-20" />
                                    <h4 className="inter-display-medium f-s-25 lh-31 white m-b-4">{this.state.title}</h4>
                                    <p className={"inter-display-medium f-s-13 lh-16 white op-8 "}>{this.state.subtitle}</p>
                                </div>
                            </div>
                        }
                        <div className="closebtn" onClick={this.state.onHide}>
                            <Image src={this.state.modalType === "fixwallet" ? CloseIcon : CloseBtn} />
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={`fix-add-modal-body ${this.state.modalType === "addwallet" ? 'm-t-30' : "fix-wallet"}`}>
                            {this.state.modalType === "fixwallet" &&
                                <div className='fix-wallet-title'>
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

                            {this.state.addWalletList.length >= 0 && this.state.modalType === "addwallet" &&
                                <div className="m-b-32 add-wallet-btn">
                                    <Button className="grey-btn" onClick={this.addAddress} >
                                        <img src={PlusIcon} /> Add another
                                    </Button>
                                </div>} 
                            
                            {/* input field for add wallet */}
                            <div className='btn-section'>
                                <Button
                                    className={`primary-btn ${this.state.btnStatus ? "activebtn" : ""} ${this.state.modalType === "fixwallet" ? "fix-btn" : this.state.modalType === "addwallet" && !this.isDisabled() ? "add-btn activebtn" : "add-btn"}`}
                                    disabled={this.state.modalType === "addwallet" ? this.isDisabled() : false}
                                    onClick={this.state.modalType === "addwallet" ? this.handleAddWallet : this.handleFixWallet}
                                >
                                    {this.state.btnText}
                                </Button>
                            </div>
                            <div className='m-b-26 footer'>
                                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">At Loch, we care intensely about your privacy and anonymity.
                                    <CustomOverlay
                                        text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                                        position="top"
                                        isIcon={true}
                                        IconImage={LockIcon}
                                        isInfo={true}
                                    ><Image src={InfoIcon} className="info-icon" /></CustomOverlay>
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
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    getAllCoins,
    detectCoin,
    updateWalletApi,
    getAllWalletApi,
    // getCoinList
}
FixAddModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FixAddModal);
