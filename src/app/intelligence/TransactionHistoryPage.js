import React, { Component } from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import TransactionTable from "./TransactionTable";
import CoinChip from "../wallet/CoinChip";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, API_LIMIT, START_INDEX, SEARCH_BY_ASSETS_IN, SEARCH_BY_TEXT, SEARCH_BY_TIMESTAMP_IN, SEARCH_BY_METHOD_IN, SORT_BY_TIMESTAMP, SORT_BY_FROM_WALLET, SORT_BY_TO_WALLET, SORT_BY_ASSET, SORT_BY_AMOUNT, SORT_BY_USD_VALUE_THEN, SORT_BY_TRANSACTION_FEE, SORT_BY_METHOD } from "../../utils/Constant";
import { searchTransactionApi, getFilters } from "./Api";
import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import { FormElement, Form, CustomTextControl, BaseReactComponent } from "../../utils/form";
import unrecognizedIcon from "../../image/unrecognized.svg";
import sortByIcon from "../../assets/images/icons/TriangleDown.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
import { noExponents } from "../../utils/ReusableFunctions";

class TransactionHistoryPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const walletList = JSON.parse(localStorage.getItem("addWallet"));
    const address = walletList.map((wallet) => {
      return wallet.address;
    });
    const cond = [
      {
        key: SEARCH_BY_WALLET_ADDRESS_IN,
        value: address,
      },
    ];
    this.state = {
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      walletList,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      assetFilter: [],
      yearFilter: [],
      methodFilter: [],
      delayTimer: 0,
      condition: cond ? cond : [],
      tableLoading: true,
      tableSortOpt: [
        {
          title: "time",
          up: false,
        },
        {
          title: "from",
          up: false,
        },
        {
          title: "to",
          up: false,
        },
        {
          title: "asset",
          up: false,
        },
        {
          title: "amount",
          up: false,
        },
        {
          title: "usdThen",
          up: false,
        },
        {
          title: "usdToday",
          up: false,
        },
        {
          title: "usdTransaction",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
      ],
    };
    this.delayTimer = 0;
  }
  componentDidMount() {
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    this.callApi(this.state.currentPage || START_INDEX);
    getFilters(this);
    this.props.getCoinRate();
  }

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this, page);
  };

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      this.callApi(page);
    }
  }

    onValidSubmit = () => {
        console.log("Sbmit")
    }

  addCondition = (key, value) => {
    // console.log('key, value',key, value);
    let index = this.state.condition.findIndex((e) => e.key === key);
    // console.log('index',index);
    let arr = [...this.state.condition];
    let search_index = this.state.condition.findIndex(
      (e) => e.key === SEARCH_BY_TEXT
    );
    if (
      index !== -1 &&
      value !== "allAssets" &&
      value !== "allMethod" &&
      value !== "allYear"
    ) {
      arr[index].value = value;
    } else if (
      value === "allAssets" ||
      value === "allMethod" ||
      value === "allYear"
    ) {
      arr.splice(index, 1);
    } else {
      let obj = {};
      obj = {
        key: key,
        value: value,
      };
      arr.push(obj);
    }
    if (search_index !== -1) {
      if (value === "" && key === SEARCH_BY_TEXT) {
        arr.splice(search_index, 1);
      }
    }
    // On Filter start from page 0
    this.props.history.replace({
      search: `?p=${START_INDEX}`,
    });
    this.setState({
      condition: arr,
    });
  };
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  handleTableSort = (val) => {
    // console.log(val)
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort.map((el) => {
      if (el.title === val) {
        if (val === "time") {
          obj = [
            {
              key: SORT_BY_TIMESTAMP,
              value: !el.up,
            },
          ];
        } else if (val === "from") {
          obj = [
            {
              key: SORT_BY_FROM_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "to") {
          obj = [
            {
              key: SORT_BY_TO_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
        } else if (val === "amount") {
          obj = [
            {
              key: SORT_BY_AMOUNT,
              value: !el.up,
            },
          ];
        } else if (val === "usdThen") {
          obj = [
            {
              key: SORT_BY_USD_VALUE_THEN,
              value: !el.up,
            },
          ];
        }
        else if (val === "usdTransaction") {
          obj = [
            {
              key: SORT_BY_TRANSACTION_FEE,
              value: !el.up,
            },
          ];
        } else if (val === "method") {
          obj = [
            {
              key: SORT_BY_METHOD,
              value: !el.up,
            },
          ];
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    this.setState({
      sort: obj,
      tableSortOpt: sort
    });
    }
    render() {
        const { table, totalPage, totalCount, currentPage } = this.props.intelligenceState;
        const {walletList} = this.state;
        let tableData = table && table.map((row) => {
            return {
                time: row.timestamp,
                from: {
                    address: row.from_wallet.address,
                    metaData: walletList && walletList.map((wallet)=>{
                      if(
                        wallet.address?.toLowerCase() === row.from_wallet.address?.toLowerCase() ||
                        wallet.displayAddress?.toLowerCase() === row.from_wallet.address?.toLowerCase()){
                          return wallet.wallet_metadata
                        } else {
                          return null
                        }
                      }),
                    // wallet_metaData: row.from_wallet.wallet_metaData
                    wallet_metaData: {
                        symbol: row.from_wallet.wallet_metadata ? row.from_wallet.wallet_metadata.symbol : null,
                        text: row.from_wallet.wallet_metadata ? row.from_wallet.wallet_metadata.name : null
                    }
                },
                to: {
                    address: row.to_wallet.address,
                    // wallet_metaData: row.to_wallet.wallet_metaData,
                    metaData: walletList && walletList.map((wallet)=>{
                      if(wallet.address?.toLowerCase() == row.to_wallet.address?.toLowerCase() ||
                      wallet.displayAddress?.toLowerCase() == row.to_wallet.address?.toLowerCase()){
                          return wallet.wallet_metadata
                        } else {
                          return null
                        }
                      }),
                    wallet_metaData: {
                        symbol: row.to_wallet.wallet_metadata ? row.to_wallet.wallet_metadata.symbol : null,
                        text: row.to_wallet.wallet_metadata ? row.to_wallet.wallet_metadata.name : null
                    },
                },
                asset: {
                    code: row.asset.code,
                    symbol: row.asset.symbol
                },
                amount: {
                    value: parseFloat(row.asset.value),
                    id: row.asset.id
                },
                usdValueThen: {
                    value: row.asset.value,
                    id: row.asset.id,
                    assetPrice: row.asset_price
                },
                usdValueToday: {
                    value: row.asset.value,
                    id: row.asset.id
                },
                usdTransactionFee: {
                    value: row.transaction_fee,
                    id: row.asset.id,
                },
                // method: row.transaction_type
                method: row.method
            }
        })
// console.log('tableData',tableData);
        const columnList = [
            {
                labelName:
                    <div className='cp history-table-header-col' id="time" onClick={() => this.handleTableSort("time")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Date</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "time",
                // coumnWidth: 90,
                coumnWidth: 0.16,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {

                        return moment(rowData.time).format('DD/MM/YYYY')
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="from" onClick={() => this.handleTableSort("from")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>From</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"} />
                    </div>,
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
                                // text={rowData.from.address}
                                text={rowData.from.wallet_metaData.text ? (rowData.from.wallet_metaData.text + ": " + rowData.from.address) : rowData.from.address}
                            >
                              {
                                rowData.from.metaData[0]
                                ?
                                <Image src={rowData.from.metaData[0]?.symbol || unrecognizedIcon} className="history-table-icon" />
                                :
                                rowData.from.wallet_metaData.symbol || rowData.from.wallet_metaData.text
                                ?
                                rowData.from.wallet_metaData.symbol
                                ?
                                <Image src={rowData.from.wallet_metaData.symbol} className="history-table-icon" />
                                :
                                <span>{rowData.from.wallet_metaData.text}</span>
                                :
                                 <Image src={unrecognizedIcon} className="history-table-icon" />
                              }

                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="to" onClick={() => this.handleTableSort("to")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>To</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "to",
                // coumnWidth: 90,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                  // console.log('rowData',rowData);
                    if (dataKey === "to") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={rowData.to.wallet_metaData.text ? (rowData.to.wallet_metaData.text + ": " + rowData.to.address) : rowData.to.address}
                            >
                              {
                                rowData.to.metaData[0]
                                ?
                                <Image src={rowData.to.metaData[0]?.symbol || unrecognizedIcon} className="history-table-icon" />
                                :
                                rowData.to.wallet_metaData.symbol || rowData.to.wallet_metaData.text
                                ?
                                rowData.to.wallet_metaData.symbol
                                ?
                                <Image src={rowData.to.wallet_metaData.symbol} className="history-table-icon" />
                                :
                                <span>{rowData.to.wallet_metaData.text}</span>
                                :
                                 <Image src={unrecognizedIcon} className="history-table-icon" />
                              }
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="asset" onClick={() => this.handleTableSort("asset")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Asset</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "asset",
                // coumnWidth: 130,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "asset") {

                        return (
                          <CustomOverlay
                                position="top"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={rowData.asset.code}
                            >
                            {/* <CoinChip
                                coin_img_src={rowData.asset.symbol}
                                // coin_code={rowData.asset.code}
                            /> */}
                            <Image src={rowData.asset.symbol} className="asset-symbol" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="amount" onClick={() => this.handleTableSort("amount")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Amount</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "amount",
                // coumnWidth: 100,
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "amount") {

                        // console.log(value)
                        // return rowData.amount.value?.toFixed(2)
                        return (<CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={noExponents(rowData.amount.value)}
                        >
                            <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{noExponents(rowData.amount.value)}</div>
                        </CustomOverlay>)
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="usdValueThen" onClick={() => this.handleTableSort("usdThen")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>USD Transaction Value Today (Then)</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "usdValueThen",
                // coumnWidth: 100,
                className: "usd-value",
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "usdValueThen") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let valueThen;
                        let valueToday;
                        chain.find((chain) => {
                          if (chain[0] === rowData.usdValueToday.id) {
                            valueToday = (rowData.usdValueToday.value * chain[1].quote.USD.price)
                          }
                          if (chain[0] === rowData.usdValueThen.id) {
                            valueThen = rowData.usdValueThen.value * rowData.usdValueThen.assetPrice
                          }
                        })
                        return (
                        <div style={{display: "flex", justifyContent: "center"}}>
                        <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={valueToday?.toFixed(2)}
                        >
                            <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{valueToday?.toFixed(2)}</div>
                        </CustomOverlay>
                        (
                        <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={valueThen?.toFixed(2)}
                        >
                            <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{valueThen?.toFixed(2)}</div>
                        </CustomOverlay>)
                        </div>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="usdTransactionFee" onClick={() => this.handleTableSort("usdTransaction")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>USD Transaction Fee Today (Then)</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[7].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "usdTransactionFee",
                // coumnWidth: 100,
                className: "usd-value",
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    // console.log(rowData)
                    if (dataKey === "usdTransactionFee") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let valueToday;
                        let valueThen;
                        chain.find((chain) => {
                            if (chain[0] === rowData.usdTransactionFee.id) {
                                valueToday = (rowData.usdTransactionFee.value * chain[1].quote.USD.price)
                                valueThen = rowData.usdTransactionFee.value * rowData.usdValueThen.assetPrice
                            }
                        })
                        return (
                          <div style={{display: "flex", justifyContent: "center"}}>
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              text={valueToday?.toFixed(2)}
                            >
                              <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{valueToday?.toFixed(2)}</div>
                            </CustomOverlay>
                            (<CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              text={valueThen?.toFixed(2)}
                            >
                              <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{valueThen?.toFixed(2)}</div>
                            </CustomOverlay>)
                          </div>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="method" onClick={() => this.handleTableSort("method")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Method</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[8].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "method",
                // coumnWidth: 100,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                            <div className='inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer' >
                              {rowData.method}
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

          <div className="fillter_tabs_section">
            <Form onValidSubmit={this.onValidSubmit}>
              <Row>
                <Col md={3}>
                  <CustomDropdown
                    filtername="All Year"
                    options={this.state.yearFilter}
                    action={SEARCH_BY_TIMESTAMP_IN}
                    handleClick={(key,value) => this.addCondition(key,value)}
                  />
                </Col>
                <Col md={3}>
                <CustomDropdown
                    filtername="All assets"
                    options={this.state.assetFilter}
                    action={SEARCH_BY_ASSETS_IN}
                    handleClick={(key,value) => this.addCondition(key,value)}
                  />
                </Col>
                <Col md={3}>
                <CustomDropdown
                    filtername="All method"
                    options={this.state.methodFilter}
                    action={SEARCH_BY_METHOD_IN}
                    handleClick={(key,value) => this.addCondition(key,value)}
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
          <div className="transaction-history-table">
            <TransactionTable
              tableData={tableData}
              columnList={columnList}
              message={"No Transactions Found"}
              totalPage={totalPage}
              history={this.props.history}
              location={this.props.location}
              page={currentPage}
              tableLoading={this.state.tableLoading}
            />
          </div>
          {/* <CommonPagination
                        numOfPages={3}
                    // setValue={setPage}
                    /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  intelligenceState: state.IntelligenceState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  getCoinRate,
  getFilters,
};

TransactionHistoryPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionHistoryPage);
