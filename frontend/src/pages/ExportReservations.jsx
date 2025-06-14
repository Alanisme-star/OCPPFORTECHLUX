// frontend/src/pages/ExportReservations.jsx
import React, { useState } from "react";
import axios from "../axiosInstance";

const ExportReservations = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadCSV = async () => {
    setDownloading(true);
    try {
      const res = await axios.get("/reservations/export", {
        responseType: "blob"
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reservations.csv");
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
      <h2 className="text-2xl font-bold mb-4">📤 匯出預約清單</h2>
      <p className="mb-4 text-sm text-gray-400">匯出所有預約資料為 CSV 檔</p>
      <button
        onClick={downloadCSV}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        disabled={downloading}
      >
        {downloading ? "匯出中..." : "匯出預約 CSV"}
      </button>
    </div>
  );
};

export default ExportReservations;
