import React, { Component } from 'react';
import checkIcon from "../../assets/images/icons/check-cohort.svg";
import { Image } from 'react-bootstrap';

class CheckboxCustomTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: props?.isChecked || false,
    };
  }
    handleChecked = () => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
  };
  render() {
    return (
      <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
   
        <div
          style={{
            margin: "10px",
            background: this.state.isChecked
              ? "#0071E3"
              : "transparent",
          }}
          className="custom-checkbox"
          onClick={this.handleChecked}
        >
          <Image
            src={checkIcon}
            style={{
              opacity: this.state.isChecked ? "1" : "0",
            }}
          />
        </div>
      </div>
    );
  }
}

export default CheckboxCustomTable;