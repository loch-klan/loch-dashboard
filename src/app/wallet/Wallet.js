import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WalletCard from './WalletCard';
import { Image } from 'react-bootstrap';
import Icon from "../../image/ArrowRight.svg"
import { Button ,Dropdown , DropdownButton } from 'react-bootstrap';
import DropDown from './DropDown';
import data from "./walletDate.js"

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeBadge : 0,
            walletdata: data
        };
        this.badgeList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]

    }

    componentDidMount() { }

    render() {

        return (
            <div className="wallet-page-section">
                <Sidebar ownerName="" />
                <div className='wallet-section page'>

                    <div className='m-b-36 wallet-page-header'>
                        <div className='header'>
                            <h4 className='inter-display-medium f-s-31 lh-37 m-b-12'>Wallets</h4>
                            <p className="inter-display-medium f-s-16 lh-19">Manage all your wallets right here</p>
                        </div>
                        <Button className='primary-btn'>Add wallet</Button>
                    </div>

                    <div className='wallet-badges'>
                        <div className='badge-list'>
                            {this.badgeList.map((badge, index) => {
                                const className = index == this.state.activeBadge ? "inter-display-medium f-s-13 lh-16 m-r-16 badge-name badge-active" : 
                                "inter-display-medium f-s-13 lh-16 m-r-16 badge-name"
                                return (
                                    <div id={index} key={index} className={className}>{badge}</div>
                                )
                            })}
                        </div>

                        <DropDown 
                        id="dropdown-basic-badge-button"
                        title="Others"
                        list={["Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]}
                        />
                    </div>

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



