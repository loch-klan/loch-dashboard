import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BitcoinIcon from "../../assets/images/icons/bitcoin-icon.svg";


class PieChart extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            pieSectionDataEnabled: {},
            assetTotal: props.assetTotal,
            loader: props.loader,
            chartData: [],
            assetData: []
        }

    }


    componentDidUpdate(prevProps) {
        if (this.props.assetTotal !== prevProps.assetTotal) {
            this.setState({ assetTotal: this.props.assetTotal })
        }
        if (this.props.userWalletData !== prevProps.userWalletData) {
            this.setState({ chartData: this.props.userWalletData })
        }
    }



    render() {
        let self = this;
        let colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', '#a07ddd', '#e7c5a0']
        let borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', '#7B44DA', '#F19938']

        if (self.state.chartData && self.state.chartData.length > 0) {
            self.state.assetData = []
            for (let i = 0; i < self.state.chartData.length; i++) {
                self.state.assetData.push({
                    name: self.state.chartData[i].assetName,
                    // y: 20,
                    y: parseFloat(parseFloat(self.state.chartData[i].assetValue) / parseFloat(self.state.assetTotal)) * 100,
                    usd: self.state.chartData[i].assetValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    borderColor: borderColors[i % 5],
                    borderWidth: 2,
                    color: colors[i % 5],
                    originalColor: colors[i % 5]
                })
            }
        }
        // console.log(this.state.assetData)
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
                            text = `<div class="pie-chart-middle-text-container"><div class="pie-chart-middle-text"><h1 class="space-grotesk-medium f-s-39 lh-20 black-1D2"> ${self.state.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}  </h1><p class="inter-display-semi-bold f-s-10 lh-12 grey-7C7 pie-chart-middle-text-currency">USD</p></div><span class="inter-display-medium f-s-13 lh-40 grey-7C7">Total Assets</span></div>`,
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
                                .add()
                        } else {
                            this.customTitle.destroy();
                            this.customTitle = this.renderer.text(
                                text,
                                null,
                                null,
                                true
                            )
                                .css({
                                    transform: 'translate(-50%)',
                                })
                                .add()
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
                shared: true,
                // pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
                formatter: function () {
                }

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
                                //chart.reflow();
                            },

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
                point: {
                    events: {
                        mouseOver: function () {
                            let color = this.options.borderColor;
                            this.update({ color: color });
                            var currentData = this;
                            //self.setState({ pieSectionDataEnabled: currentData });
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
                            //self.setState({ pieSectionDataEnabled: {} })
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
                    }

                },
                data: this.state.assetData
                // data: [{
                //     name: 'Bitcoin',
                //     y: 68.1,
                //     usd: "222,798",
                //     borderColor: 'rgba(255, 99, 132, 1)',
                //     borderWidth: 2,
                //     color: 'rgba(255, 99, 132, 0.2)',
                //     originalColor: 'rgba(255, 99, 132, 0.2)'
                // }, {
                //     name: 'Ethereum',
                //     y: 11.0,
                //     usd: "55,143",
                //     borderColor: 'rgba(54, 162, 235, 1)',
                //     borderWidth: 2,
                //     color: 'rgba(54, 162, 235, 0.2)',
                //     originalColor: 'rgba(54, 162, 235, 0.2)'

                // }, {
                //     name: 'Solana',
                //     y: 11.2,
                //     usd: "19,925",
                //     borderColor: 'rgba(255, 206, 86, 1)',
                //     borderWidth: 2,
                //     color: 'rgba(255, 206, 86, 0.2)',
                //     originalColor: 'rgba(255, 206, 86, 0.2)'
                // },
                // {
                //     name: 'Avalanche',
                //     y: 4.7,
                //     usd: "6,303",
                //     borderColor: 'rgba(75, 192, 192, 1)',
                //     borderWidth: 2,
                //     color: 'rgba(75, 192, 192, 0.2)',
                //     originalColor: 'rgba(75, 192, 192, 0.2)'
                // },
                // {
                //     name: 'LiteCoin',
                //     y: 2.5,
                //     usd: "6,303",
                //     borderColor: '#7B44DA',
                //     borderWidth: 2,
                //     color: '#a07ddd',
                //     originalColor: '#a07ddd'
                // },
                // {
                //     name: 'Ripple',
                //     y: 2.5,
                //     usd: "19,925",
                //     borderColor: '#F19938',
                //     borderWidth: 2,
                //     color: '#e7c5a0',
                //     originalColor: '#e7c5a0'
                // }
                // ]
            }]
        };
        return (
            <div className='portfolio-over-container'>
                <h1 className='Inter-Medium overview-heading'>Overview</h1>
                <div className='chart-section'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        updateArgs={[true]}
                        oneToOne={true}
                    />
                </div>
                {Object.keys(this.state.pieSectionDataEnabled).length > 0 ?
                    <div className='coin-hover-display'>
                        <img className='coin-hover-display-icon' src={BitcoinIcon} />
                        <div className='coin-hover-display-text1'>
                            <div className='coin-hover-display-text1-upper'>
                                <span className='inter-display-medium f-s-20 l-h-24 black-000 coin-hover-display-text1-upper-coin'>Bitcoin</span>
                                <span className='inter-display-medium f-s-20 l-h-24 yellow-F4A coin-hover-display-text1-upper-percent'>70.27%</span>
                            </div>
                            <div className='coin-hover-display-text1-lower'>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text1-upper-coincount'>9.431</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-upper-coincode'>BTC</span>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text1-upper-coinrevenue'>$222,798</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-upper-coincurrency'>USD</span>
                            </div>
                        </div>
                        <div className='coin-hover-display-text2'>
                            <div className='coin-hover-display-text2-upper'>
                                <span className='inter-display-regular f-s-16 l-h-19 grey-969 coin-hover-display-text2-upper-coin'>Metamask</span>
                                <span className='inter-display-medium f-s-16 l-h-19 grey-ADA coin-hover-display-text2-upper-percent'>50%</span>
                            </div>
                            <div className='coin-hover-display-text2-lower'>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text2-upper-coincount'>3.1</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincode'>BTC</span>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text2-upper-coinrevenue'>21310</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincurrency'>USD</span>
                            </div>
                        </div>
                        <div className='coin-hover-display-text3'>
                            <div className='coin-hover-display-text3-upper'>
                                <span className='inter-display-regular f-s-16 l-h-19 grey-969 coin-hover-display-text3-upper-coin'>Coinbase</span>
                                <span className='inter-display-medium f-s-16 l-h-19 grey-ADA coin-hover-display-text3-upper-percent'>30%</span>
                            </div>
                            <div className='coin-hover-display-text3-lower'>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text3-upper-coincount'>1.3</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text3-upper-coincode'>BTC</span>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text3-upper-coinrevenue'>12,211</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text3-upper-coincurrency'>USD</span>
                            </div>
                        </div>
                        <div className='coin-hover-display-text4'>
                            <div className='coin-hover-display-text4-upper'>
                                <span className='inter-display-regular f-s-16 l-h-19 grey-969 coin-hover-display-text4-upper-coin'>Binance</span>
                                <span className='inter-display-medium f-s-16 l-h-19 grey-ADA coin-hover-display-text4-upper-percent'>20%</span>
                            </div>
                            <div className='coin-hover-display-text4-lower'>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text4-upper-coincount'>0.01</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text4-upper-coincode'>BTC</span>
                                <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text4-upper-coinrevenue'>3120</span>
                                <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text4-upper-coincurrency'>USD</span>
                            </div>
                        </div>

                    </div> : null}
            </div>
        )

    }
}

export default PieChart;