// frontend/src/components/TransactionDetailModal.jsx
import React, { useEffect, useState } from "react";
import TransactionCostChart from "./TransactionCostChart";
import axios from "../axiosInstance";

const TransactionDetailModal = ({ transactionId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [cost, setCost] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [transactionId]);

  const fetchDetail = async () => {
    try {
      const res1 = await axios.get(`/transactions/${transactionId}`);
      const res2 = await axios.get(`/transactions/${transactionId}/cost`);
      setDetail(res1.data);
      setCost(res2.data);
    } catch (err) {
      console.error("讀取明細失敗：", err);
    }
  };

  if (!detail || !cost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-bold mb-4">交易明細：#{transactionId}</h3>
        <p>充電樁：{detail.chargePointId}</p>
        <p>使用者 ID：{detail.idTag}</p>
        <p>起始：{detail.startTimestamp}</p>
        <p>結束：{detail.stopTimestamp}</p>
        <p>用電量：{cost.totalKWh} kWh</p>
        <p>電費：NT$ {cost.totalCost}</p>
        <p className="font-medium mt-4">計費明細：</p>
        <ul className="max-h-40 overflow-y-auto text-sm">
          {cost.details.map((d, idx) => (
            <li key={idx}>
              ▸ {d.from} ~ {d.to} | {d.kWh} kWh × {d.price} = ${d.cost}
            </li>
          ))}
        </ul>

        {/* 加入圖表元件 */}
        <TransactionCostChart transactionId={transactionId} />

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          關閉
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
