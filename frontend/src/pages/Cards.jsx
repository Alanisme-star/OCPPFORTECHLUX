// frontend/src/pages/Cards.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ idTag: "", status: "Accepted", validUntil: "2099-12-31T23:59:59" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const res = await axios.get("/id_tags");
    setCards(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/id_tags/${editing}`, form);
      } else {
        await axios.post("/api/id_tags", form);
      }
      fetchCards();
      setForm({ idTag: "", status: "Accepted", validUntil: "2099-12-31T23:59:59" });
      setEditing(null);
    } catch (err) {
      alert("操作失敗: " + err.response?.data?.detail || err.message);
    }
  };

  const handleEdit = (card) => {
    setForm({ ...card });
    setEditing(card.idTag);
  };

  const handleDelete = async (idTag) => {
    if (window.confirm("確定要刪除這張卡片嗎？")) {
      await axios.delete(`/api/id_tags/${idTag}`);
      fetchCards();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">卡片管理</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-md mb-6">
        <div className="flex gap-4">
          <input
            className="p-2 rounded bg-gray-700 text-white w-full"
            placeholder="ID Tag"
            value={form.idTag}
            onChange={(e) => setForm({ ...form, idTag: e.target.value })}
            disabled={!!editing}
          />
          <select
            className="p-2 rounded bg-gray-700 text-white"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Accepted">Accepted</option>
            <option value="Expired">Expired</option>
            <option value="Blocked">Blocked</option>
          </select>
          <input
            type="datetime-local"
            className="p-2 rounded bg-gray-700 text-white"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
            {editing ? "更新" : "新增"}
          </button>
        </div>
      </form>

      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-2">ID Tag</th>
            <th className="p-2">狀態</th>
            <th className="p-2">有效期限</th>
            <th className="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.idTag} className="border-b hover:bg-gray-700">
              <td className="p-2">{card.idTag}</td>
              <td className="p-2">{card.status}</td>
              <td className="p-2">{card.validUntil}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(card)} className="text-blue-400 hover:underline">編輯</button>
                <button onClick={() => handleDelete(card.idTag)} className="text-red-400 hover:underline">刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cards;
