import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
export default function DropDown(props) {

    const list = props.list.map((li,index)=>{
        return(
            <Dropdown.Item  eventKey={`${props.id} ${li} `} key={index} className={props.activetab === li ? "active" : ""}>{li.name?li.name : li}</Dropdown.Item>
        )
    })
    return (
        <DropdownButton id={props.id} title={props.title} onSelect={props.onSelect}>
            {list}
        </DropdownButton>
    )
}
