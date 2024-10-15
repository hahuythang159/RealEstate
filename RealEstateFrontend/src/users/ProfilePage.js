import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Switch, message,Select ,Avatar,Upload} from 'antd';
import { UploadOutlined,UserOutlined } from '@ant-design/icons';


const { Option } = Select;

const ProfilePage  = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
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
            setAvatarUrl(data.avatar);  // Gán avatar URL vào state
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
                body: JSON.stringify({ ...values, Id: currentUser.id, Avatar: avatarUrl }),
            });
    
            if (response.ok) {
                message.success('Thông tin cá nhân đã được chỉnh sửa thành công!');
                fetchCurrentUser(); // Cập nhật lại thông tin sau khi chỉnh sửa
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Có lỗi xảy ra khi chỉnh sửa thông tin cá nhân!');
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setIsModalVisible(false);
        }
    };
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await updateUser(values);
        } catch (error) {
            message.error('Lỗi khi chỉnh sửa thông tin!');
        }
    };
    
    
    const handleAvatarUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch('/api/users/upload-avatar', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Lấy nội dung phản hồi lỗi từ server
                throw new Error(errorText || 'Failed to upload avatar');
            }
    
            const data = await response.json();
            setAvatarUrl(data.url);  // Cập nhật URL avatar mới
            message.success('Avatar đã được tải lên!');
            onSuccess('ok');  // Gọi thành công từ antd để hoàn thành quá trình tải lên
        } catch (error) {
            console.error('Error:', error.message); // Ghi lỗi chi tiết vào console
            message.error(`Lỗi khi tải lên avatar: ${error.message}`); // Hiển thị lỗi chi tiết từ phản hồi của server
            onError(error);  // Gọi lỗi từ antd để thông báo việc tải lên thất bại
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
                    <Avatar size={128} icon={<UserOutlined />} />
                    <p><strong>Tên Người Dùng:</strong> {currentUser.userName}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Số Điện Thoại:</strong> {currentUser.phoneNumber}</p>
                    <p><strong>Vai Trò:</strong> {currentUser.role}</p>
                    <p><strong>Trạng Thái:</strong> {currentUser.isActive ? 'Hoạt Động' : 'Vô hiệu hoá'}</p>

                    <Button type="primary" onClick={handleEdit}>Chỉnh Sửa</Button>
                </div>
            )}

            <Modal title="Chỉnh Sửa Thông Tin Cá Nhân" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                <Form.Item label="Avatar">
                        <Avatar src={avatarUrl} size={100} />
                        <Upload
                            showUploadList={false}
                            customRequest={handleAvatarUpload}  // Thay vì beforeUpload
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Tải lên Avatar</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="userName" label="Tên Người Dùng">
                        <Input  />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số Điện Thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Vai Trò" >
                                <Select placeholder="Chọn vai trò" disabled={true}>
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

export default ProfilePage ;
