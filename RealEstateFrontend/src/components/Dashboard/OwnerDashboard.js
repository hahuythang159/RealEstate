import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const OwnerDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login'); // Nếu không có token, điều hướng về trang đăng nhập
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/owner/property-list')}>
                        Bảng điều khiển
                    </Menu.Item>
                    <Menu.Item key="2" icon={<HomeOutlined />} onClick={() => navigate('/add-property')}>
                        Quản lý bất động sản
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate('/owner/profile')}>
                        Hồ sơ của tôi
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content>
                    <Outlet /> {/* Phần này sẽ thay đổi nội dung dựa trên route */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default OwnerDashboard;
