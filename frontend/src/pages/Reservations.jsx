// frontend/src/pages/Reservations.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const Reservations = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    chargePointId: "",
    idTag: "",
    startTime: "",
    endTime: ""
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    const res = await axios.get("/reservations");
    setList(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing !== null) {
        await axios.put(`/api/reservations/${editing}`, form);
      } else {
        await axios.post("/api/reservations", { ...form });
      }
      fetchList();
      setForm({ chargePointId: "", idTag: "", startTime: "", endTime: "" });
      setEditing(null);
    } catch (err) {
      alert("操作失敗：" + err.response?.data?.detail || err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      chargePointId: item.chargePointId,
      idTag: item.idTag,
      startTime: item.startTime,
      endTime: item.endTime
    });
    setEditing(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("確定要刪除此預約嗎？")) {
      await axios.delete(`/api/reservations/${id}`);
      fetchList();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">預約清單</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-md mb-6">
        <div className="grid grid-cols-4 gap-4">
          <input
            className="p-2 rounded bg-gray-700 text-white"
            placeholder="充電樁 ID"
            value={form.chargePointId}
            onChange={(e) => setForm({ ...form, chargePointId: e.target.value })}
          />
          <input
            className="p-2 rounded bg-gray-700 text-white"
            placeholder="卡片 IDTag"
            value={form.idTag}
            onChange={(e) => setForm({ ...form, idTag: e.target.value })}
          />
          <input
            type="datetime-local"
            className="p-2 rounded bg-gray-700 text-white"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <input
            type="datetime-local"
            className="p-2 rounded bg-gray-700 text-white"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white mt-2"
        >
          {editing !== null ? "更新" : "新增"}
        </button>
      </form>

      {loading ? (
        <p>載入中...</p>
      ) : (
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">充電樁</th>
              <th className="p-2">卡片</th>
              <th className="p-2">起始</th>
              <th className="p-2">結束</th>
              <th className="p-2">狀態</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-700">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.chargePointId}</td>
                <td className="p-2">{item.idTag}</td>
                <td className="p-2">{item.startTime}</td>
                <td className="p-2">{item.endTime}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-400 hover:underline">編輯</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline">刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reservations;
