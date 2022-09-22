import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BitcoinIcon from "../../assets/images/icons/bitcoin-icon.svg";
import CustomLoader from "../common/CustomLoader";
import { numToCurrency } from '../../utils/ReusableFunctions';
import unrecognised from '../../image/unrecognised.png';


class PieChart extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            pieSectionDataEnabled: {},
            assetTotal: props.assetTotal,
            loader: props.loader,
            chartData: [],
            assetData: [],
            chartOptions: [],
            valueChanged: false,
            flag: false
        }

    }

    componentDidMount() {
        if (this.props.userWalletData && this.props.userWalletData.length > 0) {
            let colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', '#a07ddd', '#e7c5a0']
            let borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', '#7B44DA', '#F19938']
            let assetData = []
            if (this.props.userWalletData && this.props.userWalletData.length > 0 && this.props.assetTotal > 0) {
                for (let i = 0; i < this.props.userWalletData.length; i++) {
                    // let z = parseFloat(parseFloat((parseFloat(this.props.userWalletData[i].assetValue) / parseFloat(this.props.assetTotal)) * 100).toFixed(2));
                    let z = ((parseFloat(this.props.userWalletData[i].assetValue) / parseFloat(this.props.assetTotal)) * 100.0);
                    // console.log('z',typeof(z));
                    assetData.push({
                        name: this.props.userWalletData[i].assetName,
                        y: z,
                        usd: numToCurrency(this.props.userWalletData[i].assetValue),
                        assetValue: parseFloat(this.props.userWalletData[i].assetValue),
                        borderColor: borderColors[i % 5],
                        borderWidth: 2,
                        color: colors[i % 5],
                        originalColor: colors[i % 5],
                        assetSymbol: this.props.userWalletData[i].assetSymbol,
                        assetCode: this.props.userWalletData[i].assetCode.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                        count: this.props.userWalletData[i].totalCount
                    })
                }
            }
            this.setState({
                chartData: this.props.userWalletData,
                assetData: assetData && assetData.length > 0 ? assetData.sort((a, b) => b.assetValue - a.assetValue) : [],
                chartOptions: {}
            })
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.assetTotal !== prevProps.assetTotal) {
            this.setState({ assetTotal: this.props.assetTotal })
        }
        if (this.props.userWalletData !== prevProps.userWalletData) {
            let colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', '#a07ddd', '#e7c5a0']
            let borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', '#7B44DA', '#F19938']
            let assetData = [];
            if (this.props.userWalletData && this.props.userWalletData.length > 0 && this.props.assetTotal > 0) {
                for (let i = 0; i < this.props.userWalletData.length; i++) {
                    let z = ((parseFloat(this.props.userWalletData[i].assetValue) / parseFloat(this.props.assetTotal)) * 100.0);
                    assetData.push({
                        name: this.props.userWalletData[i].assetName,
                        y: z,
                        usd: numToCurrency(this.props.userWalletData[i].assetValue),
                        assetValue: parseFloat(this.props.userWalletData[i].assetValue),
                        borderColor: borderColors[i % 5],
                        borderWidth: 2,
                        color: colors[i % 5],
                        originalColor: colors[i % 5],
                        assetSymbol: this.props.userWalletData[i].assetSymbol,
                        assetCode: this.props.userWalletData[i].assetCode.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                        count: this.props.userWalletData[i].totalCount
                    })
                }
            }
            this.setState({
                chartData: this.props.userWalletData,
                assetData: assetData && assetData.length > 0 ? assetData.sort((a, b) => b.assetValue - a.assetValue) : [],
                chartOptions: {}
            })
        }
    }

    setHoverData = (e) => {
        this.setState({ pieSectionDataEnabled: e })
    }


    render() {
        let self = this;
        let chartOptions = {
            chart: {
                styledMode: false,
                type: 'pie',
                backgroundColor: null,
                // height: (9 / 16 * 100) + '%',
                height: 445,
                width: 900,
                events: {
                    load: function (event) {
                        //When is chart ready?
                        // event.target.series[0].data.map((e, i) => {
                        //     if (i >= 4) {
                        //         e.dataLabels[0].css({
                        //             opacity: 0,
                        //         })
                        //             .add();
                        //     }
                        // })
                    },
                    render: function () {
                        var series = this.series[0],
                            seriesCenter = series.center,
                            x = seriesCenter[0] + this.plotLeft,
                            y = seriesCenter[1] + this.plotTop,
                            text = `<div class="pie-chart-middle-text-container"><div class="pie-chart-middle-text"><h1 class="space-grotesk-medium f-s-30 lh-20 black-1D2">$${numToCurrency(self.state.assetTotal)}  </h1><p class="inter-display-semi-bold f-s-10 lh-12 grey-7C7 pie-chart-middle-text-currency">USD</p></div><span class="inter-display-medium f-s-13 lh-40 grey-7C7">Total Assets</span></div>`,
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
            boost: {
                useGPUTranslations: true,
                usePreAllocated: true
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
                // formatter: function () {
                // }

            },
            plotOptions: {
                pie: {
                    size: 1000,
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
                    dataLabels: {
                        distance: 1,
                        connectorWidth: 0,
                        tickWidth: 0,
                        padding: 12,
                        //useHTML: true,
                        allowOverlap: false,
                        style: {
                            textShadow: false
                        },
                        formatter: function () {
                            return (
                                `<span class="f-s-16" style="color:${this.point.borderColor};">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">${this.point.assetCode}&nbsp;</p> <p class="inter-display-regular f-s-16" style="fill:#B0B1B3">$${(this.point.usd)} USD&nbsp;</p><p class="inter-display-medium f-s-16" style="fill:#B0B1B3"> ${this.point.y.toFixed(2)}% &nbsp;&nbsp;</p>`
                            )
                        },
                        x: 40,
                        y: -20,
                        backgroundColor: '#FFFFFF',
                        enabled: true,
                        crop: false,
                        color: '#636467',
                        borderRadius: 8,
                        verticalAlign: 'top',
                        style: {
                            textOverflow: 'clip',
                            whiteSpace: 'nowrap',
                            width: 'max-content',
                        },
                    },
                },
                series: {
                  animation: false, // for faster loading
                    point: {
                        events: {
                            mouseOver: function () {
                                // return function () {
                                // var currentData = this;
                                // this.graphic.attr({
                                //     fill: this.options.borderColor,
                                //     opacity: 1
                                // });
                                // this.series.data.forEach(function (data) {
                                //     if (currentData.assetCode !== data.assetCode) {
                                //         data.dataLabel.css({
                                //             opacity: 0
                                //         })
                                //             .add();
                                //     } else {
                                //         data.dataLabel.css({
                                //             opacity: 1
                                //         })
                                //             .add();
                                //     }
                                // })
                                // self.setState({ pieSectionDataEnabled: currentData })
                                // self.setHoverData(this)
                            }
                            // })(this)
                        }
                    },
                    events: {
                        mouseOut: function () {
                            //     var serie = this.points;

                            //     $.each(serie, function (i, e) {
                            //         this.graphic.attr({
                            //             fill: '#CCCCCC'
                            //         });
                            //     });
                            // this.points.forEach(function (data, i) {
                            //     if (i >= 4) {
                            //         data.dataLabels[0].css({
                            //             opacity: 0
                            //         })
                            //             .add();
                            //     } else {
                            //         data.dataLabels[0].css({
                            //             opacity: 1
                            //         })
                            //             .add();
                            //     }
                            // });
                            // self.setHoverData([])
                            // self.setState({ pieSectionDataEnabled: [] });
                        }
                    }
                },
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
                        click: function () {
                            var currentData = this;
                            self.setState({ pieSectionDataEnabled: Object.keys(self.state.pieSectionDataEnabled).length > 0 ? currentData.colorIndex === self.state.pieSectionDataEnabled.colorIndex ? {} : currentData : currentData });
                        },
                        // mouseOver: function () {
                        // let color = this.options.borderColor;
                        // this.update({ color: color });
                        // this.series.data.forEach(function (data) {
                        //     if (currentData.colorIndex !== data.colorIndex) {
                        //         data.update({ opacity: 0.2 }, true);
                        //         data.dataLabel.css({
                        //             opacity: 0
                        //         })
                        //             .add();
                        //     } else {
                        //         data.update({ opacity: 1 }, false);
                        //         data.dataLabel.css({
                        //             opacity: 1
                        //         })
                        //             .add();
                        //         if (data.colorIndex >= 4) {
                        //             data.dataLabels[0].css({
                        //                 opacity: 1
                        //             })
                        //                 .add();
                        //         }
                        //     }
                        // })
                        // var currentData = this;
                        // self.setState({ pieSectionDataEnabled: Object.keys(self.state.pieSectionDataEnabled).length > 0 ? currentData.colorIndex === self.state.pieSectionDataEnabled.colorIndex ? {} : currentData : currentData });
                        // self.setState({ pieSectionDataEnabled: currentData })
                        // },
                        // mouseOut: function () {
                        // let color = this.options.originalColor;
                        // this.update({ color: color });
                        // this.series.data.forEach(function (data) {
                        //     data.update({ opacity: 1 }, false);
                        //     if (data.colorIndex >= 4) {
                        //         data.dataLabels[0].css({
                        //             opacity: 0
                        //         })
                        //             .add();
                        //     } else {
                        //         data.dataLabels[0].css({
                        //             opacity: 1
                        //         })
                        //             .add();
                        //     }
                        // });
                        // self.setState({ pieSectionDataEnabled: [] });
                        // }
                    }

                },
                // data: this.chartDataRender()
                data: self.state.assetData && self.state.assetData.length > 0 ? self.state.assetData : []
            }]
        }
        return (
            <div className='portfolio-over-container' >
                <h1 className='Inter-Medium overview-heading'>Overview</h1>
                {Object.keys(this.state.assetData).length > 0 ?
                    <>
                        <div className='chart-section'>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={chartOptions}
                                updateArgs={[true]}
                                oneToOne={true}
                                allowChartUpdate={true}
                                containerProps={{ className: "custom-highchart" }}
                            />
                        </div>
                        {Object.keys(this.state.pieSectionDataEnabled).length > 0 ?
                            <div className='coin-hover-display'>
                                <div className='coin-hover-display-text'>
                                    <div className='coin-hover-display-text-icon'>
                                        <img className='coin-hover-display-icon' src={this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? this.state.pieSectionDataEnabled.assetSymbol || unrecognised : null} />
                                    </div>
                                    <div className='coin-hover-display-text1'>

                                        <div className='coin-hover-display-text1-upper'>
                                            <span className='inter-display-medium f-s-20 l-h-24 black-000 coin-hover-display-text1-upper-coin'>{this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? this.state.pieSectionDataEnabled.name : null}</span>
                                            <span className='inter-display-medium f-s-20 l-h-24 yellow-F4A coin-hover-display-text1-upper-percent'>{this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? (this.state.pieSectionDataEnabled.y).toFixed(2) : null}%</span>
                                        </div>
                                        <div className='coin-hover-display-text1-lower'>
                                            <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text1-lower-coincount'>{this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? numToCurrency(this.state.pieSectionDataEnabled.count) : null}</span>
                                            <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincode'>{this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? this.state.pieSectionDataEnabled.assetCode : null}</span>
                                            <span className='inter-display-medium f-s-16 l-h-19 black-191 coin-hover-display-text1-lower-coinrevenue'>${this.state.pieSectionDataEnabled && Object.keys(this.state.pieSectionDataEnabled).length > 0 ? this.state.pieSectionDataEnabled.usd : null}</span>
                                            <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincurrency'>USD</span>
                                        </div>
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
                    </> :
                    <div className='chart-section-loader'>
                        <CustomLoader chartType="pie" />
                    </div>
                }
            </div >
        )

    }
}

export default PieChart;