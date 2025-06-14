// frontend/src/pages/HolidayChecker.jsx
import React, { useState } from "react";
import axios from "../axiosInstance";

const HolidayChecker = () => {
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHoliday = async () => {
    if (!date) return alert("請選擇日期");
    setLoading(true);
    try {
      const res = await axios.get(`/holiday/${date}`);
      setResult(res.data);
    } catch (err) {
      alert("查詢失敗：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">📅 假日查詢工具</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        />
        <button
          onClick={checkHoliday}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "查詢中..." : "查詢"}
        </button>
      </div>
      {result && (
        <div className="bg-gray-700 text-white p-4 rounded">
          <p>📌 查詢日期：{result.date}</p>
          <p>📖 類型：{result.type}</p>
          <p>📛 是否為假日：{result?.holiday ? "✅ 是" : "❌ 否"}</p>
          {result.festival && <p>🎊 節日名稱：{result.festival}</p>}
        </div>
      )}
    </div>
  );
};

export default HolidayChecker;
