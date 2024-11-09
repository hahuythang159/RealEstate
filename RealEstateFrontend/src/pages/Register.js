import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Spin } from 'antd';
import './RegisterForm.css'; // Đảm bảo file CSS của bạn vẫn được sử dụng

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])\d{8}/;
    return phoneRegex.test(phoneNumber);
  };

  const handleRegister = async (values) => {
    setLoading(true);

    const { userName, password, confirmPassword, email, phoneNumber, role } = values;

    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          password,
          confirmPassword,
          email,
          phoneNumber,
          role,
          isTwoFactorEnabled: false,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Đăng ký thất bại.');
        message.error(errorData.message || 'Đăng ký thất bại.');
      } else {
        setError('');
        message.success('Đăng ký thành công');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng Ký</h2>
      <Form
        name="register"
        onFinish={handleRegister}
        initialValues={{ role: 'Tenant' }}
        layout="vertical"
      >
        <Form.Item
          label="Tên người dùng"
          name="userName"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
        >
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            {
              validator: (_, value) =>
                isValidPhoneNumber(value) ? Promise.resolve() : Promise.reject('Số điện thoại không hợp lệ'),
            },
          ]}
        >
          <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Form.Item>

        <Form.Item label="Vai trò" name="role">
          <Select value={role} onChange={(value) => setRole(value)}>
            <Select.Option value="Owner">Chủ bất động sản</Select.Option>
            <Select.Option value="Tenant">Người thuê</Select.Option>
            <Select.Option value="Manager">Quản lý</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </Form.Item>

        {error && <p className="error">{error}</p>}
      </Form>
    </div>
  );
};

export default RegisterForm;
