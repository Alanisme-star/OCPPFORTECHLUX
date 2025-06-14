// ✅ TrendChart.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function TrendChart({ groupBy = "day" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`/dashboard/trend?group_by=${groupBy}`) // ✅ 修正為正確路徑
      .then(res => setData(res.data))
      .catch(err => console.error("載入趨勢圖失敗", err));
  }, [groupBy]);

  return (
    <div className="bg-white text-black p-4 rounded-xl shadow-md">
      <p className="font-bold mb-2">📈 每{groupBy === 'day' ? '日' : '週'}用電趨勢</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis unit=" kWh" />
          <Tooltip />
          <Line type="monotone" dataKey="kWh" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
