import React from "react";
import { BaseReactComponent, Form, FormElement } from "../../utils/form";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import CustomTextControl from "../../utils/form/CustomTextControl";
import { getAllCoins, detectCoin, getAllParentChains } from "../onboarding/Api";
import CopyLink from "../../assets/images/icons/CopyLink.svg";

import DeleteIcon from "../../assets/images/icons/trashIcon.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import { WhalePodAddressDelete } from "../../utils/AnalyticsFunctions.js";
import CustomChip from "../../utils/commonComponent/CustomChip";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import { toast } from "react-toastify";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";

class AddBundleModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      // create account for cohort
      show: false,
      onHide: props.onHide,
      addWalletList: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          userPlan: undefined,
        },
      ],
      bundle_name: "",
    };
  }
  fileInputRef = React.createRef();
  pasteInput = React.createRef();

  componentDidUpdate() {
    if (!this.state.userPlan) {
      this.setState({
        userPlan: JSON.parse(localStorage.getItem("currentPlan")),
      });
    }
  }
  componentDidMount() {
    if (this.props.show) {
      this.setState({ show: this.props.show });
    }
    this.setState({
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
    if (this.props.isEdit && this.props.bundleName) {
      this.setState({
        bundle_name: this.props.bundleName,
      });
    }
    if (this.props?.walletaddress && (this.props.isEdit || this.props.isView)) {
      const tempWallets = this.props?.walletaddress?.map((e, i) => {
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
      });
      this.setState({ addWalletList: tempWallets });
    }
    // set popup active
    localStorage.setItem("isPopupActive", true);
    this.props.getAllCoins();
    this.props.getAllParentChains();
  }

  componentWillUnmount() {
    // set popup active
    localStorage.setItem("isPopupActive", false);
  }

  addAddress = () => {
    const total_addresses = this.props.total_addresses
      ? this.props.total_addresses
      : 0;
    let total = this.props.isEdit
      ? this.state.addWalletList.length +
        total_addresses +
        1 -
        this.props.totalEditAddress
      : this.state.addWalletList.length + total_addresses + 1;

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

      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else {
      this.setState({
        triggerId: 1,
      });
    }
  };

  deleteAddress = (index) => {
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
  };

  handleTabPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      this.addAddress();
    }
  };
  handleOnchange = (e) => {
    let { name, value } = e.target;
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
    newAddress[i].coinFound =
      newAddress[i].coins &&
      newAddress[i].coins.some((e) => e.chain_detected === true);
    this.setState({
      addWalletList: newAddress,
    });
  };

  handleCohortSave = () => {};

  handleDeleteCohort = () => {};

  handleSave = () => {};

  submit = () => {};

  handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      let addressList = this.state.addWalletList;
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

  closeButtonClick = () => {
    this.setState(
      {
        isIndexed: true,
      },
      () => {
        this.state.onHide();
      }
    );
  };
  copyContent = (text) => {
    // const text = props.display_address ? props.display_address : props.wallet_account_number
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
      })
      .catch(() => {
        console.log("something went wrong");
      });
  };
  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          className="exit-overlay-form"
          onHide={this.state.onHide}
          size="lg"
          dialogClassName={"exit-overlay-modal"}
          centered
          aria-labelledby="contained-modal-title-vcenter"
          backdropClassName="exitoverlaymodal"
        >
          <Modal.Header>
            {this.props.isEdit || this.props.isView ? (
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
              <div className="api-modal-header">
                <Image src={this.props.iconImage} />
              </div>
            )}
            <div className="closebtn" onClick={this.closeButtonClick}>
              <Image src={CloseIcon} />
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="cohort-modal-body">
              <h6
                style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                className="inter-display-medium f-s-20 lh-24 m-b-6 black-000"
              >
                {this.props.isEdit || this.props.isView
                  ? this.props.bundleName
                  : this.props.headerTitle}
              </h6>
              <p className="inter-display-regular f-s-13 lh-16 grey-B0B">
                {this.props.isEdit || this.props.isView
                  ? `${this.props.addedon ? "added " + this.props.addedon : ""}`
                  : "Track a bundle of addresses here"}
              </p>

              <div className="cohort-body">
                <div
                  className="cohort-item-wrapper input-error-wrapper"
                  style={{ marginBottom: "0rem" }}
                >
                  <Form onValidSubmit={this.handleCohortSave}>
                    {!this.props.isView ? (
                      <div style={{ position: "relative" }}>
                        <FormElement
                          valueLink={this.linkState(this, "bundle_name")}
                          label="Title"
                          required
                          validations={[]}
                          control={{
                            type: CustomTextControl,
                            settings: {
                              placeholder: "Give your bundle a name",
                              onBlur: (onBlur) => {
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
                      </div>
                    ) : null}

                    {!this.props.isView ? (
                      <h4 className="inter-display-medium f-s-13 lh-15 grey-313 m-b-12">
                        Wallets
                      </h4>
                    ) : null}

                    {/* Multiple address box */}
                    {this.props.isView ? (
                      <div className="viewBundleWallets">
                        {this.state.addWalletList?.map((elem, index) => {
                          return (
                            <>
                              <div className="viewBundleWalletItem">
                                <div className="viewBundleWalletItemAddress">
                                  {/* {elem.tag ? ( */}
                                  <div className="inter-display-medium f-s-16 lh-20 mb-1 black-191">
                                    Custom Tag
                                  </div>
                                  {/* ) : null} */}
                                  {elem.address ? (
                                    <div className="viewBundleWalletAddressContainer">
                                      <div className="inter-display-regular f-s-13 grey-B0B">
                                        {elem.address}
                                      </div>
                                      <Image
                                        src={CopyClipboardIcon}
                                        onClick={() =>
                                          this.copyContent(elem.address)
                                        }
                                        className="cp copy-icon viewBundleCopyIcon"
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                <div className="viewBundleWalletItemPrice">
                                  <h4 className="inter-display-medium f-s-16 lh-19">
                                    {CurrencyType(false)}
                                    {numToCurrency(500000)}{" "}
                                    <span className="f-s-10 grey-ADA">
                                      {" "}
                                      {CurrencyType(true)}
                                    </span>
                                  </h4>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    ) : (
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
                          return (
                            <div
                              className="add-wallet-input-section"
                              key={index}
                              id={`add-wallet-${index}`}
                              style={{
                                marginBottom: `${
                                  this.state.addWalletList?.length - 1 === index
                                    ? "0rem"
                                    : "1.2rem"
                                }`,
                              }}
                            >
                              {this.state.addWalletList.length > 1 ? (
                                <div
                                  className="delete-icon"
                                  onClick={() => this.deleteAddress(index)}
                                >
                                  <Image src={DeleteIcon} />
                                </div>
                              ) : null}

                              {(elem.address === "" ||
                                elem.displayAddress === "") &&
                              index === 0 &&
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
                              ) : null}

                              <input
                                autoFocus
                                name={`wallet${index + 1}`}
                                value={
                                  elem.displayAddress || elem.address || ""
                                }
                                ref={index === 0 ? this.pasteInput : ""}
                                placeholder="Paste any wallet address or ENS here"
                                className={`inter-display-regular f-s-16 lh-20 ${
                                  elem.address ? "is-valid" : null
                                }`}
                                onChange={(e) => this.handleOnchange(e)}
                                id={elem?.id}
                                onKeyDown={this.handleTabPress}
                              />
                              {elem.address ? (
                                elem.coinFound && elem.coins.length > 0 ? (
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
                    )}

                    {this.state.addWalletList[0]?.address !== "" &&
                    !this.props.isView ? (
                      <div className="m-b-32 add-wallet-btn">
                        <Button className="grey-btn" onClick={this.addAddress}>
                          <Image src={PlusIcon} /> Add another
                        </Button>
                      </div>
                    ) : null}

                    <div className="save-btn-section">
                      {this.props.isView ? (
                        <Button
                          onClick={this.props.goToEdit}
                          className={`secondary-btn `}
                          type="submit"
                        >
                          Edit
                        </Button>
                      ) : (
                        <div />
                      )}
                      <div>
                        {this.props.isView ? (
                          <Button
                            className={`secondary-btn secondary-btn-no-border `}
                            type="submit"
                            onClick={this.state.onHide}
                          >
                            Close
                          </Button>
                        ) : this.props.isEdit ? (
                          <>
                            <Button
                              className={`secondary-btn m-r-12`}
                              type="button"
                              style={
                                this.props.isEdit ? { border: "none" } : {}
                              }
                              onClick={this.handleDeleteCohort}
                            >
                              Delete
                            </Button>
                            <Button
                              className={`primary-btn ${
                                this.state.email ? "active" : ""
                              }`}
                              type="submit"
                            >
                              Update
                            </Button>
                          </>
                        ) : (
                          <Button
                            className={`primary-btn ${
                              this.state.email ? "active" : ""
                            }`}
                            type="submit"
                            disabled={this.state.bundle_name === ""}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  getAllCoins,
  detectCoin,
  getAllParentChains,
};

AddBundleModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddBundleModal);
