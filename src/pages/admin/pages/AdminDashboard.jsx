import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSIdebar";

import AdminDashboardHome from "./AdminDashboardHome";
import AddProductPage from "./AddProductPage";
import BrandsPage from "./BrandsPage";
import BrandProductsPage from "./BrandProductsPage"; // brand detail view
import AdminOrderPage from "./AdminOrderPage"; // Admin order management page

// Stub pages for future sections
const BookingsPage = () => <h2>Bookings Page</h2>;
const UsersPage = () => <h2>Users Page</h2>;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (!token || userType !== "admin") {
      navigate("/");
    }
  }, [navigate, token, userType]);

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route index element={<AdminDashboardHome />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:brandId" element={<BrandProductsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<AdminOrderPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
