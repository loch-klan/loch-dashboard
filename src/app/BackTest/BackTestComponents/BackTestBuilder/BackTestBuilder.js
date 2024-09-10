import Highcharts from "highcharts/highstock";
import { BaseReactComponent } from "../../../../utils/form";
import {
  isArrayInArrayOfArrays,
  mobileCheck,
  strategyByilderOperatorConvertorTextToSymbol,
  strategyByilderTypeConvertorTextToSymbol,
} from "../../../../utils/ReusableFunctions";
import "./_backTestBuilder.scss";
import BackTestBuilderBlock from "./Components/BackTestBuilderBlock/BackTestBuilderBlock";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { StrategyBuilderEmptyIcon } from "../../../../assets/images/icons";
import { createBackTestQuery, getBackTestQueries } from "../../Api/BackTestApi";
import BackTestAssetBuilderBlock from "./Components/BackTestAssetBuilderBlock/BackTestAssetBuilderBlock";
import BackTestConditionBuilderBlock from "./Components/BackTestConditionBuilderBlock/BackTestConditionBuilderBlock";
import BackTestWeightBuilderBlock from "./Components/BackTestWeightBuilderBlock/BackTestWeightBuilderBlock";
import BackTestWeightPercentageBlock from "./Components/BackTestWeightPercentageBlock/BackTestWeightPercentageBlock";

require("highcharts/modules/annotations")(Highcharts);

class BackTestBuilder extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      emptyItems: [],
      isMobile: mobileCheck(),
      canUpdateBuilder: false,
      isStrategyEmpty: false,
      strategyBuilderString: {
        weight: {
          // SPECIFIED
          weight_type: "EQUAL",
          weight_item: [],
          //   {
          //     percentage: "33.3",
          //     item: {
          //       condition: {
          //         type: "CURRENT_PRICE",
          //         token: "BTC",
          //         operator: ">",
          //         amount: "10000",
          //         time_period: "4",
          //         success: {
          //           weight: {
          //             weight_type: "SPECIFIED",
          //             weight_item: [
          //               {
          //                 percentage: "100",
          //                 item: {
          //                   asset: "BTC",
          //                 },
          //               },
          //             ],
          //           },
          //         },
          //         failed: {
          //           weight: {
          //             weight_type: "EQUAL",
          //             weight_item: [
          //               {
          //                 percentage: "100",
          //                 item: {
          //                   condition: {
          //                     type: "CURRENT_PRICE",
          //                     token: "BTC",
          //                     operator: ">",
          //                     amount: "10000",
          //                     time_period: "4",
          //                     success: {
          //                       weight: {
          //                         weight_type: "EQUAL",
          //                         weight_item: [
          //                           {
          //                             percentage: "100",
          //                             item: {
          //                               asset: "BTC",
          //                             },
          //                           },
          //                         ],
          //                       },
          //                     },
          //                     failed: {
          //                       weight: {
          //                         weight_type: "EQUAL",
          //                         weight_item: [
          //                           {
          //                             percentage: "100",
          //                             item: {
          //                               asset: "USDT",
          //                             },
          //                           },
          //                         ],
          //                       },
          //                     },
          //                   },
          //                 },
          //               },
          //             ],
          //           },
          //         },
          //       },
          //     },
          //   },
          //   {
          //     percentage: "33.3",
          //     item: {
          //       asset: "BTC",
          //     },
          //   },
          //   {
          //     percentage: "33.3",
          //     item: {
          //       asset: "USDT",
          //     },
          //   },
          // ],
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
  strategyByilderIsQueryValid = (obj, path, emptyHolderArr) => {
    console.log("obj is ", obj);

    if ("weight" in obj) {
      let totalWeight = 0;
      if (obj.weight && obj.weight.weight_item) {
        obj.weight.weight_item.forEach((curItem, curIndex) => {
          totalWeight = totalWeight + parseFloat(curItem.percentage);
          this.strategyByilderIsQueryValid(
            curItem,
            [...path, "weight", "weight_item", curIndex],
            emptyHolderArr
          );
        });
        if (!(totalWeight >= 99.8 && totalWeight <= 100)) {
          emptyHolderArr.push([...path, "weight"]);
        }
      }
    } else if ("item" in obj) {
      this.strategyByilderIsQueryValid(
        obj.item,
        [...path, "item"],
        emptyHolderArr
      );
    } else if ("condition" in obj) {
      this.strategyByilderIsQueryValid(
        obj.condition,
        [...path, "condition"],
        emptyHolderArr
      );
    } else {
      if ("success" in obj) {
        if (Object.keys(obj.success).length === 0) {
          emptyHolderArr.push([...path, "success"]);
        }
        this.strategyByilderIsQueryValid(
          obj.success,
          [...path, "success"],
          emptyHolderArr
        );
      }
      if ("failed" in obj) {
        if (Object.keys(obj.failed).length === 0) {
          emptyHolderArr.push([...path, "failed"]);
        }
        this.strategyByilderIsQueryValid(
          obj.failed,
          [...path, "failed"],
          emptyHolderArr
        );
      }
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.strategyBuilderString !== this.state.strategyBuilderString) {
      if (
        this.state.strategyBuilderString &&
        Object.keys(this.state.strategyBuilderString).length === 0
      ) {
        this.setState({
          isStrategyEmpty: true,
        });
      } else {
        this.setState({
          isStrategyEmpty: false,
        });
      }
      console.log(
        "this.state.strategyBuilderString",
        this.state.strategyBuilderString
      );
    }
    if (prevProps.saveStrategyCheck !== this.props.saveStrategyCheck) {
      this.setState({
        emptyItems: [],
      });
      let emptyHolderArr = [];
      this.strategyByilderIsQueryValid(
        this.state.strategyBuilderString,
        [],
        emptyHolderArr
      );

      if (emptyHolderArr.length === 0) {
        let tempApiData = new URLSearchParams();
        tempApiData.append(
          "strategy_payload",
          JSON.stringify(this.state.strategyBuilderString)
        );
        this.props.createBackTestQuery(
          tempApiData,
          this,
          this.afterQueryCreation
        );
      } else {
        toast.error("Please review and fix the issues in the strategy");
        this.setState({
          emptyItems: emptyHolderArr,
        });
      }
    }
    if (
      prevState.strategyBuilderString !== this.state.strategyBuilderString &&
      this.state.canUpdateBuilder
    ) {
      this.setState({
        emptyItems: [],
      });
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
  renderBlocks = (
    blocks,
    path = [],
    blockLevel = 0,
    weightPath = [],
    weightIndex = -1
  ) => {
    return Object.entries(blocks).map(([key, block]) => {
      let tempWeightPath = [];
      if (key === "weight") {
        tempWeightPath = [...path];

        return (
          <>
            <BackTestBuilderBlock
              //WEIGHT
              weightPath={tempWeightPath}
              weightIndex={weightIndex}
              //WEIGHT

              passedClass="strategy-builder-block-container-weight"
              blockLevel={blockLevel}
              blockType="weight"
              showDropDown
              path={[...path]}
              strategyBuilderString={this.state.strategyBuilderString}
              changeStrategyBuilderString={this.changeStrategyBuilderString}
              isError={isArrayInArrayOfArrays(
                [...path, key],
                this.state.emptyItems
              )}
            >
              {/* <BackTestWeightBuilderBlock
                path={[...path]}
                strategyBuilderString={this.state.strategyBuilderString}
                changeStrategyBuilderString={this.changeStrategyBuilderString}
                weightType={block.weight_type}
              /> */}
            </BackTestBuilderBlock>
            {blocks?.weight?.weight_item?.map((curItem, curItemIndex) => (
              <>
                {/* {block.weight_type === "SPECIFIED" ? ( */}
                <BackTestBuilderBlock
                  //WEIGHT
                  weightPath={tempWeightPath}
                  weightIndex={weightIndex}
                  //WEIGHT
                  passedClass="strategy-builder-block-container-weight"
                  blockLevel={blockLevel + 1}
                  blockType="weight percentage"
                  path={[...path]}
                  strategyBuilderString={this.state.strategyBuilderString}
                  changeStrategyBuilderString={this.changeStrategyBuilderString}
                >
                  <BackTestWeightPercentageBlock
                    path={[...path, key, "weight_item", curItemIndex]}
                    strategyBuilderString={this.state.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.changeStrategyBuilderString
                    }
                    weightPercentage={curItem.percentage}
                  />
                </BackTestBuilderBlock>
                {/* ) : null} */}
                {this.renderBlocks(
                  curItem.item,
                  [...path, key, "weight_item", curItemIndex, "item"],
                  blockLevel + 2,
                  tempWeightPath,
                  curItemIndex
                )}
              </>
            ))}
            {/* <BackTestBuilderBlock
              //WEIGHT
              weightPath={tempWeightPath}
              weightIndex={weightIndex}
              //WEIGHT

              passedClass="strategy-builder-block-container-add-item"
              blockLevel={blockLevel}
              blockType="add item"
              path={[...path]}
              strategyBuilderString={this.state.strategyBuilderString}
              changeStrategyBuilderString={this.changeStrategyBuilderString}
            /> */}
          </>
        );
      } else if (key === "asset") {
        return (
          <BackTestBuilderBlock
            //WEIGHT
            weightPath={weightPath}
            weightIndex={weightIndex}
            //WEIGHT

            passedClass="strategy-builder-block-container-asset"
            blockLevel={blockLevel}
            blockType="asset"
            parentPath={path}
            path={[...path, key]}
            strategyBuilderString={this.state.strategyBuilderString}
            changeStrategyBuilderString={this.changeStrategyBuilderString}
            tokenList={block.tokenList}
          >
            <BackTestAssetBuilderBlock
              tokenList={block.tokenList}
              strategyBuilderString={this.state.strategyBuilderString}
              changeStrategyBuilderString={this.changeStrategyBuilderString}
              path={[...path]}
              selectedAsset={blocks.asset}
            />
          </BackTestBuilderBlock>
        );
      } else if (key === "condition") {
        return (
          <>
            <>
              <BackTestBuilderBlock
                //WEIGHT
                weightPath={weightPath}
                weightIndex={weightIndex}
                //WEIGHT
                passedClass="strategy-builder-block-container-condition-if"
                blockLevel={blockLevel}
                blockType="condition if"
                showDropDown
                strategyBuilderString={this.state.strategyBuilderString}
                path={[...path]}
                changeStrategyBuilderString={this.changeStrategyBuilderString}
                isError={isArrayInArrayOfArrays(
                  [...path, key, "success"],
                  this.state.emptyItems
                )}
              >
                <BackTestConditionBuilderBlock
                  amount={block.amount}
                  operator={block.operator}
                  time_period={block.time_period}
                  token={block.token}
                  type={block.type}
                  path={[...path, key]}
                  strategyBuilderString={this.state.strategyBuilderString}
                  changeStrategyBuilderString={this.changeStrategyBuilderString}
                />
              </BackTestBuilderBlock>
              {block.success && Object.keys(block.success).length > 0 ? (
                <>
                  {this.renderBlocks(
                    block.success,
                    [...path, key, "success"],
                    blockLevel + 1,
                    tempWeightPath,
                    weightIndex
                  )}
                </>
              ) : null}
            </>

            <>
              <BackTestBuilderBlock
                //WEIGHT
                weightPath={tempWeightPath}
                weightIndex={weightIndex}
                //WEIGHT
                passedClass="strategy-builder-block-container-condition-else"
                blockLevel={blockLevel}
                blockType="condition else"
                path={[...path, key]}
                strategyBuilderString={this.state.strategyBuilderString}
                changeStrategyBuilderString={this.changeStrategyBuilderString}
                isError={isArrayInArrayOfArrays(
                  [...path, key, "failed"],
                  this.state.emptyItems
                )}
              />
              {block.failed && Object.keys(block.failed).length > 0 ? (
                <>
                  {this.renderBlocks(
                    block.failed,
                    [...path, key, "failed"],
                    blockLevel + 1,
                    tempWeightPath,
                    weightIndex
                  )}
                </>
              ) : null}
            </>
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
        {this.state.isStrategyEmpty ? (
          <div className="sbc-empty">
            <Image className="sbc-empty-image" src={StrategyBuilderEmptyIcon} />
            <div className="sbc-empty-text">
              Start building by
              <br />
              adding a block below
            </div>
          </div>
        ) : (
          <div className="sbc-logic-container">
            {this.renderBlocks(this.state.strategyBuilderString)}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = { createBackTestQuery, getBackTestQueries };
export default connect(mapStateToProps, mapDispatchToProps)(BackTestBuilder);
