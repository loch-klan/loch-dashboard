import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { getCoinRate, getUserWallet } from "./Api";
import { Loading } from 'react-loading-dot';

class Portfolio extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            userWalletList: [
                {
                    "id": "wallet1",
                    "coins": [
                        {
                            "coinCode": "ETH",
                            "coinSymbol": "https://loch-public-assets.s3.ap-south-1.amazonaws.com/loch-ethereum.svg",
                            "coinName": "Ethereum",
                            "chain_detected": true
                        },
                        {
                            "coinCode": "SOLANA",
                            "coinSymbol": "https://loch-public-assets.s3.ap-south-1.amazonaws.com/loch-solana.svg",
                            "coinName": "Solana",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "BTC",
                            "coinSymbol": "https://loch-public-assets.s3.ap-south-1.amazonaws.com/loch-bitcoin.svg",
                            "coinName": "Bitcoin",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "FANTOM",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png",
                            "coinName": "Fantom",
                            "chain_detected": true
                        },
                        {
                            "coinCode": "POLYGON",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
                            "coinName": "Polygon",
                            "chain_detected": true
                        },
                        {
                            "coinCode": "AVALANCHE",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
                            "coinName": "Avalanche",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "LITECOIN",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
                            "coinName": "Litecoin",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "CELO",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/5567.png",
                            "coinName": "Celo",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "ALGORAND",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png",
                            "coinName": "Algorand",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "TRON",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
                            "coinName": "Tron",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "ADA",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
                            "coinName": "Cardano",
                            "chain_detected": false
                        },
                        {
                            "coinCode": "BSC",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
                            "coinName": "BSC",
                            "chain_detected": true
                        },
                        {
                            "coinCode": "OPTIMISM",
                            "coinSymbol": "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
                            "coinName": "Optimism",
                            "chain_detected": true
                        },
                        {
                            "coinCode": "ARBITRUM",
                            "coinSymbol": "https://offchainlabs.com/wp-content/themes/offchain/images/home/arbitrum/arbirtum_logo.svg",
                            "coinName": "Arbitrum",
                            "chain_detected": false
                        }
                    ],
                    "address": "0xF977814e90dA44bFA03b6295A0616a897441aceC",
                    "coinFound": true
                }
            ],
            assetTotalValue: 0,
            loader: true
        }

    }

    componentDidMount() {
        this.props.getCoinRate()
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.portfolioState.coinRateList !== prevProps.portfolioState.coinRateList) {
            if (this.state && this.state.userWalletList && this.state.userWalletList.length > 0) {
                for (let i = 0; i < this.state.userWalletList.length; i++) {
                    if (this.state.userWalletList[i].coinFound) {
                        for (let j = 0; j < this.state.userWalletList[i].coins.length; j++) {
                            if (this.state.userWalletList[i].coins[j].chain_detected) {
                                let userCoinWallet = {
                                    address: this.state.userWalletList[i].address,
                                    coinCode: this.state.userWalletList[i].coins[j].coinCode
                                }
                                this.props.getUserWallet(userCoinWallet)
                            }
                        }
                    }
                    if (i === (this.state.userWalletList.length - 1)) {
                        this.setState({
                            loader: false
                        });
                    }
                }
            }
        }
    }

    // assetTotal = () => {
    //     let assetTotal = 0;
    //     // for (let i = 0; i < this.state.userWalletList.length; i++) {
    //     //     if (this.state.userWalletList[i].coinAssets) {
    //     //         for (let j = 0; j < this.state.userWalletList[i].coinAssets.length; j++) {
    //     //             assetTotal = assetTotal + this.state.userWalletList[i].coinAssets[j].assetValue;
    //     //             return assetTotal
    //     //         }
    //     //     }
    //     // }
    // }

    render() {
        console.log(this.props)
        return (
            <div>
                {this.state.loader ? <Loading /> :
                    <div className="portfolio-page-section" >
                        <Sidebar ownerName="" />
                        <div className='portfolio-container'>
                            <div className='portfolio-section page'>
                                <WelcomeCard
                                    decrement={true}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader} />
                            </div>
                            <div className='portfolio-section page'>
                                <PieChart
                                    userWalletData={this.props.portfolioState && this.props.portfolioState.chainWallet && Object.keys(this.props.portfolioState.chainWallet).length > 0 ? this.props.portfolioState.chainWallet : null}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader} />
                            </div>
                            <div className='portfolio-section page'>
                                <LineChart />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
    getCoinRate,
    getUserWallet

}
Portfolio.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

