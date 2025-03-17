import React from "react";
import { Chart, ChartConfiguration } from "chart.js";

export default function ChartData() {
  React.useEffect(() => {
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: new Date().getFullYear().toString(),
            backgroundColor: "#9B51E0",
            borderColor: "#9B51E0",
            data: [0, 0, 20, 0, 10, 0, 0, 30, 0, 0, 35, 0],
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          fontColor: "#333333",
        },
        legend: {
          labels: {
            fontColor: "#333333",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
          titleFontColor: "#333333",
          bodyFontColor: "#333333",
          backgroundColor: "#f0f0f0",
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              ticks: {
                fontColor: "#333333",
                stepSize: 25,
                beginAtZero: true,
              },
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                fontColor: "#333333",
                beginAtZero: true,
              },
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          ],
        },
      },
    };

    const canvas = document.getElementById(
      "line-chart",
    ) as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        (window as any).myLine = new Chart(ctx, config);
      }
    }
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-sm rounded bg-white h-[100%]">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-gray-800 mb-1 text-xs font-semibold">
              Overview
            </h6>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-[100%]">
          <canvas id="line-chart"></canvas>
        </div>
      </div>
    </div>
  );
}
