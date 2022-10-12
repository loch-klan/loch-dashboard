import React from 'react'
import { Button, Image } from 'react-bootstrap'
import CopyClipboardIcon from '../../assets/images/CopyClipboardIcon.svg'
import CoinChip from './CoinChip';
import EditIcon from '../../assets/images/EditIcon.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import EditWalletModal from './EditWalletModal';
import unrecognisedIcon from '../../image/unrecognised.png';
import { amountFormat, numToCurrency } from './../../utils/ReusableFunctions';
import CopiedModal from '../common/_utils/CopiedModal';
export default function WalletCard(props) {
    const [show, setShow] = React.useState(false);
    const [showModal, toggleCopied] = React.useState(false);
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
                isIcon={true}
                isInfo={true}
                key={index}
                isText={true}
                isName={coin.chain.name}
                colorCode={coin.chain.color}
                text={ coin.chain.percentage.toFixed(2) + "%  " + amountFormat(coin.value.toFixed(2),'en-US','USD') + " USD"}
            >
                <div>
                    <CoinChip
                        key={index}
                        coin_img_src={coin.chain.symbol}
                        coin_percent={coin.chain.percentage.toFixed(2) + "%"}
                    />
                </div>
            </CustomOverlay>

        )
    })
    const copyContent = () => {
        const text = props.wallet_account_number
        navigator.clipboard.writeText(text)
        // toggleCopied(true)
    }
    return (
        <div className="walletcard">
          {/* {
            <CopiedModal show={showModal} onHide={()=>toggleCopied(false)} />
          } */}
            <div className='m-b-32 wallet-details'>
                <div className='wallet-account-details'>
                    <div className='m-r-16 wallet-img'>
                        <Image src={props.wallet_metadata ? props.wallet_metadata.symbol : unrecognisedIcon} />
                    </div>
                    <div className='m-r-16 wallet-name-details'>
                        <h6 className={`inter-display-medium f-s-20 lh-24 ${props.wallet_name ? "m-r-16" : ""}`}>{props.wallet_metadata || props.wallet_coins.length>0 ? props.wallet_metadata ? props.wallet_metadata.name : "Undefined" : "Unrecognised wallet"}</h6>
                        {props.wallet_metadata && props.wallet_metadata.tag && <div className='inter-display-medium f-s-16 lh-19 wallet-name m-l-10'>{props.wallet_metadata.tag} </div>}
                    </div>
                    <div className='account-details' onClick={copyContent}>
                        <span className='inter-display-regular f-s-13 lh-16' id="account_number">{props.wallet_account_number}</span>
                        <Image src={CopyClipboardIcon} className="m-l-10" />
                    </div>
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
                <h6 className='inter-display-medium f-s-16 lh-19 grey-B0B'>This wallet address is not dected, please fix it now.</h6>
                <Button className='secondary-btn'>Fix now</Button>
                </>
              }
            </div>
            {
                show
                  ?
                    <EditWalletModal
                        show={show}
                        onHide={handleClose}
                        walletAddress={props.wallet_account_number}
                        walletMetaData={props.wallet_metadata}
                        coinchips={props.wallet_coins}
                        makeApiCall={props.makeApiCall}
                    />
                    :
                    ""
            }
        </div>
    )
}
