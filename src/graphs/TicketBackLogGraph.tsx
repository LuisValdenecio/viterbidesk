'use client';

import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface MyComponentProps {}

const TicketBackLogGraph: React.FC<MyComponentProps> = () => {
  const chartOptions = {
    // add data series via arrays, learn more here: https://apexcharts.com/docs/series/
    series: [
      {
        name: 'Developer Edition',
        data: [1500, 1418, 1456, 1526, 1356, 1256],
        color: '#1A56DB',
      },
      {
        name: 'Designer Edition',
        data: [643, 413, 765, 412, 1423, 1731],
        color: '#7E3BF2',
      },
    ],
    chart: {
      height: '100%',
      maxWidth: '100%',
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 1,
        shade: '#1C64F2',
        gradientToColors: ['#1C64F2'],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0,
      },
    },
    xaxis: {
      categories: [
        '01 February',
        '02 February',
        '03 February',
        '04 February',
        '05 February',
        '06 February',
        '07 February',
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value: any) {
          return '$' + value;
        },
      },
    },
  };

  return (
    <>
      <div className="  bg-white shadow dark:bg-zinc-900 md:p-6">
        <div className=" flex justify-between">
          <div className="flex items-center justify-center">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Website traffic
            </h5>
          </div>
        </div>

        <div>
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            height={200}
          />
        </div>
      </div>
    </>
  );
};

export default TicketBackLogGraph;
