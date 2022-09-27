import React from 'react'
import { Button, Image } from "react-bootstrap"
import arrowUpRight from '../../image/ArrowUpRight.svg'
import arrowDowRight from '../../assets/images/icons/arrow-down-right.svg'
import CustomLoader from "../common/CustomLoader";
import { numToCurrency } from '../../utils/ReusableFunctions';
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';

export default function WelcomeCard(props) {
    // console.log(props)
    return (
        <div className="welcome-card-section">
            <div className="welcome-card">
                <div className='welcome-section-left'>
                    <h1 className='inter-display-semi-bold f-s-25 l-h30 black-191 welcome-title'>Welcome to Loch</h1>
                    <p className='inter-display-medium'>Add your wallet address(es) to receive personalized  </p>
                    <p className="inter-display-medium m-b-24">financial intelligence immediately.</p>
                    <div className="welcome-btn">
                        <Button className='secondary-btn'>Manage wallets</Button>
                        <Button className="primary-btn" onClick={()=>props.history.push("/home")}>Add wallet address</Button>
                        {/* <Button className="primary-btn" onClick={props.handleAddModal}>Add wallet address</Button> */}
                    </div>
                </div>
                <div className='welcome-section-right'>

                    {props.assetTotal ?
                        <CustomOverlay
                        position="top"
                        isIcon={false}
                        isInfo={true}
                        isText={true}
                        text={"$" + parseFloat(props.assetTotal).toFixed(2) + "USD"}
                        >
                        <h3 className="space-grotesk-medium wallet-amount">$
                            {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                           {numToCurrency(props.assetTotal)} USD
                        </h3>
                        </CustomOverlay>
                        :
                        <CustomLoader chartType="text" />
                    }
                    <div className={`growth-div inter-display-medium f-s-16 lh-19 grey-313 ${props.decrement ? "downfall" : ""}`}>
                        <Image src={props.decrement ? arrowDowRight : arrowUpRight} />
                        330.10 (1%)
                    </div>
                </div>
            </div>
        </div>
    )
}
