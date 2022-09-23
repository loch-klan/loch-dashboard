
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, getElementsAtEvent, getDatasetAtEvent, Chart } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart() {
  const data = {
    labels: ['lightgreen', 'red', 'Yellow', 'Grey', 'pink', 'lightblue'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132,0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'lightgreen',
          'red',
          'yellow',
          'grey',
          'pink',
          'lightblue',
        ],
        cutout: "80%",
        borderWidth: 2,
        hoverOffset: 50,
        // hoverBorderWidth: 5,

      },
    ],
  };
  const chartRef = React.useRef();

  const textCenterPlugin = {
    id: "textCenterPlugin",
    afterDraw: function (chart, args, options) {
      const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;
      ctx.save()
      ctx.fillStyle = options.fontColor;
      const ycenter = top + (height / 2);

      ctx.font = "60px Arial"
      // console.log(ctx.font)

      ctx.textAlign = "center"
      ctx.fillText(options.text, (width / 2 )+ left, ycenter)
      ctx.restore()
    }
  }
  const hoverslice = {
    id: "hoverslice",
    afterEvent(chart, args, options) {
      const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;
      ctx.save()
      // console.log(ctx)
      if (args.event.type === "mouseout" && chart._active.length > 0) {
        chart.options.showAllTooltip = true
        chart.tooltip.options.enabled = false
        setvalue("")
      }
      else if (args.event.type === "mousemove" && chart._active.length > 0) {
        chart.options.showAllTooltip = false
        chart.tooltip.options.enabled = true
      }
      if (chart._active.length > 0) {
        const index = chart._active[0].index
        const text = chart.config._config.data.labels[index]

        const bordercolor = chart.config._config.data.datasets[0].borderColor
        const Colorarr = chart.config._config.data.datasets[0].backgroundColor
        const Colors = Colorarr.map((e, i) => {
          // console.log(e,i)
          return i != index ? e : bordercolor[index]
        })
        chart.config.data.datasets[0].hoverBackgroundColor = Colors;
        setvalue(text)
      }
      else{
        setvalue("")
      }
    }
  }
  const showToolTip = {
    id: "showToolTip",
    afterDraw: (chart, args, options) => {
      const { ctx } = chart
      ctx.save();
      if (chart.options.showAllTooltip) {
        chart.data.datasets.forEach((dataset, i) => {
          chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
            if (index < 4) {
              // console.log(datapoint)
              const { x, y } = datapoint.tooltipPosition()
              // console.log(x, y)
              const text = chart.data.labels[index] + ":" + chart.data.datasets[i].data[index];
              const textWidth = ctx.measureText(text).width;

              ctx.fillStyle = 'rgba(0,0,0,0.8)';
              ctx.fillRect(x - ((textWidth + 10) / 2), y - 25, textWidth + 10, 20)  // x,y,w,h
              // ctx.restore();

              // triangle
              ctx.beginPath();
              ctx.moveTo(x, y)
              ctx.lineTo(x - 5, y - 5)
              ctx.lineTo(x + 5, y - 5)

              ctx.fill();
              ctx.restore()
              // text
              ctx.font = "15px Arial";
              ctx.fillStyle = "white";
              ctx.fillText(text, x - (textWidth / 2), y - 10);
              ctx.restore()
            }
          })
        })
      }
    }
  }

  const [show, setshow] = React.useState(false)
  const [value, setvalue] = React.useState("")


  ChartJS.register({ textCenterPlugin, showToolTip, hoverslice });
  const options = {
    responsive: true,
    aspectRatio: 1,
    maintainAspectRatio: false,
    text: "44",
    plugins: {
      legend: {
        display: false
      },
      textCenterPlugin: {
        fontColor: "black",
        text: "44",
        fontColor: "black",
        fontSize: "60px",
        fontFamily: "sans-serif"
      },
      showToolTip,
      hoverslice,

      tooltip: {
        enabled: false,
      },
    },
    layout: {
      padding: 30
    },
    showAllTooltip: true,
  }

  return (
    <>
      <div style={{ width: "500px", height: "500px" }}>
        <Doughnut data={data} options={options} ref={chartRef} />

      </div>
      {value && <div>{value}</div>}
    </>
  );
}

