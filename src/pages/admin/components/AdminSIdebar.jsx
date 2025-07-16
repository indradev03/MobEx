import { NavLink, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Package,
  Users,
  BarChart3,
  ShoppingBag,
  Tag,
  LogOut
} from "lucide-react";
import "./AdminSidebar.css";

const menuItems = [
    { title: "Home", url: "/admindashboard", icon: BarChart3 },
    { title: "Product", url: "/admindashboard/add-product", icon: Smartphone },
    { title: "Brands", url: "/admindashboard/brands", icon: Tag },
    { title: "Users", url: "/admindashboard/users", icon: Users },
    { title: "Orders", url: "/admindashboard/orders", icon: ShoppingBag },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Package className="logo-icon" />
        <h2 className="logo-text">Mobile Exchange</h2>
      </div>

      {/* Admin Profile */}
      <div className="admin-profile">
        <div className="avatar">A</div>
        <div className="admin-info">
          <p className="admin-name">Admin User</p>
          <p className="admin-email">admin@mobile.com</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
            {menuItems.map((item) => (
            <li key={item.url}>
                <NavLink
                to={item.url}
                end={item.url === "/admindashboard"}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                >
                <item.icon className="nav-icon" />
                <span>{item.title}</span>
                </NavLink>
            </li>
            ))}

        </ul>
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
