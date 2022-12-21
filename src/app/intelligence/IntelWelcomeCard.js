import React from 'react'
import { Image } from 'react-bootstrap'
// import bgimg from '../../image/CardBackgroundImg.png'
import bgimg from '../../assets/images/IntelCardBackgroundImg.png'
import TransactionIcon from '../../image/TransactionHistoryIcon.svg'
import ShuffleIcon from '../../image/ShuffleIcon.svg'
import InsightsIcon from '../../image/InsightsIcon.svg'
import ArrowRight from '../../image/ArrowRight.svg'
import {
  TransactionHistory,
  TradeByCounterParty,
  Insights,
  AssetValueAnalytics,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
export default function IntelWelcomeCard(props) {

    const cardData = [
      {
        icon: TransactionIcon,
        title: "Transaction History",
        background: "lightblue",
        path: "/intelligence/transaction-history",
        analyticEvent: () => {
          TransactionHistory({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        },
      },
      // {
      //   icon: ShuffleIcon,
      //   title: "Traded by counterparty",
      //   background: "lightyellow",
      //   path: "/intelligence/volume-traded-by-counterparty",
      //   analyticEvent: ()=>{TradeByCounterParty({
      //     session_id: getCurrentUser().id,
      //     email_address: getCurrentUser().email,
      //   })},
      // },
      {
        icon: ShuffleIcon,
        title: "Asset Value",
        background: "lightyellow",
        path: "/intelligence/asset-value",
        analyticEvent: () => {
          AssetValueAnalytics({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        },
      },
      {
        icon: InsightsIcon,
        title: "Insights",
        background: "lightpurple",
        path: "/intelligence/insights",
        analyticEvent: () => {
          Insights({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        },
      },
    ];

    const cards = cardData.map((card) => {
        return (
            <div className='info' onClick={() => {
                props.history.push(card.path);
                card.analyticEvent()
            }}>
                <div className = {`icon ${card.background}`}>
                    <Image src={card.icon} />
                </div>
                <div className='info-detail'>
                    <div className='inter-display-medium f-s-16 lh-19 m-b-4 info-title'>
                        {card.title}
                    </div>
                    <div className='viewmore'>
                        <h4 className="inter-display-semi-bold f-s-13 lh-16 black-191">View more</h4>
                        <Image src={ArrowRight} />
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className='m-b-60 intell-welcome-card'>
                {/* <h4 className="inter-display-medium f-s-31 lh-37 m-b-12 page-title ">Intelligence</h4>
                <p className=' inter-display-medium f-s-16 lh-19 m-b-32 subtitle'>Automated and personalized financial intelligence</p> */}
                <div className="row-card">
                    <Image src={bgimg} className="bg-img" />
                    <div className='welcome-card'>
                        <h3 className='inter-display-semi-bold f-s-20 lh-24 welcome-card-title '>Valuable intelligence,</h3>
                        <h3 className='inter-display-semi-bold  f-s-20 lh-24 m-b-12 welcome-card-title '>personalized to you</h3>
                        <p className='inter-display-medium f-s-13 lh-16 m-b-32 card-subtitle '>
                            Invest smarter with curated insights from your data
                        </p>
                        <div className="info-container">
                            {cards}
                        </div>
                    </div>
                </div>
        </div>
    )
}
