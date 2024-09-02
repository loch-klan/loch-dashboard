import Highcharts from "highcharts/highstock";
import { Image } from "react-bootstrap";
import {
  StrategyBuilderAssetIcon,
  StrategyBuilderConditionIcon,
  StrategyBuilderSortIcon,
  StrategyBuilderWeightIcon,
} from "../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../utils/form";
import {
  mobileCheck,
  strategyByilderOperatorConvertorTextToSymbol,
  strategyByilderTypeConvertorTextToSymbol,
} from "../../../../utils/ReusableFunctions";
import "./_backTestBuilder.scss";
import BackTestBuilderBlock from "./Components/BackTestBuilderBlock/BackTestBuilderBlock";

import { connect } from "react-redux";
import { createBackTestQuery, getBackTestQueries } from "../../Api/BackTestApi";
import BackTestAssetBuilderBlock from "./Components/BackTestAssetBuilderBlock/BackTestAssetBuilderBlock";
import BackTestConditionBuilderBlock from "./Components/BackTestConditionBuilderBlock/BackTestConditionBuilderBlock";
import BackTestWeightBuilderBlock from "./Components/BackTestWeightBuilderBlock/BackTestWeightBuilderBlock";

require("highcharts/modules/annotations")(Highcharts);

class BackTestBuilder extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: mobileCheck(),
      canUpdateBuilder: false,
      strategyBuilderString: {
        condition: {
          type: "CURRENT_PRICE",
          token: "BTC",
          operator: ">",
          amount: "10000",
          time_period: "4",
          success: {
            asset: {
              tokenList: [
                {
                  token: "BTC",
                  weight: 100,
                },
              ],
              action: "buy",
            },
          },
          failed: {
            asset: {
              tokenList: [
                {
                  token: "USDT",
                  weight: 100,
                },
              ],
              action: "sell",
            },
          },
        },
      },
    };
  }
  changeStrategyBuilderString = (passedString) => {
    this.setState({
      strategyBuilderString: passedString,
    });
  };
  getStrategiesQueries = () => {
    this.props.getBackTestQueries();
  };
  afterQueryCreation = (isApiPassed) => {
    if (isApiPassed) {
      this.getStrategiesQueries();
    }
    if (this.props.hideSaveStrategy) {
      this.props.hideSaveStrategy();
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.saveStrategyCheck !== this.props.saveStrategyCheck) {
      let tempApiData = new URLSearchParams();
      tempApiData.append(
        "query_payload",
        JSON.stringify(this.state.strategyBuilderString)
      );
      this.props.createBackTestQuery(
        tempApiData,
        this,
        this.afterQueryCreation
      );
    }
    if (
      prevState.strategyBuilderString !== this.state.strategyBuilderString &&
      this.state.canUpdateBuilder
    ) {
      if (this.props.showSaveStrategy) {
        this.props.showSaveStrategy();
      }
      window.localStorage.setItem(
        "strategyBuilderStringLocal",
        JSON.stringify(this.state.strategyBuilderString)
      );
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        canUpdateBuilder: true,
      });
    }, 1000);
    this.getStrategiesQueries();
    const strategyBuilderStringLocal = window.localStorage.getItem(
      "strategyBuilderStringLocal"
    );
    // if (strategyBuilderStringLocal) {
    //   this.setState({
    //     strategyBuilderString: JSON.parse(strategyBuilderStringLocal),
    //   });
    // }
  }
  changeType = (passedType) => {
    let operatorType = "";
    operatorType = strategyByilderTypeConvertorTextToSymbol(passedType);

    let itemItem = {
      ...this.state.strategyBuilderString.condition,
      type: operatorType,
    };
    this.setState({
      strategyBuilderString: {
        condition: itemItem,
      },
    });
  };
  changeToken = (passedToken) => {
    let itemItem = {
      ...this.state.strategyBuilderString.condition,
      token: passedToken,
    };
    this.setState({
      strategyBuilderString: {
        condition: itemItem,
      },
    });
  };
  changeOperator = (passedOperator) => {
    let operatorSymbol = "";
    operatorSymbol =
      strategyByilderOperatorConvertorTextToSymbol(passedOperator);
    let itemItem = {
      ...this.state.strategyBuilderString.condition,
      operator: operatorSymbol,
    };
    this.setState({
      strategyBuilderString: {
        condition: itemItem,
      },
    });
  };
  changeAmount = (passedAmount) => {
    let itemItem = {
      ...this.state.strategyBuilderString.condition,
      amount: passedAmount,
    };
    this.setState({
      strategyBuilderString: {
        condition: itemItem,
      },
    });
  };
  renderBlocks = (blocks, path = [], blockLevel = 0) => {
    return Object.entries(blocks).map(([key, block]) => {
      if (key === "asset") {
        if (block.tokenList && block.tokenList.length > 0) {
          return (
            <>
              <BackTestBuilderBlock
                passedClass="strategy-builder-block-container-weight"
                blockLevel={blockLevel}
                blockType="weight"
                showDropDown
                path={[...path]}
                strategyBuilderString={this.state.strategyBuilderString}
                changeStrategyBuilderString={this.changeStrategyBuilderString}
              >
                <BackTestWeightBuilderBlock />
              </BackTestBuilderBlock>
              {block.tokenList.map((curToken, curTokenIndex) => {
                return (
                  <>
                    <BackTestBuilderBlock
                      passedClass="strategy-builder-block-container-asset"
                      blockLevel={blockLevel + 1}
                      blockType="asset"
                      path={[...path, key, "tokenList"]}
                      assetIndex={curTokenIndex}
                      strategyBuilderString={this.state.strategyBuilderString}
                      changeStrategyBuilderString={
                        this.changeStrategyBuilderString
                      }
                    >
                      <BackTestAssetBuilderBlock
                        strategyBuilderString={this.state.strategyBuilderString}
                        changeStrategyBuilderString={
                          this.changeStrategyBuilderString
                        }
                        path={[...path, key, "tokenList", curTokenIndex]}
                        selectedAsset={curToken.token}
                      />
                    </BackTestBuilderBlock>
                  </>
                );
              })}
            </>
          );
        } else {
          return null;
        }
      } else if (key === "condition") {
        return (
          <>
            {block.success && Object.keys(block.success).length > 0 ? (
              <>
                <BackTestBuilderBlock
                  passedClass="strategy-builder-block-container-condition-if"
                  blockLevel={blockLevel}
                  blockType="condition if"
                  showDropDown
                  strategyBuilderString={this.state.strategyBuilderString}
                  path={[...path]}
                  changeStrategyBuilderString={this.changeStrategyBuilderString}
                >
                  <BackTestConditionBuilderBlock
                    amount={block.amount}
                    operator={block.operator}
                    time_period={block.time_period}
                    token={block.token}
                    type={block.type}
                    path={[...path, key]}
                    strategyBuilderString={this.state.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.changeStrategyBuilderString
                    }
                  />
                </BackTestBuilderBlock>
                {this.renderBlocks(
                  block.success,
                  [...path, key, "success"],
                  blockLevel + 1
                )}
              </>
            ) : null}
            {block.failed && Object.keys(block.failed).length > 0 ? (
              <>
                <BackTestBuilderBlock
                  passedClass="strategy-builder-block-container-condition-else"
                  blockLevel={blockLevel}
                  blockType="condition else"
                  path={[...path, key]}
                  strategyBuilderString={this.state.strategyBuilderString}
                  changeStrategyBuilderString={this.changeStrategyBuilderString}
                />
                {this.renderBlocks(
                  block.failed,
                  [...path, key, "failed"],
                  blockLevel + 1
                )}
              </>
            ) : null}
          </>
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <div className="strategy-builder-container">
        <div className="sbc-logic-container">
          {this.renderBlocks(this.state.strategyBuilderString)}
        </div>
        <div className="sbc-header">
          <div className="sbc-main-blocks sbc-main-blocks-asset">
            <div className="sbc-main-blocks-image-container">
              <Image
                src={StrategyBuilderAssetIcon}
                className="sbc-main-blocks-image"
              />
            </div>
            <div>Assets</div>
          </div>
          <div className="sbc-main-blocks sbc-main-blocks-weight">
            <div className="sbc-main-blocks-image-container">
              <Image
                src={StrategyBuilderWeightIcon}
                className="sbc-main-blocks-image"
              />
            </div>
            <div>Weights</div>
          </div>
          <div className="sbc-main-blocks sbc-main-blocks-condition">
            <div className="sbc-main-blocks-image-container">
              <Image
                src={StrategyBuilderConditionIcon}
                className="sbc-main-blocks-image"
              />
            </div>
            <div>Conditions</div>
          </div>
          <div className="sbc-main-blocks sbc-main-blocks-sort">
            <div className="sbc-main-blocks-image-container">
              <Image
                src={StrategyBuilderSortIcon}
                className="sbc-main-blocks-image"
              />
            </div>
            <div>Sort</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = { createBackTestQuery, getBackTestQueries };
export default connect(mapStateToProps, mapDispatchToProps)(BackTestBuilder);
