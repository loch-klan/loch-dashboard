import React from 'react'

const Radio = ({active, handleClick}) => {
  return (
    <div onClick={handleClick} className={`customRadioContainer ${active?'customRadioContainerActive':""}`}>
        {
            active && <div className={`customRadio ${active?'customRadioActive':""}`}>
            </div>
        }
        
    </div>
  )
}

export default Radio