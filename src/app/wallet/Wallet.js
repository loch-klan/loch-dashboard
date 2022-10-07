import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WalletCard from './WalletCard';
import { Image } from 'react-bootstrap';
import Icon from "../../image/ArrowRight.svg"
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import DropDown from '../common/DropDown';
import {data} from "./walletDate.js"
import PageHeader from '../common/PageHeader';
import CoinBadges from './../common/CoinBadges';
import sort from "../../image/sort-1.png"
import { getwallets ,getallwallets} from './Api';
import {getAllCoins} from '../onboarding/Api.js'
import {SEARCH_BY_CHAIN_IN }from "../../utils/Constant.js"
class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletData: [],
            start: 0,
            sorts: [],
            limit: 10,
            dropDownListModal : [],
            activeBadge: [{name:"All",id:""}],
        }
        this.sortby = ["Amount", "Date added", "Name"]
    }


    componentDidMount() {

        this.props.getAllCoins()
        let data = new URLSearchParams()
        data.append("start", this.state.start)
        // data.append("conditions", JSON.stringify(this.state.conditions))
        data.append("conditions", JSON.stringify([]))
        data.append("limit", this.state.limit)
        data.append("sorts", JSON.stringify(this.state.sorts))
        this.props.getwallets(this, data)
        this.props.getallwallets(this,data)
        // console.log("WalletData", this.state.walletData)
    }

    handleFunction = (badge) => {
        // console.log(badge)
        let newArr = [...this.state.activeBadge]
        if (this.state.activeBadge.some(e => e.name === badge.name)) {
            // console.log("INCLUDE in LIST",badge)
            let index = newArr.findIndex(x => x.name === badge.name)
            console.log(index)
            newArr.splice(index, 1)
            if (newArr.length === 0) {
                this.setState({
                    activeBadge: [{name:"All",id:""}]
                })
            }
            else {
                this.setState({
                    activeBadge: newArr
                })
            }
        }
        else if(badge.name === "All")
        {
            this.setState({
                activeBadge:[{name:"All",id:""}]
            })
        }
        else {
            let index = newArr.findIndex(x => x.name ==="All")
            if (index !== -1) {
                newArr.splice(index, 1)
            }
            // console.log("index", index)
            newArr.push(badge)
            this.setState({
                activeBadge: newArr
            })
        }

        // console.log("NEW ARRSY", newArr)
    }

    componentDidUpdate(prevProps , prevState) {
        console.log("Update")
        if (prevState.activeBadge !== this.state.activeBadge ) {

        //   console.log("MADE API CALL",this.state.activeBadge)
        //   console.log("MADE API CALL prev" ,prevProps)
        //   console.log("MADE API CALL state",prevState)
          let data = new URLSearchParams()
          let arr = [...this.state.activeBadge]
          let index = arr.findIndex(e => e.id === "")
          if(index !== -1)
          {
            arr.splice(index,1)
          }
          let condition = [{key:SEARCH_BY_CHAIN_IN,value:[]}]
            arr.map((badge)=>{
              condition[0].value.push(badge.id)
            })
            console.log(condition)
              data.append("start", this.state.start)
              data.append("conditions", JSON.stringify(condition))
              data.append("limit", this.state.limit)
              data.append("sorts", JSON.stringify(this.state.sorts))
              this.props.getwallets(this, data)
        //   console.log("after call",index)
        }

    }
    render() {

        return (
            <div className="wallet-page-section">
                {/* <Sidebar ownerName="" /> */}
                <div className='wallet-section page'>

                    <PageHeader
                        title="Wallets"
                        subTitle="Manage all your wallets right here"
                        btnText="Add wallet"
                    />

                    <CoinBadges
                        activeBadge={this.state.activeBadge}
                        chainList={this.props.OnboardingState.coinsList}
                        handleFunction={this.handleFunction}
                    />
                    <div className='m-b-32 sortby-section'>
                        <span className='inter-display-medium f-s-13 lh-16 m-r-12 grey-313'>Sort by</span>
                        <div className='dropdown-section'>
                            {this.sortby.map((e, index) => {
                                return <span className='sort-by-title'>
                                    <span className='inter-display-medium f-s-13 lh-16 m-r-12 grey-7C7 '>{e}</span> <img src={sort} style={{width: "1rem"}}/>
                                </span>
                            })}

                        </div>

                    </div>

                    <div className='cards'>
                        {this.state.walletData.length > 0 && this.state.walletData.map((wallet, index) => {
                            // console.log("wallet",wallet)

                            return (
                                <WalletCard
                                    key={index}
                                    wallet_metadata={wallet.wallet_metadata}
                                    // wallet_icon={wallet.wallet_icon}
                                    // coin_name={wallet.coin_name}
                                    // wallet_name={wallet.wallet_name}
                                    dropDrowList={this.state.dropDownListModal}
                                    wallet_account_number={wallet.address}
                                    wallet_amount={wallet.total_value}
                                    wallet_coins={wallet.chain}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    // walletState: state.WalletState,
    OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
    getAllCoins,
    getwallets,
    getallwallets
}
Wallet.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);



