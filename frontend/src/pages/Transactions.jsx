// frontend/src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import TransactionDetailModal from "../components/TransactionDetailModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions");
      setTransactions(Object.values(res.data));
    } catch (err) {
      console.error("讀取交易紀錄失敗：", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">交易紀錄</h2>
      {loading ? (
        <p>載入中...</p>
      ) : (
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2">交易 ID</th>
              <th className="p-2">充電樁</th>
              <th className="p-2">使用者</th>
              <th className="p-2">開始時間</th>
              <th className="p-2">結束時間</th>
              <th className="p-2">用電量 (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.transactionId}
                className="border-b hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelected(txn.transactionId)}
              >
                <td className="p-2">{txn.transactionId}</td>
                <td className="p-2">{txn.chargePointId}</td>
                <td className="p-2">{txn.idTag}</td>
                <td className="p-2">{txn.startTimestamp}</td>
                <td className="p-2">{txn.stopTimestamp || "--"}</td>
                <td className="p-2">
                  {txn.meterStop && txn.meterStart
                    ? ((txn.meterStop - txn.meterStart) / 1000).toFixed(2)
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <TransactionDetailModal
          transactionId={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default Transactions;
