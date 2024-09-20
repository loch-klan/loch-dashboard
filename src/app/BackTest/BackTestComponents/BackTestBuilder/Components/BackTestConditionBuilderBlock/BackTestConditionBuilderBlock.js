import { BaseReactComponent } from "../../../../../../utils/form";
import {
  strategyByilderChartShouldShowDate,
  strategyByilderChartWhichSymbol,
  strategyByilderOperatorConvertorSymbolToText,
  strategyByilderOperatorConvertorTextToSymbol,
  strategyByilderTypeConvertorSymbolToText,
  strategyByilderTypeConvertorTextToSymbol,
} from "../../../../../../utils/ReusableFunctions";
import BackTestConditionPopup from "../../PopUps/BackTestConditionPopup/BackTestConditionPopup";
import "./_backTestConditionBuilderBlock.scss";

class BackTestConditionBuilderBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.amount,
      operator: props.operator,
      token: props.token,
      type: props.type,

      selectedPriceConditions: "",
      selectedAssetConditions: "",
      selectedOperatorConditions: "",
      selectedDaysConditions: "",
      selectedAmountConditions: 0,
      shouldShowDays: false,
      isPopUpOpen: false,
      selectedAmountSymbol: "",
    };
  }
  componentDidMount() {
    this.setState({ selectedAmountConditions: this.props.amount });
    let operatorSymbol = "";
    operatorSymbol = strategyByilderOperatorConvertorSymbolToText(
      this.props.operator
    );
    this.setState({ selectedOperatorConditions: operatorSymbol });
    this.setState({ selectedAssetConditions: this.props.token });
    this.setState({ selectedDaysConditions: this.props.time_period });

    this.setState({
      selectedPriceConditions: strategyByilderTypeConvertorSymbolToText(
        this.props.type
      ),
      shouldShowDays: strategyByilderChartShouldShowDate(this.props.type),
      selectedAmountSymbol: strategyByilderChartWhichSymbol(this.props.type),
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.editBtnClicked !== this.props.editBtnClicked) {
      this.openPopUp();
    }
    if (prevProps.amount !== this.props.amount) {
      this.setState({ selectedAmountConditions: this.props.amount });
    }
    if (prevProps.operator !== this.props.operator) {
      let operatorSymbol = "";
      operatorSymbol = strategyByilderOperatorConvertorSymbolToText(
        this.props.operator
      );
      this.setState({ selectedOperatorConditions: operatorSymbol });
    }
    if (prevProps.token !== this.props.token) {
      this.setState({ selectedAssetConditions: this.props.token });
    }
    if (prevProps.time_period !== this.props.time_period) {
      this.setState({ selectedDaysConditions: this.props.time_period });
    }
    if (prevProps.type !== this.props.type) {
      this.setState({
        selectedPriceConditions: strategyByilderTypeConvertorSymbolToText(
          this.props.type
        ),
        selectedAmountConditions: this.props.amount,
        shouldShowDays: strategyByilderChartShouldShowDate(this.props.type),
        selectedAmountSymbol: strategyByilderChartWhichSymbol(this.props.type),
      });
    }
  }
  closePopUp = () => {
    this.setState({ isPopUpOpen: false });
  };
  openPopUp = () => {
    this.setState({ isPopUpOpen: true });
  };
  changePriceConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });

    itemToBeChanged.type = strategyByilderTypeConvertorTextToSymbol(passedItem);
    itemToBeChanged.amount = 100;

    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  changeAssetConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged.token = passedItem;
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  changeOperatorConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged.operator =
      strategyByilderOperatorConvertorTextToSymbol(passedItem);
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  changeAmountConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged.amount = passedItem;
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  changeDaysConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged.time_period = passedItem;
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };

  render() {
    return (
      <>
        <div className="sbb-content">
          <div className="back-test-condition-builder">
            <div className="dotDotText">
              {this.state.shouldShowDays ? (
                <>
                  {this.state.selectedDaysConditions
                    ? this.state.selectedDaysConditions
                    : "0"}
                  {this.state.selectedPriceConditions ===
                  "Market capitalization"
                    ? " outstanding shares for "
                    : "d "}
                  {"  "}
                </>
              ) : null}
              <span className="back-test-condition-builder-grey-text">
                {this.state.selectedPriceConditions}
              </span>{" "}
              of {this.state.selectedAssetConditions} is{" "}
              <span className="back-test-condition-builder-grey-text">
                {this.state.selectedOperatorConditions}
              </span>{" "}
              {this.state.selectedAmountSymbol === "$" ? "$" : ""}
              {this.state.selectedAmountConditions
                ? this.state.selectedAmountConditions
                : 0}
              {this.state.selectedAmountSymbol === "%" ? "%" : ""}{" "}
            </div>
            {this.state.isPopUpOpen ? (
              <BackTestConditionPopup
                changePriceConditions={this.changePriceConditions}
                changeAssetConditions={this.changeAssetConditions}
                changeOperatorConditions={this.changeOperatorConditions}
                changeAmountConditions={this.changeAmountConditions}
                changeDaysConditions={this.changeDaysConditions}
                selectedDaysConditions={this.state.selectedDaysConditions}
                selectedPriceConditions={this.state.selectedPriceConditions}
                selectedAssetConditions={this.state.selectedAssetConditions}
                shouldShowDays={this.state.shouldShowDays}
                selectedOperatorConditions={
                  this.state.selectedOperatorConditions
                }
                selectedAmountConditions={this.state.selectedAmountConditions}
                selectedAmountSymbol={this.state.selectedAmountSymbol}
                closePopUp={this.closePopUp}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default BackTestConditionBuilderBlock;
