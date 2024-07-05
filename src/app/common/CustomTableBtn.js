import React, { Component } from "react";

class CustomTableBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.isChecked ? props.isChecked : false,
    };
  }
  handleOnClickPass = () => {
    this.props.handleOnClick(!this.state.isChecked);
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };
  render() {
    return (
      <button className="custom-table-button" onClick={this.handleOnClickPass}>
        {this.state.isChecked
          ? this.props.checkedText
          : this.props.uncheckedText}
      </button>
    );
  }
}

export default CustomTableBtn;
