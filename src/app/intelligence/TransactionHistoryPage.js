import React, { Component } from 'react'
import { Button, Form, Image, Row, Col } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import DropDown from './../common/DropDown';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import { CommonPagination } from '../common/CommonPagination';
import TransactionTable from './TransactionTable';
import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import CoinChip from '../wallet/CoinChip';
import { connect } from "react-redux";
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import { SEARCH_BY_WALLET_ADDRESS_IN } from '../../utils/Constant'
import { searchTransactionApi} from './Api';
import { getCoinRate } from '../Portfolio/Api.js'
import moment from "moment"

class TransactionHistoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fillters: [
                {
                    title: "This year",
                    data: []
                },
                {
                    title: "All assets",
                    data: [],
                },
                {
                    title: "All methods",
                    data: [10, 20, 30, 40]
                }],
            table: [],
            sort: [],
            start: 0,
            limit: 10,
        }
    }
    componentDidMount() {
        this.callApi()
        this.props.getCoinRate()
    }
    callApi = () => {
        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let address = arr.map((wallet) => {
            return wallet.address
        })
        let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }]
        let data = new URLSearchParams()
        data.append("start", this.state.start)
        data.append("conditions", JSON.stringify(condition))
        data.append("limit", this.state.limit)
        data.append("sorts", JSON.stringify(this.state.sort))
        // console.log(data)
        this.props.searchTransactionApi(this, data)
        // console.log(d)
    }
    render() {
        const fillter_tabs = this.state.fillters.map((e) => {
            return (
                <Col md={3}>
                    <DropDown
                        id="dropdown-transaction-fillter-tab"
                        title={e.title}
                        list={e.data}
                    />
                </Col>)

        })

        
        let tableData = this.state.table.map((row) => {
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
                amount: {
                    amount: row.asset.value,
                    id: row.asset.id
                },
                usdValueThen: 0,
                usdValueToday:   0,
                usdTransactionFee: row.transaction_fee,
                method: row.transaction_type
            }
        })

        const columnList = [
            {
                labelName: "Time",
                dataKey: "time",
                // coumnWidth: 90,
                coumnWidth: 0.12,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {

                        return moment(rowData.time).format('L')
                    }
                }
            },
            {
                labelName: "From",
                dataKey: "from",
                // coumnWidth: 90,
                coumnWidth: 0.15,
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
                // coumnWidth: 90,
                coumnWidth: 0.15,
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
                // coumnWidth: 130,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "asset") {
                        // return (<div className='inter-display-medium f-s-13 lh-16 history-table-coin-icon'><Image src={rowData.asset.symbol} /> {rowData.asset.code}</div>)

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
                labelName: "Amount",
                dataKey: "amount",
                // coumnWidth: 100,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "amount") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value ;
                        chain.find((chain) => {
                            if(chain[0] === rowData.amount.id){
                                value = (rowData.amount.amount * chain[1].quote.USD.price).toFixed(2)
                                return
                            }
                        })
                        console.log(value)
                        return value
                    }
                }
            },
            {
                labelName: "USD Value Then",
                dataKey: "usdValueThen",
                // coumnWidth: 100,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "usdValueThen") {
                        return rowData.usdValueThen
                    }
                }
            },
            {
                labelName: "USD Value today",
                dataKey: "usdValueToday",
                // coumnWidth: 100,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {

                    if (dataKey === "usdValueToday") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value ;
                        chain.find((chain)=>{
                            if(chain[0] === rowData.amount.id){
                                value = chain[1].quote.USD.price
                                return
                            }
                        })
                        return value
                    }
                }
            },
            {
                labelName: "USD Transaction Fee",
                dataKey: "usdTransactionFee",
                // coumnWidth: 100,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                    console.log(rowData)
                    if (dataKey === "usdTransactionFee") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value ;
                        chain.find((chain)=>{
                            if(chain[0] === rowData.amount.id){
                                value = (rowData.usdTransactionFee * chain[1].quote.USD.price).toFixed(2) 
                            }
                        })
                        return value
                       
                    }
                }
            },
            {
                labelName: "Method",
                dataKey: "method",
                // coumnWidth: 100,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                            <div
                                className={
                                    `inter-display-medium f-s-13 lh-16 black-191 history-table-method 
                                    ${rowData.method === 10 ? "burn"
                                        :
                                        rowData.method === 20 ? "transfer"
                                            :
                                            rowData.method === 30 ? "mint"
                                                :
                                                rowData.method === 40 ? "commit"
                                                    :
                                                    ""
                                    }`
                                }
                            >
                                {rowData.method === 10 ? "Burn"
                                    :
                                    rowData.method === 20 ? "Transfer"
                                        :
                                        rowData.method === 30 ? "Mint"
                                            :
                                            "Commit"
                                }
                            </div>
                        )
                    }
                }
            }
        ]


        return (
            <div className="history-table-section">
                <div className='history-table '>
                    <PageHeader
                        title={"Transaction history"}
                        subTitle={"Valuable insights based on your assets"}
                        showpath={true}
                        currentPage={"transactionHistory"}
                    />

                    <div className='fillter_tabs_section'>
                        <Row>
                            {fillter_tabs}
                            <Col md={3}>
                                <Form className="searchBar">
                                    <Image src={searchIcon} />
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                    />
                                </Form>
                            </Col>
                        </Row>
                    </div>
                    {/* <CustomTable
        tableData={props.table_data}
        columnList={props.columnList}
      /> */}
                    <TransactionTable
                        tableData={tableData}
                        columnList={columnList}
                    />
                    <CommonPagination
                        numOfPages={3}
                    // setValue={setPage}
                    />


                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
    searchTransactionApi,
    getCoinRate
}

TransactionHistoryPage.propTypes = {

};
export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistoryPage);

