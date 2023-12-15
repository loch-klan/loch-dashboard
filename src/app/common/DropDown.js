import React from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
export default function DropDown(props) {
  const list = props.list.map((li, index) => {
    // console.log(li)
    const borderStyle = {
      border: `1px solid ${li.color}`,
      color: li.color,
    };
    return props.showChain ? (
      <Dropdown.Item
        eventKey={`${props.id} ${li} ${li.id}`}
        key={index}
        className="m-b-12 chain-dropdown"
        style={borderStyle}
      >
        <Image src={li.symbol} /> {li.name}
      </Dropdown.Item>
    ) : (
      <Dropdown.Item
        eventKey={`${props.id} ${li} ${li.id}`}
        key={index}
        className={props.activetab === li ? "active" : ""}
      >
        {li.name ? li.name : li}{" "}
        {props?.showChecked && (
          <svg
            style={
              props.activetab !== li
                ? { display: "none" }
                : {
                    position: "absolute",
                    right: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "2rem",
                    height: "2rem",
                  }
            }
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              fill="none"
              stroke="#cccccc"
              strokeWidth="2"
              points="6 13 10.2 16.6 18 7"
            />
          </svg>
        )}
      </Dropdown.Item>
    );
  });

  return (
    <div style={props?.relative ? { position: "relative" } : {}}>
      <DropdownButton
        id={props.id}
        className={props.class ? props.class : ""}
        title={props.title}
        onSelect={props.onSelect}
      >
        {list}
      </DropdownButton>
      {props?.customArrow && (
        <span
          className={`dropdownArrow ${
            props.arrowClassName ? props.arrowClassName : ""
          }`}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
              fill="hsl(0, 0%, 80%)"
            ></path>
          </svg>
        </span>
      )}
    </div>
  );
}
