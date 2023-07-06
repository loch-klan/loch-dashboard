import React, { Fragment } from "react";
import { Dropdown, Image } from "react-bootstrap";
import optionsIcon from "../../../assets/images/icons/options-icon.svg";

const ActionDropdown = (props) => {
  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">
        <Image src={optionsIcon} className="options-icon" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {props.menuItem.map((item, i) => (
          <Fragment key={i}>
            {item.type === "event" ? (
              <Dropdown.Item onClick={item.handleClick}>
                {item.title}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item href={item.linkUrl}>{item.title}</Dropdown.Item>
            )}
          </Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
ActionDropdown.propTypes = {
  // getPosts: PropTypes.func
};
export default ActionDropdown;
