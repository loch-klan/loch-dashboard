import React from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import { BaseReactComponent } from "../../utils/form";

import {
  CowSwapLogoIcon,
  CurveLogoIcon,
  EmultionSidebarIcon,
  KyberSwapLogoIcon,
  OneInchLogoIcon,
  ParaswapLogoIcon,
  UniswapLogoIcon,
} from "../../assets/images/icons";

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
    window.sessionStorage.setItem("isPopupActive", false);
  }

  componentDidMount() {
    window.sessionStorage.setItem("isPopupActive", true);
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.props.isMobile ? "mobile-execute-copy-trade-modal" : ""
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
            <Image
              src={EmultionSidebarIcon}
              style={{
                filter: "var(--invertColor) var(--darkerBrightness)",
              }}
            />
          </div>
          <div
            className="closebtn"
            onClick={() => {
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
                    window.open(item.goToLink, "_blank");
                  };
                  return (
                    <Col
                      style={{
                        marginTop: indexIndex > 1 ? "30px" : "0px",
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
