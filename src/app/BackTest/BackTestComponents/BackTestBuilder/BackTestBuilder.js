import Highcharts from "highcharts/highstock";
import { BaseReactComponent } from "../../../../utils/form";
import {
  mobileCheck,
  strategyByilderOperatorConvertorTextToSymbol,
  strategyByilderTypeConvertorTextToSymbol,
} from "../../../../utils/ReusableFunctions";
import "./_backTestBuilder.scss";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { StrategyBuilderEmptyIcon } from "../../../../assets/images/icons";
import { createBackTestQuery, getBackTestQueries } from "../../Api/BackTestApi";
import BackTestBuilderMainBlock from "./BackTestBuilderMainBlock/BackTestBuilderMainBlock";
import BackTestAddingOptions from "./Components/BackTestAddingOptions/BackTestAddingOptions";

require("highcharts/modules/annotations")(Highcharts);

class BackTestBuilder extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      emptyItems: [],
      isMobile: mobileCheck(),
      canUpdateBuilder: false,
      isStrategyEmpty: true,
      strategyBuilderString: {},
    };
  }
  changeStrategyBuilderString = (passedString) => {
    this.setState({
      strategyBuilderString: passedString,
    });
  };
  getStrategiesQueries = () => {
    let tempApiData = new URLSearchParams();
    let setStrategy = false;
    if (
      this.props.passedStrategyList &&
      this.props.passedStrategyList.length > 0
    ) {
      tempApiData.append(
        "strategy_list",
        JSON.stringify([...this.props.passedStrategyList])
      );
      setStrategy = true;
    }
    // tempApiData.append(
    //   "user_list",
    //   JSON.stringify(["66cc01184d9fe2be2b11806d"])
    // );
    this.props.getBackTestQueries(tempApiData, setStrategy);
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
    if (prevProps.BackTestQueryState !== this.props.BackTestQueryState) {
      const passedQueryData = this.props.BackTestQueryState;
      console.log("passedQueryData is ", passedQueryData);

      if (passedQueryData.length > 0 && passedQueryData[0].strategy) {
        this.setState({
          strategyBuilderString: passedQueryData[0].strategy,
        });
      }
    }
    if (prevProps.passedStrategyList !== this.props.passedStrategyList) {
      this.getStrategiesQueries();
    }
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
        if (this.props.saveStrategyName) {
          tempApiData.append("strategy_name", this.props.saveStrategyName);
        }
        this.props.createBackTestQuery(
          tempApiData,
          this,
          this.afterQueryCreation
        );
      } else {
        toast.error("Please fix all the issues with the strategy");
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
    // this.getStrategiesQueries();
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

  onAddAssetInEmptyClick = () => {
    this.setState({
      strategyBuilderString: {
        weight: {
          weight_type: "EQUAL",
          weight_item: [
            {
              percentage: "100",
              item: {
                asset: "BTC",
              },
            },
          ],
        },
      },
    });
  };
  onAddConditionInEmptyClick = () => {
    this.setState({
      strategyBuilderString: {
        weight: {
          weight_type: "EQUAL",
          weight_item: [
            {
              percentage: "100",
              item: {
                condition: {
                  type: "CURRENT_PRICE",
                  token: "BTC",
                  operator: ">",
                  amount: "10000",
                  time_period: "4",
                  success: {},
                  failed: {},
                },
              },
            },
          ],
        },
      },
    });
  };
  render() {
    if (this.state.isStrategyEmpty) {
      return (
        <div className="strategy-builder-container strategy-builder-container-empty">
          <div className="sbc-empty-container">
            <div className="sbc-empty">
              <Image
                className="sbc-empty-image"
                src={StrategyBuilderEmptyIcon}
              />
              <div className="sbc-empty-text">
                Start building by
                <br />
                adding a block below
              </div>
            </div>
            <div className="sbc-empty-options-container-container">
              <div className="sbc-empty-options-container">
                <BackTestAddingOptions
                  closeOptions={() => null}
                  onAddAssetClick={this.onAddAssetInEmptyClick}
                  onAddConditionClick={this.onAddConditionInEmptyClick}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="strategy-builder-container">
        <div className="sbc-logic-container">
          {/* {this.renderBlocks(this.state.strategyBuilderString)} */}
          <BackTestBuilderMainBlock
            emptyItems={this.state.emptyItems}
            strategyBuilderString={this.state.strategyBuilderString}
            changeStrategyBuilderString={this.changeStrategyBuilderString}
            blocks={this.state.strategyBuilderString}
            path={[]}
            blockLevel={0}
            weightPath={[]}
            weightIndex={-1}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  BackTestQueryState: state.BackTestQueryState,
});
const mapDispatchToProps = { createBackTestQuery, getBackTestQueries };
export default connect(mapStateToProps, mapDispatchToProps)(BackTestBuilder);
