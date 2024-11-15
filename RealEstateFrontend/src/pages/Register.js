import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import './RegisterForm.css';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      console.log('Email đã được cập nhật:', location.state.email);
    }
  }, [location.state]);

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])\d{8}/;
    return phoneRegex.test(phoneNumber);
  };

  const handleRegister = async (values) => {
    setLoading(true);

    const emailToSend = email || values.email;
    const { userName, password, confirmPassword, phoneNumber, role } = values;
    if (password !== confirmPassword) {
      setError(intl.formatMessage({ id: 'error.passwordMismatch' }));
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
          email: emailToSend,
          phoneNumber,
          role,
          isTwoFactorEnabled: false,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message ||
            intl.formatMessage({ id: 'error.registerFailed' })
        );
        message.error(
          errorData.message ||
            intl.formatMessage({ id: 'error.registerFailed' })
        );
      } else {
        setError('');
        message.success(intl.formatMessage({ id: 'success.register' }));
        navigate('/');
      }
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.serverError' }));
      message.error(intl.formatMessage({ id: 'error.serverError' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>{intl.formatMessage({ id: 'register.title' })}</h2>
      <Form
        name="register"
        onFinish={handleRegister}
        initialValues={{ email: email, role: 'Tenant' }}
        layout="vertical"
      >
        <Form.Item
          label={intl.formatMessage({ id: 'register.userNameLabel' })}
          name="userName"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'register.userNameError' }),
            },
          ]}
        >
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'register.passwordLabel' })}
          name="password"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'register.passwordError' }),
            },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'register.confirmPasswordLabel' })}
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'register.confirmPasswordError',
              }),
            },
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'register.emailLabel' })}
          name="email"
          rules={[
            {
              required: !location.state?.email,
              type: 'email',
              message: intl.formatMessage({ id: 'register.emailError' }),
            },
          ]}
        >
          {location.state?.email ? (
            // Nếu có email từ state, hiển thị email và không cho phép chỉnh sửa
            <Input value={email} disabled />
          ) : (
            // Nếu không có email, cho phép người dùng nhập
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          )}
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'register.phoneLabel' })}
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'register.phoneError' }),
            },
            {
              validator: (_, value) =>
                isValidPhoneNumber(value)
                  ? Promise.resolve()
                  : Promise.reject(
                      intl.formatMessage({ id: 'register.phoneInvalid' })
                    ),
            },
          ]}
        >
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'register.roleLabel' })}
          name="role"
        >
          <Select value={role} onChange={(value) => setRole(value)}>
            <Select.Option value="Owner">
              {intl.formatMessage({ id: 'register.roleOwner' })}
            </Select.Option>
            <Select.Option value="Tenant">
              {intl.formatMessage({ id: 'register.roleTenant' })}
            </Select.Option>
            <Select.Option value="Manager">
              {intl.formatMessage({ id: 'register.roleManager' })}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading
              ? intl.formatMessage({ id: 'register.loading' })
              : intl.formatMessage({ id: 'register.submit' })}
          </Button>
        </Form.Item>

        {error && <p className="error">{error}</p>}
      </Form>
    </div>
  );
};

export default RegisterForm;
