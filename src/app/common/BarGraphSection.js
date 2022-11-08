import React, { Component } from 'react'
import { GraphHeader } from './GraphHeader'
import CoinBadges from './CoinBadges';
import { BarGraphFooter } from './BarGraphFooter';
import { connect } from "react-redux";
import { Image } from 'react-bootstrap'
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
          options: props.options,
          options2: props.options2,
          data: props.data,
          activeFooter: 0,
          activeBadge: [{ name: "All", id: "" }],
          showFooter: props.showFooter,
          showBadges: props.showBadges,
          isArrow: props.isArrow,
          showPercentage: props.showPercentage,
          footerLabels: props.footerLabels,
          isScrollVisible: props.isScrollVisible,
        };
    }

    handleFooter = (event) => {
        this.setState({
            activeFooter: event.target.id
        })
    }
    handleFunction = (badge) => {
        let newArr = [...this.state.activeBadge]
        if (this.state.activeBadge.some(e => e.name === badge.name)) {
            let index = newArr.findIndex(x => x.name === badge.name)
            newArr.splice(index, 1)
            if (newArr.length === 0) {
                this.setState({
                    activeBadge: [{ name: "All", id: "" }]
                })
            } else {
                this.setState({
                    activeBadge: newArr
                })
            }
        } else if (badge.name === "All") {
            this.setState({
                activeBadge: [{ name: "All", id: "" }]
            })
        } else {
            let index = newArr.findIndex(x => x.name === "All")
            if (index !== -1) {
                newArr.splice(index, 1)
            }
            newArr.push(badge)
            this.setState({
                activeBadge: newArr
            })
        }
    }
    // NewWidth = () => {
    //     console
    // } 

    render() {
      console.log("options", this.state.options2);
      console.log("option2", this.state.options);
        return (
          <div
            className={`bar-graph-section ${
              this.props.marginBottom ? this.props.marginBottom : ""
            }`}
          >
            {this.state.headerTitle || this.state.headerSubTitle ? (
              <GraphHeader
                title={this.state.headerTitle}
                subtitle={this.state.headerSubTitle}
                isArrow={this.state.isArrow}
              />
            ) : (
              ""
            )}
            {this.state.showBadges ? (
              <CoinBadges
                handleFunction={this.handleFunction}
                activeBadge={this.state.activeBadge}
                chainList={this.props.coinsList}
                isScrollVisible={this.state.isScrollVisible}
              />
            ) : (
              ""
            )}
            {this.state.showPercentage ? (
              <div className="show-percentage-div ">
                <div
                  className={`inter-display-medium f-s-16 lh-19 grey-313 content ${
                    this.state.showPercentage.status === "Increase"
                      ? "inc"
                      : "dec"
                  }`}
                >
                  <Image
                    src={this.state.showPercentage.icon}
                    className="m-r-4"
                  />
                  {this.state.showPercentage.percent}${" "}
                  {this.state.showPercentage.status}
                </div>
              </div>
            ) : (
              ""
            )}
            <div style={{ display: "flex" }}>
             { this.state.options2 != undefined ? <div className='Y-axis'>
               
                <Bar options={this.state.options2} data={this.state.data} />
              </div>
                : ""
              }

              <div className="chartAreaWrapper">
                <div
                  className="chartArea"
                  style={{
                    width: `${
                      this.state.data.labels.length > 8
                        ? this.state.data.labels.length * 12.5
                        : 100
                    }%`,
                    minWidth: `${this.state.data.labels.length * 10}rem`,
                  }}
                >
                  <Bar options={this.state.options} data={this.state.data} />
                </div>
              </div>
            </div>

            {this.state.showFooter ? (
              <BarGraphFooter
                handleFooterClick={this.handleFooter}
                active={this.state.activeFooter}
                footerLabels={this.state.footerLabels}
              />
            ) : (
              ""
            )}
          </div>
        );
    }
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BarGraphSection);

