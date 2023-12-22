import { Component } from "react";
import { connect } from "react-redux";

import { Image } from "react-bootstrap";
import {
  CurrencyType,
  amountFormat,
  lightenDarkenColor,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import Loading from "../common/Loading";

import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

class PortfolioHomeNetworksBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chainList: [],
    };
  }
  componentDidMount() {
    if (this.props.portfolioState?.chainPortfolio) {
      this.addToChainList();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.portfolioState &&
      prevProps.portfolioState?.chainPortfolio !==
        this.props.portfolioState?.chainPortfolio
    ) {
      this.addToChainList();
    }
  }
  addToChainList = () => {
    if (this.props.portfolioState?.chainPortfolio) {
      let tempVals = Object.values(this.props.portfolioState.chainPortfolio);
      tempVals = tempVals.sort((a, b) => {
        return b.total - a.total;
      });
      this.setState({
        chainList: tempVals,
      });
    }
  };
  render() {
    if (this.props.chainLoader) {
      return (
        <div
          style={{
            height: "38rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Loading />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          padding: "1rem",
          paddingBottom: "0rem",
        }}
        className="insights-wrapper-container"
      >
        {this.state.chainList && this.state.chainList.length > 0 ? (
          <div
            style={{
              overflow: "scroll",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              position: "relative",
              height: "37rem",
              padding: "0rem 0.5rem",
              paddingRight: "1rem",
            }}
            className="insights-wrapper insights-wrapper-portfolio-home"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1.5rem 0rem",
              }}
            >
              {this.state.chainList &&
                this.state.chainList.slice(0, 3).map((item, i) => {
                  return (
                    <Image
                      src={item.symbol}
                      style={{
                        position: "relative",
                        marginLeft: `${i === 0 ? "0" : "-10"}px`,
                        width: "2.6rem",
                        height: "2.6rem",
                        borderRadius: "6px",
                        zIndex: `${i === 0 ? "3" : i === 1 ? "2" : "1"}`,
                        objectFit: "cover",
                        border: `1px solid ${lightenDarkenColor(
                          item.color,
                          -0.15
                        )}`,
                      }}
                      key={`chainList-${i}`}
                    />
                  );
                })}

              <span
                className="inter-display-medium f-s-16 lh-19 portfolioNetworksText"
                style={{
                  marginLeft: this.state.chainList?.length === 0 ? 0 : "1.2rem",
                }}
              >
                {this.state.chainList && this.state.chainList?.length <= 1
                  ? this.state.chainList?.length + 1 + " Network"
                  : this.state.chainList?.length + 1 + " Networks"}
              </span>
            </div>
            {this.state.chainList &&
              this.state.chainList?.map((chain, i) => {
                return (
                  <div
                    className="chain-list-item"
                    key={`chainContentChainList-${i}`}
                    style={{
                      paddingBottom: "1rem",
                    }}
                  >
                    <span className="inter-display-medium f-s-16 lh-19">
                      <Image
                        src={chain?.symbol}
                        style={{
                          width: "2.6rem",
                          height: "2.6rem",
                          borderRadius: "6px",
                          objectFit: "cover",
                          border: `1px solid ${lightenDarkenColor(
                            chain?.color,
                            -0.15
                          )}`,
                        }}
                      />
                      {chain?.name}
                    </span>
                    <CustomOverlay
                      text={
                        CurrencyType(false) +
                        amountFormat(chain?.total.toFixed(2), "en-US", "USD")
                      }
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      position="top"
                      className={"fix-width"}
                    >
                      <span className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt">
                        {CurrencyType(false)}
                        {numToCurrency(chain?.total)}
                      </span>
                    </CustomOverlay>
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioHomeNetworksBlock);
