import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { LocationType, START_PAGE } from '../../utils/Constant';
import { BaseReactComponent, Form, FormElement, SelectControl } from '../../utils/form';
// import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
// import ActionDropdown from '../common/_utils/ActionDropdown';
import {getAllLocationApi, updateLocationApi} from '../common/Api';
import Switch from '../common/_utils/Switch';

class City extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      page: page ? parseInt(page, 10) : START_PAGE + 1,
      cityList: [],
      // showFilter: false,
      conditions: [],
      stateId: "",
      stateList: [],
    }
  }

  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.STATE)
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
    console.log('rowData',rowData);
    const { id, is_operational, code, name, type, parent_id } = rowData;
    let data = new URLSearchParams();
    data.append("location_id", id);
    data.append("location_type", type);
    data.append("name", name);
    data.append("code", code);
    data.append("parent_id", parent_id);
    data.append("is_operational", !is_operational);
    this.props.updateLocationApi(data, this);
  };

  // handleFilter = () => {
  //   this.setState({
  //     showFilter: !this.state.showFilter
  //   })
  // }

  // handleAddCountry = (rowData = "") => {
  //   if (rowData) {
  //     this.props.history.push({
  //       pathname: `/location-master/city/edit-city/${rowData.id}`,
  //       state: { data: rowData }
  //     });
  //   } else {
  //     this.props.history.push("/location-master/city/add-city");
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
    const { page, totalPage, cityList } = this.state;
    // const permissionList = getAssignedPermission();
    return (
      <>
        <ComponentHeader
          breadcrumb={true}
          currentPage={"City"}
          title={"City"}
          // isFilter={false}
          // isPrimaryBtn={() => this.handleAddCountry()}
          // primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_TELEMATICS_INVENTORY) ? "+ Add City" : ""}
          // isSearch={true}
          // placeholder={"Search City"}
          // onChangeMethod={this.onChangeMethod}
          // clearSearch={() => this.clearSearch(page || START_PAGE)}
        />
        <div className='state-wrapper'>
        <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
          <Row>
            <Col sm={6}>
        <FormElement
                  valueLink={this.linkState(this, "stateId")}
                  label="Select State"
                  control={{
                    type: SelectControl,
                    settings: {
                      placeholder: "Select State",
                      options: this.state.stateList,
                      multiple: false,
                      searchable: true,
                      onChangeCallback: (onBlur) => {
                        this.props.getAllLocationApi(this, LocationType.CITY);
                        onBlur(this.state.searchableSingleRegion);
                        console.log('Hello world!');
                      }
                    }
                  }}
                />
                </Col>
          </Row>
                </Form>
        </div>
        <div className='custom-table-wrapper'>
          <CustomTable
            tableData={cityList}
            columnList={[
              {
                coumnWidth: 200,
                labelName: "City Name",
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
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={totalPage}
            currentPage={page}
            message={"City list is empty"}
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
City.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(City);