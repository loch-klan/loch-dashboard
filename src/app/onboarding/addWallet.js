import React from 'react';
import {BaseReactComponent, Form} from "../../utils/form";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import { getAllCoins, detectCoin, createAnonymousUserApi} from "./Api";
import CustomChip from "../../utils/commonComponent/CustomChip";
import { getPadding } from '../../utils/ReusableFunctions';


class AddWallet extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            addButtonVisible: false,
            walletInput: [{ id: "wallet1", address: "", coins:[] }],
            loading: false
        }
        this.timeout = 0
    }

    componentDidMount() {
        this.props.getAllCoins()
    }

    handleOnChange = (e) => {
        let { name, value } = e.target;
        let walletCopy = [...this.state.walletInput];
        let foundIndex = walletCopy.findIndex(obj => obj.id === name);
        if (foundIndex > -1) {
            let prevValue = walletCopy[foundIndex].address
            // console.log(prevValue)
            walletCopy[foundIndex].address = value;
            if(value === "" || prevValue !== value){
                walletCopy[foundIndex].coins = []
            }
            // walletCopy[foundIndex].trucatedAddress = value
        }

        // if (
        //   this.props &&
        //   this.props.OnboardingState &&
        //   this.props.OnboardingState.walletList &&
        //   this.props.OnboardingState.walletList.length > 0
        //   ) {
        //     let findWalletEntry = this.props.OnboardingState.walletList.findIndex(obj => obj.id === name);
        //     if (findWalletEntry > -1) {
        //         this.props.OnboardingState.walletList.splice(findWalletEntry, 1);
        //     }
        // }
        this.setState({
            addButtonVisible: this.state.walletInput[0].address,
            walletInput: walletCopy
        });
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        // timeout;
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnWalletAddress(name, value);
        }, 1000)
    }

    getCoinBasedOnWalletAddress = (name, value) => {
        if (this.props.OnboardingState.coinsList && value) {
            for (let i = 0; i < this.props.OnboardingState.coinsList.length; i++) {
                this.props.detectCoin({
                    id: name,
                    coinCode: this.props.OnboardingState.coinsList[i].code,
                    coinSymbol: this.props.OnboardingState.coinsList[i].symbol,
                    coinName: this.props.OnboardingState.coinsList[i].name,
                    address: value,
                }, this)
            }
        }
    }

    handleSetCoin = (data)=>{
      let coinList = {
        chain_detected: data.chain_detected,
        coinCode: data.coinCode,
        coinName: data.coinName,
        coinSymbol: data.coinSymbol
    }
    let i = this.state.walletInput.findIndex(obj => obj.id === data.id)
    let newAddress = [...this.state.walletInput]
    // data.address === newAddress[i].address && console.log("heyyy", newAddress[i].address, data.address)
    data.address !== newAddress[i].address ? newAddress[i].coins = [] : newAddress[i].coins.push(coinList)
    newAddress[i].coinFound = newAddress[i].coins.some((e) => e.chain_detected === true)
    this.setState({
      walletInput: newAddress
  })
    }

    addInputField = () => {
        this.state.walletInput.push({
            id: `wallet${this.state.walletInput.length + 1}`,
            address: "",
            coins: []
        })
        this.setState({
            walletInput: this.state.walletInput
        });
    }

    deleteInputField = (index,wallet) => {
        if (!this.isDisabled() || wallet.address === "") {
            this.state.walletInput.splice(index, 1);
            this.state.walletInput.map((w, i) => w.id = `wallet${i + 1}`)
            // if (this.props && this.props.OnboardingState && this.props.OnboardingState.walletList && this.props.OnboardingState.walletList.length > 0) {
            //     this.props.OnboardingState.walletList.sort((a, b) => a.id > b.id ? 1 : -1);
            //     let findWalletEntry = this.props.OnboardingState.walletList.findIndex(obj => obj.id === `wallet${index + 1}`);
            //     console.log("entery",findWalletEntry)
            //     if (findWalletEntry > -1) {
            //         this.props.OnboardingState.walletList.splice(findWalletEntry, 1);
            //         this.props.OnboardingState.walletList.map((w, i) => w.id = `wallet${i + 1}`)
            //     }
            // }
            this.setState({
                walletInput: this.state.walletInput
            });
        }
    }


    isDisabled = () => {
        let isDisableFlag = false;
        if (this.state.walletInput.length <= 0) {
            isDisableFlag = true;
        }
        this.state.walletInput.map((e) => {
            if (e.address && e.coins.length !== this.props.OnboardingState.coinsList.length) {
                isDisableFlag = true;
            }
        })
        // this.state.walletInput.map((e) => {
        //     if (!e.address) {
        //         isDisableFlag = true;
        //     }
        // })
        // this.state.walletInput.map((e) => {
        //   (e.address && e.coins.length === this.props.OnboardingState.coinsList.length) ? isDisableFlag = false : isDisableFlag=true
        // })
        return isDisableFlag;
    }

    onValidSubmit = () => {
        let walletAddress = [];
        let addWallet = this.state.walletInput;
        let finalArr = []
        for (let i = 0; i < addWallet.length; i++) {
            let curr = addWallet[i]
            if (!walletAddress.includes(curr.address) && curr.address) {
                finalArr.push(curr)
                walletAddress.push(curr.address)
            }
        }

        finalArr = finalArr.map((item, index) => {
            return ({
                ...item,
                id: `wallet${index + 1}`
            })
        })

        const data = new URLSearchParams();
        data.append("wallet_addresses", JSON.stringify(walletAddress))
        createAnonymousUserApi(data, this, finalArr);
    }

    render() {
      // console.log('document.getElementById',document.getElementById('coin-div'));
      let coinDiv = document.getElementById('coin-div');
      let divWidth = 0;
      if(coinDiv)
        divWidth = coinDiv.offsetWidth + 10
      // console.log("divWidth",divWidth)
        return (
            <>
                <Form onValidSubmit={this.onValidSubmit}>
                    <div className='ob-modal-body-wrapper'>
                        <div className="ob-modal-body-1">
                            {this.state.walletInput.map((c, index) => {
                                return <div className='ob-wallet-input-wrapper' key={index} id={`add-wallet-${index}`}>
                                    {
                                        index >= 1
                                            ?
                                            <Image
                                                key={index}
                                                className={`ob-modal-body-del`}
                                                // ${this.isDisabled()&& c.address  ? 'not-allowed' : ""}
                                                src={DeleteIcon}
                                                onClick={() => this.deleteInputField(index,c) }
                                            />
                                            : null
                                    }
                                    <input
                                        autoFocus
                                        name={`wallet${index + 1}`}
                                        value={c.address || ""}
                                        className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text ${this.state.walletInput[index].address ? 'is-valid' : null}`}
                                        placeholder='Paste any wallet address here'
                                        title={c.address || ""}
                                        // style={{paddingRight: divWidth}}
                                        style={getPadding(`add-wallet-${index}`,c,this.props.OnboardingState)}
                                        // onKeyUp={(e) => this.setState({ loading: true })}
                                        onChange={(e) => this.handleOnChange(e)} />
                                    {this.state.walletInput.map((e, i) => {
                                        if (this.state.walletInput[index].address && e.id === `wallet${index + 1}`) {
                                            // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                            if (e.coinFound && e.coins.length> 0) {
                                                return <CustomChip id={"coin-div"} coins={e.coins.filter((c) => c.chain_detected)} key={i} isLoaded={true}></CustomChip>
                                            } else {
                                                if (e.coins.length === this.props.OnboardingState.coinsList.length) {
                                                    return <CustomChip id={"coin-div"} coins={null} key={i} isLoaded={true}></CustomChip>
                                                } else {
                                                    return <CustomChip id={"coin-div"} coins={null} key={i} isLoaded={false}></CustomChip>
                                                }
                                            }
                                        }
                                        else{
                                            return ""
                                        }

                                    })}
                                </div>
                            })}
                        </div>
                    </div>
                    {this.state.addButtonVisible ?
                        <div className='ob-modal-body-2'>
                            <Button className="grey-btn" onClick={this.addInputField}>
                                <Image src={PlusIcon} /> Add another
                            </Button>
                        </div>
                        : null
                    }
                    <div className='ob-modal-body-btn'>
                        <CustomButton className="secondary-btn m-r-15 preview" buttonText="Preview demo instead" />
                        <CustomButton className="primary-btn go-btn" type={"submit"} isLoading={this.isDisabled()} isDisabled={this.isDisabled()} buttonText="Go" />
                    </div>
                </Form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    getAllCoins,
    detectCoin,
    createAnonymousUserApi
}
AddWallet.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);