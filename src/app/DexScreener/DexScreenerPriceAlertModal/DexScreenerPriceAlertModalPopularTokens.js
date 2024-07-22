import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import BaseReactComponent from "../../../utils/form/BaseReactComponent.js";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'

import { DexScreenerSearchTrendingIcon } from "../../../assets/images/icons/index.js";
import DexScreenerSearchSuggestionBlock from "../../header/DexScreenerSearch/DexScreenerSearchSuggestionBlock.js";

class DexScreenerPriceAlertModalPopularTokens extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div className="price-alerts-header">
          <Image
            className="price-alerts-header-image"
            src={DexScreenerSearchTrendingIcon}
          />
          <div className="price-alerts-header-text">Popular Tokens</div>
        </div>
        {this.props.popularTokens ? (
          <div className="pa-blocks-container">
            {this.props.popularTokens.map((curItem) => {
              return (
                <DexScreenerSearchSuggestionBlock
                  onClick={this.props.onClick}
                  alertBlock={this.props.alertBlock}
                  name={curItem.name}
                  platform={curItem.platform}
                  imageIcon={curItem.imageIcon}
                />
              );
            })}
          </div>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

DexScreenerPriceAlertModalPopularTokens.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerPriceAlertModalPopularTokens);
