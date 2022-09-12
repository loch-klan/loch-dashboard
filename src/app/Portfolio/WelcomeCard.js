import React from 'react'
import {Container , Button , Image} from "react-bootstrap"
import arrowUpRight from '../../image/ArrowUpRight.svg'
export default function WelcomeCard() {
  return (
    <div className="welcome-card-section">
            <div className="welcome-card">
                <div className='welcome-section-left'>
                    <h1 className='inter-display-semi-bold welcome-title'>Welcome to Loch</h1>
                    <p className='inter-display-medium'>Add your wallet address(es) to receive personalized  </p>
                    <p className="inter-display-medium m-b-24">financial intelligence immediately.</p>
                    <div className="welcome-btn">
                        <Button className='secondary-btn'>Manage wallets</Button>
                        <Button className="primary-btn">Add wallet address</Button>
                    </div>
                </div>
                <div className='welcome-section-right'>
                    <h3 className="inter-display-medium wallet-amount">$317,068.00</h3>
                    
                    <Button className="inter-display-medium">
                        <Image src={arrowUpRight} />
                        330.10 (1%)
                    </Button>
                </div>
            </div>
    </div>
  )
}
