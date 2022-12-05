export const getProfitAndLossData = (arr) => {
    console.log(arr.inflows,"helo")

    const labels = ["Inflows", "Outflows","profit/Loss"];
    const data = {
        labels,
        datasets: [
            {
                data: [arr.inflows, arr.outflows ,Math.max(arr.inflows,arr.outflows)],
                backgroundColor: [
                    "rgba(100, 190, 205, 0.3)",
                    "rgba(34, 151, 219, 0.3)",
                    "rgba(114, 87, 211, 0.3)",
                ],
                borderColor: [
                    "#64BECD",
                    "#2297DB",
                    "#7257D3",
                ],
                borderWidth: 2,
                borderRadius: {
                    topLeft: 6,
                    topRight: 6
                },
                borderSkipped: false,
                barThickness:48,

            }
        ]
    }
    // const data = {
    //     labels,
    //     datasets: [
    //       {
    //         data: arr.map((e) => e),
    //         backgroundColor: arr.map((e) => e.chain.color + "4D"),
    //         borderColor: arr.map((e) => e.chain.color),
    //         defaultAssetCode: arr.map((e) => e.chain.default_asset_code),
    //         borderWidth: 2,
    //         borderRadius: {
    //           topLeft: 6,
    //           topRight: 6,
    //         },
    //         borderSkipped: false,
    //         barThickness: 48,
    //         totalFeesAmount: arr.map((e) => e.total_fees_amount),
    //         totalAmount: arr.map((e) => e.total_amount),
    //         totalVolume: arr.map((e) => e.total_volume),
    //       },
    //     ],
    //   };
    return data
}