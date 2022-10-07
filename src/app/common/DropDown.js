import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
export default function DropDown(props) {

    const list = props.list.map((li,index)=>{
        // console.log(li)
        return(
            <Dropdown.Item  eventKey={`${props.id} ${li} ${li.id}`} key={index} className={props.activetab === li ? "active" : ""}>{li.name?li.name : li}</Dropdown.Item>
        )
    })
    return (
        <DropdownButton id={props.id} className={props.class ? props.class : ""}title={props.title} onSelect={props.onSelect}>
            {list}
        </DropdownButton>
    )
}
