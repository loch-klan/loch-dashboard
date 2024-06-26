import moment from "moment";
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ApiModalFrame from "../../../assets/images/apiModalFrame.svg";
import CopyLink from "../../../assets/images/icons/CopyLink.svg";
import EmailNotFoundCross from "../../../assets/images/icons/EmailNotFoundCross.svg";
import ExitOverlayIcon from "../../../assets/images/icons/ExitOverlayWalletIcon.svg";
import BackIcon from "../../../assets/images/icons/backIcon.svg";
import CheckIcon from "../../../assets/images/icons/check-upgrade.svg";
import CloseIcon from "../../../assets/images/icons/dummyX.svg";
import FileIcon from "../../../assets/images/icons/file-text.svg";
import InfoIcon from "../../../assets/images/icons/info-icon.svg";
import LockIcon from "../../../assets/images/icons/lock-icon.svg";
import nextIcon from "../../../assets/images/icons/next.svg";
import next2Icon from "../../../assets/images/icons/next2.svg";
import PlusIcon from "../../../assets/images/icons/plus-icon-grey.svg";
import prevIcon from "../../../assets/images/icons/prev.svg";
import prev2Icon from "../../../assets/images/icons/prev2.svg";
import DeleteIcon from "../../../assets/images/icons/trashIcon.svg";
import {
  ExportDataDownlaod,
  ExportDateSelected,
  FollowSignUpPopupEmailAdded,
  LeaveLinkCopied,
  LeaveLinkShared,
  LeavePrivacyMessage,
  MenuLetMeLeave,
  PodName,
  WhalePodAddTextbox,
  WhalePodAddressDelete,
  WhalePodUploadFile,
  resetUser,
  signInUser,
} from "../../../utils/AnalyticsFunctions.js";
import { BASE_URL_S3 } from "../../../utils/Constant";
import { getCurrentUser } from "../../../utils/ManageToken";
import {
  CurrencyType,
  loadingAnimation,
} from "../../../utils/ReusableFunctions";
import CustomChip from "../../../utils/commonComponent/CustomChip";
import CustomOverlay from "../../../utils/commonComponent/CustomOverlay";
import {
  BaseReactComponent,
  DatePickerControl,
  Form,
  FormElement,
  FormValidator,
} from "../../../utils/form";
import { exportDataApi, fixWalletApi } from "../../common/Api.js";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../../onboarding//Api";
import CustomTextControl from ".././../../utils/form/CustomTextControl";

import Papa from "papaparse";
import UploadIcon from "../../../assets/images/icons/upgrade-upload.svg";
import { notificationSend } from "../../cohort/Api";
import { updateUser } from "../../profile/Api";

class FollowExitOverlay extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = window.localStorage.getItem("lochDummyUser");
    let startDate = moment().subtract(1, "month").toDate();

    // console.log("props add", props?.walletaddress);

    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : getCurrentUser().id;

    this.state = {
      // create account for cohort
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || dummyUser || "",

      dummyUser,
      show: props.show,
      sharelink: `${BASE_URL_S3}home/${slink}`,
      isactive: false,
      email: "",
      dropdowntitle: "View and edit",
      activeli: "View and edit",
      onHide: props.onHide,
      showRedirection: false,
      fromDate: startDate,
      toDate: new Date(),
      selectedExportItem: {
        name: "Transaction History",
        value: 10,
        apiurl: "wallet/transaction/export-transactions",
        fileName: "transaction-history-export",
      },
      loadingExportFile: false,
      exportItem: [
        {
          name: "Transaction History",
          value: 10,
          apiurl: "wallet/transaction/export-transactions",
          fileName: "transaction-history-export",
        },
        {
          name: "Blockchain Gas Costs",
          value: 20,
          apiurl: "wallet/transaction/export-gas-fee-overtime",
          fileName: "blockchain-gas-costs-export",
        },
        {
          name: "Counterparty Costs",
          value: 30,
          apiurl: "wallet/transaction/export-counter-party-volume-traded",
          fileName: "counterparty-costs-export",
        },
        {
          name: "Average Cost Basis",
          value: 40,
          apiurl: "wallet/user-wallet/export-average-cost-basis",
          fileName: "average-cost-basis-export",
        },
        // {
        //   name: "Portfolio Performance",
        //   value: 50,
        // },
      ],
      addWalletList:
        props?.walletaddress && props.isEdit
          ? props?.walletaddress?.map((e, i) => {
              // console.log(e);
              return {
                id: `wallet${i + 1}`,
                address: e?.wallet_address ? e.wallet_address : "",
                displayAddress: e?.display_address ? e.display_address : "",
                wallet_metadata: {},
                coinFound: e?.chains.length > 0 ? true : false,
                coins: e?.chains
                  ? e?.chains.map((e) => {
                      return {
                        chain_detected: true,
                        coinCode: e?.code,
                        coinName: e?.name,
                        coinColor: e?.color,
                        coinSymbol: e?.symbol,
                      };
                    })
                  : [],
              };
            })
          : [
              {
                id: `wallet1`,
                address: "",
                coins: [],
                displayAddress: "",
                wallet_metadata: {},
              },
            ],
      isCohort: true,
      cohort_name: props.isEdit && props?.headerTitle ? props?.headerTitle : "",
      changeList: props.changeWalletList,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      upgradeModal: false,
      isStatic: false,
      hidePrevModal: false,
      triggerId: 0,
      total_addresses: 0,

      // upload csv/txt
      showWarningMsg: false,
      uploadStatus: "Uploading",
      // set pod id when we get response after creating new pod and,
      // call getStatus api until isLoaded true
      podId: null,
      // if this true then show email message and done btn and stop call getStatus api
      emailAdded: false,

      // set false if email added or get Status
      isIndexed: false,
      email_notification: getCurrentUser().email,
      fileName: null,
      isChangeFile: false,
      podnameError: false,
      total_unique_address: 0,
      switchselected: false,
    };
  }

  EmailNotification = () => {
    this.setState(
      {
        // isIndexed: true,
        emailAdded: true,
      },
      () => {
        const data = new URLSearchParams();
        data.append("cohort_id", this.state.podId);
        notificationSend(data, this);
      }
    );
  };

  getPodStatusFunction = () => {};

  handleDone = () => {
    this.props.apiResponse(true);
    this.state.onHide();
    this.state.changeList && this.state.changeList();
  };
  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
        hidePrevModal: !this.state.upgradeModal,
        isIndexed: false,
        fileName: null,
        isChangeFile: false,
        total_unique_address: 0,
        showWarningMsg: false,
        uploadStatus: "Uploading",
        userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      },
      () => {
        // this.setState({
        //   hidePrevModal: this.state.upgradeModal,
        // });
      }
    );
  };
  fileInputRef = React.createRef();
  pasteInput = React.createRef();

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
    this.props.getAllCoins();
    this.props.getAllParentChains();
    if (this.props.selectExportOption) {
      const selectedItem = this.props.selectExportOption;
      switch (selectedItem) {
        case 1:
          this.setState({
            selectedExportItem: {
              name: "Transaction History",
              value: 10,
              apiurl: "wallet/transaction/export-transactions",
              fileName: "transaction-history-export",
            },
          });
          break;
        case 2:
          this.setState({
            selectedExportItem: {
              name: "Blockchain Gas Costs",
              value: 20,
              apiurl: "wallet/transaction/export-gas-fee-overtime",
              fileName: "blockchain-gas-costs-export",
            },
          });
          break;
        case 3:
          this.setState({
            selectedExportItem: {
              name: "Counterparty Costs",
              value: 30,
              apiurl: "wallet/transaction/export-counter-party-volume-traded",
              fileName: "counterparty-costs-export",
            },
          });
          break;
        case 4:
          this.setState({
            selectedExportItem: {
              name: "Average Cost Basis",
              value: 40,
              apiurl: "wallet/user-wallet/export-average-cost-basis",
              fileName: "average-cost-basis-export",
            },
          });
          break;
        default:
          this.setState({
            selectedExportItem: {
              name: "Transaction History",
              value: 10,
              apiurl: "wallet/transaction/export-transactions",
              fileName: "transaction-history-export",
            },
          });
      }
    }
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  onDataSelected = () => {
    ExportDateSelected({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      date_range_selected:
        moment(this.state.fromDate).format("DD MMMM YY") +
        " to " +
        moment(this.state.toDate).format("DD MMMM YY"),
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

  addAddress = () => {
    // console.log("us", this.state.addWalletList.length ,
    //   this.props.total_addresses ,

    //   this.props.totalEditAddress);
    let total = this.props.isEdit
      ? this.state.addWalletList.length +
        this.props.total_addresses +
        1 -
        this.props.totalEditAddress
      : this.state.addWalletList.length + this.props.total_addresses + 1;

    if (
      total <= this.state.userPlan?.wallet_address_limit ||
      this.state.userPlan?.wallet_address_limit === -1
    ) {
      this.state.addWalletList.push({
        id: `wallet${this.state.addWalletList.length + 1}`,
        address: "",
        coins: [],
        displayAddress: "",
        wallet_metadata: {},
      });
      this.setState({
        addWalletList: this.state.addWalletList,
        wallet_address: "",
      });

      WhalePodAddTextbox({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else {
      this.setState(
        {
          triggerId: 1,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
  };

  deleteAddress = (index) => {
    // const ad/dress = this.state.addWalletList.at(index).address;
    // if (address !== "") {
    //   this.state.deletedAddress.push(address);
    //   this.setState({
    //     deletedAddress: this.state.deletedAddress,
    //   });
    // }
    // console.log("index", index, this.state.addWalletList)
    WhalePodAddressDelete({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      address: this.state.addWalletList[index]?.address,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
    this.state.addWalletList.splice(index, 1);
    this.state.addWalletList?.map((w, i) => {
      w.id = `wallet${i + 1}`;
    });

    this.setState({
      addWalletList: this.state.addWalletList,
    });
    // console.log("Delete", this.state.addWalletList);
    // console.log("Prev 1", this.state.deletedAddress);
  };

  handleTabPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      // console.log("yab press");
      // your function code here
      this.addAddress();
    }
  };
  handleOnchange = (e) => {
    let { name, value } = e.target;
    // console.log("e", this.state.addWalletList);
    let prevWallets = [...this.state.addWalletList];
    let currentIndex = prevWallets.findIndex((elem) => elem.id === name);
    if (currentIndex > -1) {
      let prevValue = prevWallets[currentIndex].address;
      prevWallets[currentIndex].address = value;
      prevWallets[currentIndex].displayAddress = value;
      if (value === "" || prevValue !== value) {
        prevWallets[currentIndex].coins = [];
      }
    }
    this.setState({
      addWalletList: prevWallets,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 500);
  };

  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          true
        );
      }
    }
  };
  handleSetCoin = (data) => {
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );
    let i = this.state.addWalletList.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.addWalletList];

    data.address === newAddress[i].address &&
      newAddress[i].coins.push(...newCoinList);
    //new code added
    //   if (data.id === newAddress[i].id) {
    //     newAddress[i].address = data.address;
    //   }

    newAddress[i].coinFound =
      newAddress[i].coins &&
      newAddress[i].coins.some((e) => e.chain_detected === true);
    // console.log(
    //   "newAddress",
    //   newAddress,
    //   data.id,
    //   newAddress[i].id,
    //   data.address === newAddress[i].address,
    //   data.address,
    //   newAddress[i].address
    // );
    this.setState({
      addWalletList: newAddress,
    });
  };

  handleCohortSave = () => {};

  handleDeleteCohort = () => {};
  copyLink = () => {
    navigator.clipboard.writeText(this.state.sharelink);
    toast.success("Share link has been copied");
    LeaveLinkCopied({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };
  handleSave = () => {
    if (this.props.modalType === "create_account") {
      // for chort signup and signin
      const data = new URLSearchParams();
      data.append("first_name", this.state.firstName);
      data.append("last_name", this.state.lastName);
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      data.append("mobile", this.state.mobileNumber);
      this.props.updateUser(data, this);
    } else {
      // signUpProperties({
      //   userId: getCurrentUser().id,
      //   email_address: this.state.email,
      //   first_name: "",
      //   last_name: "",
      // });
      // when leave
      signInUser({
        email_address: this.state?.email,
        userId: getCurrentUser().id,
        first_name: "",
        last_name: "",
        track: "following",
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
      let email_arr = [];
      let data = JSON.parse(window.localStorage.getItem("addWallet"));
      if (data) {
        data.map((info) => {
          email_arr.push(info.address);
        });
        const url = new URLSearchParams();
        url.append("email", this.state.email);
        url.append("signed_up_from", "leaving");
        if (this.props.followedAddress) {
          url.append("follow_address", this.props.followedAddress);
        }
        // url.append("wallet_addresses", JSON.stringify(email_arr));
        fixWalletApi(this, url);
        FollowSignUpPopupEmailAdded({
          session_id: getCurrentUser().id,
          email_address: this.state.email,
        });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
      }
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
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

  leavePrivacy = () => {
    LeavePrivacyMessage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
    // console.log("on hover privacy msg");
  };

  handleFromDate = () => {
    this.setState({ toDate: "" });
  };

  handleExportNow = () => {
    // console.log('Export');
    let addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    // console.log("add", addWalletList)
    if (
      addWalletList.length <= this.state.userPlan?.export_address_limit ||
      this.state.userPlan?.export_address_limit === -1
    ) {
      this.setState({ loadingExportFile: true });
      const data = new URLSearchParams();
      data.append("currency_code", CurrencyType(true));
      data.append("start_datetime", moment(this.state.fromDate).format("X"));
      data.append("end_datetime", moment(this.state.toDate).format("X"));
      ExportDataDownlaod({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        date_range_selected: [
          moment(this.state.fromDate).format("DD MMMM YY") +
            " to " +
            moment(this.state.toDate).format("DD MMMM YY"),
        ],
        data_exported: this.state.selectedExportItem.fileName,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
      // console.log(
      //   "date range",
      //   moment(this.state.fromDate).format("DD MMMM YY"),
      //   moment(this.state.toDate).format("DD MMMM YY")
      // );
      exportDataApi(data, this);
    } else {
      this.setState(
        {
          triggerId: 7,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
  };

  handleSelectedExportItem = (item, e) => {
    e.currentTarget.classList.add("active");
    this.setState({ selectedExportItem: item });
  };

  submit = () => {
    // console.log('Hey');
  };

  handleUpload = () => {
    if (this.state.cohort_name != "") {
      this.setState({
        podnameError: false,
      });
      if (this.state.userPlan?.upload_csv) {
        this.fileInputRef.current.click();
      } else {
        this.setState(
          {
            triggerId: 8,
          },
          () => {
            this.upgradeModal();
          }
        );
      }
    } else {
      this.setState({
        podnameError: true,
      });
    }
    // console.log("upload click");
  };

  handleFileSelect = (event) => {
    const file = event.target.files[0];
    const name = event.target.files[0]?.name;

    // console.log(name)

    if (this.state.showWarningMsg) {
      this.setState({
        addWalletList: [
          {
            id: `wallet1`,
            address: "",
            coins: [],
            displayAddress: "",
            wallet_metadata: {},
          },
        ],
        uploadStatus: "Uploading",
        emailAdded: false,
        isIndexed: false,
        isChangeFile: true,
        fileName: name,
      });
    } else {
      this.setState({
        fileName: name,
      });
    }

    if (file.type === "text/csv" || file.type === "text/plain") {
      Papa.parse(file, {
        complete: (results) => {
          this.setState({
            showWarningMsg: true,
          });
          let addressList = [];
          let prevAddressList = [];
          this.state?.addWalletList &&
            this.state?.addWalletList.map((e) => {
              if (e.address !== "" || e.displayAddress != "") {
                prevAddressList.push(e);
              }
            });
          let uploadedAddress = [];
          results?.data?.map((e, i) => {
            uploadedAddress.push(e[0]);
            addressList.push({
              id: `wallet${prevAddressList?.length + (i + 1)}`,
              address: e[0],
              coins: [],
              displayAddress: e[0],
              wallet_metadata: {},
            });
          });

          let total_address = this.props.isEdit
            ? prevAddressList?.length +
              addressList?.length +
              this.props.total_addresses -
              this.props.totalEditAddress
            : prevAddressList?.length +
              addressList?.length +
              this.props.total_addresses;
          if (
            total_address <= this.state.userPlan?.whale_pod_address_limit ||
            this.state.userPlan?.whale_pod_address_limit === -1
          ) {
            WhalePodUploadFile({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              addresses: uploadedAddress,
            });
            if (this.props.updateTimer) {
              this.props.updateTimer();
            }

            this.setState(
              {
                addWalletList: [...prevAddressList, ...addressList],
              },
              () => {
                // call api to store pod
                // this.state.addWalletList?.map((e) =>
                //   this.getCoinBasedOnWalletAddress(e.id, e.address)
                // );
                this.handleCohortSave();
              }
            );
          } else {
            this.setState(
              {
                triggerId: 1,
              },
              () => {
                this.upgradeModal();
              }
            );
          }

          // console.log(results.data, addressList, prevAddressList);
        },
      });
    } else {
      // console.log("Invalid file type. Only CSV and text files are allowed.");
    }
    event.target.value = "";
  };

  handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      // setPasteValue(clipboardText);

      let addressList = this.state.addWalletList;
      //  console.log("paste value", clipboardText, addressList)
      addressList[0]["address"] = clipboardText;
      addressList[0]["displayAddress"] = clipboardText;

      this.setState(
        {
          addWalletList: addressList,
        },
        () => {
          this.getCoinBasedOnWalletAddress(
            addressList[0]["id"],
            addressList[0]["address"]
          );
        }
      );
    } catch (error) {
      console.error("Failed to paste from clipboard: ", error);
    }
  };

  render() {
    return (
      <>
        {!this.state.hidePrevModal && (
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
            animation={
              this.props.modalAnimation !== undefined ||
              this.props.modalAnimation !== null
                ? this.props.modalAnimation
                : true
            }
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
              this.props.modalType === "exportModal" ||
              this.props.modalType === "create_account" ||
              (this.props.modalType === "cohort" && !this.props.isEdit) ? (
                <div className="api-modal-header popup-main-icon-with-border">
                  <Image src={this.props.iconImage} />
                </div>
              ) : this.props.isEdit ? (
                <div
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)",
                    borderRadius: "12px",
                    padding: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "60px",
                  }}
                >
                  {/* chainImages */}
                  <Image
                    src={this.props.chainImages[0]}
                    style={{
                      margin: "0px 4px 4px 0px",
                      width: "2.2rem",
                      borderRadius: "0.6rem",
                    }}
                  />
                  <Image
                    src={this.props.chainImages[1]}
                    style={{
                      margin: "0px 0px 4px 0px",
                      width: "2.2rem",
                      borderRadius: "0.6rem",
                    }}
                  />
                  <Image
                    src={this.props.chainImages[2]}
                    style={{
                      margin: "0px 4px 0px 0px",
                      width: "2.2rem",
                      borderRadius: "0.6rem",
                    }}
                  />
                  {this.props.chainImages?.length < 5 ? (
                    <Image
                      src={this.props.chainImages[3]}
                      style={{
                        margin: "0px 0px 0px 0px",
                        width: "2.2rem",
                        borderRadius: "0.6rem",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        margin: "0px 0px 0px 0px",
                        height: "2.2rem",
                        width: "2.2rem",
                        borderRadius: "0.6rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(229, 229, 230, 0.5)",
                      }}
                      className="inter-display-semi-bold f-s-10"
                    >
                      {this.props.chainImages?.length - 3}+
                    </div>
                  )}
                </div>
              ) : (
                <div className="exitOverlayIcon">
                  <Image src={ExitOverlayIcon} />
                </div>
              )}
              {this.props.goToSignIn ? (
                <Image
                  className="back-icon cp"
                  src={BackIcon}
                  onClick={this.props.goToSignIn}
                />
              ) : null}
              <div
                className="closebtn"
                onClick={() => {
                  // if (this.props.modalType === "create_account") {
                  //   this.props.isSkip();
                  // }
                  this.setState(
                    {
                      isIndexed: true,
                      // emailAdded: true,
                    },
                    () => {
                      this.state.onHide();
                    }
                  );
                }}
              >
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
                      : this.props.modalType === "cohort"
                      ? "cohort-modal-body"
                      : "api-modal-body"
                  }
                >
                  <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                    {this.props.headerTitle}
                  </h6>
                  <p className="inter-display-regular f-s-13 lh-16 grey-B0B">
                    {this.props.modalType === "apiModal"
                      ? "Personalized digital asset intelligence via API"
                      : this.props.modalType === "cohort"
                      ? this.props.isEdit
                        ? `added ${this.props.addedon}`
                        : "Track a pod of whales here"
                      : this.props.headerSubTitle}
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
                            <div
                              style={{
                                marginRight: "1rem",
                              }}
                              className="inter-display-medium f-s-16 lh-19 black-191"
                            >
                              Export data from{" "}
                            </div>
                            <FormElement
                              hideOnblur={this.props.hideOnblur}
                              showHiddenError={this.props.showHiddenError}
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
                            <div
                              style={{
                                marginLeft: "1rem",
                                marginRight: "1rem",
                              }}
                              className="inter-display-medium f-s-16 lh-19 black-191"
                            >
                              to
                            </div>
                            <FormElement
                              hideOnblur={this.props.hideOnblur}
                              showHiddenError={this.props.showHiddenError}
                              valueLink={this.linkState(
                                this,
                                "toDate",
                                this.onDataSelected
                              )}
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
                      {/* <div className="export-item-wrapper">
                        {this.state.exportItem?.map((item) => {
                          return (
                            <span
                              className={
                                this.state.selectedExportItem.value ===
                                item.value
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
                      </div> */}
                      {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                        className="export-switch"
                      >
                        <FormB.Check
                          type="switch"
                          id="custom-switch-dust"
                          label={
                            this.state.switchselected
                              ? "keep dust"
                              : "remove dust"
                          }
                          checked={this.state.switchselected}
                          onChange={(e) => {
                            this.setState({
                              switchselected: e.target.checked,
                            });
                          }}
                        />
                      </div> */}
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
                  ) : this.props.modalType === "cohort" ? (
                    <div className="cohort-body">
                      <div
                        className="cohort-item-wrapper input-error-wrapper"
                        style={{ marginBottom: "0rem" }}
                      >
                        {!this.state.showWarningMsg ? (
                          <Form onValidSubmit={this.handleCohortSave}>
                            <div style={{ position: "relative" }}>
                              <FormElement
                                hideOnblur={this.props.hideOnblur}
                                showHiddenError={this.props.showHiddenError}
                                valueLink={this.linkState(this, "cohort_name")}
                                label="Pod Name"
                                required
                                validations={
                                  [
                                    // {
                                    //   validate: FormValidator.isRequired,
                                    //   message: "Enter your pod name",
                                    // },
                                  ]
                                }
                                control={{
                                  type: CustomTextControl,
                                  settings: {
                                    placeholder: "Give your pod a name",
                                    onBlur: (onBlur) => {
                                      // console.log("pod", this.state.cohort_name)
                                      PodName({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                        pod_name: this.state.cohort_name,
                                      });
                                      if (this.props.updateTimer) {
                                        this.props.updateTimer();
                                      }
                                    },
                                  },
                                }}
                                classes={{
                                  inputField: `${
                                    this.state.podnameError && `email-error`
                                  }`,
                                }}
                              />
                              {this.state.podnameError && (
                                <span className="error-message">
                                  <Image
                                    src={EmailNotFoundCross}
                                    onClick={() => {
                                      this.setState({ podnameError: false });
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <p className="inter-display-medium f-s-16 lh-19">
                                    Pod name required
                                  </p>
                                </span>
                              )}
                            </div>

                            <h4 className="inter-display-medium f-s-13 lh-15 grey-313 m-b-12">
                              Wallets
                            </h4>

                            {/* Multiple address box */}

                            <div
                              className="add-modal-inputs"
                              style={{
                                paddingLeft: `${
                                  this.state.addWalletList?.length === 1
                                    ? "0rem"
                                    : "6rem"
                                }`,
                                paddingRight: `${
                                  this.state.addWalletList?.length < 5
                                    ? "0rem"
                                    : "2rem"
                                }`,
                              }}
                            >
                              {this.state.addWalletList?.map((elem, index) => {
                                // console.log(elem.coinFound)
                                return (
                                  <div
                                    className="add-wallet-input-section"
                                    key={index}
                                    id={`add-wallet-${index}`}
                                    style={{
                                      marginBottom: `${
                                        this.state.addWalletList?.length - 1 ===
                                        index
                                          ? "0rem"
                                          : "1.2rem"
                                      }`,
                                    }}
                                  >
                                    {this.state.addWalletList.length > 1 ? (
                                      <div
                                        className="delete-icon"
                                        onClick={() =>
                                          this.deleteAddress(index)
                                        }
                                      >
                                        <Image src={DeleteIcon} />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {(elem.address == "" ||
                                      elem.displayAddress == "") &&
                                    index == 0 &&
                                    !this.props?.isEdit ? (
                                      <span
                                        className="paste-text cp"
                                        onClick={this.handlePaste}
                                      >
                                        <Image
                                          src={CopyLink}
                                          // onClick={() => this.setState({ emailError: false })}
                                        />
                                        <p className="inter-display-medium f-s-16 lh-19">
                                          Paste
                                        </p>
                                      </span>
                                    ) : (
                                      ""
                                    )}

                                    <input
                                      autoFocus
                                      name={`wallet${index + 1}`}
                                      value={
                                        elem.displayAddress ||
                                        elem.address ||
                                        ""
                                      }
                                      ref={index == 0 ? this.pasteInput : ""}
                                      placeholder="Paste any wallet address or ENS here"
                                      // className='inter-display-regular f-s-16 lh-20'
                                      className={`inter-display-regular f-s-16 lh-20 ${
                                        elem.address ? "is-valid" : null
                                      }`}
                                      onChange={(e) => this.handleOnchange(e)}
                                      id={elem?.id}
                                      onKeyDown={this.handleTabPress}
                                      // style={getPadding(
                                      //   `add-wallet-${index}`,
                                      //   elem,
                                      //   this.props.OnboardingState
                                      // )}
                                    />
                                    {elem.address ? (
                                      elem.coinFound &&
                                      elem.coins.length > 0 ? (
                                        // COIN FOUND STATE
                                        <CustomChip
                                          coins={elem.coins.filter(
                                            (c) => c.chain_detected
                                          )}
                                          key={index}
                                          isLoaded={true}
                                        ></CustomChip>
                                      ) : elem.coins.length ===
                                        this.props.OnboardingState.coinsList
                                          .length ? (
                                        // elem.coins.length === 1
                                        // UNRECOGNIZED WALLET
                                        <CustomChip
                                          coins={null}
                                          key={index}
                                          isLoaded={true}
                                        ></CustomChip>
                                      ) : (
                                        // LOADING STATE
                                        <CustomChip
                                          coins={null}
                                          key={index}
                                          isLoaded={false}
                                        ></CustomChip>
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {this.state.addWalletList[0]?.address !== "" &&
                              this.state.addWalletList?.length <
                                10(
                                  <div className="m-b-32 add-wallet-btn">
                                    <Button
                                      className="grey-btn"
                                      onClick={this.addAddress}
                                    >
                                      <Image src={PlusIcon} /> Add another
                                    </Button>
                                  </div>
                                )}

                            <div className="save-btn-section">
                              <input
                                type="file"
                                ref={this.fileInputRef}
                                onChange={this.handleFileSelect}
                                style={{ display: "none" }}
                              />
                              <Button
                                className={`secondary-btn upload-btn ${
                                  this.state.email ? "active" : ""
                                }`}
                                type="button"
                                onClick={this.handleUpload}
                              >
                                <Image src={UploadIcon} />
                                Upload CSV / Text file
                              </Button>
                              <div>
                                {this.props.isEdit && (
                                  <Button
                                    className={`secondary-btn m-r-12`}
                                    type="button"
                                    style={
                                      this.props.isEdit
                                        ? { border: "none" }
                                        : {}
                                    }
                                    onClick={this.handleDeleteCohort}
                                  >
                                    Delete
                                  </Button>
                                )}
                                <Button
                                  className={`primary-btn ${
                                    this.state.email ? "active" : ""
                                  }`}
                                  type="submit"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </Form>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  background: "#E5E5E680",
                                  marginRight: "2rem",
                                  borderRadius: "1.2rem",
                                  padding: "1.1rem 1.6rem",
                                }}
                              >
                                <Image
                                  src={FileIcon}
                                  style={{ marginRight: "1rem" }}
                                />
                                <h4 className="inter-display-medium f-s-13 lh-15 grey-7C7">
                                  {this.state.fileName}
                                </h4>
                              </div>
                              <input
                                type="file"
                                ref={this.fileInputRef}
                                onChange={this.handleFileSelect}
                                style={{ display: "none" }}
                              />
                              <Button
                                className={`secondary-btn`}
                                type="button"
                                style={{
                                  paddingLeft: "1.8rem",
                                  paddingRight: "1.8rem",
                                }}
                                onClick={() => {
                                  this.handleUpload();
                                }}
                              >
                                Change file
                              </Button>
                            </div>
                            {/* Loader */}
                            {!this.state.isIndexed && (
                              <>
                                <div className="upload-loader"></div>
                                <h4 className="inter-display-medium f-s-16 lh-19 grey-B0B m-t-20">
                                  {this.state.uploadStatus}{" "}
                                  {this.state.total_unique_address}{" "}
                                  {this.state.total_unique_address > 0
                                    ? "unique addresses"
                                    : "unique address"}
                                </h4>
                              </>
                            )}
                            {/* Form */}
                            {this.state.podId && (
                              <>
                                <div className="form-wrapper m-t-20">
                                  {/* <Image src={FileIcon} /> */}
                                  {!this.state.emailAdded &&
                                    !this.state.isIndexed && (
                                      <h4 className="inter-display-medium f-s-16 lh-19 grey-969 m-b-20">
                                        Enter your email address and we will
                                        notify <br />
                                        you once the addresses have been updated
                                      </h4>
                                    )}
                                  {!this.state.emailAdded &&
                                    !this.state.isIndexed && (
                                      <div className="email-section">
                                        <Form
                                          onValidSubmit={this.EmailNotification}
                                        >
                                          <FormElement
                                            hideOnblur={this.props.hideOnblur}
                                            showHiddenError={
                                              this.props.showHiddenError
                                            }
                                            valueLink={this.linkState(
                                              this,
                                              "email_notification"
                                            )}
                                            // label="Email Info"
                                            required
                                            validations={[
                                              {
                                                validate:
                                                  FormValidator.isRequired,
                                                message: "",
                                              },
                                              {
                                                validate: FormValidator.isEmail,
                                                message:
                                                  "Please enter valid email id",
                                              },
                                            ]}
                                            control={{
                                              type: CustomTextControl,
                                              settings: {
                                                placeholder:
                                                  "Enter your email address",
                                              },
                                            }}
                                          />
                                          <div className="save-btn-section">
                                            <Button
                                              className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                                                this.state.email_notification
                                                  ? "active"
                                                  : ""
                                              }`}
                                              type="submit"
                                            >
                                              Confirm
                                            </Button>
                                          </div>
                                        </Form>
                                      </div>
                                    )}
                                  {/* After email messgae */}
                                  {(this.state.emailAdded ||
                                    this.state.isIndexed) && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "start",
                                      }}
                                    >
                                      <Image
                                        src={CheckIcon}
                                        style={{
                                          marginRight: "1rem",
                                          position: "static",
                                          width: "3rem",
                                        }}
                                      />
                                      <h4 className="inter-display-medium f-s-16 lh-19 grey-969">
                                        {this.state.isIndexed
                                          ? "Great! Indexing is completed and your pod has been created."
                                          : "Great! We will let you know once the indexing is complete."}
                                      </h4>
                                    </div>
                                  )}
                                </div>
                                {(this.state.emailAdded ||
                                  this.state.isIndexed) && (
                                  <Button
                                    className="btn primary-btn m-t-20"
                                    onClick={this.handleDone}
                                  >
                                    Done
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {!this.state.showWarningMsg && (
                          <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-t-16">
                            Each row of the file should contain an address or an
                            ENS. No title or header.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : this.props.modalType === "create_account" ? (
                <div className="exit-overlay-body">
                  <h6 className="inter-display-medium f-s-20 lh-24 ">
                    Don’t lose your data
                  </h6>
                  {/* <p className="inter-display-medium f-s-16 lh-19 grey-7C7 text-center">
                Don’t let your hard work go to waste
              </p> */}
                  <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
                    Don’t let your hard work go to waste. Add your email so you
                    can watch your whales with binoculars
                  </p>
                  {/* this.props.isSkip(); */}
                  <div className="email-section">
                    <Form onValidSubmit={this.handleSave}>
                      <FormElement
                        hideOnblur={this.props.hideOnblur}
                        showHiddenError={this.props.showHiddenError}
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
                    <p
                      className="inter-display-medium f-s-16 lh-19 grey-7C7 text-center cp m-t-16 skip-link"
                      onClick={() => {
                        this.props.isSkip();
                      }}
                    >
                      Skip for now
                    </p>
                  </div>
                  <div className="m-b-36 footer">
                    <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                      At Loch, we care intensely about your privacy and
                      pseudonymity.
                    </p>
                    <CustomOverlay
                      text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
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
              ) : (
                <div className="exit-overlay-body">
                  <h6 className="inter-display-medium f-s-20 lh-24 ">
                    {this.props.signup ? "Sign up" : " Don’t lose your data"}
                  </h6>
                  {!this.props?.signup ? (
                    <>
                      <p className="inter-display-medium f-s-16 lh-19 grey-7C7">
                        Access your data again through the unique reusable link,
                      </p>
                      <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24">
                        or link your email
                      </p>
                    </>
                  ) : (
                    <p
                      className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24"
                      style={{ textAlign: "center" }}
                    >
                      Don’t let your hard work go to waste. Add your email so
                      you can analyze this portfolio with superpowers
                    </p>
                  )}
                  <div className="email-section">
                    <Form onValidSubmit={this.handleSave}>
                      <FormElement
                        hideOnblur={this.props.hideOnblur}
                        showHiddenError={this.props.showHiddenError}
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
                  {!this.props?.signup && (
                    <>
                      {/* <p className="inter-display-medium f-s-16 lh-19 grey-ADA m-b-20">
                        or
                      </p>
                      <div className="m-b-24 links">
                        <div className="inter-display-medium f-s-16 lh-19 black-191 linkInfo">
                          {this.state.sharelink}
                        </div>
                        // <div className='edit-options'>
                                // <Image src={EditBtnImage} className="m-r-8"/>
                                // <Dropdown
                                    // id="edit-option-dropdown"
                                    // title={this.state.dropdowntitle}
                                    // list={["View and edit" , "View only"]}
                                    // onSelect={this.handleSelect}
                                    // activetab = {this.state.activeli}
                                // />
                            // </div>
                      </div> */}
                      <div className="copy-link-section mt-4">
                        <div className="link" onClick={this.copyLink}>
                          <Image src={CopyLink} className="m-r-8" />
                          <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                            Copy link
                          </h3>
                        </div>
                        <div
                          className="link"
                          onClick={() => {
                            MenuLetMeLeave({
                              email_address: getCurrentUser().email,
                              session_id: getCurrentUser().id,
                            });
                            if (this.props.updateTimer) {
                              this.props.updateTimer();
                            }
                            resetUser();
                            if (this.props.updateTimer) {
                              this.props.updateTimer();
                            }
                            window.localStorage.setItem("refresh", false);
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
                    </>
                  )}

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
                        style={{ cursor: "pointer" }}
                      />
                    </CustomOverlay>
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  fixWalletApi,
  getAllCoins,
  detectCoin,
  getAllParentChains,
  updateUser,
};

FollowExitOverlay.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(FollowExitOverlay);
