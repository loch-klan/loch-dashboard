import React, { Component } from "react";
import { Image } from "react-bootstrap";
import SearchIcon from "../../assets/images/icons/dropdown-search.svg";
class CustomMinMaxDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      options: [],
      name: this.props.filtername,
      clearAll: false,
      apply: false,
      search: "",
      filteredItems: [],
      minAmount: "",
      maxAmount: "",
    };

    //  props.options.map((e, i) =>
    //    this.state.options.push({
    //      label: e.label,
    //      value: e.value,
    //      isSelected: i === 0 ? true : false,
    //    })
    //  );

    this.dropDownRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (this.props.minAmount && this.props.maxAmount) {
      this.setState({
        minAmount: this.props.minAmount,
        maxAmount: this.props.maxAmount,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (!this.props.isLineChart && this.state.options?.length - 1 === this.getSelected().selected?.length) {
    //   this.selectedAll(true);
    // }
    if (
      prevState.minAmount !== this.state.minAmount ||
      prevState.maxAmount !== this.state.maxAmount
    ) {
      if (
        this.state.minAmount === "" ||
        this.state.maxAmount === "" ||
        Number(this.state.maxAmount) <= Number(this.state.minAmount)
      ) {
        this.setState({
          disableApply: true,
        });
      } else {
        this.setState({
          disableApply: false,
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  dropdownClicked = (e) => {
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

  onSingleSelect = (option) => {
    this.props.handleClick(option.value);
  };
  onSelect = (option) => {
    if (
      option.value === this.state.options[0].value &&
      !this.props.isLineChart
    ) {
      if (this.state.options[0].isSelected) {
        this.selectedAll(false);
      } else {
        this.selectedAll(true);
      }
    } else {
      let updatedOptions = this.state.options.map((e) => {
        if (
          e.value === this.state.options[0].value &&
          e.value === option.value
        ) {
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

      this.setState(
        {
          options: updatedOptions,
        },
        () => {
          this.copyToFilteredItems();
          if (
            !this.props.isLineChart &&
            this.state.options?.length - 1 ===
              this.getSelected().selected?.length
          ) {
            this.selectedAll(true);
          }
        }
      );
    }
  };

  getSelected = () => {
    let isAll =
      this.state.options?.length !== 0
        ? this.state.options[0]?.isSelected
        : true;
    let selected;
    selected = this.state?.options
      .filter((e) => e?.isSelected === true)
      .map((e) =>
        this.props.isChain || this.props.isGreyChain || this.props?.getObj
          ? { name: e.label, id: e.value }
          : e?.value
      );
    let count;
    if (isAll) {
      // selected = this.props.isChain
      //   ? [{ name: "All", id: "" }]
      //   : selected?.toString();
      selected =
        this.props.isChain || this.props.isGreyChain || this.props?.getObj
          ? [{ name: "All", id: "" }]
          : this.props.isLineChart
          ? []
          : selected[0]?.toString();
      count = 0;
    } else {
      count = selected?.length;
    }

    return { selected: selected, length: count };
  };

  copyToFilteredItems = () => {
    const filteredItems = this.state.options.filter((item) => {
      const tempValue = item.label.toString();
      let isTrue = false;
      if (isNaN(tempValue)) {
        const tempAns = tempValue
          .toLowerCase()
          .includes(this.state.search.toLowerCase());
        if (tempAns) {
          isTrue = true;
        }
      } else {
        const tempAns = tempValue.includes(this.state.search.toLowerCase());
        if (tempAns) {
          isTrue = true;
        }
      }
      if (item.code) {
        const tempCodeValue = item.code ? item.code.toString() : "";
        if (isNaN(tempCodeValue)) {
          const tempAns = tempCodeValue
            .toLowerCase()
            .includes(this.state.search.toLowerCase());
          if (tempAns) {
            isTrue = true;
          }
        } else {
          const tempAns = tempCodeValue.includes(
            this.state.search.toLowerCase()
          );
          if (tempAns) {
            isTrue = true;
          }
        }
      }
      return isTrue;
    });
    this.setState({ filteredItems });
  };
  selectedAll = (value) => {
    let options = [];
    this.state?.options?.map((e) => {
      options.push({
        label: e.label,
        value: e.value,
        code: e.code ? e.code : "",
        isSelected: value,
      });
    });

    this.setState(
      {
        options,
      },
      () => {
        this.copyToFilteredItems();
      }
    );
    // this.state.options = options;
  };

  ClearAll = () => {
    this.setState({
      minAmount: "1",
      maxAmount: "1000000000",
    });
  };

  Apply = () => {
    console.log("this.state.disableApply ", this.state.disableApply);
    if (this.props.handleClick && !this.state.disableApply) {
      this.props.handleClick(this.state.minAmount, this.state.maxAmount);
      this.setState({ showMenu: false });
    }
  };

  TruncateText = (string) => {
    if (string?.length > 9) {
      return string.substring(0, 9) + "..";
    }
    return string;
  };

  checkForEnter = (key) => {
    console.log("key ", key.code);
    if (key.code === "Enter") {
      this.Apply();
    }
  };
  handleMinChange = (event) => {
    let tempHolder = event.target.value;
    if (!isNaN(tempHolder) && Number(tempHolder) < 1000000000) {
      this.setState({
        minAmount: tempHolder,
      });
    }
  };
  handleMaxChange = (event) => {
    let tempHolder = event.target.value;
    if (!isNaN(tempHolder) && Number(tempHolder) <= 1000000000) {
      this.setState({
        maxAmount: tempHolder,
      });
    }
  };

  render() {
    return (
      <div
        className={`custom-dropdown cp ${
          this.props.isLineChart || this.props.isChain || this.props.LightTheme
            ? "lineChart"
            : this.props.isTopaccount
            ? "top-account-dropdown"
            : ""
        } ${this.props.isIcon ? "custom-dropdown-icon" : ""}`}
        ref={this.dropDownRef}
        onBlur={this.handleClickOutside}
      >
        <div
          className={`placeholder ${
            this.props.isLineChart ||
            this.props.isChain ||
            this.props.LightTheme
              ? "lineChartPlaceholder"
              : ""
          }`}
          onClick={this.dropdownClicked}
          style={
            this.props.isChain || this.props.LightTheme
              ? { justifyContent: "flex-start", paddingLeft: "1.6rem" }
              : {}
          }
        >
          {this.props.singleSelect
            ? this.props.selectedTokenName
              ? this.props.selectedTokenName
              : ""
            : this.getSelected()?.length === 0
            ? this.state.name
            : this.props.isIcon
            ? this.state.name
            : this.props.isLineChart
            ? this.getSelected()?.length + "/4 Selected"
            : this.props.isChain
            ? this.getSelected()?.length +
              (this.getSelected()?.length > 1 ? " chains" : " chain")
            : this.props.placeholderName
            ? this.getSelected()?.length +
              (this.getSelected()?.length > 1
                ? " " + this.props.placeholderName + "s"
                : " " + this.props.placeholderName + "")
            : this.getSelected()?.length + " Selected"}

          {!this.props.isLineChart &&
            !this.props.isChain &&
            !this.props.LightTheme &&
            !this.props.isIcon && (
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
            )}
          {(this.props.isLineChart ||
            this.props.isChain ||
            this.props.LightTheme) && (
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                // viewBox="0 0 20 20"
              >
                {/* <path fill="none" d="M0 0h24v24H0V0z" /> */}
                <path fill="#000000" d="M7 7l4 4 4-4H7z" />
              </svg>
            </span>
          )}
        </div>
        <div
          className={`dropdown-content ${this.state.showMenu ? "show" : ""}`}
          style={{
            minWidth: `${
              this.props.isLineChart || this.props.isChain ? "100%" : "135px"
            }`,
          }}
        >
          <div className="dropdownMinMaxHeader inter-display-medium f-s-13 ">
            Token Transfer Amount ($)
          </div>
          <div className="dropdown-search-wrapper dropdown-search-wrapper-min-max">
            <div
              style={{
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: 14,
                  fontSize: "1.3rem",
                }}
              >
                $
              </span>
              <input
                value={this.state.minAmount}
                style={{ paddingLeft: "18px" }}
                type="text"
                placeholder="Min"
                onChange={this.handleMinChange}
                className={`dropdown-min-max-input ${
                  !this.props.isIcon &&
                  this.props.filtername.toLowerCase() === "tokens"
                    ? "dropdown-search-input-smaller"
                    : ""
                }`}
                onKeyDown={this.checkForEnter}
              />
            </div>
            <div
              style={{
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: 14,
                  fontSize: "1.3rem",
                }}
              >
                $
              </span>
              <input
                value={this.state.maxAmount}
                style={{ paddingLeft: "18px" }}
                type="text"
                placeholder="Max"
                onChange={this.handleMaxChange}
                className={`dropdown-min-max-input ${
                  !this.props.isIcon &&
                  this.props.filtername.toLowerCase() === "tokens"
                    ? "dropdown-search-input-smaller"
                    : ""
                }`}
                onKeyDown={this.checkForEnter}
              />
            </div>
          </div>

          <div className="dropdown-footer">
            <span
              className="secondary-btn dropdown-btn btn-bg-white-outline-black hover-bg-black"
              onClick={this.ClearAll}
            >
              Reset
            </span>
            <span
              style={{
                opacity: this.state.disableApply ? 0.5 : 1,
                pointerEvents: this.state.disableApply ? "none" : "auto",
              }}
              className="primary-btn dropdown-btn btn-bg-black hover-bg-white-outline-black"
              onClick={this.Apply}
            >
              Apply
            </span>
          </div>
        </div>
      </div>
    );
  }
}

CustomMinMaxDropdown.propTypes = {
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

CustomMinMaxDropdown.defaultProps = {
  //   type: "button",
  //   variant: "primary",
  //   isDisabled: false,
  //   isActive: false,
  isLineChart: false,
};

export default CustomMinMaxDropdown;
