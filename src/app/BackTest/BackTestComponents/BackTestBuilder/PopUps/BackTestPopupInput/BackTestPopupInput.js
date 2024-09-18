import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestPopupInput.scss";

class BackTestPopupInput extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      inputValue: "",
      selectedOptionText: "",
    };
  }

  setSelectedOptionText = () => {
    if (this.props.isInputDropDown) {
      if (this.props.selectedOption) {
        if (this.props.selectedAmountSymbol === "$") {
          this.setState({
            inputValue:
              this.props.selectedAmountSymbol + this.props.selectedOption,
          });
        } else if (this.props.selectedAmountSymbol === "%") {
          this.setState({
            inputValue:
              this.props.selectedOption + this.props.selectedAmountSymbol,
          });
        } else {
          this.setState({
            inputValue: this.props.selectedOption,
          });
        }
      }
    }
  };
  componentDidMount() {
    this.setSelectedOptionText();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedOption !== this.props.selectedOption ||
      prevProps.updatedText !== this.props.updatedText
    ) {
      this.setSelectedOptionText();
    }
  }

  changeInputValue = (passedInput) => {
    let tempText = passedInput.target.value;

    tempText = tempText.replace(this.props.selectedAmountSymbol, "");
    tempText = tempText.trim();

    let finalItem = tempText;
    if (tempText === "") {
      this.setState({ inputValue: "" }, () => {
        this.itemSelected(finalItem, 0);
      });
      return;
    }
    if (isNaN(tempText)) {
      return;
    }
    if (this.props.limitAmounTo) {
      if (this.props.limitAmounTo >= tempText) {
        if (this.props.selectedAmountSymbol === "$") {
          tempText = this.props.selectedAmountSymbol + tempText;
        } else if (this.props.selectedAmountSymbol === "%") {
          tempText = tempText + this.props.selectedAmountSymbol;
        }
        this.setState({ inputValue: tempText }, () => {
          this.itemSelected(finalItem, 0);
        });
      }
    } else {
      if (this.props.selectedAmountSymbol === "$") {
        tempText = this.props.selectedAmountSymbol + tempText;
      } else if (this.props.selectedAmountSymbol === "%") {
        tempText = tempText + this.props.selectedAmountSymbol;
      }
      this.setState({ inputValue: tempText }, () => {
        this.itemSelected(finalItem, 0);
      });
    }
  };
  itemSelected = (item, index) => {
    this.props.onOptionSelect(item, index);
    if (!this.props.isInputDropDown) {
      this.setState({
        isDropdownOpen: false,
      });
    }
  };

  render() {
    return (
      <div
        className={`back-test-pop-up-input-container ${
          this.props.smallerInput
            ? "back-test-pop-up-input-smaller-container"
            : ""
        }`}
      >
        <div className="back-test-popup-search">
          <input
            placeholder={
              this.props.selectedAmountSymbol
                ? this.props.selectedAmountSymbol + " Enter here"
                : this.props.smallerInput
                ? "122"
                : this.props.selectedOption
            }
            className="back-test-popup-search-input"
            value={this.state.inputValue}
            onChange={this.changeInputValue}
          />
        </div>
      </div>
    );
  }
}

export default BackTestPopupInput;
