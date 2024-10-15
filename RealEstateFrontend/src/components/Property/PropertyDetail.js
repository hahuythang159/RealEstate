import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card,Descriptions, Button, Form, Input, message,Select ,List } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';  // Import locale Vietnamese


dayjs.extend(relativeTime);  // Kích hoạt plugin relativeTime
dayjs.locale('vi'); 

const { Option } = Select;
const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const userRole=localStorage.getItem('role');
    const [ward, setWard] = useState(null);
    const [district, setDistrict] = useState(null);
    const [province, setProvince] = useState(null);
    const userId = localStorage.getItem('userId');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');




    const fetchProperty = async () => {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
        form.setFieldsValue(data);
    };
    const fetchComments = async () => {
        const response = await fetch(`/api/comments/${id}`);
        const data = await response.json();
        setComments(data);
    };

    useEffect(() => {
        fetchProperty();
        fetchComments();
    }, [id, form]);


    useEffect(() => {
        if (property) {
            // Gọi API để lấy tên của Province dựa trên ProvinceId
            fetch(`https://provinces.open-api.vn/api/p/${property.provinceId}`)
                .then(response => response.json())
                .then(data => setProvince(data.name))
                .catch(error => console.error('Error fetching province:', error));

            // Gọi API để lấy tên của District dựa trên DistrictId
            fetch(`https://provinces.open-api.vn/api/d/${property.districtId}`)
                .then(response => response.json())
                .then(data => setDistrict(data.name))
                .catch(error => console.error('Error fetching district:', error));

            // Gọi API để lấy tên của Ward dựa trên WardId
            fetch(`https://provinces.open-api.vn/api/w/${property.wardId}`)
                .then(response => response.json())
                .then(data => setWard(data.name))
                .catch(error => console.error('Error fetching ward:', error));
        }
    }, [property]);

    const handleDelete = async () => {
        if(userRole==='Owner'){
            await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            message.success('Xoá thành công!');
            navigate('/Owner');
        }
        else{
            message.error('Bạn không có quyền xóa bất động sản này.');

        }
    };

    const handleUpdate = async () => {
        if (userRole === 'Owner') {
            try {
                // Xác thực các trường của form
                await form.validateFields();
                const values = form.getFieldsValue();
                const updatedData = {
                    id: id,
                    title:values.title,
                    description: values.description,
                    address:values.address,
                    price: values.price,
                    ownerId: values.ownerId, 
                    provinceId: values.provinceId, 
                    districtId: values.districtId, 
                    wardId: values.wardId,
                    imageUrl: values.imageUrl,
                    bedrooms: values.bedrooms,
                    bathrooms: values.bathrooms, 
                    area: values.area, 
                    propertyType: values.propertyType, 
                    usageType: values.usageType, 
                    interior: values.interior,
                    postedDate: values.postedDate,
                };
    
                const response = await fetch(`/api/properties/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData),
                });
    
                console.log('Response Status:', response.status);
                console.log('Response:', await response.clone().text());
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.log('Errors:', errorData.errors);
                    message.error('Cập nhật không thành công. Vui lòng kiểm tra thông tin.');
                    return;
                }
    
                message.success('Cập nhật thành công!');
                fetchProperty();
                setEditing(false);
            } catch (error) {
                console.error('Error:', error);
                message.error('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } else {
            message.error('Bạn không có quyền chỉnh sửa bất động sản này.');
        }
    };
    

    const handleCreateRental = () => {
        if (userRole === 'Tenant') {
            navigate(`/add-rental`,{ state: { propertyId: id } }); // Truyền id qua state
        } else {
            message.error('Bạn không có quyền tạo hợp đồng.');
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            message.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        const commentData = {
            propertyId: id,
            userId: userId,
            content: newComment
        };

        const response = await fetch(`/api/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            const newCommentFromServer = await response.json();
            setComments([...comments, newCommentFromServer]);
            setNewComment(''); // Clear input field
            message.success('Bình luận đã được gửi');
        } else {
            message.error('Gửi bình luận thất bại');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {property ? (
                <Card title="Chi tiết Bất động sản" bordered={true} style={{ maxWidth: '600px', margin: 'auto' }}>
                <img
                    src={property.imageUrl}
                    alt={property.title}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
                <h3>{property.title}</h3>
                <p><strong>Giá:</strong> {property.price} VNĐ</p>
                <p><strong>Diện tích:</strong> {property.area} m²</p>
                <p><strong>Phòng ngủ:</strong> {property.bedrooms}</p>
                <p><strong>Phòng tắm:</strong> {property.bathrooms}</p>
                <p><strong>Địa chỉ:</strong> {property.address}, {ward}, {district}, {province}</p>
                <p><strong>Mô tả:</strong> {property.description}</p>
                <p><strong>Loại bất động sản:</strong> {property.usageType}</p>
                <p><strong>Loại hình sử dụng:</strong> {property.propertyType}</p>
                <p><strong>Tình trạng nội thất:</strong> {property.interior}</p>
                <p><strong>Thời gian đăng:</strong> {dayjs(property.postedDate).format('DD/MM/YYYY HH:mm')} 
                   <br />({dayjs(property.postedDate).fromNow()})</p>

                <div style={{ marginTop: '20px' }}>
                    {userRole === 'Owner' && (
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            onClick={() => setEditing(!editing)}
                            style={{ marginRight: '10px' }}
                        >
                            {editing ? 'Hủy' : 'Chỉnh sửa'}
                        </Button>
                    )}

                    {userRole === 'Manager' && (
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    )}

                    {userRole === 'Tenant' && (
                        <Button type="primary" onClick={handleCreateRental}>
                            Tạo hợp đồng thuê
                        </Button>
                    )}
                </div>

                {editing && (
                    <Form form={form} onFinish={handleUpdate} layout="vertical" style={{ marginTop: '20px' }}>
                        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Nhập giá' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="interior" label="Tình trạng nội thất" rules={[{ required: true, message: 'Hãy chọn tình trạng nội thất' }]}>
                        <Select placeholder="Chọn tình trạng nội thất">
                            <Option value="Nội thất cơ bản">Nội thất cơ bản</Option>
                            <Option value="Nội thất cao cấp">Nội thất cao cấp</Option>
                            <Option value="Không có nội thất">Không có nội thất</Option>
                        </Select>
                        </Form.Item>
                        <Form.Item name="title" hidden={true}></Form.Item>
                        <Form.Item name="address" hidden={true}></Form.Item>
                        <Form.Item name="imageUrl" hidden={true}></Form.Item>
                        <Form.Item name="propertyType" hidden={true}></Form.Item>
                        <Form.Item name="usageType" hidden={true}></Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                <h3>Bình luận</h3>
            <div>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.id} style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                            <img
                                src={comment.avatar} 
                                alt="Avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                            />
                            <div style={{ fontWeight: 'bold' }}>{comment.userName}</div>
                        </div>
                        <div style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '8px', flexGrow: 1 }}>
                            {comment.content}
                        </div>
                    </div>
                ))
                ) : (
                    <p>Chưa có bình luận.</p>
                )}
            </div>

            {/* Form thêm bình luận */}
            <Form layout="inline" onFinish={handleCommentSubmit} style={{ marginTop: '20px' }}>
                <Form.Item>
                    <Input.TextArea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={2}
                        style={{ width: '400px' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi bình luận
                    </Button>
                </Form.Item>
            </Form>
            </Card>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PropertyDetail;
