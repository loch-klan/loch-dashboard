import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CustomLoader from "../common/CustomLoader";
import { lightenDarkenColor, numToCurrency } from '../../utils/ReusableFunctions';
import unrecognized from '../../image/unrecognized.svg';
import { DEFAULT_COLOR, DEFAULT_PRICE } from '../../utils/Constant';
import { Image} from 'react-bootstrap';
import noDataImage from '../../image/no-data.png';
import Loading from '../common/Loading';
import { PiechartChainName } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';

class PieChart extends BaseReactComponent {

    constructor(props) {
        super(props);
        this.state = {
            pieSectionDataEnabled: {},
            selectedSection: {},
            assetTotal: props.assetTotal,
            loader: props.loader,
            walletTotal:props.walletTotal ,
            chartData: [],
            assetData: [],
            chartOptions: [],
            valueChanged: false,
            flag: false,
            isLoading:props.isLoading,
            piechartisLoading:true
        }

    }

    componentDidMount() {
        if (this.props.userWalletData && this.props.userWalletData.length > 0) {
            let assetData = []
            if (this.props.userWalletData && this.props.userWalletData.length > 0 && this.props.assetTotal > 0) {
                for (let i = 0; i < this.props.userWalletData.length; i++) {
                    let z = ((parseFloat(this.props.userWalletData[i].assetValue) / parseFloat(this.props.assetTotal)) * 100.0);
                    assetData.push({
                      assetType: this.props.userWalletData[i].assetType,
                      assetId: this.props.userWalletData[i].assetId,
                        name: this.props.userWalletData[i].assetName,
                        y: z,
                        usd: numToCurrency(this.props.userWalletData[i].assetValue),
                        assetValue: parseFloat(this.props.userWalletData[i].assetValue),
                        // borderColor: borderColors[i % 5],
                        borderColor: this.props.userWalletData[i].color ? this.props.userWalletData[i].color : DEFAULT_COLOR,
                        borderWidth: 2,
                        color: this.props.userWalletData[i].color ? lightenDarkenColor(this.props.userWalletData[i].color.slice(1), 0.2) : DEFAULT_COLOR,
                        originalColor: this.props.userWalletData[i].color ? lightenDarkenColor(this.props.userWalletData[i].color.slice(1), 0.2) : DEFAULT_COLOR,
                        // color: colors[i % 5],
                        // originalColor: colors[i % 5],
                        assetSymbol: this.props.userWalletData[i].assetSymbol,
                        assetCode: this.props.userWalletData[i].assetCode.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                        count: this.props.userWalletData[i].totalCount
                    })
                }
            }
            this.setState({
                chartData: this.props.userWalletData,
                assetData: assetData && assetData.length > 0 ? assetData.sort((a, b) => b.assetValue - a.assetValue) : [],
                chartOptions: {},
                pieSectionDataEnabled: {},
            })
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.assetTotal !== prevProps.assetTotal) {
            this.setState({ assetTotal: this.props.assetTotal })
        }
        if (this.props.userWalletData !== prevProps.userWalletData) {
            this.setState({ piechartisLoading: true })
            let assetData = [];
            if (this.props.userWalletData && this.props.userWalletData.length > 0 && this.props.assetTotal > 0) {
                for (let i = 0; i < this.props.userWalletData.length; i++) {
                    let z = ((parseFloat(this.props.userWalletData[i].assetValue) / parseFloat(this.props.assetTotal)) * 100.0);
                    assetData.push({
                      assetType: this.props.userWalletData[i].assetType,
                      assetId: this.props.userWalletData[i].assetId,
                        name: this.props.userWalletData[i].assetName,
                        y: z,
                        usd: numToCurrency(this.props.userWalletData[i].assetValue),
                        assetValue: parseFloat(this.props.userWalletData[i].assetValue),
                        // borderColor: borderColors[i % 5],
                        borderColor: this.props.userWalletData[i].color ? this.props.userWalletData[i].color : DEFAULT_COLOR,
                        borderWidth: 2,
                        color: this.props.userWalletData[i].color ? lightenDarkenColor(this.props.userWalletData[i].color.slice(1), 0.2) : DEFAULT_COLOR,
                        originalColor: this.props.userWalletData[i].color ? lightenDarkenColor(this.props.userWalletData[i].color.slice(1), 0.2) : DEFAULT_COLOR,
                        // color: colors[i % 5],
                        // originalColor: colors[i % 5],
                        assetSymbol: this.props.userWalletData[i].assetSymbol,
                        assetCode: this.props.userWalletData[i].assetCode.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                        count: this.props.userWalletData[i].totalCount
                    })
                }
            }
            this.setState({
                chartData: this.props.userWalletData,
                piechartisLoading : this.props.isLoading === false ? false : true,
                assetData: assetData && assetData.length > 0 ? assetData.sort((a, b) => b.assetValue - a.assetValue) : [],
                chartOptions: {},
                pieSectionDataEnabled: {},
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
                height: 335,
                width: 735,
                events: {
                    render: function () {
                        var series = this.series[0],
                            seriesCenter = series.center,
                            x = seriesCenter[0] + this.plotLeft,
                            y = seriesCenter[1] + this.plotTop,
                            text = `<div class="pie-chart-middle-text-container"><div class="pie-chart-middle-text"><h1 class="space-grotesk-medium f-s-32 lh-38 black-1D2">$${numToCurrency(self.state.assetTotal)}  </h1><p class="inter-display-semi-bold f-s-10 lh-12 grey-7C7 pie-chart-middle-text-currency">USD</p></div><span class="inter-display-medium f-s-13 lh-16 grey-7C7">Total Assets</span></div>`,
                            fontMetrics = this.renderer.fontMetrics(16);
                        series.data.map((e, i) => {
                            e.dataLabel.css({
                                opacity: 0,
                            })
                                .add();
                        })
                        if (!this.customTitle) {
                            this.customTitle = this.renderer.text(
                                text,
                                null,
                                null,
                                true
                            )
                                .css({
                                    transform: 'translate(-50%)',
                                    top: "150px"
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
                                    top: "150px"
                                })
                                .add()
                        }
                        this.customTitle.attr({
                            x,
                            y: y - (fontMetrics.f + 5)
                        });
                    }
                }
            },
            accessibility: {
              enabled: false,
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
            },
            plotOptions: {
                pie: {
                    size: 1000,
                    cursor: 'pointer',
                    connectorPadding: 2,
                    shadow: false,
                    allowPointSelect: true,
                    dataLabels: {
                        distance: 0,
                        connectorWidth: 0,
                        tickWidth: 0,
                        padding: 12,
                        allowOverlap: false,
                        formatter: function () {
                            return (
                                `<span class="f-s-16" style="color:${this.point.borderColor};">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">${this.point.assetCode}&nbsp;</p> <p class="inter-display-regular f-s-16" style="fill:#B0B1B3">$${(this.point.usd)} USD&nbsp;</p><p class="inter-display-medium f-s-16" style="fill:#B0B1B3"> ${this.point.y.toFixed(2)}% &nbsp;&nbsp;</p>`
                            )
                        },
                        // x: 10,
                        // y: -5,
                        backgroundColor: '#FFFFFF',
                        enabled: true,
                        crop: false,
                        color: '#636467',
                        borderRadius: 8,
                        verticalAlign: 'top',
                        style: {
                            textShadow: false,
                            textOverflow: 'clip',
                            whiteSpace: 'nowrap',
                            width: 'max-content',
                        },
                    },
                },
                series: {
                    animation: false, // for faster loading
                    allowPointSelect: true,
                    point: {
                        events: {
                            select: function () {
                                var currentData = this;
                                this.update({ color: this.options.borderColor });
                                self.setState({
                                  selectedSection: self.props.userWalletData.filter((data)=>{if(data.assetId === currentData.assetId) return data}),
                                  pieSectionDataEnabled: Object.keys(self.state.pieSectionDataEnabled).length > 0 ? currentData.colorIndex === self.state.pieSectionDataEnabled.colorIndex ? {} : currentData : currentData
                                });
                                if(document.getElementById("fixbtn")){
                                  {document.getElementById("fixbtn").style.display = "none"}
                                }
                                PiechartChainName({session_id: getCurrentUser().id, email_address: getCurrentUser().email, asset_clicked: [{asset_name: currentData.options.name, usd: "$"+currentData.options.usd}]});
                            },
                            unselect: function () {
                                // console.log("UNSELECT")
                                var currentData = this;
                                this.update({ color: this.options.originalColor });
                                if(currentData.assetCode === self.state.pieSectionDataEnabled.assetCode){
                                  self.setState({pieSectionDataEnabled :{}, selectedSection: {}})
                                  if(document.getElementById("fixbtn")){
                                    {document.getElementById("fixbtn").style.display = "flex"}
                                  }

                                }
                            },
                            mouseOver: function () {
                                var currentData = this;
                                this.graphic.attr({
                                    fill: this.options.borderColor,
                                    opacity: 1
                                });
                                this.series.data.map((data, i) => {
                                    if (currentData.assetCode !== data.assetCode) {
                                        data.dataLabel.css({
                                            opacity: 0
                                        })
                                            .add();
                                    } else {
                                        data.dataLabel.css({
                                            opacity: 1
                                        })
                                            .add();
                                    }
                                })
                            }
                        }
                    },
                    events: {
                        mouseOut: function () {
                            this.points.map((data, i) => {
                                if (Object.keys(self.state.pieSectionDataEnabled).length > 0) {
                                    if (self.state.pieSectionDataEnabled.colorIndex != data.colorIndex) {
                                        data.dataLabels[0].css({
                                            opacity: 0
                                        })
                                            .add();
                                    }
                                } else {
                                    data.dataLabels[0].css({
                                        opacity: 0
                                    })
                                        .add();
                                }
                            });
                        }
                    }
                },
            },
            series: [{
                name: 'Registrations',
                innerSize: '75%',
                colorByPoint: true,
                size: "100%",
                states: {
                    hover: {
                        halo: {
                            size: 0
                        }
                    }
                },
                data: self.state.assetData && self.state.assetData.length > 0 ? self.state.assetData : []
            }]
        }
        let chainList = this.state.selectedSection[0] && this.state.selectedSection[0].chain;
        chainList = chainList && chainList.sort((a,b)=> { return parseFloat(b.assetCount) - parseFloat(a.assetCount)})
        let totalCount = 0;
        chainList && chainList.slice(2).map((data)=>{
          totalCount+=data.assetCount
        })
        const {pieSectionDataEnabled} = this.state;
        console.log('pieSectionDataEnabled',pieSectionDataEnabled);
        return (
            <div className={`portfolio-over-container ${Object.keys(pieSectionDataEnabled).length > 0 ? "m-b-32" : "m-b-10"}`} >
            {/* // <div className={`portfolio-over-container m-b-32`} > */}
                <h1 className='inter-display-medium f-s-25 lh-30 overview-heading'>Overview</h1>
                {
                // this.props.isLoading === true
                // ?
                // <Loading/>
                // :
                Object.keys(this.state.assetData).length > 0
                ?
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

                        {
                          pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ?
                            <div className='coin-hover-display' >
                                <div className='coin-hover-display-text'>
                                    <div className='coin-hover-display-text-icon'>
                                        <Image className='coin-hover-display-icon' src={pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? pieSectionDataEnabled.assetSymbol || unrecognized : null} />
                                    </div>
                                    {
                                    pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 &&
                                      <div className='coin-hover-display-text1'>
                                        <div className='coin-hover-display-text1-upper'>
                                            <span className='inter-display-medium f-s-18 l-h-21 black-000 coin-hover-display-text1-upper-coin'>{pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? pieSectionDataEnabled.name : null}</span>
                                            <span className='inter-display-medium f-s-18 l-h-21 yellow-F4A coin-hover-display-text1-upper-percent'
                                            style={{color: (pieSectionDataEnabled.borderColor == "#ffffff") ? "#19191A" : pieSectionDataEnabled.borderColor}}
                                            >{pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? (pieSectionDataEnabled.y)?.toFixed(2) : 0}%</span>
                                            <span className='inter-display-medium f-s-15 l-h-19 black-191 m-l-10'>{pieSectionDataEnabled.assetType === 20 && "Staked"}</span>
                                        </div>
                                        <div className='coin-hover-display-text1-lower'>
                                            <span className='inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text1-lower-coincount'>{pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? numToCurrency(pieSectionDataEnabled.count) : null}</span>
                                            <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincode'>{pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? pieSectionDataEnabled.assetCode : null}</span>
                                            <span className='inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text1-lower-coinrevenue'>${pieSectionDataEnabled && Object.keys(pieSectionDataEnabled).length > 0 ? pieSectionDataEnabled.usd : null}</span>
                                            <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincurrency'>USD</span>
                                        </div>
                                    </div>}
                                </div>
                                {
                                  chainList && chainList.slice(0,3).map((data, index)=>{
                                     let isQuote = this.props.portfolioState.coinRateList[
                                         this.state.selectedSection[0].assetId
                                       ].quote;
                                    if(index<2){
                                      return (
                                        <>
                                        <div className='coin-hover-display-text2'>
                                      <div className='coin-hover-display-text2-upper'>
                                      <CustomOverlay
                                        position="top"
                                        className={"coin-hover-tooltip"}
                                        isIcon={false}
                                        isInfo={true}
                                        isText={true}
                                        text={data.address}
                                        >
                                          <span className='inter-display-regular f-s-15 l-h-19 grey-969 coin-hover-display-text2-upper-coin'>{data.address}</span>
                                        </CustomOverlay>
                                          <span className='inter-display-medium f-s-15 l-h-19 grey-ADA coin-hover-display-text2-upper-percent'>{((100 * data.assetCount) / pieSectionDataEnabled.count).toFixed(2) + "%"}</span>
                                      </div>
                                      <div className='coin-hover-display-text2-lower'>
                                          <span className='inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coincount'>{numToCurrency(data.assetCount)}</span>

                                          <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincode'>{pieSectionDataEnabled.assetCode}</span>

                                              <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coinrevenue">
                                                {isQuote == null
                                                  ? DEFAULT_PRICE
                                                  : numToCurrency(
                                                      data.assetCount *
                                                        isQuote?.USD.price
                                                    )}
                                              </span>

                                              <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincurrency">
                                                USD
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      );
                                    } else{
                                      return(
                                        <>
                                        <div className='coin-hover-display-text2'>
                                      <div className='coin-hover-display-text2-upper'>
                                      <CustomOverlay
                                        position="top"
                                        className={"coin-hover-tooltip"}
                                        isIcon={false}
                                        isInfo={true}
                                        isText={true}
                                        text={data.address}
                                        >
                                          <span className='inter-display-regular f-s-15 l-h-19 grey-969 coin-hover-display-text2-upper-coin'>Other</span>
                                        </CustomOverlay>
                                          <span className='inter-display-medium f-s-15 l-h-19 grey-ADA coin-hover-display-text2-upper-percent'>{((100 * totalCount) / pieSectionDataEnabled.count).toFixed(2) + "%"}</span>
                                      </div>
                                      <div className='coin-hover-display-text2-lower'>
                                          <span className='inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coincount'>{numToCurrency(totalCount)}</span>

                                          <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincode'>{pieSectionDataEnabled.assetCode}</span>

                                          <span className='inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coinrevenue'>{numToCurrency(totalCount * this.props.portfolioState.coinRateList[this.state.selectedSection[0].assetId].quote?.USD.price) || DEFAULT_PRICE}</span>
                                          <span className='inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincurrency'>USD</span>
                                      </div>
                                  </div>
                                        </>
                                      )
                                    }
                                  })
                                }
                            </div>
                            :
                            null
                          }
                    </>
                    :
                     this.state.piechartisLoading === true
                        ?
                        <Loading/>
                        :
                        this.props.walletTotal === 0 || this.state.assetData.length === 0
                        ?
                        <h3 className='inter-display-medium f-s-25 lh-30 m-b-8'>No data found</h3>
                        :
                        null
                }
                </div>


        )

    }
}

const mapStateToProps = state => ({
  portfolioState: state.PortfolioState,
});
export default connect(mapStateToProps)(PieChart);