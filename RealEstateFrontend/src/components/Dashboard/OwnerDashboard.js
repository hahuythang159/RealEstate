import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FileProtectOutlined,
  FileSyncOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const OwnerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        className="site-layout-background"
        collapsed={collapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="logo" />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item
            key="1"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/owner/add-property')}
          >
            Thêm bất động sản
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<HomeOutlined />}
            onClick={() => navigate('/owner/my-product')}
          >
            Quản lý bất động sản
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FileSyncOutlined />}
            onClick={() => navigate('/owner/approval')}
          >
            Danh sách hợp đồng
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<FileProtectOutlined />}
            onClick={() => navigate('/owner/approved')}
          >
            Hợp đồng đã duyệt
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<UserOutlined />}
            onClick={() => navigate('/owner/profile')}
          >
            Hồ sơ của tôi
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default OwnerDashboard;
