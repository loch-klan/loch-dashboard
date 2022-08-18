import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import CustomTable from '../../utils/commonComponent/CustomTable';
import { AccountType, PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import ActionDropdown from '../common/_utils/ActionDropdown';
import { getAllFranchiseApi } from './Api';
import Switch from '../common/_utils/Switch';
import { getUserAccountType } from '../../utils/ManageToken';

class Franchise extends Component {
    constructor(props) {
        super(props);
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const page = params.get("p");
        this.state = {
            data: [],
            conditions: [],
            page: page ? parseInt(page, 10) : START_PAGE + 1,
        }
    }

    componentDidMount() {
        this.props.getAllFranchiseApi(this);
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
                this.props.getAllFranchiseApi(this);
            } else {
                this.props.getAllFranchiseApi(this, page - 1);
            }
        }
    }

    onChangeMethod = (value) => {
        this.setState({
            searchValue: value,
            conditions: [{ key: "SEARCH_BY_TEXT", value: value.search }]
        });
        replaceHistory(this.props.history, START_PAGE, value.search)
        this.props.getAllFranchiseApi(this, START_PAGE);
    }

    clearSearch = (currentPage) => {
        this.setState({ searchValue: "", conditions: [] }, () => {
            if (currentPage === START_PAGE) {
                this.props.getAllFranchiseApi(this, START_PAGE);
            }
        });

        replaceHistory(this.props.history, START_PAGE + 1)
    }

    handleAddEditFranchise = (franchiseId = "") => {
        if (franchiseId) {
            this.props.history.push({
                pathname: `/franchise/edit-franchise/${franchiseId}`,
                state: { data: franchiseId }
            });
        } else {
            this.props.history.push("/franchise/add-franchise");
        }
    }

    handleViewFranchise = (franchiseId = "") => {
        this.props.history.push(`/franchise/view-franchise/${franchiseId}`);
    }

    render() {
        const { data, page, totalPage, } = this.state;
        const permissionList = getAssignedPermission();
        return (
            <>
                <ComponentHeader
                    backArrowBtn={false}
                    breadcrumb={true}
                    currentPage={"Franchise"}
                    title={"Franchise"}
                    isFilter={false}
                    isPrimaryBtn={() => this.handleAddEditFranchise()}
                    primaryBtnText={permissionList.includes(PermissionList.ADD_UPDATE_FRANCHISE) ? "+ Add Franchise" : ""}
                    isSearch={true}
                    placeholder={"Search Franchise"}
                    onChangeMethod={this.onChangeMethod}
                    clearSearch={() => this.clearSearch(page || START_PAGE)}
                />
                <div className='custom-table-wrapper'>
                    <CustomTable
                        tableData={data}
                        columnList={[
                            {
                                coumnWidth: 250,
                                labelName: "Account Name",
                                dataKey: "name",
                                className: "red-hat-display-bold",
                                isCell: true,
                                cell: (rowData, dataKey) => {
                                    if (dataKey === "name") {
                                        return rowData.name
                                    }
                                }
                            },
                            {
                                coumnWidth: 250,
                                labelName: "Account Email",
                                dataKey: "email",
                                className: "red-hat-display-bold",
                                isCell: true,
                                cell: (rowData, dataKey) => {
                                    if (dataKey === "email") {
                                        return rowData.billing_email
                                    }
                                }
                            },
                            /* {
                              coumnWidth: 250,
                              labelName: "Contact",
                              dataKey: "mobile",
                              className: "red-hat-display-bold",
                              isCell: true,
                              cell: (rowData, dataKey) => {
                                if (dataKey === "mobile") {
                                  return rowData.mobile
                                }
                              }
                            }, */
                            {
                                coumnWidth: 250,
                                labelName: "Contact",
                                dataKey: "email",
                                className: "",
                                isCell: true,
                                cell: (rowData, dataKey) => {
                                    if (dataKey === "email") {
                                        return rowData.billing_contact
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
                                                checked={rowData.active}
                                                handleClick={() => this.handleToggle(rowData)}
                                                handleBtn={false}
                                            />
                                        )
                                    }
                                }
                            },
                            {
                                coumnWidth: 50,
                                labelName: "",
                                dataKey: "options",
                                className: "options-column",
                                isCell: true,
                                cell: (rowData, dataKey) => {
                                    if (dataKey === "options") {
                                        const menuItem = [];
                                        if(permissionList.includes(PermissionList.ADD_UPDATE_FRANCHISE)){
                                          menuItem.push({
                                            title: "Edit",
                                            type: "event",
                                            handleClick: () => this.handleAddEditFranchise(rowData.id),
                                        })
                                        }
                                        if(permissionList.includes(PermissionList.VIEW_FRANCHISE)){
                                            menuItem.push({
                                                title: "View",
                                                type: "event",
                                                handleClick: () => this.handleViewFranchise(rowData.id),
                                            })
                                          }
                                        return (
                                            <ActionDropdown
                                                menuItem={menuItem}
                                            />
                                        )
                                    }
                                }
                            }
                        ]}
                        // For Pagination
                        history={this.props.history}
                        location={this.props.location}
                        totalPages={totalPage}
                        currentPage={page}
                        message={"Franchise list is empty"}
                    />
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    franchiseState: state.FranchiseState
});
const mapDispatchToProps = {
    getAllFranchiseApi
}
Franchise.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Franchise);