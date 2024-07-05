import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
// import closeIcon from '../../assets/images/icons/close-icon.svg'
import { connect } from "react-redux";
import closeIcon from "../../assets/images/icons/dummyX.svg";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import {
  AddNameTag,
  DeleteWallet,
  EditSpecificWallet,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { lightenDarkenColor, mobileCheck } from "../../utils/ReusableFunctions";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
  SelectControl,
} from "../../utils/form";
import {
  deleteWallet,
  getAllWalletApi,
  getAllWalletListApi,
  updateWalletApi,
} from "./Api.js";
class EditWalletModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      createdOn: props.createdOn,
      walletAddress: props.walletAddress,
      displayAddress: props.displayAddress
        ? props.displayAddress
        : props.walletAddress,
      walletName: props.walletMetaData
        ? props.walletMetaData.id
        : "634650d88e5d5d3da6a78ccf",
      walletNickname: props.nickname ? props.nickname : "",
      walletMetaData: props.walletMetaData,
      walletNameList: [],
      dropDownActive: {},
      coinchips: props.coinchips,
      prevNickname: props.nickname ? props.nickname : "",
    };
  }

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
    getAllWalletApi(this);
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  onValidSubmit = () => {
    let data = new URLSearchParams();
    data.append("wallet_address", this.state.walletAddress);
    data.append("wallet_id", this.state.walletName);
    data.append("nickname", this.state.walletNickname);
    updateWalletApi(this, data);

    const walletType = this.state.walletNameList.find(
      (e) => e.id === this.state.walletName
    );
    // console.log("walletType", walletType);
    // console.log("wallet name", walletType?.name);
    // console.log("wallet address", this.state.walletAddress);
    // console.log("wallet tag", this.state.walletTag);
    const blockchains =
      this.state.coinchips && this.state.coinchips.map((e) => e.chain.code);
    // console.log("Blockchain", blockchains);
    EditSpecificWallet({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      wallet_type_selected: walletType?.name,
      name_tag: this.state.walletNickname,
      address: this.state.walletAddress,
      ENS: this.state.walletAddress,
      blockchains_detected: blockchains,
    });

    //analytic for add tag

    if (this.state.walletNickname !== this.state.prevNickname) {
      this.setState({
        prevTag: this.state.walletTag,
      });
      AddNameTag({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        wallet_type_selected: walletType?.name,
        name_tag: this.state.walletNickname,
        address: this.state.walletAddress,
        ENS: this.state.walletAddress,
        blockchains_detected: blockchains,
      });
    }
  };

  handleDelete = () => {
    const walletType = this.state.walletNameList.find(
      (e) => e.id === this.state.walletName
    );
    // console.log("wallet", walletType);
    //      console.log("wallet name", walletType?.name);
    //  console.log("wallet address", this.state.walletAddress);
    //  console.log("wallet tag", this.state.walletTag);
    const blockchains =
      this.state.coinchips && this.state.coinchips.map((e) => e.chain.code);
    //  console.log("Blockchain", blockchains);
    DeleteWallet({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      wallet_type_selected: walletType?.name,
      name_tag: this.state.walletNickname,
      address: this.state.walletAddress,
      ENS: this.state.walletAddress,
      blockchains_detected: blockchains,
    });
    let data = new URLSearchParams();
    data.append("wallet_address", this.state.walletAddress);
    deleteWallet(this, data);
  };

  getDays = (dateString) => {
    // console.log("date", dateString);
    // const date = new Date();
    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let today = `${year}-${month}-${day}`;
    // return (
    //   (new Date(today).getTime() - new Date(d.split(" ")[0]).getTime()) /
    //   (1000 * 3600 * 24)
    // );
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = Math.abs(now - date);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };
  render() {
    const chips = this.state.coinchips.map((e, index) => {
      return (
        <div className="chipcontainer" key={index}>
          <Image
            src={e.chain.symbol}
            style={{
              border: `1px solid ${lightenDarkenColor(e.chain.color, -0.15)} `,
            }}
          />
          <div className="inter-display-medium f-s-13 lh-16">
            {e.chain.name}
          </div>
        </div>
      );
    });
    const { walletMetaData, walletNameList, walletName } = this.state;
    const { show, handleClose, onHide } = this.props;
    let walletIcon, walletBdColor;
    walletNameList.map((item) => {
      if (item.id === walletName) {
        return (walletIcon = item.symbol), (walletBdColor = item.color);
      }
    });
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
          style={{ backgroundColor: walletBdColor ? walletBdColor : "#0d0d0d" }}
        >
          <Image
            src={walletIcon ? walletIcon : unrecognizedIcon}
            className="walletIcon"
          />
          <div className="closebtn" onClick={onHide}>
            <Image src={closeIcon} />
          </div>
          <div className="triangle-up"></div>
        </Modal.Header>
        <Modal.Body>
          <div className="edit-wallet-body">
            <Form onValidSubmit={this.onValidSubmit}>
              <FormElement
                valueLink={this.linkState(this, "walletName")}
                required
                validations={[
                  {
                    validate: FormValidator.isRequired,
                    message: "Please select a wallet name",
                  },
                ]}
                control={{
                  type: SelectControl,
                  settings: {
                    placeholder: "Select wallet type",
                    options: walletNameList,
                    multiple: false,
                    searchable: true,
                    onChangeCallback: (onBlur) => {
                      onBlur(this.state.walletName);
                    },
                  },
                }}
              />
              <p className="inter-display-regular f-s-13 lh-16 m-b-16 subtitle">{`added ${this.getDays(
                this.state.createdOn
              ).toFixed(0)} ${
                this.getDays(this.state.createdOn).toFixed(0) > 1
                  ? "days"
                  : "day"
              } ago`}</p>
              <div className="m-b-32 coinchips">{chips}</div>
              <div className="edit-form input-noshadow-dark">
                <FormElement
                  valueLink={this.linkState(this, "displayAddress")}
                  label="Wallet Address"
                  disabled
                  control={{
                    type: CustomTextControl,
                  }}
                  classes={{
                    inputField: "disabled-input",
                  }}
                />
                <FormElement
                  valueLink={this.linkState(this, "walletNickname")}
                  label="Wallet Nickname"
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "My main wallet",
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
                  <Button
                    className="primary-btn main-button-invert"
                    type="submit"
                  >
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
  updateWalletApi,
  getAllWalletListApi,
  deleteWallet,
};
EditWalletModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletModal);
