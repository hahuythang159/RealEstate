import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Select,
  Avatar,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const { Option } = Select;

const ProfilePage = () => {
  const { formatMessage } = useIntl();
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (userId) {
      fetchCurrentUser(userId);
    }
  }, [userId]);

  const fetchCurrentUser = async () => {
    if (!userId) {
      message.error(formatMessage({ id: 'fetchError' }));
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error(formatMessage({ id: 'loadError' }));
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEdit = () => {
    setIsModalVisible(true);
    form.setFieldsValue({ ...currentUser });
  };

  const updateUser = async (values) => {
    try {
      const updatedUser = {
        ...values,
        id: currentUser.id,
        avatar: currentUser.avatar,
      };

      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        message.success(formatMessage({ id: 'updateSuccess' }));
        fetchCurrentUser();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || formatMessage({ id: 'updateError' }));
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsModalVisible(false);
    }
  };

  const uploadAvatar = async (file) => {
    if (!userId) {
      message.error(formatMessage({ id: 'userNotFound' }));
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`/api/users/upload-avatar/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          ...currentUser,
          avatarUrl: data.avatarUrl,
        });
        message.success(formatMessage({ id: 'avatarUploadSuccess' }));
      } else {
        throw new Error(formatMessage({ id: 'avatarUploadFailed' }));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(values);
    } catch (error) {
      message.error(formatMessage({ id: 'editError' }));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {currentUser && (
        <div style={{ marginTop: '20px' }}>
          <h2>{formatMessage({ id: 'userProfile' })}</h2>
          <Avatar
            src={
              currentUser.avatarUrl
                ? currentUser.avatarUrl
                : '/default-avatar.png'
            }
            size={100}
          />

          <p>
            <strong>{formatMessage({ id: 'userName' })}:</strong>{' '}
            {currentUser.userName}
          </p>
          <p>
            <strong>{formatMessage({ id: 'email' })}:</strong>{' '}
            {currentUser.email}
          </p>
          <p>
            <strong>{formatMessage({ id: 'phoneNumber' })}:</strong>{' '}
            {currentUser.phoneNumber}
          </p>
          <p>
            <strong>{formatMessage({ id: 'role' })}:</strong> {currentUser.role}
          </p>
          <p>
            <strong>{formatMessage({ id: 'status' })}:</strong>{' '}
            {currentUser.isActive
              ? formatMessage({ id: 'active' })
              : formatMessage({ id: 'inactive' })}
          </p>
          {userRole === 'Owner' && (
            <>
              <p>
                <strong>{formatMessage({ id: 'ownerIntroduction' })}:</strong>{' '}
                {currentUser.ownerIntroduction}
              </p>
              <p>
                <strong>{formatMessage({ id: 'ownerAdditionalInfo' })}:</strong>{' '}
                {currentUser.ownerAdditionalInfo}
              </p>
            </>
          )}
          <Upload
            beforeUpload={async (file) => {
              await uploadAvatar(file);
              return false;
            }}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              {formatMessage({ id: 'uploadAvatar' })}
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleEdit}
            style={{ marginTop: '5px' }}
          >
            {formatMessage({ id: 'edit' })}
          </Button>
        </div>
      )}

      <Modal
        title={formatMessage({ id: 'editProfile' })}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { marginRight: 8 } }}
        cancelButtonProps={{ style: { marginLeft: 8, marginBottom: 10 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label={formatMessage({ id: 'userName' })}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={formatMessage({ id: 'email' })}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={formatMessage({ id: 'phoneNumber' })}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label={formatMessage({ id: 'role' })}>
            <Select placeholder={formatMessage({ id: 'role' })} disabled>
              <Option value="Manager">
                {formatMessage({ id: 'roleManager' })}
              </Option>
              <Option value="Tenant">
                {formatMessage({ id: 'roleTenant' })}
              </Option>
              <Option value="Owner">
                {formatMessage({ id: 'roleOwner' })}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isActive"
            label={formatMessage({ id: 'status' })}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={formatMessage({ id: 'active' })}
              unCheckedChildren={formatMessage({ id: 'inactive' })}
            />
          </Form.Item>
          {userRole === 'Owner' && (
            <>
              <Form.Item
                name="ownerIntroduction"
                label={formatMessage({ id: 'ownerIntroduction' })}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="ownerAdditionalInfo"
                label={formatMessage({ id: 'ownerAdditionalInfo' })}
              >
                <Input.TextArea />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ProfilePage;
