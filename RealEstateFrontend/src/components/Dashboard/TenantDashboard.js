import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, HeartOutlined, UserOutlined,FileProtectOutlined,FileSyncOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const TenantDashboard = () => {
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

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Nếu không có token, điều hướng về trang login
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);
    
    console.log("Dữ liệu localStorage:", localStorage);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} className="site-layout-background"collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo" />
                <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
                    <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/tanant/property-list')}>
                        Trang chủ
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate('/tanant/profile')}>
                        Hồ sơ của tôi
                    </Menu.Item>
                    <Menu.Item key="3" icon={<HeartOutlined/>} onClick={()=>navigate('/tanant/favorites')}>
                        Danh sách yêu thích
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FileSyncOutlined/>} onClick={()=>navigate('/tanant/approval')}>
                        Danh sách hợp đồng
                    </Menu.Item>
                    <Menu.Item key="5" icon={<FileProtectOutlined/>} onClick={()=>navigate('/tanant/approved')}>
                        Hợp đồng đã duyệt
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
