import { Image } from "react-bootstrap";
import {
  CheckIcon,
  StrategyBuilderPopUpCloseIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import { strategyByilderAssetList } from "../../../../../../utils/ReusableFunctions";
import "./_backTestAssetPopup.scss";

class BackTestAssetPopup extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      assetList: strategyByilderAssetList(),
    };
  }
  onAssetSelect = (selectedAsset) => {
    this.props.onOptionSelect(selectedAsset);
  };
  render() {
    return (
      <div className="back-test-asset-popup-container">
        <div className="back-test-asset-popup">
          <div className="back-test-asset-popup-search-close-container">
            <div className="back-test-asset-popup-search">
              <input
                placeholder="Search for assets to add"
                className="back-test-asset-popup-search-input"
              />
            </div>
            <div
              onClick={this.props.closePopUp}
              className="back-test-asset-popup-close"
            >
              <Image
                src={StrategyBuilderPopUpCloseIcon}
                className="back-test-asset-popup-close-icon "
              />
            </div>
          </div>
          {this.state.assetList.map((asset, index) => {
            return (
              <div
                onClick={() => {
                  this.onAssetSelect(asset);
                }}
                className={`back-test-asset-popup-item ${
                  asset.name === this.props.selectedOption
                    ? "back-test-asset-popup-item-selected"
                    : ""
                }`}
              >
                <div className="back-test-asset-popup-item-content">
                  <div
                    style={{
                      backgroundColor: asset.color,
                    }}
                    className="back-test-asset-popup-item-icon"
                  >
                    <Image
                      className="back-test-asset-popup-item-icon-image"
                      src={asset.icon}
                    />
                  </div>
                  <div className="back-test-asset-popup-item-name">
                    {asset.name}
                  </div>
                </div>
                {asset.name === this.props.selectedOption ? (
                  <Image
                    className="back-test-asset-popup-item-check-icon"
                    src={CheckIcon}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BackTestAssetPopup;
