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
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
        <div className="mb-3 flex justify-between">
          <div className="flex items-center justify-center">
            <h5 className="pe-1 text-xl font-bold leading-none text-gray-900 dark:text-white">
              Website traffic
            </h5>
            <svg
              data-popover-target="chart-info"
              data-popover-placement="bottom"
              className="ms-1 h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
            </svg>
            <div
              data-popover
              id="chart-info"
              role="tooltip"
              className="invisible absolute z-10 inline-block w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <div className="space-y-2 p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Activity growth - Incremental
                </h3>
                <p>
                  Report helps navigate cumulative growth of community
                  activities. Ideally, the chart should have a growing trend, as
                  stagnating chart signifies a significant decrease of community
                  activity.
                </p>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Calculation
                </h3>
                <p>
                  For each date bucket, the all-time volume of activities is
                  calculated. This means that activities in period n contain all
                  activities up to period n, plus the activities generated by
                  your community in period.
                </p>
                <a
                  href="#"
                  className="flex items-center font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-600"
                >
                  Read more{' '}
                  <svg
                    className="ms-1.5 h-2 w-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </a>
              </div>
              <div data-popper-arrow></div>
            </div>
          </div>
          <div>
            <button
              type="button"
              data-tooltip-target="data-tooltip"
              data-tooltip-placement="bottom"
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 sm:inline-flex"
            >
              <svg
                className="h-3.5 w-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                />
              </svg>
              <span className="sr-only">Download data</span>
            </button>
            <div
              id="data-tooltip"
              role="tooltip"
              className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
            >
              Download CSV
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>

        <div className="py-6" id="donut-chart">
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            height={200}
          />
        </div>

        <div className="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between pt-5">
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="lastDaysdropdown"
              data-dropdown-placement="bottom"
              className="inline-flex items-center text-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              type="button"
            >
              Last 7 days
              <svg
                className="m-2.5 ms-1.5 w-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="lastDaysdropdown"
              className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Yesterday
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Today
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 7 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 30 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 90 days
                  </a>
                </li>
              </ul>
            </div>
            <a
              href="#"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold uppercase text-blue-600  hover:bg-gray-100 hover:text-blue-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-blue-500 dark:focus:ring-gray-700"
            >
              Traffic analysis
              <svg
                className="ms-1.5 h-2.5 w-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketBackLogGraph;