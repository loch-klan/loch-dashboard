import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import {
  StrategyBuilderPopUpCloseIcon,
  StrategyBuilderWeightIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import BackTestPopupDropdown from "../BackTestPopupDropdown/BackTestPopupDropdown";
import "./_backTestWeightPopup.scss";

class BackTestWeightPopup extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      //Price condition
      weightType: ["Equal", "Specified"],
      selectedWeightType: this.props.weightType
        ? this.props.weightType
        : "Equal",
    };
  }
  changeWeightConditions = (item, index) => {
    this.setState({ selectedWeightType: item });
    this.props.changeWeightConditions(item);
  };
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    return (
      <div className="back-test-weight-popup-container">
        <OutsideClickHandler onOutsideClick={this.props.closePopUp}>
          <div className="back-test-weight-popup">
            <div className="back-test-weight-popup-header-container">
              <div className="back-test-weight-popup-header-text">
                <Image
                  className="back-test-weight-popup-header-text-icon"
                  src={StrategyBuilderWeightIcon}
                />
                <div>Adjust weight type</div>
              </div>
              <div
                onClick={this.props.closePopUp}
                className="back-test-weight-popup-header-close"
              >
                <Image
                  src={StrategyBuilderPopUpCloseIcon}
                  className="back-test-weight-popup-header-close-icon "
                />
              </div>
            </div>
            <div className="back-test-weight-popup-body">
              <div className="back-test-weight-popup-body-row">
                <div className="back-test-weight-popup-body-colored-block">
                  Type
                </div>

                <BackTestPopupDropdown
                  allOptions={this.state.weightType}
                  selectedOption={this.state.selectedWeightType}
                  onOptionSelect={this.changeWeightConditions}
                />
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default BackTestWeightPopup;
