import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
  Typography,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import '../styles/RegisterForm.css';

const { Title } = Typography;

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
    }
  }, [location.state]);

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])\d{8}/;
    return phoneRegex.test(phoneNumber);
  };

  const handleRegister = async (values) => {
    setLoading(true);
    const { userName, password, confirmPassword, phoneNumber, role } = values;
    const emailToSend = email || values.email;
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
      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error Data:', errorData);
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
        navigate('/login');
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
      <div className="form-container-register">
        <Title level={3}>
          <FormattedMessage id="register.title" defaultMessage="Register" />
        </Title>
        <Form
          name="register"
          onFinish={handleRegister}
          initialValues={{ email: email, role: 'Tenant' }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({ id: 'register.userNameLabel' })}
                name="userName"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'register.userNameError',
                    }),
                  },
                ]}
              >
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

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

          <Row gutter={16}>
            <Col span={12}>
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
                  <Input value={email} disabled />
                ) : (
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
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
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading
                ? intl.formatMessage({ id: 'register.loading' })
                : intl.formatMessage({ id: 'register.submit' })}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="link"
              onClick={() => navigate('/login')}
              style={{ marginTop: '10px' }}
            >
              {intl.formatMessage({ id: 'register.alreadyHaveAccount' })}
            </Button>
          </Form.Item>

          {error && <p className="error">{error}</p>}
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
