import React from "react";
import { Button, Image, Breadcrumb, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BaseReactComponent,
  FormSubmitButton,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
  SelectControl,
  DatePickerControl,
} from "../../utils/form";
import backIcon from "../../assets/images/icons/back-arrow-icon.svg";
import settingsIcon from "../../assets/images/icons/settings-icon.svg";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import closeIcon from "../../assets/images/icons/close-icon.svg";
import moment from "moment";

class ComponentHeader extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchBy: "",
      search: (props.searchValue && props.searchValue.search) || "",
      searchField: "",
      franchiseOptionsList: [],
      fromDate: "",
      toDate: "",
    };
  }
  componentDidMount() { }

  delayTimer;
  onChangeMethod = (value) => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.props.onChangeMethod(this.state);
    }, 1000);
  };

  clearFilter = () => {
    this.setState({ searchBy: "", search: "" });
    this.props.reset();
  };

  clearSearch = () => {
    this.setState({ search: "" });
    this.props.clearSearch();
  };

  handleFromDate = () => {
    this.setState({ toDate: "" });
  };

  filterSubmit = () => {
    this.props.filterSearch(
      moment(this.state.fromDate).format("DD-MM-YYYY"),
      moment(this.state.toDate).format("DD-MM-YYYY"),
      this.state.franchiseId
    );
  };

  filterSubmit = () => {
    this.props.filterSearch(
      moment(this.state.fromDate).format("DD-MM-YYYY"),
      moment(this.state.toDate).format("DD-MM-YYYY"),
      this.state.franchiseId
    )
  }

  render() {
    return (
      <div className="component-header-wrapper">
        <div className="component-header">
          <div className="left">
            {this.props.backArrowBtn && (
              <div className="back-arrow">
                {this.props.history ? (
                  <Image
                    className="back-arrow-btn"
                    src={backIcon}
                    onClick={this.props.history.goBack}
                  />
                ) : (
                  <Link to={this.props.parentPageLink}>
                    <Image className="back-arrow-btn" src={backIcon} />
                  </Link>
                )}
              </div>
            )}
            <div className="info">
              <h1 className="page-title">{this.props.title}</h1>
              {this.props.breadcrumb && (
                <Breadcrumb>
                  <Breadcrumb.Item href="/">CRM</Breadcrumb.Item>
                  {this.props.parentPage && (
                    <Breadcrumb.Item href={`${this.props.parentPageLink}`}>
                      {this.props.parentPage}
                    </Breadcrumb.Item>
                  )}
                  <Breadcrumb.Item active>
                    {this.props.currentPage}
                  </Breadcrumb.Item>
                </Breadcrumb>
              )}
              {this.props.moduleName && (
                <p className="red-hat-display-regular grey-999">
                  {this.props.moduleName}
                </p>
              )}
            </div>
          </div>
          <div className="right">
            {this.props.isFilter && (
              <Image
                src={settingsIcon}
                className="setting-icon"
                onClick={this.props.handleFilter}
              />
            )}
            {this.props.isSearch && (
              <Form onValidSubmit={this.onChangeMethod}>
                <FormElement
                  valueLink={this.linkState(
                    this,
                    "search",
                    this.onChangeMethod
                  )}
                  // disabled={this.state.searchBy ? false : true}
                  // validations={[]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: this.props.placeholder,
                    },
                  }}
                  classes={{
                    inputField: "search-input",
                    prefix: "search-prefix",
                    suffix: "search-suffix",
                  }}
                />
                {this.state.search ? (
                  <Image
                    src={closeIcon}
                    onClick={this.clearSearch}
                    className="search-icon clear-icon"
                  />
                ) : (
                  <Image src={searchIcon} className="search-icon" />
                )}
              </Form>
            )}

            {this.props.secondaryBtnText && (
              <Button
                className="btn secondary-btn"
                onClick={this.props.isSecondaryBtn}
              >
                {this.props.secondaryBtnText}
              </Button>
            )}

            {this.props.primaryBtnText2 && (
              <Button
                className="btn black-btn"
                onClick={this.props.isPrimaryBtn2}
              >
                {this.props.primaryBtnText2}
              </Button>
            )}
            {this.props.primaryBtnText && (
              <Button
                className="btn black-btn"
                onClick={this.props.isPrimaryBtn}
              >
                {this.props.primaryBtnText}
              </Button>
            )}

            {this.props.isSettleSearch && (
              <span className="settlement">
                <Form onValidSubmit={this.filterSubmit}>
                  <FormElement
                    valueLink={this.linkState(
                      this,
                      "fromDate",
                      this.handleFromDate
                    )}
                    // label="Valid From"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "From date cannot be empty",
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "From Date",
                        //minDate: new Date(),
                      },
                    }}
                  />
                  <FormElement
                    valueLink={this.linkState(this, "toDate")}
                    // label="Valid To"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "To date cannot be empty",
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "To Date",
                        minDate: this.state.fromDate || new Date(),
                      },
                    }}
                  />
                  {
                    !this.props.isFranchise &&
                    <FormElement
                      valueLink={this.linkState(this, "franchiseId")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Franchise cannot be empty",
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Franchise",
                          options: this.props.franchiseOptionsList,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.franchiseId);
                            //console.log('Hello world!');
                          },
                        },
                      }}
                    />
                  }

                  <FormSubmitButton
                    customClass={`btn black-btn inactive-btn"}`}
                  >
                    Settle
                  </FormSubmitButton>
                </Form>
              </span>
            )}
            {this.props.isReport && (
              <span className="settlement">
                <Form
                  onValidSubmit={() => this.props.onChangeMethod(this.state)}
                >
                  <FormElement
                    valueLink={this.linkState(
                      this,
                      "fromDate",
                      this.handleFromDate
                    )}
                    // label="Valid From"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "From date cannot be empty",
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "From Date",
                        // minDate: new Date(),
                      },
                    }}
                  />
                  <FormElement
                    valueLink={this.linkState(this, "toDate")}
                    // label="Valid To"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "To date cannot be empty",
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "To Date",
                        minDate: this.state.fromDate || new Date(),
                      },
                    }}
                  />
                  <FormSubmitButton
                    customClass={`btn black-btn inactive-btn"}`}
                  >
                    Apply
                  </FormSubmitButton>
                </Form>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ComponentHeader;
