import Highcharts from "highcharts/highstock";
import { BaseReactComponent } from "../../../../../utils/form";
import { isArrayInArrayOfArrays } from "../../../../../utils/ReusableFunctions";
// import "./_backTestBuilder.scss";
import BackTestBuilderBlock from "../Components/BackTestBuilderBlock/BackTestBuilderBlock";

import { connect } from "react-redux";
import { createBackTestQuery } from "../../../Api/BackTestApi";
import BackTestAssetBuilderBlock from "../Components/BackTestAssetBuilderBlock/BackTestAssetBuilderBlock";
import BackTestConditionBuilderBlock from "../Components/BackTestConditionBuilderBlock/BackTestConditionBuilderBlock";
import BackTestWeightPercentageBlock from "../Components/BackTestWeightPercentageBlock/BackTestWeightPercentageBlock";
import "./_backTestBuilderMainBlock.scss";

require("highcharts/modules/annotations")(Highcharts);

class BackTestBuilderMainBlock extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isItemCollapsedWeight: false,
      isItemCollapsedIf: false,
      isItemCollapsedElse: false,
    };
  }
  toggleCollapseWeight = () => {
    this.setState({ isItemCollapsedWeight: !this.state.isItemCollapsedWeight });
  };
  toggleCollapseIf = () => {
    this.setState({ isItemCollapsedIf: !this.state.isItemCollapsedIf });
  };
  toggleCollapseElse = () => {
    this.setState({ isItemCollapsedElse: !this.state.isItemCollapsedElse });
  };
  openCollapseWeight = () => {
    this.setState({ isItemCollapsedWeight: false });
  };
  openCollapseIf = () => {
    this.setState({ isItemCollapsedIf: false });
  };
  openCollapseElse = () => {
    this.setState({ isItemCollapsedElse: false });
  };

  render() {
    return Object.entries(this.props.blocks).map(([key, block]) => {
      let tempWeightPath = [];
      if (key === "weight") {
        tempWeightPath = [...this.props.path];

        return (
          <>
            <BackTestBuilderBlock
              openCollapse={this.openCollapseWeight}
              //WEIGHT
              weightPath={tempWeightPath}
              weightIndex={this.props.weightIndex}
              //WEIGHT

              passedClass="strategy-builder-block-container-weight"
              blockLevel={this.props.blockLevel}
              blockType="weight"
              showDropDown
              path={[...this.props.path]}
              strategyBuilderString={this.props.strategyBuilderString}
              changeStrategyBuilderString={
                this.props.changeStrategyBuilderString
              }
              isError={isArrayInArrayOfArrays(
                [...this.props.path, key],
                this.props.emptyItems
              )}
              isItemCollapsed={this.state.isItemCollapsedWeight}
              toggleCollapse={this.toggleCollapseWeight}
            ></BackTestBuilderBlock>
            {this.props.blocks?.weight?.weight_item?.map(
              (curItem, curItemIndex) => (
                <div
                  className={`strategy-builder-block-container-parent ${
                    this.state.isItemCollapsedWeight
                      ? "strategy-builder-block-container-parent-collapsed"
                      : ""
                  }`}
                >
                  {/* {block.weight_type === "SPECIFIED" ? ( */}
                  <BackTestBuilderBlock
                    //WEIGHT
                    weightPath={tempWeightPath}
                    weightIndex={this.props.weightIndex}
                    //WEIGHT
                    passedClass="strategy-builder-block-container-weight"
                    blockLevel={this.props.blockLevel + 1}
                    blockType="weight percentage"
                    path={[...this.props.path]}
                    strategyBuilderString={this.props.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.props.changeStrategyBuilderString
                    }
                  >
                    <BackTestWeightPercentageBlock
                      path={[
                        ...this.props.path,
                        key,
                        "weight_item",
                        curItemIndex,
                      ]}
                      strategyBuilderString={this.props.strategyBuilderString}
                      changeStrategyBuilderString={
                        this.props.changeStrategyBuilderString
                      }
                      weightPercentage={curItem.percentage}
                    />
                  </BackTestBuilderBlock>
                  {/* ) : null} */}
                  <BackTestBuilderMainBlock
                    // FIXED
                    emptyItems={this.props.emptyItems}
                    strategyBuilderString={this.props.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.props.changeStrategyBuilderString
                    }
                    // FIXED

                    blocks={curItem.item}
                    path={[
                      ...this.props.path,
                      key,
                      "weight_item",
                      curItemIndex,
                      "item",
                    ]}
                    blockLevel={this.props.blockLevel + 2}
                    weightPath={tempWeightPath}
                    weightIndex={curItemIndex}
                  />
                </div>
              )
            )}
            {/* <BackTestBuilderBlock
              //WEIGHT
              weightPath={tempWeightPath}
              weightIndex={weightIndex}
              //WEIGHT

              passedClass="strategy-builder-block-container-add-item"
              blockLevel={blockLevel}
              blockType="add item"
              path={[...path]}
              strategyBuilderString={this.props.strategyBuilderString}
              changeStrategyBuilderString={this.props.changeStrategyBuilderString}
            /> */}
          </>
        );
      } else if (key === "asset") {
        return (
          <BackTestBuilderBlock
            //WEIGHT
            weightPath={this.props.weightPath}
            weightIndex={this.props.weightIndex}
            //WEIGHT

            passedClass="strategy-builder-block-container-asset"
            blockLevel={this.props.blockLevel}
            blockType="asset"
            parentPath={this.props.path}
            path={[...this.props.path, key]}
            strategyBuilderString={this.props.strategyBuilderString}
            changeStrategyBuilderString={this.props.changeStrategyBuilderString}
            tokenList={block.tokenList}
          >
            <BackTestAssetBuilderBlock
              tokenList={block.tokenList}
              strategyBuilderString={this.props.strategyBuilderString}
              changeStrategyBuilderString={
                this.props.changeStrategyBuilderString
              }
              path={[...this.props.path]}
              selectedAsset={this.props.blocks.asset}
            />
          </BackTestBuilderBlock>
        );
      } else if (key === "condition") {
        return (
          <>
            <>
              <BackTestBuilderBlock
                openCollapse={this.openCollapseIf}
                //WEIGHT
                weightPath={this.props.weightPath}
                weightIndex={this.props.weightIndex}
                //WEIGHT
                passedClass="strategy-builder-block-container-condition-if"
                blockLevel={this.props.blockLevel}
                blockType="condition if"
                showDropDown
                strategyBuilderString={this.props.strategyBuilderString}
                path={[...this.props.path]}
                changeStrategyBuilderString={
                  this.props.changeStrategyBuilderString
                }
                isError={isArrayInArrayOfArrays(
                  [...this.props.path, key, "success"],
                  this.props.emptyItems
                )}
                isItemCollapsed={this.state.isItemCollapsedIf}
                toggleCollapse={this.toggleCollapseIf}
              >
                <BackTestConditionBuilderBlock
                  amount={block.amount}
                  operator={block.operator}
                  time_period={block.time_period}
                  token={block.token}
                  type={block.type}
                  path={[...this.props.path, key]}
                  strategyBuilderString={this.props.strategyBuilderString}
                  changeStrategyBuilderString={
                    this.props.changeStrategyBuilderString
                  }
                />
              </BackTestBuilderBlock>
              {block.success &&
              Object.keys(block.success) &&
              Object.keys(block.success).length > 0 ? (
                <div
                  className={`strategy-builder-block-container-parent ${
                    this.state.isItemCollapsedIf
                      ? "strategy-builder-block-container-parent-collapsed"
                      : ""
                  }`}
                >
                  <BackTestBuilderMainBlock
                    // FIXED
                    emptyItems={this.props.emptyItems}
                    strategyBuilderString={this.props.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.props.changeStrategyBuilderString
                    }
                    // FIXED

                    blocks={block.success}
                    path={[...this.props.path, key, "success"]}
                    blockLevel={this.props.blockLevel + 1}
                    weightPath={tempWeightPath}
                    weightIndex={this.props.weightIndex}
                  />
                </div>
              ) : null}
            </>

            <>
              <BackTestBuilderBlock
                openCollapse={this.openCollapseElse}
                //WEIGHT
                weightPath={tempWeightPath}
                weightIndex={this.props.weightIndex}
                //WEIGHT
                passedClass="strategy-builder-block-container-condition-else"
                blockLevel={this.props.blockLevel}
                blockType="condition else"
                path={[...this.props.path, key]}
                strategyBuilderString={this.props.strategyBuilderString}
                changeStrategyBuilderString={
                  this.props.changeStrategyBuilderString
                }
                isError={isArrayInArrayOfArrays(
                  [...this.props.path, key, "failed"],
                  this.props.emptyItems
                )}
                showDropDown
                isItemCollapsed={this.state.isItemCollapsedElse}
                toggleCollapse={this.toggleCollapseElse}
              />
              {block.failed &&
              Object.keys(block.failed) &&
              Object.keys(block.failed).length > 0 ? (
                <div
                  className={`strategy-builder-block-container-parent ${
                    this.state.isItemCollapsedElse
                      ? "strategy-builder-block-container-parent-collapsed"
                      : ""
                  }`}
                >
                  <BackTestBuilderMainBlock
                    // FIXED
                    emptyItems={this.props.emptyItems}
                    strategyBuilderString={this.props.strategyBuilderString}
                    changeStrategyBuilderString={
                      this.props.changeStrategyBuilderString
                    }
                    // FIXED

                    blocks={block.failed}
                    path={[...this.props.path, key, "failed"]}
                    blockLevel={this.props.blockLevel + 1}
                    weightPath={tempWeightPath}
                    weightIndex={this.props.weightIndex}
                  />
                </div>
              ) : null}
            </>
          </>
        );
      } else {
        return null;
      }
    });
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = { createBackTestQuery };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackTestBuilderMainBlock);
