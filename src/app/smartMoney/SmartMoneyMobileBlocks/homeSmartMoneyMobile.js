import { connect } from "react-redux";
import { BaseReactComponent } from "../../../utils/form";
import Loading from "../../common/Loading";
import SmartMoneyMobileBlock from "./smartMoneyMobileBlock";
import SmartMoneyPagination from "../../../utils/commonComponent/SmartMoneyPagination";
import SmartMoneyMobileModalContainer from "./smartMoneyMobileModalContainer";
import SmartMoneyMobileSignInUp from "./smartMoneyMobileSignInUp";
import SmartMoneyMobileAddAddressModal from "./smartMoneyMobileAddAddressModal";
import SmartMoneyMobileHowItWorksModal from "./smartMoneyMobileHowItWorksModal";
import SmartMoneyMobileFAQModal from "./smartMoneyMobileFAQModal";
import SmartMoneyMobileSignOutModal from "./smartMoneyMobileSignOutModal";
import { Image } from "react-bootstrap";
import {
  BlackManIcon,
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
  ShareProfileIcon,
} from "../../../assets/images/icons";

class HomeSmartMoneyMobile extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mobileSmartMoneyPage">
        {this.props.signInModal ? (
          <SmartMoneyMobileModalContainer onHide={this.props.hideAllModals}>
            <SmartMoneyMobileSignInUp
              showClickSignInText={this.props.showClickSignInText}
              onHide={this.props.hideAllModals}
            />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.props.addAddressModal ? (
          <SmartMoneyMobileModalContainer onHide={this.props.hideAllModals}>
            <SmartMoneyMobileAddAddressModal
              onHide={this.props.hideAllModals}
            />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.props.howItWorksModal ? (
          <SmartMoneyMobileModalContainer onHide={this.props.hideAllModals}>
            <SmartMoneyMobileHowItWorksModal
              onHide={this.props.hideAllModals}
            />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.props.faqModal ? (
          <SmartMoneyMobileModalContainer onHide={this.props.hideAllModals}>
            <SmartMoneyMobileFAQModal onHide={this.props.hideAllModals} />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.props.signOutModal ? (
          <SmartMoneyMobileSignOutModal
            onSignOut={this.props.signOutFun}
            onHide={this.props.hideAllModals}
          />
        ) : null}

        <div className="mobile-header-container">
          <h4>Loch’s Leaderboard</h4>
          <p>Sorted by net worth, pnl, and flows</p>
        </div>

        <div className="mobileSmartMoneyBtnsContainer">
          <>
            <div className="mobileSmartMoneyBtnSignInBottomBtns">
              <div
                onClick={this.props.showFaqModal}
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
                      opacity: this.state.QuestionmarkCircleSmartMoneyIconLoaded
                        ? 1
                        : 0,
                    }}
                  />
                </div>
                <div className="mobileSmartMoneyBtnSignInJustText">FAQ</div>
              </div>
              <div
                onClick={this.props.showHowItWorksModal}
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
              {this.state.localLochUser &&
              (this.state.localLochUser.email ||
                this.state.localLochUser.first_name ||
                this.state.localLochUser.last_name) ? (
                <div
                  onClick={this.props.showAddAddressModal}
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
              ) : null}
            </div>
          </>
        </div>
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              backgroundColor: "white",
              borderRadius: "1rem",
              margin: "1.5rem 0rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            {this.props.accountList && this.props.accountList.length > 0 ? (
              <div className="mobileSmartMoneyListContainer">
                {this.props.accountList.map((mapData) => {
                  let tempCurrencyRate = this.props.currency?.rate
                    ? this.props.currency.rate
                    : 0;

                  let tempNetWorth = mapData.networth ? mapData.networth : 0;
                  let tempNetflows = mapData.netflows ? mapData.netflows : 0;
                  let tempProfits = mapData.profits ? mapData.profits : 0;
                  let tempReturns = mapData.returns ? mapData.returns : 0;

                  let netWorth = tempNetWorth * tempCurrencyRate;
                  let netFlows = tempNetflows * tempCurrencyRate;
                  let profits = tempProfits * tempCurrencyRate;
                  let returns = tempReturns * tempCurrencyRate;
                  return (
                    <SmartMoneyMobileBlock
                      netWorth={netWorth}
                      netFlows={netFlows}
                      profits={profits}
                      returns={returns}
                      mapData={mapData}
                      handleFollowUnfollow={this.props.handleFollowUnfollow}
                      openSignInOnclickModal={this.props.openSignInOnclickModal}
                      smartMoneyBlur={this.props.blurTable}
                    />
                  );
                })}
              </div>
            ) : null}
            {this.props.accountList && this.props.accountList.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                pageLimit={this.props.pageLimit}
                changePageLimit={this.props.changePageLimit}
                onPageChange={this.props.onPageChange}
                openSignInOnclickModal={this.props.openSignInOnclickModal}
                smartMoneyBlur={this.props.blurTable}
                isMobile
              />
            ) : null}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

HomeSmartMoneyMobile.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeSmartMoneyMobile);
