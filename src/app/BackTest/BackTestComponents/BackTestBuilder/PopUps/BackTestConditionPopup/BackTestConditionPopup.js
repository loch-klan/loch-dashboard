import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import {
  StrategyBuilderConditionIcon,
  StrategyBuilderPopUpCloseIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import BackTestPopupDropdown from "../BackTestPopupDropdown/BackTestPopupDropdown";
import "./_backTestConditionPopup.scss";
import BackTestPopupInput from "../BackTestPopupInput/BackTestPopupInput";
import {
  mobileCheck,
  strategyByilderAssetList,
} from "../../../../../../utils/ReusableFunctions";

class BackTestConditionPopup extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      //Price condition
      isMobile: mobileCheck(),
      allPriceConditions: [
        "Current price",
        "Cumulative return",
        "Exponential moving average",
        "Max drawdown",
        "Moving average price",
        "Moving average return",
        "Relative strength index",
        "Standard deviation of price",
        "Standard deviation of return",
        "Moving average convergence divergence",
        "Volume",
        "Market capitalization",
      ],
      selectedPriceConditions: this.props.selectedPriceConditions
        ? this.props.selectedPriceConditions
        : "",

      //Asset condition
      allAssetConditions: ["BTC", "ETH"],
      selectedAssetConditions: this.props.selectedAssetConditions
        ? this.props.selectedAssetConditions
        : "",

      // Operator condition
      allOperatorConditions: ["greater than", "less than", "equals to"],
      selectedOperatorConditions: this.props.selectedOperatorConditions
        ? this.props.selectedOperatorConditions
        : "",

      // Amount condition

      selectedAmountConditions: this.props.selectedAmountConditions
        ? "" + this.props.selectedAmountConditions
        : "",
      selectedDaysConditions: this.props.selectedDaysConditions
        ? this.props.selectedDaysConditions
        : "",
      shouldUpdateText: false,
    };
  }
  changePriceConditions = (item, index) => {
    this.setState({
      selectedPriceConditions: item,
      selectedAmountConditions: 100,
    });
    this.props.changePriceConditions(item);
  };
  changeAssetConditions = (item, index) => {
    this.setState({ selectedAssetConditions: item });
    this.props.changeAssetConditions(item);
  };
  changeOperatorConditions = (item, index) => {
    this.setState({ selectedOperatorConditions: item });
    this.props.changeOperatorConditions(item);
  };
  changeAmountConditions = (item, index) => {
    this.setState({ selectedAmountConditions: item });
    this.props.changeAmountConditions(item);
  };
  changeDaysConditions = (item, index) => {
    this.setState({ selectedDaysConditions: item });
    this.props.changeDaysConditions(item);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedPriceConditions !== this.state.selectedPriceConditions
    ) {
      this.setState({
        shouldUpdateText: !this.state.shouldUpdateText,
      });
    }
  }
  componentDidMount() {
    let tempItem = strategyByilderAssetList();
    let tempHolder = [];
    for (let i = 0; i < tempItem.length; i++) {
      tempHolder.push(tempItem[i].name);
    }
    this.setState({
      allAssetConditions: tempHolder,
    });
  }

  render() {
    return (
      <div
        className={`back-test-condition-popup-container ${
          this.state.isMobile
            ? "back-test-condition-popup-container-mobile"
            : ""
        }`}
      >
        <OutsideClickHandler onOutsideClick={this.props.closePopUp}>
          <div className="back-test-condition-popup">
            <div className="back-test-condition-popup-header-container">
              <div className="back-test-condition-popup-header-text">
                <Image
                  className="back-test-condition-popup-header-text-icon"
                  src={StrategyBuilderConditionIcon}
                />
                <div>Adjust condition</div>
              </div>
              <div
                onClick={this.props.closePopUp}
                className="back-test-condition-popup-header-close"
              >
                <Image
                  src={StrategyBuilderPopUpCloseIcon}
                  className="back-test-condition-popup-header-close-icon "
                />
              </div>
            </div>
            <div className="back-test-condition-popup-body">
              <div className="back-test-condition-popup-body-row">
                <div className="back-test-condition-popup-body-colored-block">
                  if
                </div>
                {this.props.shouldShowDays ? (
                  <>
                    <BackTestPopupInput
                      smallerInput
                      selectedOption={this.state.selectedDaysConditions}
                      isInputDropDown
                      onOptionSelect={this.changeDaysConditions}
                    />
                    <div className="back-test-condition-popup-body-colored-text ">
                      {this.state.selectedPriceConditions ===
                      "Market capitalization"
                        ? this.state.selectedDaysConditions === "1"
                          ? "outstanding share for"
                          : "outstanding shares for"
                        : this.state.selectedDaysConditions === "1"
                        ? "day"
                        : "days"}
                    </div>
                  </>
                ) : null}
                <BackTestPopupDropdown
                  allOptions={this.state.allPriceConditions}
                  selectedOption={this.state.selectedPriceConditions}
                  onOptionSelect={this.changePriceConditions}
                />
                <div className="back-test-condition-popup-body-colored-text">
                  of
                </div>
                <BackTestPopupDropdown
                  allOptions={this.state.allAssetConditions}
                  selectedOption={this.state.selectedAssetConditions}
                  onOptionSelect={this.changeAssetConditions}
                />
              </div>
              <div className="back-test-condition-popup-body-row">
                <div className="back-test-condition-popup-body-colored-block">
                  is
                </div>
                <BackTestPopupDropdown
                  allOptions={this.state.allOperatorConditions}
                  selectedOption={this.state.selectedOperatorConditions}
                  onOptionSelect={this.changeOperatorConditions}
                />

                <BackTestPopupInput
                  limitAmounTo={
                    this.props.selectedAmountSymbol === "%" ? 100 : null
                  }
                  updatedText={this.state.shouldUpdateText}
                  selectedOption={this.state.selectedAmountConditions}
                  isInputDropDown
                  selectedAmountSymbol={this.props.selectedAmountSymbol}
                  onOptionSelect={this.changeAmountConditions}
                />
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default BackTestConditionPopup;
