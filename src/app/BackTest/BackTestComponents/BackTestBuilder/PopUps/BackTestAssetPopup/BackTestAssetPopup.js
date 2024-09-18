import { Image } from "react-bootstrap";
import {
  CheckIcon,
  StrategyBuilderPopUpCloseIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import {
  mobileCheck,
  strategyByilderAssetList,
} from "../../../../../../utils/ReusableFunctions";
import "./_backTestAssetPopup.scss";

class BackTestAssetPopup extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      assetList: strategyByilderAssetList(),
      searchOptions: [],
      searchAssetList: [],
      searchVal: "",
      isMobile: mobileCheck(),
    };
  }
  onAssetSelect = (selectedAsset) => {
    this.props.onOptionSelect(selectedAsset);
  };
  setSearchValue = (e) => {
    this.setState({ searchVal: e.target.value });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchVal !== this.state.searchVal) {
      const searchAssetList = this.state.assetList.filter((asset) => {
        return asset.name
          .toLowerCase()
          .includes(this.state.searchVal.toLowerCase());
      });

      this.setState({ searchAssetList });
    }
  }
  render() {
    return (
      <div
        className={`back-test-asset-popup-container ${
          this.state.isMobile ? "back-test-asset-popup-container-mobile" : ""
        }`}
      >
        <div className="back-test-asset-popup">
          <div className="back-test-asset-popup-search-close-container">
            <div className="back-test-asset-popup-search">
              <input
                placeholder="Search for assets to add"
                className="back-test-asset-popup-search-input"
                value={this.state.searchVal}
                onChange={this.setSearchValue}
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
          <div className="back-test-asset-popup-item-container">
            {this.state.searchVal.length > 0
              ? this.state.searchAssetList.map((asset, index) => {
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
                      style={{
                        marginTop: index === 0 ? "8px" : "0px",
                      }}
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
                })
              : this.state.assetList.map((asset, index) => {
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
                      style={{
                        marginTop: index === 0 ? "8px" : "0px",
                      }}
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
      </div>
    );
  }
}

export default BackTestAssetPopup;
