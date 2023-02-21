import React from 'react'
import { connect } from 'react-redux';
import { Modal, Image, Button, Row, Col, Container } from 'react-bootstrap';
import {Form, FormElement, FormValidator, BaseReactComponent, CustomTextControl} from '../../utils/form'
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import BinanceIcon from "../../assets/images/icons/Binance.svg";
import CoinbaseIcon from "../../assets/images/icons/coinbase.svg";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import backIcon from "../../assets/images/icons/back-icon.svg";
import Slider from 'react-slick';
import { addUpdateAccount, getUserAccount } from '../cost/Api';
import {getExchangeBalance } from "../Portfolio/Api";

class ConnectModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1.03,
      slidesToScroll: 1,
      nextArrow: <Image src={nextIcon} />,
      prevArrow: <Image src={prevIcon} />,
    };
    this.state = {
      settings,
      show: props.show,
      onHide: props.onHide,
      connectionName: "",
      apiKey: "",
      apiSecret: "",
      connectExchangesList: [
        {
          name: "Binance",
          icon: BinanceIcon,
        },
        {
          name: "Coinbase",
          icon: CoinbaseIcon,
        },
      ],
      selection: null,
    };
  }

  handleSelect = (item) => {
    this.setState({ selection: item }, () => {
      this.getUserConnectExchange();
    });
  };
  handleBack = () => {
    this.setState({ selection: null });
  };

  getUserConnectExchange = () => {
    let data = new URLSearchParams();

    data.append("exchange", this.state.selection.name.toLowerCase());

    getUserAccount(data, this);
  };

  handleConnect = () => {
    // console.log("Hey");
    if (
      this.state.apiKey &&
      this.state.connectionName &&
      this.state.apiSecret
    ) {
      let data = new URLSearchParams();

      data.append("exchange", this.state.selection.name.toLowerCase());
      data.append("account_name", this.state.connectionName);
      data.append("api_secret", this.state.apiSecret);
      data.append("api_key", this.state.apiKey);

      addUpdateAccount(data, this);
    }
  };

  showBinanceSteps = () => {
    return (
      <Slider {...this.state.settings}>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 1
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Login to your <b>Binance</b> account on your computer
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 2
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click on <b>API Management</b> from your Profile icon dropdown
              menu on the top right
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 3
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              In <b>Give the API Key a Label</b> field type in what you want to
              call it, ex. <b>Loch Binance</b>, then click <b>Create</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 4
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Input your <b>Google Authentication Code</b> (2FA) for Binance
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 5
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Open your verification email Binance sent you and click{" "}
              <b>Confirm new API key</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 6
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              You can either scan the <b>QR code</b> with the <b>Loch</b> app by
              tapping <b>Scan QR Code</b> below and pointing the camera at the{" "}
              <b>QR code</b> on the screen, or manually copy/paste your{" "}
              <b>API</b> and <b>Secret Keys</b> into the app
            </p>
          </div>
        </div>
      </Slider>
    );
  };

  showCoinbaseSteps = () => {
    return (
      <Slider {...this.state.settings}>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 1
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Login to your <b>Coinbase</b> account
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 2
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click on your <b>Profile icon</b> and go to the <b>Settings</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 3
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              In Settings open <b>API Tab</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 4
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click on <b>New API Key</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 5
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Enable the <b>2FA</b>
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 6
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Set permissions for your account <b>API</b>, it's recommended to
              check all 'read' permission checkboxes
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 7
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Click <b>Create</b> on the bottom right corner
            </p>
          </div>
        </div>
        <div>
          <div className="steps">
            <h6 className="inter-display-semibold f-s-10 lh-12 grey-969">
              STEP 8
            </h6>
            <p className="inter-display-medium f-s-14 lh-16">
              Copy/paste your <b>API</b> and <b>Secret Keys</b> into the app
            </p>
          </div>
        </div>
      </Slider>
    );
  };

  render() {
    const { selection } = this.state;
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal connect-exchange"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          {selection && (
            <Image
              className="back-icon cp"
              src={backIcon}
              onClick={this.handleBack}
            />
          )}
          {selection ? (
            <Image src={selection.icon} className="connect-icon" />
          ) : (
            <div className="api-modal-header">
              <Image src={this.props.iconImage} />
            </div>
          )}
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          {selection ? (
            <div className="connect-modal-body">
              <div className="connect-head">
                <h6 className="inter-display-medium f-s-25 lh-30 m-b-8 black-191">
                  Connecting to {selection.name}
                </h6>
              </div>
              <div className="selection-wrapper">
                <Container>
                  <Row>
                    <Col sm={6}>
                      <div className="exchange-form">
                        <Form>
                          <FormElement
                            valueLink={this.linkState(this, "connectionName")}
                            label="Connection name"
                            control={{
                              type: CustomTextControl,
                              settings: {
                                placeholder: "Enter here",
                              },
                            }}
                            classes={{
                              inputField:
                                this.state.connectionName !== "" ? "done" : "",
                            }}
                          />
                          <FormElement
                            valueLink={this.linkState(this, "apiKey")}
                            label="API Key"
                            control={{
                              type: CustomTextControl,
                              settings: {
                                placeholder: "Enter here",
                              },
                            }}
                            classes={{
                              inputField:
                                this.state.apiKey !== "" ? "done" : "",
                            }}
                          />
                          <FormElement
                            valueLink={this.linkState(this, "apiSecret")}
                            label="API Secret"
                            control={{
                              type: CustomTextControl,
                              settings: {
                                placeholder: "Enter here",
                              },
                            }}
                            classes={{
                              inputField:
                                this.state.apiSecret !== "" ? "done" : "",
                            }}
                          />
                        </Form>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="connect-steps">
                        <h4 className="inter-display-medium f-s-13 lh-16 grey-313 m-b-12">
                          How to connect
                        </h4>
                        {selection.name === "Binance"
                          ? this.showBinanceSteps()
                          : this.showCoinbaseSteps()}
                        <Button
                          className="primary-btn connect-btn"
                          onClick={this.handleConnect}
                        >
                          Connect
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          ) : (
            <div className="connect-modal-body">
              <div className="connect-head">
                <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                  {this.props.headerTitle}
                </h6>
                <p className="inter-display-medium f-s-16 lh-19 grey-969 sub-heading">
                  Connect your exchange(s) securely and privately for more
                  accurate analysis.
                </p>
              </div>
              <div className="connect-wrapper">
                {this.state.connectExchangesList.map((item) => {
                  return (
                    <div
                      className="connect-div"
                      onClick={() => this.handleSelect(item)}
                    >
                      <Image src={item.icon} />
                      <h3 className="inter-display-medium f-s-16 lh-19 ">
                        {item.name}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
  getExchangeBalance
};
ConnectModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectModal);