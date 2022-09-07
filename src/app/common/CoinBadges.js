import React from 'react'
import DropDown from './DropDown'
export default function CoinBadges() {

    const [activeBadge,setactiveBadge] = React.useState(0)

    const badgeList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]

    const dropdownList = ["Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]
    return (
        <div className='coin-badges'>
            <div className='badge-list'>
                {badgeList.map((badge, index) => {
                    const className = index == activeBadge ? "inter-display-medium f-s-13 lh-16 m-r-16 badge-name badge-active" :
                        "inter-display-medium f-s-13 lh-16 m-r-16 badge-name"
                    return (
                        <div id={index} key={index} className={className}>{badge}</div>
                    )
                })}
            </div>

            <DropDown
                id="dropdown-basic-badge-button"
                title="Others"
                list={dropdownList}
            />
        </div>
    )
}
