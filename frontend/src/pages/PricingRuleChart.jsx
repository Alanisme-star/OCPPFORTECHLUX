// frontend/src/pages/PricingRuleChart.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

const PricingRuleChart = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await axios.get("/summary/pricing-matrix");
      setRules(res.data);
    } catch (err) {
      console.error("電價規則載入失敗：", err);
    }
  };

  const summer = rules.filter((r) => r.season === "summer");
  const nonSummer = rules.filter((r) => r.season === "non_summer");

  const transform = (list) =>
    list.map((r) => ({
      label: `${r.start_time}~${r.end_time} (${r.day_type})`,
      price: r.price,
    }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">📈 時段電價分佈</h2>

      {rules.length === 0 && (
        <div className="text-red-400">
          ⚠️ 尚未載入電價資料，請確認 API 是否正常。
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">☀️ 夏季</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={transform(summer)} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="元" />
            <YAxis type="category" dataKey="label" width={180} />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#facc15" name="每度單價" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">❄️ 非夏季</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={transform(nonSummer)} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="元" />
            <YAxis type="category" dataKey="label" width={180} />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#38bdf8" name="每度單價" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PricingRuleChart;
