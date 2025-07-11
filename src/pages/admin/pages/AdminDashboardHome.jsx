// AdminDashboardHome.jsx
import React from "react";
import { Users, Smartphone, ShoppingBag, Calendar } from "lucide-react";
import "./AdminDashboardHome.css";

const stats = [
  { title: "Total Users", count: 1280, icon: <Users className="w-6 h-6" style={{ color: "#3b82f6" }} />, bgClass: "bg-blue" },
  { title: "Total Products", count: 350, icon: <Smartphone className="w-6 h-6" style={{ color: "#10b981" }} />, bgClass: "bg-green" },
  { title: "Orders Today", count: 67, icon: <ShoppingBag className="w-6 h-6" style={{ color: "#eab308" }} />, bgClass: "bg-yellow" },
  { title: "Bookings", count: 24, icon: <Calendar className="w-6 h-6" style={{ color: "#ef4444" }} />, bgClass: "bg-red" },
];

export default function AdminDashboardHome() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className={`stat-card ${item.bgClass}`}>
            <div className="stat-info">
              <h3>{item.title}</h3>
              <p>{item.count}</p>
            </div>
            <div className="stat-icon-wrapper">{item.icon}</div>
          </div>
        ))}
      </div>
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>John Doe placed an order.</li>
          <li>iPhone 14 added to Products.</li>
          <li>New booking received for Table #5.</li>
          <li>Admin approved 2 brand submissions.</li>
        </ul>
      </div>
    </div>
  );
}
