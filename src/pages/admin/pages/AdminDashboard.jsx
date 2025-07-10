import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSIdebar"; // fixed typo
import AdminDashboardHome from "./AdminDashboardHome";
import AddProductPage from "./AddProductPage";
import BrandsPage from "./BrandsPage";
import BrandProductsPage from "./BrandProductsPage"; // import brand details page

const BookingsPage = () => <h2>Bookings Page</h2>;
const UsersPage = () => <h2>Users Page</h2>;
const OrdersPage = () => <h2>Orders Page</h2>;

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
          {/* Nested route for individual brand details */}
          <Route path="brands/:brandId" element={<BrandProductsPage />} />

          <Route path="bookings" element={<BookingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
