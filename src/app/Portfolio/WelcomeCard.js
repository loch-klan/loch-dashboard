import React, {useEffect} from 'react'
import {useRef} from 'react'
import { Button, Image } from "react-bootstrap"
import arrowUpRight from '../../assets/images/icons/green-arrow.svg'
import arrowDownRight from '../../assets/images/icons/red-arrow.svg'
import CustomLoader from "../common/CustomLoader";
import { numToCurrency } from '../../utils/ReusableFunctions';
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import { amountFormat } from '../../utils/ReusableFunctions';
import ManageWallet from "../../assets/images/icons/ManageWallet.svg"
import ManageWalletWhite from "../../assets/images/icons/ManageWalletWhite.svg"
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg"
import AddWalletAddressWhite from "../../assets/images/icons/AddWalletAddressWhite.svg"
export default function WelcomeCard(props) {
    const [manageWallet, setManageWallet] = React.useState(true)
    const [AddWallet, setAddWallet] = React.useState(true);
    // const [addWallet, setAddWallet] = React.useState(true)
    // console.log(props)
    function handleAddWalletClick(){
        props.handleAddModal();
    }
    function handleManageClick(){
        // setManageWallet(!manageWallet);
        props.handleManage();
    }

    // React.useEffect(() =>{
    //     document.addEventListener("click", handleClickOutside, true)
    // },[])
    // const refOne = useRef(null)
    // const handleClickOutside = (e) =>{
    // if(!refOne.current?.contains(e.target)){
    //     // console.log("Clicked outside ...");
    //     props.handleToggleAddWallet();
    //     // setAddWallet(true);
    // }
    // // else{
    // //     console.log("Clicked inside ...");
    // // }
    // }

    let difference = (props.assetTotal && props.yesterdayBalance) ? props.assetTotal - props.yesterdayBalance : 0;
    let percent = props.assetTotal && ((difference/props.assetTotal)*100).toFixed(2);
    return (
      <div className="welcome-card-section">
        <div className="welcome-card">
          <div className="welcome-card-upper-section">
            <div className="welcome-section-left">
              <h1 className="inter-display-medium f-s-25 lh-30 black-191 welcome-title">
                Welcome to Loch
              </h1>
              <p className="inter-display-medium">
                Add your wallet address(es) to receive
              </p>
              <p className="inter-display-medium m-b-24">
                personalized financial intelligence immediately.
              </p>
            </div>
            <div className="welcome-section-right">
            <div className={`growth-div inter-display-medium f-s-16 lh-19 grey-313 ${difference < 0 ? "downfall" : ""}`}>
                <Image src={difference < 0 ? arrowDownRight : arrowUpRight} />{difference?.toFixed(2) + "(" + Math.round(percent) + "%)"}
              </div>
              {props.assetTotal !== null ? (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    "$" + amountFormat(props.assetTotal, "en-US", "USD") + "USD"
                  }
                >
                  <h3 className="space-grotesk-medium wallet-amount">
                    $
                    {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                    {numToCurrency(props.assetTotal)} USD
                  </h3>
                </CustomOverlay>
              ) : (
                <CustomLoader loaderType="text" />
              )}

            </div>
          </div>
          <div className="welcome-btn">
            {/* <Button className='secondary-btn' onClick={props.handleManage} >Manage wallets</Button>
                        <Button className="primary-btn" onClick={props.handleAddModal}>Add wallet address</Button> */}
            <Button
              className="inter-display-semi-bold f-s-13 lh-16 black-191 manage-wallet"
              onClick={handleManageClick}
              onMouseEnter={() => setManageWallet(false)}
              onMouseLeave={() => setManageWallet(true)}
            >
              <Image
                // className="manage-wallet"
                src={manageWallet === true ? ManageWallet : ManageWalletWhite}
              />
              Manage wallets
            </Button>
            <Button
              // class="add-wallet"
              className="inter-display-semi-bold f-s-13 lh-16 black-191 add-wallet"
              onClick={handleAddWalletClick}
              onMouseEnter={() => setAddWallet(false)}
              onMouseLeave={() => setAddWallet(true)}
            >
              <Image
                src={
                  AddWallet === true ? AddWalletAddress : AddWalletAddressWhite
                }
              />
              Add wallet address
            </Button>
          </div>
        </div>
      </div>
    );
}
