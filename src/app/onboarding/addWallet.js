import React from "react";
import { Button, Image } from "react-bootstrap";
import { connect } from "react-redux";

import {
  AddTextbox,
  AddWalletAddress,
  DeleteWalletAddress,
  LPC_Go,
  LandingPageNickname,
} from "../../utils/AnalyticsFunctions.js";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
} from "../../utils/form";
import { detectNameTag } from "../common/Api";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "./Api";

import DeleteIcon from "../../assets/images/icons/delete-icon.png";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import LinkIconBtn from "../../assets/images/link.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import { CustomCoin } from "../../utils/commonComponent";
import CustomButton from "../../utils/form/CustomButton";
import { GetAllPlan, updateUserWalletApi } from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import { setHeaderReducer } from "../header/HeaderAction";

// upload csv
import Papa from "papaparse";
import CheckIcon from "../../assets/images/icons/check-upgrade.svg";
import ClockIcon from "../../assets/images/icons/clock-icon.svg";
import FileIcon from "../../assets/images/icons/file-text.svg";
import {
  TrendingFireIcon,
  TrendingWalletIcon,
} from "../../assets/images/icons/index.js";
import { numToCurrency } from "../../utils/ReusableFunctions.js";
import { addExchangeTransaction } from "../home/Api";
import { addUserCredits } from "../profile/Api.js";
class AddWallet extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signIn: false,
      addButtonVisible: false,
      pageName: "Landing Page",
      disableGoBtn: false,
      walletInput: props?.walletAddress
        ? props.walletAddress
        : [
            {
              id: `wallet1`,
              address: "",
              coins: [],
              displayAddress: "",
              wallet_metadata: {},
              nickname: "",
              showAddress: true,
              showNickname: true,
              apiAddress: "",
              showNameTag: true,
              nameTag: "",
            },
          ],
      loading: false,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      GoToHome: false,
      deletedAddress: [],

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
      total_unique_address: 0,
    };
    this.timeout = 0;
  }

  // upload csv
  fileInputRef = React.createRef();
  pasteInput = React.createRef();

  EmailNotification = () => {
    // send notification for that user
    this.setState(
      {
        // isIndexed: true,
        emailAdded: true,
      },
      () => {
        // const data = new URLSearchParams();
        // data.append("cohort_id", this.state.podId);
        // notificationSend(data, this);
      }
    );
  };

  getPodStatusFunction = () => {};

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
  };

  handleFileSelect = (event) => {
    const file = event.target.files[0];
    const name = event.target.files[0]?.name;

    if (this.state.showWarningMsg) {
      this.setState({
        walletInput: [
          {
            id: `wallet1`,
            address: "",
            coins: [],
            displayAddress: "",
            wallet_metadata: {},
            nickname: "",
            showAddress: true,
            showNickname: true,
            apiAddress: "",
            showNameTag: true,
            nameTag: "",
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
          this.state?.walletInput &&
            this.state?.walletInput?.map((e) => {
              if (e.address !== "") {
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
              nickname: "",
              showAddress: true,
              showNickname: true,
              apiAddress: e[0],
              showNameTag: true,
              nameTag: "",
            });
          });

          // check
          let total_address = prevAddressList?.length + addressList?.length + 1;

          if (
            total_address <= this.state.userPlan?.whale_pod_address_limit ||
            this.state.userPlan?.whale_pod_address_limit === -1
          ) {
            // WhalePodUploadFile({
            //   session_id: getCurrentUser().id,
            //   email_address: getCurrentUser().email,
            //   addresses: uploadedAddress,
            // });

            let arr = [];
            let total_address = 0;
            this.setState(
              {
                walletInput: [...prevAddressList, ...addressList],
              },

              () => {
                // call api to store pod
                this.state.walletInput
                  ?.slice(0, 10)
                  .map((e) =>
                    this.getCoinBasedOnWalletAddress(e.id, e.address)
                  );

                // this.handleAddWallet();

                const promises = [];
                for (let i = 0; i < this.state.walletInput.length; i++) {
                  let curr = this.state.walletInput[i];
                  if (!arr.includes(curr.apiAddress?.trim()) && curr.address) {
                    arr.push(curr.address?.trim());
                    arr.push(curr.displayAddress?.trim());
                    arr.push(curr.apiAddress?.trim());
                    total_address = total_address + 1;
                  }
                  promises.push(Promise.resolve());
                }

                Promise.all(promises).then(() => {
                  this.setState({
                    total_unique_address: total_address,
                    addButtonVisible: this.state.walletInput.some((wallet) =>
                      wallet.address ? true : false
                    ),
                  });
                });
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
        },
      });
    } else {
    }
    event.target.value = "";
  };

  handleDone = () => {
    // this.state.onHide();

    this.setState({
      uploadStatus: "Uploading",
      emailAdded: false,
      isIndexed: false,
      isChangeFile: true,
      showWarningMsg: false,
    });
  };

  // upgradeModal = () => {

  //   this.setState({
  //     upgradeModal: !this.state.upgradeModal,
  //   }, () => {
  //     let value = this.state.upgradeModal ? false : true;
  //     this.props.hideModal(value);

  //     const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
  //     if (userDetails) {
  //       this.props.history.push("/home")
  //     }

  //   });

  // };

  componentDidMount() {
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
    });
    if (this.props.exchanges) {
      let text = "";

      Promise.all(
        this.props.exchanges
          ?.filter((e) => e.isActive)
          .map(
            (e) => (text = text == "" ? text + e?.name : text + ", " + e?.name)
          )
      ).then(() => {
        this.setState({
          connectText: text == "" ? "Connect exchanges" : text + " connected",
        });
      });
    } else {
      this.setState({
        connectText: "Connect exchanges",
      });
    }
    this.props.getAllCoins();
    this.props.getAllParentChains();
    this.setState({
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
    });

    this.props.GetAllPlan();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userPlan === null) {
      this.state.userPlan = JSON.parse(
        window.localStorage.getItem("currentPlan")
      );
    }
    if (this.state.walletInput !== prevState.walletInput) {
      this.props.copyWalletAddress(this.state.walletInput);
    }
    if (this.state.walletInput !== prevState.walletInput) {
      let chainNotDetected = false;

      this.state.walletInput.forEach((indiWallet) => {
        let anyCoinPresent = false;
        if (
          indiWallet.coins &&
          indiWallet.coinFound &&
          indiWallet.coins.length > 0
        ) {
          indiWallet.coins.forEach((indiCoin) => {
            if (indiCoin?.chain_detected) {
              anyCoinPresent = true;
            }
          });
        }
        if (!anyCoinPresent) {
          chainNotDetected = true;
        }
      });

      if (chainNotDetected) {
        this.setState({
          disableGoBtn: true,
        });
      } else {
        this.setState({
          disableGoBtn: false,
        });
      }
    }
  }

  nicknameOnChain = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;

      walletCopy[foundIndex].nickname = value;

      // walletCopy[foundIndex].trucatedAddress = value
    }

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  FocusOutInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;

      walletCopy[foundIndex].showAddress =
        walletCopy[foundIndex].nickname === "" ? true : false;
      walletCopy[foundIndex].showNickname =
        walletCopy[foundIndex].nickname === "" ? false : true;

      // walletCopy[foundIndex].trucatedAddress = value
    }

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  FocusInInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    // if (foundIndex > -1) {
    //   // let prevValue = walletCopy[foundIndex].nickname;

    //   walletCopy[foundIndex].showAddress = true;
    //   walletCopy[foundIndex].showNickname = true;

    //   // walletCopy[foundIndex].trucatedAddress = value
    // }
    walletCopy?.map((address, i) => {
      if (address.id === name) {
        walletCopy[i].showAddress = true;
        walletCopy[i].showNickname = true;
      } else {
        walletCopy[i].showAddress =
          walletCopy[i].nickname === "" ? true : false;
        walletCopy[i].showNickname =
          walletCopy[i].nickname !== "" ? true : false;
      }
    });

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };

  handleOnChange = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      let prevValue = walletCopy[foundIndex].address;

      walletCopy[foundIndex].address = value;
      if (value === "" || prevValue !== value) {
        walletCopy[foundIndex].coins = [];
      }
      if (value === "") {
        walletCopy[foundIndex].coinFound = false;
        walletCopy[foundIndex].nickname = "";
      }
      // walletCopy[foundIndex].trucatedAddress = value
    }
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
      walletInput: walletCopy,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // timeout;
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 1000);
  };

  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      const regex = /\.eth$/;
      if (!regex.test(value)) {
        this.props.detectNameTag(
          {
            id: name,
            address: value,
          },
          this,
          false
        );
      } else {
        this.handleSetNameTagLoadingFalse({
          id: name,
          address: value,
        });
        this.handleSetNameTag(
          {
            id: name,
            address: value,
          },
          ""
        );
      }
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
          this
        );
        // this.props.detectNameTag(
        //   {
        //     id: name,
        //     coinCode: parentCoinList[i].code,
        //     coinSymbol: parentCoinList[i].symbol,
        //     coinName: parentCoinList[i].name,
        //     address: value,
        //     coinColor: parentCoinList[i].color,
        //     subChains: parentCoinList[i].sub_chains,
        //   },
        //   this,
        //   false,
        //   i
        // );
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
          coinName: item?.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );
    let i = this.state.walletInput.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.walletInput];

    //new code
    data.address !== newAddress[i].address
      ? (newAddress[i].coins = [])
      : newAddress[i].coins.push(...newCoinList);

    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound = newAddress[i].coins.some(
      (e) => e.chain_detected === true
    );

    newAddress[i].apiAddress = data?.apiaddress;

    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTagLoadingFalse = (data) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        loadingNameTag: false,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTagLoadingTrue = (data) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        loadingNameTag: true,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        nameTag: nameTag,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };

  addInputField = () => {
    if (
      this.state.walletInput.length + 1 <=
        this.state.userPlan?.wallet_address_limit ||
      this.state.userPlan?.wallet_address_limit === -1
    ) {
      this.state.walletInput.push({
        id: `wallet${this.state.walletInput.length + 1}`,
        address: "",
        coins: [],
        nickname: "",
        showAddress: true,
        showNickname: true,
        showNameTag: true,
        nameTag: "",
      });
      this.setState({
        walletInput: this.state.walletInput,
      });
      AddTextbox({
        session_id: getCurrentUser().id,
      });
    } else {
      this.setState(
        {
          triggerId: 1,
        },
        () => {
          this.props.upgradeModal();
        }
      );
    }
  };

  deleteInputField = (index, wallet) => {
    if (!this.isDisabled() || wallet.address === "") {
      this.state.walletInput?.splice(index, 1);
      this.state.walletInput?.map((w, i) => (w.id = `wallet${i + 1}`));
      DeleteWalletAddress({
        address: wallet.address,
      });
      this.setState(
        {
          walletInput: this.state.walletInput,
        },
        () => {
          if (this.state.walletInput.length === 1) {
            this.setState({
              addButtonVisible: this.state.walletInput.some((wallet) =>
                wallet.address ? true : false
              ),
            });
          }
          let chainNotDetected = false;

          this.state.walletInput.forEach((indiWallet) => {
            let anyCoinPresent = false;
            if (
              indiWallet.coins &&
              indiWallet.coinFound &&
              indiWallet.coins.length > 0
            ) {
              indiWallet.coins.forEach((indiCoin) => {
                if (indiCoin?.chain_detected) {
                  anyCoinPresent = true;
                }
              });
            }
            if (!anyCoinPresent) {
              chainNotDetected = true;
            }
          });

          if (chainNotDetected) {
            this.setState({
              disableGoBtn: true,
            });
          } else {
            this.setState({
              disableGoBtn: false,
            });
          }
        }
      );
    }
  };

  isDisabled = (isLoading) => {
    let isDisableFlag = true;
    // if (this.state.walletInput.length <= 0) {
    //     isDisableFlag = true;
    // }
    this.state.walletInput?.map((e) => {
      if (e.address) {
        if (e.coins.length !== this.props.OnboardingState.coinsList.length) {
          // isDisableFlag = true;
          e.coins.map((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = false;
            }
          });
        } else {
          isDisableFlag = false;
        }
      }
    });
    if (isLoading && isDisableFlag) {
      if (this.state.walletInput.length > 1) {
        return false;
      }
    }
    return isDisableFlag;
  };

  onValidSubmit = () => {
    window.localStorage.setItem("callTheUpdateAPI", true);
    this.setState({
      disableGoBtn: true,
    });
    const theExchangeData = [];
    if (this.props.exchanges) {
      this.props.exchanges.forEach((exchangeEle) => {
        if (exchangeEle.apiKey) {
          const newObj = {
            apiKey: exchangeEle.apiKey,
            apiSecretKey: exchangeEle.apiSecretKey,
            connectionName: exchangeEle.connectionName,
            exchangeCode: exchangeEle.code,
          };
          theExchangeData.push(newObj);
        }
      });
    }
    let passingData = new URLSearchParams();
    passingData.append("user_account", JSON.stringify(theExchangeData));
    const islochUser = window.localStorage.getItem("lochDummyUser");
    if (islochUser) {
      this.updateWallet();
      if (theExchangeData && theExchangeData.length > 0) {
        this.props.addExchangeTransaction(passingData);
      }
    } else {
      let walletAddress = [];
      let addWallet = this.state.walletInput;
      let addWalletTemp = this.state.walletInput;
      addWalletTemp?.forEach((w, i) => {
        w.id = `wallet${i + 1}`;
      });
      if (addWalletTemp && addWalletTemp.length > 0) {
        var mySet = new Set();

        const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
          if (filData?.address !== "") {
            if (mySet.has(filData.address.toLowerCase())) {
              return false;
            } else {
              mySet.add(filData.address.toLowerCase());
              return true;
            }
          }
          return false;
        });
        if (filteredAddWalletTemp) {
          setTimeout(() => {
            this.props.setHeaderReducer(filteredAddWalletTemp);
          }, 500);
        }
      }
      let finalArr = [];

      let addressList = [];

      let nicknameArr = {};

      for (let i = 0; i < addWallet.length; i++) {
        let curr = addWallet[i];
        if (
          !walletAddress.includes(curr.apiAddress?.trim()) &&
          curr.address?.trim()
        ) {
          finalArr.push(curr);
          walletAddress.push(curr.address?.trim());
          walletAddress.push(curr.displayAddress?.trim());
          walletAddress.push(curr.apiAddress?.trim());
          let address = curr.address?.trim();
          nicknameArr[address] = curr.nickname;
          addressList.push(curr.address?.trim());
        }
      }

      finalArr = finalArr?.map((item, index) => {
        return {
          ...item,
          id: `wallet${index + 1}`,
        };
      });
      let creditIsAddress = false;
      let creditIsEns = false;
      for (let i = 0; i < addressList.length; i++) {
        const tempItem = addressList[i];
        const endsWithEth = /\.eth$/i.test(tempItem);

        if (endsWithEth) {
          creditIsAddress = true;
          creditIsEns = true;
        } else {
          creditIsAddress = true;
        }
      }
      if (creditIsAddress) {
        window.localStorage.setItem("addAddressCreditOnce", true);
        if (addWallet.length > 1) {
          window.localStorage.setItem("addMultipleAddressCreditOnce", true);
        }
      }
      if (creditIsEns) {
        window.localStorage.setItem("addEnsCreditOnce", true);
      }
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      // data.append("link", );
      this.props.createAnonymousUserApi(data, this, finalArr, null);

      const address = finalArr?.map((e) => e.address);

      const unrecog_address = finalArr
        .filter((e) => !e.coinFound)
        .map((e) => e.address);

      const blockchainDetected = [];
      const nicknames = [];
      finalArr
        .filter((e) => e.coinFound)
        .map((obj) => {
          let coinName = obj.coins
            .filter((e) => e.chain_detected)
            .map((name) => name.coinName);
          let address = obj.address;
          let nickname = obj.nickname;
          blockchainDetected.push({ address: address, names: coinName });
          nicknames.push({ address: address, nickname: nickname });
        });

      LPC_Go({
        addresses: address,
        ENS: address,
        chains_detected_against_them: blockchainDetected,
        unrecognized_addresses: unrecog_address,
        unrecognized_ENS: unrecog_address,
        nicknames: nicknames,
      });
    }
  };

  updateWallet = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      let arr = [];
      let addressList = [];
      let displayAddress = [];
      let nicknameArr = {};
      let walletList = [];

      for (let i = 0; i < this.state.walletInput.length; i++) {
        let curr = this.state.walletInput[i];

        // );
        let isIncluded = false;
        const whatIndex = arr.findIndex(
          (resRes) =>
            resRes?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase() ||
            resRes?.trim()?.toLowerCase() ===
              curr?.apiAddress?.trim()?.toLowerCase()
        );
        if (whatIndex !== -1) {
          isIncluded = true;
        }
        if (!isIncluded && curr.address) {
          walletList.push(curr);
          arr.push(curr.address?.trim());
          nicknameArr[curr.address?.trim()] = curr.nickname;
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.apiAddress?.trim());
          addressList.push(curr.address?.trim());
        }
      }

      let addWallet = walletList;

      addWallet?.map((w, i) => {
        w.id = `wallet${i + 1}`;
      });
      if (addWallet) {
        this.props.setHeaderReducer(addWallet);
      }
      window.localStorage.setItem("addWallet", JSON.stringify(addWallet));

      // this.state?.onHide();
      const data = new URLSearchParams();
      const yieldData = new URLSearchParams();
      // data.append("wallet_addresses", JSON.stringify(arr));
      data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
      data.append("wallet_addresses", JSON.stringify(addressList));
      yieldData.append("wallet_addresses", JSON.stringify(addressList));

      this.props.updateUserWalletApi(data, this, yieldData);

      let creditIsAddress = false;
      let creditIsEns = false;
      for (let i = 0; i < addressList.length; i++) {
        const tempItem = addressList[i];
        const endsWithEth = /\.eth$/i.test(tempItem);

        if (endsWithEth) {
          creditIsAddress = true;
          creditIsEns = true;
        } else {
          creditIsAddress = true;
        }
      }
      if (creditIsAddress) {
        const addressCreditScore = new URLSearchParams();
        addressCreditScore.append("credits", "address_added");
        // this.props.addUserCredits(addressCreditScore);

        if (addWallet.length > 1) {
          // Multiple address
          const multipleAddressCreditScore = new URLSearchParams();
          multipleAddressCreditScore.append(
            "credits",
            "multiple_address_added"
          );
          // this.props.addUserCredits(multipleAddressCreditScore);
        }
      }
      if (creditIsEns) {
        const ensCreditScore = new URLSearchParams();
        ensCreditScore.append("credits", "ens_added");
        // this.props.addUserCredits(ensCreditScore);
      }

      // if (!this.state.showWarningMsg) {
      //   this.state.onHide();
      //   // this.state.changeList && this.state.changeList(walletList);
      // }
      // this.state.changeList && this.state.changeList(walletList);
      // if (this.props.handleUpdateWallet) {
      //     this.props.handleUpdateWallet()
      // }
      const address = this.state.walletInput?.map((e) => e.address);
      const addressDeleted = this.state.deletedAddress;
      const unrecog_address = this.state.walletInput
        ?.filter((e) => !e.coinFound)
        ?.map((e) => e.address);
      const recog_address = this.state.walletInput
        ?.filter((e) => e.coinFound)
        ?.map((e) => e.address);

      const blockchainDetected = [];
      const nicknames = [];
      this.state.walletInput
        ?.filter((e) => e.coinFound)
        ?.map((obj) => {
          let coinName = obj.coins
            ?.filter((e) => e.chain_detected)
            ?.map((name) => name.coinName);
          let address = obj.address;
          let nickname = obj.nickname;
          blockchainDetected.push({ address: address, names: coinName });
          nicknames.push({ address: address, nickname: nickname });
        });

      AddWalletAddress({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        addresses_added: address,
        ENS_added: address,
        addresses_deleted: addressDeleted,
        ENS_deleted: addressDeleted,
        unrecognized_addresses: unrecog_address,
        recognized_addresses: recog_address,
        blockchains_detected: blockchainDetected,
        nicknames: nicknames,
      });
    }, 100);
  };
  handleSignText = () => {
    this.props.switchSignIn();
  };

  handleTabPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      // your function code here
      this.addInputField();
    }
  };
  shouldRenderDelete = (index) => {
    let letItRender = true;
    this.state.walletInput?.map((res, i) => {
      if (
        this.state.walletInput[index].address &&
        res.id === `wallet${index + 1}`
      ) {
        if (
          (!res.coinFound || res.coins.length <= 0) &&
          res.coins.length !== this.props.OnboardingState.coinsList.length
        ) {
          letItRender = false;
        }
      }
    });

    return letItRender;
  };
  shouldRenderDeleteLineTwo = (showAddress, index) => {
    if (showAddress) {
      return false;
    }
    let letItRender = true;
    this.state.walletInput?.map((res, i) => {
      if (
        this.state.walletInput[index].address &&
        res.id === `wallet${index + 1}`
      ) {
        if (
          (!res.coinFound || res.coins.length <= 0) &&
          res.coins.length !== this.props.OnboardingState.coinsList.length
        ) {
          letItRender = false;
        }
      }
    });

    return letItRender;
  };
  render() {
    return (
      <>
        {!this.state.showWarningMsg ? (
          <Form
            onValidSubmit={
              this.state.addButtonVisible
                ? this.onValidSubmit
                : this.handleSignText
            }
          >
            <div className="addWalletWrapperContainerParent">
              <div className="addWalletWrapperContainer">
                {this.state.walletInput?.map((c, index) => {
                  return (
                    <div
                      style={index === 9 ? { marginBottom: "0rem" } : {}}
                      className="addWalletWrapper inter-display-regular f-s-15 lh-20"
                    >
                      {this.state.walletInput.length > 1 ? (
                        <Image
                          key={index}
                          className={`awOldDelBtn`}
                          // ${this.isDisabled()&& c.address  ? 'not-allowed' : ""}
                          src={DeleteIcon}
                          onClick={() => this.deleteInputField(index, c)}
                        />
                      ) : (
                        <Image
                          key={index}
                          className={`awOldDelBtn fakeBtn`}
                          src={DeleteIcon}
                        />
                      )}
                      <div
                        className={`awInputWrapper ${
                          this.state.walletInput[index].address
                            ? "isAwInputWrapperValid"
                            : null
                        }`}
                      >
                        <>
                          {c.showAddress && (
                            <div className="awTopInputWrapper">
                              <div className="awInputContainer">
                                <input
                                  name={`wallet${index + 1}`}
                                  value={c.address || ""}
                                  className={`inter-display-regular f-s-15 lh-20 awInput`}
                                  placeholder="Paste any wallet address or ENS here"
                                  title={c.address || ""}
                                  onChange={(e) => this.handleOnChange(e)}
                                  onKeyDown={this.handleTabPress}
                                  onFocus={(e) => {
                                    this.FocusInInput(e);
                                    this.setState({
                                      isTrendingAddresses: true,
                                    });
                                    if (
                                      this.props.makeTrendingAddressesVisible
                                    ) {
                                      this.props.makeTrendingAddressesVisible();
                                    }
                                  }}
                                />
                              </div>

                              {this.state.walletInput?.map((e, i) => {
                                if (
                                  this.state.walletInput[index].address &&
                                  e.id === `wallet${index + 1}`
                                ) {
                                  // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                  if (e.coinFound && e.coins.length > 0) {
                                    return (
                                      <CustomCoin
                                        isStatic
                                        coins={e.coins.filter(
                                          (c) => c.chain_detected
                                        )}
                                        key={i}
                                        isLoaded={true}
                                      />
                                    );
                                  } else {
                                    if (
                                      e.coins.length ===
                                      this.props.OnboardingState.coinsList
                                        .length
                                    ) {
                                      return (
                                        <CustomCoin
                                          isStatic
                                          coins={null}
                                          key={i}
                                          isLoaded={true}
                                        />
                                      );
                                    } else {
                                      return (
                                        <CustomCoin
                                          isStatic
                                          coins={null}
                                          key={i}
                                          isLoaded={false}
                                        />
                                      );
                                    }
                                  }
                                } else {
                                  return "";
                                }
                              })}
                            </div>
                          )}
                          {c.coinFound && c.showNickname && (
                            <div
                              className={`awBottomInputWrapper ${
                                c.showAddress ? "mt-2" : ""
                              }`}
                            >
                              <div className="awInputContainer">
                                {c.nickname && c.nickname !== "" ? (
                                  <div className="awLable">Private Nametag</div>
                                ) : null}
                                {/* <div className="awLable">Private Nametag</div> */}
                                <input
                                  name={`wallet${index + 1}`}
                                  value={c.nickname || ""}
                                  className={`inter-display-regular f-s-15 lh-20 awInput`}
                                  placeholder="Enter Private Nametag"
                                  title={c.nickname || ""}
                                  onChange={(e) => {
                                    this.nicknameOnChain(e);
                                  }}
                                  onBlur={(e) => {
                                    LandingPageNickname({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                      nickname: e.target?.value,
                                      address: c.address,
                                    });
                                  }}
                                  onFocus={(e) => {
                                    this.FocusInInput(e);
                                  }}
                                />
                              </div>
                              {!c.showAddress &&
                                this.state.walletInput?.map((e, i) => {
                                  if (
                                    this.state.walletInput[index].address &&
                                    e.id === `wallet${index + 1}`
                                  ) {
                                    // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                                    if (e.coinFound && e.coins.length > 0) {
                                      return (
                                        <CustomCoin
                                          isStatic
                                          coins={e.coins.filter(
                                            (c) => c.chain_detected
                                          )}
                                          key={i}
                                          isLoaded={true}
                                        />
                                      );
                                    } else {
                                      if (
                                        e.coins.length ===
                                        this.props.OnboardingState.coinsList
                                          .length
                                      ) {
                                        return (
                                          <CustomCoin
                                            isStatic
                                            coins={null}
                                            key={i}
                                            isLoaded={true}
                                          />
                                        );
                                      } else {
                                        return (
                                          <CustomCoin
                                            isStatic
                                            coins={null}
                                            key={i}
                                            isLoaded={false}
                                          />
                                        );
                                      }
                                    }
                                  } else {
                                    return "";
                                  }
                                })}
                              {/* {c.showNameTag && c.nameTag ? (
                                <div className="awBlockContainer">
                                  <div className="awLable">Name tag</div>
                                  <div className="awNameTag">{c.nameTag}</div>
                                </div>
                              ) : null} */}
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {this.state.addButtonVisible &&
            this.state.walletInput?.length < 10 ? (
              <div className="addAnotherBtnContainer">
                <Button className="grey-btn w-100" onClick={this.addInputField}>
                  <Image src={PlusIcon} /> Add another
                </Button>
              </div>
            ) : null}
            {this.state.walletInput &&
            !this.state.walletInput[0].address &&
            this.state.walletInput.length === 1 &&
            this.props.isTrendingAddresses ? (
              <div className="trendingAddressesContainer">
                <div className="trendingAddressesBlock">
                  <div className="trendingAddressesBlockHeader">
                    <Image
                      src={TrendingFireIcon}
                      className="trendingAddressesBlockFire"
                    />
                    <div className="inter-display-medium f-s-16 lh-15 ml-2 mr-2">
                      Trending addresses
                    </div>
                    <div className="inter-display-medium f-s-12 lh-15 trendingAddressesBlockSubText">
                      Most-visited addresses in the last 24 hours
                    </div>
                  </div>
                  <div className="trendingAddressesBlockList">
                    {this.props.trendingAddresses &&
                      this.props.trendingAddresses.map((data, index) => {
                        return (
                          <div className="trendingAddressesBlockItemContainer">
                            <div
                              onClick={() => {
                                this.props.addTrendingAddress(index, false);
                              }}
                              className="trendingAddressesBlockItem"
                            >
                              <div className="trendingAddressesBlockItemWalletContainer">
                                <Image
                                  className="trendingAddressesBlockItemWallet"
                                  src={TrendingWalletIcon}
                                />
                              </div>
                              <div className="trendingAddressesBlockItemDataContainer">
                                <div className="inter-display-medium f-s-13">
                                  {data.trimmedAddress}
                                </div>
                                <div className="inter-display-medium f-s-11 lh-15 trendingAddressesBlockItemDataContainerAmount">
                                  $
                                  {numToCurrency(
                                    data.worth.toFixed(2)
                                  ).toLocaleString("en-US")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : null}

            {this.state.connectExchange && (
              <div className="ob-connect-exchange">
                {/* upload */}
                {/* <div
                  className="inter-display-semi-bold f-s-13 lh-16 black-191 connect-exchange-btn"
                  style={{left:"5.6rem",right:"auto"}}
                  onClick={this.handleUpload}
                >
                  <input
                    type="file"
                    ref={this.fileInputRef}
                    onChange={this.handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <Image
                    src={UploadIcon}
                    style={{
                      width: "1.2rem",
                      marginRight: "4px",
                      marginBottom: "1px",
                      filter: "brightness(0)",
                    }}
                  />
                  Upload CSV / Text file
                </div> */}
                <div
                  className="inter-display-semi-bold f-s-13 lh-16 black-191 connect-exchange-btn"
                  onClick={() => {
                    this.props.connectWallet(this.state.walletInput);
                  }}
                >
                  <Image
                    src={LinkIconBtn}
                    style={{
                      width: "1.2rem",
                      marginRight: "4px",
                      marginBottom: "1px",
                    }}
                  />
                  {this.state.connectText}
                </div>
              </div>
            )}

            <div className="ob-modal-body-btn">
              {/* <CustomButton
                  className="secondary-btn m-r-15 preview"
                  buttonText="Preview demo instead"
                  onClick={() => {
                    PreviewDemo({});
                  }}
                /> */}
              <CustomButton
                className="primary-btn go-btn"
                type="submit"
                isLoading={
                  this.state.addButtonVisible ? this.isDisabled(true) : false
                }
                isDisabled={
                  (this.state.addButtonVisible ? this.isDisabled() : true) ||
                  this.state.disableGoBtn
                }
                buttonText="Go"
              />
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
                <Image src={FileIcon} style={{ marginRight: "1rem" }} />
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
                  {this.state.uploadStatus} {this.state.total_unique_address}{" "}
                  {this.state.total_unique_address > 0
                    ? "unique addresses"
                    : "unique address"}
                </h4>
              </>
            )}
            {/* Form */}
            <>
              <div
                className="form-wrapper m-t-20"
                style={{ margin: "2rem 10rem" }}
              >
                {/* <Image src={FileIcon} /> */}
                {!this.state.emailAdded && !this.state.isIndexed && (
                  <h4 className="inter-display-medium f-s-16 lh-19 grey-969 m-b-20">
                    Don’t wait around if you don’t want to! We can notify you
                    when the indexing is complete.
                  </h4>
                )}
                {!this.state.emailAdded && !this.state.isIndexed && (
                  <div className="email-section">
                    <Form onValidSubmit={this.EmailNotification}>
                      <FormElement
                        valueLink={this.linkState(this, "email_notification")}
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
                            placeholder: "Enter your email address",
                          },
                        }}
                      />
                      <div className="save-btn-section">
                        <Button
                          className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                            this.state.email_notification ? "active" : ""
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
                {(this.state.emailAdded || this.state.isIndexed) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "start",
                    }}
                  >
                    <Image
                      src={this.state.isIndexed ? CheckIcon : ClockIcon}
                      style={{
                        marginRight: "1rem",
                        position: "static",
                        width: "3rem",
                      }}
                    />
                    <h4 className="inter-display-medium f-s-16 lh-19 grey-969">
                      {this.state.isIndexed
                        ? "Great! Indexing is completed and your addresses has been added."
                        : "It takes some time to index the addresses, we will let you know when it’s done."}
                    </h4>
                  </div>
                )}
              </div>
              {(this.state.emailAdded || this.state.isIndexed) && (
                <Button
                  className="btn primary-btn m-t-12 m-b-20"
                  onClick={this.handleDone}
                >
                  Done
                </Button>
              )}
            </>
          </div>
        )}
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={window.localStorage.getItem("share_id")}
            // isStatic={this.state.isStatic}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  getAllCoins,
  detectCoin,
  detectNameTag,
  createAnonymousUserApi,
  getAllParentChains,
  setHeaderReducer,
  updateUserWalletApi,
  GetAllPlan,
  addExchangeTransaction,
  addUserCredits,
};
AddWallet.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);
