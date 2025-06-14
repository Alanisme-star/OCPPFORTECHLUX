// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

import ChargePointComparisonChart from "./ChargePointComparisonChart";
import CostSummaryTable from "./CostSummaryTable";

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  const [topList, setTopList] = useState([]);
  const [status, setStatus] = useState({});
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s1, s2, s3, s4] = await Promise.all([
          axios.get("/dashboard/trend?group_by=day"),
          axios.get("/summary/top?group_by=idTag&limit=5"), // 若後端有支援可保留
          axios.get("/status"),
          axios.get("/summary/daily-by-chargepoint")
        ]);
      setSummary(Array.isArray(s1.data) ? s1.data : []);
      setTopList(Array.isArray(s2.data) ? s2.data : []);
      setStatus(s3.data || {});
      setTrend(Array.isArray(s4.data) ? s4.data.slice(-7) : []);
    } catch (err) {
      console.error("儀表板資料讀取失敗：", err);
    } finally {
      setLoading(false);
    }
  };

  const cpList = trend.length > 0 ? Object.keys(trend[0]).filter((k) => k !== "period") : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">儀表板 Dashboard</h2>
      {loading ? (
        <p>載入中...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-lg mb-2">📊 每日用電統計</h3>
              <ul className="text-sm max-h-64 overflow-y-auto">
                {summary.length > 0 ? (
                  summary.slice(-7).map((row) => (
                    <li key={row.period}>
                      ▸ {row.period}：{(row.totalEnergy / 1000).toFixed(2)} kWh（{row.transactionCount} 筆）
                    </li>
                  ))
                ) : (
                  <li>無資料</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-lg mb-2">🏆 用電排行榜</h3>
              <ul className="text-sm">
                {topList.length > 0 ? (
                  topList.map((item, idx) => (
                    <li key={idx}>
                      {idx + 1}. {item.group}：{(item.totalEnergy / 1000).toFixed(2)} kWh
                    </li>
                  ))
                ) : (
                  <li>無資料</li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">📈 多樁近 7 日用電趨勢圖（固定範圍）</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis unit="kWh" />
                <Tooltip />
                <Legend />
                {cpList.map((cp) => (
                  <Line key={cp} type="monotone" dataKey={cp} stroke="#4fd1c5" name={cp} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">🏅 前 5 名用電量圖表</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={topList.map((item) => ({
                name: item.group,
                kWh: (item.totalEnergy / 1000).toFixed(2)
              }))} margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="kWh" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="kWh" fill="#60a5fa" name="用電量" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">🔌 即時充電樁狀態</h3>
            <table className="table-auto w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-2">充電樁</th>
                  <th className="p-2">狀態</th>
                </tr>
              </thead>
              <tbody>
                {status && Object.keys(status).length > 0 ? (
                  Object.entries(status).map(([cpId, st]) => (
                    <tr key={cpId} className="border-b">
                      <td className="p-2">{cpId}</td>
                      <td className="p-2">{st}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2" colSpan="2">無資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ 新增元件：日期範圍多樁用電比較圖 */}
          <div className="bg-white rounded">
            <ChargePointComparisonChart />
          </div>

          {/* ✅ 新增元件：電費成本明細表格 */}
          <div className="bg-white rounded">
            <CostSummaryTable />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
