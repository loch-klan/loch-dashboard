import { Component } from "react";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  convertNtoNumber,
  loadingAnimation,
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
          <div style={{}} className="balance-sheet-card ">
            <div className="balance-card-header cp">
              <div
                onClick={() => {
                  if (this.props.isDebtToggle) {
                    this.props.toggleDebt();
                  }
                  this.props.toggleYield();
                }}
                // style={
                //   this.props.isYeildToggle ? {  } : {}
                // }
                className={`balance-sheet-card-credit ${
                  this.props.defiLoader
                    ? "balance-sheet-card-credit-loading"
                    : ""
                }`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-16 lh-19
                            ${
                              this.props.isYeildToggle
                                ? "balance-sheet-card-credit-title-selected"
                                : ""
                            }
                            `}
                  >
                    Credit
                  </span>
                  <span
                    className={`balance-sheet-card-credit-amount inter-display-regular f-s-16 lh-19
                            ${
                              this.props.isYeildToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                  >
                    {CurrencyType(false)}
                    {this.props.defiStateLocally.totalYield &&
                      numToCurrency(
                        this.props.defiStateLocally.totalYield *
                          (this.props.currency?.rate || 1)
                      )}
                  </span>

                  <Image
                    className="defiMenu"
                    src={arrowUp}
                    style={
                      this.props.isYeildToggle
                        ? {
                            filter: "opacity(1)",
                            marginBottom: "0px",
                          }
                        : {
                            transform: "rotate(180deg)",
                            marginBottom: "0px",
                          }
                    }
                  />
                </div>
              </div>

              <div
                onClick={() => {
                  if (this.props.isYeildToggle) {
                    this.props.toggleYield();
                  }
                  this.props.toggleDebt();
                }}
                className={`balance-sheet-card-debt ${
                  this.props.defiLoader ? "balance-sheet-card-debt-loading" : ""
                }`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-16 lh-19
                             ${
                               this.props.isDebtToggle
                                 ? "balance-sheet-card-credit-title-selected"
                                 : ""
                             }
                             `}
                  >
                    Debt
                  </span>
                  <span
                    className={`balance-sheet-card-credit-amount inter-display-regular f-s-16 lh-19
                            ${
                              this.props.isDebtToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                  >
                    {CurrencyType(false)}
                    {this.props.defiStateLocally.totalDebt &&
                      numToCurrency(
                        this.props.defiStateLocally.totalDebt *
                          (this.props.currency?.rate || 1)
                      )}
                  </span>

                  <Image
                    className="defiMenu"
                    src={arrowUp}
                    style={
                      this.props.isDebtToggle
                        ? {
                            filter: "opacity(1)",
                            marginBottom: "0px",
                          }
                        : { transform: "rotate(180deg)", marginBottom: "0px" }
                    }
                  />
                </div>
                {this.props.defiLoader && (
                  <div style={{ marginTop: "-6px" }}>{loadingAnimation()}</div>
                )}
              </div>
            </div>
            {(this.props.isYeildToggle || this.props.isDebtToggle) && (
              <div className="balance-dropdown">
                <div className="balance-dropdown-top-fake">
                  <div
                    onClick={this.props.toggleYield}
                    className="balance-dropdown-top-fake-left"
                  />
                  <div
                    onClick={this.toggleDebt}
                    className="balance-dropdown-top-fake-right"
                  />
                </div>
                <div className="balance-list-content-parent">
                  <div className="balance-list-content">
                    {/* For yeild */}
                    {this.props.isYeildToggle && (
                      <div>
                        {this.props.defiStateLocally.YieldValues &&
                          this.props.defiStateLocally.YieldValues.map(
                            (item, i) => {
                              return (
                                <div
                                  key={`defiState-${i}`}
                                  className="balance-sheet-list"
                                  style={
                                    i ===
                                    this.props.defiStateLocally.YieldValues
                                      .length -
                                      1
                                      ? { paddingBottom: "0.3rem" }
                                      : {}
                                  }
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
                                          (this.state.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )
                                    }
                                  >
                                    <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                      {CurrencyType(false)}
                                      {numToCurrency(
                                        item.totalPrice.toFixed(2),
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
                    )}

                    {/* For debt */}
                    {this.props.isDebtToggle && (
                      <div>
                        {this.props.defiStateLocally.DebtValues &&
                          this.props.defiStateLocally.DebtValues.map(
                            (item, i) => {
                              return (
                                <div
                                  key={`debtDefiState-${i}`}
                                  className="balance-sheet-list"
                                  style={
                                    i ===
                                    this.props.defiStateLocally.DebtValues
                                      .length -
                                      1
                                      ? { paddingBottom: "0.3rem" }
                                      : {}
                                  }
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
                                          (this.state.currency?.rate || 1),
                                        "en-US",
                                        "USD"
                                      )
                                    }
                                  >
                                    <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                      {CurrencyType(false)}
                                      {numToCurrency(
                                        item.totalPrice.toFixed(2),
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
                    )}
                  </div>
                </div>
              </div>
            )}
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
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={card?.name}
                    >
                      <h3 className="inter-display-medium dotDotText">
                        {card?.name}
                      </h3>
                    </CustomOverlay>
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={card?.tag}
                    >
                      <span className="dotDotText">{card?.tag}</span>
                    </CustomOverlay>
                  </div>
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      CurrencyType(false) +
                      numToCurrency(
                        card?.netBalance * (this.state.currency?.rate || 1)
                      ) +
                      " " +
                      CurrencyType(true)
                    }
                  >
                    <h3 className="inter-display-medium f-s-16 lh-19 dotDotText">
                      {CurrencyType(false)}
                      {numToCurrency(
                        card?.netBalance * (this.state.currency?.rate || 1)
                      )}{" "}
                      <span className="inter-display-medium f-s-10 lh-19 grey-ADA">
                        {CurrencyType(true)}
                      </span>
                    </h3>
                  </CustomOverlay>
                </div>
                <div className="defi-card-divider-main"></div>
                {card.items
                  ? card.items.map((groupComp, i) => (
                      <>
                        {groupComp?.walletItems &&
                        groupComp.walletItems.length > 0
                          ? groupComp.walletItems.map((rowData, indexTwo) => (
                              <div className="defi-card-component">
                                <div className="defi-card-component-header">
                                  <div className="defi-card-component-header-left">
                                    {rowData?.logos[0] ? (
                                      <div className="defi-card-component-header-left-left">
                                        <Image src={rowData?.logos[0]} />
                                      </div>
                                    ) : null}
                                    <div className="defi-card-component-header-left-right">
                                      {rowData?.asset}
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
                                </div>
                              </div>
                            ))
                          : null}
                      </>
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
