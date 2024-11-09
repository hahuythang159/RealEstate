import React from 'react';
import { Layout, Input, Button, Space } from 'antd';
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

const AppHeader = ({ logo, onLogout, isDarkMode }) => {
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
      navigate('/tanant/approval');
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
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '3px',
          background: `linear-gradient(90deg, ${isDarkMode ? '#e0282e' : '#1677FF'} 0%, #ffffff 100%)`,
          zIndex: -1,
        }}
      ></div>

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

      <Search
        placeholder="Search properties"
        enterButton={<SearchOutlined />}
        style={{
          width: 300,
          borderRadius: '25px',
          transition: 'all 0.3s ease',
        }}
        onSearch={(value) => console.log(value)}
        onFocus={(e) =>
          (e.target.style.borderColor = isDarkMode ? '#E0282E' : '#1677FF')
        }
        onBlur={(e) =>
          (e.target.style.borderColor = isDarkMode ? '#888' : '#ccc')
        }
      />

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
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = isDarkMode
              ? '#1890ff'
              : '#40a9ff')
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = isDarkMode
              ? '#262626'
              : '#f0f2f5')
          }
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
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = isDarkMode
              ? '#40a9ff'
              : '#ff4d4f')
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = isDarkMode
              ? '#1890ff'
              : '#f5222d')
          }
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
