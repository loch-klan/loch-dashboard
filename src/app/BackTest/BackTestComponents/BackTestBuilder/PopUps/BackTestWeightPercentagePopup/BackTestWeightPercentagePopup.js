import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import {
  StrategyBuilderPopUpCloseIcon,
  StrategyBuilderWeightIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import BackTestPopupDropdown from "../BackTestPopupDropdown/BackTestPopupDropdown";
import "./_backTestWeightPercentagePopup.scss";
import BackTestPopupInput from "../BackTestPopupInput/BackTestPopupInput";
import { mobileCheck } from "../../../../../../utils/ReusableFunctions";

class BackTestWeightPercentagePopup extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      //Price condition
      isMobile: mobileCheck(),
      selectedWeightPercentage: this.props.selectedOption
        ? this.props.selectedOption
        : "0",
    };
  }
  changeWeightPercentage = (item, index) => {
    this.setState({ selectedWeightPercentage: item });
    this.props.onOptionSelect(item);
  };
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    return (
      <div
        className={`back-test-weight-percentage-popup-container ${
          this.state.isMobile
            ? "back-test-weight-percentage-popup-container-mobile"
            : ""
        }`}
      >
        <OutsideClickHandler onOutsideClick={this.props.closePopUp}>
          <div className="back-test-weight-percentage-popup">
            <div className="back-test-weight-percentage-popup-header-container">
              <div className="back-test-weight-percentage-popup-header-text">
                <Image
                  className="back-test-weight-percentage-popup-header-text-icon"
                  src={StrategyBuilderWeightIcon}
                />
                <div>Adjust weight percentage</div>
              </div>
              <div
                onClick={this.props.closePopUp}
                className="back-test-weight-percentage-popup-header-close"
              >
                <Image
                  src={StrategyBuilderPopUpCloseIcon}
                  className="back-test-weight-percentage-popup-header-close-icon "
                />
              </div>
            </div>
            <div className="back-test-weight-percentage-popup-body">
              <div className="back-test-weight-percentage-popup-body-row">
                <div className="back-test-weight-percentage-popup-body-colored-block">
                  Weight allocated
                </div>

                <BackTestPopupInput
                  selectedOption={this.state.selectedWeightPercentage}
                  isInputDropDown
                  selectedAmountSymbol="%"
                  onOptionSelect={this.changeWeightPercentage}
                  limitAmounTo={100}
                />
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default BackTestWeightPercentagePopup;
