import React from 'react'

const Input = ({className, value, onChange, placeHolder,type, style, onKeyUp, tabIndex, maxLength}) => {
  return (
    <input
    type={type || "text"}
    className={` ${className}`}
    value={value}
    onChange={onChange}
    placeholder={placeHolder || ""}
    style={style}
    onKeyUp={onKeyUp}
    tabIndex={tabIndex}
    maxLength={maxLength}
    />
  )
}

export default Input