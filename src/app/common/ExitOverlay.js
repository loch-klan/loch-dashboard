import React from 'react'
import BaseReactComponent from './../../utils/form/BaseReactComponent';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import ExitOverlayIcon from '../../assets/images/icons/ExitOverlayWalletIcon.svg'
import Form from '../../utils/form/Form'
import FormElement from '../../utils/form/FormElement'
import FormValidator from './../../utils/form/FormValidator';
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import CustomTextControl from './../../utils/form/CustomTextControl';
import InfoIcon from "../../assets/images/icons/info-icon.svg";
// import EditBtnImage from "../../assets/images/icons/EditBtnImage.svg";
// import Dropdown from '../common/DropDown.js';
import CopyLink from '../../assets/images/icons/CopyLink.svg';
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ShareLink from '../../assets/images/icons/ShareLink.svg'
import {exportDataApi, fixWalletApi} from './Api.js'
import { BASE_URL_S3 } from '../../utils/Constant';
import { toast } from 'react-toastify';
import ApiModalFrame from '../../assets/images/apiModalFrame.svg';
import nextIcon from '../../assets/images/icons/next.svg'
import next2Icon from '../../assets/images/icons/next2.svg'
import prevIcon from '../../assets/images/icons/prev.svg'
import prev2Icon from '../../assets/images/icons/prev2.svg'
import { getCurrentUser } from "../../utils/ManageToken";
import {

  ExportDataDownlaod,
  LeaveEmailAdded,
  LeaveLinkCopied,
  LeaveLinkShared,
  LeavePrivacyMessage,
} from "../../utils/AnalyticsFunctions.js";
import { DatePickerControl } from '../../utils/form';
import moment from 'moment';
import lochClean from "../../assets/images/LochClean.gif";
import { CurrencyType, loadingAnimation } from '../../utils/ReusableFunctions';

class ExitOverlay extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    this.state = {
      dummyUser,
      show: props.show,
      link: `${BASE_URL_S3}portfolio/${dummyUser}`,
      isactive: false,
      email: "",
      dropdowntitle: "View and edit",
      activeli: "View and edit",
      onHide: props.onHide,
      showRedirection: false,
      fromDate: startDate,
      toDate: new Date(),
      selectedExportItem:{
        name: "Transaction History",
        value: 10,
        apiurl: "wallet/transaction/export-transactions",
        fileName:"transaction-history-export"
      },
      loadingExportFile:false,
      exportItem:[
        {
          name: "Transaction History",
          value: 10,
          apiurl: "wallet/transaction/export-transactions",
          fileName:"transaction-history-export"
        },
        {
          name: "Blockchain Gas Costs",
          value: 20,
          apiurl: "wallet/transaction/export-gas-fee-overtime",
          fileName:"blockchain-gas-costs-export"
        },
        {
          name: "Counterparty Costs",
          value: 30,
          apiurl: "wallet/transaction/export-counter-party-volume-traded",
          fileName:"counterparty-costs-export"
        },
        // {
        //   name: "Average Cost Basis",
        //   value: 40,
        // },
        // {
        //   name: "Portfolio Performance",
        //   value: 50,
        // },
      ]
    };
  }

  copyLink = () => {
    navigator.clipboard.writeText(this.state.link);
     toast.success("Share link has been copied");
    LeaveLinkCopied({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  handleSave = () => {
    let email_arr = [];
    let data = JSON.parse(localStorage.getItem("addWallet"));
    if (data) {
      data.map((info) => {
        email_arr.push(info.address);
      });
      const url = new URLSearchParams();
      url.append("email", this.state.email);
      // url.append("wallet_addresses", JSON.stringify(email_arr));
      fixWalletApi(this, url);
      LeaveEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
      });
    }
  };
  handleRedirection = () => {
    // console.log("this", this.props);
    this.setState({ show: false, showRedirection: true });
    this.props.handleRedirection();
  };
  handleSelect = (e) => {
    // console.log(e);
    this.setState({
      dropdowntitle: e,
      activeli: e,
    });
  };

  shareLink = () => {
    LeaveLinkShared({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };

  leavePrivacy = () => {
    LeavePrivacyMessage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // console.log("on hover privacy msg");
  };

  handleFromDate = () => {
    this.setState({ toDate: "" });
  };

  handleExportNow = ()=>{
    // console.log('Export');
    this.setState({loadingExportFile : true})
    const data = new URLSearchParams();
    data.append("currency_code", CurrencyType(true));
    data.append("start_datetime", moment(this.state.fromDate).format("X"));
    data.append("end_datetime", moment(this.state.toDate).format("X"));
    ExportDataDownlaod({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      date_range_selected: [
        moment(this.state.fromDate).format("DD MMMM YY") + " to " +
        moment(this.state.toDate).format("DD MMMM YY"),
      ],
      data_exported: this.state.selectedExportItem.fileName,
    });
    // console.log(
    //   "date range",
    //   moment(this.state.fromDate).format("DD MMMM YY"),
    //   moment(this.state.toDate).format("DD MMMM YY")
    // );
    exportDataApi(data, this);

  }

  handleSelectedExportItem = (item,e) => {
    e.currentTarget.classList.add('active')
    this.setState({selectedExportItem:item})
  }

  submit = () =>{
    console.log('Hey');
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        {this.state.showRedirection &&
          toast.success(
            <div className="custom-toast-msg">
              <div>Successful</div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                Please check your mailbox for the verification link
              </div>
            </div>
          )}
        <Modal.Header>
          {this.props.modalType === "apiModal" ||
          this.props.modalType === "exportModal" ? (
            <div className="api-modal-header">
              <Image src={this.props.iconImage} />
            </div>
          ) : (
            <div className="exitOverlayIcon">
              <Image src={ExitOverlayIcon} />
            </div>
          )}
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          {this.props.modalType === "apiModal" ||
          this.props.modalType === "exportModal" ||
          this.props.modalType === "cohort" ? (
            <div
              className={
                this.props.modalType === "exportModal"
                  ? "export-modal-body"
                  : "api-modal-body"
              }
            >
              <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                {this.props.headerTitle}
              </h6>
              <p className="inter-display-regular f-s-13 lh-16 grey-B0B">
                {this.props.modalType === "apiModal"
                  ? "Personalized digital asset intelligence via API"
                  : "Export your exisiting data from Loch"}
              </p>
              {this.props.modalType === "apiModal" ? (
                <div className="api-modal-frame">
                  <Image src={ApiModalFrame} />
                  <p className="inter-display-regular f-s-13 lh-16 black-191">
                    This feature is coming soon
                  </p>
                </div>
              ) : this.props.modalType === "exportModal" ? (
                <div className="export-body">
                  <div className="export-timeline">
                    <Form onValidSubmit={this.submit}>
                      <div className="timeline-wrapper">
                        <span className="inter-display-medium f-s-16 lh-19 black-191">
                          Export data from{" "}
                        </span>
                        <FormElement
                          valueLink={this.linkState(
                            this,
                            "fromDate",
                            this.handleFromDate
                          )}
                          required
                          validations={[
                            {
                              validate: FormValidator.isRequired,
                              message: "From date cannot be empty",
                            },
                          ]}
                          control={{
                            type: DatePickerControl,
                            settings: {
                              placeholder: "From Date",
                              showDateIcon: false,
                              nextLabel: (
                                <Image
                                  className="date-navigator-icons-next"
                                  src={nextIcon}
                                />
                              ),
                              next2Label: (
                                <Image
                                  className="date-navigator-icons"
                                  src={next2Icon}
                                />
                              ),
                              prevLabel: (
                                <Image
                                  className="date-navigator-icons-next"
                                  src={prevIcon}
                                />
                              ),
                              prev2Label: (
                                <Image
                                  className="date-navigator-icons"
                                  src={prev2Icon}
                                />
                              ),
                            },
                          }}
                        />
                        <span className="inter-display-medium f-s-16 lh-19 black-191">
                          to
                        </span>
                        <FormElement
                          valueLink={this.linkState(this, "toDate")}
                          required
                          validations={[
                            {
                              validate: FormValidator.isRequired,
                              message: "To date cannot be empty",
                            },
                          ]}
                          control={{
                            type: DatePickerControl,
                            settings: {
                              placeholder: "To Date",
                              minDate: this.state.fromDate || new Date(),
                              showDateIcon: false,
                              nextLabel: (
                                <Image
                                  className="date-navigator-icons-next"
                                  src={nextIcon}
                                />
                              ),
                              next2Label: (
                                <Image
                                  className="date-navigator-icons"
                                  src={next2Icon}
                                />
                              ),
                              prevLabel: (
                                <Image
                                  className="date-navigator-icons-next"
                                  src={prevIcon}
                                />
                              ),
                              prev2Label: (
                                <Image
                                  className="date-navigator-icons"
                                  src={prev2Icon}
                                />
                              ),
                            },
                          }}
                        />
                      </div>
                    </Form>
                  </div>
                  <div className="export-item-wrapper">
                    {this.state.exportItem.map((item) => {
                      return (
                        <span
                          className={
                            this.state.selectedExportItem.value === item.value
                              ? "inter-display-medium f-s-16 lh-19 grey-636 export-item active"
                              : `inter-display-medium f-s-16 lh-19 grey-636 export-item`
                          }
                          onClick={(e) =>
                            this.handleSelectedExportItem(item, e)
                          }
                        >
                          {item.name}
                        </span>
                      );
                    })}
                    {/* <span className={`inter-display-medium f-s-16 lh-19 grey-636 export-item active`}>Transaction history</span> */}
                  </div>
                  {/* <Button className='primary-btn' onClick={()=>this.handleExportNow()} >Export now</Button> */}
                  {/* <div onClick={()=>this.handleExportNow()} > */}
                  {this.state.loadingExportFile === true ? (
                    // <Image src={lochClean} className='loading-export'/>
                    <Button className="primary-btn">
                      {loadingAnimation()}
                    </Button>
                  ) : (
                    <Button
                      className="primary-btn"
                      onClick={() => this.handleExportNow()}
                    >
                      Export Now
                    </Button>
                  )}
                  {/* </div> */}
                </div>
              ) : (
                <div className="exit-overlay-body">
                  
                  <div className="email-section">
                    <Form onValidSubmit={this.handleSave}>
                      <FormElement
                        valueLink={this.linkState(this, "email")}
                        // label="Email Info"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "",
                          },
                          {
                            validate: FormValidator.isEmail,
                            message: "Please enter valid email id",
                          },
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Email",
                          },
                        }}
                      />
                      <div className="save-btn-section">
                        <Button
                          className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                            this.state.email ? "active" : ""
                          }`}
                          type="submit"
                        >
                          Save
                        </Button>
                      </div>
                    </Form>
                  </div>
                  <p className="inter-display-medium f-s-16 lh-19 grey-ADA m-b-20">
                    or
                  </p>
                  <div className="m-b-24 links">
                    <div className="inter-display-medium f-s-16 lh-19 black-191 linkInfo">
                      {this.state.link}
                    </div>
                    {/* <div className='edit-options'>
                                <Image src={EditBtnImage} className="m-r-8"/>
                                <Dropdown
                                    id="edit-option-dropdown"
                                    title={this.state.dropdowntitle}
                                    list={["View and edit" , "View only"]}
                                    onSelect={this.handleSelect}
                                    activetab = {this.state.activeli}
                                />
                            </div> */}
                  </div>
                  <div className="copy-link-section">
                    <div className="link" onClick={this.copyLink}>
                      <Image src={CopyLink} className="m-r-8" />
                      <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                        Copy link
                      </h3>
                    </div>
                    <div
                      className="link"
                      onClick={() => {
                        this.props.history.push("/welcome");
                      }}
                      style={{ marginLeft: "4rem" }}
                    >
                      <h3 className="inter-display-medium f-s-16 lh-19 grey-969">
                        No thanks, let me leave
                      </h3>
                    </div>
                    {/* <div className="link" onClick={this.shareLink}>
                  <Image src={ShareLink} className="m-r-8" />
                  <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                    Share
                  </h3>
                </div> */}
                  </div>

                  <div className="m-b-36 footer">
                    <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                      At Loch, we care intensely about your privacy and
                      anonymity.
                    </p>
                    <CustomOverlay
                      text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                      position="top"
                      isIcon={true}
                      IconImage={LockIcon}
                      isInfo={true}
                      className={"fix-width"}
                    >
                      <Image
                        src={InfoIcon}
                        className="info-icon"
                        onMouseEnter={this.leavePrivacy}
                      />
                    </CustomOverlay>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="exit-overlay-body">
              <h6 className="inter-display-medium f-s-20 lh-24 ">
                Don’t lose your data
              </h6>
              <p className="inter-display-medium f-s-16 lh-19 grey-7C7">
                Access your data again through the unique reusable link,
              </p>
              <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24">
                or link your email
              </p>
              <div className="email-section">
                <Form onValidSubmit={this.handleSave}>
                  <FormElement
                    valueLink={this.linkState(this, "email")}
                    // label="Email Info"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "",
                      },
                      {
                        validate: FormValidator.isEmail,
                        message: "Please enter valid email id",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Email",
                      },
                    }}
                  />
                  <div className="save-btn-section">
                    <Button
                      className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                        this.state.email ? "active" : ""
                      }`}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </div>
              <p className="inter-display-medium f-s-16 lh-19 grey-ADA m-b-20">
                or
              </p>
              <div className="m-b-24 links">
                <div className="inter-display-medium f-s-16 lh-19 black-191 linkInfo">
                  {this.state.link}
                </div>
                {/* <div className='edit-options'>
                                <Image src={EditBtnImage} className="m-r-8"/>
                                <Dropdown
                                    id="edit-option-dropdown"
                                    title={this.state.dropdowntitle}
                                    list={["View and edit" , "View only"]}
                                    onSelect={this.handleSelect}
                                    activetab = {this.state.activeli}
                                />
                            </div> */}
              </div>
              <div className="copy-link-section">
                <div className="link" onClick={this.copyLink}>
                  <Image src={CopyLink} className="m-r-8" />
                  <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                    Copy link
                  </h3>
                </div>
                <div
                  className="link"
                  onClick={() => {
                    this.props.history.push("/welcome");
                  }}
                  style={{ marginLeft: "4rem" }}
                >
                  <h3 className="inter-display-medium f-s-16 lh-19 grey-969">
                    No thanks, let me leave
                  </h3>
                </div>
                {/* <div className="link" onClick={this.shareLink}>
                  <Image src={ShareLink} className="m-r-8" />
                  <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                    Share
                  </h3>
                </div> */}
              </div>

              <div className="m-b-36 footer">
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                  At Loch, we care intensely about your privacy and anonymity.
                </p>
                <CustomOverlay
                  text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                  position="top"
                  isIcon={true}
                  IconImage={LockIcon}
                  isInfo={true}
                  className={"fix-width"}
                >
                  <Image
                    src={InfoIcon}
                    className="info-icon"
                    onMouseEnter={this.leavePrivacy}
                  />
                </CustomOverlay>
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
  fixWalletApi
}
ExitOverlay.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitOverlay);