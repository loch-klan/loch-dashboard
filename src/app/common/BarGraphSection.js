import React, { Component } from 'react'
import { GraphHeader } from './GraphHeader'
import CoinBadges from './CoinBadges';
import { BarGraphFooter } from './BarGraphFooter';
import { connect } from "react-redux";
import { Form, Image } from 'react-bootstrap'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { BlockchainFeesFilter, CounterpartyFeesFilter } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
import Loading from './Loading';
import { CurrencyType } from '../../utils/ReusableFunctions';
import DropDown from './DropDown';
import CustomDropdown from '../../utils/form/CustomDropdown';
import { info } from '../intelligence/stackGrapgh';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import { BarGraphSection } from './BarGraphSection';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class BarGraphSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerTitle: props.headerTitle,
      headerSubTitle: props.headerSubTitle,
      options: props.options ? props.options : [],
      options2: props.options2 ? props.options2 : [],
      data: props.data ? props.data : null,
      activeFooter: props.activeTitle ? props.activeTitle : 0,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      showFooter: props.showFooter,
      showBadges: props.showBadges,
      isArrow: props.isArrow,
      showPercentage: props.showPercentage,
      footerLabels: props.footerLabels,
      isScrollVisible: props.isScrollVisible,
      isScroll: props.isScroll,
      digit: props.digit ? props.digit : 3,
      showFooterDropdown: props.showFooterDropdown,
      footerDropdownLabels: props.footerDropdownLabels,
      // activeDropdown: props.activeDropdown,
      handleSelect: props.handleSelect,
      switchselected: false,
      stackedgraphdata: {
        options: info[0],
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options != this.props.options) {
      this.setState({
        options: this.props.options,
        options2: this.props.options2,
        data: this.props.data,
        showPercentage: this.props.showPercentage
      });
      // console.log("active badge", this.state.activeBadge)
      // console.log("active badgeList", this.state.activeBadgeList);
      // this.state.activeBadge && this.state.activeBadge.map((e, i) => {
      //   this.handleFunction(e);
      //   console.log("index", i)
      // });
    }

    if (prevProps.digit != this.props.digit) {
       this.setState({
         digit: this.props.digit
       });
    }
  }

  handleFooter = (event) => {
    this.setState({
      activeFooter: event.target.id,
       activeBadge: [{ name: "All", id: "" }],
                      activeBadgeList: [],
    })
    // console.log("handle footer", event.target.id);
    this.props.timeFunction(event.target.id, this.state.activeBadgeList);
  };
  handleFunction = (badge) => {
    // console.log("badge",badge)
    let activeFooter = this.props.showFooterDropdown ? this.props.activeDropdown : this.state.activeFooter;
    if (badge?.[0].name === "All") {
      this.setState(
        {
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
        
        },
        () => {
          this.props.handleBadge(this.state.activeBadgeList, activeFooter);
        }
      );
    } else {
      this.setState(
        {
          activeBadge: badge,
          activeBadgeList: badge?.map((item) => item.id),
        
        },
        () => {
          this.props.handleBadge(this.state.activeBadgeList, activeFooter);
        }
      );
    }
    // let newArr = [...this.state.activeBadge];
    // let activeFooter = this.props.showFooterDropdown ? this.props.activeDropdown : this.state.activeFooter;
    // if (this.state.activeBadge.some((e) => e.name === badge.name)) {
    //   let index = newArr.findIndex((x) => x.name === badge.name);
    //   newArr.splice(index, 1);
    //   if (newArr.length === 0) {
    //     this.setState(
    //       {
    //         activeBadge: [{ name: "All", id: "" }],
    //         activeBadgeList: [],
    //       },
    //       () => {
    //         this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //       }
    //     );
    //   } else {
    //     this.setState(
    //       {
    //         activeBadge: newArr,
    //         activeBadgeList: newArr?.map((item) => item.id),
    //       },
    //       () => {
    //         this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //       }
    //     );
    //   }
    // } else if (badge.name === "All") {
    //   this.setState(
    //     {
    //       activeBadge: [{ name: "All", id: "" }],
    //       activeBadgeList: [],
    //     },
    //     () => {
    //       this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //     }
    //   );
    // } else {
    //   let index = newArr.findIndex((x) => x.name === "All");
    //   if (index !== -1) {
    //     newArr.splice(index, 1);
    //   }
    //   newArr.push(badge);
    //   this.setState(
    //     {
    //       activeBadge: newArr,
    //       activeBadgeList: newArr?.map((item) => item.id),
    //     },
    //     () => {
    //       this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //     }
    //   );
    // }

    if (this.props.headerTitle === "Blockchain Fees over Time")
      BlockchainFeesFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        asset_selected: badge.name,
      });

    if (this.props.headerTitle === "Counterparty Fees Over Time")
      CounterpartyFeesFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        asset_selected: badge.name,
      });
  };

  render() {
    const {
      data,
      options,
      options2,
      headerTitle,
      headerSubTitle,
      isArrow,
      showPercentage,
      showBadges,
      activeBadge,
      isScrollVisible,
      isScroll,
      showFooter,
      footerLabels,
      digit,
      showFooterDropdown,
      footerDropdownLabels,
      handleSelect
    } = this.state;
    const {
      marginBottom,
      comingSoon,
      coinsList,
      activeFooter,
      className = "",
      handleClick,
      isLoading,
      showSwitch,
    } = this.props;
    //  console.log("bar gr state digit", digit);
    // const digit =
    //   data && ("" + Math.round(Math.max(...data.datasets[0].data))).length;
    // console.log("bar digit", digit, Math.max(...data.datasets[0].data));

    const ScrollStyle = {
      width: `${data && data.labels.length * 12.5}%`,
      minWidth: `${data && data.labels.length * 10}rem`,
    };
    const NormalStyle = {
      width: "100%",
      minWidth: "100%",
    };
    return (
      <div
        className={`bar-graph-section ${marginBottom ? marginBottom : ""}`}
        style={this.props.isCounterPartyMini ? { paddingBottom: "0rem" } : {}}
      >
        {headerTitle || headerSubTitle ? (
          <GraphHeader
            title={headerTitle}
            subtitle={headerSubTitle}
            isArrow={isArrow}
            handleClick={handleClick}
          />
        ) : (
          ""
        )}

        {data && options && !isLoading ? (
          <span className={`${comingSoon ? "blur-effect" : ""}`}>
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                {showFooter && (
                  <div
                    style={{
                      width: "75%",
                    }}
                  >
                    <BarGraphFooter
                      handleFooterClick={this.handleFooter}
                      active={this.state.activeFooter}
                      footerLabels={footerLabels}
                    />
                  </div>
                )}

                {showBadges && (
                  <div
                    style={{
                      width: "100%",
                      minWidth: "18rem",
                      maxWidth: "20rem",
                      marginLeft: "1rem",
                    }}
                  >
                    <CustomDropdown
                      filtername="All chains selected"
                      options={coinsList}
                      action={null}
                      handleClick={this.handleFunction}
                      isChain={true}
                      // selectedTokens={this.state.activeBadge}
                    />
                  </div>
                )}
              </div>
            </>

            {
              <p className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 p-t-10 p-b-20 custom-label">
                {CurrencyType()}{" "}
              </p>
            }
            {showSwitch ? (
              <div
                style={{
                  textAlign: "right",
                  marginTop: "-2rem",
                  marginBottom: "2rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="click to show breakdown"
                    // checked={this.state.switchselected}

                    onChange={(e) => {
                      console.log(e.target.checked);
                      this.setState({
                        switchselected: e.target.checked,
                      });
                    }}
                  />
              
              </div>
            ) : (
              ""
            )}
            {showPercentage ? (
              <div className="show-percentage-div ">
                <div
                  className={`inter-display-medium f-s-16 lh-19 grey-313 content ${
                    showPercentage.status === "Increase"
                      ? "inc"
                      : showPercentage.status === "No Change"
                      ? "inc"
                      : "dec"
                  }`}
                >
                  <Image src={showPercentage.icon} className="m-r-4" />
                  {showPercentage.percent}% {showPercentage.status}
                </div>
              </div>
            ) : (
              ""
            )}
            {/* Graph Section */}
            <div className={className} style={{ display: "flex" }}>
              {options2 != undefined && isScroll && data.labels.length > 8 ? (
                <div style={{ width: `${digit}rem` }}>
                  <Bar options={options2} data={data} />
                </div>
              ) : (
                ""
              )}

              <div
                className={
                  options2 != undefined && isScroll && data.labels.length > 8
                    ? "ScrollArea"
                    : "ChartAreaWrapper"
                }
                style={{
                  width: `${
                    options2 != undefined && isScroll && data.labels.length > 8
                      ? "calc(100 % - " + digit + "rem)"
                      : "100%"
                  }`,
                }}
              >
                {!this.state.switchselected ? (
                  <div
                    className="chartArea"
                    style={
                      data.labels.length > 8 && isScroll
                        ? ScrollStyle
                        : NormalStyle
                    }
                  >
                    <Bar options={options} data={data} />
                  </div>
                ) : (
                  <div className="chartArea">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={this.state.stackedgraphdata.options}
                      // constructorType={"stockChart"}
                      // allowChartUpdate={true}
                      // updateArgs={[true]}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Grapgh Section End */}

            {showFooterDropdown ? (
              <div className="chart-x-selection">
                <DropDown
                  class="line-chart-dropdown"
                  list={footerDropdownLabels}
                  onSelect={(opt) => {
                    this.setState({
                      activeBadge: [{ name: "All", id: "" }],
                      activeBadgeList: [],
                    });
                    handleSelect(opt);
                  }}
                  title={this.props.activeDropdown}
                  activetab={this.props.activeDropdown}
                />
              </div>
            ) : (
              ""
            )}
          </span>
        ) : (
          <div
            style={{
              height: "30rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

BarGraphSection.defaultProps = {
  isScroll: false,
};

const mapStateToProps = state => ({

});
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BarGraphSection);

