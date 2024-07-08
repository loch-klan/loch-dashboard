import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
// import closeIcon from '../../assets/images/icons/close-icon.svg'
import { connect } from "react-redux";
import closeIcon from "../../assets/images/icons/dummyX.svg";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form";
import { deleteAccount, updateAccountName } from "./Api.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";
class EditWalletExchange extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletNickname: props.nickname ? props.nickname : "",
      prevNickname: props.nickname ? props.nickname : "",
      walletMetaData: props.walletMetaData ? props.walletMetaData : "",
      isMobile: mobileCheck(),
    };
  }

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  onValidSubmit = () => {
    let data = new URLSearchParams();
    data.append("exchange", this.state.walletMetaData?.name);
    data.append("account_name", this.state.walletNickname);
    updateAccountName(data, this);

    // EditSpecificWallet({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   wallet_type_selected: walletType?.name,
    //   name_tag: this.state.walletNickname,
    //   address: this.state.walletAddress,
    //   ENS: this.state.walletAddress,
    //   blockchains_detected: blockchains,
    // });

    //analytic for add tag

    // if (this.state.walletNickname !== this.state.prevNickname) {
    //   this.setState({
    //     prevTag: this.state.walletTag,
    //   });
    //   AddNameTag({
    //     session_id: getCurrentUser().id,
    //     email_address: getCurrentUser().email,
    //     wallet_type_selected: walletType?.name,
    //     name_tag: this.state.walletNickname,
    //     address: this.state.walletAddress,
    //     ENS: this.state.walletAddress,
    //     blockchains_detected: blockchains,
    //   });
    // }
  };

  handleDelete = () => {
    // const walletType = this.state.walletNameList.find(
    //   (e) => e.id === this.state.walletName
    // );

    // DeleteWallet({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   wallet_type_selected: walletType?.name,
    //   name_tag: this.state.walletNickname,
    //   address: this.state.walletAddress,
    //   ENS: this.state.walletAddress,
    //   blockchains_detected: blockchains,
    // });
    let data = new URLSearchParams();
    data.append("exchange", this.state.walletMetaData?.name);
    data.append("account_name", this.state.walletNickname);
    deleteAccount(data, this);
  };

  toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (val) {
        return val.slice(0, 1).toUpperCase() + val.slice(1);
      })
      .join(" ");
  };
  render() {
    const { walletMetaData, walletNickname } = this.state;
    const { show, handleClose, onHide } = this.props;

    return (
      <Modal
        show={show}
        onClick={handleClose}
        className={`edit-wallet-form ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        onHide={onHide}
        size="lg"
        dialogClassName={"edit-wallet-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="editmodal"
      >
        <Modal.Header
          style={{
            backgroundColor: walletMetaData?.color || "#0d0d0d",
          }}
        >
          <Image
            src={walletMetaData?.symbol || unrecognizedIcon}
            className="walletIcon"
          />
          <h3
            className="inter-display-medium f-s-16 m-t-5"
            style={{ color: "#ffffff" }}
          >
            {this.toTitleCase(walletMetaData.name)}
          </h3>
          <div className="closebtn" onClick={onHide}>
            <Image src={closeIcon} />
          </div>
          <div className="triangle-up"></div>
        </Modal.Header>
        <Modal.Body>
          <div className="edit-wallet-body">
            <Form onValidSubmit={this.onValidSubmit}>
              <div className="edit-form">
                <FormElement
                  valueLink={this.linkState(this, "walletNickname")}
                  label="Connection name"
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Connection name",
                    },
                  }}
                  classes={{
                    inputField: "tag-input",
                  }}
                />
                <div className="edit-btns">
                  <Button
                    className="inter-display-semi-bold f-s-16 lh-19 m-r-24 delete-btn"
                    onClick={this.handleDelete}
                  >
                    Delete wallet
                  </Button>
                  <Button className="primary-btn" type="submit">
                    Save changes
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  walletState: state.WalletState,
});
const mapDispatchToProps = {
  updateAccountName,
  deleteAccount,
};
EditWalletExchange.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletExchange);
