import { Component } from "react";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  convertNtoNumber,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { Col, Image, Row } from "react-bootstrap";
import arrowUp from "../../assets/images/arrow-up.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import Loading from "../common/Loading";
import "./_utils/_defiMobile.scss";

class DefiMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="defi-mobile-expanded expanded-mobile">
        <div className="mobile-header-container">
          <h4>Decentralized Finance</h4>
          <p>Decipher all your DeFi data from one place</p>
        </div>
        <div>
          <div
            style={{
              minWidth: "",
            }}
            className="balance-sheet-card"
          >
            <div className="balance-dropdown">
              <div className="balance-list-content">
                {/* For yeild */}
                <Row>
                  <Col md={6}>
                    <div
                      className="balance-sheet-title"
                      onClick={() => {
                        if (this.props.isDebtToggle) {
                          this.props.toggleDebt();
                        }
                        this.props.toggleYield();
                      }}
                    >
                      <div>
                        <span
                          className={`balance-sheet-title-text inter-display-semi-bold f-s-16 lh-19 ${
                            this.props.isYeildToggle
                              ? "balance-sheet-title-text-selected"
                              : ""
                          }`}
                        >
                          Credit
                        </span>
                        <span
                          className={`balance-sheet-title-amount inter-display-medium f-s-16 lh-19 ${
                            this.props.isYeildToggle
                              ? "balance-sheet-title-text-selected"
                              : ""
                          }`}
                        >
                          {CurrencyType(false)}
                          {this.props.defiStateLocally?.totalYield &&
                            numToCurrency(
                              this.props.defiStateLocally?.totalYield *
                                (this.props.currency?.rate || 1)
                            )}
                        </span>
                      </div>
                      <Image
                        className="defiMenu"
                        src={arrowUp}
                        style={
                          this.props.isYeildToggle
                            ? {
                                filter: "opacity(1)",
                              }
                            : { transform: "rotate(180deg)" }
                        }
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="balance-sheet-title"
                      onClick={() => {
                        if (this.props.isYeildToggle) {
                          this.props.toggleYield();
                        }
                        this.props.toggleDebt();
                      }}
                    >
                      <div>
                        <span
                          className={`balance-sheet-title-text inter-display-semi-bold f-s-16 lh-19 ${
                            this.props.isDebtToggle
                              ? "balance-sheet-title-text-selected"
                              : ""
                          }`}
                        >
                          Debt
                        </span>
                        <span
                          className={`balance-sheet-title-amount inter-display-medium f-s-16 lh-19 ${
                            this.props.isDebtToggle
                              ? "balance-sheet-title-text-selected"
                              : ""
                          }`}
                        >
                          {CurrencyType(false)}
                          {this.props.defiStateLocally?.totalDebt &&
                            numToCurrency(
                              this.props.defiStateLocally.totalDebt *
                                (this.props.currency?.rate || 1)
                            )}
                        </span>
                      </div>
                      <Image
                        className="defiMenu"
                        src={arrowUp}
                        style={
                          this.props.isDebtToggle
                            ? {
                                filter: "opacity(1)",
                              }
                            : { transform: "rotate(180deg)" }
                        }
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {this.props.isYeildToggle ? (
                      <div className="balance-sheet-list-container">
                        {this.props.defiStateLocally?.YieldValues?.length !==
                          0 &&
                          this.props.defiStateLocally?.YieldValues?.map(
                            (item, i) => {
                              return (
                                <div
                                  className="balance-sheet-list"
                                  style={
                                    i ===
                                    this.props.defiStateLocally.YieldValues
                                      ?.length -
                                      1
                                      ? { paddingBottom: "0.3rem" }
                                      : {}
                                  }
                                  key={`defiYEildValue-${i}`}
                                >
                                  <span className="inter-display-medium f-s-16 lh-19">
                                    {item.name}
                                  </span>
                                  <CustomOverlay
                                    position="top"
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={
                                      CurrencyType(false) +
                                      amountFormat(
                                        item.totalPrice.toFixed(2) *
                                          (this.props.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )
                                    }
                                  >
                                    <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                      {CurrencyType(false)}
                                      {numToCurrency(
                                        item.totalPrice.toFixed(2) *
                                          (this.props.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )}
                                    </span>
                                  </CustomOverlay>
                                </div>
                              );
                            }
                          )}
                      </div>
                    ) : null}
                    {this.props.isDebtToggle ? (
                      <div className="balance-sheet-list-container">
                        {this.props.defiStateLocally.DebtValues?.length !== 0 &&
                          this.props.defiStateLocally.DebtValues?.map(
                            (item, i) => {
                              return (
                                <div
                                  className="balance-sheet-list"
                                  style={
                                    i ===
                                    this.props.defiStateLocally.DebtValues
                                      ?.length -
                                      1
                                      ? { paddingBottom: "0.3rem" }
                                      : {}
                                  }
                                  key={`defiDebtValue-${i}`}
                                >
                                  <span className="inter-display-medium f-s-16 lh-19">
                                    {item.name}
                                  </span>
                                  <CustomOverlay
                                    position="top"
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={
                                      CurrencyType(false) +
                                      amountFormat(
                                        item.totalPrice.toFixed(2) *
                                          (this.props.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )
                                    }
                                  >
                                    <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                      {CurrencyType(false)}
                                      {numToCurrency(
                                        item.totalPrice.toFixed(2) *
                                          (this.props.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )}
                                    </span>
                                  </CustomOverlay>
                                </div>
                              );
                            }
                          )}
                      </div>
                    ) : null}
                  </Col>
                </Row>

                {/* For debt */}
              </div>
            </div>
          </div>
        </div>

        {/* filter */}
        <div
          style={{
            marginBottom: "1.6rem",
            // minWidth: "85rem",
          }}
          className="sortby-section"
        >
          <div
            style={{
              marginLeft: "-0.1rem",
            }}
            className="dropdown-section"
          >
            {/* <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-313 naming">
                  Sort by
                </span> */}
            {this.props.sortBy.map((e, index) => {
              return (
                <span
                  className="sort-by-title"
                  onClick={() => this.props.handleSort(e)}
                  key={`sortBy-${index}`}
                >
                  <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-7C7 ">
                    {e.title}
                  </span>{" "}
                  {/* <Image src={sort} style={{ width: "1rem" }} /> */}
                  <Image
                    src={sortByIcon}
                    // style={{ width: "1.6rem" }}
                    className={!e.down ? "rotateDown" : "rotateUp"}
                  />
                </span>
              );
            })}
          </div>
        </div>
        {/* End filter */}

        {/* start card */}

        {this.props.defiStateLocally?.defiList &&
        this.props.defiStateLocally.defiList.length !== 0 ? (
          this.props.defiStateLocally?.defiList?.map((card, index) => {
            return (
              <div className="defi-card-wrapper-mobile">
                <div className="top-title-wrapper">
                  <div className="heading-image">
                    <Image src={card?.logoUrl} />
                    <h3 className="inter-display-medium">{card?.name}</h3>
                    <span>Lending</span>
                  </div>
                  <h3 className="inter-display-medium f-s-16 lh-19">
                    {CurrencyType(false)}
                    {numToCurrency(
                      card?.netBalance * (this.state.currency?.rate || 1)
                    )}{" "}
                    <span className="inter-display-medium f-s-10 lh-19 grey-ADA">
                      {CurrencyType(true)}
                    </span>
                  </h3>
                </div>
                <div className="defi-card-divider-main"></div>
                {card.items
                  ? card.items.map((groupComp, i) => (
                      <div className="defi-card-component">
                        <div className="defi-card-component-header">
                          <div className="defi-card-component-header-left">
                            <div className="defi-card-component-header-left-left">
                              <Image src={card?.logoUrl} />
                            </div>
                            <div className="defi-card-component-header-left-right">
                              Ethereum
                            </div>
                          </div>
                          <div className="defi-card-component-header-right">
                            {groupComp.type}
                          </div>
                        </div>
                        <div className="defi-card-component-divider"></div>
                        <div className="defi-card-component-body">
                          <div className="defi-card-component-body-header">
                            <span>Balance</span>
                            <div className="defi-card-component-body-header-divider"></div>
                            <span>USD Value</span>
                          </div>
                          {groupComp?.walletItems &&
                          groupComp.walletItems.length > 0
                            ? groupComp.walletItems.map((rowData, indexTwo) => (
                                <div className="defi-card-component-body-content">
                                  {rowData?.balance
                                    ? rowData.balance.map((e, indexFour) => (
                                        <CustomOverlay
                                          position="top"
                                          isIcon={false}
                                          isInfo={true}
                                          isText={true}
                                          text={
                                            e ? convertNtoNumber(e) : "0.00"
                                          }
                                        >
                                          <span
                                            className={`${
                                              indexFour > 0 ? "mt-3" : ""
                                            }`}
                                          >
                                            {e
                                              ? isNaN(e)
                                                ? e
                                                : numToCurrency(
                                                    convertNtoNumber(e),
                                                    "en-US",
                                                    "USD"
                                                  )
                                              : "0.00"}
                                          </span>
                                        </CustomOverlay>
                                      ))
                                    : null}
                                  {rowData.usdValue ? (
                                    <CustomOverlay
                                      position="top"
                                      isIcon={false}
                                      isInfo={true}
                                      isText={true}
                                      text={
                                        CurrencyType(false) +
                                        amountFormat(
                                          rowData.usdValue.toFixed(2),
                                          "en-US",
                                          "USD"
                                        )
                                      }
                                    >
                                      <span>
                                        {CurrencyType(false)}
                                        {numToCurrency(
                                          rowData.usdValue.toFixed(2),
                                          "en-US",
                                          "USD"
                                        )}
                                      </span>
                                    </CustomOverlay>
                                  ) : (
                                    <CustomOverlay
                                      position="top"
                                      isIcon={false}
                                      isInfo={true}
                                      isText={true}
                                      text={"$0.00"}
                                    >
                                      <span>$0.00</span>
                                    </CustomOverlay>
                                  )}
                                </div>
                              ))
                            : null}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            );
          })
        ) : this.props.defiStateLocally?.defiList &&
          this.props.defiStateLocally.defiList.length === 0 ? (
          // <Col md={12}>

          <div
            className="defi animation-wrapper"
            style={{
              padding: "3rem",
              textAlign: "center",
              minWidth: "100%",
            }}
          >
            <h3 className="inter-display-medium f-s-16 lh-19 grey-313">
              No data found
            </h3>
          </div>
        ) : (
          // </Col>
          <div
            style={{
              minWidth: "100%",
            }}
            className="defi animation-wrapper"
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DefiMobile);
