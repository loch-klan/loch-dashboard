import React, { Component } from 'react'
import PropTypes from "prop-types";
class CustomDropdown extends Component {
  constructor(props) {
    super(props);

    // const PropOptions = [
    //   { label: "All Year", value: "allYear" },
    //   { label: "2020", value: "2020" },
    //   { label: "2021", value: "2021" },
    // ];

         this.props.options.map((e, i) =>
           this.state.options.push({
             label: e.label,
             value: e.value,
             isSelected: i === 0 ? true : false,
           })
         );

    this.state = {
      showMenu: false,
      options: [],
      name: this.props.filtername,
    };

    // PropOptions.map((e, i) =>
    //   this.state.options.push({
    //     label: e.label,
    //     value: e.value,
    //     isSelected: i === 0 ? true : false,
    //   })
    // );


    // console.log(this.state.options, "state option");
    this.dropDownRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options.length === 0){
       this.props.options.map((e, i) =>
         this.state.options.push({
           label: e.label,
           value: e.value,
           isSelected: i === 0 ? true : false,
         })
       );

    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  dropdownClicked = (e) => {
    // console.log(e.target, this.dropDownRef.current);
    let showMenu = this.state.showMenu;
    this.setState({ showMenu: !showMenu });
    e.stopPropagation();
  };

  handleClickOutside = (e) => {
    if (
      this.dropDownRef &&
      this.dropDownRef.current &&
      !this.dropDownRef.current.contains(e.target)
    ) {
      if (this.state.showMenu) {
        this.setState({ showMenu: false });
        e.stopPropagation();
      }
    }
  };

    onSelect = (option) => {
    
    let updatedOptions = this.state.options.map((e) => {
      if (e.value === this.state.options[0].value && e.value === option.value) {
          e.isSelected = true;
          
      } else {
        if (option.value === e.value) {
          e.isSelected = !option.isSelected;
        }
        if (
          e.value === this.state.options[0].value ||
          (option.value === this.state.options[0].value &&
            e.value !== option.value)
        ) {
          e.isSelected = false;
        }
      }
      return e;
    });
    this.setState({
      options: updatedOptions,
    });

    // console.log("option", option, "updated Option", this.state.options);
  };

  getSelected = () => {
    let isAll =
      this.state.options.length !== 0 ? this.state.options[0].isSelected : true;
    let selected;
    selected = this.state.options
      .filter((e) => e.isSelected === true)
      .map((e) => e.value);

    let count;
      if (isAll) {
        selected = selected.toString();
      count = 0;
    } else {
      count = selected.length;
    }

      // console.log(selected, "selected", count, "count");
    //   console.log(this.state.options);
    return { selected: selected, length: count };
  };

  ClearAll = () => {
      this.onSelect(this.state.options[0]);
      this.props.handleClick(this.props.action, this.getSelected().selected);
    //    console.log(this.props.action, this.getSelected().selected, "apply");
        this.setState({ showMenu: false });
  };

  Apply = () => {
    // console.log(this.getSelected().selected, "apply");
    console.log("value passed", this.getSelected().selected);
      
      this.props.handleClick(this.props.action, this.getSelected().selected);
        this.setState({ showMenu: false });
  };

  render() {
    return (
      <div
        className="custom-dropdown"
        ref={this.dropDownRef}
        onBlur={this.handleClickOutside}
      >
        <div className="placeholder" onClick={this.dropdownClicked}>
          {this.getSelected().length === 0
            ? this.state.name
            : this.getSelected().length + " Selected"}
          <span>
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
            </svg>
          </span>
        </div>
        <div
          className={`dropdown-content ${this.state.showMenu ? "show" : ""}`}
        >
          <div className="dropdown-list">
            {this.state.options.map((e) => {
              return (
                <span
                  className={e.isSelected ? "active" : ""}
                  key={e.value}
                  onClick={() => {
                    this.onSelect(e);
                  }}
                >
                  {e.label}
                  <svg
                    className={`${e.isSelected ? "show" : "hide"}`}
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
                </span>
              );
            })}
          </div>

          <div className="dropdown-footer">
            <span className="dropdown-btn" onClick={this.ClearAll}>
              Clear All
            </span>
            <span className="dropdown-btn" onClick={this.Apply}>
              Apply
            </span>
          </div>
        </div>
      </div>
    );
  }
}

CustomDropdown.propTypes = {
//   type: PropTypes.string,
//   variant: PropTypes.string,
//   isDisabled: PropTypes.bool,
//   isActive: PropTypes.bool,
//   isBlock: PropTypes.bool,
//   href: PropTypes.string,
//   handleClick: PropTypes.func,
//   buttonText: PropTypes.string,
//   className: PropTypes.string,
//   // valueLink: PropTypes.object.isRequired,
};

CustomDropdown.defaultProps = {
//   type: "button",
//   variant: "primary",
//   isDisabled: false,
//   isActive: false,
};

export default CustomDropdown;
