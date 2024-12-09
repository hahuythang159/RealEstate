import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Form, Input, Button, Spin, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setIsLoading(true);

    const templateParams = {
      userEmail: values.userEmail,
      message: values.message,
    };

    emailjs
      .send(
        'service_8vv1xpg', // Service ID
        'template_j63x1u1', // Template ID
        templateParams, // Dữ liệu gửi
        '3rShfNZBjrYJ1G4ye' // Public Key
      )
      .then(
        () => {
          message.success(intl.formatMessage({ id: 'sendingMessage' }));
          setIsLoading(false);
          form.resetFields();
        },
        () => {
          message.error(intl.formatMessage({ id: 'errorMessageContact' }));
          setIsLoading(false);
        }
      );
  };

  const onFinishFailed = () => {
    message.error(intl.formatMessage({ id: 'formError' }));
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#2196F3' }}>
        <SmileOutlined
          style={{ fontSize: '24px', color: '#2196F3', marginRight: '10px' }}
        />
        {intl.formatMessage({ id: 'supportRequest' })}
      </h2>
      <p style={{ textAlign: 'center', color: '#757575' }}>
        {intl.formatMessage({ id: 'descriptionContact' })}
      </p>
      <Form
        name="contact"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form} // Thêm form vào trong component Form
      >
        <Form.Item
          label={intl.formatMessage({ id: 'emailLabel' })}
          name="userEmail"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'emailRequired' }),
            },
            {
              type: 'email',
              message: intl.formatMessage({ id: 'emailInvalid' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'emailPlaceholder' })} />
        </Form.Item>

        <Form.Item
          name="message"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'messageRequired' }),
            },
          ]}
        >
          <Input.TextArea
            placeholder={intl.formatMessage({ id: 'messagePlaceholder' })}
            rows={6}
            style={{ resize: 'none' }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={isLoading}
            style={{ backgroundColor: '#2196F3', borderColor: '#2196F3' }}
          >
            {isLoading ? (
              <Spin size="small" />
            ) : (
              intl.formatMessage({ id: 'submitButtonContact' })
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactForm;
