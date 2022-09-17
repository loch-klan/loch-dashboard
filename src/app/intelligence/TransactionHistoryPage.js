import React from 'react'
import PageHeader from '../common/PageHeader';
import DropDown from './../common/DropDown';

export const TransactionHistoryPage = () => {
  
  const fillters = ["This year","All assets","All methods"]
  
  const fillter_tabs = fillters.map((e)=>{
    return <div className='filter_tab'>
      <DropDown
                id="dropdown-transaction-fillter-tab"
                title={e}
                list={[1,2,3]}
            />
    </div>
  })
  return (
    <div className="history-table-section ">
        <PageHeader
            title={"Transaction history"}
            subTitle={"Valuable insights based on your assets"}
        />

        <div className='fillter_tabs_section'>
          {fillter_tabs}
        </div>

    </div>
  )
}
