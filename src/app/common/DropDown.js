import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
export default function DropDown(props) {

    const list = props.list.map((li,index)=>{
        return(
            <Dropdown.Item href="#/action1" key={index}>{li}</Dropdown.Item>
        )
    })
    return (
        <DropdownButton id={props.id} title={props.title}>
            {list}
        </DropdownButton>
    )
}
