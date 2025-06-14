// frontend/src/pages/MonthlyReportDownload.jsx
import React, { useState } from "react";
import axios from "../axiosInstance";

const MonthlyReportDownload = () => {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    if (!month) return alert("請選擇月份！");
    setLoading(true);
    try {
      const res = await axios.get(`/report/monthly?month=${month}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `monthly_report_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("下載失敗：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧾 本月用電報表</h2>
      <div className="flex items-center gap-4">
        <input
          type="month"
          className="bg-gray-800 text-white p-2 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button
          onClick={downloadPDF}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {loading ? "產生中..." : "下載報表 PDF"}
        </button>
      </div>
    </div>
  );
};

export default MonthlyReportDownload;
