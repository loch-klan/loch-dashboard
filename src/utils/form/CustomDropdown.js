import React, { Component } from 'react'
import PropTypes from "prop-types";
import CustomOverlay from '../commonComponent/CustomOverlay';
import { Image } from 'react-bootstrap';
import SearchIcon from '../../assets/images/icons/dropdown-search.svg';
class CustomDropdown extends Component {
  constructor(props) {
    super(props);

    // console.log(props.options, "props option");
    //  console.log(state.options, "state option");

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
      if (this.props.selectedTokens.length !== 0) {
        // console.log("found array");
        //is already selected then this run
        let options = [];
        this.props.options.map((e) =>
          options.push({
            label: e.label,
            value: e.value,
            isSelected: this.props.selectedTokens.includes(e.value)
              ? true
              : false,
          })
        );
        this.state.options = [
          options[0],
          ...options
            .slice(1, options.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ];
        // console.log("option constructor", this.state.options);
      } else {
        // console.log("empty array");
        let options = [];
        this.props.options.map((e, i) =>
          options.push({
            label: e.label,
            value: e.value,
            isSelected: i < 5 && i !== 0 ? true : false,
          })
        );
        this.state.options = [
          options[0],
          ...options
            .slice(1, options.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ];
      }
    } else {
      // console.log("transaction", this.props.options);
      this.props.options.map((e, i) =>
        this.state.options.push({
          label: this.props.isChain ? e.name : e.label,
          value: this.props.isChain ? e.id : e.value,
          // isSelected: i === 0 && !this.props.isChain ? true : false,
          isSelected: true,
        })
      );
      if (this.props.isChain) {
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
  }

  componentDidUpdate(prevProps) {
    // if (!this.props.isLineChart && this.state.options?.length - 1 === this.getSelected().selected?.length) {
    //   this.selectedAll(true);
    //   console.log("in")
    // }
      if (
        prevProps.options.length === 0 ||
        prevProps.options.length !== this.props.options.length
      ) {
        if (this.props.isLineChart) {
          // console.log("in line chart");
          this.setState(
            {
              options: [],
            },
            () => {
              if (this.props.selectedTokens.length !== 0) {
                //is already selected then this run
                // console.log("in selected token");
                let options = [];
                Promise.all(
                  this.props.options.map((e) =>
                    options.push({
                      label: e.label,
                      value: e.value,
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
                          .slice(1, options.length)
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
                // console.log("op",options)
              } else {
                // console.log("in line chart empty");
                let options = [];
                Promise.all(
                  this.props.options.map((e, i) =>
                    options.push({
                      label: e.label,
                      value: e.value,
                      isSelected: i < 5 && i !== 0 ? true : false,
                    })
                  )
                ).then(() => {
                  this.setState({
                    options: [
                      options[0],
                      ...options
                        .slice(1, options.length)
                        .sort((a, b) => (a.label > b.label ? 1 : -1))
                        .sort((a, b) => b.isSelected - a.isSelected),
                    ],
                  });
                });

                //  console.log("op else", options);
              }
              this.getSelected();
              this.Apply();
            }
          );
        } else {
          // console.log("in transaction");
          // this.props.options.map((e, i) =>
          //   this.state.options.push({
          //     label: e.label,
          //     value: e.value,
          //     isSelected: i === 0 ? true : false,
          //   })
          // );

          // console.log("transaction", this.props.options);
          this.state.options = [];
          this.props.options.map((e, i) =>
            this.state.options.push({
              label: this.props.isChain ? e.name : e.label,
              value: this.props.isChain ? e.id : e.value,
              // isSelected: i === 0 && !this.props.isChain ? true : false,
              isSelected: true,
            })
          );

          // for chain
          if (this.props.isChain) {
            this.state.options = [
              { label: "All", value: "", isSelected: true },
              ...this.state.options,
            ];
          }
        }
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
    // console.log("option",option)
    if (option.value === this.state.options[0].value && !this.props.isLineChart) {
      // console.log("all clicked")
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

      this.setState({
        options: updatedOptions,
      }, () => {
        if (
          !this.props.isLineChart &&
          this.state.options?.length - 1 === this.getSelected().selected?.length
        ) {
          this.selectedAll(true);
          // console.log("in");
        }
      });
    }
   
    

    // console.log("option", option, "updated Option", this.state.options);
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
        this.props.isChain ? { name: e.label, id: e.value } : e?.value
      );
  
    let count;
    if (isAll) {
      // selected = this.props.isChain
      //   ? [{ name: "All", id: "" }]
      //   : selected?.toString();
      selected = this.props.isChain
        ? [{ name: "All", id: "" }]
        : this.props.isLineChart
        ? []
        : selected[0]?.toString();
      count = 0;
    } else {
      count = selected.length;
    }

    // console.log(selected, "selected", count, "count");
    //   console.log(this.state.options);
    return { selected: selected, length: count };
  };

  selectedAll = (value) => {
    let options = [];
    this.state?.options?.map(e => {
      options.push({
        label: e.label,
        value: e.value,
        isSelected: value,
      });
    });

    this.setState({
      options
    })
    // this.state.options = options;
  }

  ClearAll = () => {
    if (this.props.isLineChart) {
      this.onSelect(this.state.options[0]);
      let options = this.state.options;
      this.setState({
        options: [
          options[0],
          ...options
            .slice(1, options.length)
            .sort((a, b) => (a?.label > b?.label ? 1 : -1))
            .sort((a, b) => b?.isSelected - a?.isSelected),
        ],
      });
    } else {
      // console.log("clear", this.state.options[0]);
      // this.onSelect(this.state.options[0]);//
      this.selectedAll(false);
    }

    //   this.props.handleClick(this.props.action, this.getSelected().selected);
    // //    console.log(this.props.action, this.getSelected().selected, "apply");
    //     this.setState({ showMenu: false });
//  console.log(this.props.action, this.getSelected().selected, "apply");
    // this.props.isLineChart || this.props.isChain
    //   ? this.props.handleClick(this.getSelected().selected)
    //   : this.props.handleClick(this.props.action, this.getSelected().selected);
    // this.setState({ showMenu: false });
  };

  Apply = () => {
    // console.log(this.getSelected()?.selected, "apply");
    // console.log(this.props.action, this.getSelected().selected, "apply");
    if (this.getSelected()?.selected.length !== 0) {
      this.props.isLineChart || this.props.isChain
        ? this.props.handleClick(this.getSelected()?.selected)
        : this.props.action
        ? this.props.handleClick(
            this.props.action,
            this.getSelected()?.selected
          )
        : this.props.handleClick(
            this.getSelected()?.selected
          );
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
            .slice(1, options.length)
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .sort((a, b) => b.isSelected - a.isSelected),
        ],
      });
    }
  };

  TruncateText = (string) => {
    if (string.length > 9) {
      return string.substring(0, 9) + "..";
    }
    return string;
  };

  handleSearch = (event) => {
    // console.log("search", this.state.search);
    this.setState({ search: event.target.value });
    const filteredItems = this.state.options.filter((item) =>
      item.label.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.setState({ filteredItems }, () => {
      // console.log("filter", this.state.filteredItems)
      
    });
  };

  render() {
    return (
      <div
        className={`custom-dropdown cp ${
          this.props.isLineChart || this.props.isChain || this.props.LightTheme
            ? "lineChart"
            : this.props.isTopaccount ? "top-account-dropdown" :""
        }`}
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
          {this.getSelected().length === 0
            ? this.state.name
            : this.props.isLineChart
            ? this.getSelected().length + "/4 Selected"
            : this.props.isChain
            ? this.getSelected().length +
              (this.getSelected().length > 1
                ? " chains selected"
                : " chain selected")
            : this.props.placeholderName
            ? this.getSelected().length +
              (this.getSelected().length > 1
                ? " " + this.props.placeholderName + "s selected"
                : " " + this.props.placeholderName + " selected")
            : this.getSelected().length + " Selected"}

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
              this.props.isLineChart || this.props.isChain ? "100%" : "130px"
            }`,
          }}
        >
          {this.props.isChain && (
            <div className="dropdown-search-wrapper">
              <Image src={SearchIcon} />
              <input
                type="text"
                placeholder="Search"
                onChange={this.handleSearch}
                className="dropdown-search-input"
              />
            </div>
          )}
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
              (this.state.search == ""
                ? this.state.options
                : this.state.filteredItems
              ).map((e, i) => {
                return this.props.isLineChart && i === 0 ? (
                  ""
                ) : (
                  <span
                    className={e?.isSelected ? "active" : ""}
                    // title={e.label}
                    key={i}
                    onClick={() => {
                      // this.onSelect(e);
                      if (
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

          <div className="dropdown-footer">
            <span
              className="secondary-btn dropdown-btn"
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
              className="primary-btn dropdown-btn"
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
  isLineChart: false
};

export default CustomDropdown;
