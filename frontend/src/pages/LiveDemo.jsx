import React, { useState } from "react";
import LiveChargingStatus from "../components/LiveChargingStatus";

function LiveDemo() {
  const [cpId, setCpId] = useState("CP001");
  const [idTag, setIdTag] = useState("ABC123");

  return (
    <div className="p-6 bg-white text-black rounded-xl shadow-xl max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">🔍 即時充電狀態測試</h2>

      <div className="mb-6 space-y-3">
        <div>
          <label className="font-semibold mr-2">充電樁 ID：</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            value={cpId}
            onChange={(e) => setCpId(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mr-2">用戶 IDTag：</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            value={idTag}
            onChange={(e) => setIdTag(e.target.value)}
          />
        </div>
      </div>

      <LiveChargingStatus chargePointId={cpId} idTag={idTag} />
    </div>
  );
}

export default LiveDemo;
