import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import Form from "../../utils/form/Form";
import { getAllCoins, detectCoin, createAnonymousUserApi } from "./Api";
import CustomChip from "../../utils/commonComponent/CustomChip";

class AddWallet extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            addButtonVisible: false,
            walletInput: [{ id: "wallet1", address: "" }],
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
          walletCopy[foundIndex].address = value;
          walletCopy[foundIndex].trucatedAddress = value
        }
        if (this.props && this.props.OnboardingState && this.props.OnboardingState.walletList && this.props.OnboardingState.walletList.length > 0) {
            let findWalletEntry = this.props.OnboardingState.walletList.findIndex(obj => obj.id === name);
            if (findWalletEntry > -1) {
                this.props.OnboardingState.walletList.splice(findWalletEntry, 1);
            }
        }
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
                    isLast: i === (this.props.OnboardingState.coinsList.length - 1)
                })
            }
        }
    }

    addInputField = () => {
        this.state.walletInput.push({
            id: `wallet${this.state.walletInput.length + 1}`,
            address: ""
        })
        this.setState({
            walletInput: this.state.walletInput
        });
    }

    deleteInputField = (index) => {
        this.state.walletInput.splice(index, 1);
        this.state.walletInput.map((w, i) => w.id = `wallet${i + 1}`)
        if (this.props && this.props.OnboardingState && this.props.OnboardingState.walletList && this.props.OnboardingState.walletList.length > 0) {
            this.props.OnboardingState.walletList.sort((a, b) => a.id > b.id ? 1 : -1);
            let findWalletEntry = this.props.OnboardingState.walletList.findIndex(obj => obj.id === `wallet${index + 1}`);
            if (findWalletEntry > -1) {
                this.props.OnboardingState.walletList.splice(findWalletEntry, 1);
                this.props.OnboardingState.walletList.map((w, i) => w.id = `wallet${i + 1}`)
            }
        }
        this.setState({
            walletInput: this.state.walletInput
        });

    }

    isDisabled = () => {
        let isDisableFlag = false;
        if (this.props.OnboardingState.walletList.length <= 0) {
            isDisableFlag = true;
        }
        this.props.OnboardingState.walletList.map((e) => {
            if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
                isDisableFlag = true;
            }
        })
        this.state.walletInput.map((e) => {
            if (!e.address) {
                isDisableFlag = true;
            }
        })
        return isDisableFlag;
    }

    onValidSubmit = () => {
      let walletAddress = [];
      let addWallet = this.props.OnboardingState.walletList.map((el)=> {
          walletAddress.push(el.address)
          el.coins = el.coins.filter(function (x) { return x.chain_detected === true });
          return el;
      })
      const data = new URLSearchParams();
      data.append("wallet_addresses",JSON.stringify(walletAddress))
      console.log('walletAddress',walletAddress);
      console.log('addWallet',addWallet);
      createAnonymousUserApi(data, this, addWallet);
      // this.props.history.push({
      //     pathname: '/portfolio',
      //     state: {addWallet}
      // });
    }

    render() {
        return (
            <>
                <Form onValidSubmit={this.onValidSubmit}>
                    {/* <Container> */}
                    <div className='ob-modal-body-wrapper'>
                        <div className="ob-modal-body-1">
                            {this.state.walletInput.map((c, index) => {
                                return <div className='ob-wallet-input-wrapper' key={index}>
                                    {/* // <Col md={12} key={index}> */}
                                    {index >= 1 ? <Image key={index} className='ob-modal-body-del' src={DeleteIcon} onClick={() => this.deleteInputField(index)} /> : null}
                                    <input
                                        autoFocus
                                        name={`wallet${index + 1}`}
                                        value={c.trucatedAddress || ""}
                                        className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text ${this.state.walletInput[index].address ? 'is-valid' : null}`}
                                        placeholder='Paste any wallet address here'
                                        title={c.address || ""}
                                        // onKeyUp={(e) => this.setState({ loading: true })}
                                        onChange={(e) => this.handleOnChange(e)} />
                                    {this.props.OnboardingState.walletList.map((e, i) => {
                                        if (this.state.walletInput[index].address && e.id === `wallet${index + 1}`) {
                                            // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                                if (e.coinFound) {
                                                    return <CustomChip coins={e.coins.filter((c) => c.chain_detected)} key={i} isLoaded={true}></CustomChip>
                                                } else {
                                                  if(e.coins.length === this.props.OnboardingState.coinsList.length){
                                                    return <CustomChip coins={null} key={i} isLoaded={true}></CustomChip>
                                                  } else {
                                                    return <CustomChip coins={null} key={i} isLoaded={false}></CustomChip>
                                                  }

                                                }
                                            // } else {
                                            //     if (this.state.loading && c.address && c.address.length > 0 && e.coins.length !== this.props.OnboardingState.coinsList.length) {
                                            //         return <CustomChip coins={null} key={i} isLoaded={false}></CustomChip>
                                            //     }
                                            // }
                                        }
                                    })}

                                    {/* // </Col> */}
                                </div>
                            })}
                        </div>
                    </div>
                    {/* <Row> */}
                    {this.state.addButtonVisible ?
                        <div className='ob-modal-body-2'>
                            <Button className="grey-btn" onClick={this.addInputField}>
                                <img src={PlusIcon} /> Add another
                            </Button>
                        </div>
                        : null
                    }
                    {/* </Row> */}
                    {/* <Row> */}
                    <div className='ob-modal-body-btn'>
                        <CustomButton className="secondary-btn m-r-15 preview" buttonText="Preview demo instead" />
                        <CustomButton className="primary-btn go-btn" type={"submit"} isDisabled={this.isDisabled()} buttonText="Go" />
                    </div>
                    {/* </Row> */}
                    {/* </Container> */}
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