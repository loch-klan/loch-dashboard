import React, { Component } from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import TransactionTable from "./TransactionTable";
import CoinChip from "../wallet/CoinChip";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, API_LIMIT, START_INDEX, SEARCH_BY_ASSETS_IN, SEARCH_BY_TEXT, SEARCH_BY_TIMESTAMP_IN, SEARCH_BY_TYPE_IN, SORT_BY_TIMESTAMP, SORT_BY_FROM_WALLET, SORT_BY_TO_WALLET, SORT_BY_ASSET, SORT_BY_AMOUNT, SORT_BY_USD_VALUE_THEN, SORT_BY_TRANSACTION_FEE, SORT_BY_METHOD } from "../../utils/Constant";
import { searchTransactionApi, getFilters } from "./Api";
import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import { SelectControl, FormElement, Form, CustomTextControl, BaseReactComponent } from "../../utils/form";
import unrecognizedIcon from "../../image/unrecognized.svg";
import sortByIcon from "../../assets/images/icons/TriangleDown.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
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
      isLoading: true,
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
    this.setState({ isLoading: true });
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
    console.log("Sbmit");
  };

  addCondition = (key, value) => {
    let index = this.state.condition.findIndex((e) => e.key === key);
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
      if (key === SEARCH_BY_ASSETS_IN) {
        // arr[index].value = [value.toString()]
        // console.log(arr[index]);
        arr[index].value = [...arr[index].value, value.toString()];
      } else if (key === SEARCH_BY_TYPE_IN) {
        arr[index].value = [...arr[index].value, value.toString()];
      } else if (key === SEARCH_BY_TIMESTAMP_IN) {
        // arr[index].value = value.toString();
           arr[index].value = [...arr[index].value, value.toString()];
      }
    } else if (
      value === "allAssets" ||
      value === "allMethod" ||
      value === "allYear"
    ) {
      arr.splice(index, 1);
    } else {
      let obj = {};
      if (key === SEARCH_BY_ASSETS_IN) {
        obj = {
          key: key,
          value: [value.toString()],
        };
      } else if (key === SEARCH_BY_TYPE_IN) {
        obj = {
          key: key,
          value: [value.toString()],
        };
      } else if (key === SEARCH_BY_TIMESTAMP_IN) {
        obj = {
          key: key,
          value: [value.toString()],
        };
      }
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
        // else if (val === "usdToday") {
        //     obj =[
        //         {
        //             key: SORT_BY_USD_VALUE_THEN,
        //             value: !el.up,
        //         }]
        // }
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
      tableSortOpt: sort,
    });
  };
    render() {
        //   console.log(this.state.yearFilter, "History Page Options");
    const { table, totalPage, totalCount, currentPage } =
      this.props.intelligenceState;
    let tableData =
      table &&
      table.map((row) => {
        return {
          time: row.timestamp,
          from: {
            address: row.from_wallet.address,
            // wallet_metaData: row.from_wallet.wallet_metaData
            wallet_metaData: {
              symbol: row.from_wallet.wallet_metaData
                ? row.from_wallet.wallet_metaData.symbol
                : unrecognizedIcon,
            },
          },
          to: {
            address: row.to_wallet.address,
            // wallet_metaData: row.to_wallet.wallet_metaData,
            wallet_metaData: {
              symbol: row.to_wallet.wallet_metaData
                ? row.to_wallet.wallet_metaData.symbol
                : unrecognizedIcon,
            },
          },
          asset: {
            code: row.asset.code,
            symbol: row.asset.symbol,
          },
          amount: {
            value: row.asset.value,
            id: row.asset.id,
          },
          usdValueThen: {
            value: row.asset.value,
            id: row.asset.id,
          },
          usdValueToday: {
            value: row.asset.value,
            id: row.asset.id,
            assetPrice: row.asset_price,
          },
          usdTransactionFee: {
            value: row.transaction_fee,
            id: row.asset.id,
          },
          // method: row.transaction_type
          method: row.method,
        };
      });

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="time"
            onClick={() => this.handleTableSort("time")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Date
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",
        // coumnWidth: 90,
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "time") {
            return moment(rowData.time).format("DD/MM/YYYY");
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="from"
            onClick={() => this.handleTableSort("from")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              From
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
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
                <Image
                  src={rowData.from.wallet_metaData.symbol}
                  className="history-table-icon"
                />
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="to"
            onClick={() => this.handleTableSort("to")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              To
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
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
                <Image
                  src={rowData.to.wallet_metaData.symbol}
                  className="history-table-icon"
                />
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="asset"
            onClick={() => this.handleTableSort("asset")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
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
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="amount"
            onClick={() => this.handleTableSort("amount")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "amount",
        // coumnWidth: 100,
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "amount") {
            // console.log(value)
            // return rowData.amount.value?.toFixed(2)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.amount.value}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.amount.value}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="usdValueThen"
            onClick={() => this.handleTableSort("usdThen")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              USD Value Then
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValueThen",
        // coumnWidth: 100,
        className: "usd-value",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "usdValueThen") {
            let chain = Object.entries(this.props.portfolioState.coinRateList);
            let value;
            chain.find((chain) => {
              if (chain[0] === rowData.usdValueThen.id) {
                value = rowData.usdValueThen.value * chain[1].quote.USD.price;
                return;
              }
            });
            // return value?.toFixed(2)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={value}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {value?.toFixed(2)}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: "USD Value Today",
        // <div className='cp history-table-header-col' id="usdValueToday" onClick={() => this.handleTableSort("usdToday")}>
        //     <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>USD Value Today</span>
        //     <Image src={sortByIcon} className={!this.state.tableSortOpt[6].up ? "rotateDown" : "rotateUp"} />
        // </div>,
        dataKey: "usdValueToday",
        // coumnWidth: 100,
        className: "usd-value",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "usdValueToday") {
            let chain = Object.entries(this.props.portfolioState.coinRateList);
            let value;
            chain.find((chain) => {
              if (chain[0] === rowData.usdValueToday.id) {
                value =
                  rowData.usdValueToday.value *
                  rowData.usdValueToday.assetPrice;
                return;
              }
            });
            // return value?.toFixed(2)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={value}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {value?.toFixed(2)}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="usdTransactionFee"
            onClick={() => this.handleTableSort("usdTransaction")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              USD Transaction Fee
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[7].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdTransactionFee",
        // coumnWidth: 100,
        className: "usd-value",
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          // console.log(rowData)
          if (dataKey === "usdTransactionFee") {
            let chain = Object.entries(this.props.portfolioState.coinRateList);
            let value;
            chain.find((chain) => {
              if (chain[0] === rowData.usdTransactionFee.id) {
                value =
                  rowData.usdTransactionFee.value * chain[1].quote.USD.price;
                return;
              }
            });
            // return value?.toFixed(2)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={value}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {value?.toFixed(2)}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="method"
            onClick={() => this.handleTableSort("method")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Method
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[8].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "method",
        // coumnWidth: 100,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "method") {
            return (
              // <div
              //     className={
              //         `inter-display-medium f-s-13 lh-16 black-191 history-table-method
              //         ${rowData.method === Method.BURN ? "burn"
              //             :
              //             rowData.method === Method.TRANSFER ? "transfer"
              //                 :
              //                 rowData.method === Method.MINT ? "mint"
              //                     :
              //                     rowData.method === Method.COMMIT ? "commit"
              //                         :
              //                         ""
              //         }`
              //     }
              // >
              <div className="inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer">
                {rowData.method}
                {/* {
                                    Method.getText(rowData.method)
                                } */}
              </div>
            );
          }
        },
      },
    ];
      return (

      <div className="history-table-section">
        <div className="history-table page">
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
                    action={SEARCH_BY_TYPE_IN}
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
              isLoading={this.state.isLoading}
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
