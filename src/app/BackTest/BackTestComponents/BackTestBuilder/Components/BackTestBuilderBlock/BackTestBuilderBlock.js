import React from "react";
import { Image } from "react-bootstrap";
import {
  RoundedArrowDownIcon,
  StrategyBuilderAddIcon,
  StrategyBuilderAssetIcon,
  StrategyBuilderConditionIcon,
  StrategyBuilderWeightIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import { mobileCheck } from "../../../../../../utils/ReusableFunctions";
import BackTestAddItems from "../../BuildingBlocks/BackTestAddItems/BackTestAddItems";
import BackTestAddItemsBellow from "../../BuildingBlocks/BackTestAddItemsBellow/BackTestAddItemsBellow";
import BackTestEditDelete from "../../BuildingBlocks/BackTestEditDelete/BackTestEditDelete";
import "./_backTestBuilderBlock.scss";

class BackTestBuilderBlock extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: mobileCheck(),
      titleName: "",
      titleIcon: "",
      titleClassName: "",
      editBtnClicked: false,
      deleteBtnClicked: false,

      isOptionsOpenToggle: false,
      isOptionsOpenToggleBellow: false,
    };
  }
  componentDidMount() {
    if (this.props.blockType === "asset") {
      this.setState({
        titleName: "ASSET",
        titleIcon: StrategyBuilderAssetIcon,
        titleClassName: "sbb-title-asset",
      });
    } else if (this.props.blockType === "condition if") {
      this.setState({
        titleName: "IF",
        titleIcon: StrategyBuilderConditionIcon,
        titleClassName: "sbb-title-condition",
      });
    } else if (this.props.blockType === "condition else") {
      this.setState({
        titleName: "ELSE",
        titleIcon: StrategyBuilderConditionIcon,
        titleClassName: "sbb-title-condition",
      });
    } else if (this.props.blockType === "weight") {
      this.setState({
        titleName: "WEIGHT",
        titleIcon: StrategyBuilderWeightIcon,
        titleClassName: "sbb-title-weight",
      });
    } else if (this.props.blockType === "weight percentage") {
      this.setState({
        titleIcon: StrategyBuilderWeightIcon,
        titleClassName: "sbb-title-weight",
      });
    } else if (this.props.blockType === "add item") {
      this.setState({
        titleName: "Add a block",
        titleIcon: StrategyBuilderAddIcon,
        // titleClassName: "sbb-title-weight",
      });
    }
  }
  onDeleteClick = () => {
    this.setState({ deleteBtnClicked: !this.state.deleteBtnClicked });

    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    if (
      this.props.blockType === "asset" ||
      this.props.blockType === "condition if" ||
      this.props.blockType === "weight percentage"
    ) {
      if (this.props.weightPath.length >= 0 && this.props.weightIndex !== -1) {
        let weightItemToBeChanged = itemToBeChangedOriginal;
        this.props.weightPath.forEach((element) => {
          weightItemToBeChanged = weightItemToBeChanged[element];
        });
        weightItemToBeChanged = weightItemToBeChanged.weight.weight_item;
        let arrLength = weightItemToBeChanged.length;
        arrLength = arrLength - 1;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;
        weightItemToBeChanged.splice(this.props.weightIndex, 1);

        let tempWeightItemToBeChanged = weightItemToBeChanged.map(
          (item, index) => {
            return {
              ...item,
              percentage: equalWeight,
            };
          }
        );
        weightItemToBeChanged.splice(0, weightItemToBeChanged.length);
        tempWeightItemToBeChanged.forEach((item) => {
          weightItemToBeChanged.push(item);
        });
      }
    } else if (this.props.blockType === "weight") {
      delete itemToBeChanged.weight;
    } else if (this.props.blockType === "condition else") {
      itemToBeChanged.failed = {};
    }
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  onAddClick = () => {
    this.setState({
      isOptionsOpenToggle: !this.state.isOptionsOpenToggle,
    });
  };
  onAddBellowClick = () => {
    this.setState({
      isOptionsOpenToggleBellow: !this.state.isOptionsOpenToggleBellow,
    });
  };
  onEditClick = () => {
    this.setState({ editBtnClicked: !this.state.editBtnClicked });
  };
  render() {
    const ChildrenWithProps = React.Children.map(
      this.props.children,
      (child) => {
        return React.cloneElement(child, {
          editBtnClicked: this.state.editBtnClicked,
          deleteBtnClicked: this.state.deleteBtnClicked,
        });
      }
    );
    return (
      <div
        className={`strategy-builder-block-container ${
          this.props.isError ? "strategy-builder-block-container-error" : ""
        } ${this.props.passedClass} ${
          this.state.isMobile ? "strategy-builder-block-container-mobile" : ""
        }`}
        style={{
          // transform: `translateX(${this.props.blockLevel * 4}rem)`,
          marginLeft: this.props.blockLevel * 4 + "rem",
        }}
      >
        <div />

        <>
          <div className={`strategy-builder-block `}>
            <BackTestAddItemsBellow
              openCollapse={this.props.openCollapse}
              //WEIGHT
              weightPath={this.props.weightPath}
              weightIndex={this.props.weightIndex}
              //WEIGHT
              blockType={this.props.blockType}
              path={this.props.path}
              assetIndex={this.props.assetIndex}
              strategyBuilderString={this.props.strategyBuilderString}
              changeStrategyBuilderString={
                this.props.changeStrategyBuilderString
              }
              isOptionsOpenToggle={this.state.isOptionsOpenToggleBellow}
            />

            <div className={`sbb-title ${this.state.titleClassName}`}>
              <div
                onClick={this.onAddClick}
                className="sbb-title-image-container"
              >
                <Image className="sbb-title-image" src={this.state.titleIcon} />
              </div>
              {this.state.titleName ? (
                <div className="sbb-title-text">{this.state.titleName}</div>
              ) : null}
            </div>
            {ChildrenWithProps ? (
              <div className="sbb-dropdown-children">{ChildrenWithProps}</div>
            ) : null}
            {this.props.showDropDown ? (
              <div className="sbb-dropdown-container">
                <div>:</div>
                <div
                  onClick={this.props.toggleCollapse}
                  className="sbb-dropdown"
                >
                  <Image
                    className={`sbb-dropdown-arrow ${
                      this.props.isItemCollapsed
                        ? "sbb-dropdown-arrow-reversed"
                        : ""
                    }`}
                    src={RoundedArrowDownIcon}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <BackTestEditDelete
            onEditClick={this.onEditClick}
            onDeleteClick={this.onDeleteClick}
            onAddClick={this.onAddBellowClick}
            hideEditBtn={
              this.props.blockType === "weight" ||
              this.props.blockType === "condition else"
            }
            hideAddBtn={this.props.blockType === "weight percentage"}
            hideDeleteBtn={this.props.blockType === "weight percentage"}
          />
        </>

        <BackTestAddItems
          //WEIGHT
          weightPath={this.props.weightPath}
          weightIndex={this.props.weightIndex}
          //WEIGHT
          blockType={this.props.blockType}
          path={this.props.path}
          assetIndex={this.props.assetIndex}
          strategyBuilderString={this.props.strategyBuilderString}
          changeStrategyBuilderString={this.props.changeStrategyBuilderString}
          isOptionsOpenToggle={this.state.isOptionsOpenToggle}
        />
      </div>
    );
  }
}

export default BackTestBuilderBlock;
