import React from 'react'
import {Image} from'react-bootstrap'

export default function CoinChip(props) {

  return (
    <div className='m-r-12 chip'>
        <Image src={props.coin_img_src} />
        <div className='inter-display-medium f-s-13 lh-16 coin-percent'>{props.coin_percent}</div>
    </div>
  )
}
