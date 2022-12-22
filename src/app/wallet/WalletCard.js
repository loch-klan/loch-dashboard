import React from 'react'
import { Button, Image } from 'react-bootstrap'
import CopyClipboardIcon from '../../assets/images/CopyClipboardIcon.svg'
import CoinChip from './CoinChip';
import EditIcon from '../../assets/images/EditIcon.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import EditWalletModal from './EditWalletModal';
import unrecognizedIcon from '../../image/unrecognized.svg';
import { amountFormat, numToCurrency } from './../../utils/ReusableFunctions';
// import CopiedModal from '../common/_utils/CopiedModal';
import FixAddModal from '../common/FixAddModal';
// import Loading from '../common/Loading';
import { toast } from 'react-toastify';
export default function WalletCard(props) {
    const [show, setShow] = React.useState(false);
    // const [showModal, toggleCopied] = React.useState(false);
    function handleClose() {
        setShow(false);
    }
    function handleShow() {
        setShow(true)
    }
    const chips = props.wallet_coins.map((coin, index) => {
        return (
            <CustomOverlay
                position="top"
                // isIcon={true}
                isIcon={false}
                isInfo={true}
                key={index}
                isText={true}
                isName={coin.chain.name}
                colorCode={coin.chain.color}
                text={ coin.chain.percentage ? coin.chain.percentage.toFixed(2) : 0 + "%  " + amountFormat(coin.value.toFixed(2),'en-US','USD') + " USD"}
                className="wallet-tooltip"
            >
                <div>
                    <CoinChip
                        colorCode={coin.chain.color}
                        key={index}
                        coin_img_src={coin.chain.symbol}
                        coin_percent={coin.chain.percentage ? coin.chain.percentage.toFixed(2) : 0 + "%"}
                    />
                </div>
            </CustomOverlay>

        )
    })
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
    }
    const [showFixModal , setShowFixModal] = React.useState(0)
    const handleFixModal = ()=>{
        setShowFixModal(prev => !prev)
    }
    return (<>
        <div className="walletcard">
        <>
            <div className='m-b-32 wallet-details'>
                <div className='wallet-account-details'>
                    <div className='m-r-16 wallet-img'>
                        <Image src={props.wallet_metadata ? props.wallet_metadata.symbol : unrecognizedIcon} />
                    </div>
                        <h6 className={`inter-display-medium f-s-20 lh-24 ${props.wallet_metadata && props.wallet_metadata.name ? "m-r-16" : ""}`}>{props.wallet_metadata || props.wallet_coins.length>0 ? props.wallet_metadata ? props.wallet_metadata.name : `` : "Unrecognized wallet"}</h6>
                        {props.tag &&
                            <CustomOverlay
                            position="top"
                            // isIcon={true}
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={props.tag}
                            >
                            <div className='inter-display-medium f-s-16 lh-19 wallet-name m-r-16'>{props.tag}
                            </div>
                            </CustomOverlay>
                        }
                    <div className='account-details'>
                        {
                          props.display_address &&
                          <>
                          <span className='inter-display-regular f-s-13 lh-16' id="account_number">{props.display_address}</span>
                          <Image src={CopyClipboardIcon} onClick={()=>copyContent(props.display_address)} className="m-l-10 m-r-12 cp" />
                        </>
                        }
                        {
                          props.wallet_account_number &&
                          <>
                          <span className='inter-display-regular f-s-13 lh-16' id="account_number">{props.wallet_account_number}</span>
                          <Image src={CopyClipboardIcon} onClick={()=>copyContent(props.wallet_account_number)} className="m-l-10 m-r-12 cp" />
                          </>
                        }

                    </div>
                    {/* </div> */}
                </div>
                <div className='amount-details'>
                    <h6 className='inter-display-medium f-s-20 lh-24' >{numToCurrency(props.wallet_amount)}</h6>
                    <span className='inter-display-semi-bold f-s-10 lh-12'>USD</span>
                </div>
            </div>
            <div className='coins-chip'>
              {
                props.wallet_coins.length>0
                ?
                <>
                <div className='chips-section'>{chips}</div>
                <Image src={EditIcon} className="cp" onClick={handleShow} />
                </>
                :
                <>
                <h6 className='inter-display-medium f-s-16 lh-19 grey-B0B'>This wallet address is not detected. Please fix it now.</h6>
                <Button className='secondary-btn' onClick={handleFixModal}>Fix now</Button>
                </>
              }
            </div>
            {
                show
                  ?
                    <EditWalletModal
                        show={show}
                        onHide={handleClose}
                        createdOn={props.createdOn}
                        walletAddress={props.wallet_account_number}
                        displayAddress={props.display_address}
                        walletMetaData={props.wallet_metadata}
                        tag={props.tag}
                        coinchips={props.wallet_coins}
                        makeApiCall={()=>props.makeApiCall()}
                    />
                    :
                    ""
            }
            {showFixModal ?
               <FixAddModal
               show={showFixModal}
               onHide={handleFixModal}
               //  modalIcon={AddWalletModalIcon}
               title="Fix your wallet connection"
               subtitle="Add your wallet address to get started"
               fixWalletAddress={[props.wallet_account_number]}
               btnText="Done"
               btnStatus={true}
               modalType="fixwallet"
               pathName="/wallets"
               history={props.history}
            //    makeApiCall={props.makeApiCall}
            handleUpdateWallet = {props.handleUpdateWallet}
           />
           :""
            }
        </>

        </div>
        </>

    )
}
