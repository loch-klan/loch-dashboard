import { Image } from "react-bootstrap";
import {
  CheckIcon,
  StrategyBuilderDropdownArrowIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestPopupDropdown.scss";
import OutsideClickHandler from "react-outside-click-handler";

class BackTestPopupDropdown extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      inputValue: "",
      selectedOptionText: "",
      searchOptions: [],
    };
  }

  setSelectedOptionText = () => {
    if (this.props.isInputDropDown) {
      let tempTextItem = this.props.selectedOption
        ? this.props.selectedOption
        : 0;

      if (this.props.selectedAmountSymbol === "$") {
        this.setState({
          selectedOptionText: "$" + tempTextItem,
        });
      } else if (this.props.selectedAmountSymbol === "%") {
        this.setState({
          selectedOptionText: tempTextItem + "%",
        });
      } else {
        this.setState({ selectedOptionText: tempTextItem });
      }
    } else {
      this.setState({ selectedOptionText: this.props.selectedOption });
    }
  };
  componentDidMount() {
    if (this.props.isInputDropDown) {
      this.setState({
        inputValue: this.props.selectedOption,
      });
    }
    this.setSelectedOptionText();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.inputValue !== this.state.inputValue &&
      this.props.allOptions &&
      this.props.allOptions.length > 0
    ) {
      const searchOptions = this.props.allOptions.filter((item) => {
        return item.toLowerCase().includes(this.state.inputValue.toLowerCase());
      });

      this.setState({ searchOptions });
    }
    if (
      prevProps.selectedOption !== this.props.selectedOption ||
      prevProps.updatedText !== this.props.updatedText
    ) {
      this.setSelectedOptionText();
    }
  }
  toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };
  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };
  changeInputValue = (passedInput) => {
    let tempText = passedInput.target.value;

    if (this.props.isInputDropDown) {
      tempText = passedInput.target.value;
      let finalItem = tempText;
      if (isNaN(tempText)) {
        return;
      }
      if (this.props.limitAmounTo) {
        if (this.props.limitAmounTo >= tempText) {
          this.setState({ inputValue: passedInput.target.value }, () => {
            this.itemSelected(finalItem, 0);
          });
        }
      } else {
        this.setState({ inputValue: passedInput.target.value }, () => {
          this.itemSelected(finalItem, 0);
        });
      }
    } else {
      this.setState({ inputValue: tempText });
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
      <OutsideClickHandler onOutsideClick={this.closeDropdown}>
        <div className="back-test-pop-up-dropdown-container">
          <div
            onClick={this.toggleDropdown}
            className="back-test-pop-up-dropdown dotDotText"
          >
            <div>{this.state.selectedOptionText}</div>
            <Image src={StrategyBuilderDropdownArrowIcon} />
          </div>
          {this.state.isDropdownOpen ? (
            <div className="back-test-pop-up-dropdown-popup">
              <div className="back-test-popup-search-container">
                <div className="back-test-popup-search">
                  <input
                    placeholder={
                      this.props.selectedAmountSymbol
                        ? "100" + this.props.selectedAmountSymbol
                        : this.props.selectedOption
                    }
                    className="back-test-popup-search-input"
                    value={this.state.inputValue}
                    onChange={this.changeInputValue}
                  />
                </div>
              </div>
              <div className="back-test-popup-item-container">
                {this.state.inputValue.length > 0
                  ? this.state.searchOptions.map((option, index) => (
                      <div
                        className={`back-test-popup-list-item ${
                          option === this.props.selectedOption
                            ? "back-test-popup-list-item-selected"
                            : ""
                        }`}
                        onClick={() => {
                          this.itemSelected(option, index);
                        }}
                        style={{
                          marginTop: index === 0 ? "8px" : "0px",
                        }}
                        key={option + index}
                      >
                        <div>{option}</div>
                        {option === this.props.selectedOption ? (
                          <Image
                            className="back-test-popup-list-item-check-icon"
                            src={CheckIcon}
                          />
                        ) : null}
                      </div>
                    ))
                  : this.props.allOptions
                  ? this.props.allOptions.map((option, index) => (
                      <div
                        className={`back-test-popup-list-item ${
                          option === this.props.selectedOption
                            ? "back-test-popup-list-item-selected"
                            : ""
                        }`}
                        onClick={() => {
                          this.itemSelected(option, index);
                        }}
                        style={{
                          marginTop: index === 0 ? "8px" : "0px",
                        }}
                        key={option + index}
                      >
                        <div>{option}</div>
                        {option === this.props.selectedOption ? (
                          <Image
                            className="back-test-popup-list-item-check-icon"
                            src={CheckIcon}
                          />
                        ) : null}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          ) : null}
        </div>
      </OutsideClickHandler>
    );
  }
}

export default BackTestPopupDropdown;
