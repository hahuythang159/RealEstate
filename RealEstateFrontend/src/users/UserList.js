import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Select } from 'antd';

const { Option } = Select;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();

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
            message.error(error.message);
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
                message.success('Người dùng đã được chỉnh sửa thành công!');
                fetchUsers();
            } else {
                const errorText = await response.text();
                console.error('Lỗi từ server:', errorText);
                message.error('Có lỗi xảy ra khi chỉnh sửa người dùng!');
            }
            form.resetFields();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Lỗi khi chỉnh sửa thông tin!');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentUser(null);
    };

    const handleDelete = (userId) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                    });
                    message.success('Người dùng đã được xóa thành công!');
                    fetchUsers();
                } catch (error) {
                    message.error('Lỗi khi xóa người dùng!');
                }
            },
        });
    };

    return (
        <>
            <Table dataSource={users} rowKey="id" style={{ marginTop: '20px' }}>
                <Table.Column title="Tên Người Dùng" dataIndex="userName" key="userName" />
                <Table.Column title="Email" dataIndex="email" key="email" />
                <Table.Column title="Số Điện Thoại" dataIndex="phoneNumber" key="phoneNumber" />
                <Table.Column title="Vai Trò" dataIndex="role" key="role" />
                <Table.Column title="Trạng Thái" key="isActive" render={(text, record) => (
                    <span>{record.isActive ? 'Hoạt Động' : 'Vô hiệu hoá'}</span>
                )} />
                <Table.Column
                    title="Hành Động"
                    key="action"
                    render={(text, record) => (
                        <>
                            <Button type="link" onClick={() => handleEdit(record)}>Chỉnh Sửa</Button>
                            <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                        </>
                    )}
                />
            </Table>

            <Modal title="Chỉnh Sửa Người Dùng" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="userName" label="Tên Người Dùng">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số Điện Thoại">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="role" label="Vai Trò">
                        <Select placeholder="Chọn vai trò" style={{ width: '100%' }}>
                            <Option value="Manager">Quản lý</Option>
                            <Option value="Tenant">Người thuê</Option>
                            <Option value="Owner">Chủ bất động sản</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="isActive" label="Trạng Thái Hoạt Động" valuePropName="checked">
                        <Switch checkedChildren="Hoạt Động" unCheckedChildren="Vô hiệu hoá" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserList;
