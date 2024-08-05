import React, { Component } from "react";
import { Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import { TopBarSearchIcon } from "../../../assets/images/icons";
import DexScreenerSearchSuggestion from "./DexScreenerSearchSuggestion";
import { mobileCheck } from "../../../utils/ReusableFunctions";
import "./_dexScreenerSearch.scss";

class DexScreenerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      searchText: "",
      topBarHistoryItems: [],
      dsSearchSuggestion: false,
      dsSearchSuggestionItems: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.dsSearchSuggestion !== this.state.dsSearchSuggestion) {
      if (this.state.dsSearchSuggestion) {
        const checkInputItem = document.getElementById(
          "topBarContainerInputBlockInputId"
        );
        if (checkInputItem) {
          checkInputItem.focus();
        }
      }
      const rootItem = document.getElementById("root");
      if (rootItem) {
        if (this.state.dsSearchSuggestion) {
          rootItem.classList.add("blurOnInputFocus");
        } else {
          rootItem.classList.remove("blurOnInputFocus");
        }
      }
    }
  }
  hideDexScreenerSearchSuggestions = () => {
    this.setState({
      dsSearchSuggestion: false,
    });
  };
  showDexScreenerSearchSuggestions = () => {
    this.setState({
      dsSearchSuggestion: true,
    });
  };
  handleOnLocalChange = (e) => {
    let { value } = e.target;
    this.setState({
      searchText: value,
    });
  };
  render() {
    return (
      <OutsideClickHandler
        style={{
          width: "100%",
        }}
        display="contents"
        className="topBarContainerInputBlockContainer"
        onOutsideClick={this.hideDexScreenerSearchSuggestions}
      >
        <div
          onClick={(e) => {
            if (this.props.isBlurred) {
              e.stopPropagation();
            }
          }}
          className={`topBarContainer dex-screener-search-box topBarContainerVisible ${
            this.state.isMobile ? "dex-screener-search-box-mobile" : ""
          }`}
        >
          {this.state.dsSearchSuggestion ? (
            <DexScreenerSearchSuggestion
              showDexScreenerSearchSuggestions={
                this.showDexScreenerSearchSuggestions
              }
            />
          ) : (
            <div
              onClick={this.showDexScreenerSearchSuggestions}
              className="dex-screener-search-box-overlay"
            >
              <Image
                src={TopBarSearchIcon}
                className="dex-screener-search-box-overlay-image"
              />
              <div className="dex-screener-search-box-overlay-text">
                Search for any token here
              </div>
            </div>
          )}

          <div className="topBarContainerInputBlockContainer">
            <div className="topBarContainerInputBlockContainerLeftOfInput">
              <Image
                src={TopBarSearchIcon}
                className="topBarContainerInputBlockIcon"
                style={{
                  opacity: "60%",
                }}
              />
            </div>
            <input
              style={{
                opacity:
                  this.state.searchText && this.state.searchText.length > 0
                    ? "100%"
                    : "60%",
              }}
              autoComplete="off"
              name={`dex-screener-search`}
              placeholder="Search"
              className="topBarContainerInputBlockInput"
              id="topBarContainerInputBlockInputId"
              value={this.state.searchText}
              title={this.state.searchText}
              onChange={(e) => this.handleOnLocalChange(e)}
              onFocus={this.showDexScreenerSearchSuggestions}
              // onKeyDown={this.handleTopBarInputKeyDown}
            />
          </div>

          <div
            className={`topBarContainerRightBlock ${
              this.state.searchText.length > 0
                ? "topBarContainerRightBlockMultiple"
                : ""
            }`}
            style={{
              opacity: this.state.searchText.length > 0 ? "1" : "0",
            }}
          >
            <div
              ref={this.props.buttonRef}
              className={`topbar-btn  ml-2 topbar-btn-dark `}
              id="address-button-two"
              style={{
                pointerEvents:
                  this.state.searchText.length > 0 ? "all" : "none",
              }}
            >
              <span className="dotDotText">Search</span>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DexScreenerSearch);
