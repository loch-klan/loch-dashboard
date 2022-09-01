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
            title: "Transaction History"
        },
        {
            icon: ShuffleIcon,
            title: "Traded by counterparty"
        },
        {
            icon: InsightsIcon,
            title: "Insights"
        }
    ]

    const cards = cardData.map((card) => {
        return (
            <div className='info'>
                <div className='icon'>
                    <Image src={card.icon} />
                </div>
                <div className='info-detail'>
                    <div className='info-title inter-display-medium m-b-4'>
                        {card.title}
                    </div>
                    <div className='viewmore'>
                        <h4 className="inter-display-semi-bold">View more</h4>
                        <Image src={ArrowRight} />
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className='intell-welcome-card'>
            <Container>

                <h4 className="page-title inter-display-medium m-b-12">Intelligence</h4>

                <p className='subtitle inter-display-medium m-b-32'>Automated and personalized financial intelligence</p>


                <div className="row-card">
                    <Image src={bgimg} className="bg-img" />
                    <div className='welcome-card'>

                        <h3 className='f-s-25 lh-30 welcome-card-title inter-display-semi-bold'>Valuable intelligence,</h3>

                        <h3 className='m-b-12 f-s-25 lh-30 welcome-card-title inter-display-semi-bold'>personalized to you</h3>

                        <p className='m-b-40 card-subtitle inter-display-medium'>
                            Invest smarter with curated insights from your data
                        </p>

                        <div className="info-container">
                            {cards}
                        </div>

                    </div>

                </div>

            </Container>
        </div>
    )
}
