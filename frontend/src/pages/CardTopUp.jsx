// frontend/src/pages/CardTopUp.jsx
import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";

function CardTopUp() {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/cards")
      .then((res) => setCards(res.data))
      .catch((err) => console.error("讀取卡片失敗", err));
  }, []);

  const handleTopUp = (e) => {
    e.preventDefault();
    if (!selectedCardId || !topUpAmount) {
      setMessage("請選擇卡片並輸入儲值金額");
      return;
    }

    axios.post(`/api/cards/${selectedCardId}/topup`, {
      amount: parseFloat(topUpAmount),
    })
      .then((res) => {
        setMessage(`✅ 儲值成功！新餘額：${res.data.new_balance} 元`);
        setTopUpAmount("");
      })
      .catch((err) => {
        setMessage("❌ 儲值失敗，請稍後再試");
        console.error(err);
      });
  };

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">卡片儲值</h2>

      <form onSubmit={handleTopUp} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">選擇卡片：</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
          >
            <option value="">請選擇卡片</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.card_id}（餘額：{card.balance} 元）
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">儲值金額（元）：</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          儲值
        </button>
      </form>

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
}

export default CardTopUp;
