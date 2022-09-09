import React from 'react'

import { Container, Row, Col, Image } from 'react-bootstrap'
import bgimg from '../../image/CardBackgroundImg.png'
import TransactionIcon from '../../image/TransactionHistoryIcon.svg'
import ShuffleIcon from '../../image/ShuffleIcon.svg'
import InsightsIcon from '../../image/InsightsIcon.svg'
import ArrowRight from '../../image/ArrowRight.svg'
export default function IntelWelcomeCard() {

    const cardData = [
        {
            icon: TransactionIcon,
            title: "Transaction History",
            background:"lightblue"
        },
        {
            icon: ShuffleIcon,
            title: "Traded by counterparty",
            background:"lightyellow"
        },
        {
            icon: InsightsIcon,
            title: "Insights",
            background:"lightpurple"
        }
    ]

    const cards = cardData.map((card) => {
        return (
            <div className='info'>
                <div className = {`icon ${card.background}`}>
                    <Image src={card.icon} />
                </div>
                <div className='info-detail'>
                    <div className='inter-display-medium   f-s-16 lh-19 m-b-4 info-title'>
                        {card.title}
                    </div>
                    <div className='viewmore'>
                        <h4 className="inter-display-semi-bold f-s-13 lh-16">View more</h4>
                        <Image src={ArrowRight} />
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className='intell-welcome-card'>
                <div className="row-card">
                    <Image src={bgimg} className="bg-img" />
                    <div className='welcome-card'>

                        <h3 className='inter-display-semi-bold f-s-25 lh-30 welcome-card-title '>Valuable intelligence,</h3>

                        <h3 className='inter-display-semi-bold  f-s-25 lh-30 m-b-12 welcome-card-title '>personalized to you</h3>

                        <p className='inter-display-medium f-s-13 lh-16 m-b-40 card-subtitle '>
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
