import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BlackManIcon,
  GreyManIcon,
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
} from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";
import Loading from "../common/Loading";
import NftMobileBlock from "./NftMobileBlock";
import NftMobileHeader from "./NftMobileHeader";
import "./_nft.scss";

class NFTMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      localLochUser: JSON.parse(window.sessionStorage.getItem("lochUser")),
      BlackManIconLoaded: false,
      ShareProfileIconLoaded: false,
    };
  }

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
          <>
            <div className="mobileSmartMoneyBtnsContainer">
              {this.state.localLochUser &&
              (this.state.localLochUser.email ||
                this.state.localLochUser.first_name ||
                this.state.localLochUser.last_name) ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      onClick={this.showSignOutModal}
                      style={{
                        flex: 1,
                      }}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={BlackManIcon}
                          onLoad={() => {
                            this.setState({
                              BlackManIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.BlackManIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        {this.state.localLochUser.first_name ||
                        this.state.localLochUser.last_name
                          ? `${this.state.localLochUser.first_name} ${
                              this.state.localLochUser.last_name
                                ? this.state.localLochUser.last_name.slice(
                                    0,
                                    1
                                  ) + "."
                                : ""
                            }`
                          : "Signed in"}
                      </div>
                    </div>
                    {/* <div
                      onClick={this.handleShare}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnShareContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={ShareProfileIcon}
                          onLoad={() => {
                            this.setState({
                              ShareProfileIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.ShareProfileIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Share
                      </div>
                    </div> */}
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                      onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        margin: "0rem 1rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                    <div
                      onClick={this.showAddAddressModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={PlusCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              PlusCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.PlusCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Add address
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                      }}
                      //   onClick={this.showSignInModal}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={GreyManIcon}
                          onLoad={() => {
                            this.setState({
                              GreyManIconIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.GreyManIconIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        Sign in
                      </div>
                    </div>
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                      //   onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginRight: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {this.props.tableData && this.props.tableData.length > 0 ? (
              <div className="mobileSmartMoneyListContainer">
                {this.props.tableData.map((mapData) => {
                  return <NftMobileBlock data={mapData} />;
                })}
              </div>
            ) : null}
            {/* {this.props.tableData && this.props.tableData.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                pageLimit={this.props.pageLimit}
                changePageLimit={this.props.changePageLimit}
                onPageChange={this.props.onPageChange}
                openSignInOnclickModal={this.openSignInOnclickModal}
                smartMoneyBlur={this.props.blurTable}
                isMobile
              />
            ) : null} */}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

NFTMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(NFTMobile);
