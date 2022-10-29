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
import { SEARCH_BY_WALLET_ADDRESS_IN ,Method, API_LIMIT, START_INDEX} from '../../utils/Constant'
import { searchTransactionApi} from './Api';
import { getCoinRate } from '../Portfolio/Api.js'
import moment from "moment"

class TransactionHistoryPage extends Component {
    constructor(props) {
        super(props);
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const page = params.get("p");
        console.log('page',page);
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
                    data: Method.opt
                }],
            table: [],
            sort: [],
            start: 0,
            limit: 10,
            totalPages: 0,
            // currentPage: page,
            currentPage: page ? parseInt(page, 10) : START_INDEX,
        }
    }
    componentDidMount() {
      // this.props.history.replace({
      //   search: `?p=${this.state.currentPage}`
      // })
        this.callApi()
        this.props.getCoinRate()
    }
//     componentDidUpdate(prevProps, prevState) {
//       const prevParams = new URLSearchParams(prevProps.location.search);
//       const prevPage = parseInt(prevParams.get('p') || START_INDEX, 10);
// console.log('prevPage',prevPage);
//       const params = new URLSearchParams(this.props.location.search);
//       const page = parseInt(params.get('p') || START_INDEX, 10);
//       console.log('page',page);
//       if (prevPage !== page) {
//         console.log('Heyy');
//           this.callApi(page);
//       }
//   }
    callApi = (page = 0) => {

        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let address = arr.map((wallet) => {
            return wallet.address
        })
        let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }]
        let data = new URLSearchParams()
        data.append("start", (page * API_LIMIT))
        data.append("conditions", JSON.stringify(condition))
        data.append("limit", 100)
        data.append("sorts", JSON.stringify(this.state.sort))
        // console.log(data)
        this.props.searchTransactionApi(this, data, page)
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
                usdValueToday: 0,
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

                        return moment(rowData.time).format('DD/MM')
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
                                value = (rowData.amount.amount * chain[1].quote.USD.price)
                                return
                            }
                        })
                        // console.log(value)
                        return value?.toFixed(2)
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
                        return rowData.usdValueThen?.toFixed(2)
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
                        return value?.toFixed(2)
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
                    // console.log(rowData)
                    if (dataKey === "usdTransactionFee") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value ;
                        chain.find((chain)=>{
                            if(chain[0] === rowData.amount.id){
                                value = (rowData.usdTransactionFee * chain[1].quote.USD.price)
                                return
                            }
                        })
                        return value?.toFixed(2)

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


        return (
            <div className="history-table-section">
                <div className='history-table page'>

                    <PageHeader
                        title={"Transaction history"}
                        subTitle={"Valuable insights based on your assets"}
                        showpath={true}
                        currentPage={"transaction-history"}
                        history={this.props.history}
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
                        message={"No Transactions Found"}
                        // totalPages={this.state.totalPages}
                        // history={this.props.history}
                        // location={this.props.location}
                        // page={this.state.currentPage}
                    />
                    {/* <CommonPagination
                        numOfPages={3}
                    // setValue={setPage}
                    /> */}


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

