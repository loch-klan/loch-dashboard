import React, {useEffect} from 'react'
import {useRef} from 'react'
import { Button, Image } from "react-bootstrap"
import arrowUpRight from '../../assets/images/icons/green-arrow.svg'
import arrowDownRight from '../../assets/images/icons/red-arrow.svg'
import CustomLoader from "../common/CustomLoader";
import { CurrencyType, numToCurrency } from '../../utils/ReusableFunctions';
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import { amountFormat } from '../../utils/ReusableFunctions';
import ManageWallet from "../../assets/images/icons/ManageWallet.svg"
import ManageWalletWhite from "../../assets/images/icons/ManageWalletWhite.svg"
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg"
import AddWalletAddressWhite from "../../assets/images/icons/AddWalletAddressWhite.svg"
import LinkIcon from "../../assets/images/icons/link.svg";
import LinkIconBtn from "../../assets/images/link.svg";
// import ConnectModal from "./ConnectModal";
import { useHistory } from "react-router-dom";
import ConnectModal from '../common/ConnectModal'
import AuthModal from '../common/AuthModal'
import { ConnectExPopup, HomeConnectExchange } from '../../utils/AnalyticsFunctions'
import { getCurrentUser } from '../../utils/ManageToken'
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";

export default function WelcomeCard(props) {
    const [manageWallet, setManageWallet] = React.useState(true)
  const [AddWallet, setAddWallet] = React.useState(true);
  const [connectModal, setconnectModal] = React.useState(false);
  const [signinModal, setSigninModal] = React.useState(false);
    // const [addWallet, setAddWallet] = React.useState(true)
    // console.log(props)
    function handleAddWalletClick(){
        props.handleAddModal();
    }
    function handleManageClick(){
        // setManageWallet(!manageWallet);
        props.handleManage();
    }
  
  const history = useHistory();
  
  const handleSigninModal = () => {
    setSigninModal(!signinModal);

    // SigninMenu({
    //   session_id: getCurrentUser().id,
    // });
  };
  
  const handleConnectModal = () => {
   
    setconnectModal(!connectModal);

     setTimeout(() => {
       if (connectModal) {
          HomeConnectExchange({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
       }
     }, 200);
  };
  let lochUser = JSON.parse(localStorage.getItem("lochUser"));
  const [popupModal, setpopupModal] = React.useState(false);
  const handlePopup = () => {
     let lochUser = JSON.parse(localStorage.getItem("lochUser"));
     if (!lochUser) {
       setpopupModal(!popupModal);
       setTimeout(() => {
         if (popupModal) {
           ConnectExPopup({
             session_id: getCurrentUser().id,
             email_address: getCurrentUser().email,
             from: "Home connect exchange",
           });
         }
       }, 200);
     }
  }


    let difference = (props.assetTotal && props.yesterdayBalance) ? props.assetTotal - props.yesterdayBalance : 0;
    let percent = props.assetTotal && ((difference/props.assetTotal)*100).toFixed(2);
    return (
      // <div className="welcome-card-section">
      //   <div className="welcome-card">
      //     <div className="welcome-card-upper-section">
      //       <div className="welcome-section-left">
      //         <h1 className="inter-display-medium f-s-24 lh-30 black-191 welcome-title">
      //           Welcome to Loch
      //         </h1>
      //         <p className="inter-display-medium">
      //           Add your wallet address(es) to receive
      //         </p>
      //         <p className="inter-display-medium m-b-24">
      //           personalized financial intelligence immediately.
      //         </p>
      //       </div>
      //       <div className="welcome-section-right">
      //         {props.assetTotal !== null && !props.isLoading ? (
      //           <CustomOverlay
      //             position="top"
      //             isIcon={false}
      //             isInfo={true}
      //             isText={true}
      //             text={
      //               CurrencyType(false) +
      //               amountFormat(props.assetTotal, "en-US", "USD") +
      //               CurrencyType(true)
      //             }
      //           >
      //             <h3 className="space-grotesk-medium wallet-amount">
      //               {CurrencyType(false)}
      //               {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
      //               {numToCurrency(props.assetTotal)} {CurrencyType(true)}
      //             </h3>
      //           </CustomOverlay>
      //         ) : (
      //           <CustomLoader loaderType="text" />
      //         )}
      //         <div
      //           className={`growth-div inter-display-medium f-s-14 lh-19 grey-313 ${
      //             difference < 0 ? "downfall" : ""
      //           }`}
      //         >
      //           <Image src={difference < 0 ? arrowDownRight : arrowUpRight} />
      //           {numToCurrency(difference) + "(" + Math.round(percent) + "%)"}
      //         </div>
      //       </div>
      //     </div>
      //     <div className="welcome-btn">
      //       {/* <Button className='secondary-btn' onClick={props.handleManage} >Manage wallets</Button>
      //                   <Button className="primary-btn" onClick={props.handleAddModal}>Add wallet address</Button> */}
      //       <Button
      //         className="inter-display-semi-bold f-s-13 lh-16 black-191 manage-wallet"
      //         onClick={handleConnectModal}
      //         onMouseEnter={() => setManageWallet(false)}
      //         onMouseLeave={() => setManageWallet(true)}
      //       >
      //         <Image className="connect-exchange-img" src={LinkIconBtn} />
      //         Connect exchange
      //       </Button>
      //       {/* <Button
      //         className="inter-display-semi-bold f-s-13 lh-16 black-191 manage-wallet"
      //         onClick={handleManageClick}
      //         onMouseEnter={() => setManageWallet(false)}
      //         onMouseLeave={() => setManageWallet(true)}
      //       >
      //         <Image
      //           // className="manage-wallet"
      //           src={manageWallet === true ? ManageWallet : ManageWalletWhite}
      //         />
      //         Manage wallets
      //       </Button> */}
      //       <Button
      //         // class="add-wallet"
      //         className="inter-display-semi-bold f-s-13 lh-16 black-191 add-wallet"
      //         onClick={handleAddWalletClick}
      //         onMouseEnter={() => setAddWallet(false)}
      //         onMouseLeave={() => setAddWallet(true)}
      //       >
      //         <Image
      //           src={
      //             AddWallet === true ? AddWalletAddress : AddWalletAddressWhite
      //           }
      //         />
      //         Add wallet address
      //       </Button>
      //     </div>
      //   </div>
      //   {connectModal ? (
      //     <ConnectModal
      //       show={connectModal}
      //       onHide={handleConnectModal}
      //       history={history}
      //       headerTitle={"Connect exchanges"}
      //       modalType={"connectModal"}
      //       iconImage={LinkIcon}
      //       openPopup={handlePopup}
      //       tracking="home page"
      //     />
      //   ) : (
      //     ""
      //   )}

      //   {popupModal ? (
      //     <AuthModal
      //       show={popupModal}
      //       onHide={handlePopup}
      //       history={history}
      //       modalType={"create_account"}
      //       iconImage={LinkIcon}
      //       hideSkip={true}
      //       title="Don’t lose your data"
      //       description="Don’t let your hard work go to waste. Add your email so you can analyze your CeFi and DeFi portfolio together"
      //       stopUpdate={true}
      //       tracking="Home connect exchange"
      //     />
      //   ) : (
      //     ""
      //   )}
      // </div>
      <div className="welcome-card-section-topbar">
        <div className="welcome-card-topbar">
          <div className="row-div">
            <div
              className="topbar-btn"
              style={{ marginRight: "1.7rem", marginLeft:"11rem" }}
              onClick={handleConnectModal}
            >
              <Image className="connect-exchange-img" src={LinkIconBtn} />
              Connect exchange
            </div>
            <div className="topbar-btn" onClick={handleAddWalletClick}>
              <Image src={AddWalletAddress} />
              Add wallet address
            </div>
          </div>
          <div className="row-div">
            <div
              className={`growth-div inter-display-medium f-s-13 lh-15 grey-313 ${
                difference < 0 ? "downfall" : ""
              }`}
              style={{ marginRight: "1.2rem" }}
            >
              <Image src={difference < 0 ? arrowDownRight : arrowUpRight} />
              {numToCurrency(difference) + "(" + Math.round(percent) + "%)"}
            </div>
            {props.assetTotal !== null && !props.isLoading ? (
              <CustomOverlay
                position="bottom"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  amountFormat(props.assetTotal, "en-US", "USD") +
                  CurrencyType(true)
                }
              >
                <h3 className="space-grotesk-medium wallet-amount">
                  {CurrencyType(false)}
                  {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                  {numToCurrency(props.assetTotal)} {CurrencyType(true)}
                </h3>
              </CustomOverlay>
            ) : (
              <CustomLoader loaderType="text" />
            )}
            {!lochUser && <span
              onClick={handleSigninModal}
              style={{ marginLeft: "3.4rem" }}
              className="signin"
            >
              <Image src={SignInIcon} />
              <Button className="inter-display-medium f-s-16 lh-19 navbar-button">
                Sign in
              </Button>
            </span>}
          </div>
        </div>
        {connectModal ? (
          <ConnectModal
            show={connectModal}
            onHide={handleConnectModal}
            history={history}
            headerTitle={"Connect exchanges"}
            modalType={"connectModal"}
            iconImage={LinkIcon}
            openPopup={handlePopup}
            tracking="home page"
          />
        ) : (
          ""
        )}

        {popupModal ? (
          <AuthModal
            show={popupModal}
            onHide={handlePopup}
            history={history}
            modalType={"create_account"}
            iconImage={LinkIcon}
            hideSkip={true}
            title="Don’t lose your data"
            description="Don’t let your hard work go to waste. Add your email so you can analyze your CeFi and DeFi portfolio together"
            stopUpdate={true}
            tracking="Home connect exchange"
          />
        ) : (
          ""
        )}
        {signinModal ? (
          <AuthModal
            show={signinModal}
            onHide={handleSigninModal}
            history={history}
            modalType={"create_account"}
            iconImage={SignInIcon}
            hideSkip={true}
            title="Sign in"
            description="Get right back into your account"
            stopUpdate={true}
            tracking="Sign in button"
          />
        ) : (
          ""
        )}
      </div>
    );
}
