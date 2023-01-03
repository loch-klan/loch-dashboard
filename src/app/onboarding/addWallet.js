import React from 'react';
import {BaseReactComponent, Form} from "../../utils/form";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import { getAllCoins, detectCoin, createAnonymousUserApi, getAllParentChains} from "./Api";
import CustomChip from "../../utils/commonComponent/CustomChip";
import { getPadding } from '../../utils/ReusableFunctions';
import {
  DeleteWalletAddress,
  PreviewDemo,
  AddTextbox,
  LPC_Go,
} from "../../utils/AnalyticsFunctions.js";

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
        this.props.getAllParentChains()
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
        this.setState({
            addButtonVisible: this.state.walletInput.some((wallet)=>wallet.address ? true : false),
            walletInput: walletCopy
        });
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        // timeout;
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnWalletAddress(name, value);
        }, 500)
    }

    getCoinBasedOnWalletAddress = (name, value) => {
      let parentCoinList =  this.props.OnboardingState.parentCoinList;
        if (parentCoinList && value) {
            for (let i = 0; i < parentCoinList.length; i++) {
                this.props.detectCoin({
                    id: name,
                    coinCode: parentCoinList[i].code,
                    coinSymbol: parentCoinList[i].symbol,
                    coinName: parentCoinList[i].name,
                    address: value,
                    coinColor: parentCoinList[i].color,
                    subChains: parentCoinList[i].sub_chains
                }, this)
            }
        }
    }

    handleSetCoin = (data)=>{
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
    let i = this.state.walletInput.findIndex(obj => obj.id === data.id)
    let newAddress = [...this.state.walletInput]
    // data.address === newAddress[i].address && console.log("heyyy", newAddress[i].address, data.address)
    data.address !== newAddress[i].address ? newAddress[i].coins = [] : newAddress[i].coins.push(...newCoinList);

    newAddress[i].coinFound = newAddress[i].coins.some((e) => e.chain_detected === true);

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
      AddTextbox({});
    }

    deleteInputField = (index,wallet) => {
        if (!this.isDisabled() || wallet.address === "") {
            this.state.walletInput.splice(index, 1);
            this.state.walletInput.map((w, i) => w.id = `wallet${i + 1}`)
            DeleteWalletAddress({
              address: wallet.address,
            });
            this.setState({
                walletInput: this.state.walletInput
            });
        }
      // console.log("Delete", wallet.address);
    }

    isDisabled = () => {
        let isDisableFlag = true;
        // if (this.state.walletInput.length <= 0) {
        //     isDisableFlag = true;
        // }
        this.state.walletInput.map((e) => {
          if (e.address){
            if(e.coins.length !== this.props.OnboardingState.coinsList.length) {
              // isDisableFlag = true;
              e.coins.map((a)=>{
                if(a.chain_detected===true){
                  isDisableFlag = false;
                }
              })
            } else{
              isDisableFlag = false;
            }
          }
        })
      return isDisableFlag;
    }

    onValidSubmit = () => {
      let walletAddress = [];
      let addWallet = this.state.walletInput;
      let finalArr = [];
      for (let i = 0; i < addWallet.length; i++) {
        let curr = addWallet[i];
        if (
          !walletAddress.includes(curr.address.trim()) &&
          curr.address.trim()
        ) {
          finalArr.push(curr);
          walletAddress.push(curr.address.trim());
        }
      }

      finalArr = finalArr.map((item, index) => {
        return {
          ...item,
          id: `wallet${index + 1}`,
        };
      });

      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(walletAddress));
      createAnonymousUserApi(data, this, finalArr);
      // console.log(finalArr);

      const address = finalArr.map((e) => e.address);
      // console.log("address", address);

      const unrecog_address = finalArr.filter((e) => !e.coinFound)
        .map((e) => e.address);
      // console.log("Unreq address", unrecog_address);

      const blockchainDetected = [];
      finalArr
        .filter((e) => e.coinFound)
        .map((obj) => {
          let coinName = obj.coins
            .filter((e) => e.chain_detected)
            .map((name) => name.coinName);
          let address = obj.address;
          blockchainDetected.push({ address: address, names: coinName });
        });

      // console.log("blockchain detected", blockchainDetected);

      LPC_Go({addresses: address, ENS: address,chains_detected_against_them: blockchainDetected, unrecognized_addresses: unrecog_address, unrecognized_ENS: unrecog_address});

    };
    handleSignText = ()=>{
        this.props.switchSignIn()
    }
    render() {

        return (
          <>
            <Form
              onValidSubmit={
                this.state.addButtonVisible
                  ? this.onValidSubmit
                  : this.handleSignText
              }
            >
              <div className="ob-modal-body-wrapper">
                <div className="ob-modal-body-1">
                  {this.state.walletInput.map((c, index) => {
                    return (
                      <div
                        className="ob-wallet-input-wrapper"
                        key={index}
                        id={`add-wallet-${index}`}
                      >
                        {index >= 1 ? (
                          <Image
                            key={index}
                            className={`ob-modal-body-del`}
                            // ${this.isDisabled()&& c.address  ? 'not-allowed' : ""}
                            src={DeleteIcon}
                            onClick={() => this.deleteInputField(index, c)}
                          />
                        ) : null}
                        <input
                          autoFocus
                          name={`wallet${index + 1}`}
                          value={c.address || ""}
                          className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text ${
                            this.state.walletInput[index].address
                              ? "is-valid"
                              : null
                          }`}
                          placeholder="Paste any wallet address or ENS here"
                          title={c.address || ""}
                          // style={{paddingRight: divWidth}}
                          style={getPadding(
                            `add-wallet-${index}`,
                            c,
                            this.props.OnboardingState
                          )}
                          // onKeyUp={(e) => this.setState({ loading: true })}
                          onChange={(e) => this.handleOnChange(e)}
                        />
                        {this.state.walletInput.map((e, i) => {
                          if (
                            this.state.walletInput[index].address &&
                            e.id === `wallet${index + 1}`
                          ) {
                            // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                            if (e.coinFound && e.coins.length > 0) {
                              return (
                                <CustomChip
                                  coins={e.coins.filter(
                                    (c) => c.chain_detected
                                  )}
                                  key={i}
                                  isLoaded={true}
                                ></CustomChip>
                              );
                            } else {
                              if (
                                e.coins.length ===
                                this.props.OnboardingState.coinsList.length
                              ) {
                                return (
                                  <CustomChip
                                    coins={null}
                                    key={i}
                                    isLoaded={true}
                                  ></CustomChip>
                                );
                              } else {
                                return (
                                  <CustomChip
                                    coins={null}
                                    key={i}
                                    isLoaded={false}
                                  ></CustomChip>
                                );
                              }
                            }
                          } else {
                            return "";
                          }
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              {this.state.addButtonVisible ? (
                <div className="ob-modal-body-2">
                  <Button className="grey-btn" onClick={this.addInputField}>
                    <Image src={PlusIcon} /> Add another
                  </Button>
                </div>
              ) : null}

              <div className="ob-modal-body-btn">
                {/* <CustomButton
                  className="secondary-btn m-r-15 preview"
                  buttonText="Preview demo instead"
                  onClick={() => {
                    PreviewDemo({});
                    console.log("Preview");
                  }}
                /> */}
                <CustomButton
                  className="primary-btn go-btn"
                  type="submit"
                  isLoading={
                    this.state.addButtonVisible ? this.isDisabled() : false
                  }
                  isDisabled={
                    this.state.addButtonVisible ? this.isDisabled() : false
                  }
                  buttonText={this.state.addButtonVisible ? "Go" : "Sign in instead"}
                />
              </div>

              {this.state.addButtonVisible ? (
                <div className="m-b-30 m-t-30 addWallet-signIn-div">
                  <span className="inter-display-medium f-s-13 m-r-8 lh-16 grey-ADA">
                    Already have an account?
                  </span>
                  <span
                    className="inter-display-bold f-s-13 lh-16 black-191 cp"
                    onClick={this.handleSignText}
                  >
                    Sign In
                  </span>
                </div>
              ) : (
                ""
              )}
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
    createAnonymousUserApi,
    getAllParentChains
}
AddWallet.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);