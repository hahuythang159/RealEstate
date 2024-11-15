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
import { useIntl } from 'react-intl';

const { Sider, Content } = Layout;

const OwnerDashboard = () => {
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
    <Layout style={{ minHeight: '100vh', overflow:'hidden' }}>
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
            {intl.formatMessage({ id: 'add_property' })}
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<HomeOutlined />}
            onClick={() => navigate('/owner/my-product')}
          >
            {intl.formatMessage({ id: 'manage_property' })}
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FileSyncOutlined />}
            onClick={() => navigate('/owner/approval')}
          >
            {intl.formatMessage({ id: 'contract_list' })}
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<FileProtectOutlined />}
            onClick={() => navigate('/owner/approved')}
          >
            {intl.formatMessage({ id: 'approved_contracts' })}
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<UserOutlined />}
            onClick={() => navigate('/owner/profile')}
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

export default OwnerDashboard;
