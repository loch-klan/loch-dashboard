import React from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import { BaseReactComponent, CustomButton } from "../../utils/form";

import {
  CowSwapLogoIcon,
  CurveLogoIcon,
  EmultionSidebarIcon,
  KyberSwapLogoIcon,
  OneInchLogoIcon,
  ParaswapLogoIcon,
  UniswapLogoIcon,
} from "../../assets/images/icons";
import {
  CopyTradeExecuteModalBack,
  CopyTradeExecuteTradeSwapClicked,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

class EmulationsTradeModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: props.show,
      onHide: props.onHide,
      connectExchangesList: [
        {
          name: "Uniswap",
          code: "UNISWAP",
          icon: UniswapLogoIcon,
          goToLink: "https://app.uniswap.org/swap",
        },
        {
          name: "1inch",
          code: "ONEINCH",
          icon: OneInchLogoIcon,
          goToLink: "https://app.1inch.io/",
        },

        {
          name: "CoW Swap",
          code: "COWSWAP",
          icon: CowSwapLogoIcon,
          goToLink: "https://swap.cow.fi/",
        },
        {
          name: "KyberSwap",
          code: "KYBERSWAP",
          icon: KyberSwapLogoIcon,
          goToLink: "https://kyberswap.com/swap/",
        },
        {
          name: "Curve",
          code: "CURVE",
          icon: CurveLogoIcon,
          goToLink: "https://curve.fi/",
        },
        {
          name: "ParaSwap",
          code: "PARASWAP",
          icon: ParaswapLogoIcon,
          goToLink: "https://app.paraswap.io/#/",
        },
      ],
    };
  }

  componentWillUnmount() {
    window.localStorage.setItem("isPopupActive", false);
  }

  componentDidMount() {
    window.localStorage.setItem("isPopupActive", true);
  }
  confirmOrRejectCopyTradePass = () => {
    if (this.props.confirmOrRejectCopyTrade && this.props.executeCopyTrade) {
      this.props.confirmOrRejectCopyTrade(this.props.executeCopyTrade, true);
      this.state.onHide();
    }
  };
  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form execute-copy-trade-modal ${
          this.props.isMobile ? "execute-copy-trade-modal-mobile" : ""
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal connect-exchange"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <Modal.Header>
          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={EmultionSidebarIcon} className="imageDarker" />
          </div>
          <div
            className="closebtn"
            onClick={() => {
              CopyTradeExecuteModalBack({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
                swapAddress: this.props.executeCopyTrade.copyAddress,
                swapAssetFrom: this.props.executeCopyTrade.assetFrom,
                swapAmountFrom: this.props.executeCopyTrade.valueFrom,
                swapAssetTo: this.props.executeCopyTrade.assetTo,
                swapAmountTo: this.props.executeCopyTrade.valueTo,
              });
              this.state.onHide();
            }}
          >
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="connect-modal-body input-noshadow-dark input-hover-states">
            <div className="connect-head">
              <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                Execute Copy Trade
              </h6>
              <p className="inter-display-medium f-s-16 lh-19 grey-969 sub-heading">
                Select a dex to conduct the swap
              </p>
            </div>
            <div className="connect-wrapper">
              <Row>
                {this.state.connectExchangesList.map((item, indexIndex) => {
                  const goToSwapLink = () => {
                    CopyTradeExecuteTradeSwapClicked({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      swap: item.name,
                      swapAddress: this.props.executeCopyTrade.copyAddress,
                      swapAssetFrom: this.props.executeCopyTrade.assetFrom,
                      swapAmountFrom: this.props.executeCopyTrade.valueFrom,
                      swapAssetTo: this.props.executeCopyTrade.assetTo,
                      swapAmountTo: this.props.executeCopyTrade.valueTo,
                    });
                    window.open(item.goToLink, "_blank");
                  };
                  return (
                    <Col
                      style={{
                        marginTop:
                          indexIndex > 1 && this.props.isMobile
                            ? "30px"
                            : "0px",
                      }}
                      md={4}
                    >
                      <div onClick={goToSwapLink} className="connect-div">
                        <div className="img-wrapper">
                          <Image src={item.icon} />
                        </div>
                        <div>
                          <h3 className="connect-div-text inter-display-medium f-s-16 lh-19 ">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="watchListAddressBtnContainer copeTraderBtnContainer">
              <CustomButton
                className={`primary-btn go-btn main-button-invert `}
                type="submit"
                buttonText={"Done"}
                handleClick={this.confirmOrRejectCopyTradePass}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};
EmulationsTradeModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmulationsTradeModal);
