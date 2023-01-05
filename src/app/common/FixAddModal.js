import React from 'react'
import { BaseReactComponent } from '../../utils/form';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import DeleteIcon from "../../assets/images/icons/trashIcon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import Banner from "../../image/Frame.png"
import CustomChip from "../../utils/commonComponent/CustomChip";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CloseBtn from "../../assets/images/icons/CloseBtn.svg"
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CloseIcon from '../../assets/images/icons/CloseIcon.svg'
import { getAllCoins, detectCoin, getAllParentChains } from "../onboarding//Api";
import { getDetectedChainsApi, updateUserWalletApi } from './Api';
import { getAllWalletApi, updateWalletApi } from './../wallet/Api';
import { loadingAnimation ,getPadding} from '../../utils/ReusableFunctions';
import { AddWalletAddress, AnonymityWalletConnection, DoneFixingConnection } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
class FixAddModal extends BaseReactComponent {

    constructor(props) {
        super(props);
        let addWalletList = JSON.parse(localStorage.getItem("addWallet"));
        addWalletList = addWalletList && addWalletList.length > 0 ? addWalletList : [{
            id: `wallet${addWalletList.length + 1}`,
            address: "",
            coins: [],
            displayAddress: "",
            wallet_metadata: {}
        }]
        // console.log('addWalletList',addWalletList);
        this.state = {
            onHide: props.onHide,
            show: props.show,
            modalIcon: props.modalIcon,
            title: props.title,
            subtitle: props.subtitle,
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
            walletNameList: [],
            deletedAddress:[],
        }
        this.timeout = 0
    }

    handleOnchange = (e) => {

        let { name, value } = e.target
        // console.log('e',value.trim());
        let prevWallets = [...this.state.addWalletList]
        let currentIndex = prevWallets.findIndex(elem => elem.id === name)
        if (currentIndex > -1) {
            let prevValue = prevWallets[currentIndex].address
            prevWallets[currentIndex].address = value
            prevWallets[currentIndex].displayAddress = value
            if (value === "" || prevValue !== value) {
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
            this.getCoinBasedOnWalletAddress(name, value);
        }, 500)
    }

    getCoinBasedOnWalletAddress = (name, value) => {
      let parentCoinList =  this.props.OnboardingState.parentCoinList;
        if (parentCoinList && value) {
            for (let i = 0; i < parentCoinList.length; i++) {
                this.props.detectCoin(
                  {
                    id: name,
                    coinCode: parentCoinList[i].code,
                    coinSymbol: parentCoinList[i].symbol,
                    coinName: parentCoinList[i].name,
                    address: value,
                    coinColor: parentCoinList[i].color,
                    subChains: parentCoinList[i].sub_chains,
                  },
                  this
                );
            }
        }
    }
    handleSetCoin = (data) => {

        let coinList = {
            chain_detected: data.chain_detected,
            coinCode: data.coinCode,
            coinName: data.coinName,
            coinSymbol: data.coinSymbol,
            coinColor: data.coinColor,
        }
        let newCoinList = [];
        newCoinList.push(coinList);
        data.subChains && data.subChains.map((item)=>newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        }))
        let i = this.state.addWalletList.findIndex(obj => obj.id === data.id)
        let newAddress = this.state.modalType === "addwallet" ? [...this.state.addWalletList] : [...this.state.fixWalletAddress]
        data.address === newAddress[i].address && newAddress[i].coins.push(...newCoinList)
        newAddress[i].coinFound = newAddress[i].coins && newAddress[i].coins.some((e) => e.chain_detected === true)
        if (this.state.modalType === "addwallet") {
            this.setState({
                addWalletList: newAddress
            })
        }
        else if (this.state.modalType === "fixwallet") {
            this.setState({
                fixWalletAddress: newAddress
            })
        }
    }
    componentDidMount() {
        this.props.getAllCoins()
        this.props.getAllParentChains()
        getAllWalletApi(this)
        getDetectedChainsApi(this)
        const fixWallet = []
        JSON.parse(localStorage.getItem("addWallet")).map((e) => {
            if (e.coinFound !== true) {
                fixWallet.push({ ...e, id: `wallet${fixWallet.length + 1}` })
            }
        })
        // console.log('fixWallet',fixWallet);
        this.setState({
            fixWalletAddress: fixWallet
        })
    }
    addAddress = () => {
        this.state.addWalletList.push({
            id: `wallet${this.state.addWalletList.length + 1}`,
            address: "",
            coins: [],
            displayAddress: "",
            wallet_metadata: {}
        })
        this.setState({
            addWalletList: this.state.addWalletList
        })
    }

    deleteAddress = (index) => {
        const address = this.state.addWalletList.at(index).address;
        if (address !== "") {
             this.state.deletedAddress.push(address);
             this.setState({
               deletedAddress: this.state.deletedAddress,
             });
        }
        this.state.addWalletList.splice(index, 1)
        this.state.addWalletList.map((w, i) => { w.id = `wallet${i + 1}` })

        this.setState({
            addWalletList: this.state.addWalletList
        })
        // console.log("Delete", this.state.addWalletList);
        // console.log("Prev 1", this.state.deletedAddress);

    }
    deleteFixWalletAddress = (e) => {
        let { id } = e
        let fixWalletNewArr = []
        this.state.fixWalletAddress.map((wallet, index) => {
            if (wallet.id !== id) {
                fixWalletNewArr.push(wallet)
            }
        })
        this.setState({
            fixWalletAddress: fixWalletNewArr
        })
    }


    handleAddWallet = () => {
        if (this.state.addWalletList) {
          if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            let arr = [];
            let displayAddress = [];
            let walletList = []
            for (let i = 0; i < this.state.addWalletList.length; i++) {
                let curr = this.state.addWalletList[i]
                // console.log(
                //   "current address",
                //   curr.address.trim(),
                //   curr.address,
                //   "condition",
                //   !arr.includes(curr.address.trim()), curr, arr
                // );
                if (!arr.includes(curr.address.trim()) && curr.address) {
                    walletList.push(curr);
                    arr.push(curr.address.trim());
                    // displayAddress.push(curr.displayAddress?.trim());
                    // if (
                    //   !displayAddress.includes(curr.displayAddress?.trim()) &&
                    //   curr.displayAddress
                    // ) {
                         
                    // }
                     
                }
            }
            let addWallet = walletList;
            addWallet.map((w, i) => { w.id = `wallet${i + 1}` })
            localStorage.setItem("addWallet", JSON.stringify(addWallet))
            this.state.changeList && this.state.changeList(walletList)
            this.state.onHide()
            const data = new URLSearchParams();
            data.append("wallet_addresses", JSON.stringify(arr))

            updateUserWalletApi(data, this);
            // if (this.props.handleUpdateWallet) {
            //     this.props.handleUpdateWallet()
            // }
            // console.log("fix",this.state.addWalletList);
            const address = this.state.addWalletList.map(e => e.address);
            // console.log("address", address);
            const addressDeleted = this.state.deletedAddress;
            // console.log("Deteted address", addressDeleted);
            const unrecog_address = this.state.addWalletList.filter((e) => !e.coinFound).map(e=> e.address);
            // console.log("Unreq address", unrecog_address);
            const recog_address = this.state.addWalletList
              .filter((e) => e.coinFound)
              .map((e) => e.address);
            // console.log("req address", recog_address);

            const blockchainDetected = [];
            this.state.addWalletList.filter((e) => e.coinFound).map((obj) => {
                let coinName = obj.coins
                  .filter((e) => e.chain_detected)
                  .map((name) => name.coinName);
                let address = obj.address;
                blockchainDetected.push({ address: address, names: coinName });
            });

            // console.log("blockchain detected", blockchainDetected);
            AddWalletAddress({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              addresses_added: address,
              ENS_added: address,
              addresses_deleted: addressDeleted,
              ENS_deleted: addressDeleted,
              unrecognized_addresses: unrecog_address,
              recognized_addresses: recog_address,
              blockchains_detected: blockchainDetected,
            });

          }, 100)


        }

    }

    handleFixWalletChange = (e) => {
        let { name, value } = e.target
        let prevWallets = [...this.state.fixWalletAddress]
        let currentIndex = prevWallets.findIndex(elem => elem.id === name)
        // console.log('prevWallets',prevWallets);
        // console.log('currentIndex',currentIndex);
        let prevValue = prevWallets[currentIndex].address
        prevWallets[currentIndex].address = value
        // prevWallets[currentIndex].coins = []
        if (value === "" || prevValue !== value) {
            prevWallets[currentIndex].coins = []
        }
        // prevWallets[currentIndex].address = value
        this.setState({
            fixWalletAddress: prevWallets
        })
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnWalletAddress(name, value);
        }, 500)
    }

    handleFixWallet = () => {
        // console.log(this.state.fixWalletAddress);`
        this.state.fixWalletAddress && this.state.fixWalletAddress.map((obj) => {
            // console.log(obj)
            let coinName = obj.coins
              .filter((e) => e.chain_detected)
                .map((name) => name.coinName);
            DoneFixingConnection({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              wallet_address: obj.address,
              blockchainDetected: coinName,
            });
        });


      clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
        let wallets = JSON.parse(localStorage.getItem("addWallet"))
        // console.log('wallet',wallets);
        let localArr = []
        for (let i = 0; i < wallets.length; i++) {
            let curr = wallets[i];
            if (!curr.coinFound) {
                this.state.fixWalletAddress.map((wallet) => {
                    // console.log('wallettt',wallet);
                    localArr.push(wallet);
                    // if (wallet.address === curr.address) {
                    //     localArr.push(wallet)
                    // }
                    // else if (wallet.coinFound === true) {
                    //     localArr.push(wallet)
                    // }
                })
            } else {
                localArr.push(wallets[i])
            }
        }
        // console.log('localArr',localArr);
        // remove repeat address if same address added for unrecognized wallet
        let newArr = []
        let walletList = []
        for (let i = 0; i < localArr.length; i++) {
            let curr = localArr[i]
            if (!newArr.includes(curr.address)) {
                walletList.push(curr)
                newArr.push(curr.address)
            }
        }
        walletList.map((w, index) => w.id = `wallet${index + 1}`)
        // console.log('walletList',walletList);
        if (walletList.length === 0) {
            walletList.push({
                id: 'wallet1',
                address: "",
                coins: [],
                displayAddress: "",
                wallet_metadata: {}
            })
        }
        localStorage.setItem("addWallet", JSON.stringify(walletList))
        this.state.onHide()
        // console.log("new array", newArr);
        this.state.changeList && this.state.changeList(walletList)
        const data = new URLSearchParams();
        data.append("wallet_addresses", JSON.stringify(newArr))
        updateUserWalletApi(data, this);
        // if (this.props.handleUpdateWallet) {
        //     this.props.handleUpdateWallet()
        // }
      }, 300);
    }

    isDisabled = () => {
        let isDisableFlag = true;
        this.state.addWalletList.map((e) => {
          if(e.address){
            if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
              e.coins.map((a)=>{
                  if(a.chain_detected===true){
                      isDisableFlag = false;
                  }
              })
            } else{
              isDisableFlag = false;
            }
          } else{
            isDisableFlag = false;
          }
        })
        return isDisableFlag;
    }

    isFixDisabled = () => {
        let isDisableFlag = true;
        this.state.fixWalletAddress.length>0 ?
        this.state.fixWalletAddress.map((e) => {
          if(e.address){
            if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
              // isDisableFlag = true;
              e.coins.map((a)=>{
                if(a.chain_detected===true){
                    isDisableFlag = false;
                }
              })
            } else{
              isDisableFlag = false;
            }
          } else{
            isDisableFlag = false;
          }
        })
        :
        isDisableFlag = false;

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
                    <div className="m-t-12 fix-wallet-input" key={index} id={`fix-input-${index}`}>
                        <div className="delete-icon" onClick={() => this.deleteFixWalletAddress(elem)}>
                        <Image src={DeleteIcon}  />
                        </div>
                        <input
                            value={elem.address || ""}
                            className="inter-display-regular f-s-16  lh-19 black-191"
                            type="text"
                            id={elem.id}
                            name={`wallet${index + 1}`}
                            autoFocus
                            onChange={(e) => this.handleFixWalletChange(e)}
                            style={getPadding(`fix-input-${index}`,elem,this.props.OnboardingState)}
                        />

                        {
                            elem.address
                                ?
                                elem.coinFound && elem.coins.length > 0
                                    ?
                                    <CustomChip coins={elem.coins.filter((c) => c.chain_detected)} key={index} isLoaded={true}></CustomChip>
                                    :
                                    // elem.coins.length === 0
                                    //     ?
                                    //     <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                                    // :
                                    elem.coins.length === this.props.OnboardingState.coinsList.length
                                        ?
                                        <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                                        :
                                        <CustomChip coins={null} key={index} isLoaded={false}></CustomChip>
                                :
                                ""
                        }
                    </div>)
            }) : ""


        const wallets = this.state.addWalletList.map((elem, index) => {
                return (<div className='m-t-12 add-wallet-input-section' key={index} id={`add-wallet-${index}`}>
                    {index >= 1 ?
                    <div  className="delete-icon" onClick={() => this.deleteAddress(index)}>
                    <Image src={DeleteIcon} />
                    </div>
                    : ""}

                    <input
                        autoFocus
                        name={`wallet${index + 1}`}
                        value={elem.displayAddress || elem.address || ""}
                        placeholder="Paste any wallet address or ENS here"
                        // className='inter-display-regular f-s-16 lh-20'
                        className={`inter-display-regular f-s-16 lh-20 ${elem.address ? 'is-valid' : null}`}
                        onChange={(e) => this.handleOnchange(e)}
                        id={elem.id}
                        style={getPadding(`add-wallet-${index}`,elem,this.props.OnboardingState)}
                    />
                    {
                        elem.address
                            ?
                            elem.coinFound && elem.coins.length > 0
                                ?
                                // COIN FOUND STATE
                                <CustomChip coins={elem.coins.filter((c) => c.chain_detected)} key={index} isLoaded={true}></CustomChip>
                                :
                                elem.coins.length === this.props.OnboardingState.coinsList.length
                                // elem.coins.length === 1
                                    ?
                                    // UNRECOGNIZED WALLET
                                    <CustomChip coins={null} key={index} isLoaded={true}></CustomChip>
                                    :
                                    // LOADING STATE
                                    <CustomChip coins={null} key={index} isLoaded={false}></CustomChip>
                            :
                            ""
                    }
                </div>)
            })



        return (

            <>
                <Modal
                    show={this.state.show}
                    className="fix-add-modal"
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
                                        <Image src={PlusIcon} /> Add another
                                    </Button>
                                </div>}

                            {/* input field for add wallet */}
                            <div className='btn-section'>
                                <Button
                                    className={`primary-btn ${this.state.btnStatus ? "activebtn" : ""} ${this.state.modalType === "fixwallet" ? "fix-btn" : this.state.modalType === "addwallet" && !this.isDisabled() ? "add-btn activebtn" : "add-btn"}`}
                                    disabled={this.state.modalType === "addwallet" ? this.isDisabled() : this.isFixDisabled()}
                                    onClick={this.state.modalType === "addwallet" ? this.handleAddWallet : this.handleFixWallet}
                                >
                                    {/* {this.state.btnText} */}
                                    {
                                      this.state.modalType === "addwallet"
                                      ?
                                        this.isDisabled()
                                            ?
                                            loadingAnimation()
                                            :
                                            this.state.btnText
                                      :
                                      this.isFixDisabled()
                                      ?
                                            loadingAnimation()
                                            :
                                            this.state.btnText
                                    }
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
                                        className={"fix-width"}
                                    ><Image src={InfoIcon} className="info-icon" onMouseEnter={() => {
                                            AnonymityWalletConnection({session_id: getCurrentUser().id, email_address: getCurrentUser().email});
                                    }}/></CustomOverlay>
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
    getAllParentChains,
}
FixAddModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FixAddModal);
