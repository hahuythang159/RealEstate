import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined,FileProtectOutlined,FileSyncOutlined ,DashboardOutlined} from '@ant-design/icons';
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


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/owner/property-list')}>
                        Bảng điều khiển
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DashboardOutlined />} onClick={() => navigate('/add-property')}>
                        Thêm bất động sản
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate('/owner/my-product')}>
                        Quản lý bất động sản
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FileSyncOutlined/>} onClick={()=>navigate('/owner/approval')}>
                        Danh sách hợp đồng 
                    </Menu.Item>
                    <Menu.Item key="5" icon={<FileProtectOutlined/>} onClick={()=>navigate('/owner/approved')}>
                        Hợp đồng đã duyệt 
                    </Menu.Item>
                    <Menu.Item key="6" icon={<UserOutlined />} onClick={() => navigate('/owner/profile')}>
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
