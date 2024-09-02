import React from "react";
import { Image } from "react-bootstrap";
import {
  RoundedArrowDownIcon,
  StrategyBuilderAssetIcon,
  StrategyBuilderConditionIcon,
  StrategyBuilderWeightIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import { mobileCheck } from "../../../../../../utils/ReusableFunctions";
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
    }
  }
  onDeleteClick = () => {
    this.setState({ deleteBtnClicked: !this.state.deleteBtnClicked });
    console.log("path ", this.props.path);
    console.log("strategyBuilderString ", this.props.strategyBuilderString);

    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    if (this.props.blockType === "asset") {
      itemToBeChanged.splice(this.props.assetIndex, 1);
    } else if (this.props.blockType === "weight") {
      itemToBeChanged.asset = {};
    } else if (this.props.blockType === "condition if") {
      itemToBeChanged.condition = {};
    } else if (this.props.blockType === "condition else") {
      console.log("itemToBeChanged ", itemToBeChanged);

      itemToBeChanged.failed = {};
    }
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
      console.log("itemToBeChangedOriginal ", itemToBeChangedOriginal);
    }
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
        className={`strategy-builder-block-container ${this.props.passedClass}`}
      >
        <div
          style={{
            width: this.props.blockLevel * 4 + "rem",
          }}
        />

        <div
          className={`strategy-builder-block ${
            this.props.blockType !== "condition if" &&
            this.props.blockType !== "asset"
              ? "strategy-builder-block-no-hover"
              : ""
          }`}
        >
          <div className={`sbb-title ${this.state.titleClassName}`}>
            <div className="sbb-title-image-container">
              <Image className="sbb-title-image" src={this.state.titleIcon} />
            </div>
            <div className="sbb-title-text">{this.state.titleName}</div>
          </div>
          <div className="sbb-dropdown-children">{ChildrenWithProps}</div>
          {this.props.showDropDown ? (
            <div className="sbb-dropdown-container">
              <div>:</div>
              <div className="sbb-dropdown">
                <Image
                  className="sbb-dropdown-arrow"
                  src={RoundedArrowDownIcon}
                />
              </div>
            </div>
          ) : null}
        </div>
        <BackTestEditDelete
          onEditClick={this.onEditClick}
          onDeleteClick={this.onDeleteClick}
        />
      </div>
    );
  }
}

export default BackTestBuilderBlock;
