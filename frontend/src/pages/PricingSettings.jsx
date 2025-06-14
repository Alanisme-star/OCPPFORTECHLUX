// frontend/src/pages/PricingSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00");
const dayTypes = ["weekday", "holiday"];
const seasons = ["summer", "non_summer"];

const PricingSettings = () => {
  const [matrix, setMatrix] = useState({});
  const [season, setSeason] = useState("summer");
  const [dayType, setDayType] = useState("weekday");
  const [editingHour, setEditingHour] = useState(null);
  const [newPrice, setNewPrice] = useState(0);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const res = await axios.get("/summary/pricing-matrix");
      const data = res.data.reduce((acc, rule) => {
        const key = `${rule.season}_${rule.day_type}`;
        if (!acc[key]) acc[key] = {};

        const start = parseInt(rule.start_time.slice(0, 2));
        const end = parseInt(rule.end_time.slice(0, 2)) || 24;
        for (let i = start; i < end; i++) {
          acc[key][i] = rule.price;
        }
        return acc;
      }, {});
      setMatrix(data);
    } catch (err) {
      console.error("無法讀取電價設定：", err);
    }
  };

  const handleCellClick = (hour) => {
    setEditingHour(hour);
    setNewPrice(matrix[`${season}_${dayType}`]?.[hour] ?? 0);
  };

  const handleSave = async () => {
    try {
      // 先刪除該小時的設定（若存在）
      await axios.delete("/pricing-rules", {
        data: {
          season,
          day_type: dayType,
          start_time: editingHour.toString().padStart(2, "0") + ":00",
          end_time: (editingHour + 1).toString().padStart(2, "0") + ":00",
          price: matrix[`${season}_${dayType}`]?.[editingHour] ?? 0
        }
      });
    } catch (e) {
      // 可忽略刪除錯誤（如無此規則）
    }

    try {
      // 寫入新的電價設定
      await axios.post("/pricing-rules", {
        season,
        day_type: dayType,
        start_time: editingHour.toString().padStart(2, "0") + ":00",
        end_time: (editingHour + 1).toString().padStart(2, "0") + ":00",
        price: parseFloat(newPrice)
      });
      await fetchMatrix();
      setEditingHour(null);
    } catch (err) {
      console.error("更新失敗：", err);
    }
  };

  const renderTable = () => {
    const current = matrix[`${season}_${dayType}`] || {};
    return (
      <table className="table-fixed w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2">時段</th>
            <th className="border px-2">電價 (元/kWh)</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h, i) => (
            <tr
              key={i}
              className="cursor-pointer hover:bg-gray-200 text-black"
              onClick={() => handleCellClick(i)}
            >
              <td className="border px-2 py-1">{h}</td>
              <td className="border px-2 py-1">{current[i] ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="text-black max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🕒 時間電價設定</h2>
      <div className="mb-4 flex gap-4">
        <div>
          <label>季節：</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label>日別：</label>
          <select value={dayType} onChange={(e) => setDayType(e.target.value)}>
            {dayTypes.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {renderTable()}

      {editingHour !== null && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="font-semibold mb-2">
            設定 {editingHour.toString().padStart(2, "0")}:00 - {(editingHour + 1).toString().padStart(2, "0")}:00 的電價
          </h3>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="border px-2 py-1 mr-4"
          />
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded">儲存</button>
          <button onClick={() => setEditingHour(null)} className="ml-2 px-4 py-1">取消</button>
        </div>
      )}
    </div>
  );
};

export default PricingSettings;
