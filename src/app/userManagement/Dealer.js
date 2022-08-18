import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import CustomTable from '../../utils/commonComponent/CustomTable';
import { AccountType, START_PAGE } from '../../utils/Constant';
import { replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
// import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllAccountApi } from './Api';
;


class Dealer extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      data: [],
      conditions: [{ "key": "SEARCH_BY_TYPE", "value": AccountType.DEALER, "context": null }],
      page: page ? parseInt(page, 10) : START_PAGE + 1,
    }
  }

  componentDidMount() {
    this.props.getAllAccountApi(this)
    this.props.history.replace({
      search: `?p=${this.state.page}`
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get('p'), 10) || 1;

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get('p'), 10) || 1;
    const search = params.get('search') || "";

    if (prevPage !== page) {
      // this.setState({ page })
      if (search) {
        this.props.getAllAccountApi(this);
      } else {
        this.props.getAllAccountApi(this, page - 1);
      }
    }
  }

  handleAddDealer = () => {
    this.props.history.push("/user-management/dealer/add-dealer");
  }

  onChangeMethod = (value) => {
    this.setState({
      searchValue: value,
      conditions: [
        { "key": "SEARCH_BY_TYPE", "value": AccountType.DEALER, "context": null },
        { key: "SEARCH_BY_TEXT", value: value.search }
      ]
    });
    replaceHistory(this.props.history, START_PAGE, value.search)
    this.props.getAllAccountApi(this, START_PAGE);
  }

  clearSearch = (currentPage) => {
    console.log('currentPage', currentPage);
    this.setState({ page: currentPage, searchValue: "", conditions: [{ "key": "SEARCH_BY_TYPE", "value": AccountType.DEALER, "context": null }] }, () => {
      if (currentPage === START_PAGE) {
        this.props.getAllAccountApi(this, START_PAGE);
      }
    });

    replaceHistory(this.props.history, START_PAGE + 1)
  }

  render() {
    const { data, page, totalPage, } = this.state;
    return (
      <>
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Dealers"}
          title={"Dealers"}
          isFilter={false}
          isPrimaryBtn={this.handleAddDealer}
          primaryBtnText={"+ Add Dealer"}
          isSearch={true}
          placeholder={"Search Dealer"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={data}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Company Name",
                dataKey: "companyName",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "companyName") {
                    return rowData.name
                  }
                }
              },
              /* {
                coumnWidth: 250,
                labelName: "Dealer Name",
                dataKey: "dealerName",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "dealerName") {
                    return rowData.dealerName
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Contact Number",
                dataKey: "contactNumber",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "contactNumber") {
                    return rowData.contactNumber
                  }
                }
              }, */
              {
                coumnWidth: 250,
                labelName: "Email",
                dataKey: "email",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "email") {
                    return rowData.billing_email
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Location",
                dataKey: "location",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "location") {
                    return rowData.extra_information.state_details.name + " - " + rowData.extra_information.city_details.name
                  }
                }
              },
              /* {
                coumnWidth: 250,
                labelName: "",
                dataKey: "options",
                className: "options-column",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "options") {
                    const menuItem = [
                      {
                        title: "View Details",
                        type: "link",
                        linkUrl: `view-details`
                      },
                      {
                        title: "Raise Service Request",
                        type: "link",
                        linkUrl: `view-details`
                      },
                      {
                        title: "Allocate Vehicle",
                        type: "link",
                        linkUrl: `view-details`
                      },
                    ];
                    return (
                      <ActionDropdown
                        menuItem={menuItem}
                      />
                    )
                  }
                }
              } */
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"Dealer list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  userManagementState: state.UserManagementState
});
const mapDispatchToProps = {
  getAllAccountApi
}
// Customers.propTypes = {
//   // getPosts: PropTypes.func
// };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dealer));