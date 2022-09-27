import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { getCoinRate, getUserWallet, settingDefaultValues } from "./Api";
import { Loading } from 'react-loading-dot';
import { Button } from 'react-bootstrap';
import CloseIcon from '../../assets/images/icons/close-icon.svg'
import AddWalletModalIcon from'../../assets/images/icons/AddWalletModalIcon.svg'
import FixAddModal from '../common/FixAddModal';
class Portfolio extends BaseReactComponent {
    constructor(props) {
        super(props);
        props.location.state && localStorage.setItem("addWallet", JSON.stringify(props.location.state.addWallet))
        this.state = {
            userWalletList: JSON.parse(localStorage.getItem("addWallet")),
            assetTotalValue: 0,
            loader: false,
            coinAvailable: true,
            fixModal : false,
            addModal:false,
        }
        this.handleFixModal = this.handleFixModal.bind(this)
        this.handleAddModal = this.handleAddModal.bind(this)
    }

    handleFixModal(){
        this.setState((prev)=>({
            fixModal:!prev.fixModal
        }))
    }
    handleAddModal(){
        this.setState((prev)=>({
            addModal : !prev.addModal
        }))
    }
    componentDidMount() {
        this.props.getCoinRate()
    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        // Check if the coin rate api values are changed
        if (this.props.portfolioState.coinRateList !== prevProps.portfolioState.coinRateList) {
            if (this.state && this.state.userWalletList && this.state.userWalletList.length > 0) {
                // Resetting the user wallet list, total and chain wallet
                this.props.settingDefaultValues();
                // Loops on coins to fetch details of each coin which exist in wallet
                this.state.userWalletList.map((wallet, i) => {
                    if (wallet.coinFound) {
                        wallet.coins.map((coin) => {
                            let userCoinWallet = {
                                address: wallet.address,
                                coinCode: coin.coinCode
                            }
                            this.props.getUserWallet(userCoinWallet)
                        })
                    } else {
                        this.setState({
                            coinAvailable: false
                        })
                    }
                    if (i === (this.state.userWalletList.length - 1)) {
                        this.setState({
                            loader: false
                        });
                    }
                })
            }
        }
    }
    render() {
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
                                    loader={this.state.loader} history={this.props.history}
                                    handleAddModal = {this.handleAddModal}
                                />
                            </div>
                            <div className='portfolio-section page'>
                                <PieChart
                                    userWalletData={this.props.portfolioState && this.props.portfolioState.chainWallet && Object.keys(this.props.portfolioState.chainWallet).length > 0 ? Object.values(this.props.portfolioState.chainWallet) : null}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader}
                                />
                                {this.state.coinAvailable === false
                                    ?
                                    <div className='fix-div' id="fixbtn">
                                        <div className='m-r-8 decribe-div'>
                                            <div className='inter-display-semi-bold f-s-16 lh-19 m-b-4 black-262'>Wallet undetected</div>
                                            <div className='inter-display-medium f-s-13 lh-16 grey-737'>One or more wallets were not detected </div>
                                        </div>
                                        <Button className='secondary-btn' onClick={this.handleFixModal}>Fix</Button>
                                    </div>
                                    : ""}
                            </div>
                            {/* <div className='portfolio-section page'>
                                <LineChart />
                            </div> */}
                        </div>
                    </div>
                }
                {
                    this.state.fixModal &&
                    <FixAddModal
                     show={this.state.fixModal}
                     onHide={this.handleFixModal}
                     closeIcon={CloseIcon}
                    //  modalIcon={AddWalletModalIcon}
                     title="Fix your wallet connection"
                     subtitle="Add your wallet address to get started"
                     fixWalletAddress={["0x9450C3C62119A6A2268E249D4B837B4442733CB0","0x9450C3C62119A6A2268E249D4B837B4442733CB0"]}
                     btnText="Done"
                     btnStatus="active"
                     modalType="fixwallet"
                    />
                }
                {this.state.addModal &&
                <FixAddModal
                    show={this.state.addModal}
                    onHide={this.handleAddModal}
                    closeIcon={CloseIcon}
                    modalIcon={AddWalletModalIcon}
                    title="Add wallet address"
                    subtile="Add more wallet address"
                    modalType="addwallet"
                    btnText="Add wallet"
                />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState
});
const mapDispatchToProps = {
    getCoinRate,
    getUserWallet,
    settingDefaultValues

}
Portfolio.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

