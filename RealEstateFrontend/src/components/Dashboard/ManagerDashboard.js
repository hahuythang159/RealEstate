import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useIntl } from 'react-intl'; // Sử dụng useIntl để lấy bản dịch

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl(); // Dùng useIntl để lấy các bản dịch

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
            icon={<UserOutlined />}
            onClick={() => navigate('/admin/users')}
          >
            {intl.formatMessage({ id: 'manage_users' })}{' '}
            {/* Lấy bản dịch cho "Quản lý người dùng" */}
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FileProtectOutlined />}
            onClick={() => navigate('/admin/approved')}
          >
            {intl.formatMessage({ id: 'contract_list' })}{' '}
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FileProtectOutlined />}
            onClick={() => navigate('/admin/canceled-rentals')}
          >
            {intl.formatMessage({ id: 'canceled_contracts' })}{' '}
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

export default AdminDashboard;
