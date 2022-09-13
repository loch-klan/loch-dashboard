import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class PieChart extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            pieSectionDataEnabled: {}
        }

    }

    render() {
        let self = this;
        const options = {
            chart: {
                styledMode: false,
                type: 'pie',
                backgroundColor: null,
                //height: (9 / 16 * 100) + '%',
                width: 1000,
                events: {
                    load: function (event) {
                        //When is chart ready?
                        event.target.series[0].data.map((e) => {
                            if (e.colorIndex >= 4) {
                                e.dataLabels[0].css({
                                    opacity: 0,
                                })
                                    .add();
                            }
                        })
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
                        // inactive: {
                        //     enabled: true,
                        //     opacity: 0,
                        // }
                    },
                    shadow: false,
                    allowPointSelect: true,
                    point: {
                        events: {
                            click: function () {
                                let currentHoverData = Object.keys(self.state.pieSectionDataEnabled).length > 0 ? {} : this
                                self.setState({ pieSectionDataEnabled: currentHoverData });
                            },
                            mouseOver: function () {
                                let color = this.options.borderColor;
                                this.update({ color: color });
                                var currentData = this;
                                // self.setState({ pieSectionDataEnabled: currentData });
                                this.series.data.forEach(function (data) {
                                    if (currentData.colorIndex !== data.colorIndex) {
                                        data.update({ opacity: 0.2 }, true);
                                        data.dataLabel.css({
                                            opacity: 0
                                        })
                                            .add();
                                    } else {
                                        data.update({ opacity: 1 }, false);
                                        data.dataLabel.css({
                                            opacity: 1
                                        })
                                            .add();
                                        if (data.colorIndex >= 4) {
                                            data.dataLabels[0].css({
                                                opacity: 1
                                            })
                                                .add();
                                        }
                                    }
                                })
                            },
                            mouseOut: function () {
                                let color = this.options.originalColor;
                                this.update({ color: color });
                                // self.setState({ pieSectionDataEnabled: {} })
                                this.series.data.forEach(function (data) {
                                    data.update({ opacity: 1 }, false);
                                    if (data.colorIndex >= 4) {
                                        data.dataLabels[0].css({
                                            opacity: 0
                                        })
                                            .add();
                                    } else {
                                        data.dataLabels[0].css({
                                            opacity: 1
                                        })
                                            .add();
                                    }
                                });
                            }
                        },
                    },
                    dataLabels: {
                        distance: 0,
                        tickWidth: 0,
                        padding: 12,
                        style: {
                            textShadow: false
                        },
                        format: '<span class="f-s-16" style="color:{point.borderColor};">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">{point.name}&nbsp;</p> <p class="inter-display-regular f-s-16" style="fill:#B0B1B3">${point.usd} USD&nbsp;</p><p class="inter-display-medium f-s-16" style="fill:#B0B1B3"> {point.y}% &nbsp;&nbsp;</p>',
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
                states: {
                    hover: {
                        halo: {
                            size: 0
                        }
                    }
                },
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
                    y: 4.7,
                    usd: "6,303",
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    color: 'rgba(75, 192, 192, 0.2)',
                    originalColor: 'rgba(75, 192, 192, 0.2)'
                },
                {
                    name: 'LiteCoin',
                    y: 2.5,
                    usd: "6,303",
                    borderColor: '#7B44DA',
                    borderWidth: 2,
                    color: '#a07ddd',
                    originalColor: '#a07ddd'
                },
                {
                    name: 'Ripple',
                    y: 2.5,
                    usd: "19,925",
                    borderColor: '#F19938',
                    borderWidth: 2,
                    color: '#e7c5a0',
                    originalColor: '#e7c5a0'
                }
                ]
            }]
        };
        console.log(this.state.pieSectionDataEnabled)
        return (
            <div className='portfolio-over-container'>
                <h1 className='Inter-Medium overview-heading'>Overview</h1>
                <div className='chart-section'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
                {Object.keys(this.state.pieSectionDataEnabled).length > 0 ?
                    <div className='welcome-card-section'>
                        <h1>Hey</h1>
                    </div> : null}
            </div>
        )

    }
}

export default PieChart;