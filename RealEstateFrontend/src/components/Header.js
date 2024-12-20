import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Badge, Popover, List } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  LineChartOutlined,
  ContactsOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

const { Header } = Layout;

const AppHeader = ({ logo, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(5);

  // Kết nối SignalR để nhận thông báo
  useEffect(() => {
    if (role === 'Owner') {
      const connection = new HubConnectionBuilder().withUrl('/chathub').build();

      connection
        .start()
        .then(() => {
          console.log('SignalR connected');

          connection.on('ReceiveNotification', (message) => {
            setNotifications((prevNotifications) => [
              message,
              ...prevNotifications,
            ]);
            setUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
          });
        })
        .catch((error) => console.error('SignalR connection error:', error));

      return () => {
        connection.stop();
      };
    }
  }, [role]);

  useEffect(() => {
    if (role === 'Owner') {
      axios
        .get(
          `/api/notifications?page=${currentPage}&limit=${notificationsPerPage}`
        )
        .then((response) => {
          const sortedNotifications = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sortedNotifications);
          setUnreadCount(
            sortedNotifications.filter((notification) => !notification.isRead)
              .length
          );
        })
        .catch((error) => {
          console.error('Error fetching notifications!', error);
        });
    }
  }, [currentPage, role]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      axios
        .put(`/api/notifications/${notification.id}`, { isRead: true })
        .then(() => {
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          setUnreadCount((prevUnreadCount) => Math.max(prevUnreadCount - 1, 0));
        })
        .catch((error) => {
          console.error('Error marking notification as read', error);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
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

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

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
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <Header style={headerStyle}>
      <div
        style={{
          color: isDarkMode ? '#fff' : '#000',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
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
          icon={<ContactsOutlined />}
          onClick={() => navigate('/contact-us')}
          style={{
            backgroundColor: isDarkMode ? '#262626' : '#f0f2f5',
            color: isDarkMode ? '#fff' : '#000',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
          }}
        >
          Support
        </Button>
        <Button
          icon={<LineChartOutlined />}
          onClick={() => navigate('/chart')}
          style={{
            backgroundColor: isDarkMode ? '#262626' : '#f0f2f5',
            color: isDarkMode ? '#fff' : '#000',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
          }}
        >
          Price Chart
        </Button>
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

        <Badge count={unreadCount} showZero>
          <Popover
            content={
              <>
                <List
                  dataSource={notifications}
                  renderItem={(notification) => (
                    <List.Item
                      onClick={() => handleNotificationClick(notification)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: notification.isRead
                          ? 'transparent'
                          : '#f7f7f7',
                        padding: '10px',
                      }}
                    >
                      <p>{notification.message}</p>
                      <p style={{ fontSize: '12px', color: 'gray' }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </List.Item>
                  )}
                />
                <Button
                  style={{ width: '100%' }}
                  onClick={handleLoadMore}
                  disabled={notifications.length === 0}
                >
                  Load More
                </Button>
              </>
            }
            title="Notifications"
            trigger="click"
            placement="bottomRight"
          >
            <Button
              icon={<BellOutlined />}
              type="text"
              style={{
                backgroundColor: isDarkMode ? '#262626' : '#f0f2f5',
                color: isDarkMode ? '#fff' : '#000',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
            />
          </Popover>
        </Badge>

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
