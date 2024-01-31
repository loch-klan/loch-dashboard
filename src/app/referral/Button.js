import React from 'react'

const Button = ({children, onClick, className, style, type}) => {
  return (
    <button 
    onClick={onClick} 
    type={type || "button"}
    style={{
        ...style,
    }} 
    className={` ${className}`}
    >
        {children}
    </button>
  )
}

export default Button