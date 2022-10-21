import React,{ Component }  from 'react'
import { GraphHeader } from './GraphHeader'
import CoinBadges from './CoinBadges';
import { BarGraphFooter } from './BarGraphFooter';
import { connect } from "react-redux";
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
            data: props.data,
            activeFooter: 0,
            activeBadge : [{ name: "All", id: "" }],
            showFooter : props.showFooter,
            showBadges  :props.showBadges,
            isArrow : props.isArrow
        }
    }

    handleFooter = (event)=>{
        this.setState({
            activeFooter : event.target.id
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

    render() {
        return (
            <div className={`bar-graph-section ${this.props.marginBottom ? this.props.marginBottom : ""}`}>
                <GraphHeader
                    title={this.state.headerTitle}
                    subtitle={this.state.headerSubTitle}
                    isArrow={this.state.isArrow}
                />
                {this.state.showBadges ? 
                <CoinBadges 
                handleFunction={this.handleFunction}
                activeBadge = {this.state.activeBadge}
                chainList = {this.props.coinsList}
                />
                :
                ""
                }
                <div>
                <Bar
                    width={this.props.width} // 824
                    height={this.props.height} //400
                    options={this.state.options}
                    data={this.state.data}
                />
                </div>
                {this.state.showFooter ? 
                <BarGraphFooter
                    handleFooterClick={this.handleFooter}
                    active={this.state.activeFooter}
                />
                :
                ""
                }

            </div>
        )
    }
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BarGraphSection);

