import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import { BaseReactComponent } from "../../../../../../utils/form";
import { strategyByilderAssetDetailFromName } from "../../../../../../utils/ReusableFunctions";
import BackTestAssetPopup from "../../PopUps/BackTestAssetPopup/BackTestAssetPopup";
import "./_backTestAssetBuilderBlock.scss";

class BackTestAssetBuilderBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPopUpOpen: false,
      curAsset: {
        name: "",
        icon: "",
        color: "",
      },
    };
  }
  setCurAsset = () => {
    let tempHolder = strategyByilderAssetDetailFromName(
      this.props.selectedAsset
    );

    this.setState({ curAsset: tempHolder });
  };
  componentDidMount() {
    this.setCurAsset();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.editBtnClicked !== this.props.editBtnClicked) {
      this.togglePopUp();
    }
    if (prevProps.selectedAsset !== this.props.selectedAsset) {
      this.setCurAsset();
    }
  }
  closePopUp = () => {
    this.setState({ isPopUpOpen: false });
  };
  togglePopUp = () => {
    this.setState({ isPopUpOpen: !this.state.isPopUpOpen });
  };
  changeAsset = (passedItem) => {
    let itemToBeChangedOriginal = structuredClone(
      this.props.strategyBuilderString
    );
    let itemToBeChanged = itemToBeChangedOriginal;
    this.props.path.forEach((element) => {
      itemToBeChanged = itemToBeChanged[element];
    });
    itemToBeChanged.asset = passedItem.name;
    if (this.props.changeStrategyBuilderString) {
      this.props.changeStrategyBuilderString(itemToBeChangedOriginal);
      this.closePopUp();
    }
  };
  render() {
    return (
      <>
        <div className="sbb-content">
          <div className="back-test-asset-builder">
            <div className="back-test-asset-popup-item-content">
              <div
                style={{
                  backgroundColor: this.state.curAsset.color,
                }}
                className="back-test-asset-popup-item-icon"
              >
                <Image
                  className="back-test-asset-popup-item-icon-image"
                  src={this.state.curAsset.icon}
                />
              </div>
              <div className="back-test-asset-popup-item-name">
                {this.state.curAsset.name}
              </div>
            </div>
            {this.state.isPopUpOpen ? (
              <OutsideClickHandler onOutsideClick={this.closePopUp}>
                <BackTestAssetPopup
                  selectedOption={this.props.selectedAsset}
                  onOptionSelect={this.changeAsset}
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

export default BackTestAssetBuilderBlock;
