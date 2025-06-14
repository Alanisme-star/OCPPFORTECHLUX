import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";  // ✅ 改這行
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChargePointComparisonChart = () => {
  const [data, setData] = useState([]);
  const [points, setPoints] = useState([]);
  const [start, setStart] = useState("2025-06-01");
  const [end, setEnd] = useState("2025-06-13");

  useEffect(() => {
    fetchData();
  }, [start, end]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/summary/daily-by-chargepoint-range?start=${start}&end=${end}`
      );
      const rows = res.data;

      const allKeys = new Set();
      rows.forEach((row) => {
        Object.keys(row).forEach((k) => {
          if (k !== "period") allKeys.add(k);
        });
      });

      setData(rows);
      setPoints([...allKeys]);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-2">📊 多樁用電趨勢比較（可選擇區間）</h2>
      <div className="flex items-center gap-2 mb-2">
        <label>Start:</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-1 rounded"
        />
        <label>End:</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-1 rounded"
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {points.map((cp, idx) => (
            <Line
              key={cp}
              type="monotone"
              dataKey={cp}
              stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
              name={cp}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChargePointComparisonChart;
