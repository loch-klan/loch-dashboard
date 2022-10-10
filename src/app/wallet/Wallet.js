import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WalletCard from './WalletCard';
import PageHeader from '../common/PageHeader';
import CoinBadges from './../common/CoinBadges';
import sort from "../../image/sort-1.png"
import { getAllWalletListApi, getAllWalletApi } from './Api';
import { getAllCoins } from '../onboarding/Api.js'
import { API_LIMIT, SEARCH_BY_CHAIN_IN, SORT_BY_NAME ,SORT_BY_PORTFOLIO_AMOUNT,SORT_BY_CREATED_ON} from "../../utils/Constant.js"
class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletList: [],
            start: 0,
            sorts: [],
            sortByAmount:false,
            sortByDate:false,
            sortByName:false,
            walletNameList: [],
            activeBadge: [{name:"All",id:""}],
        }
        this.sortby = ["Amount", "Date added", "Name"]
    }

    componentDidMount() {
        this.props.getAllCoins()
        this.makeApiCall()
    }

    makeApiCall = (cond)=>{
        let data = new URLSearchParams()
        data.append("start", this.state.start)
        data.append("conditions", JSON.stringify(cond ? cond : []))
        data.append("limit", API_LIMIT)
        data.append("sorts", JSON.stringify(this.state.sorts))
        this.props.getAllWalletListApi(data)
    }
    handleSort = (e) => {
        
        if(e === "Amount"){
            let obj=[{
                key : SORT_BY_PORTFOLIO_AMOUNT,
                value : !this.state.sortByAmount
            }]
            this.setState({
                sorts:obj,
                sortByAmount:!this.state.sortByAmount
            })
        }
        else if (e === "Date added"){
            let obj=[{
                key : SORT_BY_CREATED_ON,
                value : !this.state.sortByDate
            }]
            this.setState({
                sorts:obj,
                sortByDate:!this.state.sortByDate
            })
        }
        else if(e === "Name"){
            let obj=[{
                key : SORT_BY_NAME,
                value : !this.state.sortByName
            }]
            this.setState({
                sorts:obj,
                sortByName:!this.state.sortByName
            })
        }
        
        // this.makeApiCall()
    }
    handleFunction = (badge) => {
        let newArr = [...this.state.activeBadge]
        if (this.state.activeBadge.some(e => e.name === badge.name)) {
            let index = newArr.findIndex(x => x.name === badge.name)
            newArr.splice(index, 1)
            if (newArr.length === 0) {
                this.setState({
                    activeBadge: [{name:"All",id:""}]
                })
            } else {
                this.setState({
                    activeBadge: newArr
                })
            }
        } else if (badge.name === "All") {
            this.setState({
                activeBadge: [{name:"All",id:""}]
            })
        } else {
            let index = newArr.findIndex(x => x.name === "All")
            if (index !== -1) {
                newArr.splice(index, 1)
            }
            newArr.push(badge)
            this.setState({
                activeBadge: newArr
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeBadge !== this.state.activeBadge) {
            let arr = [...this.state.activeBadge]
            let index = arr.findIndex(e => e.id === "")
            if(index !== -1) {
                arr.splice(index, 1)
            }
            let condition = [{ key: SEARCH_BY_CHAIN_IN, value: [] }]
            if (arr.length > 0) {
                arr.map((badge) => {
                    condition[0].value.push(badge.id)
                })
            } else {
                condition = [];
            }
            this.makeApiCall(condition)
        }
        else if(prevState.sorts !== this.state.sorts){
            this.makeApiCall()
        }
    }
    render() {
        const { walletList } = this.props.walletState;
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
                                return <span className='sort-by-title' key={index} onClick={()=>this.handleSort(e)}>
                                    <span className='inter-display-medium f-s-13 lh-16 m-r-12 grey-7C7 '>{e}</span> <img src={sort} style={{ width: "1rem" }} />
                                </span>
                            })}
                        </div>
                    </div>

                    <div className='cards'>
                        {walletList.length > 0 && walletList.map((wallet, index) => {
                            return (
                                <WalletCard
                                    key={index}
                                    wallet_metadata={wallet.wallet_metadata}
                                    wallet_account_number={wallet.address}
                                    wallet_amount={wallet.total_value}
                                    wallet_coins={wallet.chains}
                                    makeApiCall={this.makeApiCall}
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
    walletState: state.WalletState,
    OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
    getAllCoins,
    getAllWalletListApi,
    getAllWalletApi
}
Wallet.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);



