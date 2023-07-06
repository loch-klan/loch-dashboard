import React from "react";

const Switch = (props) => {
  let handleBtn = props.handleBtn === false ? false : true;
  return (
    <div className="switch-wrapper">
      {handleBtn && (
        <label className="switch">
          <input
            type="checkbox"
            checked={props.checked}
            // onClick={props.handleClick}
            onChange={props.handleClick}
          />
          <span className="slider round"></span>
        </label>
      )}

      <span className={`${props.checked ? "active" : "inactive"}`}>
        {props.checked ? "Active" : "Inactive"}
      </span>
    </div>
  );
};
export default Switch;
