import React from "react";
import CostSummaryTable from "./CostSummaryTable";

export default function CostSummaryPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">💰 電費成本總覽</h2>
      <CostSummaryTable />
    </div>
  );
}
