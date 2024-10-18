import React from "react";
import { Layout, Input, Button, Space } from "antd";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom"; // Import hooks

const { Header } = Layout;
const { Search } = Input;

const AppHeader = ({ logo, onLogout, isDarkMode }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại
  const navigate = useNavigate(); // Để điều hướng sau khi logout

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Không hiển thị header nếu đang ở trang login hoặc register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const headerStyle = {
    backgroundColor: isDarkMode ? "#000" : "#fff",
    color: isDarkMode ? "#fff" : "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  };

  return (
    <Header style={headerStyle}>
      <div style={{ color: isDarkMode ? "#fff" : "#000", fontSize: "30px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
      </div>

      <Search
        placeholder="Search properties"
        enterButton={<SearchOutlined />}
        style={{ width: 300 }}
        onSearch={(value) => console.log(value)}
      />

      <Space>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ backgroundColor: isDarkMode ? "#1890ff" : "#f5222d" }}
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
