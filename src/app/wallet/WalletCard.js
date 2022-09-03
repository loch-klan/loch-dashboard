import React from 'react'
import { Image } from 'react-bootstrap'
import CopyClipboardIcon from '../../assets/images/CopyClipboardIcon.svg'
import MetamaskIcon from '../../assets/images/MetamaskIcon.svg'
import CoinChip from './CoinChip';
import EditIcon from '../../assets/images/EditIcon.svg'

export default function WalletCard(props) {
    console.log("PROPS")
    console.log(props)

    

    const chips = props.wallet_coins.map((coin,index)=>{
        return(
            <CoinChip 
                key={index}
                coin_img_src={coin.coin_img}
                coin_percent = {coin.coin_percent}
            />
        )
    })
    const copyContent = ()=>{
        const text = document.getElementById("account_number").innerText
        console.log(text)
        navigator.clipboard.writeText(text)
    }
    return (
        <div className="walletcard">

            <div className='m-b-32 wallet-details'>
                <div className='wallet-account-details'>

                    <div className='m-r-16 wallet-img'>
                    <Image src={MetamaskIcon}/>
                    </div>

                    <div className='m-r-16 wallet-name-details'>
                        <h6 className='inter-display-medium f-s-20 lh-24 m-r-16'>{props.coin_name}</h6>
                        {props.wallet_name && <div className='inter-display-medium f-s-16 lh-19 wallet-name'>{props.wallet_name} </div>}
                    </div>

                    <div className='account-details' onClick={copyContent}>
                        <span className='inter-display-regular f-s-13 lh-16 m-r-5' id="account_number">{props.wallet_account_number}</span>
                        <Image src={CopyClipboardIcon}/>
                    </div>

                </div>
                <div className='amount-details'>
                    <h6 className='inter-display-medium f-s-20 lh-24' >{props.wallet_amount}</h6>
                    <span className='inter-display-semi-bold f-s-10 lh-12'>USD</span>
                </div>
            </div>

            <div className='coins-chip'>
                <div className='chips-section'>
                {chips}
                </div>
                <Image src={EditIcon} />
            </div>
        </div>
    )
}
