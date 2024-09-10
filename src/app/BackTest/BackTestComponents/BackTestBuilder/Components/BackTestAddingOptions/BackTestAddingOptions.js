import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import {
  StrategyBuilderAssetIcon,
  StrategyBuilderConditionIcon,
} from "../../../../../../assets/images/icons";
import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestAddingOptions.scss";

class BackTestAddingOptions extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAssets: true,
      isCondition: true,
    };
  }
  componentDidMount() {
    // if (
    //   this.props.blockType === "condition if" ||
    //   this.props.blockType === "condition else"
    // ) {
    //   this.setState({ isCondition: true });
    // }
  }

  render() {
    return (
      <OutsideClickHandler
        display="contents"
        onOutsideClick={this.props.closeOptions}
      >
        <div className="sbc-header">
          {this.state.isAssets ? (
            <div
              onClick={this.props.onAddAssetClick}
              className="sbc-main-blocks sbc-main-blocks-asset"
            >
              <div className="sbc-main-blocks-image-container">
                <Image
                  src={StrategyBuilderAssetIcon}
                  className="sbc-main-blocks-image"
                />
              </div>
              <div>Assets</div>
            </div>
          ) : null}
          {/* <div className="sbc-main-blocks sbc-main-blocks-weight">
          <div className="sbc-main-blocks-image-container">
            <Image
              src={StrategyBuilderWeightIcon}
              className="sbc-main-blocks-image"
            />
          </div>
          <div>Weights</div>
        </div> */}
          {this.state.isCondition ? (
            <div
              onClick={this.props.onAddConditionClick}
              className="sbc-main-blocks sbc-main-blocks-condition"
            >
              <div className="sbc-main-blocks-image-container">
                <Image
                  src={StrategyBuilderConditionIcon}
                  className="sbc-main-blocks-image"
                />
              </div>
              <div>Conditions</div>
            </div>
          ) : null}
          {/* <div className="sbc-main-blocks sbc-main-blocks-sort">
          <div className="sbc-main-blocks-image-container">
            <Image
              src={StrategyBuilderSortIcon}
              className="sbc-main-blocks-image"
            />
          </div>
          <div>Sort</div>
        </div> */}
        </div>
      </OutsideClickHandler>
    );
  }
}

export default BackTestAddingOptions;
