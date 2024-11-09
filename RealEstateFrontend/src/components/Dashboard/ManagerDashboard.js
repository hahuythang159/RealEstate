import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ApartmentOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Handle hover event
  const handleMouseEnter = () => {
    setCollapsed(false); // Mở menu khi hover
  };

  const handleMouseLeave = () => {
    setCollapsed(true); // Thu gọn menu khi không hover
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        className="site-layout-background"
        collapsed={collapsed}
        onMouseEnter={handleMouseEnter} // Khi hover vào sidebar, mở rộng
        onMouseLeave={handleMouseLeave} // Khi rời khỏi sidebar, thu gọn
      >
        <div className="logo" />
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/admin/users')}>
            Quản lý người dùng
          </Menu.Item>
          <Menu.Item key="2" icon={<ApartmentOutlined />} onClick={() => navigate('/admin/property-list')}>
            Quản lý tài sản
          </Menu.Item>
          <Menu.Item key="3" icon={<FileProtectOutlined />} onClick={() => navigate('/admin/approved')}>
            Danh sách hợp đồng
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
