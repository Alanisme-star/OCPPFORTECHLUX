// frontend/src/pages/ExportTransactions.jsx
import React, { useState } from "react";
import axios from "../axiosInstance";

const ExportTransactions = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadCSV = async () => {
    setDownloading(true);
    try {
      const res = await axios.get("/users/export", {
        responseType: "blob"
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("下載失敗：" + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📤 匯出使用者名單</h2>
      <p className="mb-4 text-sm text-gray-400">按下按鈕即可匯出所有使用者基本資料為 CSV</p>
      <button
        onClick={downloadCSV}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        disabled={downloading}
      >
        {downloading ? "匯出中..." : "匯出 CSV"}
      </button>
    </div>
  );
};

export default ExportTransactions;
