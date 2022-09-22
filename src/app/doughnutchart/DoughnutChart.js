// import React from 'react'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// // import  {chartdata,options }from './chartdata.js'
// ChartJS.register(ArcElement, Tooltip, Legend);
// export const DoughnutChart = () => {


//     const [div , setdiv] = React.useState(0)

//     const handleClick = ()=>{
//         console.log("CLICK")
//         setdiv(!div)
//     }

//     const setHover = ()=>{
//         setdiv(!div)
//     }

//     const textCenterPlugin = {
//         id : "textCenterPlugin",
//         beforeDraw: function(chart , args,options) {
//             // var width = chart.chart.width,
//             //     height = chart.chart.height,
//             //     ctx = chart.chart.ctx;
//             // ctx.restore();
//             // var fontSize = (height / 114).toFixed(2);
//             // ctx.font = fontSize + "em sans-serif";
//             // ctx.textBaseline = "middle";
//             // var text = "75%",
//             //     textX = Math.round((width - ctx.measureText(text).width) / 2),
//             //     textY = height / 2;
//             // ctx.fillText(text, textX, textY);
//             // ctx.save();
//             // console.log(chart)
//             const {
//                 ctx,
//                 chartArea: { top, right, bottom, left, width, height },
//               } = chart;
//               ctx.save();
          
//               //1st How to get Position of label
//               const yCenter = top + height / 2;
          
//               //2nd How to set Styling of label
//               ctx.font = "bold 12px Helvetica Neue";
//               ctx.textAlign = "center";
//               ctx.fillStyle = options.fontColor;
//               ctx.fillText(options.text, width / 2 , yCenter);
//           }
//     }

//     // const AnimationOnHover = (e,legendItem,Legend)=>{

//     // }
//     ChartJS.register(textCenterPlugin);
//    const options = {
//         responsive : true,
//         aspectRatio:1,
//         maintainAspectRatio: false,
//         legend : {
//             label :{
//                 display : false,
//             }
//         },
//         parsing: {
//             key: 'nested.value'
//         },
//         plugins:{
//             textCenterPlugin : {
//                 text:"$27876"
//             },
//         },
//         onClick(click,element,chart){
//             console.log(chart)
//             setdiv(!div)
//         },
//         // onHover: (e, activeElements, chart) => {
//         //     if (activeElements[0]) {
//         //       let ctx = activeElements[0].element.$context;
//         //       let label = chart.data.labels[ctx.dataIndex];
//         //       let value = chart.data.datasets[0].data[ctx.dataIndex];
//         //       console.log(label + ': ' + value);
//         //       setHover(!div)
//         //     }
//         //   }
//     }
//     const chartdata =  {
//         labels: ['Bitcoin', 'Ethereum', 'Solana', 'Avalanche', 'Helium', 'Eth','Bit'],
        
//         datasets: [
//             {
//               label: '# of Votes',
//               data: [12, 19, 3, 5, 2, 3],
//               backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)',
//               ],
//               borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)',
//               ],
//               borderWidth: 1,
//               hoverOffset : 5
//             },
//           ],
//         // datasets: [
//         //   {
//         //     // label: '# of Votes',
//         //     data: [
//         //     {
//         //         id : "Bitcoin",
//         //         nested :{
//         //              value:222798.00,
//         //         }
//         //        ,
//         //     },
//         //     {
//         //         id : "Ethereum",
//         //         nested :{
//         //              value:55143,
//         //         }
//         //        ,
//         //     },
//         //     {
//         //         id : "Solana",
//         //         nested :{
//         //             value:19925
//         //         }
               
//         //     },
//         //     {
//         //         id : "Avalanche",
//         //         nested :{
//         //              value:6303,
//         //         }
               
//         //     },
//         //     {
//         //         id : "Helium",
//         //         nested :{
//         //              value:4303,
//         //         }
               
//         //     },
//         //     {
//         //         id : "Eth",
//         //         nested :{
//         //              value:4303,
//         //         }
               
//         //     },
//         //     {
//         //         id : "Bit",
//         //         nested :{
//         //              value:6303,
//         //         }
               
//         //     }
//         //     ],
//         //     backgroundColor: [
//         //       'rgba(255, 99, 132, 0.2)',
//         //       'rgba(54, 162, 235, 0.2)',
//         //       'rgba(255, 206, 86, 0.2)',
//         //       'rgba(75, 192, 192, 0.2)',
//         //       'rgba(153, 102, 255, 0.2)',
//         //       'rgba(255, 159, 64, 0.2)',
//         //       'rgba(75, 192, 192, 0.2)',
//         //     ],
//         //     borderColor: [
//         //       'rgba(255, 99, 132, 1)',
//         //       'rgba(54, 162, 235, 1)',
//         //       'rgba(255, 206, 86, 1)',
//         //       'rgba(75, 192, 192, 1)',
//         //       'rgba(153, 102, 255, 1)',
//         //       'rgba(255, 159, 64, 1)',
//         //       'rgba(75, 192, 192, 1)',
//         //     ],
//         //     borderWidth: 1,
//         //     hoverOffset : 5, // doughnut slice standout on hover
//         //   },
//         // ],
//       };

      
//   return (
//     <div>
//         <Doughnut  
//              data = {chartdata}
//             options = {options}
//         />
//         {
//             div == true ? <div> HELLO </div> : ""
//         }
//     </div>
//   )
// }

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut , getElementsAtEvent , getDatasetAtEvent } from 'react-chartjs-2';
// import { DoughnutChart } from './DoughnutChart';

ChartJS.register(ArcElement, Tooltip, Legend);




export function DoughnutChart() {


    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    const chartRef = React.useRef();
    const onClick = (event) => {
        console.log(getElementsAtEvent(chartRef.current, event));
        // console.log(getDatasetAtEvent(chartRef.current, event));
      }
    const [show,setshow] = React.useState(false)
    const [value,setvalue] = React.useState("")
    function handleHover(evt,element,chart) {
        // console.log(element)
        // let index = element[0].index
        // if(index !== undefined ){

        //     console.log(chart.data) 
        //     // console.log(element[0].index)
        //     console.log(data.datasets[0].data[index])
        //     setvalue(data.datasets[0].data[index])
        //     // setshow(!show)
        // }
        let currentIndex = -1;
        console.log(chart)
        chart.listeners.mousemove = function(e,x,y) {
            // if(x[0]) {
            //     var index = x[0]._index;
            //     if (index !== currentIndex) {
            //         currentIndex = index;
            //         console.log(x[0]._model.label + ': ' + x[0]._chart.config.data.datasets[0].data[index]);
            //     }
            // }
            console.log(e , x  ,y)
        };
      }
    function handleClick(evt,element,chart){
        // console.log(element[0].index)
        // let index = element[0].index
        // console.log(data.datasets[0].data[index])
    }
    const options = {
        responsive : true,
        aspectRatio:1,
        maintainAspectRatio: false,
        // onHover : (event)=>{
        //     console.log("HEy")
        //     // console.log(getElementsAtEvent(chartRef.current, event));
        // },
       
        onHover: (e)=>{
            console.log("HEE")
            console.log(e)
            setvalue("hello")
        },
        // onClick:handleClick
    }
    // const onClick = (event) => {
    //     console.log(event);
    //   }
    return (
        <div style={{width:"300px"}}>
        <Doughnut data={data} options={options}  ref={chartRef}/>
        {value && <div>{value}</div> }
        </div>
    );
}

// export default DoughnutChart;