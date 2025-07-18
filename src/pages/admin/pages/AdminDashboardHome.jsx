import React, { useEffect, useState } from "react";
import {
  Users,
  Smartphone,
  ShoppingBag,
  Tag
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";

import "./AdminDashboardHome.css";

const COLORS = ["#3b82f6", "#10b981", "#eab308", "#8b5cf6"];

export default function AdminDashboardHome() {
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    orders: 0,
    brands: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const urls = [
          "http://localhost:5000/api/stats/users/count",
          "http://localhost:5000/api/stats/products/count",
          "http://localhost:5000/api/stats/orders/count",
          "http://localhost:5000/api/stats/brands/count",
        ];

        const responses = await Promise.all(urls.map((url) => fetch(url)));

        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.url} status: ${res.status}`);
          }
        }

        const data = await Promise.all(responses.map((res) => res.json()));

        setCounts({
          users: data[0]?.count ?? 0,
          products: data[1]?.count ?? 0,
          orders: data[2]?.count ?? 0,
          brands: data[3]?.count ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch counts:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      title: "Total Users",
      count: counts.users,
      icon: <Users className="icon" />,
      color: "#3b82f6"
    },
    {
      title: "Total Products",
      count: counts.products,
      icon: <Smartphone className="icon" />,
      color: "#10b981"
    },
    {
      title: "Orders Today",
      count: counts.orders,
      icon: <ShoppingBag className="icon" />,
      color: "#eab308"
    },
    {
      title: "Total Brands",
      count: counts.brands,
      icon: <Tag className="icon" />,
      color: "#8b5cf6"
    },
  ];

  const chartData = stats.map((item) => ({
    name: item.title,
    value: item.count,
  }));

  const lineChartData = [
    { date: "Mon", users: 12, orders: 4 },
    { date: "Tue", users: 19, orders: 8 },
    { date: "Wed", users: 25, orders: 10 },
    { date: "Thu", users: 20, orders: 7 },
    { date: "Fri", users: 30, orders: 12 },
    { date: "Sat", users: 22, orders: 6 },
    { date: "Sun", users: 18, orders: 5 },
  ];

  const areaChartData = [
    { month: "Jan", sales: 2400 },
    { month: "Feb", sales: 1398 },
    { month: "Mar", sales: 9800 },
    { month: "Apr", sales: 3908 },
    { month: "May", sales: 4800 },
    { month: "Jun", sales: 3800 },
    { month: "Jul", sales: 4300 },
  ];

  const radialData = [
    { name: "Completed", value: 75, fill: "#10b981" },
    { name: "Remaining", value: 25, fill: "#e5e7eb" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Admin Dashboard</h1>

      {loading ? (
        <p className="loading">Loading stats...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            {stats.map((item, idx) => (
              <div key={idx} className="stat-card" style={{ borderLeft: `6px solid ${item.color}` }}>
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Grid */}
          <div className="charts-grid">
            {/* Bar Chart */}
            <div className="chart-box">
              <h2>📦 Products Overview</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-box">
              <h2>📈 Distribution</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="chart-box">
              <h2>📅 Weekly Trends</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineChartData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart */}
            <div className="chart-box">
              <h2>💰 Monthly Sales</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Radial Chart */}
            <div className="chart-box">
              <h2>✅ Order Completion</h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={12}
                  data={radialData}
                >
                  <RadialBar background clockWise dataKey="value" />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
