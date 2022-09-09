import react from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class LineChart extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        const options = {
            title: {
                text: null
            },
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                labels: {
                    style: {

                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineDashStyle: 'longdash',
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
            },
            // series: [
            //     {                    
            //         name: 'Bitcoin',
            //         color: 'rgba(255, 99, 132, 1)',
            //         marker: {
            //             enabled: false,
            //           },
            //           type:'line',
            //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            //     },
            //     {
            //         name: 'Ethereum',
            //         color: 'rgba(54, 162, 235, 1)',
            //         marker: {
            //             enabled: false,
            //           },
            //           type:'line',
            //         data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
            //     },
            //     {
            //         name: 'Bitcoin',
            //         y: 68.1,
            //         usd: "222,798",
            //         borderColor: 'rgba(255, 99, 132, 1)',
            //         borderWidth: 2,
            //         color: 'rgba(255, 99, 132, 0.2)',
            //         originalColor: 'rgba(255, 99, 132, 0.2)'
            //     }
            // ]
            series: [
                {
                    name: 'Bitcoin',
                    id: 'Bitcoin',
                    color: 'rgba(255, 99, 132, 1)',
                    data: []
                }, {
                    linkedTo: 'Bitcoin',
                    type: 'line',
                    color: 'rgba(255, 99, 132, 1)',
                    marker: {
                        enabled: false
                    },
                    data: [40000, 35000, 28000, 22000, 24000, 45000, 39000, 42000]
                }
                , {
                    name: 'Ethereum',
                    id: 'Ethereum',
                    color: 'rgba(54, 162, 235, 1)',
                    data: []
                }, {
                    linkedTo: 'Ethereum',
                    type: 'line',
                    color: 'rgba(54, 162, 235, 1)',
                    marker: {
                        enabled: false
                    },
                    data: [10000, 9000, 11000, 6000, 7000, 12000, 13000, 11500]
                }]
        }
        return (
            <div className="welcome-card-section">
                <div className='chart-section'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </div>
        );
    }
}

export default LineChart;