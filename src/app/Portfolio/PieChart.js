import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class PieChart extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        const options = {
            chart: {
                styledMode: false,
                type: 'pie',
                backgroundColor: null,
                //height: (9 / 16 * 100) + '%',
                width: 1000,
                events: {
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
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
            },
            plotOptions: {
                pie: {
                    size: 600,
                    cursor: 'pointer',
                    connectorPadding: 2,
                    states: {
                        inactive: {
                            opacity: 0,
                            enabled: true,
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                let color = this.options.borderColor;
                                this.update({ color: color });
                                var currentData = this;
                                this.series.data.forEach(function (data) {
                                    if (currentData.id !== data.id) {
                                        data.update({ opacity: 0.2 }, true);
                                    } else {
                                        data.update({ opacity: 1 }, false);
                                    }
                                })
                            },
                            mouseOut: function () {
                                let color = this.options.originalColor;
                                this.update({ color: color });
                                this.series.data.forEach(function (data) {
                                    data.update({ opacity: 1 }, false);
                                });
                            }
                        },
                    },
                    dataLabels: {
                        distance: 0,
                        tickWidth: 0,
                        padding: 12,
                        format: '<span class="f-s-16" style="color:{point.borderColor};">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16 test1" style="fill:#5B5B5B">{point.name}&nbsp;</p> <p class="inter-display-regular f-s-16 test1" style="fill:#B0B1B3">${point.usd} USD&nbsp;</p><p class="inter-display-medium f-s-16 test1" style="fill:#B0B1B3"> {point.y}% &nbsp;&nbsp;</p>',
                        backgroundColor: '#FFFFFF',
                        enabled: true,
                        crop: false,
                        color: '#636467',
                        borderRadius: 8,
                        verticalAlign: 'top',
                        style: {
                            textOverflow: 'clip',
                            whiteSpace: 'nowrap'
                        }
                    },
                }
            },
            series: [{
                name: 'Registrations',
                innerSize: '75%',
                size: "100%",
                data: [{
                    name: 'Bitcoin',
                    y: 68.1,
                    usd: "222,798",
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    color: 'rgba(255, 99, 132, 0.2)',
                    originalColor: 'rgba(255, 99, 132, 0.2)'
                }, {
                    name: 'Ethereum',
                    y: 11.0,
                    usd: "55,143",
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    color: 'rgba(54, 162, 235, 0.2)',
                    originalColor: 'rgba(54, 162, 235, 0.2)'

                }, {
                    name: 'Solana',
                    y: 11.2,
                    usd: "19,925",
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    color: 'rgba(255, 206, 86, 0.2)',
                    originalColor: 'rgba(255, 206, 86, 0.2)'
                },
                {
                    name: 'Avalanche',
                    y: 2.5,
                    usd: "6,303",
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    color: 'rgba(75, 192, 192, 0.2)',
                    originalColor: 'rgba(75, 192, 192, 0.2)'
                },
                {
                    name: 'Solana',
                    y: 2.5,
                    usd: "19,925",
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    color: 'rgba(255, 206, 86, 0.2)',
                    originalColor: 'rgba(255, 206, 86, 0.2)'
                },
                {
                    name: 'Avalanche',
                    y: 4.7,
                    usd: "6,303",
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    color: 'rgba(75, 192, 192, 0.2)',
                    originalColor: 'rgba(75, 192, 192, 0.2)'
                }
                ]
            }]
        };
        return (
            <div className='portfolio-over-container'>
                <h1 className='Inter-Medium overview-heading'>Overview</h1>
                <div className='chart-section'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </div>

        )

    }
}

export default PieChart;