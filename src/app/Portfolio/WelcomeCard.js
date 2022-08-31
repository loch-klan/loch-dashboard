import React from 'react'
import {Container , Button , Image} from "react-bootstrap"
import arrowUpRight from '../../image/ArrowUpRight.svg'
export default function WelcomeCard() {
  return (
    <div className="welcome-card-section">
        <Container>
            <div className="welcome-card">
                <div className='welcome-section-left'>
                    <h1 className='welcome-title inter-display-semi-bold'>Welcome to Loch</h1>
                    <p className='inter-display-medium'>Add your wallet address(es) to receive personalized <br/> financial intelligence immediately. </p>
                    <div className="welcome-btn">
                        <Button className='secondary-btn'>Manage wallets</Button>
                        <Button className="primary-btn">Add wallet address</Button>
                    </div>
                </div>
                <div className='welcome-section-right'>
                    <h3 className="wallet-amount inter-display-medium ">$317,068.00</h3>
                    
                    <Button>
                        <Image src={arrowUpRight} />
                        330.10 (1%)
                    </Button>
                </div>
            </div>
        </Container>
    </div>
  )
}
