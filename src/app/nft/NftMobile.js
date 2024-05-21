import React from "react";
import { Breadcrumb, Image } from "react-bootstrap";
import { connect } from "react-redux";

import { BlackManIcon, GreyManIcon } from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";
import Loading from "../common/Loading";
import NftMobileBlock from "./NftMobileBlock";
import NftMobileHeader from "./NftMobileHeader";
import "./_nft.scss";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination";
import { scrollToBottomAfterPageChange } from "../../utils/ReusableFunctions";

class NFTMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      localLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      BlackManIconLoaded: false,
      ShareProfileIconLoaded: false,
      shouldScrollToBottom: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isLoading !== this.props.isLoading &&
      this.state.shouldScrollToBottom
    ) {
      this.setState({
        shouldScrollToBottom: false,
      });
      scrollToBottomAfterPageChange();
    }
  }
  onPageChange = () => {
    this.setState({
      shouldScrollToBottom: true,
    });
  };

  render() {
    return (
      <div className="nft-page-mobile">
        <div className="mobile-header-container">
          <h4>NFT Collection</h4>
          <p>Browse the NFTs held by this wallet</p>
        </div>
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              backgroundColor: "var(--cardBackgroud)",
              borderRadius: "1rem",
              margin: "1.5rem 0rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div>
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <div
                style={{
                  paddingTop: "0rem",
                }}
                className="mobileSmartMoneyListContainer"
              >
                {this.props.tableData.map((mapData) => {
                  return <NftMobileBlock data={mapData} />;
                })}
              </div>
            ) : null}
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.pageCount}
                isMobile
                onPageChange={this.onPageChange}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

NFTMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFTMobile);
