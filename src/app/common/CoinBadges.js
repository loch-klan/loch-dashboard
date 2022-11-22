import React from 'react'
import DropDown from './DropDown'
export default function CoinBadges(props) {


    // const dropList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]
    // const badgeList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple","Avalanche" ,"Unicoin","Maker","Matic","Render","Flow","Cosmos","Luna","Algorand","Aurora","Cardano","Fantom","Polygon","Near","Tron","Optimism","Polkadot","Filecoin","Binance"]
    // console.log(props.chainList)
    
    let badgeList = [{name:"All",id:""}]
    let dropdownList = []

    props.chainList.map((chain)=>{
        // console.log(chain)
        badgeList.push({name:chain.name,id:chain.id})
        dropdownList.push({name:chain.name,id:chain.id})  
    })

    const handleFunction = (e)=>{
        // console.log("drop",e.split(' '))
        const badgeId = e.split(' ')[3]
        const currentBadge = badgeList.find(e => e.id === badgeId)
        // console.log(currentBadge)
        props.handleFunction(currentBadge)
    }
    return (
        <div className='coin-badges'>
            <div className={`badge-list ${ props.isScrollVisible === false ? 'white-scroll' : ""}`}>
                {badgeList.map((badge, index) => {
                    const className = props.activeBadge.some(e => e.name === badge.name) ? "inter-display-medium f-s-13 lh-16 m-r-16 badge-name badge-active" :
                        "inter-display-medium f-s-13 lh-16 m-r-16 black-191 badge-name"
                    return (
                        <div id={index} key={index} className={className} onClick={()=>props.handleFunction(badge)}>{badge.name}</div>
                    )
                })}
            </div>

            <DropDown
                id="dropdown-basic-badge-button"
                title="Others"
                list={dropdownList}
                onSelect={handleFunction}
            />
        </div>
    )
}
