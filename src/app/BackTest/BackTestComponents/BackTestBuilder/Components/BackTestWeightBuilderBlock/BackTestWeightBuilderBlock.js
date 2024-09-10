import OutsideClickHandler from "react-outside-click-handler";
import { BaseReactComponent } from "../../../../../../utils/form";
import BackTestWeightPopup from "../../PopUps/BackTestWeightPopup/BackTestWeightPopup";
import "./_backTestWeightBuilderBlock.scss";
import { strategyBuilderWeightTypeToEnum } from "../../../../../../utils/ReusableFunctions";

class BackTestWeightBuilderBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPopUpOpen: false,
      weightType: this.props.weightType ? this.props.weightType : "",
    };
  }
  changeWeightConditions = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged = itemToBeChanged.weight;
    if (itemToBeChanged.weight_type) {
      itemToBeChanged.weight_type = strategyBuilderWeightTypeToEnum(passedItem);
      if (strategyBuilderWeightTypeToEnum(passedItem) === "EQUAL") {
        itemToBeChanged = itemToBeChanged.weight_item;
        let arrLength = itemToBeChanged.length;
        let equalWeight = 100 / arrLength;
        equalWeight = Math.round(equalWeight * 100) / 100;

        let tempWeightItemToBeChanged = itemToBeChanged.map((item, index) => {
          return {
            ...item,
            percentage: equalWeight,
          };
        });
        itemToBeChanged.splice(0, itemToBeChanged.length);
        tempWeightItemToBeChanged.forEach((item) => {
          itemToBeChanged.push(item);
        });
      }
    }
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
    }

    this.closePopUp();
  };
  componentDidUpdate(prevProps) {
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
          <div className="back-test-weight-builder">
            <div className="back-test-weight-builder-title">
              {this.state.weightType}
            </div>
            {this.state.isPopUpOpen ? (
              <OutsideClickHandler onOutsideClick={this.closePopUp}>
                <BackTestWeightPopup
                  selectedOption={this.props.selectedAsset}
                  weightType={this.state.weightType}
                  onOptionSelect={this.changeAsset}
                  closePopUp={this.closePopUp}
                  changeWeightConditions={this.changeWeightConditions}
                />
              </OutsideClickHandler>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default BackTestWeightBuilderBlock;
