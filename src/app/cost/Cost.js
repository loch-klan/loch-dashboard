import React from 'react'
import { BarGraphSection } from '../common/BarGraphSection'
import PageHeader from '../common/PageHeader'
import Sidebar from '../common/Sidebar'
import { info , years5 ,ethereum }from './dummyData.js'
export const Cost = () => {

  
  const [durationgraphdata , setdurationgraphdata] = React.useState({
    data:info[0],
    options:info[1],
  })

  const [activeFooter,setactiveFooter] = React.useState(0)

  const [activeCoin , setactiveCoin ] = React.useState(0)

  const handleCoin = (event)=>{
      console.log(event.target)
      setactiveCoin(event.target.id)
  }
  const handleFooter = (event)=>{
    console.log(event.target)
    setactiveFooter(event.target.id)
  }

  const setData = ()=>{
    activeCoin == 3 ? setdurationgraphdata({
      data : ethereum[0],
      options : ethereum[1]
    }) :
    activeFooter == 1? setdurationgraphdata({
      data:years5[0],
      options:years5[1]
    }) :  setdurationgraphdata({
      data:info[0],
      options:info[1]
    })
  }

  
  React.useEffect(()=>{
    console.log(activeFooter)
    console.log(activeCoin)
      setData()
  },[activeFooter,activeCoin])
  // console.log(durationgraphdata)
  return (
    <div className="cost-page-section">
        <Sidebar ownerName="" />
        <div className='m-t-80 cost-section page'>

            <PageHeader
                title="Costs"
                subTitle="Bring light to your hidden costs"  
            />

            <BarGraphSection
                headerTitle="Counterparty Fees Over Time"
                headerSubTitle="Understand how much your counterparty charges you"
                data={durationgraphdata.data}
                options={durationgraphdata.options}
                activeFooter = {activeFooter}
                handleFooter={handleFooter}
                activeCoin = {activeCoin}
                handleCoin={handleCoin}
            />
        </div>
    </div>
  )
}
