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

const { Option } = Select;

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      message.error('Không thể lấy ID người dùng.');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Không thể tải thông tin cá nhân');
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
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, id: currentUser.id }),
      });

      if (response.ok) {
        message.success('Thông tin cá nhân đã được chỉnh sửa thành công!');
        fetchCurrentUser();
      } else {
        const errorText = await response.text();
        throw new Error(
          errorText || 'Có lỗi xảy ra khi chỉnh sửa thông tin cá nhân!'
        );
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleUploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success('Avatar đã được cập nhật!');
        fetchCurrentUser();
      } else {
        const errorText = await response.text();
        message.error(`Có lỗi khi tải lên avatar: ${errorText}`);
      }
    } catch (error) {
      message.error(`Có lỗi khi tải lên avatar: ${error.message}`);
    }

    return false;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(values);
    } catch (error) {
      message.error('Lỗi khi chỉnh sửa thông tin!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {currentUser && (
        <div style={{ marginTop: '20px' }}>
          <h2>Thông Tin Cá Nhân</h2>
          <Avatar src={currentUser.avatar} size={100} />
          <p>
            <strong>Tên Người Dùng:</strong> {currentUser.userName}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Số Điện Thoại:</strong> {currentUser.phoneNumber}
          </p>
          <p>
            <strong>Vai Trò:</strong> {currentUser.role}
          </p>
          <p>
            <strong>Trạng Thái:</strong>{' '}
            {currentUser.isActive ? 'Hoạt Động' : 'Vô hiệu hoá'}
          </p>
          <Upload beforeUpload={handleUploadAvatar} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Tải lên Avatar</Button>
          </Upload>
          <Button type="primary" onClick={handleEdit}>
            Chỉnh Sửa
          </Button>
        </div>
      )}

      <Modal
        title="Chỉnh Sửa Thông Tin Cá Nhân"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="Tên Người Dùng">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số Điện Thoại">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai Trò">
            <Select placeholder="Chọn vai trò" disabled>
              <Option value="Manager">Quản lý</Option>
              <Option value="Tenant">Người thuê</Option>
              <Option value="Owner">Chủ bất động sản</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Trạng Thái Hoạt Động"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Hoạt Động"
              unCheckedChildren="Vô hiệu hoá"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfilePage;
