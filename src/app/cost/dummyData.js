
   const labels = ["AAVE" , "Binance" , "Kraken" ,"Gemini","Coinbase","Compound","Convex","Curve","FTX","Lido","MakerDao","Pancake Swap"]

    const options = {
        responsive:true,
        plugins: {
            legend: {
                display:false
            },
        },
        scales:{
            y:{
                min:0,
                max:500,
                
                ticks:{
                    stepSize:125,
                    padding:8,
                    size:12,
                    lineHeight:20,
                    family:"Helvetica Neue",
                    weight:400,
                    color: "#B0B1B3"
                },
                grid:{
                    drawBorder:false,
                    display:true,
                    borderDash: ctx=>ctx.index == 0 ? [0] : [4],
                    drawTicks:false
                }
            },
            x:{
                ticks:{
                    font:"Inter-SemiBold",
                    size:10,
                    lineHeight:12,
                    weight:600,
                    color:"#86909C"
                },
                grid:{
                    display:false,
                    borderWidth:1,
                }
            }
        }
    }

const data = {
    labels,
    datasets: [
        {
            data: [26, 323, 76, 6, 8,500, 50, 4, 40, 77, 18, 15, 2],
            backgroundColor: [
                "rgba(100, 190, 205, 0.3)",
                "rgba(34, 151, 219, 0.3)",
                "rgba(114, 87, 211, 0.3)",
                "rgba(141, 141, 141, 0.3)",
                " rgba(84, 84, 191, 0.3)",
                "rgba(178, 210, 145, 0.3)",
                "rgba(141, 141, 141, 0.3)",
                "#ffffff",
                "rgba(178, 210, 145, 0.3)",
                "rgba(178, 210, 145, 0.3)",
                "rgba(178, 210, 145, 0.3)",
                "rgba(178, 210, 145, 0.3)",
            ],
            borderColor: [
                "#64BECD",
                "#2297DB",
                "#7257D3",
                "#8D8D8D",
                "#5454BF",
                "#B2D291",
                "#8D8D8D",
                "#ffffff",
                "#B2D291",
                "#B2D291",
                "#B2D291",
                "#B2D291",
            ],
            borderWidth: 2,
            borderRadius:{
                topLeft:6,
                topRight:6
            },
            borderSkipped:false,
            
        }
    ]
}

const optionsyear5 = {
    responsive:true,
    plugins: {
        legend: {
            display:false
        },
    },
    scales:{
        y:{
            min:0,
            max:500,
            
            ticks:{
                stepSize:125,
                padding:8,
                size:12,
                lineHeight:20,
                family:"Helvetica Neue",
                weight:400,
                color: "#B0B1B3"
            },
            grid:{
                drawBorder:false,
                display:true,
                borderDash: ctx=>ctx.index == 0 ? [0] : [4],
                drawTicks:false
            }
        },
        x:{
            ticks:{
                font:"Inter-SemiBold",
                size:10,
                lineHeight:12,
                weight:600,
                color:"#86909C"
            },
            grid:{
                display:false,
                borderWidth:1,
            }
        }
    }
}

const datayear5 = {
labels,
datasets: [
    {
        data: [264, 323, 76, 60, ,5, 50, 400, 220, 7, 18, 150, 224],
        backgroundColor: [
            "rgba(100, 190, 205, 0.3)",
            "rgba(34, 151, 219, 0.3)",
            "rgba(114, 87, 211, 0.3)",
            "rgba(141, 141, 141, 0.3)",
            " rgba(84, 84, 191, 0.3)",
            "rgba(178, 210, 145, 0.3)",
            "rgba(141, 141, 141, 0.3)",
            "#ffffff",
            "rgba(178, 210, 145, 0.3)",
            "rgba(178, 210, 145, 0.3)",
            "rgba(178, 210, 145, 0.3)",
            "rgba(178, 210, 145, 0.3)",
        ],
        borderColor: [
            "#64BECD",
            "#2297DB",
            "#7257D3",
            "#8D8D8D",
            "#5454BF",
            "#B2D291",
            "#8D8D8D",
            "#ffffff",
            "#B2D291",
            "#B2D291",
            "#B2D291",
            "#B2D291",
        ],
        borderWidth: 2,
        borderRadius:{
            topLeft:6,
            topRight:6
        },
        borderSkipped:false,
        
    }
]
}

const ethlabels = ["Ethereum"]
const ethdata = {
    labels:ethlabels,
    datasets: [
    {
        data: [264],
        backgroundColor: [
            "rgba(100, 190, 205, 0.3)",
        ],
        borderColor: [
            "#64BECD",
        ],
        borderWidth: 2,
        borderRadius:{
            topLeft:6,
            topRight:6
        },
        borderSkipped:false,
        
    }
]
}
const ethoptions = { responsive:true,
    plugins: {
        legend: {
            display:false
        },
    },
    scales:{
        y:{
            min:0,
            max:500,
            
            ticks:{
                stepSize:125,
                padding:8,
                size:12,
                lineHeight:20,
                family:"Helvetica Neue",
                weight:400,
                color: "#B0B1B3"
            },
            grid:{
                drawBorder:false,
                display:true,
                borderDash: ctx=>ctx.index == 0 ? [0] : [4],
                drawTicks:false
            }
        },
        x:{
            ticks:{
                font:"Inter-SemiBold",
                size:10,
                lineHeight:12,
                weight:600,
                color:"#86909C"
            },
            grid:{
                display:false,
                borderWidth:1,
            }
        }
    }}



export const ethereum = [ethdata,ethoptions]
export const years5 = [datayear5 , optionsyear5]
export const info = [ data,options]

