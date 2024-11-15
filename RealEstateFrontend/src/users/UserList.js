import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Select,
} from 'antd';
import { useIntl } from 'react-intl';

const { Option } = Select;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const intl = useIntl();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Error fetching users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'error_fetching_users' }));
    }
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    form.setFieldsValue({ ...user });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, Id: currentUser.id }),
      });
      if (response.ok) {
        message.success(intl.formatMessage({ id: 'user_edited_successfully' }));
        fetchUsers();
      } else {
        const errorText = await response.text();
        console.error('Lỗi từ server:', errorText);
        message.error(intl.formatMessage({ id: 'error_editing_user' }));
      }
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'error_editing_user' }));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
  };

  return (
    <>
      <Table dataSource={users} rowKey="id" style={{ marginTop: '20px' }}>
        <Table.Column
          title={intl.formatMessage({ id: 'user_name' })}
          dataIndex="userName"
          key="userName"
        />
        <Table.Column title={intl.formatMessage({ id: 'email' })} dataIndex="email" key="email" />
        <Table.Column
          title={intl.formatMessage({ id: 'phone_number' })}
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Table.Column title={intl.formatMessage({ id: 'role' })} dataIndex="role" key="role" />
        <Table.Column
          title={intl.formatMessage({ id: 'active_status' })}
          key="isActive"
          render={(text, record) => (
            <span>{record.isActive ? 'Hoạt Động' : 'Vô hiệu hoá'}</span>
          )}
        />
        <Table.Column
          title={intl.formatMessage({ id: 'actions' })}
          key="action"
          render={(text, record) => (
            <Button type="link" onClick={() => handleEdit(record)}>
              {intl.formatMessage({ id: 'edit' })}
            </Button>
          )}
        />
      </Table>

      <Modal
        title={intl.formatMessage({ id: 'edit_user' })}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label={intl.formatMessage({ id: 'user_name' })}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label={intl.formatMessage({ id: 'email' })}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="phoneNumber" label={intl.formatMessage({ id: 'phone_number' })}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label={intl.formatMessage({ id: 'role' })}>
            <Select placeholder={intl.formatMessage({ id: 'select_role' })} style={{ width: '100%' }}>
              <Option value="Manager">Quản lý</Option>
              <Option value="Tenant">Người thuê</Option>
              <Option value="Owner">Chủ bất động sản</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isActive"
            label={intl.formatMessage({ id: 'active_status' })}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={intl.formatMessage({ id: 'active' })}
              unCheckedChildren={intl.formatMessage({ id: 'inactive' })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
