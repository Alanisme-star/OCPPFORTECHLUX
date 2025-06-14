// frontend/src/pages/StatusLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const StatusLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ chargePointId: "", limit: 100 });
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.chargePointId) params.append("chargePointId", filter.chargePointId);
      if (filter.limit) params.append("limit", filter.limit);
      const res = await axios.get(`/status/logs?${params.toString()}`);
      setLogs(res.data);
    } catch (err) {
      console.error("讀取狀態紀錄失敗：", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">充電樁狀態日誌</h2>

      <div className="mb-4 flex items-center gap-4">
        <input
          className="p-2 rounded bg-gray-700 text-white"
          placeholder="ChargePoint ID"
          value={filter.chargePointId}
          onChange={(e) => setFilter({ ...filter, chargePointId: e.target.value })}
        />
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={filter.limit}
          onChange={(e) => setFilter({ ...filter, limit: e.target.value })}
        >
          {[50, 100, 200, 500].map((num) => (
            <option key={num} value={num}>{num} 筆</option>
          ))}
        </select>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >查詢</button>
      </div>

      {loading ? (
        <p>載入中...</p>
      ) : (
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2">充電樁</th>
              <th className="p-2">連接器</th>
              <th className="p-2">狀態</th>
              <th className="p-2">時間</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-700">
                <td className="p-2">{log.chargePointId}</td>
                <td className="p-2">{log.connectorId}</td>
                <td className="p-2">{log.status}</td>
                <td className="p-2">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatusLogs;
