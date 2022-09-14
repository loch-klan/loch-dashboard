import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WalletCard from './WalletCard';
import { Image } from 'react-bootstrap';
import Icon from "../../image/ArrowRight.svg"
import { Button ,Dropdown , DropdownButton } from 'react-bootstrap';
import DropDown from '../common/DropDown';
import data from "./walletDate.js"
import PageHeader from '../common/PageHeader';
import CoinBadges from './../common/CoinBadges';

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletdata: data
        }
    }

    componentDidMount() { }

    render() {

        return (
            <div className="wallet-page-section">
                <Sidebar ownerName="" />
                <div className='wallet-section page'>

                    <PageHeader
                        title="Wallets"
                        subTitle="Manage all your wallets right here"
                        btnText="Add wallet"
                    />
                   
                    <CoinBadges
                        activeBadge={0}
                    />
                    <div className='m-b-32 sortby-section'>
                        <span className='inter-display-medium f-s-13 lh-16 m-r-24'>Sort by</span>
                        <div className='dropdown-section'>
                        <DropDown
                            id="dropdown-amount-button" 
                            title="Amount"
                            list={["Action" , "Action2" , "Action3"]}
                        />
                        <DropDown
                           id="dropdown-date-button" title="Date added"
                           list={["Action" , "Action2" , "Action3"]}
                        />
                        <DropDown
                            id="dropdown-name-button" title="Name"
                            list={["Action" , "Action2" , "Action3"]}
                        />
                        </div>

                    </div>

                    <div className='cards'>
                        {this.state.walletdata.map((wallet, index) => {

                            return (
                                <WalletCard
                                    key={index}
                                    wallet_icon={wallet.wallet_icon}
                                    coin_name={wallet.coin_name}
                                    wallet_name={wallet.wallet_name}
                                    wallet_account_number={wallet.wallet_account_number}
                                    wallet_amount={wallet.wallet_amount}
                                    wallet_coins={wallet.wallet_coins}
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
    walletState: state.WalletState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Wallet.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);



