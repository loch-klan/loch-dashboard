import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import WelcomeCard from './WelcomeCard';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ReactReduxContext } from 'react-redux';


ChartJS.register(ArcElement, Tooltip, Legend);

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }


    componentDidMount() { }


    render() {

        // const data = {
        //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //     datasets: [{
        //         label: '# of Votes',
        //         data: [12, 19, 3, 5, 2, 3],
        //         backgroundColor: [
        //             'rgba(255, 99, 132, 0.2)',
        //             'rgba(54, 162, 235, 0.2)',
        //             'rgba(255, 206, 86, 0.2)',
        //             'rgba(75, 192, 192, 0.2)',
        //             'rgba(153, 102, 255, 0.2)',
        //             'rgba(255, 159, 64, 0.2)',
        //         ],
        //         borderColor: [
        //             'rgba(255, 99, 132, 1)',
        //             'rgba(54, 162, 235, 1)',
        //             'rgba(255, 206, 86, 1)',
        //             'rgba(75, 192, 192, 1)',
        //             'rgba(153, 102, 255, 1)',
        //             'rgba(255, 159, 64, 1)',
        //         ],
        //         borderWidth: 1,
        //     }],
        // };

        // const options = {
        //     cutout: "75%",
        //     plugins: {
        //         legend: {
        //             display: false
        //         },
        //         tooltip: {
        //             enabled: false
        //         },
        //         events: false,
        //         animation: {
        //             duration: 0
        //         },
        //     },
        //     responsive: true,
        // }

        const options = {
            // colors: ['rgba(255, 99, 132, 0.2)',
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)'],
            chart: {
                styledMode: false,
                type: 'pie',
                backgroundColor: null,
                //height: (9 / 16 * 100) + '%',
                width: 1000,

                events: {
                    mouseOver: (event) => console.log('hhiii'),
                    // mouseOver: function () {
                    //     console.log('hi');

                    // },
                    mouseOut: function () {
                        console.log("xD");
                    },
                    render: function () {
                        var series = this.series[0],
                            seriesCenter = series.center,
                            x = seriesCenter[0] + this.plotLeft,
                            y = seriesCenter[1] + this.plotTop,
                            text = '<div class="pie-chart-middle-text-container"><div class="pie-chart-middle-text"><h1 class="space-grotesk-medium f-s-39 lh-20 black-1D2">$317,068</h1><p class="inter-display-semi-bold f-s-10 lh-12 grey-7C7 pie-chart-middle-text-currency">USD</p></div><span class="inter-display-medium f-s-13 lh-40 grey-7C7">Total Assets</span></div>',
                            fontMetrics = this.renderer.fontMetrics(16);
                        if (!this.customTitle) {
                            this.customTitle = this.renderer.text(
                                text,
                                null,
                                null,
                                true
                            )
                                .css({
                                    transform: 'translate(-50%)',
                                })
                                .add();
                        }

                        this.customTitle.attr({
                            x,
                            y: y + fontMetrics.f / 2
                        });
                    }
                }

            },

            accessibility: {

                point: {
                    valueSuffix: '%'
                }
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false,
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
            },
            plotOptions: {
                pie: {
                    size: 600,
                    // /allowPointSelect: true,
                    cursor: 'pointer',
                    // showInLegend: true,

                    connectorPadding: 2,
                    dataLabels: {
                        distance: 0,
                        tickWidth: 0,
                        padding: 6,
                        format: '<span style="color:{point.borderColor}">\u25CF &nbsp;&nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">{point.name} &nbsp;</p> <p class="inter-display-regular f-s-16 " style="fill:#B0B1B3">${point.usd} USD&nbsp;</p> <p class="inter-display-medium f-s-16" style="fill:#B0B1B3"> {point.y}%</p>',

                        // formatter: function () {
                        //     return '<span style="color:'+this.point.borderColor+'>Yash &nbsp;&nbsp;</span>'
                        //         + '<p class="inter-display-regular f-s-16" style="fill:#5B5B5B">'+this.point.name +'&nbsp;&nbsp;</p>'
                        //         + '<p class="inter-display-regular f-s-16 " style="fill:#B0B1B3">$'+this.point.usd +'USD&nbsp;&nbsp;</p>'
                        //         + '<p class="inter-display-medium f-s-16" style="fill:#B0B1B3">'+this.point.y+'%</p>'

                        // },
                        backgroundColor: '#FFFFFF',
                        enabled: true,
                        crop: false,
                        color: '#636467',
                        // borderWidth: .5,
                        borderRadius: 8,

                        verticalAlign: 'top',
                        style: {

                            //textOverflow: 'none'
                            // fontFamily: 'Inter-Regular',
                            // fontSize: '16px',
                            // fontWeight: 400,
                            // textShadow: 'none',
                            textOverflow: 'clip',
                            // width: 300,
                            // height: 20,
                            whiteSpace: 'nowrap'
                        }
                    },
                    states: {
                        hover: {
                            enabled: true,
                            color: 'red'
                        }
                    }
                }
            },
            series: [{
                name: 'Registrations',
                // colorByPoint: true,
                innerSize: '75%',
                size: "100%",
                data: [{
                    name: 'Bitcoin',
                    y: 68.1,
                    usd: "222,798.00",
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    color: 'rgba(255, 99, 132, 0.2)'
                }, {
                    name: 'Ethereum',
                    y: 11.0,
                    usd: "55,143",
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    color: 'rgba(54, 162, 235, 0.2)'
                    //     'rgba(255, 206, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)'],

                }, {
                    name: 'Solana',
                    y: 11.2,
                    usd: "19,925",
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    color: 'rgba(255, 206, 86, 0.2)'
                },
                 {
                    name: 'Avalanche',
                    y: 2.5,
                    usd: "6,303",
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    color: 'rgba(75, 192, 192, 0.2)'
                },
                {
                  name: 'Solana',
                  y: 2.5,
                  usd: "19,925",
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                  color: 'rgba(255, 206, 86, 0.2)'
              },
                {
                  name: 'Avalanche',
                  y: 4.7,
                  usd: "6,303",
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  color: 'rgba(75, 192, 192, 0.2)'
              }
              ]
            }]
        };

        return (
            <div className="portfolio-page-section" >
                <Sidebar ownerName="" />
                <div className='portfolio-container'>
                    <div className='portfolio-section page'>
                        <WelcomeCard />
                    </div>
                    <div className='portfolio-section page'>
                        <div className='portfolio-over-container'>
                            <h1 className='Inter-Medium overview-heading'>Overview</h1>
                            <div className='chart-section'>
                                {/* <Doughnut data={data} options={options} /> */}
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    portfolioState: state.PortfolioState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Portfolio.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);



