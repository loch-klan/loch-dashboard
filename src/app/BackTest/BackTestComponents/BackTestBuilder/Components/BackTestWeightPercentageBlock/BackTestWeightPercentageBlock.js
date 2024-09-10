import OutsideClickHandler from "react-outside-click-handler";
import { BaseReactComponent } from "../../../../../../utils/form";
import BackTestWeightPercentagePopup from "../../PopUps/BackTestWeightPercentagePopup/BackTestWeightPercentagePopup";
import "./_backTestWeightPercentageBlock.scss";

class BackTestWeightPercentageBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPopUpOpen: false,
      weightPercentage: this.props.weightPercentage
        ? this.props.weightPercentage
        : "0",
    };
  }
  changeWeightPercentage = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    if (itemToBeChanged && itemToBeChanged.percentage !== undefined) {
      itemToBeChanged.percentage = passedItem;
    }
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }
  };
  componentDidUpdate(prevProps) {
    if (this.props.weightPercentage !== prevProps.weightPercentage) {
      this.setState({
        weightPercentage: this.props.weightPercentage
          ? this.props.weightPercentage
          : "0",
      });
    }
    if (prevProps.editBtnClicked !== this.props.editBtnClicked) {
      this.togglePopUp();
    }
    if (this.props.weightType !== prevProps.weightType) {
      this.setState({ weightType: this.props.weightType });
    }
    // if (prevProps.selectedAsset !== this.props.selectedAsset) {
    //   this.setCurAsset();
    // }
  }
  closePopUp = () => {
    this.setState({ isPopUpOpen: false });
  };
  togglePopUp = () => {
    this.setState({ isPopUpOpen: !this.state.isPopUpOpen });
  };

  render() {
    return (
      <>
        <div className="sbb-content">
          <div className="back-test-weight-percentage">
            <div className="back-test-weight-percentage-title">
              {this.state.weightPercentage} %
            </div>
            {this.state.isPopUpOpen ? (
              <OutsideClickHandler onOutsideClick={this.closePopUp}>
                <BackTestWeightPercentagePopup
                  selectedOption={this.props.weightPercentage}
                  onOptionSelect={this.changeWeightPercentage}
                  closePopUp={this.closePopUp}
                />
              </OutsideClickHandler>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default BackTestWeightPercentageBlock;
