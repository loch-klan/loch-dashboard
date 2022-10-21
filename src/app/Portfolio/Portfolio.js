import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { getCoinRate, getDetailsByLinkApi, getUserWallet, settingDefaultValues } from "./Api";
import { Loading } from 'react-loading-dot';
import { Button ,Image} from 'react-bootstrap';
import AddWalletModalIcon from '../../assets/images/icons/wallet-icon.svg'
import FixAddModal from '../common/FixAddModal';
import { getAllCoins } from '../onboarding/Api.js'
import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import TransactionTable from '../intelligence/TransactionTable';
import CoinChip from './../wallet/CoinChip';
import BarGraphSection from './../common/BarGraphSection';
class Portfolio extends BaseReactComponent {
    constructor(props) {
        super(props);
        props.location.state && localStorage.setItem("addWallet", JSON.stringify(props.location.state.addWallet))
        this.state = {
            userWalletList: JSON.parse(localStorage.getItem("addWallet")),
            assetTotalValue: 0,
            loader: false,
            coinAvailable: true,
            fixModal: false,
            addModal: false,
        }
    }

    handleChangeList = (value) => {
        this.setState({
            userWalletList: value
        })
        this.props.getCoinRate()
    }
    handleFixModal = () => {
        this.setState({
            fixModal: !this.state.fixModal
        })
    }

    handleAddModal = () => {
        this.setState({
            addModal: !this.state.addModal
        })
    }
    componentDidMount() {
        if (this.props.match.params.id) {
            getDetailsByLinkApi(this.props.match.params.id, this)
        }
        this.props.getCoinRate()
        this.props.getAllCoins()
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        // Check if the coin rate api values are changed
        if (this.props.portfolioState.coinRateList !== prevProps.portfolioState.coinRateList) {
            if (this.state && this.state.userWalletList && this.state.userWalletList.length > 0) {
                console.log("ComponentdidUpdate")
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
                    }
                    if (i === (this.state.userWalletList.length - 1)) {
                        this.setState({
                            loader: false
                        });
                    }
                })
            } else{
              console.log('Heyyy');
              this.props.settingDefaultValues();
            }
        }
    }

    
    render() {
        const tableData = [
            {
                time: "4/22",
                from: Metamask,
                to: Metamask,
                asset: Ethereum,
                usdValue: 0,
                method: "Burn"
            },
            {
                time: "4/22",
                from: Metamask,
                to: Metamask,
                asset: Ethereum,
                usdValue: 0,
                method: "Mint"
            },
            {
                time: "4/22",
                from: Metamask,
                to: Metamask,
                asset: Ethereum,
                usdValue: 0,
                method: "Transfer"
            },
            {
                time: "4/22",
                from: Metamask,
                to: Metamask,
                asset: Ethereum,
                usdValue: 0,
                method: "Commit"
            },

        ]
        
        const columnList = [
            {
                labelName: "Time",
                dataKey: "time",
                coumnWidth: 44,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {
                        return rowData.time
                    }
                }
            },
            {
                labelName: "From",
                dataKey: "from",
                coumnWidth: 46,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "from") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={true}
                                isInfo={true}
                                isText={true}
                                text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                            >
                                <Image src={rowData.from} className="history-table-icon" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName: "To",
                dataKey: "to",
                coumnWidth: 30,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "to") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={true}
                                isInfo={true}
                                isText={true}
                                text={"0xF977814e90dA44bFA03b6295A0616a897441aceC"}
                            >
                                <Image src={rowData.to} className="history-table-icon" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName: "Asset",
                dataKey: "asset",
                coumnWidth: 66,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "asset") {
                        return (
                            <CoinChip
                            coin_img_src = {rowData.asset}
                            coin_code = "ETH"
                            />
                        )
                    }
                }
            },
            {
                labelName: "USD Value",
                dataKey: "usdValue",
                coumnWidth: 83,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "usdValue") {
                        return rowData.usdValue
                    }
                }
            },
            {
                labelName: "Method",
                dataKey: "method",
                coumnWidth: 70,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                            <div
                                className={
                                    `inter-display-medium f-s-13 lh-16 history-table-method 
                                    ${rowData.method === "Burn" ? "burn"
                                        :
                                        rowData.method === "Transfer" ? "transfer"
                                        :
                                        rowData.method === "Mint" ? "mint"
                                        :
                                        rowData.method === "Commit" ? "commit"
                                        :
                                        ""
                                    }`
                                }
                            >
                                {rowData.method}
                            </div>
                        )
                    }
                }
            }
        ]

        const labels = ["AAVE" , "Binance" , "Kraken" ,"Gemini","Coinbase"]

        const options = {
            responsive:true,
            // maintainAspectRatio:false,
            plugins: {
                legend: {
                    display:false
                },
            },
            scales:{
                y:{
                    min:0,
                    max:40000,
                    
                    ticks:{
                        stepSize:8000,
                        padding:8,
                        size:12,
                        lineHeight:20,
                        family:"Helvetica Neue",
                        weight:400,
                        color: "#B0B1B3"
                    },
                    grid:{
                        drawBorder:false,
                        display:true,
                        borderDash: ctx=>ctx.index == 0 ? [0] : [4],
                        drawTicks:false
                    }
                },
                x:{
                    ticks:{
                        font:"Inter-SemiBold",
                        size:10,
                        lineHeight:12,
                        weight:600,
                        color:"#86909C",
                        maxRotation:0,
                        minRotation:0,


                    },
                    grid:{
                        display:false,
                        borderWidth:1,
                    }
                }
            }
        }

        const data = {
            labels,
            datasets: [
                {
                    data: [26000, 32300, 7600, 6000, 800],
                    backgroundColor: [
                        "rgba(100, 190, 205, 0.3)",
                        "rgba(34, 151, 219, 0.3)",
                        "rgba(114, 87, 211, 0.3)",
                        "rgba(141, 141, 141, 0.3)",
                        " rgba(84, 84, 191, 0.3)",
                    ],
                    borderColor: [
                        "#64BECD",
                        "#2297DB",
                        "#7257D3",
                        "#8D8D8D",
                        "#5454BF",
                    ],
                    borderWidth: 2,
                    borderRadius:{
                        topLeft:6,
                        topRight:6
                    },
                    borderSkipped:false,
                    
                }
            ]
        }
        
        return (
            <div>
                {this.state.loader ? <Loading /> :
                    <div className="portfolio-page-section" >
                        {/* <Sidebar ownerName="" /> */}
                        <div className='portfolio-container'>
                            <div className='portfolio-section page'>
                                <WelcomeCard
                                    decrement={true}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader} history={this.props.history}
                                    handleAddModal={this.handleAddModal}
                                    handleManage={() => this.props.history.push('/wallets')}
                                />
                            </div>
                            <div className='portfolio-section page'>
                                <PieChart
                                    userWalletData={this.props.portfolioState && this.props.portfolioState.chainWallet && Object.keys(this.props.portfolioState.chainWallet).length > 0 ? Object.values(this.props.portfolioState.chainWallet) : null}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader}
                                />
                                {this.state.userWalletList.findIndex(w => w.coinFound !== true) > -1

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
                            <div className='portfolio-section page m-b-32'>
                                <LineChart
                                    coinLists = {this.props.OnboardingState.coinsLists}
                                />
                            </div>
                            <div className='m-b-32 page graph-table-section'>
                                <div className='m-r-16 section-table'>
                                    <TransactionTable
                                        title ="Transaction History"
                                        subTitle="In the last month"
                                        tableData={tableData}
                                        columnList={columnList}
                                    />
                                </div>
                                <div className='section-chart'>
                                    <BarGraphSection
                                        headerTitle = "Volume Traded by Counterparty"
                                        headerSubTitle = "In the last month"
                                        isArrow={true}
                                        data={data}
                                        options={options}
                                        width={"100%"}
                                        height={"100%"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.fixModal &&
                    <FixAddModal
                        show={this.state.fixModal}
                        onHide={this.handleFixModal}
                        //  modalIcon={AddWalletModalIcon}
                        title="Fix your wallet connection"
                        subtitle="Add your wallet address to get started"
                        // fixWalletAddress={fixWalletAddress}
                        btnText="Done"
                        btnStatus={true}
                        history={this.props.history}
                        modalType="fixwallet"
                        changeWalletList={this.handleChangeList}
                    />
                }
                {this.state.addModal &&
                    <FixAddModal
                        show={this.state.addModal}
                        onHide={this.handleAddModal}
                        modalIcon={AddWalletModalIcon}
                        title="Add wallet address"
                        subtitle="Add more wallet address here"
                        modalType="addwallet"
                        btnStatus={false}
                        btnText="Go"
                        history={this.props.history}
                        changeWalletList={this.handleChangeList}
                    />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState,
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    getCoinRate,
    getUserWallet,
    settingDefaultValues,
    getAllCoins
}
Portfolio.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

