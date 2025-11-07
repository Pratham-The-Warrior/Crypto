import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import "./LineChart.css";

const Linechart = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Price"]]);
  const [chartType, setChartType] = useState("AreaChart"); // default chart type
  const [range, setRange] = useState("30"); // default 30 days i have max 30days only

  const chartTypes = ["AreaChart", "LineChart", "ColumnChart"];
  const rangeOptions = [
    { label: "1 Day", value: "1" },
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
  ];

  const [vAxisRange, setVAxisRange] = useState({ min: 0, max: 0 });

  // Prepare chart data based on range
  useEffect(() => {
    if (!historicalData?.prices) return;

    const filteredPrices =
      range === "30"
        ? historicalData.prices
        : historicalData.prices.slice(-Number(range));

    const dataCopy = [["Date", "Price"]];

    filteredPrices.forEach(([timestamp, price]) => {
      const date = new Date(timestamp);
      const formattedDate =
        range === "1"
          ? date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
      dataCopy.push([formattedDate, price]);
    });

    setData(dataCopy);

    // Set Y-axis to start from minimum price with some padding
    const prices = filteredPrices.map(([_, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setVAxisRange({
      min: Math.max(minPrice * 0.95, 0),
      max: maxPrice * 1.05,
    });
  }, [historicalData, range]);

  // Determine overall trend for color
  const trendColor =
    data.length > 1 && data[data.length - 1][1] >= data[1][1]
      ? "#00c853"
      : "#d50000";

  const chartOptions = {
    backgroundColor: "transparent",
    colors: [trendColor],
    fontName: "Outfit, sans-serif",
    hAxis: { textStyle: { color: "#ccc" }, gridlines: { color: "#2a2a3d" } },
    vAxis: {
      textStyle: { color: "#ccc" },
      gridlines: { color: "#2a2a3d" },
      viewWindow: {
        min: vAxisRange.min,
        max: vAxisRange.max,
      },
    },
    legend: { position: "none" },
    chartArea: { left: "10%", top: "15%", width: "85%", height: "75%" },
    lineWidth: 2,
    pointSize: 4,
    curveType: "function",
    areaOpacity: chartType === "AreaChart" ? 0.15 : 0,
    tooltip: { textStyle: { color: "#000" }, showColorCode: true },
  };

  return (
    <div className="linechart-container">
      {/* Controls */}
      <div className="chart-controls">
        {/* Chart Type Selector */}
        <label>
          Chart Type:
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {chartTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {/* Time Range Selector */}
        <label>
          Time Range:
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {rangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Chart */}
      <Chart
        chartType={chartType}
        data={data}
        height="400px"
        options={chartOptions}
      />
    </div>
  );
};

export default Linechart;
