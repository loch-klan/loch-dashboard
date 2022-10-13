import React from 'react'
import { Dropdown, DropdownButton , Image } from 'react-bootstrap'
export default function DropDown(props) {


    const list = props.list.map((li,index)=>{
        // console.log(li)
        const borderStyle = {
            border:`1px solid ${li.color}`,
            color:li.color
        }
        return(
            props.showChain ?  <Dropdown.Item eventKey={`${props.id} ${li} ${li.id}`} key={index} className="m-b-12 chain-dropdown" style={borderStyle}>
            <Image src={li.symbol}/> {li.name}
        </Dropdown.Item> : <Dropdown.Item  eventKey={`${props.id} ${li} ${li.id}`} key={index} className={props.activetab === li ? "active" : ""}>{li.name?li.name : li}</Dropdown.Item>
        )
    })

    return (
        <DropdownButton id={props.id} className={props.class ? props.class : ""}title={props.title} onSelect={props.onSelect}>
            {list}
        </DropdownButton>
    )
}
