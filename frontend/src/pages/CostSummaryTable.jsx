import React, { useEffect, useState } from "react";
import axios from "../axiosInstance"; // ✅ 這樣 baseURL `/api` 才會自動套用

const CostSummaryTable = () => {
  const [data, setData] = useState([]);
  const [start, setStart] = useState("2025-06-01");
  const [end, setEnd] = useState("2025-06-13");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (start && end) {
      fetchData();
    }
  }, [start, end]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `/transactions/cost-summary?start=${start}&end=${end}`
      );
      setData(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch cost summary:", err);
      setError("查詢失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-2">💰 電費成本明細表</h2>
      <div className="flex items-center gap-2 mb-3">
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

      {error && (
        <div className="text-red-500 mb-2">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">載入中...</div>
      ) : (
        <div className="overflow-auto">
          <table className="table-auto w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 border">交易 ID</th>
                <th className="px-3 py-2 border">用電量 (kWh)</th>
                <th className="px-3 py-2 border">基本費</th>
                <th className="px-3 py-2 border">用電費</th>
                <th className="px-3 py-2 border">超量費</th>
                <th className="px-3 py-2 border font-semibold text-right">總金額</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.transactionId} className="border-t">
                  <td className="px-3 py-1 border">{item.transactionId}</td>
                  <td className="px-3 py-1 border">{item.totalKWh}</td>
                  <td className="px-3 py-1 border">${item.basicFee}</td>
                  <td className="px-3 py-1 border">${item.energyCost}</td>
                  <td className="px-3 py-1 border">${item.overuseFee}</td>
                  <td className="px-3 py-1 border font-semibold text-right">
                    ${item.totalCost}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-3 text-gray-500">
                    無符合條件的資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CostSummaryTable;
