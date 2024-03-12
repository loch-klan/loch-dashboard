import React from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";
import BinanceIcon from "../../assets/images/icons/Binance.svg";
import CoinbaseIcon from "../../assets/images/icons/coinbase.svg";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import { BaseReactComponent } from "../../utils/form";

import BitstampIcon from "../../assets/images/icons/Bitstamp.jpg";
import krakanIcon from "../../assets/images/icons/krakan.svg";
import KuCoinIcon from "../../assets/images/icons/kucoin.svg";
import OkxIcon from "../../assets/images/icons/okx.jpg";

import { EmultionSidebarIcon } from "../../assets/images/icons";
import WalletIconBtn from "../../assets/images/icons/wallet_icon.svg";
import CustomButton from "../../utils/form/CustomButton";

class EmulationsTradeModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: props.show,
      onHide: props.onHide,
      connectExchangesList: [
        {
          name: "Binance",
          code: "BINANCE",
          icon: BinanceIcon,
          isActive: false,
          isOAuth: false,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
        },
        {
          name: "Coinbase",
          code: "COINBASE",
          icon: CoinbaseIcon,
          isActive: false,
          isOAuth: true,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
        },
        {
          name: "Kraken",
          code: "KRAKEN",
          icon: krakanIcon,
          isActive: false,
          isOAuth: false,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
        },
        {
          name: "Kucoin",
          code: "KUCOIN",
          icon: KuCoinIcon,
          isActive: false,
          isOAuth: false,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
        },
        {
          name: "OKX",
          code: "OKX",
          icon: OkxIcon,
          isActive: false,
          isOAuth: false,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
        },

        {
          name: "Bitstamp",
          code: "BITSTAMP",
          icon: BitstampIcon,
          isActive: false,
          isOAuth: false,
          apiKey: "",
          apiSecretKey: "",
          connectionName: "",
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
        className="exit-overlay-form"
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
                {this.state.connectExchangesList.map((item) => {
                  return (
                    <Col md={4}>
                      <div
                        className="connect-div"
                        onClick={() => this.handleSelect(item)}
                      >
                        <div className="img-wrapper">
                          <Image src={item.icon} />
                        </div>
                        <div>
                          <h3 className="inter-display-medium f-s-16 lh-19 ">
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
