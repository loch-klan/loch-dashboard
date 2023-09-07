import React from "react";
import { Button, Image } from "react-bootstrap";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import CoinChip from "./CoinChip";
import EditIcon from "../../assets/images/EditIcon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import EditWalletModal from "./EditWalletModal";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import {
  amountFormat,
  CurrencyType,
  numToCurrency,
} from "./../../utils/ReusableFunctions";
// import CopiedModal from '../common/_utils/CopiedModal';
import FixAddModal from "../common/FixAddModal";
// import Loading from '../common/Loading';
import { toast } from "react-toastify";
import {
  AnalyzeAssetValue,
  FixUndetectedWallet,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import EditWalletExchange from "./EditWalletExchange";
export default function WalletCard(props) {
  const [show, setShow] = React.useState(false);
  const [EditModal, setEditModal] = React.useState(false);
  // const [showModal, toggleCopied] = React.useState(false);
  function handleClose() {
    setShow(false);
  }
  function handleShow() {
    setShow(true);
  }

  function handleEdit() {
    setEditModal((prev) => !prev);
  }
  const chips = props?.wallet_coins?.map((coin, index) => {
    return (
      <CustomOverlay
        position="top"
        // isIcon={true}
        isIcon={false}
        isInfo={true}
        key={index}
        isText={true}
        isName={coin?.chain?.name}
        colorCode={coin?.chain?.color}
        text={
          (coin.chain.percentage ? coin.chain.percentage.toFixed(2) : 0) +
          "%  " +
          CurrencyType(false) +
          numToCurrency(coin.value)
        }
        className="wallet-tooltip"
      >
        <div
          onMouseEnter={() => {
            AnalyzeAssetValue({
              // coin.chain.name
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              wallet_address: props.wallet_account_number,
              chain_name: coin.chain.name,
              percent_value:
                (coin.chain.percentage ? coin.chain.percentage.toFixed(2) : 0) +
                "%  " +
                CurrencyType(false) +
                numToCurrency(coin.value),
            });
          }}
        >
          <CoinChip
            colorCode={coin.chain.color}
            key={index}
            coin_img_src={coin.chain.symbol}
            coin_percent={
              (coin.chain.percentage ? coin.chain.percentage.toFixed(2) : 0) +
              "%"
            }
          />
        </div>
      </CustomOverlay>
    );
  });
  const copyContent = (text) => {
    // const text = props.display_address ? props.display_address : props.wallet_account_number
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
        // console.log("successfully copied");
      })
      .catch(() => {
        console.log("something went wrong");
      });
    // toggleCopied(true)
  };
  const [showFixModal, setShowFixModal] = React.useState(0);
  const handleFixModal = () => {
    setShowFixModal((prev) => !prev);
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (val) {
        return val.slice(0, 1).toUpperCase() + val.slice(1);
      })
      .join(" ");
  };

  return (
    <>
      <div
        className="walletcard"
        style={props?.protocol ? { paddingBottom: "2.4rem" } : {}}
      >
        <>
          <div className={`${!props?.protocol ? "m-b-32" : ""} wallet-details`}>
            <div className="wallet-account-details">
              <div className="m-r-16  wallet-img">
                <Image
                  src={
                    props.wallet_metadata
                      ? props.wallet_metadata.symbol
                      : unrecognizedIcon
                  }
                />
              </div>
              <h6
                className={`interDisplayMediumText f-s-20 lh-24 ${
                  props.wallet_metadata && props.wallet_metadata.name
                    ? "m-r-16"
                    : ""
                }`}
              >
                {props.wallet_metadata || props.wallet_coins.length > 0
                  ? props.wallet_metadata
                    ? toTitleCase(props.wallet_metadata.name)
                    : ``
                  : "Unrecognized wallet " + " "}
              </h6>
              {props.nickname && (
                <CustomOverlay
                  position="top"
                  // isIcon={true}
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={props.nickname}
                >
                  <div className="interDisplayMediumText f-s-16 lh-19 wallet-name m-r-16">
                    {props.nickname}
                  </div>
                </CustomOverlay>
              )}
              {props.protocol && (
                <Image
                  src={EditIcon}
                  onClick={handleEdit}
                  className="m-l-4 cp delete-icon"
                />
              )}
              {!props.protocol && (
                <div className="accountDetails">
                  {props.nameTag && (
                    <>
                      <span
                        className="interDisplayMediumText interDisplaySubText f-s-13 lh-16 mr-4"
                        id="account_number"
                      >
                        {props.nameTag}
                      </span>
                    </>
                  )}
                  {props.display_address && (
                    <>
                      <span className="interDisplayMediumText interDisplaySubText f-s-13 lh-16">
                        {props.display_address}
                      </span>
                      {!props.protocol && (
                        <Image
                          src={CopyClipboardIcon}
                          onClick={() => copyContent(props.display_address)}
                          className="m-l-10 m-r-12 cp"
                        />
                      )}
                    </>
                  )}
                  {props.wallet_account_number && (
                    <>
                      <span className="interDisplayMediumText interDisplaySubText f-s-13 lh-16">
                        {props.wallet_account_number}
                      </span>
                      {!props.protocol && (
                        <Image
                          src={CopyClipboardIcon}
                          onClick={() =>
                            copyContent(props.wallet_account_number)
                          }
                          className="m-l-10 m-r-12 cp"
                        />
                      )}
                    </>
                  )}
                </div>
              )}
              {/* </div> */}
            </div>
            <div className="amount-details">
              <h6 className="interDisplayMediumText f-s-20 lh-24">
                {numToCurrency(props.wallet_amount)}
              </h6>
              <div className="interDisplaySemiBoldText interDisplaySubText f-s-10 lh-12">
                {CurrencyType(true)}
              </div>
            </div>
          </div>
          {!props?.protocol && (
            <div className="coinsChip">
              {props.wallet_coins.length > 0 ? (
                <>
                  <div className="chipsSection">{chips}</div>
                  <Image src={EditIcon} className="cp" onClick={handleShow} />
                </>
              ) : (
                <>
                  <h6 className="interDisplayMediumText f-s-16 lh-19 grey-B0B">
                    This wallet address is not detected. Please fix it now.
                  </h6>
                  <Button
                    className="secondary-btn"
                    onClick={() => {
                      handleFixModal();
                      FixUndetectedWallet({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        undetected_address: props.wallet_account_number,
                      });
                    }}
                  >
                    Fix now
                  </Button>
                </>
              )}
            </div>
          )}
          {show ? (
            <EditWalletModal
              show={show}
              onHide={handleClose}
              createdOn={props.createdOn}
              walletAddress={props.wallet_account_number}
              displayAddress={props.display_address}
              walletMetaData={props.wallet_metadata}
              nickname={props.nickname}
              coinchips={props.wallet_coins}
              makeApiCall={() => props.makeApiCall()}
            />
          ) : (
            ""
          )}
          {EditModal ? (
            <EditWalletExchange
              show={handleEdit}
              onHide={handleEdit}
              nickname={props.nickname}
              walletMetaData={props.wallet_metadata}
              makeApiCall={() => props.makeApiCall()}
            />
          ) : (
            ""
          )}
          {showFixModal ? (
            <FixAddModal
              show={showFixModal}
              onHide={handleFixModal}
              //  modalIcon={AddWalletModalIcon}
              title="Fix your wallet address"
              subtitle="Add your wallet address to get started"
              fixWalletAddress={[props.wallet_account_number]}
              btnText="Done"
              btnStatus={true}
              modalType="fixwallet"
              pathName="/wallets"
              history={props.history}
              //    makeApiCall={props.makeApiCall}
              handleUpdateWallet={props.handleUpdateWallet}
            />
          ) : (
            ""
          )}
        </>
      </div>
    </>
  );
}
