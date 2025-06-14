// frontend/src/pages/TopEnergyChart.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const TopEnergyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTop();
  }, []);

  const fetchTop = async () => {
    try {
      const res = await axios.get("/dashboard/top?group_by=idTag&limit=10");
      const formatted = res.data.map((item) => ({
        name: item.group,
        kWh: (item.totalEnergy / 1000).toFixed(2),
        count: item.transactionCount,
      }));
      setData(formatted);
    } catch (err) {
      console.error("排行資料載入失敗：", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🏆 前 10 名用電排行 (依 idTag)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: "kWh", position: "insideBottomRight", offset: -5 }} />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="kWh" fill="#60a5fa" name="用電量 (kWh)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopEnergyChart;
