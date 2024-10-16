import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import './Login.css';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values), // Sử dụng giá trị từ form
            });

            if (!response.ok) {
                const errorData = await response.json();
                message.error(errorData.message); // Hiển thị thông báo lỗi
            } else {
                const data = await response.json();
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role);
                localStorage.setItem('token', data.token); // Lưu JWT token


                message.success('Đăng nhập thành công!');

                // Điều hướng đến dashboard tương ứng
                switch (data.role) {
                    case 'Owner':
                        navigate('/owner/property-list');
                        break;
                    case 'Tenant':
                        navigate('/tanant/property-list');
                        break;
                    case 'Manager':
                        navigate('/admin/property-list');
                        break;
                    default:
                        break;
                }
                window.location.reload();
            }
        } catch (err) {
            message.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Title level={2}>Đăng Nhập</Title>
            <Form
                name="login-form"
                onFinish={handleLogin}
                layout="vertical"
                style={{ maxWidth: 400, margin: '0 auto' }} // Tùy chỉnh chiều rộng form
            >
                <Form.Item
                    name="email"
                    label="Nhập email người dùng:"
                    rules={[{ required: true, message: 'Vui lòng nhập email người dùng!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu:"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
