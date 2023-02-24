import React from 'react'
import {BaseReactComponent, Form, FormElement, FormValidator} from './../../utils/form';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import ExitOverlayIcon from '../../assets/images/icons/ExitOverlayWalletIcon.svg'
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import CustomTextControl from './../../utils/form/CustomTextControl';
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../onboarding//Api";
// import EditBtnImage from "../../assets/images/icons/EditBtnImage.svg";
// import Dropdown from '../common/DropDown.js';
import CopyLink from '../../assets/images/icons/CopyLink.svg';
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CheckIcon from "../../assets/images/icons/check-upgrade.svg";

import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ShareLink from '../../assets/images/icons/ShareLink.svg'
import {exportDataApi, fixWalletApi} from './Api.js'
import { BASE_URL_S3, Plans } from '../../utils/Constant';
import { toast } from 'react-toastify';
import ApiModalFrame from '../../assets/images/apiModalFrame.svg';
import nextIcon from '../../assets/images/icons/next.svg'
import next2Icon from '../../assets/images/icons/next2.svg'
import prevIcon from '../../assets/images/icons/prev.svg'
import prev2Icon from '../../assets/images/icons/prev2.svg'
import DeleteIcon from "../../assets/images/icons/trashIcon.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import FileIcon from "../../assets/images/icons/file-text.svg";
import {

  CreateWhalePodSave,
  ExportDataDownlaod,
  LeaveEmailAdded,
  LeaveLinkCopied,
  LeaveLinkShared,
  LeavePrivacyMessage,
  MenuLetMeLeave,WhalePodAddressDelete,WhalePodAddTextbox,WhalePodDeleted, WhalePodUploadFile, PodName, ExportDateSelected, signUpProperties, resetUser,
} from "../../utils/AnalyticsFunctions.js";
import { DatePickerControl } from '../../utils/form';
import moment from 'moment';
import lochClean from "../../assets/images/LochClean.gif";
import { CurrencyType, getPadding, loadingAnimation } from '../../utils/ReusableFunctions';
import CustomChip from '../../utils/commonComponent/CustomChip';
import Coin1 from "../../assets/images/icons/Coin0.svg";
import Coin2 from "../../assets/images/icons/Coin-1.svg";
import Coin3 from "../../assets/images/icons/Coin-2.svg";
import Coin4 from "../../assets/images/icons/Coin-3.svg";
import { createCohort, deleteCohort, getPodStatus, notificationSend } from '../cohort/Api';
import Papa from "papaparse";
import { updateUser } from '../profile/Api';
import UpgradeModal from './upgradeModal';

class ExitOverlay extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    // console.log("props add", props?.walletaddress);

    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    this.state = {
      // create account for cohort
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || dummyUser || "",

      dummyUser,
      show: props.show,
      sharelink: `${BASE_URL_S3}home/${dummyUser}`,
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
        // {
        //   name: "Average Cost Basis",
        //   value: 40,
        // },
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
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
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
    };
  }

  EmailNotification = () => {
    this.setState({
      // isIndexed: true,
      emailAdded: true,
    }, () => {
        const data = new URLSearchParams();
        data.append("cohort_id", this.state.podId);
        notificationSend(data, this);
    });
  };

  getPodStatusFunction = () => {
      const data = new URLSearchParams();
      data.append("cohort_id", this.state.podId);
      getPodStatus(data,this);
      setTimeout(() => {
        if (!this.state.isIndexed && !this.state.emailAdded) {
          this.getPodStatusFunction();
        }
      }, 2000);    
  };

  handleDone = () => {
    // this.props.apiResponse(true);
    this.state.onHide();
  }
  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
        hidePrevModal: !this.state.upgradeModal,
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
    this.props.getAllCoins();
    this.props.getAllParentChains();
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

  handleCohortSave = () => {
    // console.log("save",  this.state.addWalletList)
    if (this.state.addWalletList) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        let arr = [];
        let addressList = [];
        let displayAddress = [];
        let walletList = [];
        let isChainDetected = [];
        for (let i = 0; i < this.state.addWalletList.length; i++) {
          let curr = this.state.addWalletList[i];
          // console.log(curr)
          if (!arr.includes(curr.address.trim()) && curr.address) {
            walletList.push(curr);
            arr.push(curr.address.trim());
            arr.push(curr.displayAddress?.trim());
            addressList.push(
              curr.displayAddress !== ""
                ? curr.displayAddress?.trim()
                : curr.address.trim()  
            );
              
            
                  isChainDetected.push(curr?.coinFound);
            
          }
        }
        let chain_detechted =
          isChainDetected.includes(undefined) ||
          isChainDetected.includes(false)
            ? false
            : true;
        // console.log("address list", chain_detechted, isChainDetected);
        let addWallet = walletList;
        if (addressList.length !== 0) {
          addWallet?.map((w, i) => {
            w.id = `wallet${i + 1}`;
          });
          // localStorage.setItem("CohortWallet", addWallet);

          // this.state.onHide();
          const data = new URLSearchParams();
          data.append("name", this.state.cohort_name);
           data.append("chain_detected", chain_detechted);
          data.append("wallet_addresses", JSON.stringify(addressList));

          if (this.props.isEdit && this.props.cohortId) {
            data.append("cohort_id", this.props.cohortId);
            // console.log("id", this.props.cohortId, typeof(this.props.cohortId));
          }

          if (this.state.isChangeFile) {
            data.append("cohort_id", this.state.podId);
            this.setState({
              isChangeFile: false,
            });
          }

          createCohort(data, this);
          // hide if upload click
          // if (!this.state.showWarningMsg) {
          //   this.state.onHide();
          // }
          // console.log("address", walletList);
          this.state.changeList && this.state.changeList(walletList);

          const address = walletList?.map((e) =>
            e.displayAddress ? e.displayAddress : e.address
          );

          const unrecog_address = walletList
            .filter((e) => !e.coinFound)
            .map((e) => e.address);
          // console.log("Unreq address", unrecog_address);

          const blockchainDetected = [];
          walletList
            .filter((e) => e.coinFound)
            .map((obj) => {
              let coinName = obj.coins
                .filter((e) => e.chain_detected)
                .map((name) => name.coinName);
              let address = obj.address;
              blockchainDetected.push({ address: address, names: coinName });
            });

          CreateWhalePodSave({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            pod_name: this.state.cohort_name,
            addresses: address,
            unrecognized_addresses: unrecog_address,
            chains_detected_against_them: blockchainDetected,
          });
        }
      }, 100);
    }
  };

  handleDeleteCohort = () => {
    //  let addressList = this.props?.walletaddress && this.props?.walletaddress?.map(e => e.wallet_address);

    // WhalePodDeleted();
    // console.log("name", this.state.cohort_name);
    // console.log("address", this.state.addWalletList?.map(e => e.displayAddress ? e.displayAddress : e.address))
    WhalePodDeleted({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      pod_name: this.state.cohort_name,
      addresses: this.state.addWalletList?.map((e) =>
        e.displayAddress ? e.displayAddress : e.address
      ),
    });
    const data = new URLSearchParams();
    data.append("cohort_id", this.props.cohortId);

    deleteCohort(data, this);
    this.state.onHide();
  };
  copyLink = () => {
    navigator.clipboard.writeText(this.state.sharelink);
    toast.success("Share link has been copied");
    LeaveLinkCopied({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  handleSave = () => {
    // console.log("create email", this.state.email);
    if (this.props.modalType === "create_account") {
      // for chort signup and signin
      const data = new URLSearchParams();
      data.append("first_name", this.state.firstName);
      data.append("last_name", this.state.lastName);
      data.append("email", this.state.email);
      data.append("mobile", this.state.mobileNumber);
      updateUser(data, this);
    } else {
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
        signUpProperties({
          userId: getCurrentUser().id,
          email_address: this.state.email,
          first_name: "",
          last_name: "",
        });

        resetUser();
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

  handleExportNow = () => {
    // console.log('Export');
    let addWalletList = JSON.parse(localStorage.getItem("addWallet"));
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
      console.log("Invalid file type. Only CSV and text files are allowed.");
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
                <div className="api-modal-header">
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
                      <div className="export-item-wrapper">
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
                  ) : this.props.modalType === "cohort" ? (
                    <div className="cohort-body">
                      <div className="cohort-item-wrapper">
                        {!this.state.showWarningMsg ? (
                          <Form onValidSubmit={this.handleCohortSave}>
                            <FormElement
                              valueLink={this.linkState(this, "cohort_name")}
                              label="Pod Name"
                              required
                              validations={[
                                {
                                  validate: FormValidator.isRequired,
                                  message: "",
                                },
                              ]}
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
                                  },
                                },
                              }}
                            />

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

                            {this.state.addWalletList[0]?.address !== "" && (
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
                                className={`secondary-btn ${
                                  this.state.email ? "active" : ""
                                }`}
                                type="button"
                                onClick={this.handleUpload}
                              >
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
                                  {this.state.uploadStatus}
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
                      {this.state.sharelink}
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
                        MenuLetMeLeave({
                          email_address: getCurrentUser().email,
                          session_id: getCurrentUser().id,
                        });
                        resetUser();
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
            </Modal.Body>
          </Modal>
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
          />
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
};


ExitOverlay.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitOverlay);