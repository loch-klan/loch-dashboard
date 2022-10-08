import React from 'react'
import { Image } from 'react-bootstrap'
import CopyClipboardIcon from '../../assets/images/CopyClipboardIcon.svg'
import MetamaskIcon from '../../assets/images/MetamaskIcon.svg'
import CoinChip from './CoinChip';
import EditIcon from '../../assets/images/EditIcon.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import EditWalletModal from './EditWalletModal';
import EthereumTextIcon from '../../assets/images/icons/EthereumTextIcon.svg';
import unrecognisedIcon from '../../image/unrecognised.png';
import { numToCurrency } from './../../utils/ReusableFunctions';
export default function WalletCard(props) {
    const [show, setShow] = React.useState(false);
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
                // text={coin.value}
                text={coin.value.toFixed(2)}
                IconImage={EthereumTextIcon}
            >
                <div>
                    <CoinChip
                        key={index}
                        coin_img_src={coin.symbol}
                        coin_percent={coin.value.toFixed(2)}
                    />
                </div>
            </CustomOverlay>

        )
    })
    const copyContent = () => {
        const text = props.wallet_account_number
        navigator.clipboard.writeText(text)
    }
    return (
        <div className="walletcard">

            <div className='m-b-32 wallet-details'>
                <div className='wallet-account-details'>

                    <div className='m-r-16 wallet-img'>
                        <Image src={props.wallet_metadata ? props.wallet_metadata.symbol : unrecognisedIcon} />
                    </div>

                    <div className='m-r-16 wallet-name-details'>
                        <h6 className={`inter-display-medium f-s-20 lh-24 ${props.wallet_name ? "m-r-16" : ""}`}>{props.coin_name || "Undefined"}</h6>
                        {props.wallet_name && <div className='inter-display-medium f-s-16 lh-19 wallet-name'>{props.wallet_name} </div>}
                    </div>

                    <div className='account-details' onClick={copyContent}>
                        <span className='inter-display-regular f-s-13 lh-16' id="account_number">{props.wallet_account_number}</span>
                        <Image src={CopyClipboardIcon}
                        />
                    </div>

                </div>
                <div className='amount-details'>
                    <h6 className='inter-display-medium f-s-20 lh-24' >{numToCurrency(props.wallet_amount)}</h6>
                    <span className='inter-display-semi-bold f-s-10 lh-12'>USD</span>
                </div>
            </div>

            <div className='coins-chip'>
                <div className='chips-section'>
                    {chips}
                </div>
                <Image src={EditIcon} className="cp" onClick={handleShow} />
                {/* onClick={handleShow} */}
            </div>

            {
                show ?
                    <EditWalletModal
                        show={show}
                        onHide={handleClose}
                        walletIcon={MetamaskIcon}
                        walletAddress={props.wallet_account_number}
                        dropDownList={props.dropDrowList}
                        coinchips={props.wallet_coins}
                    /> : ""
            }

        </div>
    )
}
