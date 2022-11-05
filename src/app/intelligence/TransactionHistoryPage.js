import React, { Component } from 'react'
import { Image, Row, Col } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import TransactionTable from './TransactionTable';
import Metamask from '../../assets/images/MetamaskIcon.svg'
import CoinChip from '../wallet/CoinChip';
import { connect } from "react-redux";
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, API_LIMIT, START_INDEX, SEARCH_BY_ASSETS_IN, SEARCH_BY_TEXT, SEARCH_BY_TIMESTAMP, SEARCH_BY_TYPE, SORT_BY_TIMESTAMP } from '../../utils/Constant'
import { searchTransactionApi, getFilters } from './Api';
import { getCoinRate } from '../Portfolio/Api.js'
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import moment from "moment"
import { SelectControl, FormElement, Form, CustomTextControl } from '../../utils/form';

class TransactionHistoryPage extends BaseReactComponent {
    constructor(props) {
        super(props);
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const page = params.get("p");
        const walletList = JSON.parse(localStorage.getItem("addWallet"))
        const address = walletList.map((wallet) => {
          return wallet.address
      })
      const  cond = [{
          key: SEARCH_BY_WALLET_ADDRESS_IN,
          value: address
      }]
        this.state = {
            year: '',
            search: '',
            method: '',
            asset: '',
            methodsDropdown: Method.opt,
            table: [],
            sort: [{key: SORT_BY_TIMESTAMP, value: false}],
            walletList,
            currentPage: page ? parseInt(page, 10) : START_INDEX,
            assetFilter: [],
            yearFilter: [],
            delayTimer: 0,
            condition: cond ? cond : [],
            isLoading:true,
        }
        this.delayTimer = 0
    }
    componentDidMount() {
        this.props.history.replace({
            search: `?p=${this.state.currentPage}`
        })

        this.callApi(this.state.currentPage || START_INDEX)
        getFilters(this)
        this.props.getCoinRate()
    }

    callApi = (page = START_INDEX) => {
        let data = new URLSearchParams()
        data.append("start", (page * API_LIMIT))
        data.append("conditions", JSON.stringify(this.state.condition))
        data.append("limit", API_LIMIT)
        data.append("sorts", JSON.stringify(this.state.sort))
        this.props.searchTransactionApi(data,this, page )
    }

    componentDidUpdate(prevProps, prevState) {
        const prevParams = new URLSearchParams(prevProps.location.search);
        const prevPage = parseInt(prevParams.get('p') || START_INDEX, 10);

        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('p') || START_INDEX, 10);

        if (prevPage !== page || prevState.condition !== this.state.condition) {
            this.callApi(page);
        }

    }


    onValidSubmit = () => {
        console.log("Sbmit")
    }

    addCondition = (key, value) => {
        let index = this.state.condition.findIndex((e) => e.key === key)
        // console.log("YES ,PRESENT", index)
        let arr = [...this.state.condition];
        let search_index = this.state.condition.findIndex((e) => e.key === SEARCH_BY_TEXT)

        // console.log(search_index, arr[search_index])
        if (index !== -1 && value !== 'allAssets' && value !== 'allMethod' && value !== 'allYear') {
          if(key===SEARCH_BY_ASSETS_IN){
            arr[index].value = [value.toString()]
          } else{
            arr[index].value = value
          }
        } else if (value === 'allAssets' || value === 'allMethod' || value === 'allYear') {
            arr.splice(index, 1)
        } else {
            let obj = {};
            if(key===SEARCH_BY_ASSETS_IN){
              obj = {
                key: key,
                value: [value.toString()]
              }
            } else{
              obj = {
                key: key,
                value: value
              }
            }
            arr.push(obj)
        }
        if (search_index !== -1) {
            if (value  === '' && key === SEARCH_BY_TEXT) {
                // console.log("remove", arr[search_index].value[0])
                arr.splice(search_index, 1)
            }
        }
        // On Filter start from page 0
        this.props.history.replace({
          search: `?p=${START_INDEX}`
      })
        this.setState({
            condition: arr,
        })
    }
    onChangeMethod = () => {
        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(() => {
            this.addCondition(SEARCH_BY_TEXT, this.state.search)
            // this.callApi(this.state.currentPage || START_INDEX, condition)
        }, 1000);
    };

    render() {
        const { table, totalPage, totalCount, currentPage } = this.props.intelligenceState;
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
                                isIcon={false}
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
                                isIcon={false}
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
                        let value;
                        chain.find((chain) => {
                            if (chain[0] === rowData.amount.id) {
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
                        let value;
                        chain.find((chain) => {
                            if (chain[0] === rowData.amount.id) {
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
                        let value;
                        chain.find((chain) => {
                            if (chain[0] === rowData.amount.id) {
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
                        <Form onValidSubmit={this.onValidSubmit} >
                            <Row>
                                <Col md={3}>
                                    <FormElement
                                        valueLink={this.linkState(this, "year")}

                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.yearFilter,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.year);
                                                    this.addCondition(SEARCH_BY_TIMESTAMP, this.state.year)
                                                },
                                                placeholder: "All Year"
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md={3}>
                                    <FormElement
                                        valueLink={this.linkState(this, "asset")}
                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.assetFilter,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.asset);
                                                    this.addCondition(SEARCH_BY_ASSETS_IN, this.state.asset)
                                                },
                                                placeholder: "All assets"
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md={3}>
                                    <FormElement
                                        valueLink={this.linkState(this, 'method')}

                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.methodsDropdown,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.year);
                                                    this.addCondition(SEARCH_BY_TYPE, this.state.method)

                                                },
                                                placeholder: "All methods",
                                            }

                                        }}
                                    />
                                </Col>
                                {/* {fillter_tabs} */}
                                <Col md={3}>
                                    <div className="searchBar">
                                        <Image src={searchIcon} className="search-icon" />
                                        <FormElement
                                            valueLink={this.linkState(
                                                this,
                                                "search",
                                                this.onChangeMethod
                                            )}
                                            control={{
                                                type: CustomTextControl,
                                                settings: {
                                                    placeholder: "Search",
                                                },
                                            }}
                                            classes={{
                                                inputField: "search-input",
                                                prefix: "search-prefix",
                                                suffix: "search-suffix",
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className='transaction-history-table'>
                        <TransactionTable
                            tableData={tableData}
                            columnList={columnList}
                            message={"No Transactions Found"}
                            totalPage={totalPage}
                            history={this.props.history}
                            location={this.props.location}
                            page={currentPage}
                            isLoading={this.state.isLoading}
                        />
                    </div>
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
    intelligenceState: state.IntelligenceState
});
const mapDispatchToProps = {
    searchTransactionApi,
    getCoinRate,
    getFilters
}

TransactionHistoryPage.propTypes = {

};
export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistoryPage);

