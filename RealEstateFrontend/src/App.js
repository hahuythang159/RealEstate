import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom"; 

// Import các trang
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserList from "./users/UserList";
import ProfilePage from "./users/ProfilePage";

// Import các thành phần
import AppHeader from "./components/Header";
import SocialLinks from "./components/SocialLinks";
import Favorites from "./components/Favorite/FavoriteList";


// Import các thành phần bất động sản
import AddRental from "./components/Rental/AddRental";
import AddProperty from "./components/Property/AddProperty";
import PropertyDetail from "./components/Property/PropertyDetail";
import PropertyList from "./components/Property/PropertyList";
import AwaitingApproval from "./components/Rental/AwaitingApproval";
import ApprovedRentals from "./components/Rental/ApprovedRentals";
import MyPropertyList from "./components/Property/MyPropertyList";
import ProductDetail from "./components/Property/ProductDetail";
import ProductList from "./components/Property/ProductList";


// Import các dashboard theo vai trò
import OwnerDashboard from "./components/Dashboard/OwnerDashboard";
import TenantDashboard from "./components/Dashboard/TenantDashboard";
import ManagerDashboard from "./components/Dashboard/ManagerDashboard";


import { useState } from "react";
import { ConfigProvider, theme, Button, Card } from "antd";



import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [logo] = useState("/nike-lich-su-thiet-ke-logo-removebg-preview.png");

  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const role = localStorage.getItem("role");
  const renderDashboard = (Component, requiredRole) => {
    return role === requiredRole ? <Component /> : <Navigate to="/login" />;
  };
  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
            colorPrimary: isDarkMode ? "#E0282E" : "#1677FF",
            colorTextBase: isDarkMode ? "#ffffff" : "#000000",
            colorBgContainer: isDarkMode ? "#000000" : "#ffffff", 
            //Button
            Button: {
              colorBg: isDarkMode ? "#262626" : "#e6f7ff",
              colorBgHover: isDarkMode ? "#1890ff" : "#40a9ff",
              colorBorder: isDarkMode ? "#1890ff" : "#40a9ff",
              colorText: isDarkMode ? "#ffffff" : "#000000", 
            },
          },
      }}
    >
      <Button onClick={handleClick}>
        Change Theme to {isDarkMode ? "Light" : "Dark"}
      </Button>
      <Router>
      <AppHeader logo={logo} isDarkMode={isDarkMode} />

        <Routes>
      
          <Route path="/" element={<TenantDashboard />}>
            <Route path="/tanant/profile" element={<ProfilePage />} />
            <Route path="/tanant/property-list" element={<PropertyList />} />
            <Route path="/tanant/favorites" element={<Favorites />} />
            <Route path="/tanant/approval" element={<AwaitingApproval />} />
            <Route path="/tanant/approved" element={<ApprovedRentals />} />
          </Route>

          <Route path="/" element={<ManagerDashboard />}>
            <Route path="/properties" element={<ManagerDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/property-list" element={<PropertyList />} />
            <Route path="/admin/approval" element={<AwaitingApproval />} />
            <Route path="/admin/approved" element={<ApprovedRentals />} />
          </Route>

          <Route path="/" element={<OwnerDashboard />}>
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/owner/profile" element={<ProfilePage />} />
            <Route path="/owner/property-list" element={<PropertyList />} />
            <Route path="/owner/approval" element={<AwaitingApproval />} />
            <Route path="/owner/approved" element={<ApprovedRentals />} />
            <Route path="/owner/my-properties" element={<MyPropertyList />} />
            <Route path="/owner/my-product" element={<ProductList />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-rental" element={<AddRental />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/property-list" element={<PropertyList />} />

          {/* Các route cho các vai trò */}
          <Route
            path="/Owner"
            element={renderDashboard(OwnerDashboard, "Owner")}
          />
          <Route
            path="/Tenant"
            element={renderDashboard(TenantDashboard, "Tenant")}
          />
          <Route
            path="/Manager"
            element={renderDashboard(ManagerDashboard, "Manager")}
          />

          {/* Redirect về trang login nếu không có vai trò */}
          <Route
            path="*"
            element={<Navigate to={role ? `/${role}` : "/login"} />}
          />
        </Routes>
        <SocialLinks />
      </Router>
    </ConfigProvider>
  );
};

export default App;
