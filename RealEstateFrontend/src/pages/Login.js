import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FormattedMessage, useIntl } from 'react-intl';
import '../styles/Login.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(intl.formatMessage({ id: 'login.error' }));
      } else {
        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data));

        message.success(intl.formatMessage({ id: 'login.success' }));

        switch (data.role) {
          case 'Owner':
            navigate('/');
            break;
          case 'Tenant':
            navigate('/');
            break;
          case 'Manager':
            navigate('/');
            break;
          default:
            break;
        }
        window.location.reload();
      }
    } catch (err) {
      message.error(intl.formatMessage({ id: 'login.error' }));
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLoginSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        message.error(errorData.message || 'Google login failed.');
      } else {
        const data = await res.json();
        if (data.isNewUser) {
          message.info('Please complete your registration.');
          navigate('/register', { state: { email: data.email } });
        } else {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('role', data.role);
          localStorage.setItem('token', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data));

          message.success('Login successful.');

          // Redirecting based on the role
          switch (data.role) {
            case 'Owner':
            case 'Tenant':
            case 'Manager':
              navigate('/');
              break;
            default:
              navigate('/');
              break;
          }
          window.location.reload();
        }
      }
    } catch (err) {
      message.error('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    message.error('Google login failed. Please try again.');
  };

  return (
    <div className="login-container">
      <div className="form-container-login">
        {' '}
        {/* Lớp chứa form đăng nhập */}
        <Title level={3}>
          <FormattedMessage id="login.title" defaultMessage="Welcome Back" />
        </Title>
        <Form.Item>
          <GoogleOAuthProvider clientId="942288651749-7o3kthjiu74glonrhk53ejikgr26lj0m.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
            />
          </GoogleOAuthProvider>
        </Form.Item>
        <div className="or-login-with">
          <span>
            <FormattedMessage
              id="login.orLoginWith"
              defaultMessage="or Login with"
            />
          </span>
        </div>
        <Form
          name="login-form"
          onFinish={handleLogin}
          layout="vertical"
          style={{ maxWidth: 400, margin: '0 auto' }}
        >
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'login.emailLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.emailRequired' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={intl.formatMessage({ id: 'login.passwordLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.passwordRequired' }),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {loading
                ? intl.formatMessage({ id: 'login.loading' })
                : intl.formatMessage({ id: 'login.button' })}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => navigate('/register')} block>
              <FormattedMessage
                id="login.registerButton"
                defaultMessage="Đăng ký tài khoản"
              />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
