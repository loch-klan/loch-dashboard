import { BaseReactComponent } from "../../../../../../utils/form";
import { mobileCheck } from "../../../../../../utils/ReusableFunctions";
import BackTestAddingOptions from "../../Components/BackTestAddingOptions/BackTestAddingOptions";
import "./_backTestAddItemsBellow.scss";

class BackTestAddItemsBellow extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOptionsOpen: false,
      isMobile: mobileCheck(),
    };
  }
  toggleOptions = () => {
    this.setState({ isOptionsOpen: !this.state.isOptionsOpen });
  };
  closeOptions = () => {
    this.setState({ isOptionsOpen: false });
  };
  onAddAssetClick = () => {
    if (this.props.openCollapse) {
      this.props.openCollapse();
    }
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });

    if (this.props.blockType === "asset" || this.props.blockType === "weight") {
      let itemToBeChanged = itemToBeChangedOriginal;
      this.props.weightPath.forEach((element) => {
        itemToBeChanged = itemToBeChanged[element];
      });
      itemToBeChanged = itemToBeChanged.weight.weight_item;
      let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
      arrLength = arrLength + 1;
      let equalWeight = 100 / arrLength;
      equalWeight = Math.round(equalWeight * 100) / 100;
      let tempItemToBeChanged = itemToBeChanged.map((item, itemIndex) => {
        return {
          ...item,
          percentage: equalWeight,
        };
      });
      if (this.props.weightIndex !== undefined) {
        tempItemToBeChanged.splice(this.props.weightIndex + 1, 0, {
          item: { asset: "BTC" },
          percentage: equalWeight,
        });
      } else {
        tempItemToBeChanged.push({
          item: { asset: "BTC" },
          percentage: equalWeight,
        });
      }
      itemToBeChanged.splice(0, itemToBeChanged.length);
      tempItemToBeChanged.forEach((item) => {
        itemToBeChanged.push({
          ...item,
          percentage: equalWeight,
        });
      });
    } else if (this.props.blockType === "condition if") {
      if (
        itemToBeChanged.condition.success &&
        Object.keys(itemToBeChanged.condition.success).length === 0
      ) {
        itemToBeChanged.condition.success = {
          weight: {
            weight_type: "SPECIFIED",
            weight_item: [
              {
                percentage: "100",
                item: {
                  asset: "BTC",
                },
              },
            ],
          },
        };
      } else {
        itemToBeChanged = itemToBeChanged.condition.success.weight.weight_item;
        let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
        arrLength = arrLength + 1;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;
        let tempItemToBeChanged = itemToBeChanged.map((item) => {
          return {
            ...item,
            percentage: equalWeight,
          };
        });
        tempItemToBeChanged.push({
          item: { asset: "BTC" },
          percentage: equalWeight,
        });
        itemToBeChanged.splice(0, itemToBeChanged.length);
        tempItemToBeChanged.forEach((item) => {
          itemToBeChanged.push({
            ...item,
            percentage: equalWeight,
          });
        });
      }
    } else if (this.props.blockType === "condition else") {
      if (
        itemToBeChanged.failed &&
        Object.keys(itemToBeChanged.failed).length === 0
      ) {
        itemToBeChanged.failed = {
          weight: {
            weight_type: "SPECIFIED",
            weight_item: [
              {
                percentage: "100",
                item: {
                  asset: "BTC",
                },
              },
            ],
          },
        };
      } else {
        itemToBeChanged = itemToBeChanged.failed.weight.weight_item;
        let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
        arrLength = arrLength + 1;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;
        let tempItemToBeChanged = itemToBeChanged.map((item) => {
          return {
            ...item,
            percentage: equalWeight,
          };
        });
        tempItemToBeChanged.push({
          item: { asset: "BTC" },
          percentage: equalWeight,
        });
        itemToBeChanged.splice(0, itemToBeChanged.length);
        tempItemToBeChanged.forEach((item) => {
          itemToBeChanged.push({
            ...item,
            percentage: equalWeight,
          });
        });
      }
    }

    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
    this.closeOptions();
  };
  onAddConditionClick = () => {
    if (this.props.openCollapse) {
      this.props.openCollapse();
    }
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });

    if (this.props.blockType === "asset" || this.props.blockType === "weight") {
      let itemToBeChanged = itemToBeChangedOriginal;
      this.props.weightPath.forEach((element) => {
        itemToBeChanged = itemToBeChanged[element];
      });

      itemToBeChanged = itemToBeChanged.weight.weight_item;
      let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
      arrLength = arrLength + 1;
      let equalWeight = 100 / arrLength;
      equalWeight = Math.round(equalWeight * 100) / 100;
      let tempItemToBeChanged = itemToBeChanged.map((item) => {
        return {
          ...item,
          percentage: equalWeight,
        };
      });

      if (this.props.weightIndex !== undefined) {
        tempItemToBeChanged.splice(this.props.weightIndex + 1, 0, {
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
          percentage: equalWeight,
        });
      } else {
        tempItemToBeChanged.push({
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
          percentage: equalWeight,
        });
      }
      itemToBeChanged.splice(0, itemToBeChanged.length);
      tempItemToBeChanged.forEach((item) => {
        itemToBeChanged.push({
          ...item,
          percentage: equalWeight,
        });
      });
    } else if (this.props.blockType === "condition if") {
      if (
        itemToBeChanged.condition.success &&
        Object.keys(itemToBeChanged.condition.success).length === 0
      ) {
        itemToBeChanged.condition.success = {
          weight: {
            weight_type: "SPECIFIED",
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
        };
      } else {
        itemToBeChanged = itemToBeChanged.condition.success.weight.weight_item;
        let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
        arrLength = arrLength + 1;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;
        let tempItemToBeChanged = itemToBeChanged.map((item) => {
          return {
            ...item,
            percentage: equalWeight,
          };
        });
        tempItemToBeChanged.push({
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
          percentage: equalWeight,
        });
        itemToBeChanged.splice(0, itemToBeChanged.length);
        tempItemToBeChanged.forEach((item) => {
          itemToBeChanged.push({
            ...item,
            percentage: equalWeight,
          });
        });
      }
    } else if (this.props.blockType === "condition else") {
      if (
        itemToBeChanged.failed &&
        Object.keys(itemToBeChanged.failed).length === 0
      ) {
        itemToBeChanged.failed = {
          weight: {
            weight_type: "SPECIFIED",
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
        };
      } else {
        itemToBeChanged = itemToBeChanged.failed.weight.weight_item;
        let arrLength = itemToBeChanged.length ? itemToBeChanged.length : 0;
        arrLength = arrLength + 1;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;
        let tempItemToBeChanged = itemToBeChanged.map((item) => {
          return {
            ...item,
            percentage: equalWeight,
          };
        });
        tempItemToBeChanged.push({
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
          percentage: equalWeight,
        });
        itemToBeChanged.splice(0, itemToBeChanged.length);
        tempItemToBeChanged.forEach((item) => {
          itemToBeChanged.push({
            ...item,
            percentage: equalWeight,
          });
        });
      }
    }

    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
    this.closeOptions();
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isOptionsOpenToggle !== this.props.isOptionsOpenToggle) {
      this.toggleOptions();
    }
  }

  render() {
    return (
      <div
        className={`sbb-add-options-bellow ${
          this.state.isMobile ? "sbb-add-options-bellow-mobile" : ""
        }`}
      >
        {/* <div className="sbb-add-options-bar">
          <div
            onClick={this.toggleOptions}
            className="sbb-add-options-bar-add-container"
          >
            <Image
              src={StrategyBuilderAddIcon}
              className="sbb-add-options-bar-add"
            />
          </div>
        </div> */}
        {this.state.isOptionsOpen ? (
          <div className={`sbb-add-options-bellow-items `}>
            <BackTestAddingOptions
              closeOptions={this.closeOptions}
              onAddAssetClick={this.onAddAssetClick}
              onAddConditionClick={this.onAddConditionClick}
              blockType={this.props.blockType}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default BackTestAddItemsBellow;
