import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { getCoinRate, getDetailsByLinkApi, getUserWallet, settingDefaultValues } from "./Api";
import { Loading } from 'react-loading-dot';
import { Button, Image, Row, Col } from 'react-bootstrap';
import AddWalletModalIcon from '../../assets/images/icons/wallet-icon.svg'
import FixAddModal from '../common/FixAddModal';
import { getAllCoins } from '../onboarding/Api.js'
import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import TransactionTable from '../intelligence/TransactionTable';
import CoinChip from './../wallet/CoinChip';
import BarGraphSection from './../common/BarGraphSection';
import GainIcon from '../../assets/images/icons/GainIcon.svg'
import LossIcon from '../../assets/images/icons/LossIcon.svg'
import { searchTransactionApi } from '../intelligence/Api.js'
import { SEARCH_BY_WALLET_ADDRESS_IN ,Method, START_INDEX } from '../../utils/Constant'
import moment from "moment"
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
            isLoading:true,
            sort: [],
            limit: 6,
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
        this.getTableData()
    }
    getTableData = () => {

        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let address = arr.map((wallet) => {
            return wallet.address
        })
        let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }]
        let data = new URLSearchParams()
        data.append("start", START_INDEX)
        data.append("conditions", JSON.stringify(condition))
        data.append("limit", this.state.limit)
        data.append("sorts", JSON.stringify(this.state.sort))
        this.props.searchTransactionApi(data,this)
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        // Check if the coin rate api values are changed
        if (this.props.portfolioState.coinRateList !== prevProps.portfolioState.coinRateList) {
            if (this.state && this.state.userWalletList && this.state.userWalletList.length > 0) {
                // console.log("ComponentdidUpdate")
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
            } else {
                // console.log('Heyyy');
                this.props.settingDefaultValues();
            }
        }
    }


    render() {
      const {table} = this.props.intelligenceState;
        let tableData = table && table.map((row) => {
            return {
                time: row.timestamp,
                from: {
                    address: row.from_wallet.address,
                    // wallet_metaData: row.from_wallet.wallet_metaData
                    wallet_metaData: {
                        symbol: Metamask
                    }
                },
                to: {
                    address: row.to_wallet.address,
                    // wallet_metaData: row.to_wallet.wallet_metaData,
                    wallet_metaData: {
                        symbol: Metamask
                    },
                },
                asset: {
                    code: row.chain.code,
                    symbol: row.chain.symbol
                },

                usdValueToday: {
                    id: row.asset.id
                },
                method: row.transaction_type
            }
        })


        const columnList = [
            {
                labelName: "Time",
                dataKey: "time",
                // coumnWidth: 73,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {
                        return moment(rowData.time).format('DD/MM')
                    }
                }
            },
            {
                labelName: "From",
                dataKey: "from",
                // coumnWidth: 61,
                coumnWidth: 0.13,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "from") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={true}
                                isInfo={true}
                                isText={true}
                                text={rowData.from.address}
                            >
                                <Image src={rowData.from.wallet_metaData.symbol} className="history-table-icon" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName: "To",
                dataKey: "to",
                coumnWidth: 0.13,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "to") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={true}
                                isInfo={true}
                                isText={true}
                                text={rowData.to.address}
                            >
                                <Image src={rowData.to.wallet_metaData.symbol} className="history-table-icon" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName: "Asset",
                dataKey: "asset",
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "asset") {
                        return (
                            <CoinChip
                                coin_img_src={rowData.asset.symbol}
                                coin_code={rowData.asset.code}
                            />
                        )
                    }
                }
            },
            {
                labelName: "USD Value",
                dataKey: "usdValue",
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {

                    if (dataKey === "usdValue") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value ;
                        chain.find((chain)=>{
                            if(chain[0] === rowData.usdValueToday.id){
                               value = chain[1].quote.USD.price
                               return
                            }
                        })
                        return value?.toFixed(2);
                    }
                }
            },
            {
                labelName: "Method",
                dataKey: "method",
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                            <div
                                className={
                                    `inter-display-medium f-s-13 lh-16 black-191 history-table-method
                                    ${rowData.method === Method.BURN ? "burn"
                                        :
                                        rowData.method === Method.TRANSFER ? "transfer"
                                            :
                                            rowData.method === Method.MINT ? "mint"
                                                :
                                                rowData.method === Method.COMMIT ? "commit"
                                                    :
                                                    ""
                                    }`
                                }
                            >
                                {
                                    Method.getText(rowData.method)
                                }
                            </div>
                        )
                    }
                }
            }
        ]

        const labels = ["AAVE", "Binance", "Kraken", "Gemini", "Coinbase"]

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                y: {
                    min: 0,
                    max: 40000,

                    ticks: {
                        stepSize: 8000,
                        padding: 8,
                        size: 12,
                        lineHeight: 20,
                        // family: "Helvetica Neue",
                        family: "Inter-Regular",
                        weight: 400,
                        color: "#B0B1B3"
                    },
                    grid: {
                        drawBorder: false,
                        display: true,
                        borderDash: ctx => ctx.index == 0 ? [0] : [4],
                        drawTicks: false
                    }
                },
                x: {
                    ticks: {
                        font: "Inter-SemiBold",
                        size: 10,
                        lineHeight: 12,
                        weight: 600,
                        color: "#86909C",
                        maxRotation: 0,
                        minRotation: 0,


                    },
                    grid: {
                        display: false,
                        borderWidth: 1,
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
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6
                    },
                    borderSkipped: false,

                }
            ]
        }
        const costColumnData = [
            {
                labelName: "Asset",
                dataKey: "Asset",
                coumnWidth: 0.2,
                // coumnWidth: 118,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "Asset") {
                        return (
                            <CoinChip
                                coin_img_src={rowData.Asset}
                                coin_code="ETH"
                            />
                        )
                    }
                }
            }, {
                labelName: "Average Cost Price",
                dataKey: "AverageCostPrice",
                // coumnWidth: 153,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "AverageCostPrice") {
                        return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.AverageCostPrice}</div>
                    }
                }
            }, {
                labelName: "Current Price",
                dataKey: "CurrentPrice",
                // coumnWidth: 128,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CurrentPrice") {
                        return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.CurrentPrice}</div>
                    }
                }
            }, {
                labelName: "Amount",
                dataKey: "Amount",
                // coumnWidth: 108,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "Amount") {
                        return rowData.Amount
                    }
                }
            }, {
                labelName: "Cost Basis",
                dataKey: "CostBasis",
                // coumnWidth: 100,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CostBasis") {
                        return rowData.CostBasis
                    }
                }
            }, {
                labelName: "CurrentValue",
                dataKey: "CurrentValue",
                // coumnWidth: 140,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CurrentValue") {
                        return rowData.CurrentValue
                    }
                }
            }, {
                labelName: "% Gain / Loss",
                dataKey: "GainLoss",
                // coumnWidth: 128,
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "GainLoss") {
                        return (
                            <div className={`gainLoss ${rowData.GainLoss.status === "loss" ? "loss" : "gain"}`}>
                                <Image src={rowData.GainLoss.symbol} />
                                <div className="inter-display-medium f-s-13 lh-16 grey-313">{rowData.GainLoss.value}</div>
                            </div>)
                    }
                }
            }]
        const costTableData = [
            {
                Asset: Ethereum,
                AverageCostPrice: "$800.00",
                CurrentPrice: "$1,390.00",
                Amount: 3.97,
                CostBasis: 1.75,
                CurrentValue: "$5,514.00",
                GainLoss: {
                    status: "gain",
                    symbol: GainIcon,
                    // "42.45%",
                    value: "42.45%",
                }
            },
            {
                Asset: Ethereum,
                AverageCostPrice: "$25,000.00",
                CurrentPrice: "$21,080.00",
                Amount: 3.97,
                CostBasis: 2.56,
                CurrentValue: "$22,280.50",
                GainLoss: {
                    status: "loss",
                    symbol: LossIcon,
                    // "-18.45%"
                    value: "-18.45%"
                }
            }
        ]
        return (
            <div>
                {this.state.loader  ? <Loading/> :
                    <div className="portfolio-page-section" >
                        {/* <Sidebar ownerName="" /> */}
                        <div className='portfolio-container'>
                            <div className='portfolio-section page'>
                                <WelcomeCard
                                    decrement={true}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader} history={this.props.history}
                                    handleAddModal={this.handleAddModal}
                                    isLoading={this.state.isLoading}
                                    walletTotal={this.props.portfolioState.walletTotal}
                                    handleManage={() => this.props.history.push('/wallets')}
                                />
                            </div>
                            <div className='portfolio-section page'>
                                <PieChart
                                    userWalletData={this.props.portfolioState && this.props.portfolioState.chainWallet && Object.keys(this.props.portfolioState.chainWallet).length > 0 ? Object.values(this.props.portfolioState.chainWallet) : null}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader} 
                                    isLoading={this.state.isLoading}
                                    walletTotal={this.props.portfolioState.walletTotal}
                                />
                                {this.state.userWalletList.findIndex(w => w.coinFound !== true) > -1 && this.state.userWalletList[0].address !== ""

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
                                    coinLists={this.props.OnboardingState.coinsLists}
                                />
                            </div>
                            <div className='m-b-32 page graph-table-section'>
                                <Row>
                                    <Col md={6}>
                                        <div className='m-r-16 section-table'>
                                            <TransactionTable
                                                title="Transaction History"
                                                handleClick={()=>this.props.history.push("/intelligence/transaction-history")}
                                                subTitle="In the last month"
                                                tableData={tableData}
                                                columnList={columnList}
                                                headerHeight={60}
                                                isLoading={this.state.isLoading}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className='section-chart'>
                                            <BarGraphSection
                                                headerTitle="Volume Traded by Counterparty"
                                                headerSubTitle="In the last month"
                                                isArrow={true}
                                                data={data}
                                                options={options}
                                            // width="100%"
                                            // height="100%"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='m-b-40 portfolio-cost-table-section page'>
                                <div className='portfolio-cost-table'>
                                    <TransactionTable
                                        title="Average Cost Basis"
                                        subTitle="Understand your average entry price"
                                        tableData={costTableData}
                                        columnList={costColumnData}
                                        headerHeight={64}
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
    OnboardingState: state.OnboardingState,
    intelligenceState: state.IntelligenceState
});
const mapDispatchToProps = {
    getCoinRate,
    getUserWallet,
    settingDefaultValues,
    getAllCoins,
    searchTransactionApi
}
Portfolio.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

