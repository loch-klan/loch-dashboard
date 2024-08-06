import React, { Component } from "react";
import { Image } from "react-bootstrap";
import SearchIcon from "../../assets/images/icons/dropdown-search.svg";
import { FilterIcon } from "../../assets/images/icons";
class CustomDropdown extends Component {
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
    };

    //  props.options.map((e, i) =>
    //    this.state.options.push({
    //      label: e.label,
    //      value: e.value,
    //      isSelected: i === 0 ? true : false,
    //    })
    //  );
    if (this.props.isLineChart) {
      if (this.props.selectedTokens?.length !== 0) {
        //is already selected then this run
        let options = [];
        this.props.options.map((e) =>
          options.push({
            label: e.label,
            value: e.value,
            code: e.code ? e.code : "",
            isSelected: this.props.selectedTokens.includes(e.value)
              ? true
              : false,
          })
        );
        this.state.options = [
          options[0],
          ...options
            .slice(1, options?.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ];
      } else {
        let options = [];
        this.props.options.map((e, i) =>
          options.push({
            label: e.label,
            value: e.value,
            code: e.code ? e.code : "",
            isSelected: i < 5 && i !== 0 ? true : false,
          })
        );
        this.state.options = [
          options[0],
          ...options
            .slice(1, options?.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ];
      }
    } else {
      this.props.options.map((e, i) =>
        this.state.options.push({
          label:
            this.props.isChain || this.props.isGreyChain ? e.name : e.label,
          value: this.props.isChain || this.props.isGreyChain ? e.id : e.value,
          // isSelected: i === 0 && !this.props.isChain ? true : false,
          code: e.code ? e.code : "",
          isSelected: true,
        })
      );
      if (this.props.isChain || this.props.isGreyChain) {
        this.state.options = [
          { label: "All", value: "", isSelected: true },
          ...this.state.options,
        ];
      }
    }

    this.dropDownRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (this.props.options && this.props.singleSelect) {
      const tempHolder = [];
      this.props.options.forEach((e, i) => {
        tempHolder.push({
          label: e.asset?.name ? e.asset?.name : "",
          value: e._id ? e._id : "",
          isSelected: this.props.selectedTokens.includes(e._id) ? true : false,
          code: e.asset?.code ? e.asset?.code : "",
        });
      });
      this.setState({
        options: tempHolder,
      });
    }
  }

  componentDidUpdate(prevProps) {
    // if (!this.props.isLineChart && this.state.options?.length - 1 === this.getSelected().selected?.length) {
    //   this.selectedAll(true);
    // }
    if (prevProps.options !== this.props.options && this.props.singleSelect) {
      const tempHolder = [];
      this.props.options.forEach((e, i) => {
        tempHolder.push({
          label: e.asset?.name ? e.asset?.name : "",
          value: e._id ? e._id : "",
          isSelected: this.props.selectedTokens.includes(e._id) ? true : false,
          code: e.asset?.code ? e.asset?.code : "",
        });
      });
      this.setState({
        options: tempHolder,
      });
    }
    if (
      prevProps.options?.length === 0 ||
      prevProps.options?.length !== this.props.options?.length
    ) {
      if (this.props.isLineChart) {
        this.setState(
          {
            options: [],
          },
          () => {
            if (this.props.selectedTokens?.length !== 0) {
              //is already selected then this run
              let options = [];
              Promise.all(
                this.props.options.map((e) =>
                  options.push({
                    label: e.label,
                    value: e.value,
                    code: e.code ? e.code : "",
                    isSelected: this.props.selectedTokens.includes(e.value)
                      ? true
                      : false,
                  })
                )
              ).then(() => {
                this.setState(
                  {
                    options: [
                      options[0],
                      ...options
                        .slice(1, options?.length)
                        .sort((a, b) => (a.label > b.label ? 1 : -1))
                        .sort((a, b) => b.isSelected - a.isSelected),
                    ],
                  },
                  () => {
                    // console.log("op", this.state.options);
                  }
                );
              });

              //  this.getSelected();
              //  this.Apply();
            } else {
              let options = [];
              Promise.all(
                this.props.options.map((e, i) =>
                  options.push({
                    label: e.label,
                    value: e.value,
                    code: e.code ? e.code : "",
                    isSelected: i < 5 && i !== 0 ? true : false,
                  })
                )
              ).then(() => {
                this.setState({
                  options: [
                    options[0],
                    ...options
                      .slice(1, options?.length)
                      .sort((a, b) => (a.label > b.label ? 1 : -1))
                      .sort((a, b) => b.isSelected - a.isSelected),
                  ],
                });
              });
            }
            this.getSelected();
            this.Apply();
          }
        );
      } else {
        // this.props.options.map((e, i) =>
        //   this.state.options.push({
        //     label: e.label,
        //     value: e.value,
        //     isSelected: i === 0 ? true : false,
        //   })
        // );
        if (!this.props.singleSelect) {
          // console.log("transaction", this.props.options);
          this.state.options = [];
          this.props.options.map((e, i) =>
            this.state.options.push({
              label:
                this.props.isChain || this.props.isGreyChain ? e.name : e.label,
              value:
                this.props.isChain || this.props.isGreyChain ? e.id : e.value,
              code: e.code ? e.code : "",
              // isSelected: i === 0 && !this.props.isChain ? true : false,
              isSelected: true,
            })
          );

          // for chain
          if (this.props.isChain || this.props.isGreyChain) {
            this.state.options = [
              { label: "All", value: "", isSelected: true },
              ...this.state.options,
            ];
          }
        }
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
    if (this.props.isLineChart) {
      this.onSelect(this.state.options[0]);
      let options = this.state.options;
      this.setState(
        {
          options: [
            options[0],
            ...options
              .slice(1, options?.length)
              .sort((a, b) => (a?.label > b?.label ? 1 : -1))
              .sort((a, b) => b?.isSelected - a?.isSelected),
          ],
        },
        () => {
          this.copyToFilteredItems();
        }
      );
    } else {
      // this.onSelect(this.state.options[0]);//
      this.selectedAll(false);
    }

    //   this.props.handleClick(this.props.action, this.getSelected().selected);

    //     this.setState({ showMenu: false });

    // this.props.isLineChart || this.props.isChain
    //   ? this.props.handleClick(this.getSelected().selected)
    //   : this.props.handleClick(this.props.action, this.getSelected().selected);
    // this.setState({ showMenu: false });
  };

  Apply = () => {
    if (this.getSelected()?.selected?.length !== 0) {
      this.props.isLineChart || this.props.isChain || this.props.isGreyChain
        ? this.props.handleClick(this.getSelected()?.selected)
        : this.props.action
        ? this.props.handleClick(
            this.props.action,
            this.getSelected()?.selected
          )
        : this.props.handleClick(this.getSelected()?.selected);
      this.setState({ showMenu: false });
    } else {
      // console.log("Please select");
    }

    if (this.props.isLineChart) {
      let options = this.state.options;
      this.setState({
        options: [
          options[0],
          ...options
            .slice(1, options?.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ],
      });
    }
    this.setState({ search: "" });
  };

  TruncateText = (string) => {
    if (string?.length > 9) {
      return string.substring(0, 9) + "..";
    }
    return string;
  };

  handleSearch = (event) => {
    this.setState({ search: event.target.value }, () => {
      this.copyToFilteredItems();
      if (this.props.searchIsUsed) {
        this.props.searchIsUsed();
      }
    });
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
        } ${this.props.isFromHomePage ? "custom-dropdown-home" : ""}`}
        ref={this.dropDownRef}
        onBlur={this.handleClickOutside}
        style={{ position: "relative" }}
      >
        <div
          className={`placeholderPriceDropdown  ${
            this.props.isLineChart ||
            this.props.isChain ||
            this.props.LightTheme
              ? "lineChartPlaceholder"
              : ""
          }`}
          style={{
            minWidth: this.props.isHomepage ? "10rem" : "",
          }}
          onClick={this.dropdownClicked}
        >
          <div
            style={{
              lineHeight: "1",
            }}
            className="placeholderPriceDropdownChild"
          >
            {this.props.singleSelect
              ? this.props.selectedTokenName
                ? this.props.selectedTokenName
                : ""
              : this.getSelected()?.length === 0
              ? this.state.name
              : this.props.isLineChart
              ? this.getSelected()?.length + "/4 Selected"
              : this.props.isChain
              ? this.getSelected()?.length +
                (this.getSelected()?.length > 1
                  ? " chains selected"
                  : " chain selected")
              : this.props.placeholderName
              ? this.getSelected()?.length +
                (this.getSelected()?.length > 1
                  ? " " + this.props.placeholderName + "s selected"
                  : " " + this.props.placeholderName + " selected")
              : this.getSelected()?.length + " Selected"}

            {!this.props.isLineChart &&
              !this.props.isChain &&
              !this.props.LightTheme && (
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
            {this.props.isFromHomePage ? (
              <div className="dropdownFilterIconContainer">
                <svg
                  width="8"
                  height="6"
                  viewBox="0 0 8 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2.8335H6"
                    stroke="var(--seeMoreColor)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0.75 1H7.25"
                    stroke="var(--seeMoreColor)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.25 4.6665H4.75"
                    stroke="var(--seeMoreColor)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            ) : this.props.isLineChart ||
              this.props.isChain ||
              this.props.LightTheme ? (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  // viewBox="0 0 20 20"
                >
                  {/* <path fill="none" d="M0 0h24v24H0V0z" /> */}
                  <path fill="#000000" d="M7 7l4 4 4-4H7z" />
                </svg>
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={`dropdown-content-price input-noshadow-dark ${
            this.state.showMenu ? "show" : ""
          }`}
          style={{
            minWidth: `${
              this.props.isLineChart || this.props.isChain ? "100%" : "130px"
            }`,
          }}
        >
          <div className="dropdown-search-wrapper">
            <Image
              className={
                this.props.filtername.toLowerCase() === "tokens"
                  ? "dropdown-search-wrapper-image-small"
                  : ""
              }
              src={SearchIcon}
            />
            <input
              value={this.state.search}
              type="text"
              placeholder={
                this.props.filtername.toLowerCase() === "all assets" ||
                this.props.filtername.toLowerCase() === "all assets selected" ||
                this.props.filtername.toLowerCase() === "tokens"
                  ? "Name or symbol"
                  : "Search"
              }
              onChange={this.handleSearch}
              className={`dropdown-search-input ${
                this.props.filtername.toLowerCase() === "tokens"
                  ? "dropdown-search-input-smaller"
                  : ""
              }`}
            />
          </div>
          <div
            className="dropdown-list"
            style={{
              overflowY: `${
                this.state.options?.length < 5 ? "hidden" : "scroll"
              }`,
            }}
          >
            {this.state.options?.length === 0 ||
            (this.state.options[0]?.label === "All" &&
              this.state.options?.length === 1) ? (
              <span>No Data</span>
            ) : (
              (this.state.search === ""
                ? this.state.options
                : this.state.filteredItems
              ).map((e, i) => {
                return (
                  <span
                    className={`${e?.isSelected ? "active" : ""} ${
                      this.props.isCaptialised ? "text-capitalize" : ""
                    } `}
                    // title={e.label}
                    key={i}
                    onClick={() => {
                      // this.onSelect(e);
                      if (this.props.singleSelect) {
                        this.onSingleSelect(e);
                      } else if (
                        this.getSelected()?.length < 4 &&
                        this.props.isLineChart
                      ) {
                        //for line Chart
                        this.onSelect(e);
                      } else if (this.props.isLineChart && e?.isSelected) {
                        //for line Chart
                        this.onSelect(e);
                      } else {
                        if (!this.props.isLineChart) {
                          //for transaction History
                          this.onSelect(e);
                        }
                      }
                    }}
                  >
                    {this.props.isLineChart
                      ? this.TruncateText(e?.label)
                      : e?.label}
                    <svg
                      className={`${e?.isSelected ? "show" : "hide"}`}
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
              })
            )}
          </div>

          {!this.props.singleSelect ? (
            <div className="dropdown-footer">
              <span
                className="secondary-btn dropdown-btn btn-bg-white-outline-black hover-bg-black"
                onClick={this.ClearAll}
                onMouseEnter={() => {
                  this.setState({
                    clearAll: true,
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    clearAll: false,
                  });
                }}
              >
                {this.props.isLineChart ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                      fill={`${this.state.clearAll ? "#fff" : "#000"}`}
                    />
                  </svg>
                ) : (
                  "Clear"
                )}
              </span>
              <span
                className="primary-btn dropdown-btn btn-bg-black hover-bg-white-outline-black"
                onClick={this.Apply}
                onMouseEnter={() => {
                  this.setState({
                    apply: true,
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    apply: false,
                  });
                }}
              >
                {this.props.isLineChart ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none" />
                    <polyline
                      fill="none"
                      stroke={`${this.state.apply ? "#000" : "#fff"}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                      points="216 72.005 104 184 48 128.005"
                    />
                  </svg>
                ) : (
                  "Apply"
                )}
              </span>
            </div>
          ) : (
            <div className="mt-2" />
          )}
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
  isLineChart: false,
};

export default CustomDropdown;
