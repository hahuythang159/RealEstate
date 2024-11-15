import React from 'react';
import { Layout, Button, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = ({ logo, isDarkMode}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const headerStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    position: 'relative',
    boxShadow: isDarkMode
      ? '0 2px 10px rgba(255, 255, 255, 0.1)'
      : '0 2px 10px rgba(0, 0, 0, 0.1)', 
    transition: 'all 0.3s ease',
  };

  const handleRoleRedirect = () => {
    if (role === 'Owner') {
      navigate('/owner/profile');
    } else if (role === 'Tenant') {
      navigate('/tenant/approval');
    } else if (role === 'Manager') {
      navigate('/admin/users');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Header style={headerStyle}>
      <div
        style={{
          color: isDarkMode ? '#fff' : '#000',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: '100px',
            marginRight: '100px',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      
      <Space>
        <Button
          icon={<UserOutlined />}
          onClick={handleRoleRedirect}
          style={{
            backgroundColor: isDarkMode ? '#262626' : '#f0f2f5',
            color: isDarkMode ? '#fff' : '#000',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
          }}
        >
          {role === 'Owner' && 'Owner Dashboard'}
          {role === 'Tenant' && 'Tenant Dashboard'}
          {role === 'Manager' && 'Manager Dashboard'}
        </Button>

        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            backgroundColor: isDarkMode ? '#1890ff' : '#f5222d',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
          }}
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
