import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";

import { BlackManIcon, GreyManIcon } from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";
import Loading from "../common/Loading";
import NftMobileBlock from "./NftMobileBlock";
import NftMobileHeader from "./NftMobileHeader";
import "./_nft.scss";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination";

class NFTMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      localLochUser: JSON.parse(window.sessionStorage.getItem("lochUser")),
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
      setTimeout(() => {
        window.scroll(0, document.body.scrollHeight);
      }, 100);
      setTimeout(() => {
        window.scroll(0, document.body.scrollHeight);
      }, 300);
      setTimeout(() => {
        window.scroll(0, document.body.scrollHeight);
      }, 500);
      setTimeout(() => {
        window.scroll(0, document.body.scrollHeight);
      }, 700);
      setTimeout(() => {
        window.scroll(0, document.body.scrollHeight);
      }, 1000);
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
        <NftMobileHeader />
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              paddingTop: "9rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <div
            style={{
              marginTop: "11rem",
            }}
          >
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <div className="mobileSmartMoneyListContainer">
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