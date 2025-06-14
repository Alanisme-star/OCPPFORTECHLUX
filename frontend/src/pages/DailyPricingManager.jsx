// frontend/src/pages/DailyPricingManager.jsx
import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";

const DailyPricingManager = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ id: null, startTime: "08:00", endTime: "12:00", price: 0, label: "" });

  const fetchData = async () => {
    const res = await axios.get("/daily-pricing", { params: { date: selectedDate } });
    setEntries(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleSubmit = async () => {
    const payload = {
      date: selectedDate,
      startTime: form.startTime,
      endTime: form.endTime,
      price: parseFloat(form.price),
      label: form.label
    };
    if (form.id) {
      await axios.put(`/daily-pricing/${form.id}`, payload);
    } else {
      await axios.post("/daily-pricing", payload);
    }
    setForm({ id: null, startTime: "08:00", endTime: "12:00", price: 0, label: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/daily-pricing/${id}`);
    fetchData();
  };

  const timeToPercent = (time) => {
    const [h, m] = time.split(":").map(Number);
    return ((h * 60 + m) / 1440) * 100;
  };

  const getColor = (label) => {
    if (label.includes("六")) return "#FCD34D"; // 黃
    if (label.includes("假") || label.includes("日")) return "#FCA5A5"; // 紅
    return "#60A5FA"; // 藍
  };

  return (
    <div className="text-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📅 每日電價拖曳設定</h2>

      <div className="mb-4">
        <label>選擇日期：</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-black px-2 py-1" />
      </div>

      <div className="relative h-16 bg-gray-800 rounded mb-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute top-0 h-full border-r border-gray-600 text-xs text-center" style={{ left: `${(i / 24) * 100}%`, width: "4.16%" }}>
            <div className="text-[10px] text-gray-400">{i.toString().padStart(2, "0")}:00</div>
          </div>
        ))}

        {entries.map((e) => (
          <div
            key={e.id}
            className="absolute top-5 h-6 rounded text-xs text-black px-1 cursor-pointer shadow-md"
            style={{
              left: `${timeToPercent(e.startTime)}%`,
              width: `${timeToPercent(e.endTime) - timeToPercent(e.startTime)}%`,
              backgroundColor: getColor(e.label || "")
            }}
            title={`${e.startTime} - ${e.endTime}｜${e.price} 元｜${e.label}`}
            onClick={() => setForm({ id: e.id, startTime: e.startTime, endTime: e.endTime, price: e.price, label: e.label })}
          >
            {e.price}元
          </div>
        ))}
      </div>

      <div className="bg-gray-700 p-4 rounded mb-6">
        <h3 className="font-semibold mb-2">{form.id ? "✏️ 編輯設定" : "➕ 新增設定"}</h3>
        <div className="flex flex-wrap gap-4">
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="text-black px-2 py-1" />
          <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="text-black px-2 py-1" />
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="text-black px-2 py-1 w-28" placeholder="單價" />
          <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="text-black px-2 py-1" placeholder="說明/備註" />
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">{form.id ? "更新" : "新增"}</button>
          {form.id && <button onClick={() => setForm({ id: null, startTime: "08:00", endTime: "12:00", price: 0, label: "" })} className="px-4 py-1">取消</button>}
        </div>
      </div>
    </div>
  );
};

export default DailyPricingManager;
