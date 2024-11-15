import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  HeartOutlined,
  UserOutlined,
  FileProtectOutlined,
  FileSyncOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useIntl } from 'react-intl'; // Sử dụng useIntl để lấy bản dịch

const { Sider, Content } = Layout;

const TenantDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl(); // Sử dụng useIntl để lấy bản dịch

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
        <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item
            key="1"
            icon={<HeartOutlined />}
            onClick={() => navigate('/tenant/favorites')}
          >
            {intl.formatMessage({ id: 'favorites_list' })} {/* Dùng bản dịch */}
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FileSyncOutlined />}
            onClick={() => navigate('/tenant/approval')}
          >
            {intl.formatMessage({ id: 'contract_list' })}
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FileProtectOutlined />}
            onClick={() => navigate('/tenant/approved')}
          >
            {intl.formatMessage({ id: 'approved_contracts' })}
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<UserOutlined />}
            onClick={() => navigate('/tenant/profile')}
          >
            {intl.formatMessage({ id: 'my_profile' })}
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

export default TenantDashboard;
