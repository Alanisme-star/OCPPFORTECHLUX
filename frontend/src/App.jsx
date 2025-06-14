// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Login from "./pages/Login";
import ExportTransactions from "./pages/ExportTransactions";
import BoundUsers from "./pages/BoundUsers";
import Cards from "./pages/Cards";
import Transactions from "./pages/Transactions";
import StatusLogs from "./pages/StatusLogs";
import TopEnergyChart from "./pages/TopEnergyChart";
import PricingRuleChart from "./pages/PricingRuleChart";
import ChargePointComparisonChart from "./pages/ChargePointComparisonChart";
import ExportReservations from "./pages/ExportReservations";
import MonthlyReportDownload from "./pages/MonthlyReportDownload";
import HolidayChecker from "./pages/HolidayChecker";
import CardTopUp from "./pages/CardTopUp";
import PaymentHistory from "./pages/PaymentHistory";
import PricingSettings from "./pages/PricingSettings";
import LiveDemo from "./pages/LiveDemo";
import CostSummaryPage from "./pages/CostSummaryPage";
import DailyPricingManager from "./pages/DailyPricingManager";
import WeeklyPricingSettings from './pages/WeeklyPricingSettings';

function App() {
  return (
    
    <Router>
      <div className="flex min-h-screen bg-[#0F172A] text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/export" element={<ExportTransactions />} />
            <Route path="/bound-users" element={<BoundUsers />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/users" element={<Users />} />
            <Route path="/top-chart" element={<TopEnergyChart />} />
            <Route path="/pricing-chart" element={<PricingRuleChart />} />
            <Route path="/compare-chart" element={<ChargePointComparisonChart />} />
            <Route path="/export-reservations" element={<ExportReservations />} />
            <Route path="/monthly-report" element={<MonthlyReportDownload />} />
            <Route path="/holiday-checker" element={<HolidayChecker />} />
            <Route path="/card-topup" element={<CardTopUp />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/transactions" element={<Transactions />} />  {/* 新增 */}
            <Route path="/status-logs" element={<StatusLogs />} />    {/* 新增 */}
            <Route path="/pricing-settings" element={<PricingSettings />} />
            <Route path="/live-demo" element={<LiveDemo />} />
            <Route path="/cost-summary" element={<CostSummaryPage />} />
            <Route path="/daily-pricing" element={<DailyPricingManager />} />
            <Route path="/weekly-pricing" element={<WeeklyPricingSettings />} />
         </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
