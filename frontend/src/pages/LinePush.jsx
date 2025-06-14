// frontend/src/pages/LinePush.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const LinePush = () => {
  const [message, setMessage] = useState("一週用電統計出爐，請查收 🔌📊");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("使用者資料載入失敗：", err);
    }
  };

  const toggleSelect = (idTag) => {
    setSelectedUsers((prev) =>
      prev.includes(idTag) ? prev.filter((u) => u !== idTag) : [...prev, idTag]
    );
  };

  const sendMessage = async () => {
    setLoading(true);
    try {
      await axios.post("/api/messaging/test", {
        message,
        targets: selectedUsers,
      });
      setResult("✅ 發送成功");
    } catch (err) {
      setResult("❌ 發送失敗: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔔 LINE 推播測試</h2>
      <label className="block mb-2 font-semibold">訊息內容：</label>
      <textarea
        className="w-full h-24 p-2 rounded bg-gray-800 text-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label className="block mt-4 mb-2 font-semibold">選擇推播對象：</label>
      <div className="max-h-40 overflow-y-auto bg-gray-900 rounded p-2 border border-gray-700">
        {users.map((user) => (
          <label key={user.idTag} className="block text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.idTag)}
              onChange={() => toggleSelect(user.idTag)}
              className="mr-2"
            />
            {user.name || user.idTag}（{user.department || "-"}）
          </label>
        ))}
      </div>

      <button
        onClick={sendMessage}
        disabled={loading || selectedUsers.length === 0}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        {loading ? "發送中..." : "立即發送"}
      </button>

      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  );
};

export default LinePush;