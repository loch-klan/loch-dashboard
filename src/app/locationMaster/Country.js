import React, { Component } from 'react';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { LocationType, START_PAGE } from '../../utils/Constant';
import { ComponentHeader } from '../common';
import { getAllLocationApi, updateLocationApi } from '../common/Api';
import Switch from '../common/_utils/Switch';

class Country extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      countryList: [],
      // showFilter: false,
      conditions: []
    }
  }

  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.COUNTRY);

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
      if (search) {
        // this.props.getAllIotApi(this);
      } else {
        // this.props.getAllIotApi(this, page - 1);
      }
    }
  }

  handleToggle = (rowData) => {
    const { id, is_operational, code, name, type } = rowData;
    let data = new URLSearchParams();
    data.append("location_id", id);
    data.append("location_type", type);
    data.append("name", name);
    data.append("code", code);
    data.append("is_operational", !is_operational);
    this.props.updateLocationApi(data, this);
  };

  // handleAddCountry = (rowData = "") => {
  //   if (rowData) {
  //     this.props.history.push({
  //       pathname: `/location-master/country/edit-country/${rowData.id}`,
  //       state: { data: rowData }
  //     });
  //   } else {
  //     this.props.history.push("/location-master/country/add-country");
  //   }
  // }

  // onChangeMethod = (value) => {
  //   this.setState({
  //     searchValue: value,
  //     conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
  //   });
  //   replaceHistory(this.props.history, START_PAGE, value.search)
  //   // this.props.getAllIotApi(this, START_PAGE);
  // }

  // clearSearch = (currentPage) => {
  //   this.setState({ searchValue: "", conditions: [] });
  //   if (currentPage === START_PAGE) {
  //     // this.props.getAllIotApi(this, START_PAGE);
  //   }
  //   replaceHistory(this.props.history, START_PAGE)
  // }
  render() {
    const { page, totalPage, countryList } = this.state;
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"Country"}
          title={"Country"}
        />
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={countryList}
            columnList={[
              {
                coumnWidth: 200,
                labelName: "Country Name",
                dataKey: "name",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "name") {
                    return rowData.name
                  }
                }
              },

              {
                coumnWidth: 350,
                labelName: "Code",
                dataKey: "code",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "code") {
                    return rowData.code
                  }
                }
              },
              {
                coumnWidth: 350,
                labelName: "Operation Status",
                dataKey: "is_operational",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "is_operational") {
                    return (
                      <Switch
                        checked={rowData.is_operational}
                        handleClick={() => this.handleToggle(rowData)}
                      />
                    )
                  }
                }
              },
              // {
              //   coumnWidth: 50,
              //   labelName: "",
              //   dataKey: "options",
              //   className: "",
              //   isCell: true,
              //   cell: (rowData, dataKey) => {
              //     if (dataKey === "options") {
              //       const menuItem = [];
              //       menuItem.push({
              //         title: "Edit",
              //         type: "event",
              //         handleClick: () => this.handleAddCountry(rowData),
              //       })
              //       menuItem.push({
              //         title: "View Details",
              //         type: "",
              //         linkUrl: `location-master/country/${rowData.id}`,
              //       })
              //       if (permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY)) {
              //         return (
              //           <ActionDropdown
              //             menuItem={menuItem}
              //           />
              //         )
              //       }
              //     }
              //   }
              // }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"Country list is empty"}
          />
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  locationMasterState: state.LocationMasterState
});
const mapDispatchToProps = {
  getAllLocationApi,
  updateLocationApi
}
Country.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Country);