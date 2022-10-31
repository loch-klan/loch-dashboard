import React, { Component } from 'react'
import { Image, Row, Col } from 'react-bootstrap';
import PageHeader from '../common/PageHeader';
import searchIcon from '../../assets/images/icons/search-icon.svg'
import TransactionTable from './TransactionTable';
import Metamask from '../../assets/images/MetamaskIcon.svg'
import CoinChip from '../wallet/CoinChip';
import { connect } from "react-redux";
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, API_LIMIT, START_INDEX } from '../../utils/Constant'
import { searchTransactionApi ,getFilters} from './Api';
import { getCoinRate } from '../Portfolio/Api.js'
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import moment from "moment"
import { SelectControl, FormElement, Form } from '../../utils/form';

class TransactionHistoryPage extends BaseReactComponent {
    constructor(props) {
        super(props);
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const page = params.get("p");
        this.state = {
            year:'',
            method:'',
            asset:'',
            methodsDropdown: Method.opt,
            table: [],
            sort: [],
            currentPage: page ? parseInt(page, 10) : START_INDEX,
            assetFilter: [],
            yearFilter: [],
        }
    }
    componentDidMount() {
      this.props.history.replace({
        search: `?p=${this.state.currentPage}`
      })
        this.callApi(this.state.currentPage || START_INDEX)
        getFilters(this)
        this.props.getCoinRate()
    }
    componentDidUpdate(prevProps, prevState) {
      const prevParams = new URLSearchParams(prevProps.location.search);
      const prevPage = parseInt(prevParams.get('p') || START_INDEX, 10);

      const params = new URLSearchParams(this.props.location.search);
      const page = parseInt(params.get('p') || START_INDEX, 10);

      if (prevPage !== page) {
          this.callApi(page);
      }
    }
    callApi = (page = START_INDEX) => {
        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let address = arr.map((wallet) => {
            return wallet.address
        })
        let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }]
        let data = new URLSearchParams()
        data.append("start", (page * API_LIMIT))
        data.append("conditions", JSON.stringify(condition))
        data.append("limit", API_LIMIT)
        data.append("sorts", JSON.stringify(this.state.sort))
        this.props.searchTransactionApi(data, page)
    }

    onValidSubmit = ()=>{
        console.log("Submit")
    }
    render() {
        const {table, totalPage, totalCount, currentPage} = this.props.intelligenceState;
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
                                        valueLink={this.linkState(this,"year")}

                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.yearFilter,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.year);
                                                },
                                                placeholder:"All Year"
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md={3}>
                                    <FormElement
                                        valueLink={this.linkState(this,"asset")}
                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.assetFilter,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.asset);
                                                },
                                                placeholder:"All assets"
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md={3}>
                                    <FormElement
                                        valueLink={this.linkState(this,'method')}

                                        control={{
                                            type: SelectControl,
                                            settings: {
                                                options: this.state.methodsDropdown,
                                                multiple: false,
                                                searchable: true,
                                                onChangeCallback: (onBlur) => {
                                                    onBlur(this.state.year);
                                                },
                                                placeholder: "All methods",
                                            }

                                        }}
                                    />
                                </Col>
                                {/* {fillter_tabs} */}
                                {/*
                                delayTimer;
  onChangeMethod = (value) => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      API CALL
    }, 1000);
  };
                                <FormElement
                  valueLink={this.linkState(
                    this,
                    "search",
                    this.onChangeMethod
                  )}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: this.props.placeholder,
                    },
                  }}
                  classes={{
                    inputField: "search-input",
                    prefix: "search-prefix",
                    suffix: "search-suffix",
                  }}
                />
                                */}
                                <Col md={3}>
                                <div className="searchBar">
                                    <Image src={searchIcon} />
                                    <input placeholder='Search' type="text" />
                                </div>
                                </Col>
                        </Row>
                            </Form>
                    </div>
                    <TransactionTable
                        tableData={tableData}
                        columnList={columnList}
                        message={"No Transactions Found"}
                        totalPage={totalPage}
                        history={this.props.history}
                        location={this.props.location}
                        page={currentPage}
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

