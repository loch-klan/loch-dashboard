import React, { Component } from "react";
import { connect } from "react-redux";
import BarGraphSection from "../common/BarGraphSection.js";
import { BarGraphFooter } from "../common/BarGraphFooter.js";
import "./_realizedProfitAndLoss.scss";
import Loading from "../common/Loading.js";

class RealizedProfitAndLossMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="realized-profit-and-loss-expanded-mobile">
        <div className="mobile-header-container">
          <h4>Flows</h4>
          <p>Understand this portfolio's net flows</p>
        </div>

        <div
          className="profit-chart profit-chart-mobile"
          style={{
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          ></div>
          {this.props.netFlowLoading ? (
            <div
              style={{
                height: "70vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              <Loading />
            </div>
          ) : (
            <BarGraphSection
              isPremiumUser={this.props.isPremiumUser}
              isBlurred={!this.props.isPremiumUser}
              goToPayModal={this.props.goToPayModal}
              dontShowAssets
              showToCalendar={this.props.showToCalendar}
              hideToCalendar={this.props.hideToCalendar}
              hideFromCalendar={this.props.hideFromCalendar}
              showFromCalendar={this.props.showFromCalendar}
              changeToDate={this.props.changeToDate}
              changeFromDate={this.props.changeFromDate}
              isFromCalendar={this.props.isFromCalendar}
              toDate={this.props.toDate}
              isToCalendar={this.props.isToCalendar}
              fromDate={this.props.fromDate}
              maxDate={this.props.maxDate}
              minDate={this.props.minDate}
              showFromAndTo
              isScrollVisible={false}
              data={null}
              options={null}
              coinsList={this.props.OnboardingState.coinsList}
              selectedActiveBadge={this.props.selectedActiveBadge}
              isSwitch={this.props.isSwitch}
              setSwitch={this.props.setSwitch}
              marginBottom="m-b-32"
              // showFooter={false}
              showFooterDropdown={false}
              // showFooter={true}
              showToken={true}
              activeTitle={this.props.title}
              assetList={this.props.AssetList}
              selectedAssets={this.props.selectedAssets}
              handleBadge={this.props.handleBadge}
              ProfitLossAsset={this.props.ProfitLossAssetLocal}
              handleAssetSelected={this.props.handleAssetSelected}
              getObj={true}
              isGraphLoading={this.props.netFlowLoading}
              chainSearchIsUsed={this.props.chainSearchIsUsed}
              assetSearchIsUsed={this.props.assetSearchIsUsed}
              showSwitch={false}
              isMobile={true}
            />
          )}
          {/* <BarGraphSection
            // openChartPage={this.goToRealizedGainsPage}
            newHomeSetup
            disableOnLoading
            noSubtitleBottomPadding
            noSubtitleTopPadding
            loaderHeight={15.5}
            // headerTitle="Realized profit and loss"
            // headerSubTitle="Understand this portfolio's net flows"
            isArrow={true}
            // handleClick={() => {
            //   if (this.state.lochToken) {
            //     ProfitLossEV({
            //       session_id: getCurrentUser().id,
            //       email_address: getCurrentUser().email,
            //     });
            //     this.props.history.push(
            //       "/intelligence#netflow"
            //     );
            //   }
            // }}
            isScrollVisible={false}
            data={
              this.props.intelligenceState?.graphValue &&
              this.props.intelligenceState?.graphValue[0]
            }
            options={
              this.props.intelligenceState?.graphValue &&
              this.props.intelligenceState?.graphValue[1]
            }
            coinsList={this.props.OnboardingState.coinsList}
            marginBottom="m-b-32"
            showFooter={false}
            showBadges={false}
            // showPercentage={
            //   this.props.intelligenceState.graphValue &&
            //   this.props.intelligenceState.graphValue[2]
            // }
            showSwitch={false}
            isLoading={this.props.netFlowLoading}
            className={"portfolio-profit-and-loss"}
            isMinichart={true}
            ProfitLossAsset={this.props.intelligenceState.ProfitLossAsset}
            isSwitch={this.props.isSwitch}
            setSwitch={this.props.setSwitch}
            isSmallerToggle
          /> */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealizedProfitAndLossMobile);
